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
    fi: 'Hinta- ja asuinkustannukset',
    sv: 'Pris- och boendekostnader',
    en: 'Price Information'
  },
  energyRating: {
    fi: 'Energiatodistus',
    sv: 'Energicertifikat',
    en: 'Energy Certificate'
  },
  propertyInfo: {
    fi: 'Huoneistotiedot',
    sv: 'Bostadsuppgifter',
    en: 'Apartment Information'
  },
  estateInfo: {
    fi: 'Kiinteistötiedot',
    sv: 'Fastighetsuppgifter',
    en: 'Estate Information'
  },
  apartmentTypeLabel: {
    fi: 'Huoneistotyyppi',
    sv: 'Lägenhetstyp',
    en: 'Apartment Type'
  },
  floorLabel: {
    fi: 'Kerros',
    sv: 'Våning',
    en: 'Floor'
  },
  housingCompanyAndEstateInfo: {
    fi: 'Yhtiö- ja kiinteistötiedot',
    sv: 'Bolags- och fastighetsuppgifter',
    en: 'Company and Property Information'
  },
  buildingInfo: {
    fi: 'Rakennustiedot',
    sv: 'Byggnadsinformation',
    en: 'Building Information'
  },
  housingCompanyDetails: {
    fi: 'Taloyhtiön tiedot',
    sv: 'Bostadsbolagets uppgifter',
    en: 'Housing Company Details'
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
    sv: 'Andra uppgifter',
    en: 'Other Information'
  },
  // NEW: Apartment-specific section headers
  overview: {
    fi: 'Yleiskatsaus',
    sv: 'Översikt',
    en: 'Overview'
  },
  apartmentDetails: {
    fi: 'Huoneistotiedot',
    sv: 'Lägenhetsinformation',
    en: 'Apartment Details'
  },
  buildingAndCompany: {
    fi: 'Rakennus & yhtiö',
    sv: 'Byggnad & Bolag',
    en: 'Building & Company'
  },
  buildingFacts: {
    fi: 'Rakennustiedot',
    sv: 'Byggfakta',
    en: 'Building Facts'
  },
  housingCompanyInfo: {
    fi: 'Taloyhtiön tiedot',
    sv: 'Bolagsinformation',
    en: 'Housing Company Information'
  },
  costs: {
    fi: 'Kustannukset',
    sv: 'Kostnader',
    en: 'Costs'
  },
  priceInformation: {
    fi: 'Hintatiedot',
    sv: 'Prisuppgifter',
    en: 'Price Information'
  },
  livingCosts: {
    fi: 'Asumiskustannukset',
    sv: 'Boendekostnader',
    en: 'Living Costs'
  },
  otherCostsSection: {
    fi: 'Muut kustannukset',
    sv: 'Andra kostnader',
    en: 'Other Costs'
  },
  propertyDetailsTab: {
    fi: 'Kiinteistötiedot',
    sv: 'Fastighetsuppgifter',
    en: 'Property Details'
  },
  buildingDetailsTab: {
    fi: 'Rakennustiedot',
    sv: 'Byggfakta',
    en: 'Building Details'
  },
  otherInformation: {
    fi: 'Muut tiedot',
    sv: 'Övriga uppgifter',
    en: 'Other Information'
  },
  documentsAndLinks: {
    fi: 'Asiakirjat & Linkit',
    sv: 'Dokument & Länkar',
    en: 'Documents & Links'
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
  debtShare: {
    fi: 'Velkaosuus',
    sv: 'Skuldandel',
    en: 'Debt Share'
  },
  debtFreePrice: {
    fi: 'Velaton hinta',
    sv: 'Skuldfritt pris',
    en: 'Debt-Free Price'
  },
  priceDetails: {
    fi: 'Hintatiedot',
    sv: 'Prisuppgifter',
    en: 'Price Details'
  },
  maintenanceFee: {
    fi: 'Hoitovastike',
    sv: 'Vederlag',
    en: 'Maintenance Fee'
  },
  financingFee: {
    fi: 'Rahoitusvastike',
    sv: 'Finansieringsvederlag',
    en: 'Financing Fee'
  },
  totalFee: {
    fi: 'Kokonaisvastike',
    sv: 'Total avgift',
    en: 'Total Fee'
  },
  totalMonthlyFee: {
    fi: 'Kuukausittaiset maksut yhteensä',
    sv: 'Totala månadsvederlaget',
    en: 'Total Monthly Fee'
  },
  waterFee: {
    fi: 'Vesimaksu',
    sv: 'Vattenavgift',
    en: 'Water Fee'
  },
  waterFeePerPerson: {
    fi: 'Vesimaksu per henkilö',
    sv: 'Vattenavgift per person',
    en: 'Water Fee per Person'
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
  housingCosts: {
    fi: 'Asumiskustannukset',
    sv: 'Boendekostnader',
    en: 'Housing Costs'
  },
  otherCosts: {
    fi: 'Muut kustannukset',
    sv: 'Övriga kostnader',
    en: 'Other Costs'
  },
  costSummary: {
    fi: 'Kustannusyhteenveto',
    sv: 'Kostnadssammanställning',
    en: 'Cost Summary'
  },
  plotRentFee: {
    fi: 'Tontin vuokravastike',
    sv: 'Tomthyra',
    en: 'Land Lease Fee'
  },
  heatingCosts: {
    fi: 'Lämmityskustannukset',
    sv: 'Uppvärmningskostnader',
    en: 'Heating Costs'
  },
  electricHeating: {
    fi: 'Sähkölämmitys',
    sv: 'Eluppvärmning',
    en: 'Electric Heating'
  },
  otherFee: {
    fi: 'Muu vastike',
    sv: 'Övrigt vederlag',
    en: 'Other Fee'
  },
  otherFees: {
    fi: 'Muut vastikkeet',
    sv: 'Övriga vederlag',
    en: 'Other Fees'
  },
  roadTollFee: {
    fi: 'Tiehoitomaksu',
    sv: 'Vägavgift',
    en: 'Road Maintenance Fee'
  },
  propertyTax: {
    fi: 'Kiinteistövero',
    sv: 'Fastighetsskatt',
    en: 'Property Tax'
  },
  cableTv: {
    fi: 'Kaapeli-TV',
    sv: 'Kabel-TV',
    en: 'Cable TV'
  },
  internet: {
    fi: 'Internet',
    sv: 'Internet',
    en: 'Internet'
  },
  insurance: {
    fi: 'Vakuutus',
    sv: 'Försäkring',
    en: 'Insurance'
  },
  totalMonthlyCosts: {
    fi: 'Kuukausikustannukset yhteensä',
    sv: 'Totala månadskostnader',
    en: 'Total Monthly Costs'
  },
  totalYearlyCosts: {
    fi: 'Vuosikustannukset yhteensä',
    sv: 'Totala årskostnader',
    en: 'Total Yearly Costs'
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
    fi: 'Vapautuminen',
    sv: 'Tillträde',
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
  antennaSystem: {
    fi: 'Antennijärjestelmä',
    sv: 'Antenn/Kabel',
    en: 'Antenna System'
  },
  
  // Housing Company Fields
  housingCompanyName: {
    fi: 'Taloyhtiön nimi',
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
  redemptionClauseFlats: {
    fi: 'Lunastuspykälä (asunnot)',
    sv: 'Inlösenklausul (lägenheter)',
    en: 'Redemption Clause (Flats)'
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
  ownershipType: {
    fi: 'Omistusmuoto',
    sv: 'Äganderätt',
    en: 'Ownership Type'
  },
  housingTenure: {
    fi: 'Hallintamuoto',
    sv: 'Förvaltningsform',
    en: 'Tenure'
  },
  tenure: {
    fi: 'Hallintamuoto',
    sv: 'Förvaltningsform',
    en: 'Tenure'
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
  constructionYear: {
    fi: 'Rakennusvuosi',
    sv: 'Byggnadsår',
    en: 'Year Built'
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
  ownSauna: {
    fi: 'Oma sauna',
    sv: 'Egen bastu',
    en: 'Own Sauna'
  },
  privateSauna: {
    fi: 'Oma sauna',
    sv: 'Egen bastu',
    en: 'Private Sauna'
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
  address: {
    fi: 'Osoite',
    sv: 'Adress',
    en: 'Address'
  },
  parking: {
    fi: 'Pysäköinti',
    sv: 'Parkering',
    en: 'Parking'
  },
  parkingInfo: {
    fi: 'Pysäköintitiedot',
    sv: 'Parkeringsinformation',
    en: 'Parking Information'
  },
  parkingFree: {
    fi: 'Ilmainen pysäköinti',
    sv: 'Gratis parkering',
    en: 'Free parking'
  },
  parkingPaid: {
    fi: 'Maksullinen pysäköinti',
    sv: 'Avgiftsbelagd parkering',
    en: 'Paid parking'
  },
  locationTagCenter: {
    fi: 'Keskustassa',
    sv: 'I centrum',
    en: 'In the city centre'
  },
  locationTagUrban: {
    fi: 'Kaupunkialueella',
    sv: 'I stadsområde',
    en: 'In urban area'
  },
  locationTagSuburban: {
    fi: 'Esikaupunkialueella',
    sv: 'I förortsområde',
    en: 'In suburban area'
  },
  locationTagRural: {
    fi: 'Maaseudulla',
    sv: 'På landsbygden',
    en: 'In rural area'
  },
  nearbyBuildingsLabel: {
    fi: 'Lähirakennukset',
    sv: 'Närliggande byggnader',
    en: 'Nearby buildings'
  },
  neighborsLabel: {
    fi: 'Naapurit',
    sv: 'Grannar',
    en: 'Neighbours'
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
  buildingPermit: {
    fi: 'Rakennuslupa',
    sv: 'Bygglov',
    en: 'Building Permit'
  },
  maintenancePlan: {
    fi: 'Huoltosuunnitelma',
    sv: 'Underhållsplan',
    en: 'Maintenance Plan'
  },
  asbestosSurveyReport: {
    fi: 'Asbestikartoitusraportti',
    sv: 'Asbestkartläggningsrapport',
    en: 'Asbestos Survey Report'
  },
  conditionReport: {
    fi: 'Kuntotarkastusraportti',
    sv: 'Konditionsrapport',
    en: 'Condition Report'
  },
  moistureReport: {
    fi: 'Kosteusmittausraportti',
    sv: 'Fuktmätningsrapport',
    en: 'Moisture Report'
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
    fi: 'Kaavatilanne',
    sv: 'Detaljplan',
    en: 'Zoning Situation'
  },
  zoning: {
    fi: 'Kaavatilanne',
    sv: 'Detaljplan',
    en: 'Zoning'
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
  plotPlan: {
    fi: 'Tonttijako',
    sv: 'Tomtindelning',
    en: 'Plot Plan'
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
  contactAgentTitle: {
    fi: 'Ota yhteyttä',
    sv: 'Ta kontakt',
    en: 'Contact Us'
  },
  realEstateAgent: {
    fi: 'Kiinteistönvälittäjä',
    sv: 'Fastighetsmäklare',
    en: 'Real Estate Agent'
  },
  basicInfo: {
    fi: 'Perustiedot',
    sv: 'Grunduppgifter',
    en: 'Basic Information'
  },
  propertyNumber: {
    fi: 'Kohdenumero',
    sv: 'Objektnummer',
    en: 'Property Number'
  },
  presentationText: {
    fi: 'Esittelyteksti',
    sv: 'Presentationstext',
    en: 'Description'
  },
  highlights: {
    fi: 'Kohokohdat',
    sv: 'Höjdpunkter',
    en: 'Highlights'
  },
  sellingPoints: {
    fi: 'Myyntivaltteja',
    sv: 'Försäljningsfördelar',
    en: 'Selling Points'
  },
  propertyFeatures: {
    fi: 'Kohteen ominaisuudet',
    sv: 'Objektets egenskaper',
    en: 'Property Features'
  },
  additionalMaterials: {
    fi: 'Lisämateriaali',
    sv: 'Ytterligare material',
    en: 'Additional Materials'
  },
  virtualTour: {
    fi: 'Virtuaaliesittely',
    sv: 'Virtuell visning',
    en: 'Virtual Tour'
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
  notSpecified: {
    fi: 'Ei ilmoitettu',
    sv: 'Ej angivet',
    en: 'Not specified'
  },
  missing: {
    fi: 'Tieto puuttuu',
    sv: 'Uppgift saknas',
    en: 'Information unavailable'
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
  city: {
    fi: 'Kaupunki',
    sv: 'Hemort',
    en: 'City'
  },
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
  housingCompanyEncumbrances: {
    fi: 'Taloyhtiön kiinnitykset',
    sv: 'Bolagets inteckningar',
    en: 'Housing Company Mortgages'
  },
  companyMortgages: {
    fi: 'Taloyhtiön kiinnitykset',
    sv: 'Bolagets inteckningar',
    en: 'Company Mortgages'
  },
  mortgageEncumbrances: {
    fi: 'Kiinnitykset / panttaukset',
    sv: 'Inteckningar / pantsättningar',
    en: 'Mortgages / Encumbrances'
  },
  companyLoans: {
    fi: 'Yhtiölainat',
    sv: 'Långfristiga lån',
    en: 'Company Loans'
  },
  housingCompanyLoans: {
    fi: 'Taloyhtiön lainat',
    sv: 'Bolagets lån',
    en: 'Housing Company Loans'
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
  propertyLotSize: {
    fi: 'Kiinteistön koko',
    sv: 'Tomtstorlek',
    en: 'Lot Size'
  },
  propertyBuildingRights: {
    fi: 'Rakennusoikeus',
    sv: 'Byggnadsrätt',
    en: 'Building Rights'
  },
  waterConnection: {
    fi: 'Vesijohto',
    sv: 'Vattenanslutning',
    en: 'Water Connection'
  },
  rightsAndEncumbrances: {
    fi: 'Rasitteet ja oikeudet',
    sv: 'Belastningar och rättigheter',
    en: 'Encumbrances & Rights'
  },
  siteOwnershipType: {
    fi: 'Tontin omistus',
    sv: 'Tomtägande',
    en: 'Site Ownership'
  },
  ventilation: {
    fi: 'Ilmanvaihto',
    sv: 'Ventilation',
    en: 'Ventilation'
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
  },
  
  // 🆕 OBLIGATORISKA FÄLT FÖR LÄGENHETER (från kundens kravlista)
  elevator: {
    fi: 'Hissi',
    sv: 'Hiss',
    en: 'Elevator'
  },
  encumbrances: {
    fi: 'Rasitteet',
    sv: 'Belastningar',
    en: 'Encumbrances'
  },
  specialRights: {
    fi: 'Erityiset oikeudet',
    sv: 'Särskilda rättigheter',
    en: 'Special Rights'
  },
  decidedRenovations: {
    fi: 'Päätetyt korjaukset',
    sv: 'Beslutade reparationer',
    en: 'Decided Renovations'
  },
  plannedRenovations: {
    fi: 'Suunnitellut korjaukset',
    sv: 'Planerade reparationer',
    en: 'Planned Renovations'
  },
  companyFinancialStatus: {
    fi: 'Yhtiön taloudellinen tila',
    sv: 'Bolagets ekonomiska ställning',
    en: 'Company Financial Status'
  },
  otherCharges: {
    fi: 'Muut maksut',
    sv: 'Övriga avgifter',
    en: 'Other Charges'
  },
  additionalInfo: {
    fi: 'Lisätiedot',
    sv: 'Mer information',
    en: 'Additional Information'
  },
  includedInSale: {
    fi: 'Kauppaan kuuluu',
    sv: 'Ingår i köpet',
    en: 'Included in sale'
  },
  excludedFromSale: {
    fi: 'Kauppaan ei kuulu',
    sv: 'Ingår inte i köpet',
    en: 'Excluded from sale'
  },
  documents: {
    fi: 'Asiakirjat',
    sv: 'Handlingar',
    en: 'Documents'
  },
  additionalFees: {
    fi: 'Lisämaksut',
    sv: 'Tilläggsavgifter',
    en: 'Additional Fees'
  },


  // Disclaimer
  listingDisclaimer: {
    fi: 'Tämä ilmoitus ei ole virallinen myyntiesite. Lisätiedot saat välittäjältä.',
    sv: 'Denna annons är inte ett officiellt försäljningbrochyr. Mer information fås av mäklaren.',
    en: 'This listing is not an official sales brochure. For more information, please contact the agent.'
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
