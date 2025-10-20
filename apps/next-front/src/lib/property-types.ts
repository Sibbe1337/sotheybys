/**
 * Finnish Real Estate Listing Data Model
 * Sotheby's / Snellman Property Schema
 * 
 * This comprehensive type definition covers all fields extracted from
 * Finnish real estate XML/PDF listings, following clean architecture principles.
 */

// ============================================================================
// 1. GENERAL PROPERTY INFO / YLEISET KIINTEISTÖTIEDOT
// ============================================================================

/**
 * Main property listing interface containing all structured data
 * Pääasiallinen kiinteistölistauskäyttöliittymä, joka sisältää kaikki jäsennellyt tiedot
 */
export interface PropertyListing {
  // Basic Classification / Perustiedot
  /**
   * Type of apartment/property
   * Asunnon/kiinteistön tyyppi
   * Examples: "Osake" (share), "Kiinteistö" (real estate)
   */
  apartmentType: string;

  /**
   * Street address
   * Katuosoite
   */
  streetAddress: string;

  /**
   * Postal code
   * Postinumero
   */
  postalCode: string;

  /**
   * City name
   * Kaupunki
   */
  city: string;

  /**
   * Region or district
   * Alue tai kaupunginosa
   */
  region: string;

  /**
   * Listing title/heading
   * Ilmoituksen otsikko
   */
  heading: string;

  /**
   * Full property description (can contain HTML)
   * Täydellinen kiinteistön kuvaus (voi sisältää HTML:ää)
   */
  description: string;

  /**
   * Date when listing was released/published
   * Ilmoituksen julkaisupäivä
   */
  releaseDate: Date;

  /**
   * Date/text when property becomes available
   * Kiinteistön vapautumispäivä tai -teksti
   */
  availableFrom: string | Date;

  /**
   * Type of ownership
   * Omistusmuoto
   * Examples: "Oma" (owned), "Vuokra" (rented)
   */
  ownershipType: string;

  /**
   * Floor location (e.g., "3. krs", "Pohjakerros")
   * Kerros
   */
  floorLocation: string;

  /**
   * Total number of floors in building
   * Kerrosten lukumäärä rakennuksessa
   */
  numberOfFloors: string;

  /**
   * Window direction/orientation
   * Ikkunoiden suunta
   * Examples: "Etelä" (South), "Kaakkois-lounas"
   */
  windowDirection: string;

  /**
   * Has balcony
   * Parveke
   */
  balcony: boolean;

  /**
   * Has sauna
   * Sauna
   */
  sauna: boolean;

  /**
   * Property condition
   * Kunto
   * Examples: "Hyvä", "Erinomainen", "Remontoitu"
   */
  condition: string;

  /**
   * Year building was constructed
   * Rakennusvuosi
   */
  yearOfBuilding: number;

  /**
   * Roof type
   * Katon tyyppi
   * Examples: "Harjakatto", "Tasakatto"
   */
  roofType: string;

  /**
   * Heating system type
   * Lämmitysjärjestelmä
   * Examples: "Kaukolämpö", "Maalämpö", "Öljylämmitys"
   */
  heatingSystem: string;

  /**
   * Ventilation system type
   * Ilmanvaihtojärjestelmä
   * Examples: "Koneellinen tulo- ja poistoilmanvaihto", "Painovoimainen"
   */
  ventilationSystem: string;

  /**
   * Building material
   * Rakennusaine
   * Examples: "Tiili", "Betoni", "Puu"
   */
  buildingMaterial: string;

  /**
   * Energy efficiency class
   * Energialuokka
   * Examples: "A", "B", "C", "D", "E"
   */
  energyClass: string;

  /**
   * Has energy certificate
   * Energiatodistus olemassa
   */
  energyCertificate: boolean;

  // ============================================================================
  // 2. DIMENSIONS AND USAGE / MITAT JA KÄYTTÖTARKOITUS
  // ============================================================================

  /**
   * Living area in square meters
   * Asuinpinta-ala neliömetreinä
   */
  livingArea: number;

  /**
   * Total area in square meters
   * Kokonaispinta-ala neliömetreinä
   */
  totalArea: number;

  /**
   * Volume in cubic meters
   * Tilavuus kuutiometreinä
   */
  volume: number;

  /**
   * Number of apartments in building
   * Huoneistojen lukumäärä rakennuksessa
   */
  numberOfApartments: number;

  /**
   * Business/commercial spaces description
   * Liiketilojen kuvaus
   */
  businessSpaces: string;

  /**
   * Site/plot area in square meters
   * Tontin pinta-ala neliömetreinä
   */
  siteArea: number;

  /**
   * Site/plot ownership type
   * Tontin omistusmuoto
   * Examples: "Oma", "Vuokra"
   */
  siteOwnershipType: string;

  /**
   * Zoning situation
   * Kaavatilanne
   * Examples: "Asemakaava-alue", "Rantakaava"
   */
  zoningSituation: string;

  /**
   * Detailed zoning information
   * Yksityiskohtaiset kaavatiedot
   */
  zoningDetails: string;

  // ============================================================================
  // 3. FINANCIAL DATA / TALOUDELLISET TIEDOT
  // ============================================================================

  /**
   * Sales price in EUR
   * Myyntihinta euroina
   */
  salesPrice: number;

  /**
   * Debt part/portion in EUR
   * Velkaosuus euroina
   */
  debtPart: number;

  /**
   * Unencumbered/debt-free sales price in EUR
   * Velaton myyntihinta euroina
   */
  unencumberedSalesPrice: number;

  /**
   * Is loan payable by buyer
   * Onko laina maksettavissa
   */
  loanPayable: boolean;

  /**
   * Monthly maintenance fee in EUR
   * Kuukausittainen hoitovastike euroina
   */
  maintenanceFee: number;

  /**
   * Monthly financing fee in EUR
   * Kuukausittainen rahoitusvastike euroina
   */
  financingFee: number;

  /**
   * Total monthly fee (maintenance + financing) in EUR
   * Yhteensä kuukausittaiset maksut euroina
   */
  totalFee: number;

  /**
   * Monthly rent income in EUR
   * Kuukausittaiset vuokratulot euroina
   */
  rentIncome: number;

  /**
   * Water fee in EUR
   * Vesimaksu euroina
   */
  waterFee: number;

  /**
   * Electricity cost in EUR
   * Sähkökustannus euroina
   */
  electricityCost: number;

  /**
   * Heating cost in EUR
   * Lämmityskustannus euroina
   */
  heatingCost: number;

  /**
   * Cleaning cost in EUR
   * Siivouskulut euroina
   */
  cleaningCost: number;

  /**
   * Annual property tax in EUR
   * Vuotuinen kiinteistövero euroina
   */
  propertyTax: number;

  /**
   * Other fees description
   * Muut maksut kuvaus
   */
  otherFees: string;

  /**
   * Payment method
   * Maksutapa
   * Examples: "Tilisiirto", "Käteinen"
   */
  paymentMethod: string;

  // ============================================================================
  // 4. COMPANY / MANAGEMENT / YHTIÖ / HALLINTA
  // ============================================================================

  /**
   * Housing company name
   * Taloyhtiön nimi
   */
  housingCompanyName: string;

  /**
   * Business ID (Y-tunnus)
   * Y-tunnus
   */
  businessId: string;

  /**
   * Management company name
   * Isännöitsijä yhtiö
   */
  managementCompany: string;

  /**
   * Property maintenance company
   * Kiinteistönhuolto yhtiö
   */
  propertyMaintenance: string;

  /**
   * Property manager name
   * Isännöitsijän nimi
   */
  managerName: string;

  /**
   * Property manager phone
   * Isännöitsijän puhelin
   */
  managerPhone: string;

  /**
   * Property manager email
   * Isännöitsijän sähköposti
   */
  managerEmail: string;

  /**
   * Ownership status
   * Omistuksen tila
   * Examples: "Oma" (owned), "Vuokra" (rented)
   */
  ownershipStatus: string;

  /**
   * Number of shares
   * Osakkeiden lukumäärä
   */
  numberOfShares: string;

  /**
   * Redemption clause for apartments
   * Lunastuslauseke asunnoille
   */
  redemptionClauseFlats: boolean;

  /**
   * Redemption clause for parking
   * Lunastuslauseke pysäköinnille
   */
  redemptionClauseParking: boolean;

  /**
   * Company loans total in EUR
   * Yhtiölainat yhteensä euroina
   */
  companyLoans: number;

  /**
   * Company income in EUR
   * Yhtiön tulot euroina
   */
  companyIncome: number;

  /**
   * Construction year of building
   * Rakennuksen rakennusvuosi
   */
  constructionYear: number;

  /**
   * Total apartments in building
   * Asuntojen kokonaismäärä rakennuksessa
   */
  totalApartments: number;

  /**
   * Total business spaces in building
   * Liiketilojen kokonaismäärä rakennuksessa
   */
  totalBusinessSpaces: number;

  /**
   * Shared/common spaces description
   * Yhteisten tilojen kuvaus
   * Examples: "Kerhohuone", "Pesutuva", "Sauna"
   */
  sharedSpaces: string;

  /**
   * Has asbestos survey been done
   * Asbestikartoitus tehty
   */
  asbestosSurvey: boolean;

  /**
   * Repair history description
   * Korjaushistoria kuvaus
   */
  repairHistory: string;

  /**
   * Upcoming repairs description
   * Tulevat korjaukset kuvaus
   */
  upcomingRepairs: string;

  // ============================================================================
  // 5. TECHNICAL AND ENVIRONMENTAL / TEKNISET JA YMPÄRISTÖTIEDOT
  // ============================================================================

  /**
   * Sewer system type
   * Viemäröinti
   * Examples: "Kunnallinen viemäri", "Umpisäiliö"
   */
  sewerSystem: string;

  /**
   * Water connection type
   * Vesihuolto
   * Examples: "Kunnallinen vesijohto", "Oma kaivo"
   */
  waterConnection: string;

  /**
   * Has broadband connection
   * Laajakaistayhteys
   */
  broadband: boolean;

  /**
   * Antenna system type
   * Antennijärjestelmä
   * Examples: "Yhteisantenni", "Kaapeli-TV"
   */
  antennaSystem: string;

  /**
   * Property restrictions
   * Kiinteistöön kohdistuvat rajoitukset
   */
  propertyRestrictions: string;

  /**
   * Terrain description
   * Maaston kuvaus
   * Examples: "Tasainen", "Rinteinen"
   */
  terrainDescription: string;

  /**
   * Soil and vegetation description
   * Maaperä ja kasvillisuus kuvaus
   */
  soilAndVegetation: string;

  /**
   * Building rights description
   * Rakennusoikeus kuvaus
   */
  buildingRights: string;

  /**
   * Easements and rights description
   * Rasitteet ja oikeudet kuvaus
   */
  easementsAndRights: string;

  /**
   * Property ID number
   * Kiinteistötunnus
   */
  propertyId: string;

  /**
   * Land register number
   * Kiinteistörekisterinumero
   */
  landRegisterNumber: string;

  /**
   * Municipality name
   * Kunta
   */
  municipality: string;

  /**
   * Village or district
   * Kylä tai kaupunginosa
   */
  villageOrDistrict: string;

  /**
   * Block number
   * Korttelin numero
   */
  blockNumber: string;

  /**
   * Lease term description
   * Vuokra-aika kuvaus
   */
  leaseTerm: string;

  /**
   * Annual lease amount in EUR
   * Vuotuinen vuokra euroina
   */
  annualLease: number;

  // ============================================================================
  // 6. LISTING AND AGENT INFO / ILMOITUS- JA VÄLITTÄJÄTIEDOT
  // ============================================================================

  /**
   * Real estate agent name
   * Kiinteistönvälittäjän nimi
   */
  estateAgentName: string;

  /**
   * Real estate agent phone
   * Kiinteistönvälittäjän puhelin
   */
  estateAgentPhone: string;

  /**
   * Real estate agent email
   * Kiinteistönvälittäjän sähköposti
   */
  estateAgentEmail: string;

  /**
   * Showing/viewing date
   * Esittelypäivä
   */
  showingDate: Date;

  /**
   * Showing/viewing time
   * Esittelyaika
   */
  showingTime: string;

  /**
   * Listing office name
   * Välitystoimisto
   */
  listingOffice: string;

  /**
   * Original listing source URL
   * Alkuperäisen ilmoituksen URL-osoite
   */
  listingSourceUrl: string;

  /**
   * Array of photo URLs
   * Valokuvien URL-osoitteet
   */
  photoUrls: string[];

  /**
   * Floor plan document URL
   * Pohjapiirros URL-osoite
   */
  floorPlanUrl: string;

  /**
   * Property brochure PDF URL
   * Kiinteistön esite PDF URL-osoite
   */
  brochureUrl: string;

  // ============================================================================
  // 7. METADATA / METATIEDOT
  // ============================================================================

  /**
   * Date when data was parsed/extracted
   * Tietojen jäsentelypäivä
   */
  parsingDate: Date;

  /**
   * Source document type
   * Lähdeasiakirjan tyyppi
   * Examples: "PDF", "XML", "HTML"
   */
  sourceType: string;

  /**
   * Source filename
   * Lähdetiedoston nimi
   */
  sourceFilename: string;

  /**
   * Data model version
   * Tietomallin versio
   */
  version: string;
}

// ============================================================================
// HELPER TYPES / APUTYYPIT
// ============================================================================

/**
 * Partial property listing for updates
 * Osittainen kiinteistölistaus päivityksille
 */
export type PartialPropertyListing = Partial<PropertyListing>;

/**
 * Property listing creation type (without metadata that's auto-generated)
 * Kiinteistölistauksen luontityyppi (ilman automaattisesti generoitavia metatietoja)
 */
export type PropertyListingCreate = Omit<PropertyListing, 'parsingDate' | 'version'>;

/**
 * Minimal property listing for display in lists
 * Minimaalinen kiinteistölistaus listauksille
 */
export interface PropertyListingMinimal {
  streetAddress: string;
  city: string;
  postalCode: string;
  heading: string;
  salesPrice: number;
  livingArea: number;
  photoUrls: string[];
  propertyId: string;
}

/**
 * Property search filters
 * Kiinteistöhakusuodattimet
 */
export interface PropertySearchFilters {
  city?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  apartmentType?: string;
  energyClass?: string[];
  sauna?: boolean;
  balcony?: boolean;
}

/**
 * Property validation result
 * Kiinteistön validointitulos
 */
export interface PropertyValidationResult {
  isValid: boolean;
  errors: Array<{
    field: keyof PropertyListing;
    message: string;
    messageEn: string;
    messageFi: string;
  }>;
  warnings: Array<{
    field: keyof PropertyListing;
    message: string;
    messageEn: string;
    messageFi: string;
  }>;
}

// ============================================================================
// CONSTANTS / VAKIOT
// ============================================================================

/**
 * Valid apartment types
 * Kelvollliset asuntotyypit
 */
export const APARTMENT_TYPES = [
  'Osake',
  'Kiinteistö',
  'Omakotitalo',
  'Rivitalo',
  'Paritalo',
  'Kerrostalo',
  'Luhtitalo',
] as const;

/**
 * Valid ownership types
 * Kelvolliset omistusmuodot
 */
export const OWNERSHIP_TYPES = ['Oma', 'Vuokra', 'Osaomistus'] as const;

/**
 * Valid energy classes
 * Kelvolliset energialuokat
 */
export const ENERGY_CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

/**
 * Valid source types
 * Kelvolliset lähdeasiakirjatyypit
 */
export const SOURCE_TYPES = ['PDF', 'XML', 'HTML', 'JSON', 'API'] as const;

// ============================================================================
// TYPE GUARDS / TYYPPISUOJAT
// ============================================================================

/**
 * Check if value is a valid PropertyListing
 * Tarkista, onko arvo kelvollinen PropertyListing
 */
export function isPropertyListing(value: unknown): value is PropertyListing {
  if (!value || typeof value !== 'object') return false;
  
  const listing = value as Partial<PropertyListing>;
  
  // Check required fields
  return (
    typeof listing.streetAddress === 'string' &&
    typeof listing.city === 'string' &&
    typeof listing.heading === 'string' &&
    (typeof listing.salesPrice === 'number' || listing.salesPrice === null)
  );
}

/**
 * Check if value is a valid energy class
 * Tarkista, onko arvo kelvollinen energialuokka
 */
export function isValidEnergyClass(value: string): value is typeof ENERGY_CLASSES[number] {
  return ENERGY_CLASSES.includes(value as any);
}

/**
 * Check if value is a valid ownership type
 * Tarkista, onko arvo kelvollinen omistusmuoto
 */
export function isValidOwnershipType(value: string): value is typeof OWNERSHIP_TYPES[number] {
  return OWNERSHIP_TYPES.includes(value as any);
}

// ============================================================================
// UTILITY FUNCTIONS / APUFUNKTIOT
// ============================================================================

/**
 * Create a minimal property listing from full listing
 * Luo minimaalinen kiinteistölistaus täydellisestä listauksesta
 */
export function toMinimalListing(listing: PropertyListing): PropertyListingMinimal {
  return {
    streetAddress: listing.streetAddress,
    city: listing.city,
    postalCode: listing.postalCode,
    heading: listing.heading,
    salesPrice: listing.salesPrice,
    livingArea: listing.livingArea,
    photoUrls: listing.photoUrls,
    propertyId: listing.propertyId,
  };
}

/**
 * Format price in EUR
 * Muotoile hinta euroina
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format area in square meters
 * Muotoile pinta-ala neliömetreinä
 */
export function formatArea(area: number): string {
  return `${new Intl.NumberFormat('fi-FI').format(area)} m²`;
}

/**
 * Calculate price per square meter
 * Laske hinta neliömetriä kohden
 */
export function calculatePricePerSqm(price: number, area: number): number {
  if (area === 0) return 0;
  return Math.round(price / area);
}

/**
 * Generate property slug for URLs
 * Luo kiinteistön slug URL-osoitteille
 */
export function generatePropertySlug(listing: PropertyListing): string {
  const addressPart = listing.streetAddress
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const cityPart = listing.city
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${addressPart}-${cityPart}`;
}

