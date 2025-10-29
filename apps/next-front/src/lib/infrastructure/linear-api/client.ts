import { log, warn } from '@/lib/logger';
import { LinearListing } from './types';

export class LinearAPIClient {
  private slugIndex: Map<string, string> = new Map(); // slug → id mapping

  constructor(
    private baseUrl: string, 
    private apiKey?: string,
    private companyId?: string
  ) {}

  async fetchListings(): Promise<LinearListing[]> {
    try {
      const endpoint = `${this.baseUrl}/v2/listings?languages[]=fi`;
      
      log('🔥 LINEAR CLIENT: Starting fetch from:', endpoint);
      log('🔥 BASE URL:', this.baseUrl);
      log('🔥 API KEY exists:', !!this.apiKey);
      log('🔥 COMPANY ID exists:', !!this.companyId);
      
      // Format API key properly
      const formattedApiKey = this.apiKey?.startsWith('LINEAR-API-KEY ') 
        ? this.apiKey 
        : `LINEAR-API-KEY ${this.apiKey}`;
      
      const headers: Record<string, string> = {
        'Authorization': formattedApiKey,
        'accept': 'application/json'
      };
      
      // Add company ID if provided
      if (this.companyId) {
        headers['x-company-id'] = this.companyId;
      }
      
      log('Fetching with headers:', { 
        Authorization: formattedApiKey.substring(0, 25) + '...',
        'x-company-id': this.companyId ? `${this.companyId.substring(0, 4)}****` : 'NOT SET'
      });
      
      const response = await fetch(endpoint, {
        headers,
        next: { revalidate: 300 } // Cache for 5 minutes
      });

      if (!response.ok) {
        warn('Linear API error:', response.status, response.statusText);
        return [];
      }

      const data = await response.json();
      
      // Debug: Log what we actually received
      log('Linear API response type:', typeof data);
      log('Is array?', Array.isArray(data));
      log('Has data property?', !!data?.data);
      log('Sample structure:', JSON.stringify(data).substring(0, 200));
      
      // Linear API returns: { success: true, data: [{ listings: [...] }] }
      // OR just an array: [...]
      // Handle both formats
      let listings: LinearListing[] = [];
      
      if (Array.isArray(data)) {
        // Direct array format
        log('✅ Using direct array format');
        listings = data;
      } else if (data?.data?.[0]?.listings) {
        // Nested format: { data: [{ listings: [...] }] }
        log('✅ Using nested format: data[0].listings');
        listings = data.data[0].listings;
      } else if (data?.listings) {
        // Alternative: { listings: [...] }
        log('✅ Using wrapped format: data.listings');
        listings = data.listings;
      } else if (data?.data && Array.isArray(data.data)) {
        // Another alternative: { data: [...] }
        log('✅ Using semi-wrapped format: data.data');
        listings = data.data;
      } else {
        warn('❌ Unknown Linear API response format!', typeof data);
      }
      
      // Build slug index for faster lookup
      this.buildSlugIndex(listings);
      
      log(`🎉 FINAL RESULT: Fetched ${listings.length} listings from Linear API`);
      log(`🎉 First listing ID:`, listings[0]?.id || listings[0]?.nonLocalizedValues?.id || 'NO ID');
      
      return listings;
    } catch (error) {
      warn('Error fetching Linear listings:', error);
      return [];
    }
  }

  async fetchListingBySlug(slug: string): Promise<LinearListing | null> {
    // TODO: Replace with direct API endpoint when available
    // Current implementation fetches all and filters (MVP only)
    // Consider: /v2/listings?slug={slug} or use slugIndex
    
    try {
      const listings = await this.fetchListings();
      
      // Use slug index if available
      if (this.slugIndex.has(slug)) {
        const id = this.slugIndex.get(slug);
        const found = listings.find((l: any) => String(l.id || l.nonLocalizedValues?.id) === id);
        if (found) {
          log('Found listing by slug index:', slug);
          return found;
        }
      }
      
      // Fallback: generate slug and match
      const found = listings.find((l: any) => {
        const address = typeof l.address === 'string' ? l.address : l.address?.fi?.value || '';
        const generatedSlug = this.generateSlug(address);
        return generatedSlug === slug || l.slug === slug;
      });
      
      if (found) {
        log('Found listing by slug match:', slug);
      } else {
        log('Listing not found for slug:', slug);
      }
      
      return found || null;
    } catch (error) {
      warn('Error fetching listing by slug:', error);
      return null;
    }
  }

  private buildSlugIndex(listings: LinearListing[]): void {
    this.slugIndex.clear();
    
    listings.forEach((listing: any) => {
      const id = String(listing.id || listing.nonLocalizedValues?.id || '');
      const slug = listing.slug || this.generateSlug(
        typeof listing.address === 'string' ? listing.address : listing.address?.fi?.value || ''
      );
      
      if (id && slug) {
        this.slugIndex.set(slug, id);
      }
    });
    
    log('Built slug index with', this.slugIndex.size, 'entries');
  }

  private generateSlug(address: string): string {
    return address
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/å/g, 'a')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

