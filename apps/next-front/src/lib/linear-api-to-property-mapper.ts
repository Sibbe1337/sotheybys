/**
 * Linear API to Multilingual Property Mapper
 * Converts Linear.fi API responses to MultilingualPropertyListing format
 * 
 * This mapper handles the conversion between Linear.fi's API structure
 * (with localized fields and nonLocalizedValues) and our comprehensive
 * multilingual property listing schema.
 */

import {
  MultilingualPropertyListing,
  LocalizedString,
  SupportedLanguage,
} from './property-types-multilang';
import { CompleteLinearAPIListing } from './linear-api-complete-interface';

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
  
  // Agent
  realtor: LinearAPIRealtor;
  
  // Non-localized actual values
  nonLocalizedValues: LinearAPINonLocalizedValues;
  
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
  if (!field) return {};
  
  return {
    fi: field.fi?.value,
    en: field.en?.value,
    sv: field.sv?.value,
  };
}

/**
 * Parse numeric value from string
 */
function parseNumericValue(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  
  // Remove spaces and convert to number
  const cleaned = value.replace(/\s/g, '');
  return parseFloat(cleaned) || 0;
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
  const nv = linearData.nonLocalizedValues;
  
  return {
    // ========================================================================
    // 1. GENERAL PROPERTY INFO
    // ========================================================================
    apartmentType: extractLocalizedString(linearData.propertyType),
    streetAddress: extractLocalizedString(linearData.address),
    postalCode: linearData.postalCode?.fi?.value || '',
    city: extractLocalizedString(linearData.city),
    region: extractLocalizedString(linearData.region),
    heading: extractLocalizedString(linearData.heading),
    description: extractLocalizedString(linearData.description),
    releaseDate: linearData.releaseDate?.fi?.value 
      ? new Date(linearData.releaseDate.fi.value) 
      : new Date(),
    availableFrom: extractLocalizedString(linearData.availableFrom),
    ownershipType: extractLocalizedString(linearData.ownershipType),
    floorLocation: extractLocalizedString(linearData.floor),
    numberOfFloors: linearData.totalFloors?.fi?.value || nv.totalFloors?.toString() || '',
    windowDirection: extractLocalizedString(linearData.windowDirection),
    balcony: nv.hasBalcony ?? false,
    sauna: nv.sauna ?? false,
    condition: nv.condition 
      ? mapCondition(nv.condition)
      : extractLocalizedString(linearData.condition),
    yearOfBuilding: nv.completeYear || parseNumericValue(linearData.completeYear?.fi?.value),
    roofType: extractLocalizedString(linearData.roofType),
    heatingSystem: extractLocalizedString(linearData.heatingType),
    ventilationSystem: extractLocalizedString(linearData.ventilationType),
    buildingMaterial: extractLocalizedString(linearData.constructionMaterial),
    energyClass: nv.energyClass || linearData.energyClass?.fi?.value || '',
    energyCertificate: nv.listingHasEnergyCertificate ?? false,

    // ========================================================================
    // 2. DIMENSIONS AND USAGE
    // ========================================================================
    livingArea: parseNumericValue(nv.area || linearData.livingArea?.fi?.value),
    totalArea: parseNumericValue(nv.totalArea || linearData.totalArea?.fi?.value),
    volume: parseNumericValue(nv.volume || linearData.volume?.fi?.value),
    numberOfApartments: 0, // Not directly available in Linear API
    businessSpaces: {}, // Not directly available
    siteArea: parseNumericValue(nv.plotArea || linearData.plotArea?.fi?.value),
    siteOwnershipType: extractLocalizedString(linearData.plotOwnership),
    zoningSituation: extractLocalizedString(linearData.zoningSituation),
    zoningDetails: {}, // Not directly available

    // ========================================================================
    // 3. FINANCIAL DATA
    // ========================================================================
    salesPrice: parseNumericValue(nv.askPrice || linearData.askPrice?.fi?.value),
    debtPart: 0, // Calculate: askPrice - debtFreePrice
    unencumberedSalesPrice: parseNumericValue(nv.debtFreePrice || linearData.debtFreePrice?.fi?.value),
    loanPayable: false, // Not directly available
    maintenanceFee: parseNumericValue(nv.renovationCharge || linearData.maintenanceCharge?.fi?.value),
    financingFee: parseNumericValue(nv.fundingCharge || linearData.financingCharge?.fi?.value),
    totalFee: parseNumericValue(nv.renovationCharge) + parseNumericValue(nv.fundingCharge),
    rentIncome: 0, // Not directly available
    waterFee: 0, // Typically included in maintenance fee
    electricityCost: parseNumericValue(nv.electricHeatingCharge),
    heatingCost: parseNumericValue(nv.averageTotalHeatingCharge),
    cleaningCost: 0, // Not directly available
    propertyTax: parseNumericValue(nv.propertyTax),
    otherFees: {}, // Could aggregate parking, sauna, broadband charges
    paymentMethod: {}, // Not directly available

    // ========================================================================
    // 4. COMPANY / MANAGEMENT
    // ========================================================================
    housingCompanyName: linearData.housingCompanyName?.fi?.value || '',
    businessId: linearData.businessId?.fi?.value || '',
    managementCompany: linearData.managementCompany?.fi?.value || '',
    propertyMaintenance: '', // Not directly available
    managerName: '', // Not directly available
    managerPhone: '', // Not directly available
    managerEmail: '', // Not directly available
    ownershipStatus: extractLocalizedString(linearData.ownershipType),
    numberOfShares: linearData.shareNumbers?.fi?.value || '',
    redemptionClauseFlats: false, // Not directly available
    redemptionClauseParking: false, // Not directly available
    companyLoans: 0, // Not directly available
    companyIncome: 0, // Not directly available
    constructionYear: nv.completeYear || parseNumericValue(linearData.completeYear?.fi?.value),
    totalApartments: 0, // Not directly available
    totalBusinessSpaces: 0, // Not directly available
    sharedSpaces: {}, // Not directly available
    asbestosSurvey: false, // Not directly available
    repairHistory: {}, // Could use renovation year fields
    upcomingRepairs: {}, // Not directly available

    // ========================================================================
    // 5. TECHNICAL AND ENVIRONMENTAL
    // ========================================================================
    sewerSystem: extractLocalizedString(linearData.sewerSystem),
    waterConnection: extractLocalizedString(linearData.waterSystem),
    broadband: nv.hasCableTv ?? false,
    antennaSystem: extractLocalizedString(linearData.antennaSystem),
    propertyRestrictions: {}, // Not directly available
    terrainDescription: {}, // Not directly available
    soilAndVegetation: {}, // Not directly available
    buildingRights: {}, // Not directly available
    easementsAndRights: {}, // Not directly available
    propertyId: linearData.propertyId?.fi?.value || '',
    landRegisterNumber: '', // Not directly available
    municipality: extractLocalizedString(linearData.municipality),
    villageOrDistrict: extractLocalizedString(linearData.region),
    blockNumber: '', // Not directly available
    leaseTerm: {}, // Not directly available
    annualLease: 0, // Not directly available

    // ========================================================================
    // 6. LISTING AND AGENT INFO
    // ========================================================================
    estateAgentName: linearData.realtor?.name || '',
    estateAgentPhone: linearData.realtor?.tel || '',
    estateAgentEmail: linearData.realtor?.email || '',
    showingDate: linearData.showingDate?.fi?.value 
      ? new Date(linearData.showingDate.fi.value) 
      : new Date(),
    showingTime: linearData.showingTime?.fi?.value || '',
    listingOffice: linearData.realtor?.primaryCompany?.name || '',
    listingSourceUrl: '', // Not directly available
    photoUrls: linearData.images
      ?.filter(img => !img.isFloorPlan)
      .map(img => img.compressed || img.url) || [],
    floorPlanUrl: linearData.floorPlanUrl || 
      linearData.images?.find(img => img.isFloorPlan)?.url || '',
    brochureUrl: linearData.brochureUrl || '',

    // ========================================================================
    // 7. METADATA
    // ========================================================================
    parsingDate: new Date(),
    sourceType: 'LINEAR_API',
    sourceFilename: `linear-${linearData.id?.fi?.value || 'unknown'}.json`,
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
  const images = linearData.images || [];
  
  return {
    gallery: images
      .filter(img => !img.isFloorPlan)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(img => img.compressed || img.url),
    floorPlans: images
      .filter(img => img.isFloorPlan)
      .map(img => img.compressed || img.url),
    thumbnails: images
      .filter(img => !img.isFloorPlan)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(img => img.thumbnail),
  };
}

/**
 * Extract agent/realtor information
 */
export function extractAgentInfo(linearData: LinearAPIListing) {
  const { realtor } = linearData;
  
  return {
    id: realtor?.id,
    name: realtor?.name,
    phone: realtor?.tel,
    email: realtor?.email,
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
export function calculateDebtPortion(linearData: LinearAPIListing): number {
  const askPrice = parseNumericValue(linearData.nonLocalizedValues.askPrice);
  const debtFreePrice = parseNumericValue(linearData.nonLocalizedValues.debtFreePrice);
  
  return Math.max(0, askPrice - debtFreePrice);
}

/**
 * Get all amenity flags as boolean object
 */
export function extractAmenities(linearData: LinearAPIListing) {
  const nv = linearData.nonLocalizedValues;
  
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
  const nv = linearData.nonLocalizedValues;
  
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

