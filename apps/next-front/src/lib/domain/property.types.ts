export type Locale = 'fi' | 'sv' | 'en';

export interface LocalizedValue<T = string> {
  fi: T;
  sv?: T;
  en?: T;
}

export interface Property {
  id: string;
  slug: string;

  // Basic info
  address: LocalizedValue;
  city: LocalizedValue;
  district?: LocalizedValue;  // Stadsdel (e.g., Lauttasaari)
  postalCode: string;
  apartmentIdentifier?: string;  // e.g., "C 47" (gate + apartment number)
  gate?: string;                 // e.g., "C" (only staircase letter)

  // Rich content (NEW in Phase 3)
  description?: LocalizedValue;       // freeText / marketingDescription
  descriptionTitle?: LocalizedValue;  // freeTextTitle

  // Pricing
  pricing: {
    sales: number;      // Myyntihinta
    debtFree: number;   // Velaton hinta
    debt: number;       // debtFree - sales (>=0)
    propertyTax?: number; // Kiinteistövero (ONLY for properties, NOT apartments)
  };

  // Dimensions (expanded in Phase 3)
  dimensions: {
    living: number;      // m² - Asuinpinta-ala
    total?: number;      // m² - Kokonaispinta-ala
    plot?: number;       // m² - Tontin pinta-ala
    balcony?: number;    // m² - Parvekkeen pinta-ala (NEW)
    terrace?: number;    // m² - Terassin pinta-ala (NEW)
    rooms?: string;      // e.g. "3h+k" (NEW)
    bedrooms?: number;   // Makuuhuoneet (NEW)
    bathrooms?: number;  // Kylpyhuoneet (NEW)
  };

  // Monthly fees (NEW in Phase 3)
  fees: {
    maintenance?: number;    // Hoitovastike
    financing?: number;      // Rahoitusvastike
    water?: number;          // Vesimaksu
    heating?: number;        // Lämmityskustannus
    electricity?: number;    // Sähkökustannus
    parking?: number;        // Autopaikkamaksu
    sauna?: number;          // Saunamaksu
  };

  // Property features (NEW in Phase 3)
  features: {
    balcony?: boolean;
    terrace?: boolean;
    sauna?: boolean;
    fireplace?: boolean;
    storageRoom?: boolean;
    parkingSpace?: boolean;
  };

  // Metadata
  meta: {
    status?: 'ACTIVE' | 'SOLD' | 'RESERVED';  // NEW for filtering
    typeCode?: string;               // KERROSTALO, MÖKKI_TAI_HUVILA, ... (raw code)
    listingTypeLabel?: LocalizedValue; // Localized listing type (Kerrostalo/Höghus/Apartment Building)
    
    // Basic metadata (NEW from blueprint)
    identifierFi?: string;           // Kohdenumero (Finnish property identifier)
    apartmentType?: LocalizedValue;  // Huoneistoselitelmä
    condition?: LocalizedValue;      // Skick (Hyvä, Uudehko, Tyydyttävä, etc.)
    
    // Energy & systems
    energyClass?: string;            // C2018, ...
    energyCertStatus?: 'HAS_CERTIFICATE' | 'NOT_REQUIRED_BY_LAW' | 'EXEMPT_BY_ACT' | null;
    heatingSystem?: LocalizedValue;
    ventilationSystem?: LocalizedValue;
    
    // Ownership & tenure
    ownershipType?: LocalizedValue;        // Omistusmuoto
    plotOwnership?: LocalizedValue;        // Tontin omistus
    housingTenure?: LocalizedValue;        // Hallintamuoto
    
    // Property-specific (for houses/plots)
    propertyIdentifier?: string;           // Kiinteistötunnus
    propertyBuildingRights?: string;       // Rakennusoikeus
    restrictions?: LocalizedValue;         // Rasitteet (encumbrances/easements)
    
    // Dates & availability
    availableFrom?: LocalizedValue;        // Vapautuminen (text eller datum som text)
    zoning?: LocalizedValue;               // Kaavoitus
    
    // Building details
    yearBuilt?: number;
    floorsTotal?: number;
    floor?: string;                        // Kerros (e.g. "3" or "3/5")
    elevator?: boolean | undefined;
    
    // Rental flag
    rent?: number;  // For rental properties
    
    // Housing company info
    housingCompany: {
      name?: LocalizedValue;
      loans?: number | null;          // Taloyhtiön lainat
      encumbrances?: number | null;   // Taloyhtiön kiinnitykset
      loansDate?: string | undefined; // 04.05.2025 ...
    };
  };

  // Media (expanded in Phase 3)
  media: {
    images: { url: string; thumb?: string; floorPlan?: boolean }[];
    coordinates?: {      // NEW for map rendering
      lat: number;
      lon: number;
    };
  };

  // Documents (NEW in Phase 3)
  documents: {
    floorPlan?: string;      // URL to floor plan PDF
    brochure?: string;       // URL to property brochure
    brochureIntl?: string;   // International brochure
    energyCert?: string;     // Energy certificate URL
    video?: string;          // YouTube/Vimeo URL
  };

  // Agent
  agent?: {
    name?: string;
    phone?: string;
    email?: string;
    photoUrl?: string;
    title?: string;
  };

  // Rental-specific (NEW in Phase 3)
  rental?: {
    monthlyRent: number;
    securityDeposit?: LocalizedValue;
    contractType?: LocalizedValue;
    earliestTermination?: LocalizedValue;
    noticePeriod?: LocalizedValue;         // Irtisanomisaika / Uppsägningstid
    additionalCostInfo?: LocalizedValue;   // Lisätietoja maksuista / Tilläggsinformation om kostnader
    petsAllowed?: boolean;
    smokingAllowed?: boolean;
  };
}

