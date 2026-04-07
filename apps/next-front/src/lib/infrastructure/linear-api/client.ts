import { log, warn } from '@/lib/logger';
import { LinearListing } from './types';

export class LinearAPIClient {
  constructor(
    private baseUrl: string,
    private apiKey?: string,
    private companyId?: string
  ) {}

  async fetchListings(): Promise<LinearListing[]> {
    const start = Date.now();
    try {
      const endpoint = `${this.baseUrl}/v2/listings?languages[]=fi&languages[]=sv&languages[]=en`;

      const headers: Record<string, string> = {
        Authorization: this.apiKey?.startsWith('LINEAR-API-KEY ')
          ? this.apiKey
          : `LINEAR-API-KEY ${this.apiKey}`,
        accept: 'application/json',
      };
      if (this.companyId) headers['x-company-id'] = this.companyId;

      const response = await fetch(endpoint, { headers, cache: 'no-store' });
      if (!response.ok) {
        warn('Linear API error:', response.status, response.statusText);
        return [];
      }

      const data = await response.json();

      const listings: LinearListing[] = Array.isArray(data)
        ? data
        : data?.data?.[0]?.listings ?? data?.listings ?? (Array.isArray(data?.data) ? data.data : []);

      log(`Fetched ${listings.length} listings from Linear (${Date.now() - start}ms)`);
      return listings;
    } catch (error) {
      warn('Error fetching Linear listings:', error);
      return [];
    }
  }

  async fetchListingBySlug(slug: string): Promise<LinearListing | null> {
    try {
      const listings = await this.fetchListings();
      const found = listings.find((l) => {
        const address = typeof l.address === 'string' ? l.address : (l.address as any)?.fi?.value ?? '';
        return l.slug === slug || this.generateSlug(address) === slug;
      });
      return found ?? null;
    } catch (error) {
      warn('Error fetching listing by slug:', error);
      return null;
    }
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
