import { Router, Request, Response } from 'express';
import { SystemDetector } from '@zarixsol/core';
import { Installer } from '@zarixsol/core';
import type { AIProviderConfig, SystemDeps } from '@zarixsol/core';

const router: Router = Router();

router.get('/detect', async (_: Request, res: Response) => {
  try {
    const detector = new SystemDetector();
    const deps: SystemDeps = await detector.detect();
    res.json({ ok: true, deps });
  } catch (err) {
    res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

router.post('/install', async (req: Request, res: Response) => {
  try {
    const { tool } = req.body as { tool: string };
    const installer = new Installer();
    switch (tool) {
      case 'pnpm':
        await installer.installPnpm();
        break;
      case 'opencode':
        await installer.installOpenCode();
        break;
      default:
        return res.status(400).json({ ok: false, error: `Unknown tool: ${tool}` });
    }
    res.json({ ok: true, message: `${tool} installed successfully` });
  } catch (err) {
    res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

router.post('/workspace', async (req: Request, res: Response) => {
  try {
    const { dir } = req.body as { dir: string };
    const installer = new Installer();
    await installer.createWorkspace(dir);
    res.json({ ok: true, message: `Workspace created at ${dir}` });
  } catch (err) {
    res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

router.post('/providers', async (req: Request, res: Response) => {
  try {
    const { providers } = req.body as { providers: AIProviderConfig[] };
    for (const p of providers) {
      if (p.apiKey) {
        const { execSync } = await import('child_process');
        execSync(`opencode providers set --provider ${p.provider} --key "${p.apiKey}"`, { stdio: 'pipe' });
      }
    }
    res.json({ ok: true, message: 'Providers configured' });
  } catch (err) {
    res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

export default router;
