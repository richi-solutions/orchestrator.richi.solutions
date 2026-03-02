export interface Success<T> {
  ok: true;
  data: T;
}

export interface Failure {
  ok: false;
  error: { code: string; message: string };
  traceId: string;
}

export type Result<T> = Success<T> | Failure;

export function success<T>(data: T): Success<T> {
  return { ok: true, data };
}

export function failure(code: string, message: string, traceId: string): Failure {
  return { ok: false, error: { code, message }, traceId };
}
