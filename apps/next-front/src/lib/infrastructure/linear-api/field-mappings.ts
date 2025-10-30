/**
 * LINEAR API FIELD MAPPING BLUEPRINT
 * 
 * This file defines how each field from Linear API maps to our Property domain model.
 * Benefits:
 * - Self-documenting: See all mappings in one place
 * - Easy to add new fields
 * - Type-safe with TypeScript
 * - Easy to spot missing mappings
 * 
 * Based on: DENNIS_IMPLEMENTATIONSLISTA_DETALJERAD.md
 */

import type { LinearListing } from './types';

// ============================================================================
// FIELD MAPPING TYPES
// ============================================================================

export type FieldType = 
  | 'string'           // Plain string
  | 'localized'        // LocalizedValue (fi/sv/en)
  | 'number'           // Numeric value
  | 'euro'             // Currency (needs parseEuro)
  | 'boolean'          // Boolean (needs toBool)
  | 'date'             // Date string
  | 'status'           // Property status enum
  | 'energy-status'    // Energy certificate status
  | 'coordinates'      // Lat/lon object
  | 'images'           // Image array
  | 'agent';           // Agent object

export interface FieldMapping {
  /** Property domain field path (e.g. 'pricing.sales') */
  target: string;
  
  /** Linear API field names to try (in order of priority) */
  sources: string[];
  
  /** Type of field (determines how to parse/transform) */
  type: FieldType;
  
  /** Whether this field is required */
  required?: boolean;
  
  /** Default value if all sources are empty */
  defaultValue?: any;
  
  /** Additional notes/comments */
  notes?: string;
}

// ============================================================================
// 1. BASIC INFORMATION (Basinformation)
// ============================================================================

export const BASIC_INFO_MAPPINGS: FieldMapping[] = [
  {
    target: 'address',
    sources: ['address'],
    type: 'localized',
    required: true,
    notes: 'Street address - always localized'
  },
  {
    target: 'city',
    sources: ['city'],
    type: 'localized',
    required: true,
    notes: 'City name - always localized'
  },
  {
    target: 'postalCode',
    sources: ['postalCode'],
    type: 'string',
    required: true,
    notes: 'Postal code - show "—" if empty in UI'
  },
  {
    target: 'meta.identifierFi',
    sources: ['identifier', 'propertyId'],
    type: 'string',
    notes: 'Kohdenumero (Finnish identifier) - optional, hide if empty'
  },
  {
    target: 'meta.typeCode',
    sources: ['listingType'],
    type: 'string',
    required: true,
    notes: 'Raw listing type code (KERROSTALO, OMAKOTITALO, etc.)'
  },
  {
    target: 'meta.apartmentType',
    sources: ['typeOfApartment'],
    type: 'localized',
    notes: 'Huoneistoselitelmä - show "—" if empty'
  },
  {
    target: 'description',
    sources: ['freeText', 'marketingDescription'],
    type: 'localized',
    notes: 'Main property description'
  },
  {
    target: 'descriptionTitle',
    sources: ['freeTextTitle'],
    type: 'localized',
    notes: 'Description title/heading'
  }
];

// ============================================================================
// 2. APARTMENT INFO (Huoneistotiedot)
// ============================================================================

export const APARTMENT_INFO_MAPPINGS: FieldMapping[] = [
  {
    target: 'meta.floor',
    sources: ['floor', 'floorLocation'],
    type: 'string',
    notes: 'Floor number - always visible, show "Ej angivet" if empty'
  },
  {
    target: 'meta.floorsTotal',
    sources: ['floorCount'],
    type: 'number',
    notes: 'Total floors in building - hide if 0'
  },
  {
    target: 'meta.elevator',
    sources: ['housingCooperativeElevator', 'elevator'],
    type: 'boolean',
    notes: 'Elevator availability - always show Ja/Nej'
  },
  {
    target: 'features.balcony',
    sources: ['hasBalcony', 'balcony'],
    type: 'boolean',
    notes: 'Has balcony - hide if false'
  },
  {
    target: 'features.sauna',
    sources: ['sauna'],
    type: 'boolean',
    notes: 'Has sauna - hide if false'
  },
  {
    target: 'features.terrace',
    sources: ['hasTerrace', 'terrace'],
    type: 'boolean',
    notes: 'Has terrace - hide if false'
  },
  {
    target: 'features.fireplace',
    sources: ['fireplace'],
    type: 'boolean',
    notes: 'Has fireplace - hide if false'
  },
  {
    target: 'features.storageRoom',
    sources: ['storageRoom'],
    type: 'boolean',
    notes: 'Has storage room - hide if false'
  },
  {
    target: 'features.parkingSpace',
    sources: ['hasParkingSpace', 'parkingSpace'],
    type: 'boolean',
    notes: 'Has parking space - hide if false'
  },
  {
    target: 'meta.condition',
    sources: ['condition'],
    type: 'localized',
    notes: 'Property condition (Hyvä, Uudehko, etc.) - translate to target language'
  },
  {
    target: 'meta.availableFrom',
    sources: ['availableFrom', 'freeOnText'],
    type: 'localized',
    defaultValue: { fi: 'Ei ilmoitettu', sv: 'Ej angivet', en: 'Not specified' },
    notes: 'Availability date'
  },
  {
    target: 'dimensions.rooms',
    sources: ['rooms', 'roomCount'],
    type: 'string',
    notes: 'Number of rooms (e.g., "3h+k")'
  },
  {
    target: 'dimensions.bedrooms',
    sources: ['numberOfBedrooms', 'bedroomCount'],
    type: 'number',
    notes: 'Number of bedrooms'
  },
  {
    target: 'dimensions.bathrooms',
    sources: ['numberOfBathrooms', 'bathroomCount'],
    type: 'number',
    notes: 'Number of bathrooms'
  }
];

// ============================================================================
// 3. BUILDING INFO (Yhtiö- & Rakennustiedot)
// ============================================================================

export const BUILDING_INFO_MAPPINGS: FieldMapping[] = [
  {
    target: 'meta.yearBuilt',
    sources: ['yearBuilt', 'completeYear', 'constructionYear'],
    type: 'number',
    notes: 'Construction year - always visible, show placeholder if empty'
  },
  {
    target: 'meta.energyClass',
    sources: ['energyClass'],
    type: 'string',
    notes: 'Energy class (A, B, C, etc.) - always visible'
  },
  {
    target: 'meta.energyCertStatus',
    sources: ['listingHasEnergyCertificate'],
    type: 'energy-status',
    notes: 'Energy certificate status - use normalizeEnergyStatus()'
  },
  {
    target: 'meta.heatingSystem',
    sources: ['heatingSystem'],
    type: 'localized',
    notes: 'Heating system type - always visible'
  },
  {
    target: 'meta.ventilationSystem',
    sources: ['ventilationSystem'],
    type: 'localized',
    notes: 'Ventilation system - show "—" if missing'
  },
  {
    target: 'meta.housingCompany.name',
    sources: ['housingCooperativeName'],
    type: 'localized',
    notes: 'Housing company name - always visible'
  },
  {
    target: 'meta.housingCompany.loans',
    sources: ['companyLoans', 'taloyhtionLainat'],
    type: 'euro',
    notes: 'Company loans - show 0 as "—"'
  },
  {
    target: 'meta.housingCompany.encumbrances',
    sources: ['housingCooperativeMortgage', 'propertyMortgage', 'encumbranceAmount'],
    type: 'euro',
    notes: 'Company encumbrances/mortgages'
  },
  {
    target: 'meta.housingCompany.loansDate',
    sources: ['housingCooperativeMortgageDate', 'propertyManagerCertificateDate'],
    type: 'date',
    notes: 'Date of company loans certificate'
  },
  {
    target: 'meta.plotOwnership',
    sources: ['siteOwnershipType', 'lotOwnership'],
    type: 'localized',
    defaultValue: { fi: 'Oma', sv: 'Egen', en: 'Own' },
    notes: 'Plot ownership type - always visible'
  },
  {
    target: 'meta.housingTenure',
    sources: ['housingTenure'],
    type: 'localized',
    defaultValue: { fi: 'Asunto-osakeyhtiö', sv: 'Bostadsaktiebolag', en: 'Housing cooperative' },
    notes: 'Tenure type - always visible'
  }
];

// ============================================================================
// 4. PRICING & COSTS (Kustannukset)
// ============================================================================

export const PRICING_MAPPINGS: FieldMapping[] = [
  {
    target: 'pricing.debtFree',
    sources: ['debtFreePrice'],
    type: 'euro',
    required: true,
    notes: 'Debt-free price'
  },
  {
    target: 'pricing.sales',
    sources: ['askPrice'],
    type: 'euro',
    required: true,
    notes: 'Sales price (asking price)'
  },
  {
    target: 'pricing.propertyTax',
    sources: ['propertyTax', 'realEstateTax'],
    type: 'euro',
    notes: 'Property tax - ONLY for properties (not apartments)'
  },
  {
    target: 'fees.maintenance',
    sources: ['renovationCharge', 'maintenanceCharge'],
    type: 'euro',
    notes: 'Maintenance fee (hoitovastike)'
  },
  {
    target: 'fees.financing',
    sources: ['fundingCharge', 'financingCharge'],
    type: 'euro',
    notes: 'Financing fee (rahoitusvastike)'
  },
  {
    target: 'fees.water',
    sources: ['waterCharge'],
    type: 'euro',
    notes: 'Water fee'
  },
  {
    target: 'fees.heating',
    sources: ['heatingCharge', 'averageTotalHeatingCharge', 'electricHeatingCharge'],
    type: 'euro',
    notes: 'Heating fee'
  },
  {
    target: 'fees.electricity',
    sources: ['electricHeatingCharge'],
    type: 'euro',
    notes: 'Electricity fee'
  },
  {
    target: 'fees.parking',
    sources: ['parkingCharge'],
    type: 'euro',
    notes: 'Parking fee'
  },
  {
    target: 'fees.sauna',
    sources: ['saunaCharge'],
    type: 'euro',
    notes: 'Sauna fee'
  }
];

// ============================================================================
// 5. DIMENSIONS (Areas)
// ============================================================================

export const DIMENSION_MAPPINGS: FieldMapping[] = [
  {
    target: 'dimensions.living',
    sources: ['area'],
    type: 'number',
    required: true,
    notes: 'Living area in m²'
  },
  {
    target: 'dimensions.total',
    sources: ['totalArea'],
    type: 'number',
    notes: 'Total area in m²'
  },
  {
    target: 'dimensions.plot',
    sources: ['plotArea', 'lotArea'],
    type: 'number',
    notes: 'Plot area in m² (show in ha if ≥ 10,000 m²)'
  },
  {
    target: 'dimensions.balcony',
    sources: ['balconyArea'],
    type: 'number',
    notes: 'Balcony area in m²'
  },
  {
    target: 'dimensions.terrace',
    sources: ['terraceArea'],
    type: 'number',
    notes: 'Terrace area in m²'
  }
];

// ============================================================================
// 6. PROPERTY-SPECIFIC (Fastigheter)
// ============================================================================

export const PROPERTY_SPECIFIC_MAPPINGS: FieldMapping[] = [
  {
    target: 'meta.propertyIdentifier',
    sources: ['propertyIdentifier', 'estateName'],
    type: 'string',
    notes: 'Kiinteistötunnus - property identifier'
  },
  {
    target: 'meta.propertyBuildingRights',
    sources: ['propertyBuildingRights', 'buildingRights'],
    type: 'string',
    notes: 'Rakennusoikeus - building rights, hide if empty'
  },
  {
    target: 'meta.restrictions',
    sources: ['restrictions'],
    type: 'localized',
    notes: 'Rasitteet - encumbrances/easements, hide if empty'
  },
  {
    target: 'meta.zoning',
    sources: ['zoningStatus'],
    type: 'localized',
    notes: 'Kaavatilanne - zoning status, always visible'
  }
];

// ============================================================================
// 7. RENTAL (Vuokrakohteet)
// ============================================================================

export const RENTAL_MAPPINGS: FieldMapping[] = [
  {
    target: 'rental.monthlyRent',
    sources: ['rent'],
    type: 'euro',
    notes: 'Monthly rent'
  },
  {
    target: 'rental.securityDeposit',
    sources: ['securityDeposit'],
    type: 'localized',
    notes: 'Security deposit (show text + amount)'
  },
  {
    target: 'rental.contractType',
    sources: ['rentalContractType'],
    type: 'localized',
    notes: 'Contract type - show "Ei ilmoitettu" if empty'
  },
  {
    target: 'rental.earliestTermination',
    sources: ['earliestTermination', 'earliestTerminateDate'],
    type: 'localized',
    notes: 'Earliest termination date'
  },
  {
    target: 'rental.petsAllowed',
    sources: ['petsAllowed'],
    type: 'boolean',
    notes: 'Pets allowed'
  },
  {
    target: 'rental.smokingAllowed',
    sources: ['smokingAllowed'],
    type: 'boolean',
    notes: 'Smoking allowed'
  }
];

// ============================================================================
// 8. DOCUMENTS & MEDIA
// ============================================================================

export const MEDIA_MAPPINGS: FieldMapping[] = [
  {
    target: 'media.images',
    sources: ['images'],
    type: 'images',
    notes: 'Property images array'
  },
  {
    target: 'media.coordinates',
    sources: ['mapCoordinates', 'latitude', 'longitude'],
    type: 'coordinates',
    notes: 'Map coordinates (lat/lon)'
  },
  {
    target: 'documents.floorPlan',
    sources: ['floorPlanUrl'],
    type: 'localized',
    notes: 'Floor plan URL'
  },
  {
    target: 'documents.brochure',
    sources: ['brochureUrl', 'propertyBrochureUrl'],
    type: 'localized',
    notes: 'Brochure URL'
  },
  {
    target: 'documents.brochureIntl',
    sources: ['internationalBrochureUrl'],
    type: 'localized',
    notes: 'International brochure URL'
  },
  {
    target: 'documents.video',
    sources: ['videoUrl'],
    type: 'localized',
    notes: 'Video URL'
  },
  {
    target: 'documents.energyCert',
    sources: ['energyCertificateUrl'],
    type: 'localized',
    notes: 'Energy certificate URL'
  }
];

// ============================================================================
// 9. AGENT INFO
// ============================================================================

export const AGENT_MAPPINGS: FieldMapping[] = [
  {
    target: 'agent',
    sources: ['agent', 'realtor'],
    type: 'agent',
    notes: 'Agent/realtor information - handled specially'
  }
];

// ============================================================================
// 10. META STATUS
// ============================================================================

export const STATUS_MAPPINGS: FieldMapping[] = [
  {
    target: 'meta.status',
    sources: ['status'],
    type: 'status',
    notes: 'Property status (ACTIVE, SOLD, RESERVED)'
  },
  {
    target: 'meta.rent',
    sources: ['rent'],
    type: 'euro',
    notes: 'Rent value (used to determine if rental property)'
  }
];

// ============================================================================
// COMBINED MAPPINGS (All in one for easy access)
// ============================================================================

export const ALL_FIELD_MAPPINGS: FieldMapping[] = [
  ...BASIC_INFO_MAPPINGS,
  ...APARTMENT_INFO_MAPPINGS,
  ...BUILDING_INFO_MAPPINGS,
  ...PRICING_MAPPINGS,
  ...DIMENSION_MAPPINGS,
  ...PROPERTY_SPECIFIC_MAPPINGS,
  ...RENTAL_MAPPINGS,
  ...MEDIA_MAPPINGS,
  ...AGENT_MAPPINGS,
  ...STATUS_MAPPINGS
];

// ============================================================================
// MAPPING CATEGORIES (for documentation/debugging)
// ============================================================================

export const MAPPING_CATEGORIES = {
  'Basic Information': BASIC_INFO_MAPPINGS,
  'Apartment Info': APARTMENT_INFO_MAPPINGS,
  'Building Info': BUILDING_INFO_MAPPINGS,
  'Pricing & Costs': PRICING_MAPPINGS,
  'Dimensions': DIMENSION_MAPPINGS,
  'Property-Specific': PROPERTY_SPECIFIC_MAPPINGS,
  'Rental': RENTAL_MAPPINGS,
  'Media & Documents': MEDIA_MAPPINGS,
  'Agent': AGENT_MAPPINGS,
  'Status': STATUS_MAPPINGS
} as const;

// ============================================================================
// UTILITY: Get mapping by target field
// ============================================================================

export function getMappingForField(targetField: string): FieldMapping | undefined {
  return ALL_FIELD_MAPPINGS.find(m => m.target === targetField);
}

// ============================================================================
// UTILITY: Get all source fields (for debugging)
// ============================================================================

export function getAllSourceFields(): string[] {
  const sources = new Set<string>();
  ALL_FIELD_MAPPINGS.forEach(mapping => {
    mapping.sources.forEach(source => sources.add(source));
  });
  return Array.from(sources).sort();
}

// ============================================================================
// UTILITY: Get unmapped Linear fields
// ============================================================================

export function getUnmappedFields(linearListing: LinearListing): string[] {
  const allSourceFields = new Set(getAllSourceFields());
  const linearFields = Object.keys(linearListing);
  
  return linearFields.filter(field => !allSourceFields.has(field));
}

