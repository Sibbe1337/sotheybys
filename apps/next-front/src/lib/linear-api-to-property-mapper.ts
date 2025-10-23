/**
 * Linear API to Multilingual Property Mapper
 * Converts Linear.fi API responses to MultilingualPropertyListing format
 * 
 * This mapper handles the conversion between Linear.fi's API structure
 * (with localized fields and nonLocalizedValues) and our comprehensive
 * multilingual property listing schema.
 */

import { generateSlug } from './utils';
import {
  MultilingualPropertyListing,
  LocalizedString,
  SupportedLanguage,
} from './property-types-multilang';
import { CompleteLinearAPIListing } from './linear-api-complete-interface';
import { parseEuroNumber } from './number-eu';

// ============================================================================
// IMAGE NORMALIZATION HELPERS
// ============================================================================

/**
 * Normalize image inputs to a consistent object array format
 * Accepts: string[], {url}[], or mixed arrays
 * Returns: [{url, thumbnail?, compressed?, isFloorPlan?, description?, order?}]
 */
function toImageObjects(input: any): Array<{
  url: string;
  thumbnail?: string;
  compressed?: string;
  isFloorPlan?: boolean;
  description?: string;
  order?: number;
}> {
  if (!input) return [];
  
  // Accept arrays of strings or objects
  if (Array.isArray(input)) {
    return input
      .map((it: any, idx: number) => {
        if (typeof it === 'string') {
          return { url: it, order: idx };
        }
        if (it && typeof it === 'object' && typeof it.url === 'string') {
          return { ...it, order: it.order ?? idx };
        }
        return null;
      })
      .filter(Boolean) as any[];
  }
  
  return [];
}

// ============================================================================
// LINEAR API TYPES / LINEAR API -TYYPIT
// ============================================================================

/**
 * Linear API localized field structure
 * Each field contains localized versions (fi, en, sv)
 */
interface LinearLocalizedField {
  fi?: {
    key: string;
    value: string;
    category: string;
  };
  en?: {
    key: string;
    value: string;
    category: string;
  };
  sv?: {
    key: string;
    value: string;
    category: string;
  };
}

/**
 * Linear API Image structure
 */
interface LinearAPIImage {
  url: string;
  thumbnail: string;
  compressed?: string;
  isFloorPlan?: boolean;
  description?: string;
  order?: number;
}

/**
 * Linear API Realtor/Agent structure
 */
interface LinearAPIRealtor {
  id: number;
  name: string;
  tel: string;
  email: string;
  avatar?: string;
  primaryCompany?: {
    name: string;
    logo?: string;
    businessId?: string;
    privacyProtectionLink?: string;
  };
}

/**
 * Linear API Non-localized values
 * These are the actual numeric/boolean values
 */
interface LinearAPINonLocalizedValues {
  // Financial
  askPrice?: string; // "500000"
  debtFreePrice?: string;
  renovationCharge?: string;
  fundingCharge?: string;
  averageTotalHeatingCharge?: string;
  electricHeatingCharge?: string;
  parkingCharge?: string;
  saunaCharge?: string;
  broadbandCharge?: string;
  propertyTax?: string;
  
  // Dimensions
  area?: string; // Living area
  totalArea?: string;
  volume?: string;
  plotArea?: string;
  roomCount?: number;
  bedroomCount?: number;
  wcCount?: number;
  
  // Property details
  completeYear?: number;
  constructionStartYear?: number;
  deploymentYear?: number;
  floorNumber?: number;
  totalFloors?: number;
  
  // Boolean amenities
  sauna?: boolean;
  hasBalcony?: boolean;
  hasParkingSpace?: boolean;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  newlyConstructed?: boolean;
  hasHighCeilings?: boolean;
  hasCableTv?: boolean;
  hasSatelliteAntenna?: boolean;
  listingHasEnergyCertificate?: boolean;
  
  // Condition
  condition?: 'GOOD' | 'EXCELLENT' | 'SATISFACTORY' | 'NEEDS_RENOVATION';
  
  // Energy
  energyClass?: string;
  energyCertificateValidity?: string;
  
  // Renovation years
  electricalSystemRenovationYear?: number;
  sewerSystemRenovationYear?: number;
  waterPipeRenovationYear?: number;
  roofRenovationYear?: number;
  facadeRenovationYear?: number;
}

/**
 * Complete Linear API Listing structure
 * Based on actual API responses from Linear.fi
 */
export interface LinearAPIListing {
  // Core identifiers
  id: LinearLocalizedField;
  identifier: LinearLocalizedField;
  
  // Basic property info
  address: LinearLocalizedField;
  postalCode: LinearLocalizedField;
  city: LinearLocalizedField;
  region: LinearLocalizedField;
  districtFree: LinearLocalizedField;
  district: LinearLocalizedField;
  partOfCity: LinearLocalizedField;
  heading: LinearLocalizedField;
  description: LinearLocalizedField;
  
  // Financial
  askPrice: LinearLocalizedField;
  debtFreePrice: LinearLocalizedField;
  maintenanceCharge: LinearLocalizedField;
  financingCharge: LinearLocalizedField;
  
  // Dimensions
  livingArea: LinearLocalizedField;
  totalArea: LinearLocalizedField;
  volume: LinearLocalizedField;
  rooms: LinearLocalizedField;
  
  // Property details
  propertyType: LinearLocalizedField;
  ownershipType: LinearLocalizedField;
  floor: LinearLocalizedField;
  totalFloors: LinearLocalizedField;
  windowDirection: LinearLocalizedField;
  condition: LinearLocalizedField;
  completeYear: LinearLocalizedField;
  
  // Building
  roofType: LinearLocalizedField;
  heatingType: LinearLocalizedField;
  ventilationType: LinearLocalizedField;
  constructionMaterial: LinearLocalizedField;
  buildingMaterialFacade: LinearLocalizedField;
  energyClass: LinearLocalizedField;
  
  // Housing company
  housingCompanyName: LinearLocalizedField;
  businessId: LinearLocalizedField;
  managementCompany: LinearLocalizedField;
  shareNumbers: LinearLocalizedField;
  
  // Technical
  sewerSystem: LinearLocalizedField;
  waterSystem: LinearLocalizedField;
  antennaSystem: LinearLocalizedField;
  
  // Plot/Land
  plotArea: LinearLocalizedField;
  plotOwnership: LinearLocalizedField;
  zoningSituation: LinearLocalizedField;
  propertyId: LinearLocalizedField;
  municipality: LinearLocalizedField;
  
  // Dates
  releaseDate: LinearLocalizedField;
  availableFrom: LinearLocalizedField;
  showingDate: LinearLocalizedField;
  showingTime: LinearLocalizedField;
  
  // Media
  images: LinearAPIImage[];
  floorPlanUrl?: string;
  brochureUrl?: string;
  videoUrl?: string;
  internationalBrochureUrl?: string;
  
  // Agent
  realtor: LinearAPIRealtor;
  
  // Non-localized actual values
  nonLocalizedValues: LinearAPINonLocalizedValues;
  
  // NEW FIELDS - Kundens feedback (PUNKT 5-12)
  // Energy & Certificates
  listingHasEnergyCertificate: LinearLocalizedField;
  energyCertificateUrl?: string;
  
  // Housing Company Details (Lägenhet)
  housingCompanyHomeCity: LinearLocalizedField;
  housingCompanyApartmentCount: LinearLocalizedField;
  housingCompanyBusinessSpaceCount: LinearLocalizedField;
  housingCompanyMortgage: LinearLocalizedField;
  housingCompanyMortgageDate: LinearLocalizedField;
  housingCompanyRevenue: LinearLocalizedField;
  housingCompanyUpcomingRenovations: LinearLocalizedField;
  housingCompanyRedemptionRight: LinearLocalizedField;
  partnerRedemptionRight: LinearLocalizedField;
  reportOnMaintenanceNeedsYear: LinearLocalizedField;
  
  // Additional Charges (Lägenhet)
  waterCharge: LinearLocalizedField;
  mandatoryCharges: LinearLocalizedField;
  fundingCharge: LinearLocalizedField;
  
  // Property Management
  propertyManagerName: LinearLocalizedField;
  propertyManagerOffice: LinearLocalizedField;
  propertyManagerEmail: LinearLocalizedField;
  propertyManagerPhone: LinearLocalizedField;
  
  // Building Details
  numberOfFloors: LinearLocalizedField;
  buildingYear: LinearLocalizedField;
  
  // Plot/Property (Fastighet)
  siteArea: LinearLocalizedField;
  propertyBuildingRights: LinearLocalizedField;
  propertyTax: LinearLocalizedField;
  siteOwnershipType: LinearLocalizedField;
  
  // International
  internationalUrl?: string;
  
  // Rental (Hyresobjekt)
  rent: LinearLocalizedField;
  securityDepositType: LinearLocalizedField;
  rentalContractType: LinearLocalizedField;
  earliestTerminateDate: LinearLocalizedField;
  petsAllowed: LinearLocalizedField;
  smokingAllowed: LinearLocalizedField;
  
  // Additional fields (240+ total available)
  [key: string]: any;
}

// ============================================================================
// MAPPER FUNCTIONS / MUUNNOSFUNKTIOT
// ============================================================================

/**
 * Extract localized string from Linear API field
 */
function extractLocalizedString(field: LinearLocalizedField | undefined): LocalizedString {
  if (!field) {
    return { fi: '', en: '', sv: '' };
  }
  
  return {
    fi: field.fi?.value || '',
    en: field.en?.value || '',
    sv: field.sv?.value || '',
  };
}

/**
 * Parse numeric value from string (DEPRECATED - use parseEuroNumber from number-eu.ts)
 * Kept for backward compatibility, delegates to parseEuroNumber
 */
function parseNumericValue(value: string | number | undefined): number {
  return parseEuroNumber(value);
}

/**
 * Convert condition enum to localized string
 */
function mapCondition(condition: string | undefined): LocalizedString {
  const conditionMap: Record<string, LocalizedString> = {
    GOOD: {
      fi: 'Hyvä',
      en: 'Good',
      sv: 'Bra',
    },
    EXCELLENT: {
      fi: 'Erinomainen',
      en: 'Excellent',
      sv: 'Utmärkt',
    },
    SATISFACTORY: {
      fi: 'Tyydyttävä',
      en: 'Satisfactory',
      sv: 'Tillfredsställande',
    },
    NEEDS_RENOVATION: {
      fi: 'Remontoitava',
      en: 'Needs Renovation',
      sv: 'Kräver renovering',
    },
  };
  
  return condition ? conditionMap[condition] || {} : {};
}

/**
 * Main mapper: Convert Linear API Listing to MultilingualPropertyListing
 */
export function mapLinearAPIToProperty(
  linearData: LinearAPIListing | CompleteLinearAPIListing
): MultilingualPropertyListing {
  // Cast to any to handle both LinearAPIListing and CompleteLinearAPIListing
  // These types have different field names and structures
  const data = linearData as any;
  const nv = (data.nonLocalizedValues || {}) as any;
  
  // Extract and calculate prices using Finnish formula:
  // Myyntihinta (salesPrice/askPrice) + Velkaosuus (debtPart) = Velaton hinta (unencumbered)
  const salesPrice = parseEuroNumber(nv?.askPrice || data.askPrice?.fi?.value);
  const unencumbered = parseEuroNumber(nv?.debtFreePrice || data.debtFreePrice?.fi?.value);
  const debtPartCalc = Math.max(0, unencumbered - salesPrice);
  
  // Validate price math - warn about suspicious values
  if (salesPrice > 0 && unencumbered > 0) {
    const delta = Math.abs((salesPrice + debtPartCalc) - unencumbered);
    if (delta > 1) {
      const address = extractLocalizedString(data.address);
      console.warn('⚠️  Price math mismatch', {
        address: address.fi,
        salesPrice,
        debtPart: debtPartCalc,
        unencumbered,
        delta,
        formula: `${salesPrice} + ${debtPartCalc} ≠ ${unencumbered}`
      });
    }
  }
  
  if (unencumbered < salesPrice) {
    const address = extractLocalizedString(data.address);
    console.warn('⚠️  Unencumbered < Sales (unexpected)', {
      address: address.fi,
      salesPrice,
      unencumbered,
      note: 'Velaton hinta should be >= Myyntihinta'
    });
  }
  
  if (salesPrice > 10000000) {
    const address = extractLocalizedString(data.address);
    console.warn('⚠️  SUSPICIOUS PRICE IN MULTILANG MAPPER:', {
      address: address.fi,
      salesPrice,
      note: 'Price over 10M EUR - possible data error'
    });
  }
  
  return {
    // ========================================================================
    // 0. CORE IDENTIFIERS
    // ========================================================================
    slug: generateSlug(extractLocalizedString(data.address).fi || `property-${nv.identifier || 'unknown'}`),
    
    // ========================================================================
    // 1. GENERAL PROPERTY INFO
    // ========================================================================
    apartmentType: extractLocalizedString(data.typeOfApartment || data.rooms),  // Linear API uses typeOfApartment (e.g., "2h+k")
    streetAddress: extractLocalizedString(data.address),
    postalCode: data.postalCode?.fi?.value || '',
    city: extractLocalizedString(data.city),
    region: extractLocalizedString(data.region),  // extractLocalizedString already returns { fi: '', en: '', sv: '' } for undefined
    districtFree: extractLocalizedString(data.districtFree),  // e.g., "Lauttasaari/Drumsö"
    district: extractLocalizedString(data.district),
    partOfCity: extractLocalizedString(data.partOfCity),
    heading: extractLocalizedString(data.freeTextTitle || data.marketingTitle),  // Linear API uses freeTextTitle, not heading
    description: extractLocalizedString(data.freeText || data.marketingDescription),  // Linear API uses freeText, not description
    releaseDate: 'releaseDate' in linearData && data.releaseDate?.fi?.value
      ? new Date(data.releaseDate.fi.value) 
      : new Date(),
    availableFrom: extractLocalizedString(data.availableFrom),  // No need for manual fallback
    ownershipType: extractLocalizedString(data.ownershipType),
    floorLocation: extractLocalizedString(data.floor),
    numberOfFloors: ('totalFloors' in linearData ? data.totalFloors?.fi?.value : null) || nv.totalFloors?.toString() || '',
    windowDirection: extractLocalizedString(data.windowDirection),  // No need for manual fallback
    balcony: nv.hasBalcony ?? false,
    sauna: nv.sauna ?? false,
    condition: nv.condition 
      ? mapCondition(nv.condition)
      : extractLocalizedString(data.condition),
    yearOfBuilding: parseInt(nv?.completeYear?.toString() || parseEuroNumber(data.completeYear?.fi?.value).toString() || '0'),
    roofType: extractLocalizedString(data.roofType),
    heatingSystem: extractLocalizedString(data.heatingType || data.heatingSystem),
    ventilationSystem: extractLocalizedString(data.ventilationType || data.ventilationSystem),
    buildingMaterial: extractLocalizedString(data.constructionMaterial || data.buildingMaterialFacade),
    energyClass: (nv as any)?.energyClass || data.energyClass?.fi?.value || '',
    energyCertificate: (nv as any)?.listingHasEnergyCertificate ?? false,
    energyCertificateUrl: data.energyCertificateUrl || '',

    // ========================================================================
    // 2. DIMENSIONS AND USAGE
    // ========================================================================
    livingArea: parseEuroNumber(nv.area || data.livingArea?.fi?.value),
    totalArea: parseEuroNumber(nv.totalArea || data.totalArea?.fi?.value),
    volume: parseEuroNumber(nv.volume || data.volume?.fi?.value),
    numberOfApartments: 0, // Not directly available in Linear API
    businessSpaces: {}, // Not directly available
    siteArea: parseEuroNumber(nv.plotArea || data.plotArea?.fi?.value),
    siteOwnershipType: extractLocalizedString(data.plotOwnership),
    zoningSituation: extractLocalizedString(data.zoningSituation),
    zoningDetails: {}, // Not directly available
    propertyBuildingRights: extractLocalizedString(data.propertyBuildingRights || data.buildingRights),

    // ========================================================================
    // 3. FINANCIAL DATA
    // Finnish formula: Myyntihinta + Velkaosuus = Velaton hinta
    // ========================================================================
    salesPrice: salesPrice,
    debtPart: debtPartCalc,
    unencumberedSalesPrice: unencumbered,
    loanPayable: false, // Not directly available
    maintenanceFee: parseEuroNumber(nv.renovationCharge || data.maintenanceCharge?.fi?.value),
    financingFee: parseEuroNumber(nv.fundingCharge || data.financingCharge?.fi?.value),
    totalFee: (parseEuroNumber(nv.renovationCharge) || 0) + (parseEuroNumber(nv.fundingCharge) || 0),
    rentIncome: 0, // Not directly available
    waterFee: parseEuroNumber(nv.waterCharge || data.waterCharge?.fi?.value),
    mandatoryCharges: parseEuroNumber(nv.mandatoryCharges || data.mandatoryCharges?.fi?.value),
    fundingCharge: parseEuroNumber(nv.fundingCharge || data.fundingCharge?.fi?.value),
    electricityCost: parseEuroNumber(nv.electricHeatingCharge),
    heatingCost: parseEuroNumber(nv.averageTotalHeatingCharge),
    cleaningCost: 0, // Not directly available
    propertyTax: parseEuroNumber(nv.propertyTax || data.propertyTax?.fi?.value),
    otherFees: {}, // Could aggregate parking, sauna, broadband charges
    paymentMethod: {}, // Not directly available

    // ========================================================================
    // 4. COMPANY / MANAGEMENT
    // ========================================================================
    housingCompanyName: data.housingCompanyName?.fi?.value || '',
    housingCompanyHomeCity: extractLocalizedString(data.housingCompanyHomeCity),
    businessId: data.businessId?.fi?.value || '',
    managementCompany: data.managementCompany?.fi?.value || '',
    propertyMaintenance: '', // Not directly available
    managerName: data.propertyManagerName?.fi?.value || '',
    managerPhone: data.propertyManagerPhone?.fi?.value || '',
    managerEmail: data.propertyManagerEmail?.fi?.value || '',
    propertyManagerOffice: extractLocalizedString(data.propertyManagerOffice),
    ownershipStatus: extractLocalizedString(data.ownershipType),
    numberOfShares: data.shareNumbers?.fi?.value || '',
    redemptionClauseFlats: data.housingCompanyRedemptionRight?.fi?.value === 'true' || false,
    partnerRedemptionRight: extractLocalizedString(data.partnerRedemptionRight),
    redemptionClauseParking: false, // Not directly available
    companyLoans: parseEuroNumber(data.housingCompanyMortgage?.fi?.value),
    housingCompanyMortgageDate: extractLocalizedString(data.housingCompanyMortgageDate),
    companyIncome: parseEuroNumber(data.housingCompanyRevenue?.fi?.value),
    constructionYear: nv.completeYear || parseEuroNumber(data.completeYear?.fi?.value),
    totalApartments: parseEuroNumber(data.housingCompanyApartmentCount?.fi?.value),
    totalBusinessSpaces: parseEuroNumber(data.housingCompanyBusinessSpaceCount?.fi?.value),
    sharedSpaces: {}, // Not directly available
    asbestosSurvey: false, // Not directly available
    repairHistory: {}, // Could use renovation year fields
    upcomingRepairs: extractLocalizedString(data.housingCompanyUpcomingRenovations),
    reportOnMaintenanceNeedsYear: extractLocalizedString(data.reportOnMaintenanceNeedsYear),

    // ========================================================================
    // 5. TECHNICAL AND ENVIRONMENTAL
    // ========================================================================
    sewerSystem: extractLocalizedString(data.sewerSystem),
    waterConnection: extractLocalizedString(data.waterSystem),
    broadband: nv.hasCableTv ?? false,
    antennaSystem: extractLocalizedString(data.antennaSystem),
    propertyRestrictions: {}, // Not directly available
    terrainDescription: {}, // Not directly available
    soilAndVegetation: {}, // Not directly available
    buildingRights: {}, // Not directly available
    easementsAndRights: {}, // Not directly available
    propertyId: data.propertyId?.fi?.value || '',
    landRegisterNumber: '', // Not directly available
    municipality: extractLocalizedString(data.municipality),
    villageOrDistrict: extractLocalizedString(data.region),
    blockNumber: '', // Not directly available
    leaseTerm: {}, // Not directly available
    annualLease: 0, // Not directly available

    // ========================================================================
    // 6. LISTING AND AGENT INFO
    // ========================================================================
    estateAgentName: data.realtor?.name || '',
    estateAgentPhone: data.realtor?.tel || '',
    estateAgentEmail: data.realtor?.email || '',
    // Agent object with photo for property detail pages
    agent: extractAgentInfo(linearData),
    showingDate: data.showingDate?.fi?.value 
      ? new Date(data.showingDate.fi.value) 
      : new Date(),
    showingTime: data.showingTime?.fi?.value || '',
    listingOffice: data.realtor?.primaryCompany?.name || '',
    listingSourceUrl: '', // Not directly available
    
    // ========================================================================
    // 6.5 IMAGES (NORMALIZED) - UNIFIED PIPELINE
    // ========================================================================
    // Normalize all image sources to consistent format
    ...(() => {
      const imagesFromLinear = toImageObjects(data.images || data.media?.gallery);
      const photosFromStrings = toImageObjects(nv?.photoUrls || data.photoUrls);
      const allImages = [...imagesFromLinear, ...photosFromStrings];
      
      return {
        images: allImages,  // Normalized objects [{url,...}]
        photoUrls: allImages.map(img => img.url),  // Plain string array for UI fallback
        floorPlanUrl: data.floorPlanUrl || 
          allImages.find(i => i.isFloorPlan)?.url || 
          data.media?.floorplans?.[0] || '',
      };
    })(),
    
    brochureUrl: data.brochureUrl || '',
    internationalBrochureUrl: data.internationalBrochureUrl || '',
    internationalUrl: data.internationalUrl || '',
    videoUrl: data.videoUrl || '',
    
    // ========================================================================
    // 6.8 RENTAL-SPECIFIC FIELDS (HYRESOBJEKT)
    // ========================================================================
    rent: parseEuroNumber(nv.rent || data.rent?.fi?.value),
    securityDepositType: extractLocalizedString(data.securityDepositType),
    rentalContractType: extractLocalizedString(data.rentalContractType),
    earliestTerminateDate: extractLocalizedString(data.earliestTerminateDate),
    petsAllowed: nv.petsAllowed ?? false,
    smokingAllowed: nv.smokingAllowed ?? false,

    // ========================================================================
    // 7. METADATA
    // ========================================================================
    parsingDate: new Date(),
    sourceType: 'LINEAR_API',
    sourceFilename: `linear-${data.id?.fi?.value || 'unknown'}.json`,
    version: '1.0.0',
  };
}

/**
 * Batch mapper: Convert multiple Linear API listings
 */
export function mapLinearAPIListingsToProperties(
  linearListings: LinearAPIListing[]
): MultilingualPropertyListing[] {
  return linearListings.map(mapLinearAPIToProperty);
}

/**
 * Extract property images with preference for compressed versions
 */
export function extractPropertyImages(linearData: LinearAPIListing): {
  gallery: string[];
  floorPlans: string[];
  thumbnails: string[];
} {
  const data = linearData as any;
  const images = data.images || [];
  
  return {
    gallery: images
      .filter((img: any) => !img.isFloorPlan)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .map((img: any) => img.compressed || img.url),
    floorPlans: images
      .filter((img: any) => img.isFloorPlan)
      .map((img: any) => img.compressed || img.url),
    thumbnails: images
      .filter((img: any) => !img.isFloorPlan)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .map((img: any) => img.thumbnail),
  };
}

/**
 * Extract agent/realtor information
 * Transforms to WordPress-compatible format with photo.sourceUrl
 */
export function extractAgentInfo(linearData: LinearAPIListing | CompleteLinearAPIListing) {
  const data = linearData as any; // Cast to any to handle both types
  const realtor = data.realtor;
  
  return {
    id: realtor?.id,
    name: realtor?.name,
    phone: realtor?.tel,
    email: realtor?.email,
    // Transform avatar (string) to photo object for compatibility
    photo: realtor?.avatar ? {
      sourceUrl: realtor.avatar,
      altText: realtor.name || 'Agent photo'
    } : null,
    // Keep avatar for backwards compatibility
    avatar: realtor?.avatar,
    company: {
      name: realtor?.primaryCompany?.name,
      logo: realtor?.primaryCompany?.logo,
      businessId: realtor?.primaryCompany?.businessId,
      privacyLink: realtor?.primaryCompany?.privacyProtectionLink,
    },
  };
}

/**
 * Calculate debt portion
 */
/**
 * Calculate debt portion using Finnish real estate formula:
 * Velkaosuus = Velaton hinta - Myyntihinta
 * (Debt portion = Unencumbered price - Sales price)
 */
export function calculateDebtPortion(linearData: LinearAPIListing): number {
  const data = linearData as any;
  const askPrice = parseEuroNumber(data?.nonLocalizedValues?.askPrice);
  const debtFreePrice = parseEuroNumber(data?.nonLocalizedValues?.debtFreePrice);
  
  // Finnish formula: Velkaosuus = Velaton hinta - Myyntihinta
  return Math.max(0, debtFreePrice - askPrice);
}

/**
 * Get all amenity flags as boolean object
 */
export function extractAmenities(linearData: LinearAPIListing) {
  const data = linearData as any;
  const nv = data.nonLocalizedValues || {};
  
  return {
    sauna: nv.sauna ?? false,
    balcony: nv.hasBalcony ?? false,
    parking: nv.hasParkingSpace ?? false,
    petsAllowed: nv.petsAllowed ?? false,
    smokingAllowed: nv.smokingAllowed ?? false,
    newlyConstructed: nv.newlyConstructed ?? false,
    highCeilings: nv.hasHighCeilings ?? false,
    cableTv: nv.hasCableTv ?? false,
    satelliteAntenna: nv.hasSatelliteAntenna ?? false,
    energyCertificate: nv.listingHasEnergyCertificate ?? false,
  };
}

/**
 * Get renovation history with years
 */
export function extractRenovationHistory(linearData: LinearAPIListing): {
  electrical?: number;
  sewer?: number;
  waterPipe?: number;
  roof?: number;
  facade?: number;
} {
  const data = linearData as any;
  const nv = data.nonLocalizedValues || {};
  
  return {
    electrical: nv.electricalSystemRenovationYear,
    sewer: nv.sewerSystemRenovationYear,
    waterPipe: nv.waterPipeRenovationYear,
    roof: nv.roofRenovationYear,
    facade: nv.facadeRenovationYear,
  };
}

/**
 * Validate required fields
 */
export function validateLinearAPIListing(linearData: LinearAPIListing): {
  isValid: boolean;
  missingFields: string[];
} {
  const requiredFields = [
    'id',
    'address',
    'city',
    'heading',
    'askPrice',
  ];
  
  const missingFields = requiredFields.filter(field => !linearData[field]?.fi?.value);
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

