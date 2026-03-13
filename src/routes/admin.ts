/**
 * @fileoverview Admin API routes for querying job run history.
 *
 * Provides GET /api/job-runs with optional ?job= and ?limit= query params.
 * Requires X-API-Key authentication.
 *
 * @module routes/admin
 */

import { Router, Request, Response } from 'express';
import { requireApiKey } from '../middleware/auth';
import { StorePort } from '../store/store.port';

/**
 * Creates the admin router with GET /api/job-runs.
 *
 * @param store - StorePort for querying job run history
 * @returns Express Router with admin endpoints
 */
export function createAdminRouter(store: StorePort): Router {
  const router = Router();

  router.get('/api/job-runs', requireApiKey, async (req: Request, res: Response) => {
    const jobName = req.query.job as string | undefined;
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const result = await store.listJobRuns({ jobName, limit });

    if (!result.ok) {
      res.status(500).json({ ok: false, error: result.error });
      return;
    }

    res.json({ ok: true, data: { runs: result.data } });
  });

  return router;
}
