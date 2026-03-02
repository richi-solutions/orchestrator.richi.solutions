import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireApiKey } from '../middleware/auth';
import { Scheduler } from '../scheduler/scheduler';

export function createTriggerRouter(scheduler: Scheduler): Router {
  const router = Router();

  router.post('/api/trigger/:jobName', requireApiKey, (req: Request, res: Response) => {
    const { jobName } = req.params;

    const triggered = scheduler.triggerManually(jobName);

    if (!triggered) {
      res.status(404).json({
        ok: false,
        error: { code: 'JOB_NOT_FOUND', message: `Job "${jobName}" not found.` },
        traceId: uuidv4(),
      });
      return;
    }

    res.json({
      ok: true,
      data: { jobName, message: `Job "${jobName}" triggered.` },
    });
  });

  router.get('/api/jobs', requireApiKey, (_req: Request, res: Response) => {
    res.json({
      ok: true,
      data: { jobs: scheduler.getJobNames() },
    });
  });

  return router;
}
