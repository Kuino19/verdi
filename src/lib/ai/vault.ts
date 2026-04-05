import { createHash } from "node:crypto";
import { groq } from "@/lib/groq/client";
import { getVertexModel } from "@/lib/vertex/client";
import { adminDb } from "@/lib/firebase/admin";
import { logger } from "@/lib/logger";

/**
 * AI Vault: The Hardened Execution Layer
 * Handles: Semantic Caching, Failover to Gemini, and Rate Limiting.
 */

interface AiOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  type?: "assistant" | "exam" | "summarize" | "moot-court";
  forceRefresh?: boolean;
}

export class AiVault {
  private static CACHE_COLLECTION = "ai_responses";
  private static METRICS_DOC = "METRICS/ai_usage";

  /**
   * Generates a stable hash for the content and options to use as a cache key.
   */
  private static generateHash(messages: any[], options: AiOptions): string {
    const data = JSON.stringify({ messages, type: options.type, model: options.model });
    return createHash("sha256").update(data).digest("hex");
  }

  /**
   * Intentional delay to "drip-feed" requests and stay under RPM limits.
   * Uses a global tracker in Firestore for cross-worker coordination.
   */
  private static async respectRateLimits(): Promise<void> {
    const metricsRef = adminDb.doc(this.METRICS_DOC);
    
    try {
      // In a high-traffic scenario, we would use a Redis lock.
      // For now, we use a simple "wait-and-update" pattern.
      const now = Date.now();
      const doc = await metricsRef.get();
      const lastRequest = doc.data()?.lastRequestAt || 0;
      
      // Throttle: Ensure at least 1.5 seconds between global calls to stay under free tier RPM
      const waitTime = Math.max(0, 1500 - (now - lastRequest));
      
      if (waitTime > 0) {
        logger.info(`Rate limit drip-feed: Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      await metricsRef.set({ lastRequestAt: Date.now() }, { merge: true });
    } catch (e) {
      logger.warn("Rate limit tracker failed - proceeding cautiously", { error: String(e) });
    }
  }

  /**
   * Streaming version of AI execution.
   * Yields text chunks and saves to cache upon completion.
   */
  static async *executeStream(messages: any[], options: AiOptions = {}): AsyncGenerator<string> {
    const hash = this.generateHash(messages, options);

    // 1. Check Cache
    if (!options.forceRefresh) {
      try {
        const cacheRef = adminDb.collection(this.CACHE_COLLECTION).doc(hash);
        const cacheDoc = await cacheRef.get();
        if (cacheDoc.exists) {
          logger.info("AiVault Stream: Cache HIT", { hash, type: options.type });
          const fullText = cacheDoc.data()?.response || "";
          
          // Simulate streaming for cached content to maintain UI feel
          const words = fullText.split(" ");
          for (let i = 0; i < words.length; i++) {
            yield words[i] + (i === words.length - 1 ? "" : " ");
            // Small variable delay for "natural" feel
            await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
          }
          return;
        }
      } catch (e) {
        logger.error("AiVault Cache Read Error", { error: String(e) });
      }
    }

    // 2. Drip-Feed Rate Limiting
    await this.respectRateLimits();

    // 3. Primary: Try Groq Streaming
    let fullResponse = "";
    let provider = "groq";

    try {
      logger.info("AiVault Stream: Calling Groq (Primary)", { type: options.type });
      
      const stream = await groq.chat.completions.create({
        messages: messages,
        model: options.model || "llama-3.3-70b-versatile",
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          yield content;
        }
      }
    } catch (error: any) {
      const isRateLimit = error?.status === 429 || String(error).includes("429");
      logger.warn(`AiVault Stream: Groq Failed (${isRateLimit ? "429 Rate Limit" : "Error"})`, { 
        error: error instanceof Error ? error.message : String(error) 
      });

      // 4. Failover: Try Gemini Streaming
      if (isRateLimit || error?.status >= 500) {
        logger.info("AiVault Stream: FAILOVER to Gemini (Secondary)");
        provider = "gemini";
        try {
          const model = getVertexModel("gemini-1.5-flash");
          const flatPrompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
          const result = await model.generateContentStream(flatPrompt);
          
          for await (const chunk of result.stream) {
            const content = chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (content) {
              fullResponse += content;
              yield content;
            }
          }
        } catch (failoverError) {
          logger.error("AiVault Stream: Failover Failed", { error: String(failoverError) });
        }
      }
    }

    if (!fullResponse) {
      const err = "AiVault Stream: All AI providers failed.";
      yield err;
      throw new Error(err);
    }

    // 5. Save to Cache
    try {
      await adminDb.collection(this.CACHE_COLLECTION).doc(hash).set({
        hash,
        response: fullResponse,
        provider,
        type: options.type || "unknown",
        createdAt: new Date().toISOString(),
      });
      logger.info("AiVault Stream: Cache SAVED", { hash });
    } catch (e) {
      logger.error("AiVault Cache Save Error", { error: String(e) });
    }
  }

  /**
   * The primary execution entry point (Non-streaming).
   */
  static async execute(messages: any[], options: AiOptions = {}): Promise<string> {
    const hash = this.generateHash(messages, options);

    // 1. Check Cache
    if (!options.forceRefresh) {
      try {
        const cacheRef = adminDb.collection(this.CACHE_COLLECTION).doc(hash);
        const cacheDoc = await cacheRef.get();
        if (cacheDoc.exists) {
          logger.info("AiVault: Cache HIT", { hash, type: options.type });
          return cacheDoc.data()?.response || "";
        }
      } catch (e) {
        logger.error("AiVault Cache Read Error", { error: String(e) });
      }
    }

    // 2. Drip-Feed Rate Limiting
    await this.respectRateLimits();

    // 3. Primary: Try Groq
    let response: string | null = null;
    let provider = "groq";

    try {
      logger.info("AiVault: Calling Groq (Primary)", { type: options.type });
      
      const chatCompletion = await groq.chat.completions.create({
        messages: messages,
        model: options.model || "llama-3.3-70b-versatile",
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
        response_format: options.type === "assistant" ? undefined : { type: "json_object" },
      });

      response = chatCompletion.choices[0]?.message?.content || null;
    } catch (error: any) {
      const isRateLimit = error?.status === 429 || String(error).includes("429");
      logger.warn(`AiVault: Groq Failed (${isRateLimit ? "429 Rate Limit" : "Error"})`, { 
        error: error instanceof Error ? error.message : String(error) 
      });

      // 4. Failover: Try Gemini (Vertex AI)
      if (isRateLimit || error?.status >= 500) {
        logger.info("AiVault: FAILOVER to Gemini (Secondary)");
        provider = "gemini";
        try {
          const model = getVertexModel("gemini-1.5-flash");
          const flatPrompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
          const result = await model.generateContent(flatPrompt);
          response = result.response.candidates?.[0]?.content?.parts?.[0]?.text || null;
        } catch (failoverError) {
          logger.error("AiVault: Failover Failed", { error: String(failoverError) });
        }
      }
    }

    if (!response) {
      throw new Error("AiVault: All AI providers failed to return a response.");
    }

    // 5. Save to Cache
    try {
      await adminDb.collection(this.CACHE_COLLECTION).doc(hash).set({
        hash,
        response,
        provider,
        type: options.type || "unknown",
        createdAt: new Date().toISOString(),
      });
      logger.info("AiVault: Cache SAVED", { hash });
    } catch (e) {
      logger.error("AiVault Cache Save Error", { error: String(e) });
    }

    return response;
  }
}
