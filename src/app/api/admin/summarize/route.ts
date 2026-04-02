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

    // Verify admin session
    let decodedClaims;
    try {
      decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const uid = decodedClaims.uid;
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.data()?.isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { caseId } = await req.json();
    if (!caseId) {
      return NextResponse.json({ error: "Missing caseId" }, { status: 400 });
    }

    // Fetch raw case data
    const caseRef = adminDb.collection("cases").doc(caseId);
    const caseSnap = await caseRef.get();

    if (!caseSnap.exists) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const caseData = caseSnap.data();
    const fullText = caseData?.fullText;

    if (!fullText) {
      return NextResponse.json({ error: "No raw text found to summarize" }, { status: 422 });
    }

    const systemInstruction = `Analyze this raw legal judgment and provide a structured summary.
    Return ONLY a valid JSON object.
    JSON Keys: "summary", "facts", "issues", "reasoning", "decision", "subject", "topic", "landmark" (boolean).`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Judgment Text:\n${fullText.substring(0, 15000)}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    });

    const groqData = await groqRes.json();
    let rawContent = groqData.choices[0]?.message?.content || "{}";
    
    let structuredData;
    try {
      structuredData = JSON.parse(rawContent);
    } catch (e) {
      console.error("Groq Summarizer parsing error", rawContent);
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }

    // Update Firestore
    await caseRef.update({
      ...structuredData,
      processed: true,
      processedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, data: structuredData });

  } catch (error: any) {
    console.error("Summarize API Error:", error);
    
    const statusCode = error.status || 500;
    let message = error.message || "An unexpected error occurred during summarization.";
    
    if (statusCode === 429) {
      message = "AI Rate Limit Hit: Please wait a few seconds and try again.";
    }

    return NextResponse.json({ 
      error: message,
      details: error.errorDetails || null 
    }, { status: statusCode });
  }
}
