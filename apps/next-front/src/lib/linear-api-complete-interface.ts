/**
 * Complete Linear API Interface
 * This file contains ALL fields available from the Linear API
 * Based on comprehensive field analysis
 */

// Helper type for localized fields
interface LocalizedField<T = string> {
  fi: {
    key: string;
    value: T;
    category: string;
  };
}

// Realtor/Agent structure
export interface LinearAPIRealtor {
  id: number;
  name: string;
  tel: string;
  email: string;
  avatar: string;
  primaryCompany: {
    id: number;
    name: string;
    email: string;
    tel: string;
    privacyProtectionLink: string;
    businessId: string;
    address: string;
    postNumber: string;
    postOffice: string;
    logo: string;
  };
}

// Image structure
export interface LinearAPIImage {
  id: number;
  description: string | null;
  url: string;
  thumbnail: string;
  compressed: string;
  isFloorPlan: boolean;
}

// Non-localized values
export interface LinearAPINonLocalizedValues {
  id: string;
  commissionType: string;
  floorCount: string;
  lotArea: string;
  lotAreaUnit: string;
  plotArea?: string; // Tomtstorlek (plot size)
  totalArea?: string; // Total yta (total area)
  debtFreePrice: string;
  publishDate: string;
  askPrice: string;
  typeOfApartment: {
    en: string | null;
    sv: string | null;
    fi: string;
  };
  address: string;
  city: string;
  municipality: string;
  completeYear: string;
  condition: string;
  roomCount: string;
  type: string;
  listingType: string;
  terrace: boolean;
  floor: string;
  totalFloors: number;
  status: string;
  lotOwnership: string;
  sauna: boolean;
  elevator: boolean;
  newlyConstructed: boolean;
  beach: string;
  inIsland: boolean;
  saunaStoveType: string[];
  productGroup: string;
  salesMethod: string;
  province: string;
  bedroomCount: string;
  wcCount: string;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  hasParkingSpace: boolean;
  hasBalcony: boolean;
  area: string;
  country: string;
  externalMigratedKiviRealtyUniqueNo: string | null;
  hasHighCeilings: boolean;
  isElectricalSystemRenovated: boolean | null;
  electricalSystemRenovationYear: number | null;
  sewerSystemRenovationYear: number | null;
  waterPipeRenovationYear: number | null;
}

// Complete Linear API Listing Interface
export interface CompleteLinearAPIListing {
  // Core identification fields
  id: LocalizedField;
  identifier: LocalizedField<number>;
  runningNumber: LocalizedField;
  
  // Basic property information
  address: LocalizedField;
  city: LocalizedField;
  municipality: LocalizedField;
  postalCode: LocalizedField;
  country: LocalizedField;
  province: LocalizedField;
  districtFree: LocalizedField;
  
  // Pricing and financial
  askPrice: LocalizedField;
  debtFreePrice: LocalizedField;
  debt: LocalizedField;
  maintenanceCharge: LocalizedField;
  mandatoryCharges: LocalizedField;
  renovationCharge: LocalizedField;
  waterCharge: LocalizedField<number | null>;
  otherCharge: LocalizedField;
  plotRentCharge: LocalizedField;
  fundingCharge: LocalizedField;
  parkingCharge: LocalizedField;
  saunaCharge: LocalizedField;
  laundryRoomCharge: LocalizedField;
  heatingCharge: LocalizedField;
  broadbandCharge: LocalizedField;
  waterAndSewageCharge: LocalizedField;
  roadTolls: LocalizedField;
  sanitationCharge: LocalizedField;
  propertyTax: LocalizedField;
  electricHeatingCharge: LocalizedField;
  averageTotalHeatingCharge: LocalizedField;
  
  // Property specifications
  area: LocalizedField;
  overallArea: LocalizedField;
  totalArea: LocalizedField; // Total yta (same as overallArea, from Linear API)
  otherArea: LocalizedField;
  businessPremiseArea: LocalizedField;
  areaBasis: LocalizedField;
  areaBasisControlMeasured: LocalizedField;
  roomCount: LocalizedField;
  typeOfApartment: LocalizedField;
  rooms: LocalizedField;
  bedroomCount: LocalizedField;
  wcCount: LocalizedField;
  floor: LocalizedField;
  floorCount: LocalizedField;
  apartmentNumber: LocalizedField;
  gate: LocalizedField;
  
  // Property type and status
  type: LocalizedField;
  listingType: LocalizedField;
  propertyType: LocalizedField;
  productGroup: LocalizedField;
  status: LocalizedField;
  commissionType: LocalizedField;
  salesMethod: LocalizedField;
  soldAsRented: LocalizedField;
  newlyConstructed: LocalizedField;
  
  // Building and construction
  completeYear: LocalizedField;
  constructionYear: LocalizedField;
  constructionStartYear: LocalizedField;
  constructionFinalCheckYear: LocalizedField;
  deploymentYear: LocalizedField;
  constructionPhase: LocalizedField;
  constructionMaterial: LocalizedField;
  buildingMaterialFacade: LocalizedField;
  roofType: LocalizedField;
  roofMaterial: LocalizedField;
  roofingMaterial: LocalizedField;
  roofCondition: LocalizedField;
  
  // Energy and utilities
  energyClass: LocalizedField;
  listingHasEnergyCertificate: LocalizedField;
  energyCertificateValidity: LocalizedField;
  heatingSystem: LocalizedField;
  electricHeatingType: LocalizedField;
  electricHeatingPowerUsage: LocalizedField;
  electricalSystemRenovated: LocalizedField;
  sewerSystemRenovated: LocalizedField;
  waterPipeRenovated: LocalizedField;
  pipeRenovationYear: LocalizedField;
  
  // Lot and property details
  lotArea: LocalizedField;
  plotArea: LocalizedField; // Tomtstorlek (same as lotArea, from Linear API)
  lotType: LocalizedField;
  lotOwnership: LocalizedField;
  lotNumber: LocalizedField;
  lotSalesType: LocalizedField;
  lotShareRedeemed: LocalizedField;
  lotRentEndDate: LocalizedField;
  landYearRent: LocalizedField;
  landRedemptionPrice: LocalizedField;
  landRenter: LocalizedField;
  propertyIdentifier: LocalizedField;
  propertyName: LocalizedField;
  propertyBuildingRights: LocalizedField;
  propertyBuildingRightsENumber: LocalizedField;
  
  // Housing company information
  housingCooperativeName: LocalizedField;
  shareNumbers: LocalizedField;
  housingCooperativeLoans: LocalizedField;
  housingCooperativeLoansDate: LocalizedField;
  housingCooperativeMortgage: LocalizedField;
  housingCooperativeMortgageDate: LocalizedField;
  housingCooperativeRevenue: LocalizedField;
  housingCooperativeApartmentCount: LocalizedField;
  housingCooperativeRetailSpaceCount: LocalizedField;
  housingCooperativeSauna: LocalizedField;
  housingCooperativeElevator: LocalizedField;
  housingCooperativeRedemptionRight: LocalizedField;
  partnerRedemptionRight: LocalizedField;
  housingCooperativeHas: LocalizedField;
  housingCooperativeUpcomingRenovations: LocalizedField;
  housingCooperativeParkingSpaces: LocalizedField;
  canHousingCoopChargeExtraCompensation: LocalizedField;
  reportOnMaintenanceNeedsYear: LocalizedField;
  
  // Property management
  propertyManagerName: LocalizedField;
  propertyManagerOffice: LocalizedField;
  propertyManagerEmail: LocalizedField;
  propertyManagerPhone: LocalizedField;
  propertyManagerStreetAddress: LocalizedField;
  propertyManagerCity: LocalizedField;
  propertyManagerPostNumber: LocalizedField;
  propertyManagerCertificateDate: LocalizedField;
  propertyMaintenance: LocalizedField;
  
  // Features and amenities
  sauna: LocalizedField;
  elevator: LocalizedField;
  balcony: LocalizedField;
  terrace: LocalizedField;
  hasBalcony: LocalizedField;
  balconyArea: LocalizedField;
  balconyTypes: LocalizedField;
  balconyCompassPoint: LocalizedField;
  windowsDirection: LocalizedField;
  windowTypes: LocalizedField;
  hasHighCeilings: LocalizedField;
  antenna: LocalizedField;
  hasSatelliteAntenna: LocalizedField;
  hasCableTv: LocalizedField;
  propertyHasAntenna: LocalizedField;
  propertyAntennaDescription: LocalizedField;
  fireplace: LocalizedField;
  swimmingPool: LocalizedField;
  
  // Parking and storage
  parkingSpaces: LocalizedField;
  parkingSpace: LocalizedField;
  hasParkingSpace: LocalizedField;
  autoparkingType: LocalizedField;
  garageCount: LocalizedField;
  carPortCount: LocalizedField;
  electricPlugParkingSpaceCount: LocalizedField;
  yardParkingSpaceCount: LocalizedField;
  parkingGarageCount: LocalizedField;
  parking: LocalizedField;
  storageSpaceTypes: LocalizedField;
  
  // Room descriptions and materials
  kitchenDescription: LocalizedField;
  bathroomDescription: LocalizedField;
  livingRoomDescription: LocalizedField;
  bedroomDescription: LocalizedField;
  utilityRoomDescription: LocalizedField;
  wcDescription: LocalizedField;
  saunaDescription: LocalizedField;
  otherSpacesInfo: LocalizedField;
  
  // Floor materials
  kitchenFloorMaterial: LocalizedField;
  bathroomFloorMaterial: LocalizedField;
  livingRoomFloorMaterial: LocalizedField;
  bedroomFloorMaterial: LocalizedField;
  utilityRoomFloorMaterial: LocalizedField;
  wcFloorMaterial: LocalizedField;
  saunaFloorMaterial: LocalizedField;
  
  // Wall materials
  kitchenWallMaterial: LocalizedField;
  bathroomWallMaterial: LocalizedField;
  livingRoomWallMaterial: LocalizedField;
  bedroomWallMaterial: LocalizedField;
  utilityRoomWallMaterial: LocalizedField;
  wcWallMaterial: LocalizedField;
  saunaWallMaterial: LocalizedField;
  
  // Equipment and appliances
  stoveType: LocalizedField;
  saunaStoveType: LocalizedField;
  kitchenEquipment: LocalizedField;
  bathroomEquipment: LocalizedField;
  wcEquipment: LocalizedField;
  utilityRoomEquipment: LocalizedField;
  kitchenWorkTop: LocalizedField;
  
  // Condition and renovations
  condition: LocalizedField;
  generalCondition: LocalizedField;
  furnished: LocalizedField;
  pastRenovations: LocalizedField;
  modificationWorkInfo: LocalizedField;
  conditionCheckDate: LocalizedField;
  conditionInvestigationDate: LocalizedField;
  humidityInvestigationDate: LocalizedField;
  asbestosSurvey: LocalizedField;
  asbestosSurveyInfo: LocalizedField;
  sellerAwareWaterDamage: LocalizedField;
  sellerAwareHumidityDamage: LocalizedField;
  sellerAwareMoldDamage: LocalizedField;
  sellerAwareWaterDamageLocation: LocalizedField;
  sellerAwareHumidityDamageLocation: LocalizedField;
  sellerAwareMoldDamageLocation: LocalizedField;
  
  // Location and surroundings
  beach: LocalizedField;
  beachType: LocalizedField;
  ownBeachLine: LocalizedField;
  inIsland: LocalizedField;
  roadTo: LocalizedField;
  roadType: LocalizedField;
  roadCondition: LocalizedField;
  roadMaintenanceCharge: LocalizedField;
  bodyOfWater: LocalizedField;
  view: LocalizedField;
  yard: LocalizedField;
  
  // Services and connections
  services: LocalizedField;
  schools: LocalizedField;
  kindergarten: LocalizedField;
  localInfo: LocalizedField;
  trafficConnections: LocalizedField;
  trafficConnectionsInfo: LocalizedField;
  electricalConnections: LocalizedField;
  electricPlanTransfers: LocalizedField;
  electricityContract: LocalizedField;
  networkConnectionType: LocalizedField;
  connectedToDataNetwork: LocalizedField;
  
  // Zoning and planning
  zoningStatus: LocalizedField;
  zoningDetails: LocalizedField;
  zoningInfo: LocalizedField;
  mapCoordinates: LocalizedField;
  
  // Rental information
  rent: LocalizedField;
  rentUpdateDate: LocalizedField;
  rentPaymentDate: LocalizedField;
  rentIncreaseBasis: LocalizedField;
  securityDepositType: LocalizedField;
  latestDepositPaymentDate: LocalizedField;
  earliestTerminateDate: LocalizedField;
  rentalContractType: LocalizedField;
  subleasing: LocalizedField;
  subleasingDetails: LocalizedField;
  housingTenure: LocalizedField;
  petsAllowed: LocalizedField;
  smokingAllowed: LocalizedField;
  laundryRoomChargeType: LocalizedField;
  tenantIsResponsibleFor: LocalizedField;
  tenantIsResponsibleForHeatingSystemCleanup: LocalizedField;
  tenantHomeInsuranceRequirement: LocalizedField;
  drillingOtherThanFurnituresTilesSeams: LocalizedField;
  failureOfReturnOfKeysPenaltyAmount: LocalizedField;
  
  // Additional information
  freeText: LocalizedField;
  freeTextTitle: LocalizedField;
  release: LocalizedField;
  freeOnText: LocalizedField;
  publishDate: LocalizedField;
  hasSpecialTerms: LocalizedField;
  dealIncludes: LocalizedField;
  dealDoesNotInclude: LocalizedField;
  includes: LocalizedField;
  restrictions: LocalizedField;
  importantInfoAffectingSale: LocalizedField;
  contactInfoSource: LocalizedField;
  customRealtorCompanyName: LocalizedField;
  debtlessStartPrice: LocalizedField;
  highestOfferPrice: LocalizedField;
  ownershipType: LocalizedField;
  landCadastre: LocalizedField;
  sweepingCharge: LocalizedField;
  firewoodIncluded: LocalizedField;
  
  // Additional info fields
  areaMoreInfo: LocalizedField;
  storageDescription: LocalizedField;
  chargeInfo: LocalizedField;
  parkingSpaceInfo: LocalizedField;
  parkingInfo: LocalizedField;
  propertyMaintenanceInfo: LocalizedField;
  energyClassInfo: LocalizedField;
  conditionInfo: LocalizedField;
  accessibleInfo: LocalizedField;
  beachInfo: LocalizedField;
  constructionMaterialInfo: LocalizedField;
  constructionYearInfo: LocalizedField;
  propertyBuildingRightsInfo: LocalizedField;
  propertyBuildingsInfo: LocalizedField;
  propertyContainsBuildingsIncludedInDeal: LocalizedField;
  propertyBuildings: LocalizedField;
  sewerInfo: LocalizedField;
  terraceInfo: LocalizedField;
  waterPipeInfo: LocalizedField;
  otherChargeDescription: LocalizedField;
  reportOnMaintenanceNeedsInfo: LocalizedField;
  housingCooperativeAdditionalInfo: LocalizedField;
  lotInfo: LocalizedField;
  wallMaterialInfo: LocalizedField;
  floorMaterialInfo: LocalizedField;
  roofMaterialInfo: LocalizedField;
  
  // Links and media
  links: LocalizedField<Array<{ label: string; value: string; }>>;
  videoUrl: LocalizedField;
  virtualShowing: LocalizedField;
  
  // Security & Technology
  securitySystem: LocalizedField;
  internetConnection: LocalizedField;
  cableTV: LocalizedField;
  telephoneConnection: LocalizedField;
  electricalOutlets: LocalizedField;
  airConditioning: LocalizedField;
  ventilationSystem: LocalizedField;
  centralVacuum: LocalizedField;
  alarmSystem: LocalizedField;
  smartLock: LocalizedField;
  videoIntercom: LocalizedField;
  doorCode: LocalizedField;
  
  // Waste Management
  wasteManagement: LocalizedField;
  recyclingOptions: LocalizedField;
  compostingAvailable: LocalizedField;
  
  // Additional Costs & Charges
  cableCharge: LocalizedField;
  internetCharge: LocalizedField;
  insuranceRequired: LocalizedField;
  monthlyTotalCost: LocalizedField;
  yearlyTotalCost: LocalizedField;
  
  // Documentation URLs
  floorPlanUrl: LocalizedField;
  energyCertificateUrl: LocalizedField;
  propertyPlanUrl: LocalizedField;
  buildingPermitUrl: LocalizedField;
  maintenancePlanUrl: LocalizedField;
  propertyBrochureUrl: LocalizedField;
  internationalBrochureUrl: LocalizedField;
  youtubeUrl: LocalizedField;
  
  // Asbestos & Renovations
  asbestosSurveyDate: LocalizedField;
  asbestosSurveyReport: LocalizedField;
  renovationHistory: LocalizedField<Array<{ year?: string; description: string; details?: string; }>>;
  plannedRenovations: LocalizedField<Array<{ description: string; estimatedDate?: string; }>>;
  
  // Damage & Repairs
  waterDamage: LocalizedField;
  moistureDamage: LocalizedField;
  moldDamage: LocalizedField;
  damageRepairs: LocalizedField;
  damageDescription: LocalizedField;
  damageDate: LocalizedField;
  
  // Modifications
  modificationsMade: LocalizedField;
  modificationsNotified: LocalizedField;
  modificationsDescription: LocalizedField;
  
  // Location Details
  locationCenterCity: LocalizedField;
  locationUrbanArea: LocalizedField;
  locationSuburban: LocalizedField;
  locationRural: LocalizedField;
  neighborsSurrounding: LocalizedField;
  nearbyBuildings: LocalizedField;
  parkingFree: LocalizedField;
  parkingPaid: LocalizedField;
  
  // Transportation
  busStopNearby: LocalizedField;
  metroStationNearby: LocalizedField;
  trainStationNearby: LocalizedField;
  smoothCarConnections: LocalizedField;
  taxiStandNearby: LocalizedField;
  airportNearby: LocalizedField;
  goodBikeRoutes: LocalizedField;
  tramStopNearby: LocalizedField;
  publicTransportAccess: LocalizedField;
  
  // Beach & Shore
  noBeach: LocalizedField;
  ownBeach: LocalizedField;
  beachRights: LocalizedField;
  sharedBeach: LocalizedField;
  waterBodyName: LocalizedField;
  
  // Reports & Documents
  conditionReport: LocalizedField;
  moistureReport: LocalizedField;
  drivingInstructions: LocalizedField;
  
  // Marketing
  marketingTitle: LocalizedField;
  marketingDescription: LocalizedField;
  
  // Non-localized fields
  images: LinearAPIImage[];
  realtor: LinearAPIRealtor;
  realtorName: string;
  presentations: any[];
  nonLocalizedValues: LinearAPINonLocalizedValues;
}
