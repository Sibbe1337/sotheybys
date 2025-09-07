'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPlaceholderImage } from '@/config/images';

interface PropertyWithACF {
  title: string;
  slug: string;
  content?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
  images?: Array<{
    url: string;
    title?: string;
    isMain?: boolean;
  }>;
  acfRealEstate?: {
    property?: {
      address?: string;
      city?: string;
      price?: string;
      debtFreePrice?: string;
      area?: string;
      rooms?: string;
      bedrooms?: string;
      bathrooms?: string;
      propertyType?: string;
      status?: string;
      description?: string;
      externalLinks?: Array<{
        label: string;
        url: string;
      }>;
      videoUrl?: string | null;
      // Additional property details
      maintenanceCharge?: string;
      waterCharge?: string;
      shareNumbers?: string;
      floor?: string;
      floorCount?: string;
      energyClass?: string;
      constructionMaterial?: string;
      housingCooperativeName?: string;
      propertyManagerName?: string;
      propertyManagerOffice?: string;
      heatingSystem?: string;
      constructionYear?: string;
      lotOwnership?: string;
      // Additional detailed fields
      balcony?: string;
      terrace?: string;
      sauna?: string;
      elevator?: string;
      parkingSpaces?: string;
      lotArea?: string;
      buildingMaterialFacade?: string;
      roofMaterial?: string;
      roofType?: string;
      windowsDirection?: string;
      kitchenDescription?: string;
      bathroomDescription?: string;
      condition?: string;
      furnished?: string;
      antenna?: string;
      autoparkingType?: string;
      generalCondition?: string;
      listingType?: string;
    };
    agent?: {
      name?: string;
      phone?: string;
      email?: string;
    };
  };
}

interface PropertyDetailClientProps {
  property: PropertyWithACF;
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const propertyData = property.acfRealEstate?.property;
  const agentData = property.acfRealEstate?.agent;
  
  // Use actual images from the property if available, otherwise use placeholders
  const propertyImages = property.images?.map(img => img.url) || [];
  const featuredImage = property.featuredImage?.node.sourceUrl || getPlaceholderImage('property');
  
  // Combine featured image with other images
  const images = propertyImages.length > 0 
    ? propertyImages 
    : [featuredImage, ...Array(5).fill(getPlaceholderImage('property'))];

  // Map external links to button actions
  const getButtonFromLink = (label: string) => {
    const lowerLabel = label.toLowerCase();
    
    if (lowerLabel.includes('kotisivut')) {
      return { icon: '', text: 'KOTISIVUT', primary: false };
    } else if (lowerLabel.includes('selattava esite')) {
      return { icon: '', text: 'SELAA ESITETTÄ', primary: true };
    } else if (lowerLabel.includes('virtual property')) {
      return { icon: '', text: 'VIRTUAL TOUR', primary: false };
    } else if (lowerLabel.includes('youtube')) {
      return { icon: '', text: 'KATSO VIDEO', primary: true };
    } else if (lowerLabel.includes('sir')) {
      return { icon: '', text: 'SIR LISTING', primary: false };
    }
    return { icon: '', text: label, primary: false };
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Gallery with Controls */}
        <section className="relative bg-gray-900">
          {/* Main Image */}
          <div className="relative h-[50vh] lg:h-[70vh]">
            <Image
              src={images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 
                       text-white p-3 transition-colors"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 
                       text-white p-3 transition-colors"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Property Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
              <div className="container mx-auto">
                <div className="text-white">
                  <h1 className="text-3xl lg:text-5xl font-thin mb-2">
                    {propertyData?.address || property.title}
                  </h1>
                  <div className="flex items-center gap-4 text-lg">
                    {propertyData?.city && <span>{propertyData.city}</span>}
                    {propertyData?.area && (
                      <>
                        <span className="text-white/60">•</span>
                        <span>{propertyData.area} m²</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Info Badge */}
              <button className="absolute bottom-8 right-8 bg-white/20 backdrop-blur-sm px-4 py-2 
                               text-white border border-white/30 hover:bg-white/30 transition-colors">
                KOHTEEN LISÄTIEDOT
              </button>
            </div>
          </div>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="bg-[#1a3a4a] py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {/* Photo Gallery Button */}
              <button className="flex items-center gap-2 px-6 py-3 bg-[#002349] text-white 
                               hover:bg-[#003366] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                VALOKUVAT
              </button>

              {/* Floor Plan Button */}
              <button className="flex items-center gap-2 px-6 py-3 bg-transparent text-white 
                               border border-white/30 hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                POHJAKUVA
              </button>

              {/* Map Button */}
              <button className="flex items-center gap-2 px-6 py-3 bg-transparent text-white 
                               border border-white/30 hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                KOHDE KARTALLA
              </button>

              {/* External Links as Buttons */}
              {propertyData?.externalLinks?.map((link, index) => {
                const button = getButtonFromLink(link.label);
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-6 py-3 transition-colors ${
                      button.primary 
                        ? 'bg-[#002349] text-white hover:bg-[#003366]' 
                        : 'bg-transparent text-white border border-white/30 hover:bg-white/10'
                    }`}
                  >
                    {button.text}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Thumbnail Gallery */}
        <section className="bg-gray-100 py-4">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 w-24 h-24 lg:w-32 lg:h-32 overflow-hidden 
                            ${index === currentImageIndex ? 'ring-2 ring-[#002349]' : ''}`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 96px, 128px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Property Header Metrics */}
        <section className="bg-gray-50 py-8 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {propertyData?.area && (
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-light text-gray-900 mb-1">
                    {propertyData.area}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-600">
                    Asuinpinta-ala
                  </div>
                </div>
              )}
              {propertyData?.price && (
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-light text-gray-900 mb-1">
                    {parseInt(propertyData.price).toLocaleString('fi-FI')} €
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-600">
                    Myyntihinta
                  </div>
                </div>
              )}
              {propertyData?.city && (
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-light text-gray-900 mb-1">
                    {propertyData.city}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-600">
                    Kaupunginosa
                  </div>
                </div>
              )}
              {propertyData?.constructionYear && (
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-light text-gray-900 mb-1">
                    {propertyData.constructionYear}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-600">
                    Rakennusvuosi
                  </div>
                </div>
              )}
            </div>
            {/* Global Listing Indicator */}
            <div className="mt-6 text-center">
              <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Global listing
              </span>
            </div>
          </div>
        </section>

        {/* Property Title and Description Line */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl">
              <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
                {propertyData?.address || property.title}
                {propertyData?.city && `, ${propertyData.city}`}
              </h1>
              <p className="text-lg text-gray-600">
                {propertyData?.listingType || propertyData?.propertyType || 'Kiinteistö'} 
                {propertyData?.rooms && ` | ${propertyData.rooms}`}
              </p>
            </div>
          </div>
        </section>

        {/* Property Details */}
        <section className="py-12 lg:py-16 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Price and Key Info */}
                <div className="mb-8">
                  {propertyData?.price && (
                    <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
                      {parseInt(propertyData.price).toLocaleString('fi-FI')} €
                    </h2>
                  )}
                  
                  <div className="flex flex-wrap gap-6 text-gray-700">
                    {propertyData?.bedrooms && (
                      <div>
                        <span className="text-sm uppercase tracking-wider text-gray-500">Huoneet</span>
                        <p className="text-lg">{propertyData.bedrooms}</p>
                      </div>
                    )}
                    {propertyData?.propertyType && (
                      <div>
                        <span className="text-sm uppercase tracking-wider text-gray-500">Tyyppi</span>
                        <p className="text-lg">{propertyData.propertyType}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-12">
                  <h3 className="text-2xl font-light text-gray-900 mb-6">Kuvaus</h3>
                  {propertyData?.description ? (
                    <p className="text-gray-700 leading-relaxed font-light whitespace-pre-line">
                      {propertyData.description}
                    </p>
                  ) : property.content ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: property.content }}
                      className="text-gray-700 leading-relaxed font-light"
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed font-light">
                      Tämä upea kiinteistö tarjoaa modernit mukavuudet ja erinomaisen sijainnin.
                    </p>
                  )}
                </div>

                {/* Price and Cost Information */}
                <div className="bg-gray-50 p-8 rounded-lg mb-8">
                  <h3 className="text-2xl font-light text-gray-900 mb-6">Hinta- ja asuinkustannukset</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    {propertyData?.price && (
                      <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                        <span className="text-gray-700">Myyntihinta</span>
                        <span className="text-lg font-medium text-gray-900">
                          {parseInt(propertyData.price).toLocaleString('fi-FI')} €
                        </span>
                      </div>
                    )}
                    {propertyData?.debtFreePrice && (
                      <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                        <span className="text-gray-700">Velaton myyntihinta</span>
                        <span className="text-lg font-medium text-gray-900">
                          {parseInt(propertyData.debtFreePrice).toLocaleString('fi-FI')} €
                        </span>
                      </div>
                    )}
                    {propertyData?.maintenanceCharge && (
                      <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                        <span className="text-gray-700">Hoitovastike</span>
                        <span className="text-gray-900">{propertyData.maintenanceCharge} €/kk</span>
                      </div>
                    )}
                    {propertyData?.waterCharge && (
                      <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                        <span className="text-gray-700">Vesimaksu</span>
                        <span className="text-gray-900">{propertyData.waterCharge} €/kk</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Property Details */}
                <div className="bg-white border border-gray-200 p-8 rounded-lg mb-8">
                  <h3 className="text-2xl font-light text-gray-900 mb-6">Huoneistotiedot</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                    {propertyData?.shareNumbers && (
                      <div className="flex justify-between items-baseline py-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider">Osake No:t</span>
                        <span className="text-gray-900">{propertyData.shareNumbers}</span>
                      </div>
                    )}
                    {propertyData?.floor && propertyData?.floorCount && (
                      <div className="flex justify-between items-baseline py-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider">Kerrosluku</span>
                        <span className="text-gray-900">{propertyData.floor}/{propertyData.floorCount}</span>
                      </div>
                    )}
                    {propertyData?.area && (
                      <div className="flex justify-between items-baseline py-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider">Pinta-ala</span>
                        <span className="text-gray-900">{propertyData.area} m²</span>
                      </div>
                    )}
                    {propertyData?.rooms && (
                      <div className="flex justify-between items-baseline py-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider">Huoneisto</span>
                        <span className="text-gray-900">{propertyData.rooms}</span>
                      </div>
                    )}
                    {propertyData?.propertyType && (
                      <div className="flex justify-between items-baseline py-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider">Tyyppi</span>
                        <span className="text-gray-900">{propertyData.propertyType}</span>
                      </div>
                    )}
                    {propertyData?.balcony && (
                      <div className="flex justify-between items-baseline py-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider">Parveke</span>
                        <span className="text-gray-900">{propertyData.balcony}</span>
                      </div>
                    )}
                    {propertyData?.terrace && (
                      <div className="flex justify-between items-baseline py-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider">Terassi</span>
                        <span className="text-gray-900">{propertyData.terrace}</span>
                      </div>
                    )}
                    {propertyData?.windowsDirection && (
                      <div className="flex justify-between items-baseline py-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider">Ikk.suunta / näköala</span>
                        <span className="text-gray-900">{propertyData.windowsDirection}</span>
                      </div>
                    )}
                    {propertyData?.condition && (
                      <div className="flex justify-between items-baseline py-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider">Kunto</span>
                        <span className="text-gray-900">{propertyData.condition}</span>
                      </div>
                    )}
                    {propertyData?.elevator && (
                      <div className="flex justify-between items-baseline py-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider">Hissi</span>
                        <span className="text-gray-900">{propertyData.elevator}</span>
                      </div>
                    )}
                    {propertyData?.sauna && (
                      <div className="flex justify-between items-baseline py-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider">Sauna</span>
                        <span className="text-gray-900">{propertyData.sauna}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Kitchen and Bathroom descriptions */}
                  {(propertyData?.kitchenDescription || propertyData?.bathroomDescription) && (
                    <div className="mt-6 space-y-4">
                      {propertyData?.kitchenDescription && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">Keittiö</h4>
                          <p className="text-gray-700">{propertyData.kitchenDescription}</p>
                        </div>
                      )}
                      {propertyData?.bathroomDescription && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">Kph/WC</h4>
                          <p className="text-gray-700">{propertyData.bathroomDescription}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Energy Information */}
                {propertyData?.energyClass && (
                  <div className="bg-gray-50 p-8 rounded-lg mb-8">
                    <h3 className="text-2xl font-light text-gray-900 mb-6">Energialuokitus</h3>
                    <div className="flex items-center gap-4">
                      <div className={`px-6 py-3 text-white font-medium rounded-lg ${
                        propertyData.energyClass.startsWith('A') ? 'bg-green-600' :
                        propertyData.energyClass.startsWith('B') ? 'bg-green-500' :
                        propertyData.energyClass.startsWith('C') ? 'bg-yellow-500' :
                        propertyData.energyClass.startsWith('D') ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}>
                        {propertyData.energyClass}
                      </div>
                      <span className="text-gray-700">Energiatodistus on</span>
                    </div>
                  </div>
                )}

                {/* Building Information */}
                <div className="bg-white border border-gray-200 p-8 rounded-lg mb-8">
                  <h3 className="text-2xl font-light text-gray-900 mb-6">Yhtiö- ja kiinteistötiedot</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                    {propertyData?.housingCooperativeName && (
                      <div className="md:col-span-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider block mb-1">Taloyhtiön nimi</span>
                        <span className="text-gray-900">{propertyData.housingCooperativeName}</span>
                      </div>
                    )}
                    {(propertyData?.propertyManagerName || propertyData?.propertyManagerOffice) && (
                      <div className="md:col-span-2">
                        <span className="text-gray-600 text-sm uppercase tracking-wider block mb-1">Isännöitsijä</span>
                        <span className="text-gray-900">
                          {propertyData.propertyManagerName}
                          {propertyData.propertyManagerOffice && ` - ${propertyData.propertyManagerOffice}`}
                        </span>
                      </div>
                    )}
                    {propertyData?.constructionYear && (
                      <div>
                        <span className="text-gray-600 text-sm uppercase tracking-wider block mb-1">Rakennusvuosi</span>
                        <span className="text-gray-900">{propertyData.constructionYear}</span>
                      </div>
                    )}
                    {propertyData?.constructionMaterial && (
                      <div>
                        <span className="text-gray-600 text-sm uppercase tracking-wider block mb-1">Rakennusaine</span>
                        <span className="text-gray-900">{propertyData.constructionMaterial}</span>
                      </div>
                    )}
                    {propertyData?.heatingSystem && (
                      <div>
                        <span className="text-gray-600 text-sm uppercase tracking-wider block mb-1">Lämmitys</span>
                        <span className="text-gray-900">{propertyData.heatingSystem}</span>
                      </div>
                    )}
                    {propertyData?.lotOwnership && (
                      <div>
                        <span className="text-gray-600 text-sm uppercase tracking-wider block mb-1">Tontin omistus</span>
                        <span className="text-gray-900">{propertyData.lotOwnership}</span>
                      </div>
                    )}
                    {propertyData?.lotArea && (
                      <div>
                        <span className="text-gray-600 text-sm uppercase tracking-wider block mb-1">Tontin pinta-ala</span>
                        <span className="text-gray-900">{propertyData.lotArea}</span>
                      </div>
                    )}
                    {propertyData?.roofType && (
                      <div>
                        <span className="text-gray-600 text-sm uppercase tracking-wider block mb-1">Kattotyyppi</span>
                        <span className="text-gray-900">{propertyData.roofType}</span>
                      </div>
                    )}
                    {propertyData?.roofMaterial && (
                      <div>
                        <span className="text-gray-600 text-sm uppercase tracking-wider block mb-1">Kattomateriaali</span>
                        <span className="text-gray-900">{propertyData.roofMaterial}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Surface Materials Section */}
                {(propertyData?.buildingMaterialFacade || propertyData?.windowsDirection) && (
                  <div className="bg-gray-50 p-8 rounded-lg mb-8">
                    <h3 className="text-2xl font-light text-gray-900 mb-6">Pintamateriaalit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                      {propertyData?.buildingMaterialFacade && (
                        <div>
                          <span className="text-gray-600 text-sm uppercase tracking-wider block mb-1">Julkisivu</span>
                          <span className="text-gray-900">{propertyData.buildingMaterialFacade}</span>
                        </div>
                      )}
                      {propertyData?.windowsDirection && (
                        <div>
                          <span className="text-gray-600 text-sm uppercase tracking-wider block mb-1">Ikkunoiden suunta</span>
                          <span className="text-gray-900">{propertyData.windowsDirection}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Storage Spaces Section */}
                <div className="bg-white border border-gray-200 p-8 rounded-lg mb-8">
                  <h3 className="text-2xl font-light text-gray-900 mb-6">Säilytystilat</h3>
                  <p className="text-gray-700">
                    Kiinteistössä on runsaasti säilytystilaa. Lisätietoja säilytystiloista saat ottamalla yhteyttä välittäjään.
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Parking and Additional Info */}
                {(propertyData?.parkingSpaces || propertyData?.autoparkingType || propertyData?.antenna || propertyData?.furnished) && (
                  <div className="bg-white border border-gray-200 p-8 rounded-lg mb-8">
                    <h3 className="text-xl font-light text-gray-900 mb-6">Muut tiedot</h3>
                    <div className="space-y-4">
                      {propertyData?.parkingSpaces && (
                        <div className="flex justify-between items-baseline py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm uppercase tracking-wider">Autopaikat</span>
                          <span className="text-gray-900">{propertyData.parkingSpaces}</span>
                        </div>
                      )}
                      {propertyData?.autoparkingType && (
                        <div className="flex justify-between items-baseline py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm uppercase tracking-wider">Autopaikkatyyppi</span>
                          <span className="text-gray-900">{propertyData.autoparkingType}</span>
                        </div>
                      )}
                      {propertyData?.antenna && (
                        <div className="flex justify-between items-baseline py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm uppercase tracking-wider">Antenni</span>
                          <span className="text-gray-900">{propertyData.antenna}</span>
                        </div>
                      )}
                      {propertyData?.furnished && (
                        <div className="flex justify-between items-baseline py-2">
                          <span className="text-gray-600 text-sm uppercase tracking-wider">Kalustettu</span>
                          <span className="text-gray-900">{propertyData.furnished}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Agent Info */}
                {agentData && (
                  <div className="bg-[#002349] text-white p-8 rounded-lg mb-8">
                    <h3 className="text-xl font-light mb-6">Yhteyshenkilö</h3>
                    {agentData.name && (
                      <p className="text-lg font-light mb-2">{agentData.name}</p>
                    )}
                    {agentData.phone && (
                      <a 
                        href={`tel:${agentData.phone}`}
                        className="block text-white/90 hover:text-white transition-colors mb-1"
                      >
                        {agentData.phone}
                      </a>
                    )}
                    {agentData.email && (
                      <a 
                        href={`mailto:${agentData.email}`}
                        className="block text-white/90 hover:text-white transition-colors mb-6"
                      >
                        {agentData.email}
                      </a>
                    )}
                    <Link
                      href="/ota-yhteytta"
                      className="block w-full text-center bg-white text-[#002349] py-3 px-6 
                              hover:bg-gray-100 transition-colors duration-300 
                              font-light uppercase tracking-wider text-sm"
                    >
                      Ota yhteyttä
                    </Link>
                  </div>
                )}

                {/* Request Info Form */}
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="text-xl font-light text-gray-900 mb-6">Pyydä lisätietoja</h3>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nimi"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                              focus:outline-none focus:border-[#002349] font-light"
                    />
                    <input
                      type="email"
                      placeholder="Sähköposti"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                              focus:outline-none focus:border-[#002349] font-light"
                    />
                    <input
                      type="tel"
                      placeholder="Puhelin"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                              focus:outline-none focus:border-[#002349] font-light"
                    />
                    <textarea
                      placeholder="Viesti"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                              focus:outline-none focus:border-[#002349] font-light resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#002349] text-white py-3 px-6 
                              hover:bg-[#001731] transition-colors duration-300 
                              font-light uppercase tracking-wider text-sm"
                    >
                      Lähetä viesti
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Back to Properties */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <Link 
                href="/kohteet"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 
                        font-light transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Takaisin kohteisiin
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
