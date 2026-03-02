import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import { ClaudePort, ClaudeRequest, ClaudeResponse } from './claude.port';
import { Result, success, failure } from '../lib/result';
import { logger } from '../lib/logger';

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

export class ClaudeAdapter implements ClaudePort {
  private client: Anthropic;
  private defaultModel: string;

  constructor(apiKey: string, defaultModel: string) {
    this.client = new Anthropic({ apiKey });
    this.defaultModel = defaultModel;
  }

  async complete(request: ClaudeRequest): Promise<Result<ClaudeResponse>> {
    const traceId = uuidv4();
    const model = request.model ?? this.defaultModel;
    const maxTokens = request.maxTokens ?? 4096;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await this.client.messages.create({
          model,
          max_tokens: maxTokens,
          system: request.systemPrompt,
          messages: [{ role: 'user', content: request.userMessage }],
        });

        const content = response.content
          .filter((block): block is Anthropic.TextBlock => block.type === 'text')
          .map((block) => block.text)
          .join('\n');

        logger.info('claude_complete', {
          traceId,
          model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          attempt,
        });

        return success({
          content,
          model: response.model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        });
      } catch (err: unknown) {
        const isRetryable =
          err instanceof Anthropic.APIError &&
          (err.status === 429 || err.status >= 500);

        if (isRetryable && attempt < MAX_RETRIES) {
          const delay = RETRY_BASE_MS * Math.pow(2, attempt - 1);
          logger.warn('claude_retry', { traceId, attempt, delay, status: (err as InstanceType<typeof Anthropic.APIError>).status });
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        logger.error('claude_complete_failed', err, { traceId, model, attempt });
        return failure('CLAUDE_ERROR', `Claude API call failed after ${attempt} attempts`, traceId);
      }
    }

    return failure('CLAUDE_ERROR', 'Exhausted retries', traceId);
  }
}
