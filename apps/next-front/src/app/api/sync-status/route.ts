import { NextResponse } from 'next/server';
import { listingsCache } from '@/lib/listings-cache';

export async function GET() {
  try {
    const status = listingsCache.getStatus();
    const listings = listingsCache.getListings();
    
    // Group listings by status
    const listingsByStatus = listings.reduce((acc, listing) => {
      const status = listing.status?.fi?.value || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Get recent listings (published in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentListings = listings.filter(listing => {
      const publishDate = listing.publishDate?.fi?.value;
      if (!publishDate) return false;
      return new Date(publishDate) > sevenDaysAgo;
    }).map(listing => ({
      identifier: listing.identifier?.fi?.value || listing.identifier,
      address: listing.address?.fi?.value,
      publishDate: listing.publishDate?.fi?.value,
      price: listing.askPrice?.fi?.value
    }));
    
    return NextResponse.json({
      success: true,
      cacheStatus: status,
      statistics: {
        totalListings: listings.length,
        listingsByStatus,
        recentListingsCount: recentListings.length,
        recentListings: recentListings.slice(0, 10) // Show max 10 recent
      },
      syncConfiguration: {
        syncInterval: '10 minutes',
        cacheEnabled: true,
        apiEndpoint: process.env.LINEAR_API_URL || 'Not configured'
      }
    });
  } catch (error) {
    console.error('[Sync Status API] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get sync status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
