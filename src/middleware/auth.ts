import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getEnv } from '../config/env';

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const env = getEnv();

  const provided = req.headers['x-api-key'];

  if (!provided || provided !== env.SERVICE_API_KEY) {
    res.status(401).json({
      ok: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid X-API-Key header.' },
      traceId: uuidv4(),
    });
    return;
  }

  next();
}
