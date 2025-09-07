/**
 * Next.js Instrumentation
 * This file runs when the Next.js server starts
 * Perfect for initializing background tasks like our listings sync
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only run on server-side
    console.log('[Instrumentation] Initializing server...');
    
    try {
      // Dynamic import to avoid issues with edge runtime
      const { listingsCache } = await import('./lib/listings-cache');
      
      // Start auto-sync
      listingsCache.startAutoSync();
      
      console.log('[Instrumentation] Listings auto-sync initialized');
      
      // Log initial status
      const status = listingsCache.getStatus();
      console.log('[Instrumentation] Initial cache status:', status);
      
    } catch (error) {
      console.error('[Instrumentation] Failed to initialize listings sync:', error);
    }
  }
}
