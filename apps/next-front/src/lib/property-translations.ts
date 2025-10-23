/**
 * Property Field Translations
 * Supports Finnish (fi), Swedish (sv), and English (en)
 */

export type SupportedLanguage = 'fi' | 'sv' | 'en';

interface Translations {
  [key: string]: {
    fi: string;
    sv: string;
    en: string;
  };
}

export const PROPERTY_TRANSLATIONS: Translations = {
  // Hero Section
  apartmentType: {
    fi: 'ASUNNON TYYPPI',
    sv: 'LÄGENHETENS TYP',
    en: 'APARTMENT TYPE'
  },
  floor: {
    fi: 'KERROS',
    sv: 'VÅNING',
    en: 'FLOOR'
  },
  
  // Section Headers
  priceInfo: {
    fi: 'Hintatiedot',
    sv: 'Prisinformation',
    en: 'Price Information'
  },
  energyRating: {
    fi: 'Energialuokitus',
    sv: 'Energiklass',
    en: 'Energy Rating'
  },
  propertyInfo: {
    fi: 'Kiinteistötiedot',
    sv: 'Fastighetsinformation',
    en: 'Property Information'
  },
  housingCompanyInfo: {
    fi: 'Yhtiötiedot',
    sv: 'Bolagsinformation',
    en: 'Housing Company Information'
  },
  buildingInfo: {
    fi: 'Rakennustiedot',
    sv: 'Byggnadsinformation',
    en: 'Building Information'
  },
  equipmentSpaces: {
    fi: 'Varusteet ja tilat',
    sv: 'Utrustning och utrymmen',
    en: 'Equipment and Spaces'
  },
  locationEnvironment: {
    fi: 'Sijainti ja ympäristö',
    sv: 'Läge och miljö',
    en: 'Location and Environment'
  },
  mediaDocuments: {
    fi: 'Esitteet ja videot',
    sv: 'Broschyrer och videor',
    en: 'Brochures and Videos'
  },
  otherInfo: {
    fi: 'Muut tiedot',
    sv: 'Övrig information',
    en: 'Other Information'
  },
  
  // Price Fields
  salesPrice: {
    fi: 'Myyntihinta',
    sv: 'Försäljningspris',
    en: 'Sale Price'
  },
  debtPart: {
    fi: 'Velkaosuus',
    sv: 'Skuldandel',
    en: 'Debt Portion'
  },
  debtFreePrice: {
    fi: 'Velaton hinta',
    sv: 'Skuldfritt pris',
    en: 'Debt-Free Price'
  },
  maintenanceFee: {
    fi: 'Yhtiövastike',
    sv: 'Bolagsavgift',
    en: 'Maintenance Fee'
  },
  financingFee: {
    fi: 'Rahoitusvastike',
    sv: 'Finansieringsavgift',
    en: 'Financing Fee'
  },
  totalFee: {
    fi: 'Kokonaisvastike',
    sv: 'Total avgift',
    en: 'Total Fee'
  },
  waterFee: {
    fi: 'Vesimaksu',
    sv: 'Vattenavgift',
    en: 'Water Fee'
  },
  maintenanceCharge: {
    fi: 'Hoitovastike',
    sv: 'Underhållsavgift',
    en: 'Maintenance Charge'
  },
  fundingCharge: {
    fi: 'Rahoitusvastike',
    sv: 'Finansieringsavgift',
    en: 'Funding Charge'
  },
  mandatoryCharges: {
    fi: 'Pakolliset maksut',
    sv: 'Obligatoriska avgifter',
    en: 'Mandatory Charges'
  },
  waterCharge: {
    fi: 'Vesimaksu',
    sv: 'Vattenavgift',
    en: 'Water Charge'
  },
  propertyTax: {
    fi: 'Kiinteistövero',
    sv: 'Fastighetsskatt',
    en: 'Property Tax'
  },
  
  // 🏠 Rental Fields (Vuokrakohteet / Hyresobjekt / Rentals)
  rent: {
    fi: 'Vuokra',
    sv: 'Hyra',
    en: 'Rent'
  },
  monthlyRent: {
    fi: 'Kuukausivuokra',
    sv: 'Månadshyra',
    en: 'Monthly Rent'
  },
  securityDeposit: {
    fi: 'Vakuus',
    sv: 'Deposition',
    en: 'Security Deposit'
  },
  securityDepositType: {
    fi: 'Vakuustyyppi',
    sv: 'Depositionstyp',
    en: 'Security Deposit Type'
  },
  rentalContractType: {
    fi: 'Vuokrasopimuksen tyyppi',
    sv: 'Typ av hyresavtal',
    en: 'Contract Type'
  },
  rentUpdateDate: {
    fi: 'Vuokran tarkistuspäivä',
    sv: 'Hyresgranskningsdag',
    en: 'Rent Update Date'
  },
  rentPaymentDate: {
    fi: 'Vuokran eräpäivä',
    sv: 'Hyresförfallodag',
    en: 'Rent Payment Date'
  },
  rentIncreaseBasis: {
    fi: 'Vuokrankorotusperuste',
    sv: 'Grund för hyreshöjning',
    en: 'Rent Increase Basis'
  },
  earliestTerminateDate: {
    fi: 'Aikaisin irtisanomispäivä',
    sv: 'Tidigaste uppsägningsdatum',
    en: 'Earliest Termination Date'
  },
  subleasing: {
    fi: 'Jatkuvuokraus',
    sv: 'Andrahandsuthyrning',
    en: 'Subleasing'
  },
  petsAllowed: {
    fi: 'Lemmikkieläimet sallittu',
    sv: 'Husdjur tillåtna',
    en: 'Pets Allowed'
  },
  smokingAllowed: {
    fi: 'Tupakointi sallittu',
    sv: 'Rökning tillåten',
    en: 'Smoking Allowed'
  },
  rentalInfo: {
    fi: 'Vuokratiedot',
    sv: 'Hyresinformation',
    en: 'Rental Information'
  },
  availableFrom: {
    fi: 'Vapautuu',
    sv: 'Tillgänglig från',
    en: 'Available From'
  },
  tenantResponsibilities: {
    fi: 'Vuokralaisen vastuulla',
    sv: 'Hyresgästen ansvarar för',
    en: 'Tenant Responsibilities'
  },
  
  // Energy Fields
  energyClass: {
    fi: 'Energialuokka',
    sv: 'Energiklass',
    en: 'Energy Class'
  },
  energyCertificate: {
    fi: 'Energiatodistus',
    sv: 'Energicertifikat',
    en: 'Energy Certificate'
  },
  energyCertificateUrl: {
    fi: 'Energiatodistus (PDF)',
    sv: 'Energicertifikat (PDF)',
    en: 'Energy Certificate (PDF)'
  },
  heatingSystem: {
    fi: 'Lämmitysjärjestelmä',
    sv: 'Värmesystem',
    en: 'Heating System'
  },
  
  // Housing Company Fields
  housingCompanyName: {
    fi: 'Yhtiön nimi',
    sv: 'Bolagets namn',
    en: 'Company Name'
  },
  businessId: {
    fi: 'Y-tunnus',
    sv: 'FO-nummer',
    en: 'Business ID'
  },
  managerName: {
    fi: 'Isännöitsijä',
    sv: 'Förvaltare',
    en: 'Property Manager'
  },
  managerPhone: {
    fi: 'Isännöitsijän puhelin',
    sv: 'Förvaltarens telefon',
    en: "Manager's Phone"
  },
  managerEmail: {
    fi: 'Isännöitsijän sähköposti',
    sv: 'Förvaltarens e-post',
    en: "Manager's Email"
  },
  propertyMaintenance: {
    fi: 'Kiinteistönhoito',
    sv: 'Fastighetsunderhåll',
    en: 'Property Maintenance'
  },
  numberOfShares: {
    fi: 'Osakkeiden numerot',
    sv: 'Aktienummer',
    en: 'Share Numbers'
  },
  redemptionClause: {
    fi: 'Lunastuspykälä',
    sv: 'Inlösenklausul',
    en: 'Redemption Clause'
  },
  propertyId: {
    fi: 'Kiinteistön tunnus',
    sv: 'Fastighetsbeteckning',
    en: 'Property ID'
  },
  plotArea: {
    fi: 'Tontin pinta-ala',
    sv: 'Tomtstorlek',
    en: 'Plot Area'
  },
  plotOwnership: {
    fi: 'Tontin omistus',
    sv: 'Ägandet',
    en: 'Plot Ownership'
  },
  
  // Building Fields
  buildingMaterial: {
    fi: 'Rakennusaine',
    sv: 'Byggnadsmaterial',
    en: 'Building Material'
  },
  roofType: {
    fi: 'Kattotyyppi',
    sv: 'Taktyp',
    en: 'Roof Type'
  },
  condition: {
    fi: 'Kunto',
    sv: 'Skick',
    en: 'Condition'
  },
  sauna: {
    fi: 'Sauna',
    sv: 'Bastu',
    en: 'Sauna'
  },
  balcony: {
    fi: 'Parveke',
    sv: 'Balkong',
    en: 'Balcony'
  },
  
  // Equipment Fields
  kitchen: {
    fi: 'Keittiö',
    sv: 'Kök',
    en: 'Kitchen'
  },
  bathroom: {
    fi: 'Kph/WC',
    sv: 'Badrum/WC',
    en: 'Bathroom/WC'
  },
  floorMaterial: {
    fi: 'Lattiamateriaalit',
    sv: 'Golvmaterial',
    en: 'Floor Materials'
  },
  storageSpace: {
    fi: 'Säilytystilat',
    sv: 'Förvaringsutrymmen',
    en: 'Storage Spaces'
  },
  
  // Location Fields
  windowDirection: {
    fi: 'Näkymä / Ikkunoiden suunta',
    sv: 'Utsikt / Fönsterriktning',
    en: 'View / Window Direction'
  },
  services: {
    fi: 'Palvelut',
    sv: 'Tjänster',
    en: 'Services'
  },
  beachRights: {
    fi: 'Ranta / Rannan omistus',
    sv: 'Strand / Strandägande',
    en: 'Beach / Beach Ownership'
  },
  
  // Media Fields
  brochure: {
    fi: 'Esite (PDF)',
    sv: 'Broschyr (PDF)',
    en: 'Brochure (PDF)'
  },
  video: {
    fi: 'Video / Virtuaalikierros',
    sv: 'Video / Virtuell rundtur',
    en: 'Video / Virtual Tour'
  },
  openBrochure: {
    fi: 'Avaa esite →',
    sv: 'Öppna broschyr →',
    en: 'Open brochure →'
  },
  watchVideo: {
    fi: 'Katso video →',
    sv: 'Titta på video →',
    en: 'Watch video →'
  },
  
  // Other Fields
  zoningSituation: {
    fi: 'Kaavoitustilanne',
    sv: 'Planläggningssituation',
    en: 'Zoning Situation'
  },
  buildingRights: {
    fi: 'Rakennusoikeus',
    sv: 'Byggnadsrätt',
    en: 'Building Rights'
  },
  availability: {
    fi: 'Vapautuu',
    sv: 'Frigörs',
    en: 'Available From'
  },
  
  // Tab/Button Labels
  photos: {
    fi: 'Valokuvat',
    sv: 'Bilder',
    en: 'Photos'
  },
  description: {
    fi: 'Kuvaus',
    sv: 'Beskrivning',
    en: 'Description'
  },
  floorPlan: {
    fi: 'Pohjakuva',
    sv: 'Planritning',
    en: 'Floor Plan'
  },
  viewOnMap: {
    fi: 'Kohde kartalla',
    sv: 'Visa på karta',
    en: 'View on Map'
  },
  viewBrochure: {
    fi: 'Selaa esitettä',
    sv: 'Bläddra i broschyr',
    en: 'View Brochure'
  },
  videoTab: {
    fi: 'Video',
    sv: 'Video',
    en: 'Video'
  },
  comingSoon: {
    fi: 'Tulossa',
    sv: 'På kommande',
    en: 'Coming soon'
  },
  contactAgent: {
    fi: 'Lisätiedot ja esittelyt',
    sv: 'Mer information och visningar',
    en: 'More information and viewings'
  },
  contactButton: {
    fi: 'Ota yhteyttä',
    sv: 'Kontakta',
    en: 'Contact'
  },
  share: {
    fi: 'Jaa',
    sv: 'Dela',
    en: 'Share'
  },
  mapLocation: {
    fi: 'Sijainti kartalla',
    sv: 'Visa på kartan',
    en: 'Location on map'
  },
  mapNotAvailable: {
    fi: 'Kartta ei saatavilla',
    sv: 'Karta inte tillgänglig',
    en: 'Map not available'
  },
  notAvailable: {
    fi: 'Ei saatavilla',
    sv: 'Inte tillgänglig',
    en: 'Not Available'
  },
  downloadPDF: {
    fi: 'Lataa PDF',
    sv: 'Ladda ner PDF',
    en: 'Download PDF'
  },
  openPDF: {
    fi: 'Avaa PDF',
    sv: 'Öppna PDF',
    en: 'Open PDF'
  },
  pdfViewerFallback: {
    fi: 'PDF-tiedosto ei näy? Avaa se uudessa välilehdessä.',
    sv: 'Kan du inte se PDF-filen? Öppna den i en ny flik.',
    en: 'Can\'t see the PDF? Open it in a new tab.'
  },
  
  // Boolean Values
  yes: {
    fi: 'Kyllä',
    sv: 'Ja',
    en: 'Yes'
  },
  no: {
    fi: 'Ei',
    sv: 'Nej',
    en: 'No'
  },
  
  // Unit Suffixes
  perMonth: {
    fi: '/kk',
    sv: '/mån',
    en: '/month'
  },
  perPersonMonth: {
    fi: '/hlö/kk',
    sv: '/person/mån',
    en: '/person/month'
  },
  perYear: {
    fi: '€/v',
    sv: '€/år',
    en: '€/year'
  },
  
  // NEW TRANSLATIONS - Kundens feedback (PUNKT 5-12)
  // Energy & Certificates
  listingHasEnergyCertificate: {
    fi: 'Energiatodistus (Kyllä/Ei)',
    sv: 'Energicertifikat (Ja/Nej)',
    en: 'Energy Certificate (Yes/No)'
  },
  
  // Housing Company Details (Lägenhet)
  housingCompanyHomeCity: {
    fi: 'Yhtiön kotipaikka',
    sv: 'Bolagets hemort',
    en: 'Company Home City'
  },
  housingCompanyApartmentCount: {
    fi: 'Asuntojen lukumäärä',
    sv: 'Antal bostäder',
    en: 'Number of Apartments'
  },
  housingCompanyBusinessSpaceCount: {
    fi: 'Liiketilojen lukumäärä',
    sv: 'Antal affärslokaler',
    en: 'Number of Business Spaces'
  },
  housingCompanyMortgage: {
    fi: 'Yhtiölaina',
    sv: 'Bolagslån',
    en: 'Company Mortgage'
  },
  housingCompanyMortgageDate: {
    fi: 'Yhtiölainan päivämäärä',
    sv: 'Bolagslånets datum',
    en: 'Mortgage Date'
  },
  housingCompanyRevenue: {
    fi: 'Yhtiön tulot',
    sv: 'Bolagets intäkter',
    en: 'Company Revenue'
  },
  housingCompanyUpcomingRenovations: {
    fi: 'Tulevat remontit',
    sv: 'Kommande renoveringar',
    en: 'Upcoming Renovations'
  },
  housingCompanyRedemptionRight: {
    fi: 'Yhtiön lunastusoikeus',
    sv: 'Bolagets inlösenrätt',
    en: 'Company Redemption Right'
  },
  partnerRedemptionRight: {
    fi: 'Osakaslunastuslauseke',
    sv: 'Andelsägarens inlösenklausul',
    en: 'Partner Redemption Right'
  },
  reportOnMaintenanceNeedsYear: {
    fi: 'Kunnossapitotarveselvitys vuosi',
    sv: 'Underhållsbehovsutredning år',
    en: 'Maintenance Needs Report Year'
  },
  
  // Property Management
  propertyManagerOffice: {
    fi: 'Isännöitsijätoimisto',
    sv: 'Förvaltningskontor',
    en: 'Property Management Office'
  },
  
  // Building Details
  numberOfFloors: {
    fi: 'Kerrosten lukumäärä',
    sv: 'Antal våningar',
    en: 'Number of Floors'
  },
  buildingYear: {
    fi: 'Rakennusvuosi',
    sv: 'Byggnadsår',
    en: 'Building Year'
  },
  
  // Plot/Property (Fastighet)
  siteArea: {
    fi: 'Tontin pinta-ala',
    sv: 'Tomtstorlek',
    en: 'Site Area'
  },
  propertyBuildingRights: {
    fi: 'Rakennusoikeus',
    sv: 'Byggnadsrätt',
    en: 'Building Rights'
  },
  siteOwnershipType: {
    fi: 'Tontin omistusmuoto',
    sv: 'Ägande',
    en: 'Site Ownership Type'
  },
  
  // International
  internationalUrl: {
    fi: 'Kansainvälinen listaus',
    sv: 'Global Listing',
    en: 'Global Listing'
  },
  internationalBrochureUrl: {
    fi: 'Kansainvälinen esite',
    sv: 'Internationell broschyr',
    en: 'International Brochure'
  },
  
  // Additional labels
  propertyType: {
    fi: 'Talon tyyppi',
    sv: 'Typ av hus',
    en: 'Property Type'
  },
  apartmentDescription: {
    fi: 'Huoneistoselitys',
    sv: 'Lägenhetsbeskrivning',
    en: 'Apartment Description'
  },
  totalArea: {
    fi: 'Kokonaispinta-ala',
    sv: 'Total yta',
    en: 'Total Area'
  }
};

/**
 * Get translated label for a field
 */
export function getTranslation(
  key: string,
  language: SupportedLanguage = 'fi'
): string {
  const translation = PROPERTY_TRANSLATIONS[key];
  if (!translation) {
    console.warn(`Missing translation for key: ${key}`);
    return key;
  }
  return translation[language] || translation['fi'];
}

/**
 * Get boolean translation
 */
export function getBooleanText(
  value: boolean,
  language: SupportedLanguage = 'fi'
): string {
  return value 
    ? getTranslation('yes', language)
    : getTranslation('no', language);
}

/**
 * Get unit suffix
 */
export function getUnitSuffix(
  unit: 'perMonth' | 'perPersonMonth' | 'perYear',
  language: SupportedLanguage = 'fi'
): string {
  return getTranslation(unit, language);
}

