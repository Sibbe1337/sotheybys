/**
 * Multilingual Finnish Real Estate Listing Data Model
 * Sotheby's / Snellman Property Schema - Finnish, English, Swedish
 * 
 * This comprehensive type definition covers all fields from Linear.fi API
 * with support for Finnish (fi), English (en), and Swedish (sv) languages.
 */

// ============================================================================
// LANGUAGE TYPES / SPRÅKTYPER / KIELITYYPIT
// ============================================================================

export type SupportedLanguage = 'fi' | 'en' | 'sv';

/**
 * Localized string value supporting multiple languages
 * Lokalisoitu merkkijonoarvo, joka tukee useita kieliä
 * Lokaliserat strängvärde som stödjer flera språk
 */
export interface LocalizedString {
  fi?: string; // Finnish / Suomi / Finska
  en?: string; // English / Englanti / Engelska
  sv?: string; // Swedish / Ruotsi / Svenska
}

/**
 * Localized numeric value
 * Lokalisoitu numeerinen arvo
 * Lokaliserat numeriskt värde
 */
export interface LocalizedNumber {
  fi?: number;
  en?: number;
  sv?: number;
}

/**
 * Localized date value
 * Lokalisoitu päivämääräarvo
 * Lokaliserat datumvärde
 */
export interface LocalizedDate {
  fi?: Date;
  en?: Date;
  sv?: Date;
}

// ============================================================================
// MAIN PROPERTY LISTING INTERFACE / KIINTEISTÖLISTAUSKÄYTTÖLIITTYMÄ
// ============================================================================

/**
 * Multilingual property listing interface
 * Monikielinen kiinteistölistauskäyttöliittymä
 * Flerspråkigt fastighetsgränssnitt
 */
export interface MultilingualPropertyListing {
  // ============================================================================
  // 1. GENERAL PROPERTY INFO / YLEISET KIINTEISTÖTIEDOT / ALLMÄN FASTIGHETSINFORMATION
  // ============================================================================

  /**
   * Type of apartment/property
   * FI: Asunnon/kiinteistön tyyppi (esim. "Osake", "Kiinteistö")
   * EN: Type of apartment/property (e.g., "Share", "Real estate")
   * SV: Typ av lägenhet/fastighet (t.ex. "Andel", "Fastighet")
   */
  apartmentType: LocalizedString;

  /**
   * Street address
   * FI: Katuosoite
   * SV: Gatuadress
   */
  streetAddress: LocalizedString;

  /**
   * Postal code
   * FI: Postinumero
   * SV: Postnummer
   */
  postalCode: string; // Same across languages

  /**
   * City name
   * FI: Kaupunki
   * SV: Stad
   */
  city: LocalizedString;

  /**
   * Region or district
   * FI: Alue tai kaupunginosa
   * SV: Region eller stadsdel
   */
  region: LocalizedString;

  /**
   * Listing title/heading
   * FI: Ilmoituksen otsikko
   * SV: Annonstitel
   */
  heading: LocalizedString;

  /**
   * Full property description
   * FI: Täydellinen kiinteistön kuvaus
   * SV: Fullständig fastighetsbeskrivning
   */
  description: LocalizedString;

  /**
   * Date when listing was released/published
   * FI: Ilmoituksen julkaisupäivä
   * SV: Publiceringsdatum
   */
  releaseDate: Date;

  /**
   * When property becomes available
   * FI: Kiinteistön vapautumispäivä
   * SV: Tillgänglighetsdatum
   */
  availableFrom: LocalizedString | Date;

  /**
   * Type of ownership
   * FI: Omistusmuoto (esim. "Oma", "Vuokra")
   * EN: Ownership type (e.g., "Owned", "Rented")
   * SV: Ägandeform (t.ex. "Egen", "Hyra")
   */
  ownershipType: LocalizedString;

  /**
   * Floor location
   * FI: Kerros (esim. "3. krs", "Pohjakerros")
   * EN: Floor (e.g., "3rd floor", "Ground floor")
   * SV: Våning (t.ex. "3 vån", "Bottenvåning")
   */
  floorLocation: LocalizedString;

  /**
   * Total number of floors in building
   * FI: Kerrosten lukumäärä rakennuksessa
   * SV: Antal våningar i byggnaden
   */
  numberOfFloors: string;

  /**
   * Window direction/orientation
   * FI: Ikkunoiden suunta (esim. "Etelä", "Kaakkois-lounas")
   * EN: Window direction (e.g., "South", "Southeast-Southwest")
   * SV: Fönsterriktning (t.ex. "Söder", "Sydost-Sydväst")
   */
  windowDirection: LocalizedString;

  /**
   * Has balcony
   * FI: Parveke
   * SV: Balkong
   */
  balcony: boolean;

  /**
   * Has sauna
   * FI: Sauna
   * SV: Bastu
   */
  sauna: boolean;

  /**
   * Property condition
   * FI: Kunto (esim. "Hyvä", "Erinomainen", "Remontoitu")
   * EN: Condition (e.g., "Good", "Excellent", "Renovated")
   * SV: Skick (t.ex. "Bra", "Utmärkt", "Renoverad")
   */
  condition: LocalizedString;

  /**
   * Year building was constructed
   * FI: Rakennusvuosi
   * SV: Byggnadsår
   */
  yearOfBuilding: number;

  /**
   * Roof type
   * FI: Katon tyyppi (esim. "Harjakatto", "Tasakatto")
   * EN: Roof type (e.g., "Pitched roof", "Flat roof")
   * SV: Taktyp (t.ex. "Sadeltak", "Platt tak")
   */
  roofType: LocalizedString;

  /**
   * Heating system type
   * FI: Lämmitysjärjestelmä (esim. "Kaukolämpö", "Maalämpö")
   * EN: Heating system (e.g., "District heating", "Geothermal")
   * SV: Värmesystem (t.ex. "Fjärrvärme", "Jordvärme")
   */
  heatingSystem: LocalizedString;

  /**
   * Ventilation system type
   * FI: Ilmanvaihtojärjestelmä
   * EN: Ventilation system
   * SV: Ventilationssystem
   */
  ventilationSystem: LocalizedString;

  /**
   * Building material
   * FI: Rakennusaine (esim. "Tiili", "Betoni", "Puu")
   * EN: Building material (e.g., "Brick", "Concrete", "Wood")
   * SV: Byggnadsmaterial (t.ex. "Tegel", "Betong", "Trä")
   */
  buildingMaterial: LocalizedString;

  /**
   * Energy efficiency class
   * FI: Energialuokka
   * SV: Energiklass
   */
  energyClass: string; // A, B, C, D, E - same across languages

  /**
   * Has energy certificate
   * FI: Energiatodistus olemassa
   * SV: Energicertifikat finns
   */
  energyCertificate: boolean;

  // ============================================================================
  // 2. DIMENSIONS AND USAGE / MITAT JA KÄYTTÖ / DIMENSIONER OCH ANVÄNDNING
  // ============================================================================

  /**
   * Living area in m²
   * FI: Asuinpinta-ala neliömetreinä
   * SV: Boarea i kvadratmeter
   */
  livingArea: number;

  /**
   * Total area in m²
   * FI: Kokonaispinta-ala neliömetreinä
   * SV: Total yta i kvadratmeter
   */
  totalArea: number;

  /**
   * Volume in m³
   * FI: Tilavuus kuutiometreinä
   * SV: Volym i kubikmeter
   */
  volume: number;

  /**
   * Number of apartments in building
   * FI: Huoneistojen lukumäärä rakennuksessa
   * SV: Antal lägenheter i byggnaden
   */
  numberOfApartments: number;

  /**
   * Business/commercial spaces description
   * FI: Liiketilojen kuvaus
   * SV: Beskrivning av affärslokaler
   */
  businessSpaces: LocalizedString;

  /**
   * Site/plot area in m²
   * FI: Tontin pinta-ala neliömetreinä
   * SV: Tomtarea i kvadratmeter
   */
  siteArea: number;

  /**
   * Site/plot ownership type
   * FI: Tontin omistusmuoto (esim. "Oma", "Vuokra")
   * EN: Plot ownership (e.g., "Owned", "Leased")
   * SV: Tomtägandeform (t.ex. "Egen", "Arrenderad")
   */
  siteOwnershipType: LocalizedString;

  /**
   * Zoning situation
   * FI: Kaavatilanne (esim. "Asemakaava-alue")
   * EN: Zoning status
   * SV: Planläggningssituation
   */
  zoningSituation: LocalizedString;

  /**
   * Detailed zoning information
   * FI: Yksityiskohtaiset kaavatiedot
   * SV: Detaljerad planinformation
   */
  zoningDetails: LocalizedString;

  // ============================================================================
  // 3. FINANCIAL DATA / TALOUDELLISET TIEDOT / EKONOMISK INFORMATION
  // ============================================================================

  /**
   * Sales price in EUR
   * FI: Myyntihinta euroina
   * SV: Försäljningspris i euro
   */
  salesPrice: number;

  /**
   * Debt part/portion in EUR
   * FI: Velkaosuus euroina
   * SV: Skuldandel i euro
   */
  debtPart: number;

  /**
   * Unencumbered/debt-free sales price in EUR
   * FI: Velaton myyntihinta euroina
   * SV: Skuldfritt försäljningspris i euro
   */
  unencumberedSalesPrice: number;

  /**
   * Is loan payable by buyer
   * FI: Onko laina maksettavissa
   * SV: Är lånet betalbart
   */
  loanPayable: boolean;

  /**
   * Monthly maintenance fee in EUR
   * FI: Kuukausittainen hoitovastike euroina
   * SV: Månatlig underhållsavgift i euro
   */
  maintenanceFee: number;

  /**
   * Monthly financing fee in EUR
   * FI: Kuukausittainen rahoitusvastike euroina
   * SV: Månatlig finansieringsavgift i euro
   */
  financingFee: number;

  /**
   * Total monthly fee in EUR
   * FI: Yhteensä kuukausittaiset maksut euroina
   * SV: Totala månatliga avgifter i euro
   */
  totalFee: number;

  /**
   * Monthly rent income in EUR
   * FI: Kuukausittaiset vuokratulot euroina
   * SV: Månatliga hyresinkomster i euro
   */
  rentIncome: number;

  /**
   * Water fee in EUR
   * FI: Vesimaksu euroina
   * SV: Vattenavgift i euro
   */
  waterFee: number;

  /**
   * Electricity cost in EUR
   * FI: Sähkökustannus euroina
   * SV: Elkostnad i euro
   */
  electricityCost: number;

  /**
   * Heating cost in EUR
   * FI: Lämmityskustannus euroina
   * SV: Värmekostnad i euro
   */
  heatingCost: number;

  /**
   * Cleaning cost in EUR
   * FI: Siivouskulut euroina
   * SV: Städningskostnad i euro
   */
  cleaningCost: number;

  /**
   * Annual property tax in EUR
   * FI: Vuotuinen kiinteistövero euroina
   * SV: Årlig fastighetsskatt i euro
   */
  propertyTax: number;

  /**
   * Other fees description
   * FI: Muut maksut kuvaus
   * SV: Övriga avgifter beskrivning
   */
  otherFees: LocalizedString;

  /**
   * Payment method
   * FI: Maksutapa
   * SV: Betalningsmetod
   */
  paymentMethod: LocalizedString;

  // ============================================================================
  // 4. COMPANY / MANAGEMENT / YHTIÖ / HALLINTA / FÖRETAG / FÖRVALTNING
  // ============================================================================

  /**
   * Housing company name
   * FI: Taloyhtiön nimi
   * SV: Bostadsbolagets namn
   */
  housingCompanyName: string;

  /**
   * Business ID (Y-tunnus)
   * FI: Y-tunnus
   * SV: FO-nummer
   */
  businessId: string;

  /**
   * Management company name
   * FI: Isännöitsijä yhtiö
   * SV: Förvaltningsbolag
   */
  managementCompany: string;

  /**
   * Property maintenance company
   * FI: Kiinteistönhuolto yhtiö
   * SV: Fastighetsunderhållsbolag
   */
  propertyMaintenance: string;

  /**
   * Property manager name
   * FI: Isännöitsijän nimi
   * SV: Förvaltarens namn
   */
  managerName: string;

  /**
   * Property manager phone
   * FI: Isännöitsijän puhelin
   * SV: Förvaltarens telefon
   */
  managerPhone: string;

  /**
   * Property manager email
   * FI: Isännöitsijän sähköposti
   * SV: Förvaltarens e-post
   */
  managerEmail: string;

  /**
   * Ownership status
   * FI: Omistuksen tila
   * SV: Ägandestatus
   */
  ownershipStatus: LocalizedString;

  /**
   * Number of shares
   * FI: Osakkeiden lukumäärä
   * SV: Antal aktier
   */
  numberOfShares: string;

  /**
   * Redemption clause for apartments
   * FI: Lunastuslauseke asunnoille
   * SV: Inlösenklausul för lägenheter
   */
  redemptionClauseFlats: boolean;

  /**
   * Redemption clause for parking
   * FI: Lunastuslauseke pysäköinnille
   * SV: Inlösenklausul för parkering
   */
  redemptionClauseParking: boolean;

  /**
   * Company loans total in EUR
   * FI: Yhtiölainat yhteensä euroina
   * SV: Bolagslån totalt i euro
   */
  companyLoans: number;

  /**
   * Company income in EUR
   * FI: Yhtiön tulot euroina
   * SV: Företagets inkomster i euro
   */
  companyIncome: number;

  /**
   * Construction year of building
   * FI: Rakennuksen rakennusvuosi
   * SV: Byggnadens byggår
   */
  constructionYear: number;

  /**
   * Total apartments in building
   * FI: Asuntojen kokonaismäärä rakennuksessa
   * SV: Totalt antal lägenheter i byggnaden
   */
  totalApartments: number;

  /**
   * Total business spaces in building
   * FI: Liiketilojen kokonaismäärä rakennuksessa
   * SV: Totalt antal affärslokaler i byggnaden
   */
  totalBusinessSpaces: number;

  /**
   * Shared/common spaces description
   * FI: Yhteisten tilojen kuvaus
   * SV: Beskrivning av gemensamma utrymmen
   */
  sharedSpaces: LocalizedString;

  /**
   * Has asbestos survey been done
   * FI: Asbestikartoitus tehty
   * SV: Asbestinventering gjord
   */
  asbestosSurvey: boolean;

  /**
   * Repair history description
   * FI: Korjaushistoria kuvaus
   * SV: Reparationshistorik beskrivning
   */
  repairHistory: LocalizedString;

  /**
   * Upcoming repairs description
   * FI: Tulevat korjaukset kuvaus
   * SV: Kommande reparationer beskrivning
   */
  upcomingRepairs: LocalizedString;

  // ============================================================================
  // 5. TECHNICAL AND ENVIRONMENTAL / TEKNISET JA YMPÄRISTÖTIEDOT / TEKNISK OCH MILJÖINFORMATION
  // ============================================================================

  /**
   * Sewer system type
   * FI: Viemäröinti
   * SV: Avloppssystem
   */
  sewerSystem: LocalizedString;

  /**
   * Water connection type
   * FI: Vesihuolto
   * SV: Vattenförsörjning
   */
  waterConnection: LocalizedString;

  /**
   * Has broadband connection
   * FI: Laajakaistayhteys
   * SV: Bredbandsanslutning
   */
  broadband: boolean;

  /**
   * Antenna system type
   * FI: Antennijärjestelmä
   * SV: Antennsystem
   */
  antennaSystem: LocalizedString;

  /**
   * Property restrictions
   * FI: Kiinteistöön kohdistuvat rajoitukset
   * SV: Fastighetsbegränsningar
   */
  propertyRestrictions: LocalizedString;

  /**
   * Terrain description
   * FI: Maaston kuvaus
   * SV: Terrängbeskrivning
   */
  terrainDescription: LocalizedString;

  /**
   * Soil and vegetation description
   * FI: Maaperä ja kasvillisuus kuvaus
   * SV: Mark och vegetation beskrivning
   */
  soilAndVegetation: LocalizedString;

  /**
   * Building rights description
   * FI: Rakennusoikeus kuvaus
   * SV: Byggrätt beskrivning
   */
  buildingRights: LocalizedString;

  /**
   * Easements and rights description
   * FI: Rasitteet ja oikeudet kuvaus
   * SV: Servitut och rättigheter beskrivning
   */
  easementsAndRights: LocalizedString;

  /**
   * Property ID number
   * FI: Kiinteistötunnus
   * SV: Fastighetsbeteckning
   */
  propertyId: string;

  /**
   * Land register number
   * FI: Kiinteistörekisterinumero
   * SV: Fastighetsregisternummer
   */
  landRegisterNumber: string;

  /**
   * Municipality name
   * FI: Kunta
   * SV: Kommun
   */
  municipality: LocalizedString;

  /**
   * Village or district
   * FI: Kylä tai kaupunginosa
   * SV: By eller stadsdel
   */
  villageOrDistrict: LocalizedString;

  /**
   * Block number
   * FI: Korttelin numero
   * SV: Kvarternummer
   */
  blockNumber: string;

  /**
   * Lease term description
   * FI: Vuokra-aika kuvaus
   * SV: Arrendetid beskrivning
   */
  leaseTerm: LocalizedString;

  /**
   * Annual lease amount in EUR
   * FI: Vuotuinen vuokra euroina
   * SV: Årlig arrende i euro
   */
  annualLease: number;

  // ============================================================================
  // 6. LISTING AND AGENT INFO / ILMOITUS- JA VÄLITTÄJÄTIEDOT / ANNONS- OCH MÄKLARINFORMATION
  // ============================================================================

  /**
   * Real estate agent name
   * FI: Kiinteistönvälittäjän nimi
   * SV: Fastighetsmäklarens namn
   */
  estateAgentName: string;

  /**
   * Real estate agent phone
   * FI: Kiinteistönvälittäjän puhelin
   * SV: Fastighetsmäklarens telefon
   */
  estateAgentPhone: string;

  /**
   * Real estate agent email
   * FI: Kiinteistönvälittäjän sähköposti
   * SV: Fastighetsmäklarens e-post
   */
  estateAgentEmail: string;

  /**
   * Showing/viewing date
   * FI: Esittelypäivä
   * SV: Visningsdatum
   */
  showingDate: Date;

  /**
   * Showing/viewing time
   * FI: Esittelyaika
   * SV: Visningstid
   */
  showingTime: string;

  /**
   * Listing office name
   * FI: Välitystoimisto
   * SV: Förmedlingsbyrå
   */
  listingOffice: string;

  /**
   * Original listing source URL
   * FI: Alkuperäisen ilmoituksen URL-osoite
   * SV: URL för originalannons
   */
  listingSourceUrl: string;

  /**
   * Array of photo URLs
   * FI: Valokuvien URL-osoitteet
   * SV: Foto-URLer
   */
  photoUrls: string[];

  /**
   * Floor plan document URL
   * FI: Pohjapiirros URL-osoite
   * SV: Planlösnings-URL
   */
  floorPlanUrl: string;

  /**
   * Property brochure PDF URL
   * FI: Kiinteistön esite PDF URL-osoite
   * SV: Fastighetsmäklarens PDF-URL
   */
  brochureUrl: string;

  // ============================================================================
  // 7. METADATA / METATIEDOT / METADATA
  // ============================================================================

  /**
   * Date when data was parsed/extracted
   * FI: Tietojen jäsentelypäivä
   * SV: Datum för dataparsning
   */
  parsingDate: Date;

  /**
   * Source document type
   * FI: Lähdeasiakirjan tyyppi
   * SV: Källdokumenttyp
   */
  sourceType: string;

  /**
   * Source filename
   * FI: Lähdetiedoston nimi
   * SV: Källfilnamn
   */
  sourceFilename: string;

  /**
   * Data model version
   * FI: Tietomallin versio
   * SV: Datamodellversion
   */
  version: string;
}

// ============================================================================
// HELPER FUNCTIONS / APUFUNKTIOT / HJÄLPFUNKTIONER
// ============================================================================

/**
 * Get localized value with fallback
 * Hae lokalisoitu arvo varmistustoiminnolla
 * Hämta lokaliserat värde med reserv
 */
export function getLocalizedValue<T = string>(
  localizedValue: LocalizedString | undefined,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage = 'fi'
): string {
  if (!localizedValue) return '';
  
  // Extract the value for the specified language
  const value = localizedValue[language] || localizedValue[fallbackLanguage] || '';
  
  // CRITICAL FIX: If value is still an object (nested LocalizedString), return empty string
  // This prevents React error #31 "object with keys {fi, en, sv}"
  if (typeof value === 'object') {
    console.warn('⚠️  getLocalizedValue received nested object:', { localizedValue, language, value });
    return '';
  }
  
  return value;
}

/**
 * Format price with language-specific formatting
 * Muotoile hinta kielikohtaisella muotoilulla
 * Formatera pris med språkspecifik formatering
 */
export function formatPriceLocalized(price: number, language: SupportedLanguage): string {
  const locale = {
    fi: 'fi-FI',
    en: 'en-FI',
    sv: 'sv-FI',
  }[language];

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format area with language-specific formatting
 * Muotoile pinta-ala kielikohtaisella muotoilulla
 * Formatera yta med språkspecifik formatering
 */
export function formatAreaLocalized(area: number, language: SupportedLanguage): string {
  const locale = {
    fi: 'fi-FI',
    en: 'en-FI',
    sv: 'sv-FI',
  }[language];

  return `${new Intl.NumberFormat(locale).format(area)} m²`;
}

/**
 * Generate property slug (URL-safe) - handles Finnish characters
 * Luo kiinteistön slug (URL-turvallinen) - käsittelee suomenkieliset merkit
 * Skapa fastighetens slug (URL-säker) - hanterar finska tecken
 */
export function generatePropertySlugMultilang(
  address: LocalizedString,
  city: LocalizedString,
  language: SupportedLanguage = 'fi'
): string {
  const addressValue = getLocalizedValue(address, language);
  const cityValue = getLocalizedValue(city, language);

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/å/g, 'a')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  return `${normalize(addressValue)}-${normalize(cityValue)}`;
}

/**
 * Translation keys for UI labels
 * Käännösavaimet käyttöliittymän nimilapuille
 * Översättningsnycklar för UI-etiketter
 */
export const PROPERTY_LABELS = {
  apartmentType: {
    fi: 'Asuntotyyppi',
    en: 'Property Type',
    sv: 'Fastighetstyp',
  },
  livingArea: {
    fi: 'Asuinpinta-ala',
    en: 'Living Area',
    sv: 'Boarea',
  },
  salesPrice: {
    fi: 'Myyntihinta',
    en: 'Sales Price',
    sv: 'Försäljningspris',
  },
  rooms: {
    fi: 'Huoneet',
    en: 'Rooms',
    sv: 'Rum',
  },
  yearOfBuilding: {
    fi: 'Rakennusvuosi',
    en: 'Year Built',
    sv: 'Byggnadsår',
  },
  energyClass: {
    fi: 'Energialuokka',
    en: 'Energy Class',
    sv: 'Energiklass',
  },
  maintenanceFee: {
    fi: 'Hoitovastike',
    en: 'Maintenance Fee',
    sv: 'Underhållsavgift',
  },
  sauna: {
    fi: 'Sauna',
    en: 'Sauna',
    sv: 'Bastu',
  },
  balcony: {
    fi: 'Parveke',
    en: 'Balcony',
    sv: 'Balkong',
  },
} as const;

/**
 * Get label in specified language
 * Hae nimilappu määritellyllä kielellä
 * Hämta etikett på specificerat språk
 */
export function getPropertyLabel(
  key: keyof typeof PROPERTY_LABELS,
  language: SupportedLanguage
): string {
  return PROPERTY_LABELS[key][language];
}

