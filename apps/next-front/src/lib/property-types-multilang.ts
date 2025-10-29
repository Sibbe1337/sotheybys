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
  // 0. CORE IDENTIFIERS / TUNNISTEET / IDENTIFIERARE
  // ============================================================================

  /**
   * URL-safe slug for the property (generated from address)
   * FI: URL-turvallinen tunniste (luotu osoitteesta)
   * SV: URL-säker identifierare (genererad från adress)
   */
  slug: string;

  // ============================================================================
  // 1. GENERAL PROPERTY INFO / YLEISET KIINTEISTÖTIEDOT / ALLMÄN FASTIGHETSINFORMATION
  // ============================================================================

  /**
   * Apartment type description (Huoneistoselitelmä)
   * FI: Huoneistoselitelmä (esim. "2h+k", "Paritalohuoneisto; 4mh, 2oh, rt, k, s, 2kph")
   * EN: Apartment description (e.g., "2 rooms + kitchen", "Semi-detached apartment...")
   * SV: Lägenhetsbeskrivning (t.ex. "2 rum + kök", "Parhus...")
   */
  typeOfApartment: LocalizedString;

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
   * District (free text)
   * FI: Kaupunginosa/kylä (vapaa teksti)
   * SV: Stadsdel/by (fritext)
   * Example: "Lauttasaari/Drumsö"
   */
  districtFree: LocalizedString;

  /**
   * District (structured)
   * FI: Kaupunginosa
   * SV: Stadsdel
   */
  district: LocalizedString;

  /**
   * Part of city
   * FI: Kaupunginosa
   * SV: Del av staden
   */
  partOfCity: LocalizedString;

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
   * FI: Omistusmuoto (esim. "Omistusasunto", "Osaomistus", "Asumisoikeus")
   * EN: Ownership type (e.g., "Owner-occupied", "Part ownership", "Right of occupancy")
   * SV: Ägandeform (t.ex. "Ägarlägenhet", "Delägarskap", "Boenderätt")
   */
  ownershipType: LocalizedString;

  /**
   * Housing tenure / Management form
   * FI: Hallintamuoto (esim. "Asunto-osakeyhtiö", "Kiinteistöosakeyhtiö", "Osaomistus")
   * EN: Housing tenure (e.g., "Housing cooperative", "Real estate company", "Part ownership")
   * SV: Besittningsform (t.ex. "Bostadsaktiebolag", "Fastighetsaktiebolag", "Delägarskap")
   */
  housingTenure: LocalizedString;

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
   * Has elevator
   * FI: Hissi
   * SV: Hiss
   */
  elevator: boolean;

  /**
   * Housing cooperative elevator (from Linear API)
   * FI: Taloyhtiön hissi (esim. "Kyllä", "Ei")
   * SV: Bostadsbolagets hiss (t.ex. "Ja", "Nej")
   */
  housingCooperativeElevator?: string;

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
   * Ventilation type (alias for ventilationSystem for component compatibility)
   * FI: Ilmanvaihtotyyppi
   * EN: Ventilation type
   * SV: Ventilationstyp
   */
  ventilationType: LocalizedString;

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

  /**
   * Energy certificate status (for properties/houses only)
   * Possible values:
   * - "Kyllä" (Yes, has certificate)
   * - "Ei lain edellyttämää energiatodistusta" (Not legally required)
   * - "Kohteella ei energiatodistuslain nojalla tarvitse olla energiatodistusta" (Not required by law)
   */
  energyCertificateStatus?: string;

  /**
   * Energy certificate URL
   * FI: Energiatodistuksen URL-osoite
   * SV: Energicertifikat URL
   */
  energyCertificateUrl?: string;

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
   * Lot area (alias for siteArea for component compatibility)
   * FI: Tontin kokonaispinta-ala neliömetreinä
   * SV: Tomtens totala yta i kvadratmeter
   */
  lotArea: number;

  /**
   * Formatted plot area with unit (for property card display)
   * FI: Tontin pinta-ala muotoiltuna yksikön kanssa (esim. "0,1299 ha" tai "1299 m²")
   * EN: Formatted plot area with unit (e.g., "0.1299 ha" or "1299 m²")
   * SV: Formaterad tomtyta med enhet (t.ex. "0,1299 ha" eller "1299 m²")
   */
  plotArea: string;

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

  /**
   * Building rights (m²)
   * FI: Rakennusoikeus (m²)
   * SV: Byggnadsrätt (m²)
   */
  propertyBuildingRights?: LocalizedString;

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
   * Mandatory charges in EUR
   * FI: Pakolliset maksut euroina
   * SV: Obligatoriska avgifter i euro
   */
  mandatoryCharges?: number;

  /**
   * Funding charge in EUR
   * FI: Rahoitusvastike euroina
   * SV: Finansieringsavgift i euro
   */
  fundingCharge?: number;

  /**
   * Renovation charge in EUR
   * FI: Korjausvastike euroina
   * SV: Renoveringsavgift i euro
   */
  renovationCharge?: number;

  /**
   * Sauna charge in EUR
   * FI: Saunamaksu euroina
   * SV: Bastuavgift i euro
   */
  saunaCharge?: number;

  /**
   * Parking charge in EUR
   * FI: Autopaikkamaksu euroina
   * SV: Parkeringsavgift i euro
   */
  parkingCharge?: number;

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
  // 3.5 RENTAL-SPECIFIC FIELDS / VUOKRAKOHTEET / HYRESOBJEKT
  // ============================================================================

  /**
   * Monthly rent in EUR
   * FI: Kuukausivuokra euroina
   * SV: Månadshyra i euro
   */
  rent?: number;

  /**
   * Security deposit type
   * FI: Vakuuden tyyppi
   * SV: Depositionstyp
   */
  securityDepositType?: LocalizedString;

  /**
   * Rental contract type
   * FI: Vuokrasopimuksen tyyppi
   * SV: Hyresavtalstyp
   */
  rentalContractType?: LocalizedString;

  /**
   * Earliest termination date
   * FI: Aikaisin irtisanomispäivä
   * SV: Tidigaste uppsägningsdatum
   */
  earliestTerminateDate?: LocalizedString;

  /**
   * Water charge description
   * FI: Vesimaksun kuvaus (esim. "Vesimaksu sisältyy vuokraan")
   * SV: Vattenavgiftsbeskrivning (t.ex. "Vattenavgift ingår i hyran")
   * EN: Water charge description (e.g. "Water charge is included in the rent")
   */
  waterChargeText?: LocalizedString;

  /**
   * Pets allowed
   * FI: Lemmikit sallittu
   * SV: Husdjur tillåtna
   */
  petsAllowed?: boolean;

  /**
   * Smoking allowed
   * FI: Tupakointi sallittu
   * SV: Rökning tillåten
   */
  smokingAllowed?: boolean;

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
   * Housing company home city
   * FI: Yhtiön kotipaikka
   * SV: Bolagets hemort
   */
  housingCompanyHomeCity?: LocalizedString;

  /**
   * Number of apartments in housing company
   * FI: Asuntojen lukumäärä
   * SV: Antal bostäder
   */
  housingCompanyApartmentCount?: LocalizedString;

  /**
   * Number of business spaces in housing company
   * FI: Liiketilojen lukumäärä
   * SV: Antal affärslokaler
   */
  housingCompanyBusinessSpaceCount?: LocalizedString;

  /**
   * Housing company mortgage
   * FI: Yhtiölaina
   * SV: Bolagslån
   */
  housingCompanyMortgage?: number;

  /**
   * Housing company mortgage date
   * FI: Yhtiölainan päivämäärä
   * SV: Bolagslånets datum
   */
  housingCompanyMortgageDate?: LocalizedString;

  /**
   * Housing company revenue
   * FI: Yhtiön tulot
   * SV: Bolagets intäkter
   */
  housingCompanyRevenue?: number;

  /**
   * Housing company upcoming renovations
   * FI: Tulevat remontit
   * SV: Kommande renoveringar
   */
  housingCompanyUpcomingRenovations?: LocalizedString;

  /**
   * Housing company redemption right
   * FI: Yhtiön lunastusoikeus
   * SV: Bolagets inlösenrätt
   */
  housingCompanyRedemptionRight?: LocalizedString;

  /**
   * Partner redemption right
   * FI: Osakaslunastuslauseke
   * SV: Andelsägarens inlösenklausul
   */
  partnerRedemptionRight?: LocalizedString;

  /**
   * Report on maintenance needs year
   * FI: Kunnossapitotarveselvitys vuosi
   * SV: Underhållsbehovsutredning år
   */
  reportOnMaintenanceNeedsYear?: LocalizedString;

  /**
   * Property manager office
   * FI: Isännöitsijätoimisto
   * SV: Förvaltningskontor
   */
  propertyManagerOffice?: LocalizedString;

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
   * Company loans date (Taloyhtiön lainan päivämäärä)
   * FI: Taloyhtiön lainan päivämäärä
   * SV: Bolagslånets datum
   * EN: Company loans date
   */
  companyLoansDate?: LocalizedString;

  /**
   * Housing company mortgages (from Linear API)
   * FI: Taloyhtiön kiinnitykset
   * SV: Bostadsbolagets inteckningar
   */
  housingCompanyMortgages?: string;

  /**
   * Company mortgages (from Linear API)
   * FI: Yhtiön kiinnitykset
   * SV: Bolagets inteckningar
   */
  companyMortgages?: string;

  /**
   * Housing cooperative mortgage (from Linear API)
   * FI: Osuuskunnan kiinnitys
   * SV: Andelslagets inteckning
   */
  housingCooperativeMortgage?: string;

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
   * Agent/realtor information object
   * FI: Kiinteistönvälittäjän tiedot
   * SV: Mäklarens information
   * Contains: name, phone, email, photo {sourceUrl, altText}, company info
   */
  agent?: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    photo?: {
      sourceUrl: string;
      altText?: string;
    } | null;
    avatar?: string;
    company?: {
      name?: string;
      logo?: string;
      businessId?: string;
      privacyLink?: string;
    };
  };

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

  /**
   * International brochure PDF URL
   * FI: Kansainvälinen esite PDF URL-osoite
   * SV: Internationell broschyr PDF-URL
   */
  internationalBrochureUrl?: string;

  /**
   * International listing URL (e.g., Sotheby's International)
   * FI: Kansainvälinen listaus URL-osoite
   * SV: Internationell listnings-URL
   */
  internationalUrl?: string;

  /**
   * Property video URL (YouTube, Vimeo, etc.)
   * FI: Kiinteistön video URL-osoite
   * SV: Fastighetsvideo-URL
   */
  videoUrl?: string;

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

  // Avrunda till heltal för att undvika decimaler
  const rounded = Math.round(price);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
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

  // Avrunda till heltal för att undvika decimaler som 1298.9999999999998
  const rounded = Math.round(area);
  return `${new Intl.NumberFormat(locale).format(rounded)} m²`;
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
  typeOfApartment: {
    fi: 'Huoneistoselitelmä',
    en: 'Apartment Description',
    sv: 'Lägenhetsbeskrivning',
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

