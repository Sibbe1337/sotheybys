/**
 * Linear.fi API Client
 * Replaces opipro integration with Linear API for real estate data
 * Based on Linear.fi features: Kohteet, Liidit, CRM, Integraatiot
 */

import { useState, useEffect } from 'react';

// ===== TYPE DEFINITIONS =====

export interface LinearProperty {
  id: string;
  title: string;
  description?: string;
  price: number;
  address: string;
  city: string;
  postalCode: string;
  municipality?: string;
  region?: string;
  country: string;
  
  // Property details
  propertyType: 'kerrostalo' | 'rivitalo' | 'omakotitalo' | 'tontti' | 'liiketila';
  rooms: number;
  bedrooms?: number;
  bathrooms?: number;
  livingArea: number; // m²
  totalArea?: number; // m² (including balconies, etc.)
  buildYear?: number;
  condition?: string;
  
  // Status
  status: 'myynnissa' | 'varattu' | 'myyty' | 'poistettu';
  
  // Images and media
  images: LinearPropertyImage[];
  virtualTour?: string;
  floorPlan?: string;
  energyClass?: string;
  
  // Agent information
  agent?: LinearAgent;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  
  // Linear.fi specific fields
  linearId: string;
  viewCount?: number;
  inquiryCount?: number;
}

export interface LinearPropertyImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  title?: string;
  order: number;
  isMain: boolean;
}

export interface LinearAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  title?: string;
  company?: string;
  image?: string;
  description?: string;
  languages?: string[];
}

export interface LinearLead {
  id: string;
  propertyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  leadType: 'viewing' | 'inquiry' | 'callback' | 'offer';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinearSearchParams {
  city?: string;
  region?: string;
  propertyType?: LinearProperty['propertyType'];
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  maxRooms?: number;
  minLivingArea?: number;
  maxLivingArea?: number;
  minBuildYear?: number;
  maxBuildYear?: number;
  status?: LinearProperty['status'];
  limit?: number;
  offset?: number;
  sortBy?: 'price' | 'livingArea' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface LinearApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  error?: string;
}

// ===== LINEAR API CLIENT =====

class LinearApiClient {
  private baseUrl: string;
  private apiKey: string;
  private userAgent: string;

  constructor() {
    this.baseUrl = process.env.LINEAR_API_URL || 'https://api.linear.fi/v1';
    this.apiKey = process.env.LINEAR_API_KEY || '';
    this.userAgent = 'Sothebys-Linear-Integration/1.0';

    if (!this.apiKey) {
      throw new Error('LINEAR_API_KEY environment variable is required');
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<LinearApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Authorization': `${this.apiKey}`, // Linear API expects "LINEAR-API-KEY <key>" format, not Bearer
      'Content-Type': 'application/json',
      'User-Agent': this.userAgent,
      'Accept': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Linear API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Linear API request failed:', error);
      throw error;
    }
  }

  // ===== PROPERTY METHODS =====

  async getProperties(params?: LinearSearchParams): Promise<LinearApiResponse<LinearProperty[]>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/kohteet${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<LinearProperty[]>(endpoint);
  }

  async getProperty(id: string): Promise<LinearApiResponse<LinearProperty>> {
    return this.request<LinearProperty>(`/kohteet/${id}`);
  }

  async getFeaturedProperties(limit: number = 10): Promise<LinearApiResponse<LinearProperty[]>> {
    return this.request<LinearProperty[]>(`/kohteet/featured?limit=${limit}`);
  }

  async getPropertiesByAgent(agentId: string): Promise<LinearApiResponse<LinearProperty[]>> {
    return this.request<LinearProperty[]>(`/agentit/${agentId}/kohteet`);
  }

  async getPropertyImages(propertyId: string): Promise<LinearApiResponse<LinearPropertyImage[]>> {
    return this.request<LinearPropertyImage[]>(`/kohteet/${propertyId}/kuvat`);
  }

  // ===== AGENT METHODS =====

  async getAgents(): Promise<LinearApiResponse<LinearAgent[]>> {
    return this.request<LinearAgent[]>('/agentit');
  }

  async getAgent(id: string): Promise<LinearApiResponse<LinearAgent>> {
    return this.request<LinearAgent>(`/agentit/${id}`);
  }

  // ===== LEAD METHODS =====

  async createLead(lead: Omit<LinearLead, 'id' | 'createdAt' | 'updatedAt'>): Promise<LinearApiResponse<LinearLead>> {
    return this.request<LinearLead>('/liidit', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  }

  async getLeads(propertyId?: string): Promise<LinearApiResponse<LinearLead[]>> {
    const endpoint = propertyId ? `/liidit?propertyId=${propertyId}` : '/liidit';
    return this.request<LinearLead[]>(endpoint);
  }

  async updateLead(id: string, updates: Partial<LinearLead>): Promise<LinearApiResponse<LinearLead>> {
    return this.request<LinearLead>(`/liidit/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // ===== SEARCH & FILTERS =====

  async searchProperties(query: string, filters?: LinearSearchParams): Promise<LinearApiResponse<LinearProperty[]>> {
    const searchParams = new URLSearchParams({ q: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    return this.request<LinearProperty[]>(`/kohteet/search?${searchParams.toString()}`);
  }

  async getPropertyTypes(): Promise<LinearApiResponse<{ type: string; count: number }[]>> {
    return this.request<{ type: string; count: number }[]>('/kohteet/types');
  }

  async getCities(): Promise<LinearApiResponse<{ city: string; count: number }[]>> {
    return this.request<{ city: string; count: number }[]>('/kohteet/cities');
  }

  // ===== UTILITY METHODS =====

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.request<{ status: string }>('/health');
      return response.data.status === 'ok';
    } catch (error) {
      console.error('Linear API connection test failed:', error);
      return false;
    }
  }

  async getApiInfo(): Promise<LinearApiResponse<{ version: string; features: string[] }>> {
    return this.request<{ version: string; features: string[] }>('/info');
  }
}

// ===== SINGLETON INSTANCE =====

const linearApi = new LinearApiClient();

export default linearApi;

// ===== HELPER FUNCTIONS =====

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatArea = (area: number): string => {
  return `${area} m²`;
};

export const getPropertyTypeLabel = (type: LinearProperty['propertyType']): string => {
  const labels = {
    kerrostalo: 'Kerrostalo',
    rivitalo: 'Rivitalo',
    omakotitalo: 'Omakotitalo',
    tontti: 'Tontti',
    liiketila: 'Liiketila',
  };
  return labels[type] || type;
};

export const getStatusLabel = (status: LinearProperty['status']): string => {
  const labels = {
    myynnissa: 'Myynnissä',
    varattu: 'Varattu',
    myyty: 'Myyty',
    poistettu: 'Poistettu',
  };
  return labels[status] || status;
};

// ===== REACT HOOKS (if using in React components) =====

export const useLinearProperties = (params?: LinearSearchParams) => {
  const [properties, setProperties] = useState<LinearProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await linearApi.getProperties(params);
        setProperties(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [JSON.stringify(params)]);

  return { properties, loading, error };
}; 