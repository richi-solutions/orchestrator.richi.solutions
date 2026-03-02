export interface LogContext {
  traceId?: string;
  [key: string]: unknown;
}

function format(level: string, event: string, ctx?: LogContext, error?: unknown): string {
  const entry: Record<string, unknown> = { level, event, ts: Date.now(), ...ctx };
  if (error instanceof Error) {
    entry.error = error.message;
    entry.stack = error.stack;
  } else if (error !== undefined) {
    entry.error = String(error);
  }
  return JSON.stringify(entry);
}

export const logger = {
  info(event: string, ctx?: LogContext): void {
    console.log(format('info', event, ctx));
  },
  warn(event: string, ctx?: LogContext): void {
    console.warn(format('warn', event, ctx));
  },
  error(event: string, error: unknown, ctx?: LogContext): void {
    console.error(format('error', event, ctx, error));
  },
};
