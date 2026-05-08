import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/health', (_: Request, res: Response) => {
  res.json({ status: 'ok', service: 'zarixsol-bridge', version: '0.1.0' });
});

export default router;
