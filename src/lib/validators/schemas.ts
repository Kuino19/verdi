/**
 * Zod Validation Schemas for API Requests
 */

import { z } from 'zod';

// Auth Schemas
export const SessionSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

// AI/Chat Schemas
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(10000),
});

export const AIRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(20),
  type: z.enum(['assistant', 'summarize', 'exam']).optional().default('assistant'),
});

// Flashcard Schemas
export const FlashcardGenerateSchema = z.object({
  text: z.string().min(10).max(50000),
  count: z.number().int().min(1).max(50).optional().default(5),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
});

// Exam Schemas
export const ExamGenerateSchema = z.object({
  text: z.string().min(10).max(50000),
  questionCount: z.number().int().min(1).max(100).optional().default(5),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
  questionType: z.enum(['essay', 'mcq', 'mixed']).optional().default('mcq'),
});

// Planner Schemas
export const PlannerRequestSchema = z.object({
  topic: z.string().min(1).max(500),
  duration: z.number().int().min(1).max(360).optional(),
  syllabus: z.string().min(1).max(10000).optional(),
});

// OCR Schemas
export const OCRSchema = z.object({
  language: z.string().optional().default('en'),
});

// Profile Update Schema
export const UpdateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  university: z.string().min(1).max(200).optional(),
  bio: z.string().max(500).optional(),
});

// Admin Case Creation Schema
export const CreateCaseSchema = z.object({
  title: z.string().min(5).max(500),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  court: z.string().min(1).max(200),
  judges: z.array(z.string()).optional(),
  facts: z.string().min(10).max(50000),
  issues: z.string().min(10).max(50000),
  ruleOfLaw: z.string().min(10).max(50000),
  application: z.string().min(10).max(50000),
  decision: z.string().min(10).max(50000),
  citation: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type AIRequest = z.infer<typeof AIRequestSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type FlashcardGenerate = z.infer<typeof FlashcardGenerateSchema>;
export type ExamGenerate = z.infer<typeof ExamGenerateSchema>;
export type PlannerRequest = z.infer<typeof PlannerRequestSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
export type CreateCase = z.infer<typeof CreateCaseSchema>;
