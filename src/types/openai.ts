
export interface OpenAIConfiguration {
  id: string;
  user_id: string;
  name: string;
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  system_prompt?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OpenAIUsageLog {
  id: string;
  user_id: string;
  configuration_id?: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd: number;
  request_type: string;
  status: string;
  error_message?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface OpenAIGenerateRequest {
  prompt: string;
  configurationId?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system_prompt?: string;
}

export interface OpenAIGenerateResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  cost_usd: number;
}

export interface OpenAIProcessingJob {
  id: string;
  type: 'text_generation' | 'chat_completion' | 'content_analysis';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  input: OpenAIGenerateRequest;
  output?: OpenAIGenerateResponse;
  progress: number;
  error?: string;
  createdAt: string;
  completedAt?: string;
}
