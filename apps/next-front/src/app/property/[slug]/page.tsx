'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Facebook, Linkedin, Mail, Phone, MapPin, Home, Bath, Maximize, FileText } from 'lucide-react';
import { getYouTubeEmbedUrl, isValidYouTubeUrl } from '@/lib/utils';
import { parseEuroNumber, formatEuroCurrency } from '@/lib/number-eu';
// API calls will be made through our server-side route

interface PropertyPageProps {
  params: {
    slug: string;
  };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = params;
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
        // Fetch property data from our API route (flattened to Finnish)
        const response = await fetch(`/api/property/${slug}?lang=fi`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch property');
        }
        
        const result = await response.json();
        
        if (!result.success || !result.data) {
          notFound();
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
          console.warn('⚠️  No images found in property data:', data.title || slug);
        }
      } catch (error) {
        console.error('Error loading property:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [slug]);

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

  if (!property) {
    notFound();
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
              <Link href="/kohteet" className="text-white/90 hover:text-white transition-colors">
                Myynnissä
              </Link>
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
            <div className="relative bg-black">
              {/* Main Image Container with proper aspect ratio */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
                <div className="absolute inset-0">
                  {images.map((image: any, index: number) => {
                    const imageSrc = typeof image === 'string' 
                      ? image 
                      : image.url || image.sourceUrl || image.node?.sourceUrl || '';
                    
                    return (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          currentImageIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                      >
                        <Image
                          src={imageSrc}
                          alt={`Property image ${index + 1}`}
                          fill
                          className="object-cover"
                          priority={index === 0 || index === 1}
                          loading={index <= 2 ? "eager" : "lazy"}
                          sizes="100vw"
                          onError={(e) => {
                            console.error(`Failed to load image ${index + 1}:`, imageSrc);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Navigation Arrows - Sleek Modern Design */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white w-14 h-14 flex items-center justify-center transition-all hover:bg-white/20 group"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-8 h-8 transition-transform group-hover:-translate-x-0.5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white w-14 h-14 flex items-center justify-center transition-all hover:bg-white/20 group"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-8 h-8 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </>
              )}

              {/* Image Counter - Minimalist Style */}
              <div className="absolute bottom-4 right-4 text-white text-sm font-light tracking-wider">
                {currentImageIndex + 1} — {images.length}
              </div>
            </div>
          )}

          {/* Thumbnail Strip - Below Main Image */}
          {activeTab === 'photos' && images.length > 1 && (
            <div className="bg-white py-4">
              <div className="flex gap-2 justify-center overflow-x-auto max-w-6xl mx-auto px-4 scrollbar-hide">
                {images.map((image: any, index: number) => {
                  const imageSrc = typeof image === 'string' 
                    ? image 
                    : image.url || image.sourceUrl || image.node?.sourceUrl || '';
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-24 h-24 overflow-hidden transition-all ${
                        currentImageIndex === index 
                          ? 'ring-2 ring-[var(--color-primary)] opacity-100' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={imageSrc}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </button>
                  );
                })}
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
                    <h2 className="text-2xl font-light text-gray-700 mb-4">Pohjakuva</h2>
                    <p className="text-gray-500">Ei saatavilla</p>
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
            <div className="bg-gray-50 py-8">
              <div className="container mx-auto px-4">
                {propertyData.propertyBrochureUrl || propertyData.brochure || propertyData.virtualShowing ? (
                  <div className="max-w-6xl mx-auto">
                    <div className="relative w-full rounded-lg shadow-lg overflow-hidden" style={{ paddingBottom: '75%' }}>
                      <iframe
                        src={propertyData.propertyBrochureUrl || propertyData.brochure || propertyData.virtualShowing}
                        className="absolute top-0 left-0 w-full h-full border-0"
                        title="Property Brochure"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-light text-gray-700 mb-4">Esite</h2>
                    <p className="text-gray-500">Ei saatavilla</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="bg-gray-50 py-8">
              <div className="container mx-auto px-4">
                {(isValidYouTubeUrl(propertyData.videoUrl) || isValidYouTubeUrl(propertyData.youtubeUrl) || isValidYouTubeUrl(propertyData.video)) ? (
                  <div className="max-w-4xl mx-auto">
                    <div className="relative w-full rounded-lg shadow-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={getYouTubeEmbedUrl(
                          (isValidYouTubeUrl(propertyData.videoUrl) && propertyData.videoUrl) ||
                          (isValidYouTubeUrl(propertyData.youtubeUrl) && propertyData.youtubeUrl) ||
                          (isValidYouTubeUrl(propertyData.video) && propertyData.video) ||
                          ''
                        )}
                        className="absolute top-0 left-0 w-full h-full"
                        allowFullScreen
                        title="Property Video"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-light text-gray-700 mb-4">Video</h2>
                    <p className="text-gray-500">Ei saatavilla</p>
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
                  Valokuvat
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
                  Pohjakuva
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
                  Kohde kartalla
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
                  Selaa esitettä
                  {activeTab === 'brochure' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
                  )}
                </button>
                {(isValidYouTubeUrl(propertyData.videoUrl) || isValidYouTubeUrl(propertyData.youtubeUrl) || isValidYouTubeUrl(propertyData.video)) && (
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

      {/* Property Key Information */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {propertyData.area && (
              <div>
                <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                  {String(propertyData.area).includes('m²') || String(propertyData.area).includes('m2') ? propertyData.area : `${propertyData.area} m²`}
                </h3>
                <p className="text-sm text-gray-600 mt-2">ASUINPINTA-ALA</p>
              </div>
            )}
            {propertyData.totalArea && (
              <div>
                <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                  {String(propertyData.totalArea).includes('m²') || String(propertyData.totalArea).includes('m2') ? propertyData.totalArea : `${propertyData.totalArea} m²`}
                </h3>
                <p className="text-sm text-gray-600 mt-2">KOKONAISALA</p>
              </div>
            )}
            {propertyData.price && (
              <div>
                <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                  {formatEuroCurrency(propertyData.price)}
                </h3>
                <p className="text-sm text-gray-600 mt-2">MYYNTIHINTA</p>
              </div>
            )}
            {propertyData.city && (
              <div>
                <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                  {propertyData.city}
                </h3>
                <p className="text-sm text-gray-600 mt-2">KAUPUNGINOSA</p>
              </div>
            )}
            {propertyData.apartmentType && (
              <div>
                <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                  {propertyData.apartmentType}
                </h3>
                <p className="text-sm text-gray-600 mt-2">ASUNNON TYYPPI</p>
              </div>
            )}
            {propertyData.floorLocation && (
              <div>
                <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                  {propertyData.floorLocation}{propertyData.numberOfFloors && propertyData.numberOfFloors > 0 ? ` / ${propertyData.numberOfFloors}` : ''}
                </h3>
                <p className="text-sm text-gray-600 mt-2">KERROS</p>
              </div>
            )}
            {propertyData.plotArea && (
              <div>
                <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                  {String(propertyData.plotArea).includes('m²') || String(propertyData.plotArea).includes('m2') ? propertyData.plotArea : `${formatNumber(propertyData.plotArea)} m²`}
                </h3>
                <p className="text-sm text-gray-600 mt-2">TONTIN PINTA-ALA</p>
              </div>
            )}
          </div>
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
                  Kuvaus
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
                  Hintatiedot
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
                        <span className="text-gray-600">Myyntihinta</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.price)}</span>
                      </div>
                    )}
                    {propertyData.debtPart != null && propertyData.debtPart > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Velkaosuus</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.debtPart)}</span>
                      </div>
                    )}
                    {propertyData.debtFreePrice != null && propertyData.debtFreePrice > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Velaton hinta</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.debtFreePrice)}</span>
                      </div>
                    )}
                    {propertyData.maintenanceFee != null && propertyData.maintenanceFee > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Yhtiövastike</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.maintenanceFee)}/kk</span>
                      </div>
                    )}
                    {propertyData.financingFee != null && propertyData.financingFee > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Rahoitusvastike</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.financingFee)}/kk</span>
                      </div>
                    )}
                    {propertyData.totalFee != null && propertyData.totalFee > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Kokonaisvastike</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.totalFee)}/kk</span>
                      </div>
                    )}
                    {propertyData.waterFee != null && propertyData.waterFee > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Vesimaksu</span>
                        <span className="font-semibold">{formatEuroCurrency(propertyData.waterFee)}/hlö/kk</span>
                      </div>
                    )}
                    {propertyData.propertyTax && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Kiinteistövero</span>
                        <span className="font-semibold">{propertyData.propertyTax} €/v</span>
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
                    Yhtiötiedot
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
                          <span className="text-gray-600">Yhtiön nimi</span>
                          <span className="font-semibold">{propertyData.housingCompanyName}</span>
                        </div>
                      )}
                      {propertyData.businessId && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Y-tunnus</span>
                          <span className="font-semibold">{propertyData.businessId}</span>
                        </div>
                      )}
                      {propertyData.managerName && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Isännöitsijä</span>
                          <span className="font-semibold">{propertyData.managerName}</span>
                        </div>
                      )}
                      {propertyData.managerPhone && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Isännöitsijän puhelin</span>
                          <span className="font-semibold">{propertyData.managerPhone}</span>
                        </div>
                      )}
                      {propertyData.managerEmail && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Isännöitsijän sähköposti</span>
                          <span className="font-semibold">{propertyData.managerEmail}</span>
                        </div>
                      )}
                      {propertyData.propertyMaintenance && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Kiinteistönhoito</span>
                          <span className="font-semibold">{propertyData.propertyMaintenance}</span>
                        </div>
                      )}
                      {propertyData.numberOfShares && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Osakkeiden numerot</span>
                          <span className="font-semibold">{propertyData.numberOfShares}</span>
                        </div>
                      )}
                      {propertyData.redemptionClauseFlats !== undefined && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Lunastuspykälä</span>
                          <span className="font-semibold">{propertyData.redemptionClauseFlats ? 'Kyllä' : 'Ei'}</span>
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
                  Rakennustiedot
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
                        <span className="text-gray-600">Lämmitysjärjestelmä</span>
                        <span className="font-semibold">{propertyData.heatingSystem}</span>
                      </div>
                    )}
                    {propertyData.roofType && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Kattotyyppi</span>
                        <span className="font-semibold">{propertyData.roofType}</span>
                      </div>
                    )}
                    {propertyData.condition && typeof propertyData.condition === 'string' && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Kunto</span>
                        <span className="font-semibold">{propertyData.condition}</span>
                      </div>
                    )}
                    {propertyData.sauna !== undefined && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Sauna</span>
                        <span className="font-semibold">{propertyData.sauna ? 'Kyllä' : 'Ei'}</span>
                      </div>
                    )}
                    {propertyData.balcony !== undefined && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Parveke</span>
                        <span className="font-semibold">{propertyData.balcony ? 'Kyllä' : 'Ei'}</span>
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
                    Varusteet ja tilat
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
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Keittiö</h4>
                          <p className="text-gray-600">{propertyData.kitchenEquipment}</p>
                        </div>
                      )}
                      {propertyData.bathroomEquipment && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Kph/WC</h4>
                          <p className="text-gray-600">{propertyData.bathroomEquipment}</p>
                        </div>
                      )}
                      {propertyData.floorMaterial && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Lattiamateriaalit</h4>
                          <p className="text-gray-600">{propertyData.floorMaterial}</p>
                        </div>
                      )}
                      {propertyData.storageSpace && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Säilytystilat</h4>
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
                    Sijainti ja ympäristö
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
                          <span className="text-gray-600">Näkymä / Ikkunoiden suunta</span>
                          <span className="font-semibold">{propertyData.windowDirection}</span>
                        </div>
                      )}
                      {propertyData.services && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Palvelut</h4>
                          <p className="text-gray-600">{propertyData.services}</p>
                        </div>
                      )}
                      {propertyData.beachRights && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Ranta / Rannan omistus</span>
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
                    Esitteet ja videot
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
                          <span className="text-gray-600">Esite (PDF)</span>
                          <a 
                            href={propertyData.brochureUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[var(--color-primary)] hover:underline font-semibold"
                          >
                            Avaa esite →
                          </a>
                        </div>
                      )}
                      {propertyData.videoUrl && (
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-gray-600">Video / Virtuaalikierros</span>
                          <a 
                            href={propertyData.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[var(--color-primary)] hover:underline font-semibold"
                          >
                            Katso video →
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
                  Muut tiedot
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
                        <span className="text-gray-600">Vapautuu</span>
                        <span className="font-semibold">{propertyData.availability}</span>
                      </div>
                    )}
                    {propertyData.zoningSituation && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Kaavoitustilanne</span>
                        <span className="font-semibold">{propertyData.zoningSituation}</span>
                      </div>
                    )}
                    {propertyData.buildingRights && typeof propertyData.buildingRights === 'string' && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Rakennusoikeus</span>
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