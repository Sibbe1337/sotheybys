import { NextResponse } from 'next/server';
import { 
  getCachedListings, 
  getLastSyncTime, 
  setSyncData, 
  isSyncInProgress, 
  setSyncInProgress 
} from '@/lib/sync-cache';

export async function GET(request: Request) {
  // Check if sync is already in progress
  if (isSyncInProgress()) {
    return NextResponse.json({ 
      message: 'Sync already in progress',
      lastSyncTime: getLastSyncTime(),
      listingsCount: getCachedListings().length
    });
  }

  try {
    setSyncInProgress(true);
    
    // Direct API call
    const apiUrl = process.env.LINEAR_API_URL || 'https://linear-external-api.azurewebsites.net/api';
    const apiKey = process.env.LINEAR_API_KEY?.replace('LINEAR-API-KEY ', '') || '';
    const companyId = process.env.LINEAR_COMPANY_ID || '180';
    
    console.log(`[${new Date().toISOString()}] Starting Linear API sync...`);
    
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.replace('/api', '') : apiUrl;
    const endpoint = `${baseUrl}/v2/listings?languages[]=fi`;
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `LINEAR-API-KEY ${apiKey}`,
        'X-Company-Id': companyId,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const listings = await response.json();
    
    // Update cache
    setSyncData(listings, new Date());
    
    console.log(`[${new Date().toISOString()}] Sync completed. Found ${listings.length} listings.`);
    
    // Log property identifiers for monitoring
    const identifiers = listings.map((listing: any) => ({
      id: listing.identifier?.fi?.value || listing.identifier,
      address: listing.address?.fi?.value,
      status: listing.status?.fi?.value
    }));
    
    return NextResponse.json({
      success: true,
      message: 'Sync completed successfully',
      lastSyncTime: getLastSyncTime(),
      listingsCount: listings.length,
      identifiers,
      listings: process.env.NODE_ENV === 'development' ? listings : undefined // Only return full data in dev
    });
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Sync error:`, error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to sync listings',
      message: error instanceof Error ? error.message : 'Unknown error',
      lastSyncTime: getLastSyncTime(),
      cachedListingsCount: getCachedListings().length
    }, { status: 500 });
  } finally {
    setSyncInProgress(false);
  }
}

// POST endpoint to manually trigger sync
export async function POST(request: Request) {
  // Allow manual trigger
  return GET(request);
}
