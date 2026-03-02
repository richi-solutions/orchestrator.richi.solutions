import { z } from 'zod';

export const JobTypeSchema = z.enum(['sweep', 'aggregate', 'chain', 'provision']);

export const TargetFilterSchema = z.record(z.string(), z.union([z.boolean(), z.string()]));

export const TargetsSchema = z.union([
  z.literal('all'),
  z.array(TargetFilterSchema),
]);

export const JobDefinitionSchema = z.object({
  cron: z.string(),
  type: JobTypeSchema,
  targets: TargetsSchema.optional().default('all'),
  depends_on: z.string().optional(),
  agent: z.string().optional(),
  timeout_ms: z.number().optional().default(120_000),
});

export const ScheduleConfigSchema = z.object({
  jobs: z.record(z.string(), JobDefinitionSchema),
});

export type JobType = z.infer<typeof JobTypeSchema>;
export type JobDefinition = z.infer<typeof JobDefinitionSchema>;
export type ScheduleConfig = z.infer<typeof ScheduleConfigSchema>;
