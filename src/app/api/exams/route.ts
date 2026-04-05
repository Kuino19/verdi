export const dynamic = "force-dynamic";
import { AiVault } from "@/lib/ai/vault";
import { ExamGenerateSchema } from "@/lib/validators/schemas";
import { validateSessionCookie } from "@/lib/api/auth-middleware";
import { handleError, createSuccessResponse } from "@/lib/errors/handler";
import { AppError } from "@/lib/errors/AppError";
import { adminDb } from "@/lib/firebase/admin";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    // Validate session
    const authData = await validateSessionCookie(req as any);
    if (!authData) {
      throw AppError.unauthorized("Session expired or invalid");
    }

    const uid = authData.uid;
    const body = await req.json();

    // Validate request payload with defaults
    const validatedData = ExamGenerateSchema.parse(body);
    const { text, questionCount = 5, difficulty = "medium", questionType = "mcq" } = validatedData;
    
    // Check Premium status / Rate limit
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw AppError.notFound("User profile not found");
    }

    const data = userDoc.data();
    const isPremium = !!data?.isPremium;
    
    if (!isPremium) {
      const today = new Date().toISOString().split("T")[0];
      const examUsage = data?.examUsage || { date: today, count: 0 };
      
      if (examUsage.date !== today) {
        examUsage.date = today;
        examUsage.count = 1;
        await userRef.update({ examUsage });
      } else if (examUsage.count >= 2) {
        throw AppError.tooManyRequests(
          "Rate limit exceeded",
          "You have reached your limit of 2 free exams per day. Upgrade to Premium for unlimited access."
        );
      } else {
        examUsage.count += 1;
        await userRef.update({ examUsage });
      }
    }

    const systemInstruction = `You are a strict Nigerian University Law Professor (LL.B. level) generating a ${questionType} mock exam.
Difficulty: ${difficulty}.
Generate exactly ${questionCount} highly challenging questions. 
Emulate rigorous exams from UNILAG, UI, OAU, UNN. 
Return ONLY a valid JSON array of objects.
Keys: "question", "options" (4 strings), "answer" (0-3), "explanation" (citing Nigerian statutes/cases).`;

    const messages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: `Generate ${questionCount} questions based on this text:\n\n${text}` }
    ];

    const rawContent = await AiVault.execute(messages, {
      type: "exam",
      temperature: 0.6,
    });

    let quizData;
    try {
      const parsed = JSON.parse(rawContent);
      quizData = Array.isArray(parsed) ? parsed : (parsed.quiz || parsed.questions || parsed.exams || Object.values(parsed).find(Array.isArray) || []);
      
      if (!Array.isArray(quizData) || quizData.length === 0) {
        throw new Error("No questions generated");
      }
    } catch (e) {
      throw AppError.badRequest(
        "Failed to parse exam data",
        e instanceof Error ? e.message : "Invalid JSON from AI"
      );
    }

    logger.info("Exam generated successfully", { uid, count: quizData.length, difficulty, requestId });
    return createSuccessResponse({
      quiz: quizData.slice(0, questionCount),
    }, 200);

  } catch (error) {
    logger.error("Exam API Error", { 
      error: error instanceof Error ? error.message : String(error), 
      requestId 
    });
    return handleError(error, requestId);
  }
}