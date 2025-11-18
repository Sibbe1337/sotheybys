export type LinearLocalized = 
  | { fi?: { value?: string } | string; sv?: { value?: string } | string; en?: { value?: string } | string }
  | string
  | undefined;

export interface LinearNV {
  [k: string]: any;
}

export interface LinearListing {
  id?: any;
  slug?: any;
  address?: LinearLocalized;
  city?: LinearLocalized;
  district?: LinearLocalized;          // Stadsdel/District (e.g., Lauttasaari)
  districtFree?: LinearLocalized;      // Alternative field name for district
  postalCode?: LinearLocalized;
  gate?: LinearLocalized;              // Rappu/Staircase (e.g., "C")
  apartmentNumber?: LinearLocalized;   // Huoneisto/Apartment number (e.g., "47")

  nonLocalizedValues?: LinearNV;

  // Rich content (NEW Phase 3)
  freeText?: LinearLocalized;            // Description
  freeTextTitle?: LinearLocalized;       // Description title
  marketingDescription?: LinearLocalized; // Alternative description field

  // pricing
  askPrice?: LinearLocalized;
  debtFreePrice?: LinearLocalized;
  propertyTax?: LinearLocalized;         // Kiinteistövero (ONLY for properties)
  realEstateTax?: LinearLocalized;       // Alternative field name
  
  // Tarjouskauppa (bidding) - Dennis 2025-11-11
  debtlessStartPrice?: LinearLocalized;  // Tarjouskaupan velaton lähtöhinta
  biddingUrl?: string;                   // Link to bidding page

  // dimensions
  area?: LinearLocalized;
  totalArea?: LinearLocalized;
  overallArea?: LinearLocalized;         // Alternative field for total area
  plotArea?: LinearLocalized;
  businessPremiseArea?: LinearLocalized; // Toimitilan pinta-ala (commercial) - Dennis 2025-11-11
  balconyArea?: LinearLocalized;         // NEW Phase 3
  terraceArea?: LinearLocalized;         // NEW Phase 3
  rooms?: LinearLocalized;               // NEW Phase 3 (e.g. "3h+k")
  numberOfRooms?: LinearLocalized;       // NEW Phase 3
  numberOfBedrooms?: LinearLocalized;    // NEW Phase 3
  numberOfBathrooms?: LinearLocalized;   // NEW Phase 3

  // fees (NEW Phase 3)
  maintenanceCharge?: LinearLocalized;   // Hoitovastike
  renovationCharge?: LinearLocalized;    // Alternative field for maintenance
  fundingCharge?: LinearLocalized;       // Rahoitusvastike
  financingCharge?: LinearLocalized;     // Alternative field
  waterCharge?: LinearLocalized;
  heatingCharge?: LinearLocalized;
  electricHeatingCharge?: LinearLocalized;
  averageTotalHeatingCharge?: LinearLocalized;
  parkingCharge?: LinearLocalized;
  saunaCharge?: LinearLocalized;

  // meta
  status?: LinearLocalized;              // NEW Phase 3 (ACTIVE/SOLD/RESERVED)
  listingType?: LinearLocalized;         // Primary type field (Objekttyp: KERROSTALO, PARITALO, etc)
  propertyType?: LinearLocalized;        // Fallback type field
  type?: LinearLocalized;                // Alternative type field
  productGroup?: LinearLocalized;        // Produktgrupp: APARTMENTS, PROPERTIES, etc - Dennis 2025-11-18
  typeOfApartment?: LinearLocalized;
  energyClass?: LinearLocalized;
  energyClassInfo?: LinearLocalized;
  listingHasEnergyCertificate?: LinearLocalized;
  heatingSystem?: LinearLocalized;
  ventilationSystem?: LinearLocalized;
  ownershipType?: LinearLocalized;
  siteOwnershipType?: LinearLocalized;
  housingTenure?: LinearLocalized;
  availableFrom?: LinearLocalized;
  zoningStatus?: LinearLocalized;
  yearBuilt?: any;
  floorCount?: any;
  floor?: LinearLocalized;               // NEW Phase 3
  floorLocation?: LinearLocalized;       // Alternative field
  elevator?: any;
  housingCooperativeElevator?: any;

  housingCooperativeName?: LinearLocalized;
  companyLoans?: any;
  taloyhtionLainat?: any;
  housingCooperativeMortgage?: any;
  propertyMortgage?: any;
  encumbranceAmount?: any;
  housingCooperativeMortgageDate?: LinearLocalized;
  propertyManagerCertificateDate?: LinearLocalized;

  // rental
  rent?: LinearLocalized;
  securityDeposit?: LinearLocalized;     // NEW Phase 3
  rentalContractType?: LinearLocalized;  // NEW Phase 3
  earliestTermination?: LinearLocalized; // NEW Phase 3
  petsAllowed?: any;                     // NEW Phase 3
  smokingAllowed?: any;                  // NEW Phase 3

  // features (NEW Phase 3 - typically in nonLocalizedValues)
  hasBalcony?: any;
  balcony?: any;
  hasTerrace?: any;
  terrace?: any;
  sauna?: any;
  fireplace?: any;
  storageRoom?: any;
  hasParkingSpace?: any;
  parkingSpace?: any;

  // coordinates (NEW Phase 3)
  latitude?: LinearLocalized;
  longitude?: LinearLocalized;
  mapCoordinates?: LinearLocalized;
  coordinates?: LinearLocalized;

  // media
  images?: {
    url: string;
    thumbnail?: string;
    compressed?: string;
    isFloorPlan?: boolean;
  }[];

  // documents (NEW Phase 3)
  floorPlanUrl?: LinearLocalized;
  brochureUrl?: LinearLocalized;
  propertyBrochureUrl?: LinearLocalized;
  virtualTourUrl?: LinearLocalized; // "Virtuell visning" i Linear CMS
  internationalBrochureUrl?: LinearLocalized;
  videoUrl?: LinearLocalized;
  energyCertificateUrl?: LinearLocalized;
  
  // Generic links array (NEW - Linear CMS "Länkar" field)
  links?: Array<{
    url: string;
    title?: string;
    locale?: string;
  }> | LinearLocalized;

  // agent / realtor (Linear API uses both field names)
  estateAgentName?: any;
  estateAgentPhone?: any;
  estateAgentEmail?: any;
  agent?: {
    name?: string;
    phone?: string;
    email?: string;
    photo?: { sourceUrl?: string };
    avatar?: string;
    jobTitle?: string;
  };
  realtor?: {
    id?: number;
    name?: string;
    email?: string;
    jobTitle?: string;
    avatar?: string;
    tel?: string;
    primaryCompany?: {
      id?: number;
      name?: string;
      businessId?: string;
      address?: string;
      postNumber?: string;
      postOffice?: string;
      logo?: string;
    };
  };
  realtorName?: string;
}

