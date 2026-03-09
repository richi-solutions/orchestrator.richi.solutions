import { describe, it, expect } from 'vitest';
import { success, failure } from './result';

describe('result utilities', () => {
  describe('success', () => {
    it('returns ok: true with data', () => {
      const result = success({ id: '123' });
      expect(result.ok).toBe(true);
      expect(result.data).toEqual({ id: '123' });
    });

    it('works with primitive data', () => {
      const result = success(42);
      expect(result.ok).toBe(true);
      expect(result.data).toBe(42);
    });

    it('works with null data', () => {
      const result = success(null);
      expect(result.ok).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe('failure', () => {
    it('returns ok: false with error code and message', () => {
      const result = failure('NOT_FOUND', 'Item not found', 'trace-1');
      expect(result.ok).toBe(false);
      expect(result.error.code).toBe('NOT_FOUND');
      expect(result.error.message).toBe('Item not found');
      expect(result.traceId).toBe('trace-1');
    });
  });
});
