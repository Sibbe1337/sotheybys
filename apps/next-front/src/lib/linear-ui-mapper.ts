/**
 * Linear to UI Mapper
 * Maps Linear issue data to UI listing format for exact parity with legacy pages
 */

import { generateSlug, getYouTubeEmbedUrl, isValidYouTubeUrl } from './utils';

export type UiListing = {
  id: string;
  slug: string;
  title: string;
  location: {
    addressLine: string;
    postalCode?: string;
    city?: string;
    district?: string;
    lat?: number;
    lng?: number;
  };
  financials: {
    price?: number;           // Sales price
    debtFreePrice?: number;   // Debt-free price
    currency?: string;
  };
  specs: {
    livingAreaM2?: number;
    totalAreaM2?: number;
    yearBuilt?: number;
    rooms?: string;
    bedrooms?: number;
    bathrooms?: number;
    floor?: string;
    floorCount?: string;
    elevator?: boolean;
  };
  features: {
    energyClass?: string;
    heatingType?: string;
    sauna?: boolean;
    balcony?: boolean;
    terrace?: boolean;
    parking?: string;
  };
  charges: {
    hoaFee?: number;
    propertyTax?: number;
    waterFee?: number;
    heatingFee?: number;
  };
  media: {
    heroUrl: string;
    gallery: string[];
    floorplans?: string[];
    videoUrl?: string;        // YouTube embed url
    brochureUrl?: string;     // PDF
  };
  agents: {
    name: string;
    title?: string;
    phone?: string;
    email?: string;
    imageUrl?: string;
  }[];
  description?: string;
  housingCompany?: {
    name?: string;
    shareNumbers?: string;
  };
  updatedAt: string;
};

// Map Linear "issue" result to UiListing
export function mapLinearIssueToUi(issue: any): UiListing {
  const cf = indexCustomFields(issue?.customFields?.nodes ?? []);
  const att = (issue?.attachments?.nodes ?? []) as any[];

  // 1) basics
  const title = issue?.title ?? '';
  const slug = generateSlug(title);

  // 2) location & coords
  const location = {
    addressLine: cf["Address line"] ?? cf["Address"] ?? "",
    postalCode: cf["Postal code"] ?? cf["PostalCode"],
    city: cf["City"] ?? cf["Municipality"],
    district: cf["District"] ?? cf["Area"] ?? cf["Part of city"],
    lat: num(cf["Latitude"] ?? cf["Lat"]),
    lng: num(cf["Longitude"] ?? cf["Lng"] ?? cf["Lon"]),
  };

  // 3) numbers shown on legacy pages
  const financials = {
    price: money(cf["Sales price (EUR)"] ?? cf["Sales price"] ?? cf["Price"]),
    debtFreePrice: money(cf["Debt-free price (EUR)"] ?? cf["Debt-free price"]),
    currency: "EUR",
  };

  const specs = {
    livingAreaM2: num(cf["Living area (m2)"] ?? cf["Living area"] ?? cf["Area"]),
    totalAreaM2: num(cf["Total area (m2)"] ?? cf["Total area"]),
    yearBuilt: num(cf["Year built"] ?? cf["Construction year"] ?? cf["Year"]),
    rooms: cf["Rooms"] ?? cf["Room count"],
    bedrooms: num(cf["Bedrooms"] ?? cf["Bedroom count"]),
    bathrooms: num(cf["Bathrooms"] ?? cf["Bathroom count"]),
    floor: cf["Floor"] ?? cf["Floor number"],
    floorCount: cf["Floor count"] ?? cf["Total floors"],
    elevator: bool(cf["Elevator"] ?? cf["Has elevator"]),
  };

  // 4) features
  const features = {
    energyClass: cf["Energy class"] ?? cf["Energy rating"],
    heatingType: cf["Heating type"] ?? cf["Heating system"],
    sauna: bool(cf["Sauna"] ?? cf["Has sauna"]),
    balcony: bool(cf["Balcony"] ?? cf["Has balcony"]),
    terrace: bool(cf["Terrace"] ?? cf["Has terrace"]),
    parking: cf["Parking"] ?? cf["Parking spaces"],
  };

  // 5) charges
  const charges = {
    hoaFee: money(cf["HOA fee"] ?? cf["Maintenance charge"] ?? cf["Monthly fee"]),
    propertyTax: money(cf["Property tax"]),
    waterFee: money(cf["Water fee"] ?? cf["Water charge"]),
    heatingFee: money(cf["Heating fee"] ?? cf["Heating charge"]),
  };

  // 6) media grouping
  const urls = att.map(a => ({ 
    ...a, 
    url: a.url as string, 
    name: (a.title || a.url || "").toLowerCase() 
  }));
  
  const gallery = urls
    .filter(a => a.contentType?.startsWith("image/") && !/floor|plan|pohja/.test(a.name))
    .map(a => a.url);
    
  const floorplan = urls
    .filter(a => /floor|plan|pohja/.test(a.name) || 
                 (a.contentType === "application/pdf" && /floor|plan|pohja/.test(a.name)))
    .map(a => a.url);
    
  const brochure = urls
    .find(a => a.contentType === "application/pdf" && /brochure|esitte/.test(a.name))?.url ??
    cf["Brochure URL"] ?? cf["Property brochure URL"];

  // 7) video
  const rawVideo = cf["YouTube URL"] ?? cf["Video URL"] ?? 
                   urls.find(a => /youtu\.?be|youtube\.com/.test(a.url))?.url;
  const videoUrl = rawVideo && isValidYouTubeUrl(rawVideo) ? getYouTubeEmbedUrl(rawVideo) : undefined;

  // 8) description
  const description = issue?.description ?? cf["Description"] ?? cf["Marketing description"];

  // 9) housing company
  const housingCompany = {
    name: cf["Housing company name"] ?? cf["Housing cooperative name"],
    shareNumbers: cf["Share numbers"] ?? cf["Shares"],
  };

  return {
    id: String(issue?.id ?? ""),
    slug,
    title,
    location,
    financials,
    specs,
    features,
    charges,
    media: {
      heroUrl: gallery[0] ?? "/images/defaults/property-placeholder.jpg",
      gallery,
      floorplans: floorplan.length ? floorplan : undefined,
      videoUrl,
      brochureUrl: brochure,
    },
    agents: extractAgentsFromIssue(issue, cf),
    description,
    housingCompany,
    updatedAt: issue?.updatedAt ?? new Date().toISOString(),
  };
}

// Map Linear REST API format to our GraphQL-like structure
export function adaptLinearRestToIssue(listing: any): any {
  // Extract all fields from the Linear REST API format
  const fields: any[] = [];
  
  // Helper to add a field
  const addField = (name: string, value: any) => {
    if (value !== undefined && value !== null) {
      fields.push({ name, value: String(value) });
    }
  };

  // Extract basic info
  const address = listing.address?.fi?.value || listing.address?.en?.value || '';
  const city = listing.city?.fi?.value || listing.city?.en?.value || '';
  const postalCode = listing.postalCode?.fi?.value || listing.postalCode?.en?.value || '';
  
  addField("Address line", address);
  addField("City", city);
  addField("Postal code", postalCode);
  addField("District", listing.district?.fi?.value || listing.partOfCity?.fi?.value);
  
  // Extract coordinates
  const lat = listing.lat?.fi?.value || listing.latitude?.fi?.value || 
              listing.coordinate?.fi?.value?.lat || listing.coordinates?.fi?.value?.lat;
  const lng = listing.lng?.fi?.value || listing.longitude?.fi?.value || 
              listing.lon?.fi?.value || listing.coordinate?.fi?.value?.lng || 
              listing.coordinates?.fi?.value?.lng || listing.coordinate?.fi?.value?.lon;
              
  addField("Latitude", lat);
  addField("Longitude", lng);
  
  // Extract financials
  addField("Sales price (EUR)", listing.askPrice?.fi?.value || listing.price?.fi?.value);
  addField("Debt-free price (EUR)", listing.debtFreePrice?.fi?.value);
  
  // Extract specs
  addField("Living area (m2)", listing.area?.fi?.value || listing.livingArea?.fi?.value);
  addField("Total area (m2)", listing.totalArea?.fi?.value || listing.overallArea?.fi?.value);
  addField("Year built", listing.constructionYear?.fi?.value || listing.yearBuilt?.fi?.value);
  addField("Rooms", listing.rooms?.fi?.value || listing.roomCount?.fi?.value);
  addField("Bedrooms", listing.bedroomCount?.fi?.value || extractBedrooms(listing.rooms?.fi?.value));
  addField("Bathrooms", listing.wcCount?.fi?.value || listing.bathroomCount?.fi?.value);
  addField("Floor", listing.floor?.fi?.value);
  addField("Floor count", listing.floorCount?.fi?.value);
  addField("Elevator", listing.elevator?.fi?.value);
  
  // Extract features
  addField("Energy class", listing.energyClass?.fi?.value);
  addField("Heating type", listing.heatingSystem?.fi?.value);
  addField("Sauna", listing.sauna?.fi?.value);
  addField("Balcony", listing.balcony?.fi?.value);
  addField("Terrace", listing.terrace?.fi?.value);
  addField("Parking spaces", listing.parkingSpaces?.fi?.value || listing.parking?.fi?.value);
  
  // Extract charges
  addField("HOA fee", listing.maintenanceCharge?.fi?.value);
  addField("Property tax", listing.propertyTax?.fi?.value);
  addField("Water fee", listing.waterCharge?.fi?.value);
  addField("Heating fee", listing.heatingCharge?.fi?.value);
  
  // Extract media URLs
  addField("YouTube URL", listing.youtubeUrl?.fi?.value || listing.videoUrl?.fi?.value);
  addField("Brochure URL", listing.propertyBrochureUrl?.fi?.value || listing.brochureUrl?.fi?.value);
  
  // Extract description
  addField("Description", listing.description?.fi?.value || listing.freeText?.fi?.value);
  
  // Extract housing company
  addField("Housing company name", listing.housingCooperativeName?.fi?.value);
  addField("Share numbers", listing.shareNumbers?.fi?.value);
  
  // Build attachments from images and URLs
  const attachments: any[] = [];
  
  // Add images as attachments
  if (listing.images && Array.isArray(listing.images)) {
    listing.images.forEach((img: any, idx: number) => {
      attachments.push({
        id: `img-${idx}`,
        title: img.title || `Image ${idx + 1}`,
        url: img.url,
        contentType: "image/jpeg",
        createdAt: new Date().toISOString()
      });
    });
  }
  
  // Add floor plan as attachment if available
  if (listing.floorPlanUrl?.fi?.value) {
    attachments.push({
      id: "floorplan",
      title: "Floor plan",
      url: listing.floorPlanUrl.fi.value,
      contentType: "image/jpeg",
      createdAt: new Date().toISOString()
    });
  }
  
  // Return GraphQL-like issue structure
  return {
    id: listing.id?.fi?.value || listing.id,
    title: address + (city ? `, ${city}` : ''),
    description: listing.description?.fi?.value || listing.freeText?.fi?.value,
    createdAt: listing.createdAt || new Date().toISOString(),
    updatedAt: listing.updatedAt || new Date().toISOString(),
    customFields: {
      nodes: fields
    },
    attachments: {
      nodes: attachments
    },
    labels: {
      nodes: []
    }
  };
}

// Extract agents from issue or custom fields
function extractAgentsFromIssue(issue: any, cf: Record<string, any>): UiListing['agents'] {
  const agents: UiListing['agents'] = [];
  
  // Try to extract from custom fields
  const agent1 = {
    name: cf["Agent name"] ?? cf["Agent 1 name"] ?? "",
    title: cf["Agent title"] ?? cf["Agent 1 title"],
    phone: cf["Agent phone"] ?? cf["Agent 1 phone"],
    email: cf["Agent email"] ?? cf["Agent 1 email"],
    imageUrl: cf["Agent photo"] ?? cf["Agent 1 photo"],
  };
  
  if (agent1.name) {
    agents.push(agent1);
  }
  
  // Check for second agent
  const agent2Name = cf["Agent 2 name"];
  if (agent2Name) {
    agents.push({
      name: agent2Name,
      title: cf["Agent 2 title"],
      phone: cf["Agent 2 phone"],
      email: cf["Agent 2 email"],
      imageUrl: cf["Agent 2 photo"],
    });
  }
  
  // If no agents found, return empty array
  return agents;
}

// Helper to extract bedrooms from room string like "3h+k" -> 3
function extractBedrooms(rooms?: string): string | null {
  if (!rooms) return null;
  const match = rooms.match(/^(\d+)/);
  return match ? match[1] : null;
}

// ---------- helpers ----------
function indexCustomFields(nodes: Array<{name: string; value: any}>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const n of nodes) {
    if (n.name?.trim) {
      out[n.name.trim()] = n.value;
    }
  }
  return out;
}

function num(v: any): number | undefined {
  if (v == null) return;
  const cleaned = String(v).replace(/[^\d.,-]/g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

function money(v: any): number | undefined { 
  return num(v); 
}

function bool(v: any): boolean | undefined {
  if (v == null) return;
  const str = String(v).toLowerCase();
  if (str === 'true' || str === 'yes' || str === 'kyllä' || str === '1') return true;
  if (str === 'false' || str === 'no' || str === 'ei' || str === '0') return false;
  return undefined;
}
