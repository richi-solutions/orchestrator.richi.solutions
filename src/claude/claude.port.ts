import { Result } from '../lib/result';

export interface ClaudeRequest {
  systemPrompt: string;
  userMessage: string;
  model?: string;
  maxTokens?: number;
}

export interface ClaudeResponse {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export interface ClaudePort {
  complete(request: ClaudeRequest): Promise<Result<ClaudeResponse>>;
}
