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
  district?: LinearLocalized;
  districtFree?: LinearLocalized;
  postalCode?: LinearLocalized;
  gate?: LinearLocalized;
  apartmentNumber?: LinearLocalized;
  nonLocalizedValues?: LinearNV;

  freeText?: LinearLocalized;
  freeTextTitle?: LinearLocalized;
  marketingDescription?: LinearLocalized;

  askPrice?: LinearLocalized;
  debtFreePrice?: LinearLocalized;
  propertyTax?: LinearLocalized;
  realEstateTax?: LinearLocalized;
  debtlessStartPrice?: LinearLocalized;
  biddingUrl?: string;

  area?: LinearLocalized;
  totalArea?: LinearLocalized;
  overallArea?: LinearLocalized;
  plotArea?: LinearLocalized;
  businessPremiseArea?: LinearLocalized;
  balconyArea?: LinearLocalized;
  terraceArea?: LinearLocalized;
  rooms?: LinearLocalized;
  numberOfRooms?: LinearLocalized;
  numberOfBedrooms?: LinearLocalized;
  numberOfBathrooms?: LinearLocalized;

  maintenanceCharge?: LinearLocalized;
  renovationCharge?: LinearLocalized;
  fundingCharge?: LinearLocalized;
  financingCharge?: LinearLocalized;
  waterCharge?: LinearLocalized;
  heatingCharge?: LinearLocalized;
  electricHeatingCharge?: LinearLocalized;
  averageTotalHeatingCharge?: LinearLocalized;
  parkingCharge?: LinearLocalized;
  saunaCharge?: LinearLocalized;

  status?: LinearLocalized;
  listingType?: LinearLocalized;
  propertyType?: LinearLocalized;
  type?: LinearLocalized;
  productGroup?: LinearLocalized;
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
  floor?: LinearLocalized;
  floorLocation?: LinearLocalized;
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

  rent?: LinearLocalized;
  securityDeposit?: LinearLocalized;
  rentalContractType?: LinearLocalized;
  earliestTermination?: LinearLocalized;
  petsAllowed?: any;
  smokingAllowed?: any;

  hasBalcony?: any;
  balcony?: any;
  hasTerrace?: any;
  terrace?: any;
  sauna?: any;
  fireplace?: any;
  storageRoom?: any;
  hasParkingSpace?: any;
  parkingSpace?: any;

  latitude?: LinearLocalized;
  longitude?: LinearLocalized;
  mapCoordinates?: LinearLocalized;
  coordinates?: LinearLocalized;

  images?: {
    url: string;
    thumbnail?: string;
    compressed?: string;
    isFloorPlan?: boolean;
  }[];

  floorPlanUrl?: LinearLocalized;
  brochureUrl?: LinearLocalized;
  propertyBrochureUrl?: LinearLocalized;
  virtualTourUrl?: LinearLocalized;
  internationalBrochureUrl?: LinearLocalized;
  videoUrl?: LinearLocalized;
  energyCertificateUrl?: LinearLocalized;

  links?: Array<{ value: string; label?: string; locale?: string }> | LinearLocalized;

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
    primaryCompany?: { id?: number; name?: string; businessId?: string; address?: string; postNumber?: string; postOffice?: string; logo?: string };
  };
  realtorName?: string;

  // Index signature for fields not explicitly typed
  [key: string]: any;
}
