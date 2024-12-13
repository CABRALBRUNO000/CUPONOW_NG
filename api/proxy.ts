import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const target = 'https://api.lomadee.com';
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(200).end();
    return;
  }

  const proxyOptions: Options = {
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/v3'
    }
  };

  createProxyMiddleware(proxyOptions)(req, res);
}

