/**
 * Listings Cache Manager
 * Manages caching and automatic synchronization of Linear API listings
 */

import { LinearAPIListing } from './linear-api-adapter';
import { convertCompleteLinearToWordPressFormat } from './linear-api-complete-converter';
import { CompleteLinearAPIListing } from './linear-api-complete-interface';
import { hasMarketingContent } from './marketing-content';
import { generateSlug } from './utils';
import { mapLinearAPIToProperty } from './linear-api-to-property-mapper';
import { MultilingualPropertyListing } from './property-types-multilang';

interface CacheData {
  listings: CompleteLinearAPIListing[];
  lastSyncTime: Date;
  syncInProgress: boolean;
}

class ListingsCache {
  private static instance: ListingsCache;
  private cache: CacheData = {
    listings: [],
    lastSyncTime: new Date(0), // Initialize with epoch
    syncInProgress: false
  };
  
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL = 10 * 60 * 1000; // 10 minutes
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  private constructor() {}

  static getInstance(): ListingsCache {
    if (!ListingsCache.instance) {
      ListingsCache.instance = new ListingsCache();
    }
    return ListingsCache.instance;
  }

  /**
   * Initialize automatic syncing
   */
  startAutoSync() {
    // Initial sync
    this.syncListings();
    
    // Set up interval if not already running
    if (!this.syncInterval) {
      this.syncInterval = setInterval(() => {
        this.syncListings();
      }, this.SYNC_INTERVAL);
      
      console.log('[ListingsCache] Auto-sync started - syncing every 10 minutes');
    }
  }

  /**
   * Stop automatic syncing
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('[ListingsCache] Auto-sync stopped');
    }
  }

  /**
   * Manually trigger a sync
   */
  async syncListings(): Promise<void> {
    if (this.cache.syncInProgress) {
      console.log('[ListingsCache] Sync already in progress, skipping...');
      return;
    }

    try {
      this.cache.syncInProgress = true;
      console.log(`[ListingsCache] Starting sync at ${new Date().toISOString()}`);
      
      // Use the proxy route to avoid CORS issues and keep credentials secure
      // The proxy handles authentication and company ID headers server-side
      const isServer = typeof window === 'undefined';
      const baseUrl = isServer 
        ? (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
        : '';
      const endpoint = `${baseUrl}/api/proxy/listings?lang=fi`;
      
      console.log(`[ListingsCache] Fetching from proxy: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Proxy request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const listings = await response.json();
      
      this.cache.listings = listings;
      this.cache.lastSyncTime = new Date();
      
      console.log(`[ListingsCache] Sync completed. Found ${listings.length} listings`);
      
      // Log summary for monitoring
      const summary = listings.map((l: CompleteLinearAPIListing) => ({
        id: l.identifier?.fi?.value || l.identifier,
        address: l.address?.fi?.value,
        status: l.status?.fi?.value
      }));
      console.log('[ListingsCache] Listings summary:', summary);
      
    } catch (error) {
      console.error('[ListingsCache] Sync error:', error);
      throw error;
    } finally {
      this.cache.syncInProgress = false;
    }
  }

  /**
   * Get all cached listings
   */
  getListings(): CompleteLinearAPIListing[] {
    return this.cache.listings;
  }

  /**
   * Get cached listings in WordPress format
   */
  getWordPressFormattedListings(language: 'fi' | 'sv' | 'en' = 'fi') {
    return this.cache.listings.map(listing => convertCompleteLinearToWordPressFormat(listing));
  }

  /**
   * Get a single listing by ID
   */
  getListingById(id: string): CompleteLinearAPIListing | undefined {
    return this.cache.listings.find(listing => 
      listing.id?.fi?.value === id
    );
  }

  /**
   * Get a single listing by identifier (kohdenumero)
   */
  getListingByIdentifier(identifier: string): CompleteLinearAPIListing | undefined {
    return this.cache.listings.find(listing => {
      const listingIdentifier = listing.identifier?.fi?.value || (listing.identifier as any);
      return listingIdentifier == identifier; // Using == for type coercion
    });
  }

  /**
   * Get a single listing by slug (address-based)
   */
  getListingBySlug(slug: string): CompleteLinearAPIListing | undefined {
    return this.cache.listings.find(listing => {
      const address = listing.address?.fi?.value;
      if (!address) {
        return false;
      }
      
      const generatedSlug = generateSlug(address);
      
      return generatedSlug === slug;
    });
  }

  /**
   * Get a single listing by slug in WordPress format with marketing content
   */
  getConvertedListingBySlug(slug: string, language: 'fi' | 'sv' | 'en' = 'fi') {
    const listing = this.getListingBySlug(slug);
    return listing ? convertCompleteLinearToWordPressFormat(listing) : null;
  }

  /**
   * Get a single listing by slug in multilingual format (NEW)
   */
  getMultilingualListingBySlug(slug: string): MultilingualPropertyListing | null {
    const listing = this.getListingBySlug(slug);
    return listing ? mapLinearAPIToProperty(listing as any) : null;
  }

  /**
   * Get all listings in multilingual format (NEW)
   */
  getMultilingualListings(): MultilingualPropertyListing[] {
    return this.cache.listings.map(listing => mapLinearAPIToProperty(listing as any));
  }

  /**
   * Check if cache needs refresh
   */
  needsRefresh(): boolean {
    const now = new Date();
    const timeSinceLastSync = now.getTime() - this.cache.lastSyncTime.getTime();
    return timeSinceLastSync > this.CACHE_DURATION;
  }

  /**
   * Get cache status
   */
  getStatus() {
    return {
      listingsCount: this.cache.listings.length,
      lastSyncTime: this.cache.lastSyncTime,
      syncInProgress: this.cache.syncInProgress,
      autoSyncActive: this.syncInterval !== null,
      needsRefresh: this.needsRefresh()
    };
  }
}

// Export singleton instance
export const listingsCache = ListingsCache.getInstance();

// Helper function to ensure cache is initialized
export async function ensureCacheInitialized() {
  const cache = ListingsCache.getInstance();
  const status = cache.getStatus();
  
  if (status.listingsCount === 0 || status.needsRefresh) {
    await cache.syncListings();
  }
  
  return cache;
}
