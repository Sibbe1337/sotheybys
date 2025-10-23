/**
 * Complete Linear API Converter
 * Extracts ALL available fields from Linear API listings
 */

import { CompleteLinearAPIListing } from './linear-api-complete-interface';
import { generateSlug } from './utils';
import { parseEuroNumber } from './number-eu';

// Helper function to safely extract localized value
function extractLocalizedValue<T = string>(field: any, defaultValue: T | null = null): T | null {
  if (!field || typeof field !== 'object') {
    return defaultValue;
  }
  if (field.fi && typeof field.fi === 'object' && 'value' in field.fi) {
    return field.fi.value !== undefined && field.fi.value !== null ? field.fi.value : defaultValue;
  }
  return defaultValue;
}

// Helper function to extract localized array
function extractLocalizedArray(field: any): Array<{ label: string; value: string; }> {
  const value = extractLocalizedValue(field, []);
  return Array.isArray(value) ? value : [];
}

// Helper function to parse price values (handles European number format)
// Delegates to parseEuroNumber and returns string for WordPress compatibility
function parsePrice(value: string | number | null): string | null {
  if (value === null || value === undefined) return null;
  
  const parsed = parseEuroNumber(value);
  if (parsed === 0 && value !== 0 && value !== '0') return null;
  
  // Return as integer string (remove decimals for prices)
  return Math.round(parsed).toString();
}

export function convertCompleteLinearToWordPressFormat(listing: CompleteLinearAPIListing) {
  // Extract all fields with null fallback to prevent React errors
  // Updated: 2025-01-23 - Fixed slug generation with robust fallback chain
  const id = extractLocalizedValue(listing.id) || '';
  const identifier = extractLocalizedValue(listing.identifier, 0) || 0;
  const runningNumber = extractLocalizedValue(listing.runningNumber) || null;
  
  // Basic information
  const address = extractLocalizedValue(listing.address) || '';
  const city = extractLocalizedValue(listing.city) || '';
  const municipality = extractLocalizedValue(listing.municipality) || null;
  const postalCode = extractLocalizedValue(listing.postalCode) || null;
  const country = extractLocalizedValue(listing.country) || null;
  const province = extractLocalizedValue(listing.province) || null;
  const districtFree = extractLocalizedValue(listing.districtFree) || null;
  
  // Pricing - Use nonLocalizedValues first for accuracy
  const rawAskPrice = listing.nonLocalizedValues?.askPrice || extractLocalizedValue(listing.askPrice) || null;
  const askPrice = rawAskPrice ? parsePrice(rawAskPrice) : null;
  const rawDebtFreePrice = listing.nonLocalizedValues?.debtFreePrice || extractLocalizedValue(listing.debtFreePrice) || null;
  const debtFreePrice = rawDebtFreePrice ? parsePrice(rawDebtFreePrice) : null;
  const rawDebt = extractLocalizedValue(listing.debt) || null;
  const debt = rawDebt ? parsePrice(rawDebt) : null;
  
  // Compute debt if missing but both prices exist (Finnish formula: Velkaosuus = Velaton - Myyntihinta)
  const computedDebt = (debtFreePrice != null && askPrice != null)
    ? Math.max(0, parseFloat(debtFreePrice) - parseFloat(askPrice)).toString()
    : null;
  const finalDebt = debt ?? computedDebt;
  
  // Validate prices - warn about suspicious values
  if (askPrice) {
    const priceNum = parseInt(askPrice);
    if (priceNum > 10000000) {
      console.warn('⚠️  SUSPICIOUS PRICE DETECTED:', {
        address,
        askPrice,
        rawAskPrice,
        nonLocalizedAskPrice: listing.nonLocalizedValues?.askPrice,
        note: 'Price over 10M EUR - possible data error'
      });
    }
    if (priceNum < 1000) {
      console.warn('⚠️  SUSPICIOUS PRICE DETECTED:', {
        address,
        askPrice,
        rawAskPrice,
        note: 'Price under 1000 EUR - possible data error'
      });
    }
  }
  
  // Debug logging
  if (address === 'Linnankoskenkatu 8') {
    console.log('DEBUG complete-converter: Linnankoskenkatu 8 price:', {
      rawAskPrice,
      processedAskPrice: askPrice,
      listingAskPrice: listing.askPrice
    });
  }
  
  // All charges
  const maintenanceCharge = extractLocalizedValue(listing.maintenanceCharge) || null;
  const mandatoryCharges = extractLocalizedValue(listing.mandatoryCharges) || null;
  const renovationCharge = extractLocalizedValue(listing.renovationCharge) || null;
  const waterCharge = extractLocalizedValue(listing.waterCharge, 0) || null;
  const otherCharge = extractLocalizedValue(listing.otherCharge) || null;
  const plotRentCharge = extractLocalizedValue(listing.plotRentCharge) || null;
  const fundingCharge = extractLocalizedValue(listing.fundingCharge) || null;
  const parkingCharge = extractLocalizedValue(listing.parkingCharge) || null;
  const saunaCharge = extractLocalizedValue(listing.saunaCharge) || null;
  const laundryRoomCharge = extractLocalizedValue(listing.laundryRoomCharge) || null;
  const heatingCharge = extractLocalizedValue(listing.heatingCharge) || null;
  const broadbandCharge = extractLocalizedValue(listing.broadbandCharge) || null;
  const waterAndSewageCharge = extractLocalizedValue(listing.waterAndSewageCharge) || null;
  const roadTolls = extractLocalizedValue(listing.roadTolls) || null;
  const sanitationCharge = extractLocalizedValue(listing.sanitationCharge) || null;
  const propertyTax = extractLocalizedValue(listing.propertyTax) || null;
  const electricHeatingCharge = extractLocalizedValue(listing.electricHeatingCharge) || null;
  const averageTotalHeatingCharge = extractLocalizedValue(listing.averageTotalHeatingCharge) || null;
  
  // Property specifications
  // CRITICAL: Use nonLocalizedValues for numeric fields (totalArea, plotArea) for accuracy
  const area = extractLocalizedValue(listing.area) || null;
  const otherArea = extractLocalizedValue(listing.otherArea) || null;
  
  // CRITICAL: Calculate totalArea (Kokonaispinta-ala) = area + otherArea
  // Linear API may not send totalArea directly, but it's the sum of living area + other spaces
  let overallArea = listing.nonLocalizedValues?.totalArea || extractLocalizedValue(listing.overallArea) || null;
  
  // If totalArea is missing but we have area and otherArea, calculate it
  if (!overallArea && area && otherArea) {
    const areaNum = parseFloat(area);
    const otherAreaNum = parseFloat(otherArea);
    if (!isNaN(areaNum) && !isNaN(otherAreaNum)) {
      overallArea = (areaNum + otherAreaNum).toString();
      console.log('✅ Calculated totalArea:', { address, area: areaNum, otherArea: otherAreaNum, total: overallArea });
    }
  }
  
  // Debug logging for Mailatie 3
  if (address && address.toLowerCase().includes('mailatie')) {
    console.log('🏠 Mailatie area data:', {
      address,
      area,
      otherArea,
      'nonLocalizedValues.totalArea': listing.nonLocalizedValues?.totalArea,
      'listing.overallArea': listing.overallArea,
      'calculated/extracted overallArea': overallArea
    });
    console.log('🔍 ALL nonLocalizedValues:', listing.nonLocalizedValues);
  }
  const businessPremiseArea = extractLocalizedValue(listing.businessPremiseArea) || null;
  const areaBasis = extractLocalizedValue(listing.areaBasis) || null;
  const areaBasisControlMeasured = extractLocalizedValue(listing.areaBasisControlMeasured) || null;
  const rooms = extractLocalizedValue(listing.rooms) || null;
  const roomCount = extractLocalizedValue(listing.roomCount) || null;
  const typeOfApartment = extractLocalizedValue(listing.typeOfApartment) || null;
  const bedroomCount = extractLocalizedValue(listing.bedroomCount) || null;
  const wcCount = extractLocalizedValue(listing.wcCount) || null;
  const floor = extractLocalizedValue(listing.floor) || null;
  const floorCount = extractLocalizedValue(listing.floorCount) || null;
  const apartmentNumber = extractLocalizedValue(listing.apartmentNumber) || null;
  const gate = extractLocalizedValue(listing.gate) || null;
  
  // Property type
  const propertyType = extractLocalizedValue(listing.propertyType) || null;
  const listingType = extractLocalizedValue(listing.listingType) || null;
  const type = extractLocalizedValue(listing.type) || null;
  const productGroup = extractLocalizedValue(listing.productGroup) || null;
  const status = extractLocalizedValue(listing.status) || null;
  const commissionType = extractLocalizedValue(listing.commissionType) || null;
  const salesMethod = extractLocalizedValue(listing.salesMethod) || null;
  const soldAsRented = extractLocalizedValue(listing.soldAsRented) || null;
  const newlyConstructed = extractLocalizedValue(listing.newlyConstructed) || null;
  
  // Building details
  const completeYear = extractLocalizedValue(listing.completeYear) || null;
  const constructionYear = extractLocalizedValue(listing.constructionYear) || null;
  const constructionStartYear = extractLocalizedValue(listing.constructionStartYear) || null;
  const constructionFinalCheckYear = extractLocalizedValue(listing.constructionFinalCheckYear) || null;
  const deploymentYear = extractLocalizedValue(listing.deploymentYear) || null;
  const constructionPhase = extractLocalizedValue(listing.constructionPhase) || null;
  const constructionMaterial = extractLocalizedValue(listing.constructionMaterial) || null;
  const buildingMaterialFacade = extractLocalizedValue(listing.buildingMaterialFacade) || null;
  const roofType = extractLocalizedValue(listing.roofType) || null;
  const roofMaterial = extractLocalizedValue(listing.roofMaterial) || null;
  const roofingMaterial = extractLocalizedValue(listing.roofingMaterial) || null;
  const roofCondition = extractLocalizedValue(listing.roofCondition) || null;
  
  // Energy
  const energyClass = extractLocalizedValue(listing.energyClass) || null;
  const listingHasEnergyCertificate = extractLocalizedValue(listing.listingHasEnergyCertificate) || null;
  const energyCertificateValidity = extractLocalizedValue(listing.energyCertificateValidity) || null;
  const heatingSystem = extractLocalizedValue(listing.heatingSystem) || null;
  const electricHeatingType = extractLocalizedValue(listing.electricHeatingType) || null;
  const electricHeatingPowerUsage = extractLocalizedValue(listing.electricHeatingPowerUsage) || null;
  
  // Lot information
  // CRITICAL: Use nonLocalizedValues for numeric fields (plotArea) for accuracy
  // Handle unit conversion: ha → m² (1 ha = 10,000 m²)
  let lotArea = listing.nonLocalizedValues?.plotArea || listing.nonLocalizedValues?.lotArea || extractLocalizedValue(listing.lotArea) || null;
  const lotAreaUnit = listing.nonLocalizedValues?.lotAreaUnit || '';
  
  // Convert from hectares to square meters if needed
  const unitLower = lotAreaUnit.toLowerCase();
  if (lotArea && (unitLower === 'ha' || unitLower === 'hectare')) {
    const originalValue = parseFloat(lotArea);
    if (!isNaN(originalValue)) {
      lotArea = (originalValue * 10000).toString();
      console.log('✅ Converted plot area from hectares to m²:', { 
        address, 
        originalValue, 
        unit: lotAreaUnit, 
        convertedValue: lotArea, 
        convertedUnit: 'm²' 
      });
    }
  }
  
  // Debug logging for Mailatie 3
  if (address && address.toLowerCase().includes('mailatie')) {
    console.log('🏠 Mailatie plot data:', {
      address,
      'nonLocalizedValues.plotArea': listing.nonLocalizedValues?.plotArea,
      'nonLocalizedValues.lotArea': listing.nonLocalizedValues?.lotArea,
      'nonLocalizedValues.lotAreaUnit': listing.nonLocalizedValues?.lotAreaUnit,
      'listing.lotArea': listing.lotArea,
      'extracted/converted lotArea': lotArea
    });
  }
  
  const lotType = extractLocalizedValue(listing.lotType) || null;
  const lotOwnership = extractLocalizedValue(listing.lotOwnership) || null;
  const lotNumber = extractLocalizedValue(listing.lotNumber) || null;
  const lotSalesType = extractLocalizedValue(listing.lotSalesType) || null;
  const lotShareRedeemed = extractLocalizedValue(listing.lotShareRedeemed) || null;
  const lotRentEndDate = extractLocalizedValue(listing.lotRentEndDate) || null;
  const landYearRent = extractLocalizedValue(listing.landYearRent) || null;
  const landRedemptionPrice = extractLocalizedValue(listing.landRedemptionPrice) || null;
  const landRenter = extractLocalizedValue(listing.landRenter) || null;
  const propertyIdentifier = extractLocalizedValue(listing.propertyIdentifier) || null;
  const propertyName = extractLocalizedValue(listing.propertyName) || null;
  const propertyBuildingRights = extractLocalizedValue(listing.propertyBuildingRights) || null;
  const propertyBuildingRightsENumber = extractLocalizedValue(listing.propertyBuildingRightsENumber) || null;
  
  // Housing company
  const housingCooperativeName = extractLocalizedValue(listing.housingCooperativeName) || null;
  const shareNumbers = extractLocalizedValue(listing.shareNumbers) || null;
  const housingCooperativeMortgage = extractLocalizedValue(listing.housingCooperativeMortgage) || null;
  const housingCooperativeMortgageDate = extractLocalizedValue(listing.housingCooperativeMortgageDate) || null;
  const housingCooperativeRevenue = extractLocalizedValue(listing.housingCooperativeRevenue) || null;
  const housingCooperativeApartmentCount = extractLocalizedValue(listing.housingCooperativeApartmentCount) || null;
  const housingCooperativeRetailSpaceCount = extractLocalizedValue(listing.housingCooperativeRetailSpaceCount) || null;
  const housingCooperativeSauna = extractLocalizedValue(listing.housingCooperativeSauna) || null;
  const housingCooperativeElevator = extractLocalizedValue(listing.housingCooperativeElevator) || null;
  const housingCooperativeRedemptionRight = extractLocalizedValue(listing.housingCooperativeRedemptionRight) || null;
  const partnerRedemptionRight = extractLocalizedValue(listing.partnerRedemptionRight) || null;
  const housingCooperativeHas = extractLocalizedValue(listing.housingCooperativeHas) || null;
  const housingCooperativeUpcomingRenovations = extractLocalizedValue(listing.housingCooperativeUpcomingRenovations) || null;
  const housingCooperativeParkingSpaces = extractLocalizedValue(listing.housingCooperativeParkingSpaces) || null;
  
  // Property management
  const propertyManagerName = extractLocalizedValue(listing.propertyManagerName) || null;
  const propertyManagerOffice = extractLocalizedValue(listing.propertyManagerOffice) || null;
  const propertyManagerEmail = extractLocalizedValue(listing.propertyManagerEmail) || null;
  const propertyManagerPhone = extractLocalizedValue(listing.propertyManagerPhone) || null;
  const propertyManagerStreetAddress = extractLocalizedValue(listing.propertyManagerStreetAddress) || null;
  const propertyManagerCity = extractLocalizedValue(listing.propertyManagerCity) || null;
  const propertyManagerPostNumber = extractLocalizedValue(listing.propertyManagerPostNumber) || null;
  const propertyManagerCertificateDate = extractLocalizedValue(listing.propertyManagerCertificateDate) || null;
  const propertyMaintenance = extractLocalizedValue(listing.propertyMaintenance) || null;
  
  // Features
  const sauna = extractLocalizedValue(listing.sauna) || null;
  const elevator = extractLocalizedValue(listing.elevator) || null;
  const balcony = extractLocalizedValue(listing.balcony) || null;
  const terrace = extractLocalizedValue(listing.terrace) || null;
  const hasBalcony = extractLocalizedValue(listing.hasBalcony) || null;
  const balconyArea = extractLocalizedValue(listing.balconyArea) || null;
  const balconyTypes = extractLocalizedValue(listing.balconyTypes) || null;
  const balconyCompassPoint = extractLocalizedValue(listing.balconyCompassPoint) || null;
  const windowsDirection = extractLocalizedValue(listing.windowsDirection) || null;
  const windowTypes = extractLocalizedValue(listing.windowTypes) || null;
  const hasHighCeilings = extractLocalizedValue(listing.hasHighCeilings) || null;
  const antenna = extractLocalizedValue(listing.antenna) || null;
  const fireplace = extractLocalizedValue(listing.fireplace) || null;
  const swimmingPool = extractLocalizedValue(listing.swimmingPool) || null;
  
  // Parking
  const parkingSpaces = extractLocalizedValue(listing.parkingSpaces) || null;
  const parkingSpace = extractLocalizedValue(listing.parkingSpace) || null;
  const hasParkingSpace = extractLocalizedValue(listing.hasParkingSpace) || null;
  const autoparkingType = extractLocalizedValue(listing.autoparkingType) || null;
  const garageCount = extractLocalizedValue(listing.garageCount) || null;
  const carPortCount = extractLocalizedValue(listing.carPortCount) || null;
  const electricPlugParkingSpaceCount = extractLocalizedValue(listing.electricPlugParkingSpaceCount) || null;
  const yardParkingSpaceCount = extractLocalizedValue(listing.yardParkingSpaceCount) || null;
  const parkingGarageCount = extractLocalizedValue(listing.parkingGarageCount) || null;
  const parking = extractLocalizedValue(listing.parking) || null;
  const storageSpaceTypes = extractLocalizedValue(listing.storageSpaceTypes) || null;
  
  // Room descriptions
  const kitchenDescription = extractLocalizedValue(listing.kitchenDescription) || null;
  const bathroomDescription = extractLocalizedValue(listing.bathroomDescription) || null;
  const livingRoomDescription = extractLocalizedValue(listing.livingRoomDescription) || null;
  const bedroomDescription = extractLocalizedValue(listing.bedroomDescription) || null;
  const utilityRoomDescription = extractLocalizedValue(listing.utilityRoomDescription) || null;
  const wcDescription = extractLocalizedValue(listing.wcDescription) || null;
  const saunaDescription = extractLocalizedValue(listing.saunaDescription) || null;
  
  // Materials
  const kitchenFloorMaterial = extractLocalizedValue(listing.kitchenFloorMaterial) || null;
  const bathroomFloorMaterial = extractLocalizedValue(listing.bathroomFloorMaterial) || null;
  const livingRoomFloorMaterial = extractLocalizedValue(listing.livingRoomFloorMaterial) || null;
  const bedroomFloorMaterial = extractLocalizedValue(listing.bedroomFloorMaterial) || null;
  const saunaFloorMaterial = extractLocalizedValue(listing.saunaFloorMaterial) || null;
  const utilityRoomFloorMaterial = extractLocalizedValue(listing.utilityRoomFloorMaterial) || null;
  const wcFloorMaterial = extractLocalizedValue(listing.wcFloorMaterial) || null;
  const kitchenWallMaterial = extractLocalizedValue(listing.kitchenWallMaterial) || null;
  const bathroomWallMaterial = extractLocalizedValue(listing.bathroomWallMaterial) || null;
  const livingRoomWallMaterial = extractLocalizedValue(listing.livingRoomWallMaterial) || null;
  const bedroomWallMaterial = extractLocalizedValue(listing.bedroomWallMaterial) || null;
  const saunaWallMaterial = extractLocalizedValue(listing.saunaWallMaterial) || null;
  const utilityRoomWallMaterial = extractLocalizedValue(listing.utilityRoomWallMaterial) || null;
  const wcWallMaterial = extractLocalizedValue(listing.wcWallMaterial) || null;
  
  // Equipment
  const kitchenEquipment = extractLocalizedValue(listing.kitchenEquipment) || null;
  const bathroomEquipment = extractLocalizedValue(listing.bathroomEquipment) || null;
  const stoveType = extractLocalizedValue(listing.stoveType) || null;
  const saunaStoveType = extractLocalizedValue(listing.saunaStoveType) || null;
  
  // Condition
  const condition = extractLocalizedValue(listing.condition) || null;
  const generalCondition = extractLocalizedValue(listing.generalCondition) || null;
  const furnished = extractLocalizedValue(listing.furnished) || null;
  const pastRenovations = extractLocalizedValue(listing.pastRenovations) || null;
  const asbestosSurvey = extractLocalizedValue(listing.asbestosSurvey) || null;
  const asbestosSurveyInfo = extractLocalizedValue(listing.asbestosSurveyInfo) || null;
  
  // Location
  const beach = extractLocalizedValue(listing.beach) || null;
  const beachType = extractLocalizedValue(listing.beachType) || null;
  const view = extractLocalizedValue(listing.view) || null;
  const yard = extractLocalizedValue(listing.yard) || null;
  const trafficConnections = extractLocalizedValue(listing.trafficConnections) || null;
  
  // Services
  const services = extractLocalizedValue(listing.services) || null;
  const schools = extractLocalizedValue(listing.schools) || null;
  const kindergarten = extractLocalizedValue(listing.kindergarten) || null;
  const localInfo = extractLocalizedValue(listing.localInfo) || null;
  
  // Zoning
  const zoningStatus = extractLocalizedValue(listing.zoningStatus) || null;
  const zoningDetails = extractLocalizedValue(listing.zoningDetails) || null;
  const zoningInfo = extractLocalizedValue(listing.zoningInfo) || null;
  
  // Marketing content
  const freeText = extractLocalizedValue(listing.freeText) || null;
  const freeTextTitle = extractLocalizedValue(listing.freeTextTitle) || null;
  const description = freeText || '';
  const publishDate = extractLocalizedValue(listing.publishDate) || null;
  const release = extractLocalizedValue(listing.release) || null;
  const dealIncludes = extractLocalizedValue(listing.dealIncludes) || null;
  const dealDoesNotInclude = extractLocalizedValue(listing.dealDoesNotInclude) || null;
  const includes = extractLocalizedValue(listing.includes) || null;
  
  // Links and media
  const externalLinks = extractLocalizedArray(listing.links);
  const videoUrl = extractLocalizedValue(listing.videoUrl) || null;
  const virtualShowing = extractLocalizedValue(listing.virtualShowing) || null;
  
  // New fields from JSON mapping
  const securitySystem = extractLocalizedValue(listing.securitySystem) || null;
  const internetConnection = extractLocalizedValue(listing.internetConnection) || null;
  const waterDamage = extractLocalizedValue(listing.waterDamage) || null;
  const modificationsMade = extractLocalizedValue(listing.modificationsMade) || null;
  const locationCenterCity = extractLocalizedValue(listing.locationCenterCity) || null;
  const locationUrbanArea = extractLocalizedValue(listing.locationUrbanArea) || null;
  const locationSuburban = extractLocalizedValue(listing.locationSuburban) || null;
  const locationRural = extractLocalizedValue(listing.locationRural) || null;
  const marketingTitle = extractLocalizedValue(listing.marketingTitle) || null;
  const marketingDescription = extractLocalizedValue(listing.marketingDescription) || null;
  const floorPlanUrl = extractLocalizedValue(listing.floorPlanUrl) || null;
  const energyCertificateUrl = extractLocalizedValue(listing.energyCertificateUrl) || null;
  const propertyPlanUrl = extractLocalizedValue(listing.propertyPlanUrl) || null;
  const buildingPermitUrl = extractLocalizedValue(listing.buildingPermitUrl) || null;
  const maintenancePlanUrl = extractLocalizedValue(listing.maintenancePlanUrl) || null;
  const asbestosSurveyReport = extractLocalizedValue(listing.asbestosSurveyReport) || null;
  const conditionReport = extractLocalizedValue(listing.conditionReport) || null;
  const moistureReport = extractLocalizedValue(listing.moistureReport) || null;
  const drivingInstructions = extractLocalizedValue(listing.drivingInstructions) || null;
  const propertyBrochureUrl = extractLocalizedValue(listing.propertyBrochureUrl) || null;
  const internationalBrochureUrl = extractLocalizedValue(listing.internationalBrochureUrl) || null;
  const youtubeUrl = extractLocalizedValue(listing.youtubeUrl) || null;
  const neighborsSurrounding = extractLocalizedValue(listing.neighborsSurrounding) || null;
  const nearbyBuildings = extractLocalizedValue(listing.nearbyBuildings) || null;
  const parkingFree = extractLocalizedValue(listing.parkingFree) || null;
  const parkingPaid = extractLocalizedValue(listing.parkingPaid) || null;
  const busStopNearby = extractLocalizedValue(listing.busStopNearby) || null;
  const metroStationNearby = extractLocalizedValue(listing.metroStationNearby) || null;
  const trainStationNearby = extractLocalizedValue(listing.trainStationNearby) || null;
  const smoothCarConnections = extractLocalizedValue(listing.smoothCarConnections) || null;
  const taxiStandNearby = extractLocalizedValue(listing.taxiStandNearby) || null;
  const airportNearby = extractLocalizedValue(listing.airportNearby) || null;
  const goodBikeRoutes = extractLocalizedValue(listing.goodBikeRoutes) || null;
  const tramStopNearby = extractLocalizedValue(listing.tramStopNearby) || null;
  const publicTransportAccess = extractLocalizedValue(listing.publicTransportAccess) || null;
  const noBeach = extractLocalizedValue(listing.noBeach) || null;
  const ownBeach = extractLocalizedValue(listing.ownBeach) || null;
  const beachRights = extractLocalizedValue(listing.beachRights) || null;
  const sharedBeach = extractLocalizedValue(listing.sharedBeach) || null;
  const waterBodyName = extractLocalizedValue(listing.waterBodyName) || null;
  const cableCharge = extractLocalizedValue(listing.cableCharge) || null;
  const internetCharge = extractLocalizedValue(listing.internetCharge) || null;
  const insuranceRequired = extractLocalizedValue(listing.insuranceRequired) || null;
  const monthlyTotalCost = extractLocalizedValue(listing.monthlyTotalCost) || null;
  const yearlyTotalCost = extractLocalizedValue(listing.yearlyTotalCost) || null;
  const alarmSystem = extractLocalizedValue(listing.alarmSystem) || null;
  const doorCode = extractLocalizedValue(listing.doorCode) || null;
  const smartLock = extractLocalizedValue(listing.smartLock) || null;
  const videoIntercom = extractLocalizedValue(listing.videoIntercom) || null;
  const cableTV = extractLocalizedValue(listing.cableTV) || null;
  const telephoneConnection = extractLocalizedValue(listing.telephoneConnection) || null;
  const electricalOutlets = extractLocalizedValue(listing.electricalOutlets) || null;
  const ventilationSystem = extractLocalizedValue(listing.ventilationSystem) || null;
  const airConditioning = extractLocalizedValue(listing.airConditioning) || null;
  const centralVacuum = extractLocalizedValue(listing.centralVacuum) || null;
  const wasteManagement = extractLocalizedValue(listing.wasteManagement) || null;
  const recyclingOptions = extractLocalizedValue(listing.recyclingOptions) || null;
  const compostingAvailable = extractLocalizedValue(listing.compostingAvailable) || null;
  const renovationHistory = extractLocalizedValue(listing.renovationHistory) || null;
  const plannedRenovations = extractLocalizedValue(listing.plannedRenovations) || null;
  const asbestosSurveyDate = extractLocalizedValue(listing.asbestosSurveyDate) || null;
  
  // Additional damage fields
  const moistureDamage = extractLocalizedValue(listing.moistureDamage) || null;
  const moldDamage = extractLocalizedValue(listing.moldDamage) || null;
  const damageRepairs = extractLocalizedValue(listing.damageRepairs) || null;
  const damageDescription = extractLocalizedValue(listing.damageDescription) || null;
  const damageDate = extractLocalizedValue(listing.damageDate) || null;
  const modificationsNotified = extractLocalizedValue(listing.modificationsNotified) || null;
  const modificationsDescription = extractLocalizedValue(listing.modificationsDescription) || null;
  
  // 🏠 RENTAL INFORMATION (Vuokrakohteet / Hyresobjekt / Rentals)
  const rent = extractLocalizedValue(listing.rent) || null;  // Vuokran määrä / Hyresbelopp / Monthly rent
  const rentUpdateDate = extractLocalizedValue(listing.rentUpdateDate) || null;
  const rentPaymentDate = extractLocalizedValue(listing.rentPaymentDate) || null;
  const rentIncreaseBasis = extractLocalizedValue(listing.rentIncreaseBasis) || null;
  const securityDepositType = extractLocalizedValue(listing.securityDepositType) || null;  // Vuokravakuus / Depositionstyp / Security deposit
  const latestDepositPaymentDate = extractLocalizedValue(listing.latestDepositPaymentDate) || null;
  const earliestTerminateDate = extractLocalizedValue(listing.earliestTerminateDate) || null;
  const rentalContractType = extractLocalizedValue(listing.rentalContractType) || null;
  const subleasing = extractLocalizedValue(listing.subleasing) || null;
  const subleasingDetails = extractLocalizedValue(listing.subleasingDetails) || null;
  const housingTenure = extractLocalizedValue(listing.housingTenure) || null;
  const petsAllowed = extractLocalizedValue(listing.petsAllowed) || null;
  const smokingAllowed = extractLocalizedValue(listing.smokingAllowed) || null;
  const laundryRoomChargeType = extractLocalizedValue(listing.laundryRoomChargeType) || null;
  const tenantIsResponsibleFor = extractLocalizedValue(listing.tenantIsResponsibleFor) || null;
  const tenantIsResponsibleForHeatingSystemCleanup = extractLocalizedValue(listing.tenantIsResponsibleForHeatingSystemCleanup) || null;
  const tenantHomeInsuranceRequirement = extractLocalizedValue(listing.tenantHomeInsuranceRequirement) || null;
  const drillingOtherThanFurnituresTilesSeams = extractLocalizedValue(listing.drillingOtherThanFurnituresTilesSeams) || null;
  const failureOfReturnOfKeysPenaltyAmount = extractLocalizedValue(listing.failureOfReturnOfKeysPenaltyAmount) || null;
  
  // Images - preserve entire array structure
  const images = listing.images || [];
  
  // Featured image = first non-floorplan image if available, else first image
  const firstNonFloorplan = images.find(img => !img.isFloorPlan);
  const featuredImage = firstNonFloorplan?.url || (images.length > 0 ? images[0].url : null);
  
  // Agent/Realtor - Transform to WordPress format
  const agent = listing.realtor ? {
    name: listing.realtor.name || null,
    phone: listing.realtor.tel || null,
    email: listing.realtor.email || null,
    photo: listing.realtor.avatar ? {
      sourceUrl: listing.realtor.avatar,
      altText: listing.realtor.name || 'Agent photo'
    } : null
  } : null;
  
  // Debug logging for agent transformation
  if (listing.realtor?.avatar) {
    console.log('✅ Agent photo transformed:', {
      address,
      hasRealtor: !!listing.realtor,
      hasAvatar: !!listing.realtor.avatar,
      avatarUrl: listing.realtor.avatar,
      transformedPhoto: agent?.photo?.sourceUrl
    });
  }
  
  // Calculate price per sqm
  let pricePerSqm = null;
  if (askPrice && area) {
    const priceNum = parseInt(askPrice.replace(/[^\d]/g, ''));
    const areaNum = parseInt(area.replace(/[^\d]/g, ''));
    if (priceNum && areaNum) {
      pricePerSqm = Math.round(priceNum / areaNum);
    }
  }
  
  // Generate slug from address with fallback
  // If address is empty, use id/identifier as fallback
  const validId = id && id !== '' ? id : null;
  const validIdentifier = identifier && identifier !== 0 ? identifier : null;
  
  // Debug logging
  if (!address) {
    console.log('🔍 Slug generation debug:', {
      address,
      id,
      identifier,
      runningNumber,
      validId,
      validIdentifier
    });
  }
  
  const slugSource = address || 
                     (validId ? `property-${validId}` : null) ||
                     (validIdentifier ? `property-${validIdentifier}` : null) ||
                     `property-${runningNumber || 'unknown'}`;
  const slug = generateSlug(slugSource);
  
  // Debug final slug
  if (!slug || slug === '') {
    console.log('⚠️ Empty slug generated!', { slugSource, slug, address });
  }
  
  return {
    id,
    slug,
    title: address,
    date: publishDate || new Date().toISOString(),
    modified: new Date().toISOString(),
    status: 'publish',
    featuredImage,
    images: images.map(img => ({
      id: img.id,
      url: img.url,
      thumbnail: img.thumbnail,
      compressed: img.compressed,
      description: img.description,
      isFloorPlan: img.isFloorPlan
    })),
    excerpt: description ? description.substring(0, 160) + '...' : '',
    content: description,
    acfRealEstate: {
      property: {
        // Basic information
        identifier,
        runningNumber,
        address,
        city,
        municipality,
        postalCode,
        country,
        province,
        districtFree,
        
        // Pricing - ALL fields
        askPrice,
        price: askPrice,
        pricePerSqm,
        debtFreePrice,
        debt: finalDebt,
        maintenanceCharge,
        mandatoryCharges,
        renovationCharge,
        waterCharge,
        otherCharge,
        plotRentCharge,
        fundingCharge,
        parkingCharge,
        saunaCharge,
        laundryRoomCharge,
        heatingCharge,
        broadbandCharge,
        waterAndSewageCharge,
        roadTolls,
        sanitationCharge,
        propertyTax,
        electricHeatingCharge,
        averageTotalHeatingCharge,
        
        // Property details
        area,
        overallArea,
        otherArea,
        businessPremiseArea,
        areaBasis,
        areaBasisControlMeasured,
        rooms,
        roomCount,
        typeOfApartment,
        bedroomCount,
        wcCount,
        floor,
        floorCount,
        apartmentNumber,
        gate,
        
        // Type and status
        propertyType,
        listingType,
        type,
        productGroup,
        status,
        commissionType,
        salesMethod,
        soldAsRented,
        newlyConstructed,
        
        // Building
        yearBuilt: constructionYear || completeYear,
        completeYear,
        constructionYear,
        constructionStartYear,
        constructionFinalCheckYear,
        deploymentYear,
        constructionPhase,
        constructionMaterial,
        buildingMaterialFacade,
        roofType,
        roofMaterial,
        roofingMaterial,
        roofCondition,
        
        // Energy
        energyClass,
        listingHasEnergyCertificate,
        energyCertificateValidity,
        heatingSystem,
        electricHeatingType,
        electricHeatingPowerUsage,
        
        // Lot
        lotArea,
        lotType,
        lotOwnership,
        lotNumber,
        lotSalesType,
        lotShareRedeemed,
        lotRentEndDate,
        landYearRent,
        landRedemptionPrice,
        landRenter,
        propertyIdentifier,
        propertyName,
        propertyBuildingRights,
        propertyBuildingRightsENumber,
        
        // Housing company
        housingCooperativeName,
        shareNumbers,
        housingCooperativeMortgage,
        housingCooperativeMortgageDate,
        housingCooperativeRevenue,
        housingCooperativeApartmentCount,
        housingCooperativeRetailSpaceCount,
        housingCooperativeSauna,
        housingCooperativeElevator,
        housingCooperativeRedemptionRight,
        partnerRedemptionRight,
        housingCooperativeHas,
        housingCooperativeUpcomingRenovations,
        housingCooperativeParkingSpaces,
        
        // Management
        propertyManagerName,
        propertyManagerOffice,
        propertyManagerEmail,
        propertyManagerPhone,
        propertyManagerStreetAddress,
        propertyManagerCity,
        propertyManagerPostNumber,
        propertyManagerCertificateDate,
        propertyMaintenance,
        
        // Features
        sauna,
        elevator,
        balcony,
        terrace,
        hasBalcony,
        balconyArea,
        balconyTypes,
        balconyCompassPoint,
        windowsDirection,
        windowTypes,
        hasHighCeilings,
        antenna,
        fireplace,
        swimmingPool,
        
        // Parking and storage
        parkingSpaces,
        parkingSpace,
        hasParkingSpace,
        autoparkingType,
        garageCount,
        carPortCount,
        electricPlugParkingSpaceCount,
        yardParkingSpaceCount,
        parkingGarageCount,
        parking,
        storageSpaceTypes,
        
        // Room descriptions
        kitchenDescription,
        bathroomDescription,
        livingRoomDescription,
        bedroomDescription,
        utilityRoomDescription,
        wcDescription,
        saunaDescription,
        
        // Materials
        kitchenFloorMaterial,
        bathroomFloorMaterial,
        livingRoomFloorMaterial,
        bedroomFloorMaterial,
        saunaFloorMaterial,
        utilityRoomFloorMaterial,
        wcFloorMaterial,
        kitchenWallMaterial,
        bathroomWallMaterial,
        livingRoomWallMaterial,
        bedroomWallMaterial,
        saunaWallMaterial,
        utilityRoomWallMaterial,
        wcWallMaterial,
        
        // Equipment
        kitchenEquipment,
        bathroomEquipment,
        stoveType,
        saunaStoveType,
        
        // Condition
        condition,
        generalCondition,
        furnished,
        pastRenovations,
        asbestosSurvey,
        asbestosSurveyInfo,
        
        // Location
        beach,
        beachType,
        view,
        yard,
        trafficConnections,
        
        // Services
        services,
        schools,
        kindergarten,
        localInfo,
        
        // Zoning
        zoningStatus,
        zoningDetails,
        zoningInfo,
        
        // Marketing
        freeText,
        freeTextTitle,
        publishDate,
        release,
        dealIncludes,
        dealDoesNotInclude,
        includes,
        
        // Links
        externalLinks: externalLinks.map(link => ({
          label: link.label,
          url: link.value
        })),
        videoUrl,
        virtualShowing,
        
        // Security & Technology
        securitySystem,
        internetConnection,
        cableTV,
        telephoneConnection,
        electricalOutlets,
        airConditioning,
        ventilationSystem,
        centralVacuum,
        alarmSystem,
        smartLock,
        videoIntercom,
        doorCode,
        
        // Waste Management
        wasteManagement,
        recyclingOptions,
        compostingAvailable,
        
        // Additional Costs
        cableCharge,
        internetCharge,
        insuranceRequired,
        monthlyTotalCost,
        yearlyTotalCost,
        
        // Documentation URLs
        floorPlanUrl,
        energyCertificateUrl,
        propertyPlanUrl,
        buildingPermitUrl,
        maintenancePlanUrl,
        propertyBrochureUrl,
        internationalBrochureUrl,
        youtubeUrl,
        
        // Asbestos & Renovations  
        asbestosSurveyDate,
        asbestosSurveyReport,
        renovationHistory,
        plannedRenovations,
        
        // Damage & Repairs
        waterDamage,
        moistureDamage,
        moldDamage,
        damageRepairs,
        damageDescription,
        damageDate,
        
        // Modifications
        modificationsMade,
        modificationsNotified,
        modificationsDescription,
        
        // Location Details
        locationCenterCity,
        locationUrbanArea,
        locationSuburban,
        locationRural,
        neighborsSurrounding,
        nearbyBuildings,
        parkingFree,
        parkingPaid,
        
        // Transportation
        busStopNearby,
        metroStationNearby,
        trainStationNearby,
        smoothCarConnections,
        taxiStandNearby,
        airportNearby,
        goodBikeRoutes,
        tramStopNearby,
        publicTransportAccess,
        
        // Beach & Shore
        noBeach,
        ownBeach,
        beachRights,
        sharedBeach,
        waterBodyName,
        
        // Reports & Documents
        conditionReport,
        moistureReport,
        drivingInstructions,
        
        // Marketing
        marketingTitle,
        marketingDescription,
        
        // 🏠 Rental Information (Hyresobjekt / Vuokrakohteet / Rentals)
        rent,  // Vuokran määrä / Monthly rent
        rentUpdateDate,
        rentPaymentDate,
        rentIncreaseBasis,
        securityDepositType,  // Vuokravakuus / Security deposit
        latestDepositPaymentDate,
        earliestTerminateDate,
        rentalContractType,
        subleasing,
        subleasingDetails,
        housingTenure,
        petsAllowed,
        smokingAllowed,
        laundryRoomChargeType,
        tenantIsResponsibleFor,
        tenantIsResponsibleForHeatingSystemCleanup,
        tenantHomeInsuranceRequirement,
        drillingOtherThanFurnituresTilesSeams,
        failureOfReturnOfKeysPenaltyAmount
      },
      agent
    }
  };
}
