import fs from 'fs';
import { parse } from 'yaml';
import { ScheduleConfigSchema, ScheduleConfig } from '../contracts/v1/schedule.schema';
import { logger } from '../lib/logger';

export function loadSchedule(path: string): ScheduleConfig {
  if (!fs.existsSync(path)) {
    logger.error('schedule_not_found', new Error(`Schedule file not found: ${path}`));
    process.exit(1);
  }

  const raw = fs.readFileSync(path, 'utf-8');
  const parsed = parse(raw);
  const result = ScheduleConfigSchema.safeParse(parsed);

  if (!result.success) {
    logger.error('schedule_invalid', result.error, { path });
    process.exit(1);
  }

  logger.info('schedule_loaded', { path, jobCount: Object.keys(result.data.jobs).length });
  return result.data;
}
