'use client';

import { useState, useEffect } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { LocaleLink } from '@/components/LocaleLink';
import { ChevronLeft, ChevronRight, Facebook, Linkedin, Mail, Phone, MapPin, Home, Bath, Maximize, FileText } from 'lucide-react';
import { getVideoEmbedUrl, isValidVideoUrl, isValidYouTubeUrl, isValidVimeoUrl } from '@/lib/utils';
import { parseEuroNumber, formatEuroCurrency } from '@/lib/number-eu';
import { getTranslation, getBooleanText, getUnitSuffix, type SupportedLanguage } from '@/lib/property-translations';
// API calls will be made through our server-side route

// ============================================================================
// HERO INFO ROW HELPERS
// ============================================================================
interface HeroItem {
  label: string;
  value: string;
  key: string;
  numValue?: number;
  areaValue?: number;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const gt0 = (v: unknown) => isNum(v) && v > 0;
const hasText = (v: unknown) => typeof v === 'string' && v.trim().length > 0;

function formatAreaM2(v?: number) {
  if (!gt0(v)) return '';
  return `${v} m²`;
}

function formatSiteArea(v?: number) {
  if (!gt0(v)) return '';
  if (v! >= 10000) {
    const ha = v! / 10000;
    return `${ha.toFixed(2)} ha`;
  }
  return `${v} m²`;
}

function getHeroItems(propertyData: any, language: 'fi' | 'sv' | 'en'): HeroItem[] {
  // Determine if this is a fastighet/kiinteistö
  const isFastighet =
    (propertyData?.apartmentType && /villa|hus|fastighet|omakotitalo|egendom/i.test(propertyData.apartmentType)) ||
    propertyData?.estateType === 'KIINTEISTO' ||
    propertyData?.apartmentRealEstateType === 'KIINTEISTO' ||
    propertyData?.propertyType?.toLowerCase().includes('omakotitalo') ||
    propertyData?.propertyType?.toLowerCase().includes('fastighet');

  const region = propertyData?.region || propertyData?.district || propertyData?.city || '';
  
  // Labels by language
  const labels = {
    livingArea: language === 'sv' ? 'Bostadsyta' : language === 'en' ? 'Living area' : 'Asuinpinta-ala',
    totalArea: language === 'sv' ? 'Total yta' : language === 'en' ? 'Total area' : 'Kokonaispinta-ala',
    price: language === 'sv' ? 'Pris' : language === 'en' ? 'Price' : 'Myyntihinta',
    debtFreePrice: language === 'sv' ? 'Skuldfritt pris' : language === 'en' ? 'Debt-free price' : 'Velaton hinta',
    district: language === 'sv' ? 'Stadsdel' : language === 'en' ? 'District' : 'Kaupunginosa',
    yearBuilt: language === 'sv' ? 'Byggnadsår' : language === 'en' ? 'Year built' : 'Rakennusvuosi',
    siteArea: language === 'sv' ? 'Tomtstorlek' : language === 'en' ? 'Plot size' : 'Tontin koko',
  };

  if (isFastighet) {
    // FASTIGHET: Bostadsyta | Total yta | Pris | Stadsdel | Tomtstorlek
    return [
      { label: labels.livingArea, value: formatAreaM2(propertyData?.area || propertyData?.livingArea), key: 'livingArea' },
      { label: labels.totalArea, value: formatAreaM2(propertyData?.totalArea), key: 'totalArea' },
      { label: labels.price, value: gt0(propertyData?.price) ? formatEuroCurrency(propertyData.price) : '', key: 'price', numValue: propertyData?.price },
      { label: labels.district, value: hasText(region) ? region : '', key: 'district' },
      { label: labels.siteArea, value: formatSiteArea(propertyData?.plotArea || propertyData?.siteArea), key: 'siteArea' },
    ].filter(it => hasText(it.value));
  } else {
    // LÄGENHET/OSAKE: Bostadsyta | Pris | Skuldfritt pris | Stadsdel | Byggnadsår
    return [
      { label: labels.livingArea, value: formatAreaM2(propertyData?.area || propertyData?.livingArea), key: 'livingArea', areaValue: propertyData?.area || propertyData?.livingArea },
      { label: labels.price, value: gt0(propertyData?.price) ? formatEuroCurrency(propertyData.price) : '', key: 'price', numValue: propertyData?.price, areaValue: propertyData?.area || propertyData?.livingArea },
      { label: labels.debtFreePrice, value: gt0(propertyData?.debtFreePrice) ? formatEuroCurrency(propertyData.debtFreePrice) : '', key: 'debtFreePrice', numValue: propertyData?.debtFreePrice, areaValue: propertyData?.area || propertyData?.livingArea },
      { label: labels.district, value: hasText(region) ? region : '', key: 'district' },
      { label: labels.yearBuilt, value: gt0(propertyData?.yearBuilt || propertyData?.yearOfBuilding) ? String(propertyData.yearBuilt || propertyData.yearOfBuilding) : '', key: 'yearBuilt' },
    ].filter(it => hasText(it.value));
  }
}

interface PropertyPageProps {
  params: {
    slug: string;
  };
}

// ============================================================================
// WARNING DEDUPLICATION
// ============================================================================
const warned = new Set<string>();
function warnOnce(slug: string, msg: string) {
  if (warned.has(slug)) return;
  console.warn(msg, slug);
  warned.add(slug);
}

// ============================================================================
// SAFE ARRAY HELPER
// ============================================================================
const safeArray = <T,>(arr?: T[] | null): T[] => Array.isArray(arr) ? arr : [];

export default function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = params;
  const searchParams = useSearchParams();
  const language = (searchParams.get('lang') || 'fi') as SupportedLanguage;
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('photos');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    description: true,
    priceInfo: true,
    energyRating: true,
    propertyInfo: true,
    housingCompanyInfo: true,
    buildingInfo: true,
    equipmentSpaces: true,
    locationEnvironment: true,
    mediaDocuments: true,
    otherInfo: true
  });

  useEffect(() => {
    async function loadProperty() {
      try {
        // Fetch property data from our API route (flattened to detected language)
        const response = await fetch(`/api/property/${slug}?lang=${language}`);
        const result = await response.json();
        
        // Handle graceful 404 without throwing
        if (!response.ok || !result.success || !result.data) {
          console.warn(`⚠️ Property not found: "${slug}"`, {
            status: response.status,
            error: result?.error || 'No data',
            normalized: result?.normalized,
            resolved: result?.resolved
          });
          setProperty(null);
          setLoading(false);
          return;
        }

        setProperty(result.data);
        
        // Warn if data contains images but they might not render
        const data = result.data;
        const hasImagesInData = data.media?.gallery?.length > 0 || 
                                data.images?.length > 0 || 
                                data.gallery?.length > 0 ||
                                data.featuredImage;
        if (hasImagesInData) {
          console.log('✅ Property has images:', {
            gallery: data.media?.gallery?.length || data.gallery?.length || 0,
            images: data.images?.length || 0,
            featuredImage: !!data.featuredImage
          });
        } else {
          warnOnce(slug, '⚠️  No images found in property data:');
        }
        
        // CRITICAL: Clear loading state after successful data load
        setLoading(false);
      } catch (error) {
        console.error('Error loading property:', error);
        setProperty(null);
        setLoading(false);
      }
    }

    loadProperty();
  }, [slug, language]);

  // Keyboard navigation - must be defined before any conditional returns
  useEffect(() => {
    if (!property || loading) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Extract images based on property format
      let images: any[] = [];
      const isUiFormat = property.location && property.financials && property.specs;
      
      if (isUiFormat) {
        images = property.media?.gallery || [];
      } else {
        const propertyData = property.acfRealEstate?.property || property;
        images = propertyData.gallery || property.images || (property.featuredImage ? [property.featuredImage] : []);
      }

      if (activeTab === 'photos' && images.length > 1) {
        if (e.key === 'ArrowLeft') {
          setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        } else if (e.key === 'ArrowRight') {
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, property, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // Friendly "not found" state instead of throwing
  if (!property) {
    const translations = {
      fi: {
        title: 'Kohdetta ei löytynyt',
        message: 'Tarkista linkki tai palaa kohdelistaukseen.',
        backLink: 'Takaisin etusivulle'
      },
      sv: {
        title: 'Objektet hittades inte',
        message: 'Kontrollera länken eller gå tillbaka till listan.',
        backLink: 'Tillbaka till startsidan'
      },
      en: {
        title: 'Listing not found',
        message: 'Check the link or go back to listings.',
        backLink: 'Back to home'
      }
    };
    
    const t = translations[language] || translations.fi;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              {t.title}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {t.message}
            </p>
            <div className="flex justify-center gap-4">
              <LocaleLink 
                href="/"
                className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                {t.backLink}
              </LocaleLink>
              <LocaleLink 
                href="/kohteet"
                className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded hover:bg-gray-300 transition-colors"
              >
                {language === 'sv' ? 'Till objekten' : language === 'en' ? 'View properties' : 'Katso kohteet'}
              </LocaleLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safe array helper to prevent crashes on undefined/null arrays
  const safeArray = <T,>(arr?: T[] | null): T[] => (Array.isArray(arr) ? arr : []);

  // Extract property data - handle WordPress, Linear API, and new UI formats
  const isUiFormat = property.location && property.financials && property.specs;
  let propertyData;
  let agentData;
  let images;
  
  if (isUiFormat) {
    // Map UI format to property data format
    propertyData = {
      address: property.location.addressLine,
      city: property.location.city,
      postalCode: property.location.postalCode,
      district: property.location.district,
      lat: property.location.lat,
      lng: property.location.lng,
      price: property.financials.price,
      debtFreePrice: property.financials.debtFreePrice,
      debtPart: property.financials?.debtPart ?? property.financials?.debtShare ?? property.financials?.debt ?? 0,
      area: property.specs.livingAreaM2,
      totalArea: property.specs.totalAreaM2,
      rooms: property.specs.rooms,
      bedrooms: property.specs.bedrooms,
      bathrooms: property.specs.bathrooms,
      yearBuilt: property.specs.yearBuilt,
      floor: property.specs.floor,
      floorCount: property.specs.floorCount,
      elevator: property.specs.elevator,
      energyClass: property.features?.energyClass,
      heatingSystem: property.features?.heatingType,
      sauna: property.features?.sauna,
      balcony: property.features?.balcony,
      terrace: property.features?.terrace,
      parking: property.features?.parking,
      maintenanceCharge: property.charges?.hoaFee,
      propertyTax: property.charges?.propertyTax,
      waterCharge: property.charges?.waterFee,
      heatingCharge: property.charges?.heatingFee,
      description: property.description,
      floorPlanUrl: property.media?.floorplans?.[0],
      videoUrl: property.media?.videoUrl,
      propertyBrochureUrl: property.media?.brochureUrl,
      housingCooperativeName: property.housingCompany?.name,
      shareNumbers: property.housingCompany?.shareNumbers,
      gallery: safeArray(property.media?.gallery),
    };
    agentData = property.agents?.[0] || {};
    // Image rendering: Use gallery, else images array, else featuredImage fallback
    images = safeArray(property.media?.gallery).length > 0 
      ? safeArray(property.media?.gallery)
      : safeArray(property.images).length > 0
      ? safeArray(property.images)
      : property.featuredImage
      ? [{ url: property.featuredImage }]
      : [];
  } else {
    // WordPress or Linear format
    propertyData = property.acfRealEstate?.property || property;
    agentData = property.acfRealEstate?.agent || property.agent || {};
    // Image rendering: Use gallery, else images array, else featuredImage fallback
    images = safeArray(propertyData.gallery).length > 0
      ? safeArray(propertyData.gallery)
      : safeArray(property.images).length > 0
      ? safeArray(property.images)
      : property.featuredImage
      ? [{ url: property.featuredImage }]
      : [];
  }
  
  // Use parseEuroNumber for safe number parsing and formatEuroCurrency for display
  // Deprecated: keeping formatNumber for non-currency values
  const formatNumber = (num: number | string) => {
    return new Intl.NumberFormat('fi-FI').format(Number(num));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Image navigation functions
  const nextImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Section */}
      <div className="bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-6">
            <div className="text-sm">
              <LocaleLink href="/kohteet" className="text-white/90 hover:text-white transition-colors">
                Myynnissä
              </LocaleLink>
              <span className="mx-2 text-white/60">»</span>
              <span className="text-white">{property.title}</span>
            </div>
            <Link 
              href={`mailto:${agentData.email || 'info@sothebysrealty.fi'}?subject=Tiedustelu kohteesta: ${property.title}`}
              className="sotheby-btn transparent-btn inline-block px-8 py-3 border-2 border-white text-white 
                       hover:bg-white hover:text-[var(--color-primary)] transition-all duration-300 
                       uppercase tracking-wider text-sm font-medium"
            >
              Ota yhteyttä
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {/* Tab Content Container */}
        <div className="relative">
          {activeTab === 'photos' && images.length > 0 && (
            <div className="bg-white py-8">
              <div className="container mx-auto px-4">
                {/* Grid Layout: Large image on left, smaller images on right */}
                <div className="flex flex-col lg:flex-row gap-2">
                  {/* Main Large Image */}
                  <div className="relative w-full lg:w-2/3 h-[400px] lg:h-[600px] overflow-hidden">
                    <Image
                      src={typeof images[currentImageIndex] === 'string' 
                        ? images[currentImageIndex] as string
                        : (images[currentImageIndex] as any).url || (images[currentImageIndex] as any).sourceUrl || (images[currentImageIndex] as any).node?.sourceUrl || ''}
                      alt={`Property image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                    
                    {/* Image Counter Overlay */}
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 text-sm font-light">
                      {currentImageIndex + 1} / {images.length}
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black w-10 h-10 flex items-center justify-center transition-all shadow-md"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black w-10 h-10 flex items-center justify-center transition-all shadow-md"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Right Side: Grid of smaller images (4 visible) */}
                  <div className="w-full lg:w-1/3 grid grid-cols-2 gap-2 h-[200px] lg:h-[600px]">
                    {images.slice(1, 5).map((image: any, idx: number) => {
                      const imageSrc = typeof image === 'string' 
                        ? image 
                        : image.url || image.sourceUrl || image.node?.sourceUrl || '';
                      const actualIndex = idx + 1;
                      
                      return (
                        <button
                          key={actualIndex}
                          onClick={() => setCurrentImageIndex(actualIndex)}
                          className={`relative overflow-hidden transition-all ${
                            currentImageIndex === actualIndex 
                              ? 'ring-2 ring-[#002349]' 
                              : 'opacity-90 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={imageSrc}
                            alt={`Thumbnail ${actualIndex + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 16vw"
                          />
                          
                          {/* Show +N overlay on last thumbnail if more images exist */}
                          {idx === 3 && images.length > 5 && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xl font-light">
                              +{images.length - 5}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Thumbnail Strip Below (all images) */}
                {images.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {images.map((image: any, index: number) => {
                      const imageSrc = typeof image === 'string' 
                        ? image 
                        : image.url || image.sourceUrl || image.node?.sourceUrl || '';
                      
                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative flex-shrink-0 w-20 h-20 overflow-hidden transition-all ${
                            currentImageIndex === index 
                              ? 'ring-2 ring-[#002349] opacity-100' 
                              : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={imageSrc}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'floorplan' && (
            <div className="bg-gray-50 py-12">
              <div className="container mx-auto px-4">
                {propertyData.floorPlanUrl || propertyData.floorplan ? (
                  <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                      <Image
                        src={propertyData.floorPlanUrl || propertyData.floorplan}
                        alt="Floor plan"
                        width={1200}
                        height={800}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-light text-gray-700 mb-4">{getTranslation('floorPlan', language)}</h2>
                    <p className="text-gray-500">{getTranslation('notAvailable', language)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="bg-gray-50 py-8">
              <div className="container mx-auto px-4">
                {(propertyData.lat && propertyData.lng) || (propertyData.address && propertyData.city) ? (
                  <div className="max-w-6xl mx-auto">
                    <div className="relative w-full rounded-lg shadow-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={
                          propertyData.lat && propertyData.lng
                            ? `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${propertyData.lat},${propertyData.lng}&zoom=15`
                            : `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(propertyData.address + ', ' + propertyData.city + ', Finland')}&zoom=15`
                        }
                        className="absolute top-0 left-0 w-full h-full border-0"
                        title="Property Location Map"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-light text-gray-700 mb-4">Sijainti kartalla</h2>
                    <p className="text-gray-500">Kartta ei saatavilla</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'brochure' && (
            <div className="bg-white py-8">
              <div className="container mx-auto px-4">
                {propertyData.propertyBrochureUrl || propertyData.brochure || propertyData.virtualShowing ? (
                  <div className="max-w-6xl mx-auto">
                    {/* PDF Viewer with Download Button */}
                    <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
                      {/* Header with Download Button */}
                      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                        <h3 className="text-lg font-light text-gray-800">
                          {getTranslation('brochure', language)}
                        </h3>
                        <a
                          href={propertyData.propertyBrochureUrl || propertyData.brochure || propertyData.virtualShowing}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#002349] text-white hover:bg-[#003666] transition-colors text-sm font-light"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {getTranslation('downloadPDF', language)}
                        </a>
                      </div>
                      
                      {/* PDF Embed with proper sizing */}
                      <div className="relative w-full bg-gray-100" style={{ minHeight: '800px' }}>
                        <iframe
                          src={`${propertyData.propertyBrochureUrl || propertyData.brochure || propertyData.virtualShowing}#toolbar=1&navpanes=0&scrollbar=1`}
                          className="w-full border-0"
                          style={{ height: '800px' }}
                          title="Property Brochure"
                          loading="lazy"
                        />
                      </div>

                      {/* Fallback for mobile - Direct link */}
                      <div className="lg:hidden p-6 bg-white text-center border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-4">
                          {getTranslation('pdfViewerFallback', language)}
                        </p>
                        <a
                          href={propertyData.propertyBrochureUrl || propertyData.brochure || propertyData.virtualShowing}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-[#002349] text-white hover:bg-[#003666] transition-colors"
                        >
                          {getTranslation('openPDF', language)}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-light text-gray-700 mb-4">
                      {getTranslation('brochure', language)}
                    </h2>
                    <p className="text-gray-500">
                      {getTranslation('notAvailable', language)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="bg-gray-50 py-8">
              <div className="container mx-auto px-4">
                {(isValidVideoUrl(propertyData.videoUrl) || isValidVideoUrl(propertyData.youtubeUrl) || isValidVideoUrl(propertyData.video)) ? (
                  <div className="max-w-4xl mx-auto">
                    <div className="relative w-full rounded-lg shadow-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={getVideoEmbedUrl(
                          (isValidVideoUrl(propertyData.videoUrl) && propertyData.videoUrl) ||
                          (isValidVideoUrl(propertyData.youtubeUrl) && propertyData.youtubeUrl) ||
                          (isValidVideoUrl(propertyData.video) && propertyData.video) ||
                          ''
                        )}
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Property Video"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-light text-gray-700 mb-4">{getTranslation('videoTab', language)}</h2>
                    <p className="text-gray-500">{getTranslation('notAvailable', language)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation - Modern Sotheby's Style */}
        <div className="bg-white border-t border-gray-200 mt-8">
          <div className="container mx-auto">
            <div className="flex justify-center">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-6 md:px-8 py-5 font-light text-sm uppercase tracking-widest transition-all relative ${
                    activeTab === 'photos'
                      ? 'text-[var(--color-primary)]'
                      : 'text-gray-600 hover:text-[var(--color-primary)]'
                  }`}
                >
                  {getTranslation('photos', language)}
                  {activeTab === 'photos' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('floorplan')}
                  className={`px-6 md:px-8 py-5 font-light text-sm uppercase tracking-widest transition-all relative ${
                    activeTab === 'floorplan' 
                      ? 'text-[var(--color-primary)]' 
                      : 'text-gray-600 hover:text-[var(--color-primary)]'
                  }`}
                >
                  {getTranslation('floorPlan', language)}
                  {activeTab === 'floorplan' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`px-6 md:px-8 py-5 font-light text-sm uppercase tracking-widest transition-all relative ${
                    activeTab === 'map' 
                      ? 'text-[var(--color-primary)]' 
                      : 'text-gray-600 hover:text-[var(--color-primary)]'
                  }`}
                >
                  {getTranslation('viewOnMap', language)}
                  {activeTab === 'map' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('brochure')}
                  className={`px-6 md:px-8 py-5 font-light text-sm uppercase tracking-widest transition-all relative ${
                    activeTab === 'brochure' 
                      ? 'text-[var(--color-primary)]' 
                      : 'text-gray-600 hover:text-[var(--color-primary)]'
                  }`}
                >
                  {getTranslation('viewBrochure', language)}
                  {activeTab === 'brochure' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
                  )}
                </button>
                {(isValidVideoUrl(propertyData.videoUrl) || isValidVideoUrl(propertyData.youtubeUrl) || isValidVideoUrl(propertyData.video)) && (
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`px-6 md:px-8 py-5 font-light text-sm uppercase tracking-widest transition-all relative ${
                      activeTab === 'video' 
                        ? 'text-[var(--color-primary)]' 
                        : 'text-gray-600 hover:text-[var(--color-primary)]'
                    }`}
                  >
                    Katso video
                    {activeTab === 'video' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Share Links */}
      <div className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-6">
            <span className="text-sm text-gray-600 uppercase tracking-wider">Jaa:</span>
            <button
              onClick={() => {
                const url = window.location.href;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
              }}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all"
            >
              <Facebook size={18} />
            </button>
            <button
              onClick={() => {
                const url = window.location.href;
                window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(property.title)}`, '_blank');
              }}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all"
            >
              <Linkedin size={18} />
            </button>
            <button
              onClick={() => {
                const url = window.location.href;
                window.location.href = `mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(url)}`;
              }}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all"
            >
              <Mail size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Property Key Information - Client Order */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {(() => {
            const heroItems = getHeroItems(propertyData, language);
            return (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
                {heroItems.map((item, index) => (
                  <div key={index}>
                    <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                      {item.value}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 uppercase tracking-wider">
                      {item.label}
                    </p>
                    {/* Show €/m² for prices with living area */}
                    {item.key === 'price' && item.numValue && item.areaValue && gt0(item.areaValue) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatEuroCurrency(item.numValue! / item.areaValue!)} / m²
                      </p>
                    )}
                    {item.key === 'debtFreePrice' && item.numValue && item.areaValue && gt0(item.areaValue) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatEuroCurrency(item.numValue! / item.areaValue!)} / m²
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Property Title and Description */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
              {property.title}
            </h1>
            {propertyData.address && (
              <h2 className="text-xl text-gray-600 mb-2">
                {propertyData.address}{propertyData.postalCode ? `, ${propertyData.postalCode}` : ''} {propertyData.city || ''}
              </h2>
            )}
            {propertyData.propertyType && (
              <h4 className="text-lg text-gray-500">
                {propertyData.propertyType} | {propertyData.rooms}
              </h4>
            )}
          </div>

          {/* Description Section */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <button
                onClick={() => toggleSection('description')}
                className="w-full text-left"
              >
                <h3 className="text-2xl font-semibold text-[var(--color-primary)] mb-4 flex items-center justify-center">
                  {getTranslation('description', language)}
                  <span className={`ml-2 transition-transform ${expandedSections.description ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </h3>
              </button>
              {expandedSections.description && (
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: propertyData.description || property.content || '' }} />
                </div>
              )}
            </div>
          </div>

          {/* Agent Contact */}
          {agentData && agentData.name && (
            <div className="max-w-2xl mx-auto text-center py-8">
              <h3 className="text-2xl font-semibold mb-6">Lisätiedot ja esittelyt</h3>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {agentData.image && (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden">
                      <Image
                        src={agentData.image}
                        alt={agentData.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold">{agentData.name}</h3>
                    <p className="text-gray-600">{agentData.title || 'Senior Broker, LKV'}</p>
                    {agentData.phone && (
                      <p className="mt-2">
                        <a href={`tel:${agentData.phone}`} className="text-[var(--color-primary)] hover:underline">
                          {agentData.phone}
                        </a>
                      </p>
                    )}
                    {agentData.email && (
                      <p>
                        <a href={`mailto:${agentData.email}`} className="text-[var(--color-primary)] hover:underline">
                          {agentData.email}
                        </a>
                      </p>
                    )}
                    <a 
                      href={`mailto:${agentData.email || 'info@sothebysrealty.fi'}`}
                      className="inline-block mt-4 bg-[var(--color-primary)] text-white px-6 py-3 rounded hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                      OTA YHTEYTTÄ
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Property Information */}
          <div className="max-w-6xl mx-auto mt-12">
            {/* Price Information */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('priceInfo')}
                className="w-full bg-gray-100 p-4 text-left hover:bg-gray-200 transition-colors"
              >
                <h3 className="text-xl font-semibold flex items-center justify-between">
                  {getTranslation('priceInfo', language)}
                  <span className={`transition-transform ${expandedSections.priceInfo ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </h3>
              </button>
              {expandedSections.priceInfo && (
                <div className="bg-white border border-gray-200 p-6">
                  <div className="space-y-2">
                    {propertyData.price != null && propertyData.price > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('salesPrice', language)}</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.price)}</span>
                      </div>
                    )}
                    {propertyData.debtPart != null && propertyData.debtPart > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('debtPart', language)}</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.debtPart)}</span>
                      </div>
                    )}
                    {propertyData.debtFreePrice != null && propertyData.debtFreePrice > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('debtFreePrice', language)}</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.debtFreePrice)}</span>
                      </div>
                    )}
                    {propertyData.maintenanceFee != null && propertyData.maintenanceFee > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('maintenanceFee', language)}</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.maintenanceFee)}{getUnitSuffix('perMonth', language)}</span>
                      </div>
                    )}
                    {propertyData.financingFee != null && propertyData.financingFee > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('financingFee', language)}</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.financingFee)}{getUnitSuffix('perMonth', language)}</span>
                      </div>
                    )}
                    {propertyData.totalFee != null && propertyData.totalFee > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('totalFee', language)}</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.totalFee)}{getUnitSuffix('perMonth', language)}</span>
                      </div>
                    )}
                    {propertyData.waterFee != null && propertyData.waterFee > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('waterFee', language)}</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.waterFee)}{getUnitSuffix('perPersonMonth', language)}</span>
                      </div>
                    )}
                    {propertyData.propertyTax && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('propertyTax', language)}</span>
                        <span className="font-semibold">{propertyData.propertyTax} {getUnitSuffix('perYear', language)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Energy Rating */}
            {propertyData.energyClass && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('energyRating')}
                  className="w-full bg-gray-100 p-4 text-left hover:bg-gray-200 transition-colors"
                >
                  <h3 className="text-xl font-semibold flex items-center justify-between">
                    Energialuokitus
                    <span className={`transition-transform ${expandedSections.energyRating ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </h3>
                </button>
                {expandedSections.energyRating && (
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Energialuokka</span>
                      <span className="font-semibold">{propertyData.energyClass}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Property Details */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('propertyInfo')}
                className="w-full bg-gray-100 p-4 text-left hover:bg-gray-200 transition-colors"
              >
                <h3 className="text-xl font-semibold flex items-center justify-between">
                  Kiinteistötiedot
                  <span className={`transition-transform ${expandedSections.propertyInfo ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </h3>
              </button>
              {expandedSections.propertyInfo && (
                <div className="bg-white border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {propertyData.propertyId && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Kiinteistön tunnus</span>
                        <span className="font-semibold">{propertyData.propertyId}</span>
                      </div>
                    )}
                    {propertyData.plotArea && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Tontin pinta-ala</span>
                        <span className="font-semibold">{formatNumber(propertyData.plotArea)} m²</span>
                      </div>
                    )}
                    {propertyData.plotOwnership && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Tontin omistus</span>
                        <span className="font-semibold">{propertyData.plotOwnership}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Housing Company Information */}
            {(propertyData.housingCompanyName || propertyData.businessId || propertyData.managerName || propertyData.numberOfShares || propertyData.propertyMaintenance) && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('housingCompanyInfo')}
                  className="w-full bg-gray-100 p-4 text-left hover:bg-gray-200 transition-colors"
                >
                  <h3 className="text-xl font-semibold flex items-center justify-between">
                    {getTranslation('housingCompanyInfo', language)}
                    <span className={`transition-transform ${expandedSections.housingCompanyInfo ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </h3>
                </button>
                {expandedSections.housingCompanyInfo && (
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {propertyData.housingCompanyName && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">{getTranslation('housingCompanyName', language)}</span>
                          <span className="font-semibold">{propertyData.housingCompanyName}</span>
                        </div>
                      )}
                      {propertyData.businessId && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">{getTranslation('businessId', language)}</span>
                          <span className="font-semibold">{propertyData.businessId}</span>
                        </div>
                      )}
                      {propertyData.managerName && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">{getTranslation('managerName', language)}</span>
                          <span className="font-semibold">{propertyData.managerName}</span>
                        </div>
                      )}
                      {propertyData.managerPhone && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">{getTranslation('managerPhone', language)}</span>
                          <span className="font-semibold">{propertyData.managerPhone}</span>
                        </div>
                      )}
                      {propertyData.managerEmail && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">{getTranslation('managerEmail', language)}</span>
                          <span className="font-semibold">{propertyData.managerEmail}</span>
                        </div>
                      )}
                      {propertyData.propertyMaintenance && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">{getTranslation('propertyMaintenance', language)}</span>
                          <span className="font-semibold">{propertyData.propertyMaintenance}</span>
                        </div>
                      )}
                      {propertyData.numberOfShares && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">{getTranslation('numberOfShares', language)}</span>
                          <span className="font-semibold">{propertyData.numberOfShares}</span>
                        </div>
                      )}
                      {propertyData.redemptionClauseFlats !== undefined && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">{getTranslation('redemptionClause', language)}</span>
                          <span className="font-semibold">{propertyData.redemptionClauseFlats ? getBooleanText(true, language) : getBooleanText(false, language)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Building Information */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('buildingInfo')}
                className="w-full bg-gray-100 p-4 text-left hover:bg-gray-200 transition-colors"
              >
                <h3 className="text-xl font-semibold flex items-center justify-between">
                  {getTranslation('buildingInfo', language)}
                  <span className={`transition-transform ${expandedSections.buildingInfo ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </h3>
              </button>
              {expandedSections.buildingInfo && (
                <div className="bg-white border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {propertyData.yearBuilt && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Rakennusvuosi</span>
                        <span className="font-semibold">{propertyData.yearBuilt}</span>
                      </div>
                    )}
                    {propertyData.buildingMaterial && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Rakennusaine</span>
                        <span className="font-semibold">{propertyData.buildingMaterial}</span>
                      </div>
                    )}
                    {propertyData.heating && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Lämmitys</span>
                        <span className="font-semibold">{propertyData.heating}</span>
                      </div>
                    )}
                    {propertyData.heatingSystem && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('heatingSystem', language)}</span>
                        <span className="font-semibold">{propertyData.heatingSystem}</span>
                      </div>
                    )}
                    {propertyData.roofType && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('roofType', language)}</span>
                        <span className="font-semibold">{propertyData.roofType}</span>
                      </div>
                    )}
                    {propertyData.condition && typeof propertyData.condition === 'string' && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('condition', language)}</span>
                        <span className="font-semibold">{propertyData.condition}</span>
                      </div>
                    )}
                    {propertyData.sauna !== undefined && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('sauna', language)}</span>
                        <span className="font-semibold">{propertyData.sauna ? getBooleanText(true, language) : getBooleanText(false, language)}</span>
                      </div>
                    )}
                    {propertyData.balcony !== undefined && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('balcony', language)}</span>
                        <span className="font-semibold">{propertyData.balcony ? getBooleanText(true, language) : getBooleanText(false, language)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Equipment and Spaces */}
            {(propertyData.kitchenEquipment || propertyData.bathroomEquipment || propertyData.floorMaterial || propertyData.storageSpace) && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('equipmentSpaces')}
                  className="w-full bg-gray-100 p-4 text-left hover:bg-gray-200 transition-colors"
                >
                  <h3 className="text-xl font-semibold flex items-center justify-between">
                    {getTranslation('equipmentSpaces', language)}
                    <span className={`transition-transform ${expandedSections.equipmentSpaces ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </h3>
                </button>
                {expandedSections.equipmentSpaces && (
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="space-y-4">
                      {propertyData.kitchenEquipment && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">{getTranslation('kitchen', language)}</h4>
                          <p className="text-gray-600">{propertyData.kitchenEquipment}</p>
                        </div>
                      )}
                      {propertyData.bathroomEquipment && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">{getTranslation('bathroom', language)}</h4>
                          <p className="text-gray-600">{propertyData.bathroomEquipment}</p>
                        </div>
                      )}
                      {propertyData.floorMaterial && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">{getTranslation('floorMaterial', language)}</h4>
                          <p className="text-gray-600">{propertyData.floorMaterial}</p>
                        </div>
                      )}
                      {propertyData.storageSpace && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">{getTranslation('storageSpace', language)}</h4>
                          <p className="text-gray-600">{propertyData.storageSpace}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Location and Environment */}
            {(propertyData.windowDirection || propertyData.services || propertyData.beachRights) && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('locationEnvironment')}
                  className="w-full bg-gray-100 p-4 text-left hover:bg-gray-200 transition-colors"
                >
                  <h3 className="text-xl font-semibold flex items-center justify-between">
                    {getTranslation('locationEnvironment', language)}
                    <span className={`transition-transform ${expandedSections.locationEnvironment ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </h3>
                </button>
                {expandedSections.locationEnvironment && (
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="space-y-3">
                      {propertyData.windowDirection && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">{getTranslation('windowDirection', language)}</span>
                          <span className="font-semibold">{propertyData.windowDirection}</span>
                        </div>
                      )}
                      {propertyData.services && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">{getTranslation('services', language)}</h4>
                          <p className="text-gray-600">{propertyData.services}</p>
                        </div>
                      )}
                      {propertyData.beachRights && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">{getTranslation('beachRights', language)}</span>
                          <span className="font-semibold">{propertyData.beachRights}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Media and Documents */}
            {(propertyData.brochureUrl || propertyData.videoUrl) && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('mediaDocuments')}
                  className="w-full bg-gray-100 p-4 text-left hover:bg-gray-200 transition-colors"
                >
                  <h3 className="text-xl font-semibold flex items-center justify-between">
                    {getTranslation('mediaDocuments', language)}
                    <span className={`transition-transform ${expandedSections.mediaDocuments ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </h3>
                </button>
                {expandedSections.mediaDocuments && (
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="space-y-3">
                      {propertyData.brochureUrl && (
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-gray-600">{getTranslation('brochure', language)}</span>
                          <a 
                            href={propertyData.brochureUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[var(--color-primary)] hover:underline font-semibold"
                          >
                            {getTranslation('openBrochure', language)}
                          </a>
                        </div>
                      )}
                      {propertyData.videoUrl && (
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-gray-600">{getTranslation('video', language)}</span>
                          <a 
                            href={propertyData.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[var(--color-primary)] hover:underline font-semibold"
                          >
                            {getTranslation('watchVideo', language)}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Other Information */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('otherInfo')}
                className="w-full bg-gray-100 p-4 text-left hover:bg-gray-200 transition-colors"
              >
                <h3 className="text-xl font-semibold flex items-center justify-between">
                  {getTranslation('otherInfo', language)}
                  <span className={`transition-transform ${expandedSections.otherInfo ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </h3>
              </button>
              {expandedSections.otherInfo && (
                <div className="bg-white border border-gray-200 p-6">
                  <div className="grid grid-cols-1 gap-4">
                    {propertyData.availability && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('availability', language)}</span>
                        <span className="font-semibold">{propertyData.availability}</span>
                      </div>
                    )}
                    {propertyData.zoningSituation && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('zoningSituation', language)}</span>
                        <span className="font-semibold">{propertyData.zoningSituation}</span>
                      </div>
                    )}
                    {propertyData.buildingRights && typeof propertyData.buildingRights === 'string' && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{getTranslation('buildingRights', language)}</span>
                        <span className="font-semibold">{propertyData.buildingRights}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}