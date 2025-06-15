
// Google Gemini API Types for AstraAI Integration

export interface GeminiGenerateRequest {
  prompt: string;
  context?: string;
  options?: GeminiGenerationOptions;
}

export interface GeminiGenerationOptions {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxTokens?: number;
}

export interface GeminiGenerateResponse {
  id: string;
  content: string;
  model: 'gemini-1.5-flash';
  usage: {
    promptTokens: number;
    candidatesTokens: number;
    totalTokens: number;
  };
  finishReason: 'STOP' | 'MAX_TOKENS' | 'SAFETY' | 'RECITATION' | 'OTHER';
  createdAt: string;
}

export interface GeminiProcessingJob {
  id: string;
  type: 'gemini_generation' | 'gemini_analysis' | 'gemini_chat';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  input: GeminiGenerateRequest;
  output?: GeminiGenerateResponse;
  progress?: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface GeminiModelInfo {
  name: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  supportedGenerationMethods: string[];
  temperature: number;
  topP: number;
  topK: number;
}
