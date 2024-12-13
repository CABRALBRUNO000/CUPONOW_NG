import type { VercelRequest, VercelResponse } from '@vercel/node';
import proxy from 'express-http-proxy';
import { NextFunction } from 'express';

export default function handler(req: VercelRequest, res: VercelResponse, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(200).end();
    return;
  }

  return proxy('https://api.lomadee.com', {
    proxyReqPathResolver: (req) => {
      return req.url.replace('/api', '/v3');
    }
  })(req as any, res as any, next);
}