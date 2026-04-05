/**
 * Firestore Database Schema Types
 */

export interface User {
  uid: string;
  email: string;
  full_name?: string;
  university?: string;
  isPremium: boolean;
  streak: number;
  points: number;
  createdAt: string;
  lastActive?: string;
  activityLog?: string[];
  aiUsage?: AIUsageData;
  isAdmin?: boolean;
}

export interface AIUsageData {
  date: string;
  count: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  updatedAt?: string;
  dueDate?: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category?: string;
  createdAt: string;
  tags?: string[];
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  lastReviewedAt?: string;
  reviewCount?: number;
}

export interface Case {
  id: string;
  title: string;
  year: number;
  court: string;
  judges?: string[];
  facts?: string;
  issues?: string;
  ruleOfLaw?: string;
  application?: string;
  decision?: string;
  citation?: string;
  tags?: string[];
  links?: {
    caseId: string;
    caseName: string;
    type: 'overrules' | 'overruled_by' | 'follows' | 'followed_by' | 'distinguished' | 'cited';
  }[];
  processed?: boolean;
  vetted?: boolean;
  subject?: string;
  scrapedAt?: string;
  createdAt: string;
}

export interface Leaderboard {
  id: string;
  full_name: string;
  points: number;
  streak: number;
  university: string;
  rank?: number;
}
