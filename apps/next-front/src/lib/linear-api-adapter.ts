/**
 * Linear API Adapter
 * Converts Linear API format to our WordPress-like format
 */

import { getMarketingContent, hasMarketingContent } from './marketing-content';
import { generateSlug } from './utils';
import { adaptLinearRestToIssue, mapLinearIssueToUi, UiListing } from './linear-ui-mapper';

export interface LinearAPIListing {
  id: {
    fi: {
      key: string;
      value: string;
      category: string;
    };
  };
  address?: {
    fi: {
      key: string;
      value: string;
      category: string;
    };
  };
  city?: {
    fi: {
      key: string;
      value: string;
      category: string;
    };
  };
  askPrice?: {
    fi: {
      key: string;
      value: number | null;
      category: string;
    };
  };
  rooms?: {
    fi: {
      key: string;
      value: string;
      category: string;
    };
  };
  area?: {
    fi: {
      key: string;
      value: string;
      category: string;
    };
  };
  images?: Array<{
    url: string;
    title?: string;
    isMain?: boolean;
  }>;
  description?: {
    fi: {
      key: string;
      value: string;
      category: string;
    };
  };
  propertyType?: {
    fi: {
      key: string;
      value: string;
      category: string;
    };
  };
  links?: {
    fi: {
      key: string;
      value: Array<{
        label: string;
        value: string;
      }>;
      category: string;
    };
  };
  videoUrl?: {
    fi: {
      key: string;
      value: string;
      category: string;
    };
  };
  // Additional detailed fields
  maintenanceCharge?: {
    fi: {
      key: string;
      value: number | null;
      category: string;
    };
  };
  waterCharge?: {
    fi: {
      key: string;
      value: number | null;
      category: string;
    };
  };
  shareNumbers?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  floor?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  floorCount?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  energyClass?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  constructionMaterial?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  housingCooperativeName?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  propertyManagerName?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  propertyManagerOffice?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  heatingSystem?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  constructionYear?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  completeYear?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  lotOwnership?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  debtFreePrice?: {
    fi: {
      key: string;
      value: number | null;
      category: string;
    };
  };
  // Additional detailed fields
  balcony?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  terrace?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  sauna?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  elevator?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  parkingSpaces?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  lotArea?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  buildingMaterialFacade?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  roofMaterial?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  roofType?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  windowsDirection?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  kitchenDescription?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  bathroomDescription?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  condition?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  furnished?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  antenna?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  autoparkingType?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  generalCondition?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  listingType?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
}

export function convertLinearToWordPressFormat(listing: LinearAPIListing, language: 'fi' | 'sv' | 'en' = 'fi') {
  const id = listing.id?.fi?.value || '';
  const address = listing.address?.fi?.value || '';
  const city = listing.city?.fi?.value || '';
  const price = listing.askPrice?.fi?.value;
  const debtFreePrice = listing.debtFreePrice?.fi?.value;
  const area = listing.area?.fi?.value;
  const rooms = listing.rooms?.fi?.value;
  const description = listing.description?.fi?.value || '';
  const propertyType = listing.propertyType?.fi?.value || 'Asunto';
  
  // Debug logging to check price values
  if (address === 'Linnankoskenkatu 8') {
    console.log('DEBUG: Linnankoskenkatu 8 price data:', {
      rawAskPrice: listing.askPrice,
      extractedPrice: price,
      priceType: typeof price
    });
  }
  
  // Get marketing content if available
  const marketingContent = getMarketingContent(id, language);
  const enrichedDescription = marketingContent?.description || description;
  const marketingTitle = marketingContent?.title || '';
  const marketingSubtitle = marketingContent?.subtitle || '';
  
  // Find main image or use first image
  const mainImage = listing.images?.find(img => img.isMain) || listing.images?.[0];
  
  // Extract external links
  const externalLinks = listing.links?.fi?.value || [];
  const videoUrl = listing.videoUrl?.fi?.value || null;
  
  // Extract additional property details
  const maintenanceCharge = listing.maintenanceCharge?.fi?.value || null;
  const waterCharge = listing.waterCharge?.fi?.value || null;
  const shareNumbers = listing.shareNumbers?.fi?.value || null;
  const floor = listing.floor?.fi?.value || null;
  const floorCount = listing.floorCount?.fi?.value || null;
  const energyClass = listing.energyClass?.fi?.value || null;
  const constructionMaterial = listing.constructionMaterial?.fi?.value || null;
  const housingCooperativeName = listing.housingCooperativeName?.fi?.value || null;
  const propertyManagerName = listing.propertyManagerName?.fi?.value || null;
  const propertyManagerOffice = listing.propertyManagerOffice?.fi?.value || null;
  const heatingSystem = listing.heatingSystem?.fi?.value || null;
  const constructionYear = listing.constructionYear?.fi?.value || listing.completeYear?.fi?.value || null;
  const lotOwnership = listing.lotOwnership?.fi?.value || null;
  
  // Extract additional detailed fields - ensure null instead of undefined
  const balcony = listing.balcony?.fi?.value || null;
  const terrace = listing.terrace?.fi?.value || null;
  const sauna = listing.sauna?.fi?.value || null;
  const elevator = listing.elevator?.fi?.value || null;
  const parkingSpaces = listing.parkingSpaces?.fi?.value || null;
  const lotArea = listing.lotArea?.fi?.value || null;
  const buildingMaterialFacade = listing.buildingMaterialFacade?.fi?.value || null;
  const roofMaterial = listing.roofMaterial?.fi?.value || null;
  const roofType = listing.roofType?.fi?.value || null;
  const windowsDirection = listing.windowsDirection?.fi?.value || null;
  const kitchenDescription = listing.kitchenDescription?.fi?.value || null;
  const bathroomDescription = listing.bathroomDescription?.fi?.value || null;
  const condition = listing.condition?.fi?.value || null;
  const furnished = listing.furnished?.fi?.value || null;
  const antenna = listing.antenna?.fi?.value || null;
  const autoparkingType = listing.autoparkingType?.fi?.value || null;
  const generalCondition = listing.generalCondition?.fi?.value || null;
  const listingType = listing.listingType?.fi?.value || null;
  
  return {
    id,
    title: marketingTitle || address,
    slug: generateSlug(address),
    featuredImage: mainImage ? {
      node: {
        sourceUrl: mainImage.url,
        altText: mainImage.title || address
      }
    } : undefined,
    images: listing.images || [],
    acfRealEstate: {
      property: {
        price: price ? String(price).replace(/\D/g, '') : null,
        debtFreePrice: debtFreePrice ? String(debtFreePrice).replace(/\D/g, '') : null,
        address,
        city,
        rooms: rooms || null,
        bedrooms: extractBedrooms(rooms),
        bathrooms: null,
        area: area || null,
        propertyType,
        status: 'Myynnissä',
        description: enrichedDescription || '',
        freeText: enrichedDescription || '',
        freeTextTitle: marketingTitle || '',
        marketingSubtitle: marketingSubtitle || '',
        marketingHighlights: marketingContent?.highlights || null,
        marketingSellingPoints: marketingContent?.sellingPoints || null,
        marketingLocationDescription: marketingContent?.locationDescription || null,
        marketingAgentNotes: marketingContent?.agentNotes || null,
        hasMarketingContent: !!marketingContent,
        // Add external links data
        externalLinks: externalLinks.map(link => ({
          label: link.label,
          url: link.value
        })),
        videoUrl,
        // Additional property details
        maintenanceCharge: maintenanceCharge ? maintenanceCharge.toString() : null,
        waterCharge: waterCharge ? waterCharge.toString() : null,
        shareNumbers,
        floor,
        floorCount,
        energyClass,
        constructionMaterial,
        housingCooperativeName,
        propertyManagerName,
        propertyManagerOffice,
        heatingSystem,
        constructionYear,
        lotOwnership,
        // Additional detailed fields
        balcony,
        terrace,
        sauna,
        elevator,
        parkingSpaces,
        lotArea,
        buildingMaterialFacade,
        roofMaterial,
        roofType,
        windowsDirection,
        kitchenDescription,
        bathroomDescription,
        condition,
        furnished,
        antenna,
        autoparkingType,
        generalCondition,
        listingType
      }
    }
  };
}

function extractBedrooms(rooms?: string): string | null {
  if (!rooms) {
    return null;
  }
  // Extract number from strings like "3h" or "3-4h"
  const match = rooms.match(/(\d+)/);
  return match ? match[1] : null;
}

export async function fetchLinearListings(): Promise<any[]> {
  const apiUrl = process.env.NEXT_PUBLIC_LINEAR_API_URL || process.env.LINEAR_API_URL;
  const apiKey = process.env.LINEAR_API_KEY;
  const companyId = process.env.LINEAR_COMPANY_ID;
  
  if (!apiUrl || !apiKey) {
    console.log('Linear API not configured');
    return [];
  }
  
  try {
    // Fix the API URL - remove /api if it's at the end
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.replace('/api', '') : apiUrl;
    const endpoint = `${baseUrl}/v2/listings?languages[]=fi`;
    
    const headers: Record<string, string> = {
      'authorization': apiKey,
      'Accept': 'application/json'
    };
    
    if (companyId) {
      headers['X-Company-Id'] = companyId;
    }
    
    const response = await fetch(endpoint, {
      headers,
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      console.log('Linear API error:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data.map(listing => convertLinearToWordPressFormat(listing, 'fi'));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Linear listings:', error);
    return [];
  }
}

// For testing with the test API key
export async function fetchTestLinearListings(): Promise<any[]> {
  const testApiKey = 'LINEAR-API-KEY 086bc46d-da01-444b-86b3-50710d4c5cf5';
  const apiUrl = 'https://ca-externalapi-test-weu-001.livelyrock-4a193af6.westeurope.azurecontainerapps.io';
  
  try {
    console.log('Using Linear API test properties');
    const response = await fetch(`${apiUrl}/v2/listings?languages[]=fi`, {
      headers: {
        'authorization': testApiKey,
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      console.log('Test API error:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (Array.isArray(data)) {
      console.log(`Found ${data.length} listings from Linear test API`);
      return data.slice(0, 12).map((listing) => convertLinearToWordPressFormat(listing));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching test listings:', error);
    return [];
  }
}

// Fetch Linear listings and convert to new UI format
export async function fetchLinearListingsAsUi(): Promise<UiListing[]> {
  const apiUrl = process.env.NEXT_PUBLIC_LINEAR_API_URL || process.env.LINEAR_API_URL;
  const apiKey = process.env.LINEAR_API_KEY;
  const companyId = process.env.LINEAR_COMPANY_ID;
  
  if (!apiUrl || !apiKey) {
    console.log('Linear API not configured, trying test API');
    return fetchTestLinearListingsAsUi();
  }
  
  try {
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.replace('/api', '') : apiUrl;
    const endpoint = `${baseUrl}/v2/listings?languages[]=fi`;
    
    const headers: Record<string, string> = {
      'authorization': apiKey,
      'Accept': 'application/json'
    };
    
    if (companyId) {
      headers['X-Company-Id'] = companyId;
    }
    
    const response = await fetch(endpoint, {
      headers,
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      console.log('Linear API error:', response.status);
      return fetchTestLinearListingsAsUi();
    }
    
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data.map(listing => {
        const issue = adaptLinearRestToIssue(listing);
        return mapLinearIssueToUi(issue);
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Linear listings:', error);
    return fetchTestLinearListingsAsUi();
  }
}

// Fetch test Linear listings and convert to new UI format
export async function fetchTestLinearListingsAsUi(): Promise<UiListing[]> {
  const testApiKey = 'LINEAR-API-KEY 086bc46d-da01-444b-86b3-50710d4c5cf5';
  const apiUrl = 'https://ca-externalapi-test-weu-001.livelyrock-4a193af6.westeurope.azurecontainerapps.io';
  
  try {
    const response = await fetch(`${apiUrl}/v2/listings?languages[]=fi`, {
      headers: {
        'authorization': testApiKey,
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      console.log('Test Linear API error:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (Array.isArray(data)) {
      console.log(`Found ${data.length} listings from Linear test API (UI format)`);
      return data.slice(0, 12).map(listing => {
        const issue = adaptLinearRestToIssue(listing);
        return mapLinearIssueToUi(issue);
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching test Linear listings:', error);
    return [];
  }
}
