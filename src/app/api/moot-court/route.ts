export const dynamic = "force-dynamic";
import { AiVault } from "@/lib/ai/vault";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify session
    try {
      await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, scenario } = await req.json();

    const systemPrompt = `You are a strict but fair Justice of the Supreme Court of Nigeria presiding over a Mock Trial (Moot Court).
    Scenario: ${scenario || "General Criminal Law case"}
    
    Current phase: Trial.
    User's Role: Defense Counsel or Prosecution.
    
    Your goal is to:
    1. Listen to the user's legal arguments.
    2. Challenge them on specific Nigerian statutes or case law (e.g. Evidence Act, Administration of Criminal Justice Act, or famous precedents like Donoghue v Stevenson).
    3. Be authoritative, use formal legal language ("Counsel," "My Lord," "The court observes").
    4. Maintain a high academic standard.
    
    When concluding, provide a "Verdi Verdict" summary including:
    - Strengths of Argument
    - Weaknesses / Legal Gaps
    - Final XP Awarded (Logic: 0-100 based on quality of legal reasoning).
    
    If the user asks for a scenario, provide a highly interesting Nigerian legal problem (e.g. Land dispute, Election petition, or Fundamental Human Rights).`;

    const content = await AiVault.execute([
      { role: "system", content: systemPrompt },
      ...messages
    ], {
      type: "moot-court",
      temperature: 0.6,
      maxTokens: 2000,
    });

    return NextResponse.json({
      content: content || "The court is currently in recess.",
    });

  } catch (error: any) {
    console.error("Moot Court API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
