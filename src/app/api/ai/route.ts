export const dynamic = "force-dynamic";
import { AiVault } from "@/lib/ai/vault";
import { AIRequestSchema } from "@/lib/validators/schemas";
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

    // Validate request payload
    const validatedData = AIRequestSchema.parse(body);
    const { messages, type = "assistant" } = validatedData;

    // Check user subscription and rate limiting
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw AppError.notFound("User profile not found");
    }

    const userData = userDoc.data();
    const isPremium = !!userData?.isPremium;
    
    if (!isPremium) {
      // Daily rate limit logic for FREE tier
      const today = new Date().toISOString().split("T")[0];
      const aiUsage = userData?.aiUsage || { date: today, count: 0 };
      
      if (aiUsage.date !== today) {
        aiUsage.date = today;
        aiUsage.count = 1;
        await userRef.update({ aiUsage });
      } else if (aiUsage.count >= 50) {
        throw AppError.tooManyRequests(
          "Rate limit exceeded",
          "You have reached your limit of 50 free daily AI queries. Upgrade to Premium for unlimited access."
        );
      } else {
        aiUsage.count += 1;
        await userRef.update({ aiUsage });
      }
    }

    let systemPrompt = "You are VERDI, a premium legal AI assistant for Nigerian law students. Be professional, academically rigorous, and helpful. Use Nigerian legal precedents where applicable.";

    if (type === "summarize") {
      systemPrompt = `You are VERDI CaseFlow, an expert Nigerian appellate court summarizer. 
Return a strictly formatted summary of the requested case using exactly these Markdown headings:
## Facts
## Issues
## Rule of Law
## Application / Legal Reasoning
## Decision / Conclusion
Ensure the summary is highly academic, cites any supporting Nigerian laws or precedents mentioned in the judgment, and is clear and easy for a student to study.`;
    } else if (type === "exam") {
      systemPrompt = "You are an expert Nigerian law lecturer. Generate high-quality mock exam questions based on the provided text. Mirror the style of Nigerian university law exams.";
    }

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }))
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const aiStream = AiVault.executeStream(groqMessages, {
            type: type as any,
            temperature: 0.7,
            maxTokens: 2048,
          });

          for await (const chunk of aiStream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          logger.error("Streaming Error", { error: String(error) });
          controller.error(error);
        }
      },
    });

    logger.info("AI streaming request started", { uid, type, requestId });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    logger.error("AI API Error", { error: error instanceof Error ? error.message : String(error), requestId });
    return handleError(error, requestId);
  }
}
