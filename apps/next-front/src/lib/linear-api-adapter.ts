/**
 * Linear API Adapter
 * Converts Linear API format to our WordPress-like format
 */

import { getMarketingContent, hasMarketingContent } from './marketing-content';
import { generateSlug } from './utils';
import { adaptLinearRestToIssue, mapLinearIssueToUi, UiListing } from './linear-ui-mapper';
import { parseEuroNumber } from './number-eu';

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
  // 🏠 RENTAL FIELDS (Vuokrakohteet / Hyresobjekt / Rentals)
  rent?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  securityDepositType?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  rentalContractType?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  earliestTerminateDate?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  petsAllowed?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
  smokingAllowed?: {
    fi: {
      key: string;
      value: string | null;
      category: string;
    };
  };
}

// Helper function to safely extract multilingual values
function getMultilingualValue<T>(field: any, language: 'fi' | 'sv' | 'en', defaultValue?: T): T | null | undefined {
  if (!field) return defaultValue as T;
  // Try requested language first, then fallback to Finnish
  return field[language]?.value ?? field.fi?.value ?? defaultValue as T;
}

export function convertLinearToWordPressFormat(listing: LinearAPIListing, language: 'fi' | 'sv' | 'en' = 'fi') {
  // Extract data using the specified language with fallback to Finnish
  const id = getMultilingualValue(listing.id, language, '');
  const address = getMultilingualValue(listing.address, language, '');
  const city = getMultilingualValue(listing.city, language, '');
  const price = getMultilingualValue(listing.askPrice, language);
  const debtFreePrice = getMultilingualValue(listing.debtFreePrice, language);
  const area = getMultilingualValue(listing.area, language);
  const rooms = getMultilingualValue(listing.rooms, language);
  const description = getMultilingualValue(listing.description, language, '');
  const propertyType = getMultilingualValue(listing.propertyType, language) || (language === 'sv' ? 'Lägenhet' : language === 'en' ? 'Apartment' : 'Asunto');
  
  // Get marketing content if available
  const marketingContent = getMarketingContent(id || '', language);
  const enrichedDescription = marketingContent?.description || description;
  const marketingTitle = marketingContent?.title || '';
  const marketingSubtitle = marketingContent?.subtitle || '';
  
  // Find main image or use first image
  const mainImage = listing.images?.find(img => img.isMain) || listing.images?.[0];
  
  // Extract external links
  const externalLinks = getMultilingualValue(listing.links, language, []);
  const videoUrl = getMultilingualValue(listing.videoUrl, language, null);
  
  // Extract additional property details - use language with fallback
  const maintenanceCharge = getMultilingualValue(listing.maintenanceCharge, language, null);
  const waterCharge = getMultilingualValue(listing.waterCharge, language, null);
  const shareNumbers = getMultilingualValue(listing.shareNumbers, language, null);
  const floor = getMultilingualValue(listing.floor, language, null);
  const floorCount = getMultilingualValue(listing.floorCount, language, null);
  const energyClass = getMultilingualValue(listing.energyClass, language, null);
  const constructionMaterial = getMultilingualValue(listing.constructionMaterial, language, null);
  const housingCooperativeName = getMultilingualValue(listing.housingCooperativeName, language, null);
  const propertyManagerName = getMultilingualValue(listing.propertyManagerName, language, null);
  const propertyManagerOffice = getMultilingualValue(listing.propertyManagerOffice, language, null);
  const heatingSystem = getMultilingualValue(listing.heatingSystem, language, null);
  const constructionYear = getMultilingualValue(listing.constructionYear, language) || getMultilingualValue(listing.completeYear, language, null);
  const lotOwnership = getMultilingualValue(listing.lotOwnership, language, null);
  
  // Extract additional detailed fields - ensure null instead of undefined
  const balcony = getMultilingualValue(listing.balcony, language, null);
  const terrace = getMultilingualValue(listing.terrace, language, null);
  const sauna = getMultilingualValue(listing.sauna, language, null);
  const elevator = getMultilingualValue(listing.elevator, language, null);
  const parkingSpaces = getMultilingualValue(listing.parkingSpaces, language, null);
  const lotArea = getMultilingualValue(listing.lotArea, language, null);
  const buildingMaterialFacade = getMultilingualValue(listing.buildingMaterialFacade, language, null);
  const roofMaterial = getMultilingualValue(listing.roofMaterial, language, null);
  const roofType = getMultilingualValue(listing.roofType, language, null);
  const windowsDirection = getMultilingualValue(listing.windowsDirection, language, null);
  const kitchenDescription = getMultilingualValue(listing.kitchenDescription, language, null);
  const bathroomDescription = getMultilingualValue(listing.bathroomDescription, language, null);
  const condition = getMultilingualValue(listing.condition, language, null);
  const furnished = getMultilingualValue(listing.furnished, language, null);
  const antenna = getMultilingualValue(listing.antenna, language, null);
  const autoparkingType = getMultilingualValue(listing.autoparkingType, language, null);
  const generalCondition = getMultilingualValue(listing.generalCondition, language, null);
  const listingType = getMultilingualValue(listing.listingType, language, null);
  
  // 🏠 RENTAL FIELDS (Vuokrakohteet / Hyresobjekt / Rentals)
  const rent = getMultilingualValue(listing.rent, language, null);
  const securityDepositType = getMultilingualValue(listing.securityDepositType, language, null);
  const rentalContractType = getMultilingualValue(listing.rentalContractType, language, null);
  const earliestTerminateDate = getMultilingualValue(listing.earliestTerminateDate, language, null);
  const petsAllowed = getMultilingualValue(listing.petsAllowed, language, null);
  const smokingAllowed = getMultilingualValue(listing.smokingAllowed, language, null);
  
  return {
    id,
    title: marketingTitle || address || '',
    slug: generateSlug(address || ''),
    featuredImage: mainImage ? {
      node: {
        sourceUrl: mainImage.url,
        altText: mainImage.title || address
      }
    } : undefined,
    images: listing.images || [],
    acfRealEstate: {
      property: {
        price: price != null ? Math.round(parseEuroNumber(price as any)).toString() : null,
        debtFreePrice: debtFreePrice != null ? Math.round(parseEuroNumber(debtFreePrice as any)).toString() : null,
        address,
        city,
        rooms: rooms as string || null,
        bedrooms: extractBedrooms(rooms as string),
        bathrooms: null,
        area: area || null,
        propertyType,
        status: language === 'sv' ? 'Till salu' : language === 'en' ? 'For sale' : 'Myynnissä',
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
        externalLinks: (externalLinks || []).map((link: any) => ({
          label: link.label,
          url: link.value
        })),
        videoUrl,
        // Additional property details
        maintenanceCharge: maintenanceCharge ? (maintenanceCharge as any).toString() : null,
        waterCharge: waterCharge ? (waterCharge as any).toString() : null,
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
        listingType,
        // 🏠 Rental fields
        rent,
        securityDepositType,
        rentalContractType,
        earliestTerminateDate,
        petsAllowed,
        smokingAllowed
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

export async function fetchLinearListings(language: 'fi' | 'sv' | 'en' = 'fi'): Promise<any[]> {
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
    const endpoint = `${baseUrl}/v2/listings?languages[]=${language}`;
    
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
      return data.map(listing => convertLinearToWordPressFormat(listing, language));
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
