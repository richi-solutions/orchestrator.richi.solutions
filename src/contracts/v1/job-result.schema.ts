import { z } from 'zod';

export const TargetResultSchema = z.object({
  target: z.string(),
  status: z.enum(['success', 'failure', 'skipped']),
  output: z.string().optional(),
  error: z.string().optional(),
});

export const JobResultSchema = z.object({
  jobName: z.string(),
  jobType: z.string(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  durationMs: z.number(),
  status: z.enum(['success', 'partial', 'failure']),
  targets: z.array(z.string()),
  results: z.array(TargetResultSchema),
  summary: z.string().optional(),
});

export type TargetResult = z.infer<typeof TargetResultSchema>;
export type JobResult = z.infer<typeof JobResultSchema>;
