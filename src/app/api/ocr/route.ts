export const dynamic = "force-dynamic";
import { getVertexModel } from "@/lib/vertex/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify session
    let decodedClaims;
    try {
      decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const uid = decodedClaims.uid;
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const isAdmin = userDoc.data()?.isAdmin || false;

    const { file, mimeType, type } = await req.json();

    if (!file || !mimeType || !type) {
      return NextResponse.json({ error: "Missing required fields: file, mimeType, type" }, { status: 400 });
    }

    // Use Stable 1.5 Flash on Vertex AI
    const model = getVertexModel("gemini-1.5-flash");

    let prompt = "";
    
    if (type === "exam") {
      prompt = "Extract all text from this exam paper. Identify the Course Title, Year, University, and list the Questions clearly. Format as Markdown.";
    } else if (type === "note") {
      prompt = "Extract the text from these study notes. Preserve the structure (headings, bullet points) as much as possible. If it's handwritten, do your best to transcribe it accurately. Format as Markdown.";
    } else if (type === "case") {
      if (!isAdmin) {
        return NextResponse.json({ error: "Only admins can upload case PDFs" }, { status: 403 });
      }
      prompt = `Extract the key details from this legal judgment/case report. 
      Return the result in a STRICT JSON format with these exact keys:
      {
        "title": "Case Name",
        "citation": "Legal Citation",
        "subject": "e.g. Tort Law, Criminal Law",
        "topic": "Specific legal topic",
        "year": "Year of judgment",
        "summary": "One sentence summary",
        "facts": "Detailed facts of the case",
        "issues": "Main legal issues identified",
        "reasoning": "The court's legal reasoning",
        "decision": "Final verdict/ruling",
        "landmark": true/false
      }`;
    }

    // Vertex AI Multimodal Request
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: file,
              mimeType: mimeType
            }
          }
        ]
      }]
    });

    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("Empty response from Vertex AI OCR");
    }

    // For case type, try to parse JSON
    if (type === "case") {
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
        const caseData = JSON.parse(jsonStr);
        return NextResponse.json({ data: caseData });
      } catch (e) {
        console.error("AI returned invalid JSON for case:", responseText);
        return NextResponse.json({ error: "AI failed to produce structured data", raw: responseText }, { status: 422 });
      }
    }

    return NextResponse.json({ content: responseText });

  } catch (error: any) {
    console.error("Vertex OCR API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
