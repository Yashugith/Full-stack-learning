// src/types/index.ts

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  isStreaming?: boolean;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  messages?: ChatMessage[];
}

export interface DashboardStats {
  totalConversations: number;
  totalMessages: number;
  conversationsThisWeek: number;
  messagesThisWeek: number;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  contextLength: number;
}

// All FREE models via Groq API (console.groq.com)
export const AI_MODELS: AIModel[] = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    description: "Most capable free model — best for complex tasks, coding, analysis",
    contextLength: 128000
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B",
    description: "Ultra fast — great for quick questions and everyday tasks",
    contextLength: 128000
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    description: "Excellent for coding, technical writing and long documents",
    contextLength: 32768
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B",
    description: "Google model — great for balanced, accurate responses",
    contextLength: 8192
  }
];
