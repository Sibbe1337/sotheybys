import { log, warn } from '@/lib/logger';
import { LinearListing } from './types';

export class LinearAPIClient {
  private slugIndex: Map<string, string> = new Map(); // slug → id mapping

  constructor(private baseUrl: string, private apiKey?: string) {}

  async fetchListings(): Promise<LinearListing[]> {
    try {
      const endpoint = `${this.baseUrl}/v2/listings?languages[]=fi`;
      
      log('Fetching listings from:', endpoint);
      
      const response = await fetch(endpoint, {
        headers: {
          'authorization': this.apiKey || '',
          'Accept': 'application/json'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      });

      if (!response.ok) {
        warn('Linear API error:', response.status, response.statusText);
        return [];
      }

      const data = await response.json();
      const listings = Array.isArray(data) ? data : [];
      
      // Build slug index for faster lookup
      this.buildSlugIndex(listings);
      
      log(`Fetched ${listings.length} listings`);
      
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

