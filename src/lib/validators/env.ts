/**
 * Environment Variable Validation
 */

import { z } from 'zod';

const EnvSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Firebase (Public)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  
  // Firebase Admin (Secret)
  FIREBASE_SERVICE_ACCOUNT_KEY: z.string().optional(),
  FIREBASE_ADMIN_SDK_PATH: z.string().optional(),
  
  // AI Models
  GROQ_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  GOOGLE_VERTEX_AI_KEY: z.string().optional(),
});

type Environment = z.infer<typeof EnvSchema>;

export function validateEnv(): Environment {
  try {
    const env = EnvSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(e => e.code === 'invalid_type')
        .map(e => e.path.join('.'))
        .join(', ');
      
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}. Check your .env.local file.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
