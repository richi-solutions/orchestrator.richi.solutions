/**
 * @fileoverview Result type and constructor utilities for error-envelope pattern.
 *
 * All service operations return Result<T> instead of throwing exceptions.
 * Callers discriminate by checking `result.ok` before accessing `result.data`.
 *
 * @module lib/result
 */

/** Represents a successful operation. */
export interface Success<T> {
  ok: true;
  data: T;
}

/** Represents a failed operation with a structured error and trace ID. */
export interface Failure {
  ok: false;
  error: { code: string; message: string };
  traceId: string;
}

/**
 * Discriminated union returned by all service operations.
 * Check `result.ok` before accessing `result.data`.
 */
export type Result<T> = Success<T> | Failure;

/**
 * Wraps a value in a success result.
 *
 * @param data - The successful return value
 * @returns Success envelope
 *
 * @example
 * return success({ id: 'abc123' });
 */
export function success<T>(data: T): Success<T> {
  return { ok: true, data };
}

/**
 * Creates a failure result with a structured error.
 *
 * @param code - Machine-readable error code (e.g. 'GITHUB_ERROR')
 * @param message - Human-readable error description
 * @param traceId - UUID for correlating this failure across logs
 * @returns Failure envelope
 *
 * @example
 * return failure('GITHUB_ERROR', 'Failed to list repos', uuidv4());
 */
export function failure(code: string, message: string, traceId: string): Failure {
  return { ok: false, error: { code, message }, traceId };
}
