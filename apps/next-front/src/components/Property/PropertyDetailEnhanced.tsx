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

/**
 * Simple synchronous translation for common real estate terms
 */
function quickTranslate(text: string, targetLang: SupportedLanguage): string {
  if (!text || targetLang === 'fi') return text;
  
  // Common Finnish → Swedish/English terms
  const terms: Record<string, { sv: string; en: string }> = {
    // Property types
    'asunto': { sv: 'lägenhet', en: 'apartment' },
    'huoneisto': { sv: 'lägenhet', en: 'apartment' },
    'kattohuoneisto': { sv: 'takvåning', en: 'penthouse' },
    'perheasunto': { sv: 'familjelägenhet', en: 'family apartment' },
    'koti': { sv: 'hem', en: 'home' },
    'talo': { sv: 'hus', en: 'house' },
    'omakotitalo': { sv: 'villa', en: 'detached house' },
    'rivitalo': { sv: 'radhus', en: 'townhouse' },
    'kerrostalo': { sv: 'flerbostadshus', en: 'apartment building' },
    
    // Rooms & spaces
    'keittiö': { sv: 'kök', en: 'kitchen' },
    'makuuhuone': { sv: 'sovrum', en: 'bedroom' },
    'olohuone': { sv: 'vardagsrum', en: 'living room' },
    'ruokasali': { sv: 'matsal', en: 'dining room' },
    'kylpyhuone': { sv: 'badrum', en: 'bathroom' },
    'sauna': { sv: 'bastu', en: 'sauna' },
    'parveke': { sv: 'balkong', en: 'balcony' },
    'terassi': { sv: 'terrass', en: 'terrace' },
    'takkahuone': { sv: 'rum med öppen spis', en: 'fireplace room' },
    'työhuone': { sv: 'arbetsrum', en: 'office' },
    'viherhuone': { sv: 'växthus', en: 'conservatory' },
    'aula': { sv: 'hall', en: 'hallway' },
    
    // Building features
    'hissi': { sv: 'hiss', en: 'elevator' },
    'kerros': { sv: 'våning', en: 'floor' },
    'huonekorkeus': { sv: 'takhöjd', en: 'ceiling height' },
    'piha': { sv: 'gård', en: 'yard' },
    'autohalli': { sv: 'garage', en: 'garage' },
    'autopaikka': { sv: 'parkeringsplats', en: 'parking space' },
    'porrashuone': { sv: 'trapphus', en: 'stairwell' },
    'taloyhtiö': { sv: 'bostadsrättsförening', en: 'housing company' },
    
    // Descriptive terms
    'valoisa': { sv: 'ljus', en: 'bright' },
    'tilava': { sv: 'rymlig', en: 'spacious' },
    'avara': { sv: 'rymlig', en: 'spacious' },
    'väljä': { sv: 'rymlig', en: 'spacious' },
    'moderni': { sv: 'modern', en: 'modern' },
    'kaunis': { sv: 'vacker', en: 'beautiful' },
    'upea': { sv: 'underbar', en: 'wonderful' },
    'ylellinen': { sv: 'lyxig', en: 'luxurious' },
    'laadukas': { sv: 'högkvalitativ', en: 'high-quality' },
    'loistava': { sv: 'fantastisk', en: 'great' },
    'erinomainen': { sv: 'utmärkt', en: 'excellent' },
    'näyttävä': { sv: 'imponerande', en: 'impressive' },
    'viihtyisä': { sv: 'trivsam', en: 'cozy' },
    'rauhallinen': { sv: 'lugn', en: 'peaceful' },
    'keskeinen': { sv: 'central', en: 'central' },
    'uniikki': { sv: 'unik', en: 'unique' },
    'ainutlaatuinen': { sv: 'unik', en: 'unique' },
    'poikkeuksellinen': { sv: 'exceptionell', en: 'exceptional' },
    
    // Common words
    'vuonna': { sv: 'år', en: 'in' },
    'valmistunut': { sv: 'byggd', en: 'built' },
    'rakennettu': { sv: 'byggd', en: 'built' },
    'uusi': { sv: 'ny', en: 'new' },
    'vanha': { sv: 'gammal', en: 'old' },
    'suuri': { sv: 'stor', en: 'large' },
    'pieni': { sv: 'liten', en: 'small' },
    'sydämessä': { sv: 'hjärtat', en: 'heart' },
    'läheisyydessä': { sv: 'närhet', en: 'vicinity' },
    'tuntumassa': { sv: 'närhet', en: 'proximity' },
    
    // Location & amenities
    'sijainti': { sv: 'läge', en: 'location' },
    'keskusta': { sv: 'centrum', en: 'city center' },
    'palvelut': { sv: 'service', en: 'amenities' },
    'liikenneyhteydet': { sv: 'trafikförbindelser', en: 'transport connections' },
    'kaupat': { sv: 'affärer', en: 'shops' },
    'koulu': { sv: 'skola', en: 'school' },
    'meri': { sv: 'havet', en: 'sea' },
    'puisto': { sv: 'park', en: 'park' },
    
    // Actions & features
    'tarjoaa': { sv: 'erbjuder', en: 'offers' },
    'mahdollistaa': { sv: 'möjliggör', en: 'enables' },
    'toimii': { sv: 'fungerar', en: 'works' },
    'sijaitsee': { sv: 'ligger', en: 'is located' },
    'palvelee': { sv: 'betjänar', en: 'serves' },
    
    // Materials & features
    'materiaali': { sv: 'material', en: 'material' },
    'ikkunat': { sv: 'fönster', en: 'windows' },
    'lattia': { sv: 'golv', en: 'floor' },
    'seinä': { sv: 'vägg', en: 'wall' },
    'katto': { sv: 'tak', en: 'ceiling/roof' },
    'takka': { sv: 'öppen spis', en: 'fireplace' },
    'ilmanvaihto': { sv: 'ventilation', en: 'ventilation' },
    'lämmitys': { sv: 'uppvärmning', en: 'heating' },
  };
  
  let translated = text;
  for (const [fi, translations] of Object.entries(terms)) {
    const target = targetLang === 'sv' ? translations.sv : translations.en;
    const regex = new RegExp(`\\b${fi}\\b`, 'gi');
    translated = translated.replace(regex, (match) => {
      // Preserve capitalization
      if (match[0] === match[0].toUpperCase()) {
        return target.charAt(0).toUpperCase() + target.slice(1);
      }
      return target;
    });
  }
  
  return translated;
}

/**
 * Helper function to extract localized string based on current language
 * Handles both LocalizedString objects and plain strings
 * Automatically translates if target language is missing
 */
function getLocalizedText(value: any, language: SupportedLanguage): string {
  if (!value) return '';
  
  // If it's already a string, it's probably Finnish - translate common terms
  if (typeof value === 'string') {
    return quickTranslate(value, language);
  }
  
  // If it's a LocalizedString object, extract the correct language
  if (typeof value === 'object') {
    // Try to get the requested language
    if (value[language]) {
      return value[language];
    }
    
    // If Swedish/English is missing but Finnish exists, translate it
    if (value.fi) {
      return quickTranslate(value.fi, language);
    }
    
    // Fallback to any available language and translate
    const fallbackText = value.en || value.sv || '';
    if (fallbackText) {
      // Assume it's in one of the other languages, return as-is
      return fallbackText;
    }
  }
  
  return '';
}

/**
 * Get energy certificate message based on status
 * For properties/houses only (not apartments)
 */
function getEnergyCertificateMessage(status: string | undefined, language: SupportedLanguage): string {
  if (!status) return '';
  
  const messages: Record<string, { fi: string; sv: string; en: string }> = {
    'Ei lain edellyttämää energiatodistusta': {
      fi: 'Ei lain edellyttämää energiatodistusta',
      sv: 'Inte lagstadgad energicertifikat',
      en: 'Not legally required energy certificate'
    },
    'Kohteella ei energiatodistuslain nojalla tarvitse olla energiatodistusta': {
      fi: 'Kohteella ei energiatodistuslain nojalla tarvitse olla energiatodistusta',
      sv: 'Objektet behöver inte ha energicertifikat enligt lagen',
      en: 'Property does not require an energy certificate by law'
    }
  };
  
  // Check if status matches one of the known messages
  if (messages[status]) {
    return messages[status][language];
  }
  
  // If status is "Kyllä" or unknown, return empty (will show link or placeholder)
  return '';
}

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
  
  // LÄGENHET (Apartment) identification:
  // 1. Has housing company debt (debtFreePrice !== askPrice)
  // 2. Has housingCompanyName
  // 3. Address contains "katu" or "gatan" (city street)
  // 4. typeOfApartment contains apartment format like "2h+k" or "3h, k, kph"
  // 5. NOT a rental
  const isApartment = !isRental && (
    hasCompanyDebt || 
    hasHousingCompany || 
    /katu|gatan|street/i.test(addressStr) ||
    /^\d+[-h,\s]+[hk]/i.test(typeOfApartmentStr.trim()) // Matches "2h+k", "3h, k", "5-6h, k" etc
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
  // ============================================================================
  const apartmentTabs = [
    { id: 'overview', label: 'Yleiskatsaus' },
    { id: 'details', label: 'Huoneistotiedot' },
    { id: 'building', label: 'Rakennus & Yhtiö' },
    { id: 'costs', label: 'Kustannukset' },
    { id: 'location', label: 'Sijainti & Palvelut' },
    { id: 'documents', label: 'Asiakirjat & Linkit' }
  ];
  
  const fastighetTabs = [
    { id: 'overview', label: 'Yleiskatsaus' },
    { id: 'property-details', label: 'Kiinteistötiedot' },
    { id: 'building', label: 'Rakennustiedot' },
    { id: 'costs', label: 'Kustannukset' },
    { id: 'location', label: 'Sijainti' },
    { id: 'documents', label: 'Asiakirjat' }
  ];
  
  const rentalTabs = [
    { id: 'overview', label: 'Yleiskatsaus' },
    { id: 'details', label: 'Huoneistotiedot' },
    { id: 'rental-period', label: 'Vuokra-aika' },
    { id: 'building', label: 'Rakennus & Yhtiö' },
    { id: 'costs', label: 'Kustannukset' },
    { id: 'location', label: 'Sijainti' },
    { id: 'documents', label: 'Asiakirjat' }
  ];
  
  // Use different tabs based on property type
  const tabs = isRental ? rentalTabs : (isApartment ? apartmentTabs : fastighetTabs);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DEBUG: Property Type Indicator - Remove in production */}
      <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg p-3 border-2" style={{
        borderColor: isRental ? '#FF9800' : (isApartment ? '#4CAF50' : '#2196F3')
      }}>
        <div className="text-xs font-bold mb-1">
          {isRental ? '🔑 HYRESOBJEKT' : (isApartment ? '🏢 LÄGENHET' : '🏠 FASTIGHET')}
        </div>
        <div className="text-xs text-gray-600">
          {address}
        </div>
      </div>
      {/* Hero Section with Image Carousel */}
      <section className="relative h-[70vh] bg-black">
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
              
              {/* Gallery Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                {getVirtualTourInfo() && (
                  <button
                    onClick={() => setShowVirtualTour(true)}
                    className="bg-white/80 hover:bg-white p-2 rounded-lg shadow-md transition-all flex items-center gap-2"
                    title="Virtuaalikierros"
                  >
                    <CubeIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">360° Kierros</span>
                  </button>
                )}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="bg-white/80 hover:bg-white p-2 rounded-lg shadow-md transition-all"
                  title="Koko näyttö"
                >
                  <ArrowsPointingOutIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Image Navigation */}
            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
              <button
                onClick={prevImage}
                className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all pointer-events-auto"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all pointer-events-auto"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
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

      {/* Property Header */}
      <section className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <Heading as="h1">
                {removeEmojis(
                  getLocalizedText(heading, language) || 
                  getLocalizedText(marketingTitle, language) || 
                  getLocalizedText(freeTextTitle, language) || 
                  address || ''
                )}
              </Heading>
              {marketingSubtitle && (
                <p className="text-xl text-gray-700 mt-2 font-light">
                  {removeEmojis(getLocalizedText(marketingSubtitle, language))}
                </p>
              )}
              <p className="text-lg text-gray-600 mt-1">
                {removeEmojis(address || '')} • {postalCode} {city} {province && `, ${province}`}
              </p>
              <div className="flex items-center gap-3 mt-3">
                {typeOfApartment && <PropertyTypeChip type={removeEmojis(typeOfApartment)} />}
                <MetaRow 
                  items={[
                    { value: area ? (String(area).includes('m²') || String(area).includes('m2') ? area : `${area} m²`) : '' },
                    { label: 'Rakennettu', value: yearBuilt || '' }
                  ]}
                />
              </div>
            </div>
            <div className="text-right">
              <Price className="text-3xl lg:text-4xl whitespace-nowrap" block>
                {askPrice ? `${parseInt(askPrice).toLocaleString('fi-FI')} €` : 'Kysy hintaa'}
              </Price>
              {area && askPrice && (
                <div className="text-sm text-gray-600 mt-1">
                  {Math.round(parseInt(askPrice) / parseInt(area)).toLocaleString('fi-FI')} €/m²
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4">
              <button
                onClick={handleSaveProperty}
                className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors touch-manipulation"
                title={isSaved ? "Poista tallennetuista" : "Tallenna kohde"}
              >
                {isSaved ? (
                  <HeartIconSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                )}
                <span className="text-sm hidden sm:inline">{isSaved ? "Tallennettu" : "Tallenna"}</span>
              </button>
              
              <button
                onClick={handleComparisonToggle}
                className={`flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-lg border transition-colors touch-manipulation ${
                  isInComparison 
                    ? 'border-[#002349] bg-[#002349] text-white' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                title={isInComparison ? "Poista vertailusta" : "Lisää vertailuun"}
              >
                <ScaleIcon className={`h-5 w-5 ${isInComparison ? 'text-white' : 'text-gray-600'}`} />
                <span className="text-sm hidden sm:inline">{isInComparison ? "Vertailussa" : "Vertaile"}</span>
              </button>
              
              <div className="relative share-menu-container">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors touch-manipulation"
                >
                  <ShareIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm hidden sm:inline">Jaa</span>
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
                className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors touch-manipulation"
              >
                <PrinterIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm hidden sm:inline">Tulosta</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b sticky top-0 md:top-[104px] z-30">
        <div className="container mx-auto px-0 md:px-4">
          <div className="relative">
            <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-4 border-b-2 transition-all whitespace-nowrap snap-start min-w-fit ${
                    activeTab === tab.id
                      ? 'border-[#002349] text-[#002349] font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="text-sm md:text-base">{tab.label}</span>
                </button>
              ))}
            </div>
            {/* Scroll indicators for mobile */}
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white via-white to-transparent pointer-events-none md:hidden" />
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* ================================================================ */}
            {/* LÄGENHET (APARTMENT) LAYOUT - Customer approved design */}
            {/* ================================================================ */}
            {isApartment && (
              <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Main Description */}
                {(marketingDescription || freeText || description) && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-light mb-4">{getTranslation('presentationText', language)}</h2>
                    {language !== 'fi' && typeof (freeText || description) === 'string' && (
                      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-700">
                        <p className="font-medium">
                          {language === 'sv' ? '📝 Automatisk översättning' : '📝 Automatic translation'}
                        </p>
                        <p className="text-xs mt-1">
                          {language === 'sv' 
                            ? 'Vissa termer har översatts automatiskt från finska. Kontakta mäklaren för fullständig översättning.'
                            : 'Some terms have been automatically translated from Finnish. Contact the agent for a complete translation.'}
                        </p>
                      </div>
                    )}
                    <div className="prose prose-gray max-w-none">
                      {removeEmojis(
                        getLocalizedText(marketingDescription, language) || 
                        getLocalizedText(freeText, language) || 
                        getLocalizedText(description, language) || ''
                      ).split('\n').map((paragraph: string, idx: number) => (
                        <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    
                    {/* Marketing Highlights */}
                    {marketingHighlights && marketingHighlights.length > 0 && (
                      <div className="mt-8 border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">{getTranslation('highlights', language)}</h3>
                        <ul className="space-y-2">
                          {marketingHighlights.map((highlight: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-[#002349] mt-1">•</span>
                              <span className="text-gray-700">{removeEmojis(highlight)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Marketing Selling Points */}
                    {marketingSellingPoints && marketingSellingPoints.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">{getTranslation('sellingPoints', language)}</h3>
                        <div className="grid gap-2">
                          {marketingSellingPoints.map((point: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">{removeEmojis(point)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Agent Notes */}
                    {marketingAgentNotes && (
                      <div className="mt-8 p-4 bg-[#002349]/5 rounded-lg border-l-4 border-[#002349]">
                        <p className="text-gray-700 italic">{removeEmojis(marketingAgentNotes)}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* External Links */}
                {(externalLinks?.length > 0 || videoUrl || virtualShowing) && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">{getTranslation('additionalMaterials', language)}</h3>
                    <div className="grid gap-3">
                      {virtualShowing && (
                        <a
                          href={virtualShowing}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-medium">{getTranslation('virtualTour', language)}</span>
                          </span>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {videoUrl && (
                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-medium">Video</span>
                          </span>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {externalLinks?.map((link: {url: string; label: string}, idx: number) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-medium">{removeEmojis(link.label)}</span>
                          </span>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-8">
                {/* Room Details - Commented out per customer request
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-light mb-6">Huonetiedot</h3>
                  <div className="space-y-6">
                    {livingRoomDescription && (
                      <div className="border-l-4 border-gray-200 pl-4">
                        <h4 className="font-medium mb-2">Olohuone</h4>
                        <p className="text-gray-700">{livingRoomDescription}</p>
                        {(livingRoomFloorMaterial || livingRoomWallMaterial) && (
                          <div className="mt-2 text-sm text-gray-600">
                            {livingRoomFloorMaterial && <span>Lattia: {livingRoomFloorMaterial}</span>}
                            {livingRoomFloorMaterial && livingRoomWallMaterial && <span> | </span>}
                            {livingRoomWallMaterial && <span>Seinät: {livingRoomWallMaterial}</span>}
                          </div>
                        )}
                      </div>
                    )}
                    // Commented out remaining room details
                    /*
                    {kitchenDescription && (
                      <div className="border-l-4 border-gray-200 pl-4">
                        <h4 className="font-medium mb-2">Keittiö</h4>
                        <p className="text-gray-700">{kitchenDescription}</p>
                        {kitchenEquipment && (
                          <p className="text-sm text-gray-600 mt-2">Varusteet: {kitchenEquipment}</p>
                        )}
                        {(kitchenFloorMaterial || kitchenWallMaterial) && (
                          <div className="mt-2 text-sm text-gray-600">
                            {kitchenFloorMaterial && <span>Lattia: {kitchenFloorMaterial}</span>}
                            {kitchenFloorMaterial && kitchenWallMaterial && <span> | </span>}
                            {kitchenWallMaterial && <span>Seinät: {kitchenWallMaterial}</span>}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {bedroomDescription && (
                      <div className="border-l-4 border-gray-200 pl-4">
                        <h4 className="font-medium mb-2">Makuuhuoneet ({bedroomCount || '?'} kpl)</h4>
                        <p className="text-gray-700">{bedroomDescription}</p>
                        {(bedroomFloorMaterial || bedroomWallMaterial) && (
                          <div className="mt-2 text-sm text-gray-600">
                            {bedroomFloorMaterial && <span>Lattia: {bedroomFloorMaterial}</span>}
                            {bedroomFloorMaterial && bedroomWallMaterial && <span> | </span>}
                            {bedroomWallMaterial && <span>Seinät: {bedroomWallMaterial}</span>}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {bathroomDescription && (
                      <div className="border-l-4 border-gray-200 pl-4">
                        <h4 className="font-medium mb-2">Kylpyhuone</h4>
                        <p className="text-gray-700">{bathroomDescription}</p>
                        {bathroomEquipment && (
                          <p className="text-sm text-gray-600 mt-2">Varusteet: {bathroomEquipment}</p>
                        )}
                        {(bathroomFloorMaterial || bathroomWallMaterial) && (
                          <div className="mt-2 text-sm text-gray-600">
                            {bathroomFloorMaterial && <span>Lattia: {bathroomFloorMaterial}</span>}
                            {bathroomFloorMaterial && bathroomWallMaterial && <span> | </span>}
                            {bathroomWallMaterial && <span>Seinät: {bathroomWallMaterial}</span>}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {saunaDescription && (
                      <div className="border-l-4 border-gray-200 pl-4">
                        <h4 className="font-medium mb-2">Sauna</h4>
                        <p className="text-gray-700">{saunaDescription}</p>
                        {saunaStoveType && (
                          <p className="text-sm text-gray-600 mt-2">Kiuas: {saunaStoveType}</p>
                        )}
                        {(saunaFloorMaterial || saunaWallMaterial) && (
                          <div className="mt-2 text-sm text-gray-600">
                            {saunaFloorMaterial && <span>Lattia: {saunaFloorMaterial}</span>}
                            {saunaFloorMaterial && saunaWallMaterial && <span> | </span>}
                            {saunaWallMaterial && <span>Seinät: {saunaWallMaterial}</span>}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {wcDescription && wcCount && parseInt(wcCount) > 0 && (
                      <div className="border-l-4 border-gray-200 pl-4">
                        <h4 className="font-medium mb-2">WC ({wcCount} kpl)</h4>
                        <p className="text-gray-700">{wcDescription}</p>
                      </div>
                    )}
                  </div>
                </div>
                */}

                {/* Balcony and Sauna - Only show if they exist */}
                {(balcony === 'Kyllä' || sauna === 'Kyllä') && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Huoneistotiedot</h3>
                    <div className="space-y-4">
                      {balcony === 'Kyllä' && (
                      <div>
                          <h4 className="font-medium mb-2">Parveke</h4>
                          {balconyArea && (
                            <p className="text-gray-700">Pinta-ala: {balconyArea}</p>
                          )}
                      </div>
                    )}
                      {sauna === 'Kyllä' && (
                      <div>
                          <h4 className="font-medium mb-2">Sauna</h4>
                          {saunaDescription && (
                            <p className="text-gray-700">{saunaDescription}</p>
                          )}
                          {saunaStoveType && (
                            <p className="text-gray-700">Kiuas: {saunaStoveType}</p>
                          )}
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Vapautuminen */}
                {release && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Vapautuminen</h3>
                    <p className="text-gray-700">{release}</p>
                  </div>
                )}
              </div>
            )}

            {/* Building & Company Tab */}
            {activeTab === 'building' && (
              <div className="space-y-8">
                {/* Building Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-light mb-4">Rakennustiedot</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {constructionYear && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rakennusvuosi:</span>
                          <span className="font-medium">{constructionYear}</span>
                        </div>
                      )}
                      {energyClass && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Energialuokka:</span>
                          <span className="font-medium">{energyClass}</span>
                        </div>
                      )}
                      {heatingSystem && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lämmitysjärjestelmä:</span>
                          <span className="font-medium">{heatingSystem}</span>
                        </div>
                      )}
                      {floorCount && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Kerroksia:</span>
                          <span className="font-medium">{floorCount}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {propertyData?.siteOwnershipType && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tontin omistus:</span>
                          <span className="font-medium">{getLocalizedText(propertyData.siteOwnershipType, language)}</span>
                        </div>
                      )}
                      {propertyData?.ownershipType && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Omistusmuoto:</span>
                          <span className="font-medium">{getLocalizedText(propertyData.ownershipType, language)}</span>
                        </div>
                      )}
                      {propertyData?.housingTenure && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hallintamuoto:</span>
                          <span className="font-medium">{getLocalizedText(propertyData.housingTenure, language)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Housing Company */}
                {housingCooperativeName && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Taloyhtiön tiedot</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">{housingCooperativeName}</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={housingCooperativeElevator === 'Kyllä' ? 'text-green-600' : 'text-gray-400'}>
                              {housingCooperativeElevator === 'Kyllä' ? '✓' : '✗'}
                            </span>
                            <span>Hissi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={housingCooperativeSauna === 'Kyllä' ? 'text-green-600' : 'text-gray-400'}>
                              {housingCooperativeSauna === 'Kyllä' ? '✓' : '✗'}
                            </span>
                            <span>Taloyhtiön sauna</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {propertyData?.taloyhtionLainat && (
                            <div>
                              <span className="text-gray-600">Taloyhtiön lainat:</span>
                              <p className="font-medium">{propertyData.taloyhtionLainat}</p>
                            </div>
                          )}
                        {housingCooperativeMortgage && (
                          <div>
                              <span className="text-gray-600">Taloyhtiön kiinnitykset:</span>
                            <p className="font-medium">{housingCooperativeMortgage}</p>
                          </div>
                        )}
                      </div>
                    </div>
                        </div>
                  </div>
                )}
              </div>
            )}

            {/* Costs Tab */}
            {activeTab === 'costs' && (
              <div className="space-y-8">
                {/* Price Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-light mb-4">Hintatiedot</h3>
                  <div className="space-y-3">
                    {debtFreePrice && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Velaton hinta</span>
                        <span className="text-xl font-medium">{parseInt(debtFreePrice).toLocaleString('fi-FI')} €</span>
                      </div>
                    )}
                    {askPrice && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Myyntihinta</span>
                        <span className="text-xl font-medium">{parseInt(askPrice).toLocaleString('fi-FI')} €</span>
                      </div>
                    )}
                    {area && askPrice && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Neliöhinta</span>
                        <span className="font-medium">
                          {Math.round(parseInt(askPrice) / parseInt(area)).toLocaleString('fi-FI')} €/m²
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Monthly Costs */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-light mb-4">Asumiskustannukset</h3>
                  <div className="space-y-3">
                    {maintenanceCharge && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Hoitovastike</span>
                        <span className="font-medium">{maintenanceCharge}</span>
                      </div>
                    )}
                    {waterCharge && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Vesimaksu</span>
                        <span className="font-medium">{waterCharge}</span>
                      </div>
                    )}
                    {heatingCharge && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Lämmityskustannukset</span>
                        <span className="font-medium">{heatingCharge}</span>
                      </div>
                    )}
                    {electricHeatingCharge && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Sähkölämmitys</span>
                        <span className="font-medium">{electricHeatingCharge}</span>
                      </div>
                    )}
                    {otherCharge && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Muut maksut</span>
                        <span className="font-medium">{otherCharge}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Costs */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-light mb-4">Muut kustannukset</h3>
                  <div className="space-y-3">
                    {propertyTax && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Kiinteistövero</span>
                        <span className="font-medium">{propertyTax}</span>
                      </div>
                    )}
                    {cableCharge && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Kaapeli-TV</span>
                        <span className="font-medium">{cableCharge}</span>
                      </div>
                    )}
                    {internetCharge && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Internet</span>
                        <span className="font-medium">{internetCharge}</span>
                      </div>
                    )}
                    {insuranceRequired && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Vakuutus vaaditaan</span>
                        <span className="font-medium">{insuranceRequired}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Costs Summary */}
                {(monthlyTotalCost || yearlyTotalCost) && (
                  <div className="bg-[#002349] text-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Yhteenveto kustannuksista</h3>
                    <div className="space-y-3">
                      {monthlyTotalCost && (
                        <div className="flex justify-between items-center py-2 border-b border-white/20">
                          <span className="text-white/80">Kuukausikustannukset yhteensä</span>
                          <span className="font-medium text-xl">{monthlyTotalCost} €/kk</span>
                        </div>
                      )}
                      {yearlyTotalCost && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-white/80">Vuosikustannukset yhteensä</span>
                          <span className="font-medium text-xl">{yearlyTotalCost} €/v</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Location Tab */}
            {activeTab === 'location' && (
              <div className="space-y-8">
                {/* Location Details */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-light mb-4">Sijainti</h3>
                  <div className="space-y-4">
                    {marketingLocationDescription && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">{marketingLocationDescription}</p>
                      </div>
                    )}
                    {(address || city) && (
                      <div>
                        <h4 className="font-medium mb-2">Osoite</h4>
                        <p className="text-gray-700">
                          {address}<br />
                          {postalCode} {city}<br />
                          {province && `${province}, `}{country}
                        </p>
                      </div>
                    )}
                    </div>
                  </div>

                {/* Parking */}
                {(parkingFree || parkingPaid || parking) && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Pysäköinti</h3>
                    <div className="space-y-3">
                      {parkingFree && (
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Ilmainen pysäköinti</span>
                        </div>
                      )}
                      {parkingPaid && (
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600"></span>
                          <span>Maksullinen pysäköinti</span>
                        </div>
                      )}
                      {parking && (
                        <div>
                          <h4 className="font-medium mb-2">Pysäköintitiedot</h4>
                          <p className="text-gray-700">{parking}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Nearby Buildings & Location Type */}
                {(locationCenterCity || locationUrbanArea || locationSuburban || locationRural || nearbyBuildings) && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Sijainti</h3>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {locationCenterCity && (
                          <span className="px-3 py-1 bg-[#002349] text-white rounded-full text-sm">Keskustassa</span>
                        )}
                        {locationUrbanArea && (
                          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">Kaupunkialueella</span>
                        )}
                        {locationSuburban && (
                          <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">Esikaupunkialueella</span>
                        )}
                        {locationRural && (
                          <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm">Maaseudulla</span>
                        )}
                      </div>
                      {nearbyBuildings && (
                        <div>
                          <h4 className="font-medium mb-2">Lähirakennukset</h4>
                          <p className="text-gray-700">{nearbyBuildings}</p>
                        </div>
                      )}
                      {neighborsSurrounding && (
                        <div>
                          <h4 className="font-medium mb-2">Naapurit</h4>
                          <p className="text-gray-700">{neighborsSurrounding}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Zoning */}
                {(zoningStatus || zoningInfo) && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Kaavoitus</h3>
                    <div className="space-y-3">
                    {zoningStatus && (
                      <p className="font-medium mb-2">{zoningStatus}</p>
                    )}
                    {zoningInfo && (
                      <div className="prose prose-sm max-w-none text-gray-700">
                        {zoningInfo.split('\n').map((paragraph: string, idx: number) => (
                          <p key={idx} className="mb-2">{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </div>
              </div>
            )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-8">
                {/* Property Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-light mb-4">Kiinteistötiedot</h3>
                  <div className="space-y-3">
                    {propertyIdentifier && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kiinteistötunnus:</span>
                        <span className="font-medium">{propertyIdentifier}</span>
                      </div>
                    )}
                    {lotArea && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tontin pinta-ala:</span>
                        <span className="font-medium">{lotArea}</span>
                      </div>
                    )}
                    {propertyData?.siteOwnershipType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tontin omistus:</span>
                        <span className="font-medium">{getLocalizedText(propertyData.siteOwnershipType, language)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Management */}
                {(propertyManagerName || propertyManagerOffice) && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Isännöinti</h3>
                    <div className="space-y-2">
                      {propertyManagerName && <p className="font-medium">{propertyManagerName}</p>}
                      {propertyManagerOffice && <p>{propertyManagerOffice}</p>}
                      {propertyManagerPhone && <p>Puh: {propertyManagerPhone}</p>}
                      {propertyManagerEmail && <p>Email: {propertyManagerEmail}</p>}
                    </div>
                  </div>
                )}

                {/* Condition Reports */}
                {(condition || asbestosSurvey || asbestosSurveyInfo) && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Kuntotiedot</h3>
                    <div className="space-y-4">
                      {condition && (
                        <div>
                          <span className="text-gray-600">Yleiskunto:</span>
                          <span className="ml-2 font-medium">{condition}</span>
                        </div>
                      )}
                      {asbestosSurvey && (
                        <div>
                          <span className="text-gray-600">Asbestikartoitus:</span>
                          <span className="ml-2 font-medium">{asbestosSurvey}</span>
                          {asbestosSurveyInfo && (
                            <p className="mt-2 text-sm text-gray-700">{asbestosSurveyInfo}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {(dealIncludes || dealDoesNotInclude || release) && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Lisätiedot</h3>
                    <div className="space-y-4">
                      {dealIncludes && (
                        <div>
                          <h4 className="font-medium mb-1">Kauppaan kuuluu</h4>
                          <p className="text-gray-700">{dealIncludes}</p>
                        </div>
                      )}
                      {dealDoesNotInclude && (
                        <div>
                          <h4 className="font-medium mb-1">Kauppaan ei kuulu</h4>
                          <p className="text-gray-700">{dealDoesNotInclude}</p>
                        </div>
                      )}
                      {release && (
                        <div>
                          <h4 className="font-medium mb-1">Vapautuminen</h4>
                          <p className="text-gray-700">{release}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Property Documents */}
                {(floorPlanUrl || energyCertificateUrl || propertyPlanUrl || buildingPermitUrl || maintenancePlanUrl || asbestosSurveyReport) && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Asiakirjat</h3>
                    <div className="space-y-3">
                      {floorPlanUrl && (
                        <a
                          href={floorPlanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl"></span>
                          <span className="text-gray-700">Pohjapiirros</span>
                        </a>
                      )}
                      {energyCertificateUrl && (
                        <a
                          href={energyCertificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl">⚡</span>
                          <span className="text-gray-700">Energiatodistus</span>
                        </a>
                      )}
                      {propertyPlanUrl && (
                        <a
                          href={propertyPlanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl"></span>
                          <span className="text-gray-700">Tonttijako</span>
                        </a>
                      )}
                      {buildingPermitUrl && (
                        <a
                          href={buildingPermitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl"></span>
                          <span className="text-gray-700">Rakennuslupa</span>
                        </a>
                      )}
                      {maintenancePlanUrl && (
                        <a
                          href={maintenancePlanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl"></span>
                          <span className="text-gray-700">Huoltosuunnitelma</span>
                        </a>
                      )}
                      {asbestosSurveyReport && (
                        <a
                          href={asbestosSurveyReport}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl"></span>
                          <span className="text-gray-700">Asbestikartoitusraportti</span>
                        </a>
                      )}
                      {conditionReport && (
                        <a
                          href={conditionReport}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl">🔍</span>
                          <span className="text-gray-700">Kuntotarkastusraportti</span>
                        </a>
                      )}
                      {moistureReport && (
                        <a
                          href={moistureReport}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl">💧</span>
                          <span className="text-gray-700">Kosteusmittausraportti</span>
                        </a>
                      )}
                      {drivingInstructions && (
                        <a
                          href={drivingInstructions}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl"></span>
                          <span className="text-gray-700">Ajo-ohjeet</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Media Section */}
                <DetailMedia
                  youtubeUrl={youtubeUrl}
                  virtualTourUrl={virtualShowing}
                  brochureUrl={propertyBrochureUrl || virtualShowing}
                  floorPlanUrl={floorPlanUrl}
                  className="mb-8"
                />

                {/* External Links */}
                {externalLinks && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-light mb-4">Lisälinkit</h3>
                    <div className="space-y-3">
                      {externalLinks.split('\n').map((link: string, idx: number) => (
                        <a
                          key={idx}
                          href={link.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl"></span>
                          <span className="text-gray-700">Lisätiedot {idx + 1}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
              </>
            )}
            {/* END LÄGENHET LAYOUT */}

            {/* ================================================================ */}
            {/* FASTIGHET (HOUSE/VILLA) LAYOUT - Awaiting customer requirements */}
            {/* ================================================================ */}
            {/* FASTIGHET (HOUSE/VILLA) LAYOUT */}
            {/* ================================================================ */}
            {isFastighet && (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Description */}
                    {(marketingDescription || freeText || description) && (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        {language !== 'fi' && typeof (freeText || description) === 'string' && (
                          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-700">
                            <p className="font-medium">
                              {language === 'sv' ? '📝 Automatisk översättning' : '📝 Automatic translation'}
                            </p>
                            <p className="text-xs mt-1">
                              {language === 'sv' 
                                ? 'Vissa termer har översatts automatiskt från finska. Kontakta mäklaren för fullständig översättning.'
                                : 'Some terms have been automatically translated from Finnish. Contact the agent for a complete translation.'}
                            </p>
          </div>
                        )}
                        <div className="prose prose-lg max-w-none text-gray-700">
                          {removeEmojis(
                            getLocalizedText(marketingDescription, language) || 
                            getLocalizedText(freeText, language) || 
                            getLocalizedText(description, language) || ''
                          ).split('\n').map((paragraph: string, idx: number) => (
                            <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
                              {paragraph}
                            </p>
                          ))}
          </div>
                      </div>
                    )}

                    {/* Additional Materials & Links */}
                    {(videoUrl || externalLinks?.length > 0 || propertyData?.virtualTourUrl) && (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-light mb-4">Lisämateriaali</h3>
                        <div className="space-y-3">
                          {videoUrl && (
                            <a
                              href={videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-700">Video</span>
                            </a>
                          )}
                          {propertyData?.virtualTourUrl && (
                            <a
                              href={propertyData.virtualTourUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-700">Virtuaaliesittely</span>
                            </a>
                          )}
                          {externalLinks && externalLinks.length > 0 && externalLinks.map((link: any, idx: number) => (
                            <a
                              key={idx}
                              href={link.url || link.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-700">{link.label}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'property-details' && (
                  <div className="space-y-8">
                    {/* Property Information (Kiinteistötiedot) */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-xl font-light mb-4">Kiinteistötiedot</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          {propertyData?.propertyIdentifier && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Kiinteistötunnus:</span>
                              <span className="font-medium">{propertyData.propertyIdentifier}</span>
                            </div>
                          )}
                          {lotArea && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Kiinteistön koko:</span>
                              <span className="font-medium">{parseFloat(lotArea.toString().replace(/[^\d.]/g, '')).toLocaleString('fi-FI', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} m²</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tontin omistus:</span>
                            <span className={propertyData?.siteOwnershipType ? "font-medium" : "text-gray-400 italic"}>
                              {propertyData?.siteOwnershipType ? getLocalizedText(propertyData.siteOwnershipType, language) : '(Täydennetään)'}
                            </span>
                          </div>
                          {(zoningStatus || propertyData?.zoningSituation) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Kaavatilanne:</span>
                              <span className="font-medium">{zoningStatus || propertyData?.zoningSituation}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vesijohto:</span>
                            <span className={propertyData?.waterConnection ? "font-medium" : "text-gray-400 italic"}>{propertyData?.waterConnection || '(Täydennetään)'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {propertyData?.propertyBuildingRights && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rakennusoikeus:</span>
                              <span className="font-medium">{propertyData.propertyBuildingRights}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Energialuokka:</span>
                            <span className={energyClass ? "font-medium" : "text-gray-400 italic"}>{energyClass || '(Täydennetään)'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Energitodistus:</span>
                            {energyCertificateUrl ? (
                              <a href={energyCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-[#002349] hover:underline">
                                Lataa energiatodistus
                              </a>
                            ) : getEnergyCertificateMessage(energyCertificateStatus, language) ? (
                              <span className="font-medium text-gray-700 text-right max-w-xs">
                                {getEnergyCertificateMessage(energyCertificateStatus, language)}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">(Täydennetään)</span>
                            )}
                          </div>
                          {propertyData?.availableFrom && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Vapautuminen:</span>
                              <span className="font-medium">{typeof propertyData.availableFrom === 'string' ? propertyData.availableFrom : propertyData.availableFrom instanceof Date ? propertyData.availableFrom.toLocaleDateString('fi-FI') : propertyData.availableFrom}</span>
                            </div>
                          )}
                          {(propertyData?.easements || propertyData?.restrictions) && (
                            <div className="flex flex-col">
                              <span className="text-gray-600 mb-1">Rasitteet ja oikeudet:</span>
                              <span className="font-medium text-sm">{propertyData?.easements || propertyData?.restrictions}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'building' && (
                  <div className="space-y-8">
                    {/* Building Information (Rakennustiedot) */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-xl font-light mb-4">Rakennustiedot</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          {constructionYear && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rakennusvuosi:</span>
                              <span className="font-medium">{constructionYear}</span>
                            </div>
                          )}
                          {floorCount && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Kerrosten määrä:</span>
                              <span className="font-medium">{floorCount}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {heatingSystem && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Lämmitys:</span>
                              <span className="font-medium">{heatingSystem}</span>
                            </div>
                          )}
                          {propertyData?.ventilationType && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ilmanvaihto:</span>
                              <span className="font-medium">{propertyData.ventilationType}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'costs' && (
                  <div className="space-y-8">
                    {/* Costs (Kustannukset) */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-xl font-light mb-4">Kustannukset</h3>
                      <div className="space-y-4">
                        {debtFreePrice && (
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Velaton hinta:</span>
                            <Price>{parseInt(debtFreePrice).toLocaleString('fi-FI')} €</Price>
                          </div>
                        )}
                        {propertyData?.housingCooperativeMortgage && (
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Kiinnitykset / panttaukset:</span>
                            <Price>{parseInt(propertyData.housingCooperativeMortgage).toLocaleString('fi-FI')} €</Price>
                          </div>
                        )}
                        {propertyTax && (
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Kiinteistövero:</span>
                            <Price>{parseInt(propertyTax).toLocaleString('fi-FI')} €</Price>
                          </div>
                        )}
                        {(propertyData?.roadTolls || propertyData?.otherCharge) && (
                          <div className="py-2 border-b">
                            <span className="text-gray-600 block mb-2">Muut maksut:</span>
                            <div className="space-y-1 ml-4">
                              {propertyData?.roadTolls && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Tiehoitomaksu:</span>
                                  <Price>{parseInt(propertyData.roadTolls).toLocaleString('fi-FI')} €</Price>
                                </div>
                              )}
                              {propertyData?.otherCharge && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Muu maksu:</span>
                                  <Price>{parseInt(propertyData.otherCharge).toLocaleString('fi-FI')} €</Price>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="space-y-8">
                    {/* Location (Sijainti) */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-xl font-light mb-4">Sijainti</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium text-lg">{address}</p>
                          <p className="text-gray-600">{postalCode} {city}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-8">
                    {/* Documents */}
                    {(floorPlanUrl || energyCertificateUrl || propertyPlanUrl || buildingPermitUrl) && (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-light mb-4">Asiakirjat</h3>
                        <div className="space-y-3">
                          {floorPlanUrl && (
                            <a
                              href={floorPlanUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-700">Pohjapiirros</span>
                            </a>
                          )}
                          {energyCertificateUrl && (
                            <a
                              href={energyCertificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-700">Energiatodistus</span>
                            </a>
                          )}
                          {propertyPlanUrl && (
                            <a
                              href={propertyPlanUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-700">Tonttijako</span>
                            </a>
                          )}
                          {buildingPermitUrl && (
                            <a
                              href={buildingPermitUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-700">Rakennuslupa</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {/* END FASTIGHET LAYOUT */}

            {/* ================================================================ */}
            {/* HYRESOBJEKT (RENTAL) LAYOUT */}
            {/* ================================================================ */}
            {isRental && (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Description */}
                    {(marketingDescription || freeText || description) && (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        {language !== 'fi' && typeof (freeText || description) === 'string' && (
                          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-700">
                            <p className="font-medium">
                              {language === 'sv' ? '📝 Automatisk översättning' : '📝 Automatic translation'}
                            </p>
                            <p className="text-xs mt-1">
                              {language === 'sv' 
                                ? 'Vissa termer har översatts automatiskt från finska. Kontakta mäklaren för fullständig översättning.'
                                : 'Some terms have been automatically translated from Finnish. Contact the agent for a complete translation.'}
                            </p>
                          </div>
                        )}
                        <div className="prose prose-lg max-w-none text-gray-700">
                          {removeEmojis(
                            getLocalizedText(marketingDescription, language) || 
                            getLocalizedText(freeText, language) || 
                            getLocalizedText(description, language) || ''
                          ).split('\n').map((paragraph: string, idx: number) => (
                            <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Materials Links */}
                    {(virtualShowing || videoUrl || floorPlanUrl || propertyBrochureUrl) && (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-light mb-4">Lisämateriaali</h3>
                        <div className="flex flex-wrap gap-3">
                          {virtualShowing && (
                            <a
                              href={virtualShowing}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                            >
                              <CubeIcon className="w-5 h-5 text-[#002349]" />
                              <span>Virtuaaliesittely</span>
                            </a>
                          )}
                          {videoUrl && (
                            <a
                              href={videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                            >
                              <VideoCameraIcon className="w-5 h-5 text-[#002349]" />
                              <span>Video</span>
                            </a>
                          )}
                          {floorPlanUrl && (
                            <a
                              href={floorPlanUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                            >
                              <ScaleIcon className="w-5 h-5 text-[#002349]" />
                              <span>Pohjapiirros</span>
                            </a>
                          )}
                          {propertyBrochureUrl && (
                            <a
                              href={propertyBrochureUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                            >
                              <span>Esite</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Huoneistotiedot (Property Details) Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-xl font-light mb-4">Huoneistotiedot</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          {typeOfApartment && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Kohteen tyyppi:</span>
                              <span className="font-medium">{typeOfApartment}</span>
                            </div>
                          )}
                          {floor && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Kerros:</span>
                              <span className="font-medium">{floor}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {balcony && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Parveke / Terassi:</span>
                              <span className="font-medium">{balcony}</span>
                            </div>
                          )}
                          {sauna && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Sauna:</span>
                              <span className="font-medium">{sauna}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Energy Class */}
                    {energyClass && (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-light mb-4">Energialuokka</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-medium">{energyClass}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Vuokra-aika / Sopimustyyppi (Rental Period) Tab */}
                {activeTab === 'rental-period' && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-xl font-light mb-4">Hyresperiod / Avtalstyp</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          {propertyData?.availableFrom && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Vapautuminen:</span>
                              <span className="font-medium">
                                {typeof propertyData.availableFrom === 'string' 
                                  ? propertyData.availableFrom 
                                  : propertyData.availableFrom instanceof Date 
                                  ? propertyData.availableFrom.toLocaleDateString('fi-FI')
                                  : propertyData.availableFrom}
                              </span>
                            </div>
                          )}
                          {propertyData?.earliestTerminateDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Irtisanomisaika:</span>
                              <span className="font-medium">{propertyData.earliestTerminateDate}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {propertyData?.petsAllowed !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Lemmikit sallittu:</span>
                              <span className="font-medium">{propertyData.petsAllowed ? 'Kyllä' : 'Ei'}</span>
                            </div>
                          )}
                          {propertyData?.smokingAllowed !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tupakointi sallittu:</span>
                              <span className="font-medium">{propertyData.smokingAllowed ? 'Kyllä' : 'Ei'}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* What's included in rent */}
                      {propertyData?.rentIncludes && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Mitä vuokraan sisältyy</h4>
                          <p className="text-gray-700">{propertyData.rentIncludes}</p>
                        </div>
                      )}

                      {/* Additional info */}
                      {propertyData?.rentalNotes && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Lisätiedot</h4>
                          <p className="text-gray-700">{propertyData.rentalNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Building & Company Tab - Same as apartments */}
                {activeTab === 'building' && (
                  <div className="space-y-8">
                    {/* Building Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-xl font-light mb-4">Rakennustiedot</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          {constructionYear && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rakennusvuosi:</span>
                              <span className="font-medium">{constructionYear}</span>
                            </div>
                          )}
                          {energyClass && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Energialuokka:</span>
                              <span className="font-medium">{energyClass}</span>
                            </div>
                          )}
                          {heatingSystem && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Lämmitysjärjestelmä:</span>
                              <span className="font-medium">{heatingSystem}</span>
                            </div>
                          )}
                          {floorCount && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Kerroksia:</span>
                              <span className="font-medium">{floorCount}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {propertyData?.siteOwnershipType && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tontin omistus:</span>
                              <span className="font-medium">{getLocalizedText(propertyData.siteOwnershipType, language)}</span>
                            </div>
                          )}
                          {propertyData?.ownershipType && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Omistusmuoto:</span>
                              <span className="font-medium">{propertyData.ownershipType}</span>
                            </div>
                          )}
                          {propertyData?.housingTenure && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Hallintamuoto:</span>
                              <span className="font-medium">{propertyData.housingTenure}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Costs Tab */}
                {activeTab === 'costs' && (
                  <div className="space-y-8">
                    {/* Hintatiedot (Price Information) */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-xl font-light mb-4">Hintatiedot</h3>
                      <div className="space-y-3">
                        {propertyData?.rent && (
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-700 font-medium">Vuokra kuukaudessa</span>
                            <Price className="text-2xl font-light">{propertyData.rent}</Price>
                          </div>
                        )}
                        {propertyData?.securityDepositType && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Takuuvuokra / vakuus</span>
                            <span className="font-medium">{propertyData.securityDepositType}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Asumiskustannukset (Living Costs) */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-xl font-light mb-4">Asumiskustannukset</h3>
                      <div className="space-y-2">
                        {waterCharge && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vesi:</span>
                            <Price>{waterCharge}</Price>
                          </div>
                        )}
                        {otherCharge && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Muut maksut:</span>
                            <Price>{otherCharge}</Price>
                          </div>
                        )}
                      </div>
                      {propertyData?.additionalCosts && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Mahdolliset lisäkustannukset</h4>
                          <p className="text-gray-700 text-sm">{propertyData.additionalCosts}</p>
                        </div>
                      )}
                    </div>

                    {/* Muut kustannukset (Other Costs) - only if exists */}
                    {propertyData?.otherCostsDescription && (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-light mb-4">Muut kustannukset</h3>
                        <p className="text-gray-700">{propertyData.otherCostsDescription}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-xl font-light mb-4">Sijainti</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium text-lg">{address}</p>
                          <p className="text-gray-600">{postalCode} {city}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-8">
                    {energyCertificateUrl && (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-light mb-4">Asiakirjat</h3>
                        <div className="grid gap-3">
                          <a
                            href={energyCertificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-gray-700">Energiatodistus</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
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
