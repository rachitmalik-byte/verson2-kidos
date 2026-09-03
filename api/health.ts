import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hasApiKey = !!process.env.GEMINI_API_KEY || !!process.env.VITE_GEMINI_API_KEY;

  res.status(200).json({
    status: 'ok',
    environment: process.env.VERCEL_ENV || 'development',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    hasApiKey
  });
}
