import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to check environment variable configuration
 * 
 * ⚠️ SECURITY: Remove this endpoint in production or add authentication!
 */
export async function GET() {
  const BASE = process.env.LINEAR_EXTERNAL_BASE ?? 'https://linear-external-api.azurewebsites.net';
  const COMPANY_ID = process.env.COMPANY_ID ?? process.env.LINEAR_COMPANY_ID;
  const API_KEY = process.env.LINEAR_API_KEY;
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL || '(not set)',
      VERCEL_ENV: process.env.VERCEL_ENV || '(not set)',
    },
    linearApi: {
      BASE: BASE,
      COMPANY_ID: COMPANY_ID ? `${COMPANY_ID.substring(0, 4)}****` : '❌ NOT SET',
      API_KEY: API_KEY 
        ? {
            set: true,
            length: API_KEY.length,
            hasPrefix: API_KEY.startsWith('LINEAR-API-KEY '),
            preview: `${API_KEY.substring(0, 20)}...${API_KEY.substring(API_KEY.length - 4)}`
          }
        : '❌ NOT SET',
    },
    alternativeEnvVars: {
      LINEAR_COMPANY_ID: process.env.LINEAR_COMPANY_ID ? `${process.env.LINEAR_COMPANY_ID.substring(0, 4)}****` : '(not set)',
      LINEAR_EXTERNAL_BASE: process.env.LINEAR_EXTERNAL_BASE || '(not set)',
    },
    recommendations: []
  };
  
  // Add recommendations based on findings
  if (!COMPANY_ID) {
    diagnostics.recommendations.push('⚠️ Set COMPANY_ID or LINEAR_COMPANY_ID in Vercel environment variables');
  }
  
  if (!API_KEY) {
    diagnostics.recommendations.push('⚠️ Set LINEAR_API_KEY in Vercel environment variables');
  } else if (!API_KEY.startsWith('LINEAR-API-KEY ')) {
    diagnostics.recommendations.push('ℹ️ API key will be auto-prefixed with "LINEAR-API-KEY "');
  }
  
  return NextResponse.json(diagnostics, {
    headers: {
      'cache-control': 'no-store, max-age=0'
    }
  });
}

