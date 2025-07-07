import { LinearClient, IssueConnection } from '@linear/sdk';
import { Redis } from 'upstash-redis';

export interface LinearClientConfig {
  apiKey: string;
  redisUrl?: string;
  redisToken?: string;
  cacheTimeToLive?: number; // in seconds, default 300 (5 minutes)
}

export interface PropertyListing {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'sold' | 'pending';
  price?: number;
  location?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface LinearSyncResult {
  success: boolean;
  count: number;
  error?: string;
  lastSyncAt: Date;
}

export class CachedLinearClient {
  private client: LinearClient;
  private redis?: Redis;
  private cacheTimeToLive: number;

  constructor(config: LinearClientConfig) {
    this.client = new LinearClient({
      apiKey: config.apiKey,
    });

    if (config.redisUrl && config.redisToken) {
      this.redis = new Redis({
        url: config.redisUrl,
        token: config.redisToken,
      });
    }

    this.cacheTimeToLive = config.cacheTimeToLive || 300; // 5 minutes default
  }

  /**
   * Get all property listings with optional caching
   */
  async getListings(options?: {
    useCache?: boolean;
    limit?: number;
    status?: string;
  }): Promise<PropertyListing[]> {
    const { useCache = true, limit = 50, status } = options || {};
    const cacheKey = `listings:${limit}:${status || 'all'}`;

    // Try cache first if enabled
    if (useCache && this.redis) {
      try {
        const cached = await this.redis.get<PropertyListing[]>(cacheKey);
        if (cached) {
          return cached;
        }
      } catch (error) {
        console.warn('Redis cache read error:', error);
      }
    }

    try {
      // Fetch from Linear API
      // Note: This is a simplified example - you'll need to adapt based on Linear's actual API structure
      const response = await this.client.issues({
        first: limit,
        filter: status ? { state: { name: { eq: status } } } : undefined,
      });

      const listings = this.transformLinearIssuesToListings(response);

      // Cache the result if Redis is available
      if (this.redis && useCache) {
        try {
          await this.redis.setex(cacheKey, this.cacheTimeToLive, listings);
        } catch (error) {
          console.warn('Redis cache write error:', error);
        }
      }

      return listings;
    } catch (error) {
      console.error('Error fetching listings from Linear:', error);
      throw new Error('Failed to fetch listings');
    }
  }

  /**
   * Get a single listing by ID
   */
  async getListing(id: string, useCache = true): Promise<PropertyListing | null> {
    const cacheKey = `listing:${id}`;

    // Try cache first if enabled
    if (useCache && this.redis) {
      try {
        const cached = await this.redis.get<PropertyListing>(cacheKey);
        if (cached) {
          return cached;
        }
      } catch (error) {
        console.warn('Redis cache read error:', error);
      }
    }

    try {
      const issue = await this.client.issue(id);
      if (!issue) {
        return null;
      }

      const listing = this.transformLinearIssueToListing(issue);

      // Cache the result if Redis is available
      if (this.redis && useCache) {
        try {
          await this.redis.setex(cacheKey, this.cacheTimeToLive, listing);
        } catch (error) {
          console.warn('Redis cache write error:', error);
        }
      }

      return listing;
    } catch (error) {
      console.error('Error fetching listing from Linear:', error);
      return null;
    }
  }

  /**
   * Clear cache for all listings
   */
  async clearCache(): Promise<void> {
    if (!this.redis) {
      return;
    }

    try {
      const keys = await this.redis.keys('listings:*');
      const listingKeys = await this.redis.keys('listing:*');
      const allKeys = [...keys, ...listingKeys];

      if (allKeys.length > 0) {
        await this.redis.del(...allKeys);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Manually sync data from Linear and update cache
   */
  async syncFromLinear(): Promise<LinearSyncResult> {
    try {
      const listings = await this.getListings({ useCache: false });
      
      // Clear old cache
      await this.clearCache();

      return {
        success: true,
        count: listings.length,
        lastSyncAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastSyncAt: new Date(),
      };
    }
  }

  /**
   * Check connection health
   */
  async healthCheck(): Promise<{
    linear: boolean;
    cache: boolean;
    error?: string;
  }> {
    const result = {
      linear: false,
      cache: false,
      error: undefined as string | undefined,
    };

    // Test Linear connection
    try {
      await this.client.viewer;
      result.linear = true;
    } catch (error) {
      result.error = `Linear API error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    // Test Redis connection
    if (this.redis) {
      try {
        await this.redis.ping();
        result.cache = true;
      } catch (error) {
        result.error = result.error 
          ? `${result.error}, Redis error: ${error instanceof Error ? error.message : 'Unknown error'}`
          : `Redis error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    } else {
      result.cache = true; // No cache configured, so it's "healthy"
    }

    return result;
  }

  /**
   * Transform Linear issues to our PropertyListing format
   */
  private transformLinearIssuesToListings(response: IssueConnection): PropertyListing[] {
    return response.nodes.map(issue => this.transformLinearIssueToListing(issue));
  }

  /**
   * Transform a single Linear issue to PropertyListing
   */
  private transformLinearIssueToListing(issue: any): PropertyListing {
    // This is a simplified transformation - adapt based on Linear's actual data structure
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description || undefined,
      status: this.mapLinearStatusToListingStatus(issue.state?.name),
      price: this.extractPriceFromDescription(issue.description),
      location: this.extractLocationFromLabels(issue.labels?.nodes),
      images: this.extractImagesFromAttachments(issue.attachments?.nodes),
      createdAt: new Date(issue.createdAt),
      updatedAt: new Date(issue.updatedAt),
      metadata: {
        linearState: issue.state?.name,
        linearAssignee: issue.assignee?.name,
        linearTeam: issue.team?.name,
        linearUrl: issue.url,
      },
    };
  }

  private mapLinearStatusToListingStatus(linearStatus?: string): 'active' | 'sold' | 'pending' {
    if (!linearStatus) return 'active';
    
    const status = linearStatus.toLowerCase();
    if (status.includes('sold') || status.includes('closed')) return 'sold';
    if (status.includes('pending') || status.includes('in progress')) return 'pending';
    return 'active';
  }

  private extractPriceFromDescription(description?: string): number | undefined {
    if (!description) return undefined;
    
    // Simple regex to extract price - adapt based on your format
    const priceMatch = description.match(/€\s*(\d+(?:\s*\d+)*)/);
    if (priceMatch) {
      return parseInt(priceMatch[1].replace(/\s/g, ''), 10);
    }
    return undefined;
  }

  private extractLocationFromLabels(labels?: any[]): string | undefined {
    if (!labels) return undefined;
    
    // Look for location labels - adapt based on your labeling system
    const locationLabel = labels.find(label => 
      label.name.toLowerCase().includes('location') || 
      label.name.toLowerCase().includes('city')
    );
    
    return locationLabel?.name;
  }

  private extractImagesFromAttachments(attachments?: any[]): string[] {
    if (!attachments) return [];
    
    return attachments
      .filter(attachment => attachment.url && attachment.url.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      .map(attachment => attachment.url);
  }
}

// Export types and main class
export type { LinearClientConfig, PropertyListing, LinearSyncResult };
export { CachedLinearClient as default }; 