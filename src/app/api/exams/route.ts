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

    let decodedClaims;
    try {
      decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic = "General Nigerian Law", numQuestions = 5 } = await req.json();
    const uid = decodedClaims.uid;
    
    // Check Premium status / Rate limit
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();
    let isPremium = false;

    if (userDoc.exists) {
      const data = userDoc.data();
      isPremium = !!data?.isPremium;
      
      if (!isPremium) {
        const today = new Date().toISOString().split("T")[0];
        const examUsage = data?.examUsage || { date: today, count: 0 };
        
        if (examUsage.date !== today) {
          examUsage.date = today;
          examUsage.count = 1;
          await userRef.update({ examUsage });
        } else {
          if (examUsage.count >= 2) { // 2 free exams per day
            return NextResponse.json({ 
              error: "Rate limit exceeded", 
              details: "You have reached your limit of 2 free exams per day. Upgrade to Premium for unlimited access." 
            }, { status: 429 });
          } else {
            examUsage.count += 1;
            await userRef.update({ examUsage });
          }
        }
      }
    }

    const systemInstruction = `You are a strict Nigerian University Law Professor (LL.B. level) generating a multiple-choice mock exam on the topic: ${topic}.
Generate exactly ${numQuestions} highly challenging questions. 
Emulate rigorous exams from UNILAG, UI, OAU, UNN. 
Return ONLY a valid JSON array of objects.
Keys: "question", "options" (4 strings), "answer" (0-3), "explanation" (citing Nigerian statutes/cases).`;

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
          { role: "user", content: `Generate ${numQuestions} questions on ${topic}.` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.6
      })
    });

    const groqData = await groqRes.json();
    let rawContent = groqData.choices[0]?.message?.content || "{}";
    
    let quizData;
    try {
       const parsed = JSON.parse(rawContent);
       quizData = Array.isArray(parsed) ? parsed : (parsed.quiz || parsed.questions || parsed.exams || Object.values(parsed).find(Array.isArray) || []);
    } catch (e) {
       console.error("Groq Exam parsing error", rawContent);
       return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }

    return NextResponse.json({
      quiz: quizData.slice(0, numQuestions),
    });

  } catch (error: any) {
    console.error("Exam API Error Details:", error);
    return NextResponse.json({ 
      error: "Failed to generate exam",
      details: error.message 
    }, { status: 500 });
  }
}
