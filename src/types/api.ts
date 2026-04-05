/**
 * API Request/Response Types
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIRequest {
  messages: ChatMessage[];
  type?: 'assistant' | 'summarize' | 'exam';
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  statusCode: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface AuthSession {
  uid: string;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}

export interface FlashcardGenerateRequest {
  text: string;
  count?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ExamGenerateRequest {
  text: string;
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionType?: 'essay' | 'mcq' | 'mixed';
}

export interface OCRRequest {
  file: File | Blob;
  language?: string;
}

export interface OCRResponse {
  text: string;
  confidence?: number;
  blocks?: Array<{
    text: string;
    confidence: number;
    bounds?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
}
