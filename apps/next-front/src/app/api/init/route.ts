import { NextResponse } from 'next/server';
import { listingsCache } from '@/lib/listings-cache';

// This endpoint initializes the cache and starts auto-sync
export async function GET() {
  try {
    // Get cache status
    const statusBefore = listingsCache.getStatus();
    
    // Start auto-sync if not already running
    if (!statusBefore.autoSyncActive) {
      listingsCache.startAutoSync();
    }
    
    // Wait for initial sync if needed
    if (statusBefore.listingsCount === 0) {
      await listingsCache.syncListings();
    }
    
    const statusAfter = listingsCache.getStatus();
    
    return NextResponse.json({
      success: true,
      message: 'Listings cache initialized',
      status: statusAfter
    });
  } catch (error) {
    console.error('[Init API] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to initialize listings cache',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Also handle POST requests
export async function POST() {
  return GET();
}
