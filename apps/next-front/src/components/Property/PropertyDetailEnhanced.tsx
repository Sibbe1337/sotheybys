'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, ShareIcon, PrinterIcon, ArrowsPointingOutIcon, MagnifyingGlassPlusIcon, XMarkIcon, CalculatorIcon, VideoCameraIcon, CubeIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { DetailMedia } from '@/components/listings/DetailMedia';
import { Heading } from '@/components/ui/Heading';
import { Price } from '@/components/ui/Price';
import { MetaRow } from '@/components/ui/MetaRow';
import { Button } from '@/components/ui/Button';
import { PropertyTypeChip } from '@/components/ui/PropertyTypeChip';
import { removeEmojis } from '@/lib/utils';
import { getTranslation, type SupportedLanguage } from '@/lib/property-translations';
import { SectionCard } from '@/components/Property/SectionCard';
import { LabelValueList, type LabelValueItem } from '@/components/Property/LabelValueList';
import FastighetView from '@/components/Property/FastighetView';
import ApartmentView from '@/components/Property/ApartmentView';
import RentalView from '@/components/Property/RentalView';
import type { AdditionalMaterialLink, DocumentLink } from '@/components/Property/types';
import {
  getEnergyCertificateMessage,
  getLocalizedText,
  isTruthyFlag,
  parseEuroAmount,
  formatBooleanLabel,
  formatEuroLabel,
  pickFirstNonEmpty,
  pick,
  yn,
  missing,
  YES_VALUES,
  NO_VALUES,
} from '@/lib/property-display';

interface PropertyDetailEnhancedProps {
  property: any;
  propertyData: any;
  agentData: any;
  images: any[];
  language?: SupportedLanguage;
}

export default function PropertyDetailEnhanced({ 
  property, 
  propertyData, 
  agentData, 
  images = [],
  language = 'fi'
}: PropertyDetailEnhancedProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageDragPosition, setImageDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [isInComparison, setIsInComparison] = useState(false);
  const [showComparisonNotification, setShowComparisonNotification] = useState(false);
  
  // Touch gesture state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Mortgage calculator state
  const [mortgageCalc, setMortgageCalc] = useState({
    loanAmount: 0,
    interestRate: 2.5,
    loanTerm: 25,
    downPayment: 20 // percentage
  });

  // Extract all the comprehensive data
  const {
    // Basic info
    address, city, postalCode, province, country,
    price, debtFreePrice, area, overallArea, rooms, roomCount, 
    typeOfApartment, bedroomCount, wcCount, floor, floorCount,
    yearBuilt, constructionYear, completeYear,
    
    // Detailed descriptions
    freeText, freeTextTitle, description, heading,
    marketingSubtitle, marketingHighlights, marketingSellingPoints,
    marketingLocationDescription, marketingAgentNotes, hasMarketingContent,
    livingRoomDescription, kitchenDescription, bathroomDescription,
    bedroomDescription, saunaDescription, wcDescription,
    
    // Materials
    livingRoomFloorMaterial, livingRoomWallMaterial,
    kitchenFloorMaterial, kitchenWallMaterial,
    bathroomFloorMaterial, bathroomWallMaterial,
    bedroomFloorMaterial, bedroomWallMaterial,
    saunaFloorMaterial, saunaWallMaterial,
    
    // Equipment
    kitchenEquipment, bathroomEquipment, stoveType, saunaStoveType,
    
    // Features
    sauna, elevator, balcony, terrace, hasHighCeilings, fireplace,
    balconyArea, balconyTypes, balconyCompassPoint,
    storageSpaceTypes, swimmingPool,
    
    // Energy & Building
    energyClass, heatingSystem, constructionMaterial,
    buildingMaterialFacade, roofType, roofingMaterial,
    
    // Lot & Property
    lotArea, propertyIdentifier, zoningStatus, zoningInfo,
    
    // Housing company
    housingCooperativeName, shareNumbers, housingCooperativeMortgage,
    housingCooperativeElevator, housingCooperativeSauna,
    housingCooperativeHas, housingCooperativeUpcomingRenovations,
    
    // Charges
    maintenanceCharge, waterCharge, propertyTax, heatingCharge,
    electricHeatingCharge, plotRentCharge, otherCharge,
    
    // Management
    propertyManagerName, propertyManagerOffice, propertyManagerEmail,
    propertyManagerPhone, propertyMaintenance,
    
    // Parking
    parkingSpaces, parkingSpace, hasParkingSpace, garageCount,
    carPortCount, yardParkingSpaceCount, parking,
    
    // Condition & Renovations
    condition, generalCondition, pastRenovations, asbestosSurvey,
    asbestosSurveyInfo, housingCooperativeUpcomingRenovations: upcomingRenovations,
    asbestosSurveyDate, asbestosSurveyReport, renovationHistory, plannedRenovations,
    
    // Location & Services
    trafficConnections, services, schools, kindergarten, localInfo,
    beach, view, yard,
    
    // Marketing & External Resources
    publishDate, release, dealIncludes, dealDoesNotInclude,
    virtualShowing, videoUrl, externalLinks, propertyBrochureUrl,
    internationalBrochureUrl, youtubeUrl, auctionUrl,
    
    // Additional Equipment & Features
    securitySystem, internetConnection, cableTV,
    telephoneConnection, electricalOutlets, airConditioning,
    ventilationSystem, centralVacuum, alarmSystem,
    doorCode, smartLock, videoIntercom,
    
    // Waste Management
    wasteManagement, recyclingOptions, compostingAvailable,
    
    // Additional Costs
    cableCharge, internetCharge, insuranceRequired,
    monthlyTotalCost, yearlyTotalCost,
    
    // Property Documentation
    floorPlanUrl, energyCertificateUrl, energyCertificateStatus, propertyPlanUrl,
    buildingPermitUrl, maintenancePlanUrl,
    
    // Damage & Repairs
    waterDamage, moistureDamage, moldDamage,
    damageRepairs, damageDescription, damageDate,
    
    // Modifications
    modificationsMade, modificationsNotified, modificationsDescription,
    
    // Location Details
    locationCenterCity, locationUrbanArea, locationSuburban, locationRural,
    neighborsSurrounding, nearbyBuildings, parkingFree, parkingPaid,
    
    // Transportation Connections
    busStopNearby, metroStationNearby, trainStationNearby,
    smoothCarConnections, taxiStandNearby, airportNearby,
    goodBikeRoutes, tramStopNearby, publicTransportAccess,
    
    // Shore/Beach Details
    noBeach, ownBeach, beachRights, sharedBeach, waterBodyName,
    
    // Attachments & Reports
    conditionReport, moistureReport, drivingInstructions,
    
    // Marketing Presentation
    marketingTitle, marketingDescription
  } = propertyData || {};
  
  // Handle both field names for price (for backward compatibility)
  const askPrice = propertyData?.askPrice || price || null;
  const propertyFinancials = property?.financials || propertyData?.financials || {};

  const numericAskPrice = parseEuroAmount(askPrice);
  const numericDebtFreePrice = parseEuroAmount(debtFreePrice);
  const directDebtPart = parseEuroAmount(
    pickFirstNonEmpty(
      (propertyFinancials as any)?.debtPart,
      (propertyFinancials as any)?.debtShare,
      (propertyFinancials as any)?.debt,
      propertyData?.debtPart,
      propertyData?.debtShare
    )
  );
  const computedDebtPart = (numericDebtFreePrice != null && numericAskPrice != null)
    ? Number((numericDebtFreePrice - numericAskPrice).toFixed(2))
    : null;
  const debtPartValue = directDebtPart != null
    ? Math.max(0, directDebtPart)
    : (computedDebtPart != null ? Math.max(0, computedDebtPart) : null);

  const askPriceDisplay = numericAskPrice != null ? formatEuroLabel(numericAskPrice) : formatTextValue(askPrice);
  const debtFreePriceDisplay = numericDebtFreePrice != null ? formatEuroLabel(numericDebtFreePrice) : formatTextValue(debtFreePrice);
  const shouldShowDebtPart = debtPartValue != null && debtPartValue > 0;
  const debtPartDisplay = shouldShowDebtPart ? formatEuroLabel(debtPartValue) : null;

  const rawApartmentDescription = removeEmojis(
    getLocalizedText(marketingDescription, language) ||
    getLocalizedText(freeText, language) ||
    getLocalizedText(description, language) ||
    ''
  );

  const apartmentDescriptionParagraphs = rawApartmentDescription
    .split('\n')
    .map((paragraph: string) => paragraph.trim())
    .filter((paragraph: string) => paragraph.length > 0);
  const showAutoTranslationNotice = language !== 'fi' && typeof (freeText || description) === 'string';
  const yesLabel = getTranslation('yes', language);
  const notProvidedText = getTranslation('notSpecified', language);

  const floorDisplay = pickFirstNonEmpty(
    floor,
    propertyData?.floor,
    propertyData?.floorNumber
  );

  const elevatorDisplay = pickFirstNonEmpty(
    elevator,
    housingCooperativeElevator,
    propertyData?.elevator
  );

  const balconySource = pickFirstNonEmpty(
    balcony,
    propertyData?.balcony,
    propertyData?.hasBalcony
  );

  const saunaSource = pickFirstNonEmpty(
    sauna,
    propertyData?.sauna,
    propertyData?.hasSauna
  );

  const releaseSource = pickFirstNonEmpty(
    release,
    propertyData?.availableFrom,
    propertyData?.earliestTerminateDate,
    propertyData?.availability
  );

  const showBalcony = (() => {
    if (balconySource == null) return Boolean(balconyArea || balconyTypes);
    if (typeof balconySource === 'string') {
      const normalized = balconySource.trim().toLowerCase();
      if (normalized === '') return Boolean(balconyArea || balconyTypes);
      if (NO_VALUES.has(normalized)) return false;
      return true;
    }
    return isTruthyFlag(balconySource);
  })();

  const showSauna = (() => {
    if (saunaSource == null) return false;
    if (typeof saunaSource === 'string') {
      const normalized = saunaSource.trim().toLowerCase();
      if (normalized === '') return false;
      if (NO_VALUES.has(normalized)) return false;
      return true;
    }
    return isTruthyFlag(saunaSource);
  })();

  const balconyLabel = (() => {
    if (!showBalcony) return '';
    const label = formatBooleanLabel(balconySource, language);
    if (label === '—' && isTruthyFlag(balconySource)) {
      return yesLabel;
    }
    return label;
  })();

  const balconySupplement = [balconyArea, balconyTypes, balconyCompassPoint]
    .map((item: any) => {
      if (!item) return '';
      if (typeof item === 'object' && 'fi' in item) {
        return getLocalizedText(item, language);
      }
      return String(item);
    })
    .filter((text: string) => text && text.trim().length > 0);

  const saunaLabel = (() => {
    if (!showSauna) return '';
    const label = formatBooleanLabel(saunaSource, language);
    if (label === '—' && isTruthyFlag(saunaSource)) {
      return yesLabel;
    }
    return label;
  })();

  const saunaSupplement = [saunaDescription, saunaStoveType]
    .map((item: any) => {
      if (!item) return '';
      if (typeof item === 'object' && 'fi' in item) {
        return getLocalizedText(item, language);
      }
      return String(item);
    })
    .filter((text: string) => text && text.trim().length > 0);

  function formatTextValue(value: any): string {
    if (value == null || value === '') return '—';

    if (typeof value === 'boolean') {
      return formatBooleanLabel(value, language);
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? value.toString() : '—';
    }

    if (typeof value === 'string') {
      return value.trim();
    }

    if (Array.isArray(value)) {
      const parts = value.map((item) => formatTextValue(item)).filter((part) => part && part !== '—');
      return parts.length > 0 ? parts.join(', ') : '—';
    }

    if (typeof value === 'object') {
      const localized = getLocalizedText(value, language);
      if (localized) {
        return localized;
      }
    }

    return '—';
  }

  function formatAreaValue(value: any): string {
    if (value == null || value === '') return '—';
    if (typeof value === 'number') {
      return `${value.toLocaleString('fi-FI')} m²`;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return '—';
      if (/m2|m²|ha|ares?/i.test(trimmed)) {
        return trimmed;
      }
      const numeric = parseFloat(trimmed.replace(/[^0-9,\.]/g, '').replace(',', '.'));
      if (Number.isFinite(numeric)) {
        return `${numeric.toLocaleString('fi-FI')} m²`;
      }
      return trimmed;
    }
    return String(value);
  }

  const valueClassName = (value: string) => (value === '—' || value === notProvidedText ? 'text-gray-400 italic' : 'font-medium');

  const withPlaceholder = (value: string) => (value === '—' ? notProvidedText : value);

  const renderRow = (label: string, value: string) => (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className={valueClassName(value)}>{value}</span>
    </div>
  );

  const formatChargeValue = (value: any): string => {
    if (value == null || value === '') return '—';
    if (typeof value === 'object' && 'fi' in value) {
      return formatChargeValue(getLocalizedText(value, language));
    }
    if (typeof value === 'number') {
      return formatEuroLabel(value);
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      const numeric = parseEuroAmount(trimmed);
      if (numeric != null && !/[a-zA-Z]/.test(trimmed)) {
        return formatEuroLabel(numeric);
      }
      return trimmed;
    }
    return String(value);
  };

  const constructionYearValue = formatTextValue(pickFirstNonEmpty(constructionYear, yearBuilt, completeYear));
  const energyClassValue = formatTextValue(energyClass);
  const heatingSystemValue = formatTextValue(heatingSystem);
  const ownershipValue = formatTextValue(propertyData?.ownershipType);

  // Try multiple field names for site ownership
  const siteOwnershipValue = formatTextValue(
    pickFirstNonEmpty(
      propertyData?.siteOwnershipType,
      propertyData?.plotOwnership,
      propertyData?.tontinOmistus,
      propertyData?.landOwnership
    )
  );

  // Try multiple field names for housing tenure
  const housingTenureValue = formatTextValue(
    pickFirstNonEmpty(
      propertyData?.housingTenure,
      propertyData?.tenure,
      propertyData?.hallintamuoto,
      propertyData?.ownershipStatus
    )
  );

  // Try multiple field names for housing company name
  const housingCompanyNameValue = formatTextValue(
    pickFirstNonEmpty(
      housingCooperativeName,
      propertyData?.companyName,
      propertyData?.housingCompanyName,
      propertyData?.taloyhtionNimi,
      propertyData?.taloyhtiönNimi
    )
  );

  const floorCountValue = formatTextValue(floorCount);
  const lotAreaDisplay = formatAreaValue(lotArea);
  // waterConnection/vesijohto removed per customer requirement
  const ventilationValue = formatTextValue(propertyData?.ventilationType || propertyData?.ventilationSystem);
  const energyCertificateMessage = getEnergyCertificateMessage(energyCertificateStatus, language);
  const mortgageEncumbranceSource = pickFirstNonEmpty(
    housingCooperativeMortgage,
    propertyData?.propertyMortgage,
    propertyData?.mortgageAmount,
    propertyData?.mortgage,
    propertyData?.encumbranceAmount
  );
  const mortgageEncumbranceLocalized = typeof mortgageEncumbranceSource === 'object' && mortgageEncumbranceSource
    ? getLocalizedText(mortgageEncumbranceSource, language)
    : mortgageEncumbranceSource;
  const mortgageEncumbranceNumeric = parseEuroAmount(mortgageEncumbranceLocalized);
  const mortgageEncumbranceDisplay = mortgageEncumbranceNumeric != null
    ? formatEuroLabel(mortgageEncumbranceNumeric)
    : formatTextValue(mortgageEncumbranceLocalized);
  const rightsText = formatTextValue(propertyData?.easements || propertyData?.restrictions);
  const mortgageEncumbranceValue = mortgageEncumbranceDisplay === '—' ? null : mortgageEncumbranceDisplay;

  // Try multiple field names for housing company mortgages
  const housingCompanyMortgageSource = pickFirstNonEmpty(
    housingCooperativeMortgage,
    propertyData?.companyMortgages,
    propertyData?.housingCompanyMortgages,
    propertyData?.companyLoans,  // CRITICAL: companyLoans from mapper
    propertyData?.taloyhtiönKiinnitykset,
    propertyData?.taloyhtionKiinnitykset
  );
  const housingCompanyMortgageAmount = parseEuroAmount(housingCompanyMortgageSource);
  const housingCompanyMortgageDisplay = housingCompanyMortgageAmount != null
    ? formatEuroLabel(housingCompanyMortgageAmount)
    : formatTextValue(housingCompanyMortgageSource);

  const housingCompanyLoansAmount = parseEuroAmount(
    pickFirstNonEmpty(
      (propertyFinancials as any)?.companyLoans,
      propertyData?.companyLoans,
      propertyData?.taloyhtionLainat
    )
  );
  const housingCompanyLoansDisplay = housingCompanyLoansAmount != null
    ? formatEuroLabel(housingCompanyLoansAmount)
    : formatTextValue(pickFirstNonEmpty(propertyData?.companyLoans, propertyData?.taloyhtionLainat));

  const showHousingCompanyCard = [
    housingCompanyNameValue,
    housingCompanyMortgageDisplay,
    housingCompanyLoansDisplay,
    siteOwnershipValue,
    housingTenureValue
  ].some((value) => value !== '—');

  const apartmentBuildingItems = [
    { label: getTranslation('constructionYear', language), value: withPlaceholder(constructionYearValue) },
    { label: getTranslation('energyClass', language), value: withPlaceholder(energyClassValue) },
    { label: getTranslation('heatingSystem', language), value: withPlaceholder(heatingSystemValue) },
    { label: getTranslation('ownershipType', language), value: withPlaceholder(ownershipValue) }
  ];

  const apartmentHousingItems = [
    { label: getTranslation('housingCompanyName', language), value: withPlaceholder(housingCompanyNameValue) },
    { label: getTranslation('housingCompanyEncumbrances', language), value: withPlaceholder(housingCompanyMortgageDisplay) },
    { label: getTranslation('housingCompanyLoans', language), value: withPlaceholder(housingCompanyLoansDisplay) },
    { label: getTranslation('siteOwnershipType', language), value: withPlaceholder(siteOwnershipValue) },
    { label: getTranslation('housingTenure', language), value: withPlaceholder(housingTenureValue) }
  ];

  // Price rows for APARTMENTS: debtFreePrice and salesPrice ALWAYS visible (with fallback)
  // debtPart (velkaosuus) only shown if it exists
  const apartmentPriceRows = [
    { key: 'debtFreePrice', value: debtFreePriceDisplay, alwaysShow: true },
    { key: 'salesPrice', value: askPriceDisplay, alwaysShow: true },
    ...(shouldShowDebtPart && debtPartDisplay ? [{ key: 'debtPart', value: debtPartDisplay, alwaysShow: false }] : [])
  ];

  // Price rows for FASTIGHET: according to requirements
  // ALLTID FINNAS: debtFreePrice, propertyTax
  // IFALL DET FINNS: mortgageEncumbrances
  const propertyTaxDisplay = formatChargeValue(propertyTax);
  const fastighetPriceRowsRaw = [
    { key: 'debtFreePrice', value: debtFreePriceDisplay, alwaysShow: true },
    { key: 'propertyTax', value: propertyTaxDisplay, alwaysShow: true },  // ALWAYS show for fastigheter
    ...(mortgageEncumbranceValue !== '—' && mortgageEncumbranceValue ?
      [{ key: 'mortgageEncumbrances', value: mortgageEncumbranceValue, alwaysShow: false }] : [])
  ];

  // Create label-value items for apartments (keep all rows, even with '—')
  const apartmentPriceListItems = apartmentPriceRows.map((row) => ({
    label: getTranslation(row.key, language),
    value: row.alwaysShow && row.value === '—' ? notProvidedText : row.value
  }));

  // Create label-value items for fastighet (filter out '—' for optional fields)
  const fastighetPriceItems = fastighetPriceRowsRaw
    .filter((row) => row.alwaysShow || row.value !== '—')
    .map((row) => ({
      label: getTranslation(row.key, language),
      value: row.alwaysShow && row.value === '—' ? notProvidedText : row.value
    }));

  // Legacy priceListItems for backwards compatibility (used by apartments in current code)
  const priceListItems = apartmentPriceListItems;

  const livingCostRows: Array<{ label: string; value: string }> = [];
  const pushLivingCost = (labelKey: string, value: any) => {
    // For living costs: 0 or null means "does not exist", so don't show it
    if (value == null || value === '' || value === 0) return;
    const display = formatChargeValue(value);
    if (display === '—' || display === '0 €') return;
    livingCostRows.push({ label: getTranslation(labelKey, language), value: display });
  };
  pushLivingCost('maintenanceCharge', pickFirstNonEmpty(maintenanceCharge, (propertyFinancials as any)?.maintenanceFee, (propertyData as any)?.mandatoryCharges));
  pushLivingCost('financingFee', pickFirstNonEmpty(propertyData?.financingCharge, propertyData?.financingFee, (propertyFinancials as any)?.financingFee, (propertyFinancials as any)?.fundingCharge));
  pushLivingCost('renovationCharge', (propertyData as any)?.renovationCharge);
  pushLivingCost('waterCharge', waterCharge);
  pushLivingCost('saunaCharge', (propertyData as any)?.saunaCharge);
  pushLivingCost('parkingCharge', (propertyData as any)?.parkingCharge);
  pushLivingCost('plotRentFee', plotRentCharge);
  pushLivingCost('heatingCosts', heatingCharge);
  pushLivingCost('electricHeating', electricHeatingCharge);
  pushLivingCost('otherFee', otherCharge);

  const otherCostRows: Array<{ label: string; value: string }> = [];
  const pushOtherCost = (labelKey: string, value: any, formatter: (val: any) => string = formatChargeValue) => {
    // For other costs: 0 or null means "does not exist", so don't show it
    if (value == null || value === '' || value === 0) return;
    const display = formatter(value);
    if (display === '—' || display === '0 €') return;
    otherCostRows.push({ label: getTranslation(labelKey, language), value: display });
  };
  // NOTE: propertyTax is now handled separately:
  // - For apartments: never shown (filtered out by otherCostListItemsFiltered)
  // - For fastigheter: shown in fastighetPriceItems under "Hintatiedot"
  // So we don't add it to otherCostRows at all
  pushOtherCost('cableTv', cableCharge);
  pushOtherCost('internet', internetCharge);
  pushOtherCost('roadTollFee', propertyData?.roadTolls);
  const insuranceDisplay = insuranceRequired != null ? formatBooleanLabel(insuranceRequired, language) : '—';
  if (insuranceDisplay !== '—') {
    otherCostRows.push({ label: getTranslation('insurance', language), value: insuranceDisplay });
  }

  const livingCostListItems = livingCostRows.map((row) => ({ label: row.label, value: row.value }));
  const otherCostListItems = otherCostRows.map((row) => ({ label: row.label, value: row.value }));

  const costSummaryTotals = {
    monthly: monthlyTotalCost ? `${monthlyTotalCost} €/kk` : undefined,
    yearly: yearlyTotalCost ? `${yearlyTotalCost} €/v` : undefined
  };

  const toUrlString = (input: any): string | null => {
    if (!input) return null;
    if (typeof input === 'string') return input;
    if (typeof input === 'object') {
      if (typeof input.url === 'string') return input.url;
      if (typeof input.value === 'string') return input.value;
    }
    return null;
  };

  const normalizedHighlights = Array.isArray(marketingHighlights)
    ? marketingHighlights.map((item: any) => removeEmojis(String(item)))
    : [];

  const normalizedSellingPoints = Array.isArray(marketingSellingPoints)
    ? marketingSellingPoints.map((item: any) => removeEmojis(String(item)))
    : [];

  const agentNotesText = marketingAgentNotes ? removeEmojis(marketingAgentNotes) : undefined;

  const externalLinkEntries: DocumentLink[] = [];
  if (Array.isArray(externalLinks)) {
    externalLinks.forEach((link: any, idx: number) => {
      const url = toUrlString(link?.url ?? link?.value ?? link);
      if (!url) return;
      const label = removeEmojis(String(link?.label ?? `${getTranslation('additionalInfo', language)} ${idx + 1}`));
      externalLinkEntries.push({ label, href: url });
    });
  } else if (typeof externalLinks === 'string') {
    externalLinks
      .split('\n')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .forEach((entry, idx) => {
        externalLinkEntries.push({
          label: `${getTranslation('additionalInfo', language)} ${idx + 1}`,
          href: entry
        });
      });
  }

  const fastighetAdditionalMaterials: AdditionalMaterialLink[] = [];
  const normalizedVideoUrl = toUrlString(videoUrl);
  if (normalizedVideoUrl) {
    fastighetAdditionalMaterials.push({
      label: getTranslation('video', language),
      href: normalizedVideoUrl,
      type: 'video'
    });
  }

  const normalizedVirtualTourUrl = toUrlString(propertyData?.virtualTourUrl);
  if (normalizedVirtualTourUrl) {
    fastighetAdditionalMaterials.push({
      label: getTranslation('virtualTour', language),
      href: normalizedVirtualTourUrl,
      type: 'virtualTour'
    });
  }

  externalLinkEntries.forEach((link) => {
    fastighetAdditionalMaterials.push({
      label: link.label,
      href: link.href,
      type: 'link'
    });
  });

  const normalizedFloorPlanUrl = toUrlString(floorPlanUrl);
  const normalizedEnergyCertificateUrl = toUrlString(energyCertificateUrl);
  const normalizedPropertyPlanUrl = toUrlString(propertyPlanUrl);
  const normalizedBuildingPermitUrl = toUrlString(buildingPermitUrl);
  const normalizedMaintenancePlanUrl = toUrlString(maintenancePlanUrl);
  const normalizedAsbestosReportUrl = toUrlString(asbestosSurveyReport);
  const normalizedConditionReportUrl = toUrlString(conditionReport);
  const normalizedMoistureReportUrl = toUrlString(moistureReport);

  const fastighetDocuments: DocumentLink[] = (
    [
      normalizedFloorPlanUrl ? { label: getTranslation('floorPlan', language), href: normalizedFloorPlanUrl } : null,
      normalizedEnergyCertificateUrl ? { label: getTranslation('energyCertificate', language), href: normalizedEnergyCertificateUrl } : null,
      normalizedPropertyPlanUrl ? { label: getTranslation('plotPlan', language), href: normalizedPropertyPlanUrl } : null,
      normalizedBuildingPermitUrl ? { label: getTranslation('buildingPermit', language), href: normalizedBuildingPermitUrl } : null,
      normalizedMaintenancePlanUrl ? { label: getTranslation('maintenancePlan', language), href: normalizedMaintenancePlanUrl } : null,
      normalizedAsbestosReportUrl ? { label: getTranslation('asbestosSurveyReport', language), href: normalizedAsbestosReportUrl } : null,
      normalizedConditionReportUrl ? { label: getTranslation('conditionReport', language), href: normalizedConditionReportUrl } : null,
      normalizedMoistureReportUrl ? { label: getTranslation('moistureReport', language), href: normalizedMoistureReportUrl } : null
    ]
  ).filter(Boolean) as DocumentLink[];

  const zoningSummary = formatTextValue(pickFirstNonEmpty(zoningStatus, propertyData?.zoningSituation));
  const zoningInfoParagraphs = typeof zoningInfo === 'string'
    ? zoningInfo
        .split('\n')
        .map((paragraph: string) => paragraph.trim())
        .filter((paragraph: string) => paragraph.length > 0)
    : [];

  // Helper function for formatting dates - must be defined before fastighetEstateItems
  const formatDateValue = (value: any): string => {
    if (!value) return '—';
    if (value instanceof Date) {
      return value.toLocaleDateString('fi-FI');
    }
    if (typeof value === 'object' && 'fi' in value) {
      return getLocalizedText(value, language) || '—';
    }
    return String(value);
  };

  // FASTIGHET Estate Items: "ALLTID FINNAS" means always show (even if empty), "IFALL DET FINNS" means show only if exists
  const fastighetEstateItems: LabelValueItem[] = [
    // ALLTID FINNAS (always visible with fallback)
    {
      label: getTranslation('propertyId', language),
      value: withPlaceholder(formatTextValue(
        pickFirstNonEmpty(
          propertyData?.propertyId,
          propertyData?.propertyIdentifier,
          propertyData?.propertyDesignation
        )
      ))
    },
    {
      label: getTranslation('propertyLotSize', language),
      value: withPlaceholder(lotAreaDisplay)
    },
    {
      label: getTranslation('ownershipType', language),
      value: withPlaceholder(siteOwnershipValue)
    },
    {
      label: getTranslation('zoningSituation', language),
      value: withPlaceholder(zoningSummary)
    },
    // waterConnection/vesijohto removed per customer requirement
    {
      label: getTranslation('energyClass', language),
      value: withPlaceholder(energyClassValue)
    },
    {
      label: getTranslation('energyCertificate', language),
      value: normalizedEnergyCertificateUrl
        ? (
            <a href={normalizedEnergyCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-[#002349] hover:underline">
              {getTranslation('energyCertificateUrl', language)}
            </a>
          )
        : withPlaceholder(energyCertificateMessage || '—')
    },
    {
      label: getTranslation('availableFrom', language),
      value: withPlaceholder(formatDateValue(propertyData?.availableFrom ?? releaseSource))
    },
    // IFALL DET FINNS (show only if exists) - add conditionally after array creation
  ];

  // Add "Rakennusoikeus" (Building Rights) only if it exists
  const buildingRights = formatTextValue(propertyData?.propertyBuildingRights);
  if (buildingRights && buildingRights !== '—') {
    fastighetEstateItems.push({
      label: getTranslation('propertyBuildingRights', language),
      value: buildingRights
    });
  }

  // FASTIGHET Building Items: "ALLTID FINNAS" vs "IFALL DET FINNS"
  const fastighetBuildingItems: LabelValueItem[] = [
    // ALLTID FINNAS (always visible)
    {
      label: getTranslation('constructionYear', language),
      value: withPlaceholder(constructionYearValue)
    },
    {
      label: getTranslation('heatingSystem', language),
      value: withPlaceholder(heatingSystemValue)
    },
    {
      label: getTranslation('ventilation', language),
      value: withPlaceholder(ventilationValue)
    }
  ];

  // Add "Kerrosten määrä" (Number of Floors) only if it exists
  if (floorCountValue && floorCountValue !== '—') {
    fastighetBuildingItems.push({
      label: getTranslation('numberOfFloors', language),
      value: floorCountValue
    });
  }

  // fastighetPriceItems now defined earlier (line ~493) with proper always-show logic
  const fastighetRightsText = rightsText && rightsText !== '—' && rightsText !== notProvidedText ? rightsText : undefined;

  // formatDateValue now defined earlier (before fastighetEstateItems) to avoid hoisting issues

  const apartmentDetailsItems = [
    typeOfApartment
      ? {
          label: getTranslation('apartmentTypeLabel', language),
          value: withPlaceholder(formatTextValue(typeOfApartment))
        }
      : undefined,
    {
      label: getTranslation('floorLabel', language),
      value: withPlaceholder(formatTextValue(floorDisplay))
    },
    {
      label: getTranslation('elevator', language),
      value: withPlaceholder(formatBooleanLabel(elevatorDisplay, language))
    },
    {
      label: getTranslation('availableFrom', language),
      value: withPlaceholder(formatDateValue(releaseSource))
    },
    showBalcony
      ? {
          label: getTranslation('balcony', language),
          value: withPlaceholder(balconyLabel || yesLabel),
          secondary: balconySupplement.length > 0 ? balconySupplement.join(' • ') : undefined
        }
      : undefined,
    showSauna
      ? {
          label: getTranslation('sauna', language),
          value: withPlaceholder(saunaLabel || yesLabel),
          secondary: saunaSupplement.length > 0 ? saunaSupplement.join(' • ') : undefined
        }
      : undefined
  ].filter(Boolean) as LabelValueItem[];

  // ============================================================================
  // RENTAL (HYRESOBJEKT) DATA PREPARATION
  // ============================================================================
  const rentAmount = propertyData?.rent || 0;
  const rentDisplay = rentAmount > 0 ? formatEuroLabel(rentAmount) : '—';

  // Security deposit - can be text (e.g. "2 kuukauden vuokra") or amount
  const securityDepositValue = formatTextValue(propertyData?.securityDepositType) || formatEuroLabel(parseEuroAmount(propertyData?.securityDeposit) || 0);
  const securityDepositDisplay = securityDepositValue && securityDepositValue !== '—' ? securityDepositValue : '—';

  // Rental apartment details items - CONDITIONAL DISPLAY per Dennis requirements
  const rentalApartmentDetailsItems: LabelValueItem[] = [
    // ALLTID SYNLIGA (Always visible)
    {
      label: getTranslation('floorLabel', language),
      value: withPlaceholder(formatTextValue(floorDisplay))
    },
    {
      label: getTranslation('condition', language),
      value: withPlaceholder(formatTextValue(condition || generalCondition))
    },
    // SYNLIGT ENDAST IFALL "JA" (Only if YES - hide if "Ei"/false or null)
    ...(balcony === true || balcony === 'true' || (typeof balcony === 'string' && balcony.toLowerCase() === 'kyllä')
      ? [{
          label: getTranslation('balcony', language),
          value: yesLabel
        }]
      : []),
    ...(sauna === true || sauna === 'true' || (typeof sauna === 'string' && sauna.toLowerCase() === 'kyllä')
      ? [{
          label: getTranslation('sauna', language),
          value: yesLabel
        }]
      : []),
    ...(terrace === true || terrace === 'true'
      ? [{
          label: getTranslation('terrace', language),
          value: yesLabel
        }]
      : []),
    // SYNLIGA IFALL JA/NEJ IFYLLD (Visible if YES or NO filled - hide if null/empty)
    ...(propertyData?.petsAllowed != null
      ? [{
          label: getTranslation('petsAllowed', language),
          value: formatBooleanLabel(propertyData.petsAllowed, language)
        }]
      : []),
    ...(propertyData?.smokingAllowed != null
      ? [{
          label: getTranslation('smokingAllowed', language),
          value: formatBooleanLabel(propertyData.smokingAllowed, language)
        }]
      : [])
  ];

  // Rental information items - ALWAYS visible for rentals (Vuokratiedot)
  const rentalInfoItems: LabelValueItem[] = [
    { label: getTranslation('contractType', language), value: withPlaceholder(formatTextValue(propertyData?.rentalContractType)) },
    { label: getTranslation('availableFrom', language), value: withPlaceholder(formatDateValue(releaseSource)) },
    { label: getTranslation('terminationPeriod', language), value: withPlaceholder(formatTextValue(propertyData?.earliestTerminateDate)) }
  ];

  // Rent items - ALWAYS visible for rentals (Kustannukset)
  const rentItems: LabelValueItem[] = [
    { label: getTranslation('rentPerMonth', language), value: withPlaceholder(rentDisplay) },
    { label: getTranslation('securityDeposit', language), value: withPlaceholder(securityDepositDisplay) }
  ];

  // Additional costs for rentals - ONLY if they exist
  const rentalAdditionalCostItems: LabelValueItem[] = [];
  if (waterCharge && waterCharge > 0) {
    rentalAdditionalCostItems.push({ label: getTranslation('waterCharge', language), value: formatChargeValue(waterCharge) });
  }
  if (heatingCharge && heatingCharge > 0) {
    rentalAdditionalCostItems.push({ label: getTranslation('heatingCosts', language), value: formatChargeValue(heatingCharge) });
  }
  if (internetCharge && internetCharge > 0) {
    rentalAdditionalCostItems.push({ label: getTranslation('internet', language), value: formatChargeValue(internetCharge) });
  }
  if (cableCharge && cableCharge > 0) {
    rentalAdditionalCostItems.push({ label: getTranslation('cableTv', language), value: formatChargeValue(cableCharge) });
  }
  // Add "Lisätietoja maksuista" if exists
  const chargeInfo = formatTextValue(propertyData?.chargeInfo);
  if (chargeInfo && chargeInfo !== '—') {
    rentalAdditionalCostItems.push({ label: getTranslation('additionalChargeInfo', language), value: chargeInfo });
  }

  const includedInRentText = propertyData?.rentIncludes || propertyData?.rentalNotes || undefined;

  // Rental housing+building items - Combined "Taloyhtiötiedot" for rentals
  // Remove: Kiinnitykset, Lainat, Tontin omistus, Hallintamuoto
  // Keep: Yhtiön nimi, Rakennusvuosi, Lämmitysjärjestelmä, Energialuokka, Energiatodistus, Hissi
  const rentalHousingItems: LabelValueItem[] = [
    { label: getTranslation('housingCompanyName', language), value: withPlaceholder(housingCompanyNameValue) },
    { label: getTranslation('constructionYear', language), value: withPlaceholder(constructionYearValue) },
    { label: getTranslation('heatingSystem', language), value: withPlaceholder(heatingSystemValue) },
    { label: getTranslation('energyClass', language), value: withPlaceholder(energyClassValue) },
    { label: getTranslation('energyCertificate', language), value: withPlaceholder(energyCertificateMessage) },
    { label: getTranslation('elevator', language), value: withPlaceholder(formatBooleanLabel(elevatorDisplay, language)) }
  ];

  // Get property ID from property or propertyData or use address as fallback
  const propertyId = property?.id || propertyData?.id || address;

  // ============================================================================
  // DETERMINE PROPERTY TYPE: LÄGENHET vs FASTIGHET vs HYRESOBJEKT
  // ============================================================================
  const propertyTypeStr = (propertyData?.propertyType || '').toLowerCase();
  const typeOfApartmentStr = (typeOfApartment || propertyData?.apartmentType || '').toLowerCase();
  const addressStr = (address || '').toLowerCase();
  
  // Helper functions
  const gt0 = (val: any) => typeof val === 'number' && val > 0;
  const hasText = (val: any) => typeof val === 'string' && val.trim().length > 0;
  
  // HYRESOBJEKT (Rental) identification: has rent > 0
  const isRental = gt0(propertyData?.rent);
  
  // Check for plot/lot area
  const hasPlot = gt0(propertyData?.siteArea) || gt0(propertyData?.plotArea) || gt0(lotArea);
  
  // Check address patterns
  const hasPropertyRoadName = /tie|vägen|väg(?!en)|road/i.test(addressStr) && !/katu|gatan|street/i.test(addressStr);
  
  // Check for housing company debt (critical for apartments)
  const hasCompanyDebt = gt0(debtFreePrice) && gt0(askPrice) && debtFreePrice !== askPrice;
  const hasHousingCompany = hasText(housingCooperativeName);
  
  // Check description for house/villa keywords (highest priority)
  const descriptionStr = String(propertyData?.description || propertyData?.freeText || '').toLowerCase();
  const isDefinitelyHouse = /omakotitalo|villa|egendom|egnahemshus|detached house|single-family|radhus|townhouse|parhus|semi-detached/i.test(descriptionStr);
  
  // LÄGENHET (Apartment) identification:
  // 1. NOT a house (checked via description keywords)
  // 2. Has housing company debt (debtFreePrice !== askPrice)
  // 3. Has housingCompanyName
  // 4. Address contains "katu" or "gatan" (city street)
  // 5. typeOfApartment contains apartment format like "2h+k", "3h, k", "5-6h, k, kph"
  // 6. NOT a rental
  const isApartment = !isRental && !isDefinitelyHouse && (
    hasCompanyDebt || 
    hasHousingCompany || 
    /katu|gatan|street/i.test(addressStr) ||
    /\d+h/i.test(typeOfApartmentStr) || // Matches patterns with digit+h like "2h", "5-6h", "kph"
    /huoneisto|lägenhet|apartment/i.test(typeOfApartmentStr)
  );
  
  // FASTIGHET (House/Villa) identification:
  // 1. NOT an apartment (most important!)
  // 2. NOT a rental
  // 3. Has typeOfApartment/apartmentType containing "kiinteistö"
  // 4. Has propertyType containing villa/hus/fastighet/omakotitalo etc
  // 5. Has plot size (plotArea/siteArea/lotArea > 0)
  // 6. Address contains "tie" or "vägen" (but NOT "katu" or "gatan")
  const isFastighet = !isApartment && !isRental && (
    /kiinteist[öo]/i.test(typeOfApartmentStr) ||
    /villa|hus|fastighet|omakotitalo|egendom|egnahemshus|radhus|parhus/i.test(propertyTypeStr) ||
    hasPlot ||
    hasPropertyRoadName
  );

  // ============================================================================
  // FILTER propertyTax FOR APARTMENTS
  // ============================================================================
  // CRITICAL: Apartments (lägenheter) should NEVER show propertyTax (kiinteistövero)
  // Create filtered list for apartments that excludes propertyTax
  const otherCostListItemsFiltered = isApartment
    ? otherCostListItems.filter(item => {
        const propertyTaxLabel = getTranslation('propertyTax', language);
        return item.label !== propertyTaxLabel;
      })
    : otherCostListItems;

  // Debug log for development
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[PropertyDetailEnhanced] Property Type Detection:', {
        address,
        isRental,
        isApartment,
        isFastighet,
        rent: propertyData?.rent,
        hasCompanyDebt,
        hasHousingCompany,
        hasPlot,
        typeOfApartment: typeOfApartmentStr,
        propertyType: propertyTypeStr
      });
      
      console.log('[PropertyDetailEnhanced] Available Fields for Debugging:', {
        ownershipType: propertyData?.ownershipType,
        housingTenure: propertyData?.housingTenure,
        siteOwnershipType: propertyData?.siteOwnershipType,
        waterConnection: propertyData?.waterConnection,
        waterSystem: propertyData?.waterSystem,
        availableFrom: propertyData?.availableFrom,
        earliestTerminateDate: propertyData?.earliestTerminateDate,
        petsAllowed: propertyData?.petsAllowed,
        smokingAllowed: propertyData?.smokingAllowed,
        rentIncludes: propertyData?.rentIncludes,
        rentalNotes: propertyData?.rentalNotes,
        securityDepositType: propertyData?.securityDepositType,
        additionalCosts: propertyData?.additionalCosts,
        otherCostsDescription: propertyData?.otherCostsDescription
      });
      
      console.log('[PropertyDetailEnhanced] Description Fields (LocalizedString):', {
        marketingDescription: propertyData?.marketingDescription,
        freeText: propertyData?.freeText,
        description: propertyData?.description,
        marketingTitle: propertyData?.marketingTitle,
        freeTextTitle: propertyData?.freeTextTitle,
        currentLanguage: language
      });
    }
  }, [address, isRental, isApartment, isFastighet, propertyData, language]);
  
  // Initialize mortgage calculator with property price
  useEffect(() => {
    if (askPrice) {
      const priceValue = parseInt(askPrice);
      const downPaymentAmount = Math.round(priceValue * (mortgageCalc.downPayment / 100));
      setMortgageCalc(prev => ({
        ...prev,
        loanAmount: priceValue - downPaymentAmount
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askPrice]);
  
  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const principal = mortgageCalc.loanAmount;
    const monthlyRate = mortgageCalc.interestRate / 100 / 12;
    const numPayments = mortgageCalc.loanTerm * 12;
    
    if (monthlyRate === 0) {
      return principal / numPayments;
    }
    
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return Math.round(monthlyPayment);
  };
  
  // Load saved state from localStorage on mount
  useEffect(() => {
    if (propertyId) {
      const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
      setIsSaved(savedProperties.includes(propertyId));
      
      const comparisonProperties = JSON.parse(localStorage.getItem('comparisonProperties') || '[]');
      setIsInComparison(comparisonProperties.some((p: any) => p.id === propertyId));
    }
  }, [propertyId]);
  
  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareMenu && !(event.target as Element).closest('.share-menu-container')) {
        setShowShareMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);
  
  // Listen for comparison updates from other components
  useEffect(() => {
    const handleComparisonUpdate = () => {
      if (propertyId) {
        const comparisonProperties = JSON.parse(localStorage.getItem('comparisonProperties') || '[]');
        setIsInComparison(comparisonProperties.some((p: any) => p.id === propertyId));
      }
    };
    
    window.addEventListener('comparisonUpdate', handleComparisonUpdate);
    return () => window.removeEventListener('comparisonUpdate', handleComparisonUpdate);
  }, [propertyId]);
  
  // Handle save/unsave property
  const handleSaveProperty = () => {
    if (!propertyId) {
      return;
    }
    
    const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    
    if (isSaved) {
      const updated = savedProperties.filter((id: string) => id !== propertyId);
      localStorage.setItem('savedProperties', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      savedProperties.push(propertyId);
      localStorage.setItem('savedProperties', JSON.stringify(savedProperties));
      setIsSaved(true);
    }
  };
  
  // Handle add/remove from comparison
  const handleComparisonToggle = () => {
    if (!propertyId) {
      return;
    }
    
    const comparisonProperties = JSON.parse(localStorage.getItem('comparisonProperties') || '[]');
    
    if (isInComparison) {
      // Remove from comparison
      const updated = comparisonProperties.filter((p: any) => p.id !== propertyId);
      localStorage.setItem('comparisonProperties', JSON.stringify(updated));
      setIsInComparison(false);
      setShowComparisonNotification(true);
      setTimeout(() => setShowComparisonNotification(false), 3000);
    } else {
      // Check if comparison limit reached (max 4 properties)
      if (comparisonProperties.length >= 4) {
        alert('Voit vertailla enintään 4 kohdetta kerrallaan');
        return;
      }
      
      // Add to comparison
      const propertyData = {
        id: propertyId,
        address: address,
        askPrice: askPrice,
        area: area,
        rooms: rooms,
        image: images[0]?.url || images[0],
        marketingTitle: getLocalizedText(heading, language) ||
                       getLocalizedText(marketingTitle, language) || 
                       getLocalizedText(freeTextTitle, language) || 
                       address
      };
      
      comparisonProperties.push(propertyData);
      localStorage.setItem('comparisonProperties', JSON.stringify(comparisonProperties));
      setIsInComparison(true);
      setShowComparisonNotification(true);
      setTimeout(() => setShowComparisonNotification(false), 3000);
    }
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('comparisonUpdate'));
  };

  // Navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  // Touch handlers for swipe gestures
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
  };
  
  // Helper function to determine virtual tour provider and embed capability
  const getVirtualTourInfo = () => {
    if (!virtualShowing && !videoUrl && !youtubeUrl) {
      return null;
    }
    
    // Extract URL string from object if needed (Linear API returns {key, value, category})
    let url = virtualShowing || videoUrl || youtubeUrl;
    if (typeof url === 'object' && url !== null && 'value' in url) {
      url = url.value;
    }
    
    // Ensure url is a string
    if (typeof url !== 'string') {
      console.warn('videoUrl is not a string:', url);
      return null;
    }
    
    // Check for common virtual tour providers
    if (url.includes('matterport.com')) {
      return { type: 'matterport', embedUrl: url, canEmbed: true };
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Convert YouTube URL to embed format
      let videoId = '';
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }
      return { 
        type: 'youtube', 
        embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : url,
        canEmbed: true 
      };
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return { 
        type: 'vimeo', 
        embedUrl: videoId ? `https://player.vimeo.com/video/${videoId}` : url,
        canEmbed: true 
      };
    } else if (url.includes('360') || url.includes('virtuaali') || url.includes('virtual')) {
      return { type: '360tour', embedUrl: url, canEmbed: false };
    }
    
    return { type: 'external', embedUrl: url, canEmbed: false };
  };

  // ============================================================================
  // TAB DEFINITIONS - Different tabs for LÄGENHET vs FASTIGHET vs HYRESOBJEKT
  // Translated dynamically based on selected language
  // ============================================================================
  const apartmentTabs = [
    { id: 'overview', label: getTranslation('overview', language) },
    { id: 'details', label: getTranslation('apartmentDetails', language) },
    { id: 'building', label: getTranslation('buildingAndCompany', language) },
    { id: 'costs', label: getTranslation('costs', language) },
    { id: 'location', label: getTranslation('otherInformation', language) },
    { id: 'documents', label: getTranslation('documentsAndLinks', language) }
  ];

  const fastighetTabs = [
    { id: 'overview', label: getTranslation('overview', language) },
    { id: 'property-details', label: getTranslation('propertyDetailsTab', language) },
    { id: 'building', label: getTranslation('buildingDetailsTab', language) },
    { id: 'costs', label: getTranslation('costs', language) },
    { id: 'documents', label: getTranslation('documents', language) }
  ];

  const rentalTabs = [
    { id: 'overview', label: getTranslation('overview', language) },
    { id: 'details', label: getTranslation('apartmentDetails', language) },
    { id: 'building', label: getTranslation('buildingAndCompany', language) },
    { id: 'costs', label: getTranslation('costs', language) },
    { id: 'documents', label: getTranslation('documentsAndLinks', language) }
  ];
  
  // Use different tabs based on property type
  const tabs = isRental ? rentalTabs : (isApartment ? apartmentTabs : fastighetTabs);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Carousel - Optimized for mobile */}
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] bg-black">
        {images.length > 0 && (
          <>
            <div 
              className="relative h-full w-full"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={images[currentImageIndex]?.url || images[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                fill
                className="object-cover cursor-pointer select-none"
                priority
                onClick={() => setIsFullscreen(true)}
                draggable={false}
              />
              
              {/* Gallery Controls - Mobile optimized */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1.5 sm:gap-2">
                {getVirtualTourInfo() && (
                  <button
                    onClick={() => setShowVirtualTour(true)}
                    className="bg-white/90 hover:bg-white p-2.5 sm:p-2 rounded-lg shadow-md transition-all flex items-center gap-2 touch-manipulation"
                    title="Virtuaalikierros"
                  >
                    <CubeIcon className="w-5 h-5 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">360° Kierros</span>
                  </button>
                )}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="bg-white/90 hover:bg-white p-2.5 sm:p-2 rounded-lg shadow-md transition-all touch-manipulation"
                  title="Koko näyttö"
                >
                  <ArrowsPointingOutIcon className="w-5 h-5 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Image Navigation - Larger touch targets on mobile */}
            <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 pointer-events-none">
              <button
                onClick={prevImage}
                className="p-3 sm:p-3 md:p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all pointer-events-auto touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="p-3 sm:p-3 md:p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all pointer-events-auto touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Next image"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Image Counter - Mobile optimized */}
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/70 text-white px-2.5 py-1.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </section>
      
      {/* Fullscreen Gallery Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => {
                setIsFullscreen(false);
                setImageZoom(1);
                setImageDragPosition({ x: 0, y: 0 });
              }}
              className="absolute top-4 right-4 z-60 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            {/* Zoom controls */}
            <div className="absolute top-4 left-4 z-60 flex gap-2">
              <button
                onClick={() => setImageZoom(Math.max(1, imageZoom - 0.5))}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors"
                disabled={imageZoom <= 1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="bg-white/10 px-3 py-2 rounded-lg text-white text-sm">
                {Math.round(imageZoom * 100)}%
              </span>
              <button
                onClick={() => setImageZoom(Math.min(3, imageZoom + 0.5))}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors"
                disabled={imageZoom >= 3}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setImageZoom(1);
                  setImageDragPosition({ x: 0, y: 0 });
                }}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors"
              >
                <span className="text-sm">Palauta</span>
              </button>
            </div>
            
            {/* Image container */}
            <div 
              className="relative overflow-hidden"
              style={{
                width: '90vw',
                height: '90vh',
                cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              onMouseDown={(e) => {
                if (imageZoom > 1) {
                  setIsDragging(true);
                  const startX = e.clientX - imageDragPosition.x;
                  const startY = e.clientY - imageDragPosition.y;
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    setImageDragPosition({
                      x: e.clientX - startX,
                      y: e.clientY - startY
                    });
                  };
                  
                  const handleMouseUp = () => {
                    setIsDragging(false);
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }
              }}
            >
              <Image
                src={images[currentImageIndex]?.url || images[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                fill
                className="object-contain select-none"
                style={{
                  transform: `scale(${imageZoom}) translate(${imageDragPosition.x / imageZoom}px, ${imageDragPosition.y / imageZoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s'
                }}
                draggable={false}
              />
            </div>
            
            {/* Navigation in fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image counter in fullscreen */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
            
            {/* Thumbnail strip */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto">
              {images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setImageZoom(1);
                    setImageDragPosition({ x: 0, y: 0 });
                  }}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === idx ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'
                  } transition-all`}
                >
                  <Image
                    src={image.thumbnail || image.url || image}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Virtual Tour Modal */}
      {showVirtualTour && getVirtualTourInfo() && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl mx-auto p-4">
            {/* Close button */}
            <button
              onClick={() => setShowVirtualTour(false)}
              className="absolute top-4 right-4 z-60 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-light text-white mb-2">
                Virtuaalikierros
              </h2>
              <p className="text-white/80">
                {marketingTitle || address}
              </p>
            </div>
            
            {/* Virtual Tour Content */}
            <div className="relative h-[calc(100vh-200px)] bg-black rounded-lg overflow-hidden">
              {(() => {
                const tourInfo = getVirtualTourInfo();
                
                if (tourInfo?.canEmbed) {
                  return (
                    <iframe
                      src={tourInfo.embedUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      title="Virtuaalikierros"
                    />
                  );
                } else {
                  // For non-embeddable tours, show a preview and link
                  return (
                    <div className="flex flex-col items-center justify-center h-full text-white">
                      <CubeIcon className="w-24 h-24 mb-4 text-white/50" />
                      <h3 className="text-xl mb-2">Virtuaalikierros saatavilla</h3>
                      <p className="text-white/80 mb-6 text-center max-w-md">
                        Klikkaa alla olevaa painiketta avataksesi virtuaalikierroksen uudessa välilehdessä
                      </p>
                      <a
                        href={tourInfo?.embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <span>Avaa virtuaalikierros</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  );
                }
              })()}
            </div>
            
            {/* Info bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {(() => {
                const tourInfo = getVirtualTourInfo();
                switch(tourInfo?.type) {
                  case 'matterport': return 'Matterport 3D-kierros';
                  case 'youtube': return 'YouTube-video';
                  case 'vimeo': return 'Vimeo-video';
                  case '360tour': return '360° virtuaalikierros';
                  default: return 'Virtuaalikierros';
                }
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Top Link Group - International/Auction Links */}
      {(internationalBrochureUrl || auctionUrl) && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <div className="flex justify-end gap-4">
              {internationalBrochureUrl && (
                <Link
                  href={internationalBrochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-primary)] hover:underline font-medium"
                >
                  International Listing
                </Link>
              )}
              {auctionUrl && (
                <Link
                  href={auctionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-primary)] hover:underline font-medium"
                >
                  Auction
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Property Header - Mobile optimized */}
      <section className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <Heading as="h1" className="text-xl sm:text-2xl lg:text-3xl leading-tight">
                {removeEmojis(
                  getLocalizedText(heading, language) ||
                  getLocalizedText(marketingTitle, language) ||
                  getLocalizedText(freeTextTitle, language) ||
                  address || ''
                )}
              </Heading>
              {marketingSubtitle && (
                <p className="text-base sm:text-xl text-gray-700 mt-1.5 sm:mt-2 font-light leading-snug">
                  {removeEmojis(getLocalizedText(marketingSubtitle, language))}
                </p>
              )}
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1 leading-relaxed">
                {removeEmojis(address || '')} • {postalCode} {city} {province && `, ${province}`}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                {typeOfApartment && <PropertyTypeChip type={removeEmojis(typeOfApartment)} />}
                <MetaRow
                  items={[
                    { value: area ? (String(area).includes('m²') || String(area).includes('m2') ? area : `${area} m²`) : '' },
                    { label: 'Rakennettu', value: yearBuilt || '' }
                  ]}
                />
              </div>
            </div>
            <div className="lg:text-right flex-shrink-0">
              {isRental ? (
                <>
                  <Price className="text-2xl sm:text-3xl lg:text-4xl whitespace-nowrap font-bold" block>
                    {propertyData?.rent ? `${propertyData.rent.toLocaleString('fi-FI')} €/${getTranslation('perMonth', language)}` : getTranslation('askForPrice', language)}
                  </Price>
                  {area && propertyData?.rent && (
                    <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                      {Math.round(propertyData.rent / parseInt(area)).toLocaleString('fi-FI')} €/m²
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Price className="text-2xl sm:text-3xl lg:text-4xl whitespace-nowrap font-bold" block>
                    {askPrice ? `${parseInt(askPrice).toLocaleString('fi-FI')} €` : 'Kysy hintaa'}
                  </Price>
                  {area && askPrice && (
                    <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                      {Math.round(parseInt(askPrice) / parseInt(area)).toLocaleString('fi-FI')} €/m²
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Action Buttons - Full width on mobile, better spacing */}
          <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end mt-3 sm:mt-4">
              <button
                onClick={handleSaveProperty}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 active:border-gray-500 transition-colors touch-manipulation min-h-[44px]"
                title={isSaved ? "Poista tallennetuista" : "Tallenna kohde"}
              >
                {isSaved ? (
                  <HeartIconSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                )}
                <span className="text-sm font-medium">{isSaved ? "Tallennettu" : "Tallenna"}</span>
              </button>

              <button
                onClick={handleComparisonToggle}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-lg border transition-colors touch-manipulation min-h-[44px] ${
                  isInComparison
                    ? 'border-[#002349] bg-[#002349] text-white'
                    : 'border-gray-300 hover:border-gray-400 active:border-gray-500'
                }`}
                title={isInComparison ? "Poista vertailusta" : "Lisää vertailuun"}
              >
                <ScaleIcon className={`h-5 w-5 ${isInComparison ? 'text-white' : 'text-gray-600'}`} />
                <span className="text-sm font-medium">{isInComparison ? "Vertailussa" : "Vertaile"}</span>
              </button>

              <div className="relative share-menu-container">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 active:border-gray-500 transition-colors touch-manipulation min-h-[44px]"
                >
                  <ShareIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Jaa</span>
                </button>
                
                {showShareMenu && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShowShareMenu(false);
                        alert('Linkki kopioitu leikepöydälle!');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                    >
                      Kopioi linkki
                    </button>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => setShowShareMenu(false)}
                    >
                      Jaa Facebookissa
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(marketingTitle || address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => setShowShareMenu(false)}
                    >
                      Jaa Twitterissä
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(marketingTitle || address)}&body=${encodeURIComponent(`Katso tämä kohde: ${window.location.href}`)}`}
                      className="block px-4 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => setShowShareMenu(false)}
                    >
                      Lähetä sähköpostilla
                    </a>
                  </div>
                )}
              </div>


              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 active:border-gray-500 transition-colors touch-manipulation min-h-[44px]"
              >
                <PrinterIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Tulosta</span>
              </button>
            </div>
        </div>
      </section>

      {/* Tab Navigation - Mobile optimized with better touch targets */}
      <section className="bg-white border-b sticky top-0 md:top-[104px] z-30 shadow-sm">
        <div className="container mx-auto px-0 sm:px-2 md:px-4">
          <div className="relative">
            <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 border-b-3 transition-all whitespace-nowrap snap-start min-w-fit touch-manipulation ${
                    activeTab === tab.id
                      ? 'border-[#002349] text-[#002349] font-semibold bg-blue-50/30'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  <span className="text-sm sm:text-base leading-tight">{tab.label}</span>
                </button>
              ))}
            </div>
            {/* Scroll indicators for mobile with better visibility */}
            <div className="absolute left-0 top-0 h-full w-6 sm:w-8 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 h-full w-6 sm:w-8 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none md:hidden" />
          </div>
        </div>
      </section>

      {/* Description Section - Always visible under tabs */}
      {apartmentDescriptionParagraphs && apartmentDescriptionParagraphs.length > 0 && (
        <section className="bg-gray-50 py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#002349] mb-4">
              {isRental
                ? getTranslation('rentalDescription', language)
                : getTranslation('apartmentDescription', language)
              }
            </h2>
            <div className="prose prose-sm sm:prose max-w-none">
              {apartmentDescriptionParagraphs.map((paragraph: string, idx: number) => (
                <p key={idx} className="mb-3 text-gray-700 leading-relaxed">
                  {removeEmojis(paragraph)}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tab Content - Mobile optimized spacing */}
      <section className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            {/* ================================================================ */}
            {/* LÄGENHET (APARTMENT) LAYOUT - Refactored to use ApartmentView */}
            {/* ================================================================ */}
            {isApartment && (
              <ApartmentView
                activeTab={activeTab}
                language={language}
                descriptionParagraphs={apartmentDescriptionParagraphs}
                showAutoTranslationNotice={showAutoTranslationNotice}
                highlights={normalizedHighlights}
                sellingPoints={normalizedSellingPoints}
                agentNotes={agentNotesText}
                additionalMaterials={fastighetAdditionalMaterials}
                apartmentDetailsItems={apartmentDetailsItems}
                buildingFactsItems={apartmentBuildingItems}
                housingCompanyItems={apartmentHousingItems}
                priceItems={priceListItems}
                livingCostItems={livingCostListItems}
                otherCostItems={otherCostListItemsFiltered}
                costSummary={costSummaryTotals}
                zoningText={zoningSummary !== '—' ? zoningSummary : undefined}
                documents={fastighetDocuments}
                notProvidedText={notProvidedText}
              />
            )}
            {/* END LÄGENHET LAYOUT */}

            {/* ================================================================ */}
            {/* FASTIGHET (HOUSE/VILLA) LAYOUT */}
            {/* ================================================================ */}
            {isFastighet && (
              <FastighetView
                activeTab={activeTab}
                language={language}
                descriptionParagraphs={apartmentDescriptionParagraphs}
                showAutoTranslationNotice={showAutoTranslationNotice}
                highlights={normalizedHighlights}
                sellingPoints={normalizedSellingPoints}
                agentNotes={agentNotesText}
                additionalMaterials={fastighetAdditionalMaterials}
                estateItems={fastighetEstateItems}
                rightsText={fastighetRightsText}
                buildingItems={fastighetBuildingItems}
                priceItems={fastighetPriceItems}
                livingCostItems={livingCostListItems}
                otherCostItems={otherCostListItems}
                costSummary={costSummaryTotals}
                documents={fastighetDocuments}
                notProvidedText={notProvidedText}
              />
            )}
            {/* END FASTIGHET LAYOUT */}

            {/* ================================================================ */}
            {/* HYRESOBJEKT (RENTAL) LAYOUT */}
            {/* ================================================================ */}
            {isRental && (
              <RentalView
                activeTab={activeTab}
                language={language}
                descriptionParagraphs={apartmentDescriptionParagraphs}
                apartmentDetailsItems={rentalApartmentDetailsItems}
                rentalInfoItems={rentalInfoItems}
                buildingFactsItems={[]}
                housingCompanyItems={rentalHousingItems}
                rentItems={rentItems}
                additionalCostItems={rentalAdditionalCostItems}
                includedInRentText={includedInRentText}
                documents={fastighetDocuments}
                notProvidedText={notProvidedText}
              />
            )}
            {/* END HYRESOBJEKT LAYOUT */}

          </div>

          {/* Sidebar - Shared by both types */}
          <div className="lg:col-span-1">
            <div className="sticky top-48 space-y-6">
              {/* Contact Agent Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-light mb-4">{getTranslation('contactAgentTitle', language)}</h3>
                {agentData && (
                  <div className="space-y-4">
                    {/* Agent Image - Centered on top */}
                    {(agentData.avatar || agentData.photo?.sourceUrl || agentData.image || agentData.photo) && (
                      <div className="flex justify-center">
                        <Image
                          src={agentData.avatar || agentData.photo?.sourceUrl || agentData.image || agentData.photo}
                          alt={agentData.name || 'Agent'}
                          width={120}
                          height={120}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    {/* Agent Info - Centered below image */}
                    <div className="text-center">
                        <h4 className="font-medium">{agentData.name}</h4>
                      <p className="text-sm text-gray-600">{getTranslation('realEstateAgent', language)}</p>
                    </div>
                    <div className="space-y-2">
                      <a
                        href={`tel:${agentData.tel}`}
                        className="flex items-center gap-3 p-3 bg-[#002349] text-white rounded-lg hover:bg-[#003366] transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{agentData.tel}</span>
                      </a>
                      <a
                        href={`mailto:${agentData.email}`}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{agentData.email}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  {getTranslation('listingDisclaimer', language)}
                </p>
              </div>

              {/* Image Gallery Thumbnail */}
              {images.length > 1 && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {images.slice(0, 6).map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative aspect-square rounded overflow-hidden ${
                          currentImageIndex === idx ? 'ring-2 ring-[#002349]' : ''
                        }`}
                      >
                        <Image
                          src={image.thumbnail || image.url || image}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  {images.length > 6 && (
                    <p className="text-center text-sm text-gray-600 mt-2">
                      +{images.length - 6} kuvaa lisää
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Comparison Notification */}
      {showComparisonNotification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-[#002349] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
            <ScaleIcon className="h-5 w-5" />
            <span>
              {isInComparison 
                ? 'Kohde lisätty vertailuun' 
                : 'Kohde poistettu vertailusta'
              }
            </span>
            <Link 
              href="/vertailu"
              className="underline hover:no-underline ml-2"
            >
              Katso vertailu
            </Link>
          </div>
        </div>
      )}
      
      {/* Floating Comparison Bar */}
      {(() => {
        const comparisonProperties = typeof window !== 'undefined' 
          ? JSON.parse(localStorage.getItem('comparisonProperties') || '[]')
          : [];
        if (comparisonProperties.length > 0) {
          return (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transform transition-transform duration-300">
              <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <ScaleIcon className="h-5 w-5 text-[#002349]" />
                      <span className="font-medium text-sm sm:text-base">
                        {comparisonProperties.length} kohdetta
                      </span>
                    </div>
                    <div className="hidden md:flex gap-2">
                      {comparisonProperties.slice(0, 3).map((p: any) => (
                        <div key={p.id} className="text-sm text-gray-600">
                          {p.marketingTitle}
                        </div>
                      ))}
                      {comparisonProperties.length > 3 && (
                        <span className="text-sm text-gray-500">
                          +{comparisonProperties.length - 3} muuta
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href="/vertailu"
                      className="flex-1 sm:flex-none bg-[#002349] text-white px-4 py-2.5 rounded-lg hover:bg-[#003366] transition-colors text-center text-sm sm:text-base"
                    >
                      Vertaile
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('comparisonProperties');
                        window.dispatchEvent(new CustomEvent('comparisonUpdate'));
                        setIsInComparison(false);
                      }}
                      className="text-gray-600 hover:text-gray-800 px-3 py-2.5 text-sm sm:text-base"
                    >
                      Tyhjennä
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
}
