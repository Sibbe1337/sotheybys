/**
 * Linear API Configuration
 * 
 * Provides fallback URLs if environment variables are not set
 * This ensures the app works even without manual Vercel env configuration
 */

// Default Linear API URL (production)
// This is the actual Linear External API endpoint
// NOTE: Do NOT include /api suffix - client adds /v2/listings
const DEFAULT_LINEAR_API_URL = 'https://linear-external-api.azurewebsites.net';

// Alternative test endpoint (if needed)
// const TEST_LINEAR_API_URL = 'https://ca-externalapi-test-weu-001.livelyrock-4a193af6.westeurope.azurecontainerapps.io';

/**
 * Get Linear API URL with fallback
 * Priority: NEXT_PUBLIC_LINEAR_API_URL > LINEAR_API_URL > DEFAULT
 */
export function getLinearAPIUrl(): string {
  return (
    process.env.NEXT_PUBLIC_LINEAR_API_URL ||
    process.env.LINEAR_API_URL ||
    DEFAULT_LINEAR_API_URL
  );
}

/**
 * Get Linear API Key
 * Note: This MUST be set in Vercel environment variables
 */
export function getLinearAPIKey(): string | undefined {
  return process.env.NEXT_PUBLIC_LINEAR_API_KEY || process.env.LINEAR_API_KEY;
}

/**
 * Get Linear Company ID
 * Note: This MUST be set in Vercel environment variables
 */
export function getLinearCompanyId(): string | undefined {
  return process.env.NEXT_PUBLIC_COMPANY_ID || process.env.COMPANY_ID || process.env.LINEAR_COMPANY_ID;
}

/**
 * Check if Linear API is configured
 */
export function isLinearAPIConfigured(): boolean {
  return !!(getLinearAPIKey() && getLinearCompanyId());
}

