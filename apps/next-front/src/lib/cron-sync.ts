// This file sets up a cron job for environments that don't support Vercel crons
// You can use this with node-cron package or similar

export async function setupListingsSync() {
  if (typeof window !== 'undefined') {
    // Don't run on client side
    return;
  }

  const syncInterval = 10 * 60 * 1000; // 10 minutes in milliseconds
  
  // Function to sync listings
  const syncListings = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/sync-listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      console.log(`[Cron Sync] ${new Date().toISOString()}:`, result.message);
    } catch (error) {
      console.error(`[Cron Sync Error] ${new Date().toISOString()}:`, error);
    }
  };

  // Initial sync on startup
  syncListings();
  
  // Set up interval
  setInterval(syncListings, syncInterval);
  
  console.log('[Cron Sync] Listings sync scheduled every 10 minutes');
}

// Alternative implementation using node-cron (requires: npm install node-cron @types/node-cron)
export async function setupListingsSyncWithNodeCron() {
  try {
    // @ts-ignore - optional dependency
    const cron = await import('node-cron');
    
    // Schedule task to run every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${baseUrl}/api/sync-listings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const result = await response.json();
        console.log(`[Node-Cron Sync] ${new Date().toISOString()}:`, result.message);
      } catch (error) {
        console.error(`[Node-Cron Sync Error] ${new Date().toISOString()}:`, error);
      }
    });
    
    console.log('[Node-Cron] Listings sync scheduled every 10 minutes');
  } catch (error) {
    console.log('[Node-Cron] Package not installed, falling back to setInterval');
    setupListingsSync();
  }
}
