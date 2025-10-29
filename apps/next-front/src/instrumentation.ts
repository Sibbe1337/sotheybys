/**
 * Next.js Instrumentation
 * 
 * 🏗️ NEW ARCHITECTURE: No cache initialization needed
 * Properties are now fetched on-demand using Clean Architecture use cases
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] ✅ Server initialized with Clean Architecture');
    console.log('[Instrumentation] Properties will be fetched on-demand via use cases');
  }
}
