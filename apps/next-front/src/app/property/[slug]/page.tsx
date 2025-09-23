'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Facebook, Linkedin, Mail, Phone, MapPin, Home, Bath, Maximize, FileText } from 'lucide-react';
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
    buildingInfo: true,
    otherInfo: true
  });

  useEffect(() => {
    async function loadProperty() {
      try {
        // Fetch property data from our API route
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
      } catch (error) {
        console.error('Error loading property:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [slug]);

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

  // Extract property data - handle both WordPress and Linear API formats
  // If acfRealEstate exists, use its property data, otherwise use the root property object
  const propertyData = property.acfRealEstate?.property || property;
  const agentData = property.acfRealEstate?.agent || property.agent || {};
  
  // Get images array
  const images = propertyData.gallery || property.images || (property.featuredImage ? [property.featuredImage] : []);
  
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseInt(price.replace(/\D/g, '')) : price;
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatNumber = (num: number | string) => {
    return new Intl.NumberFormat('fi-FI').format(Number(num));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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
        {/* Image Carousel Section */}
        <div className="relative">
          {activeTab === 'photos' && images.length > 0 && (
            <div className="relative h-[70vh] min-h-[600px] bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={images[currentImageIndex]?.url || images[currentImageIndex]?.sourceUrl || images[currentImageIndex]}
                  alt={`Property image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 w-12 h-12 rounded-full hover:bg-white transition-colors shadow-lg flex items-center justify-center"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 w-12 h-12 rounded-full hover:bg-white transition-colors shadow-lg flex items-center justify-center"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-6 right-6 bg-black/70 text-white px-4 py-2 rounded">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                  <div className="flex gap-2 justify-center overflow-x-auto max-w-6xl mx-auto">
                    {images.map((image: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 overflow-hidden transition-all ${
                          currentImageIndex === index ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={image.url || image.sourceUrl || image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'floorplan' && (
            <div className="relative h-[70vh] min-h-[600px] bg-gray-100">
              <div className="container mx-auto px-4 py-8 h-full flex items-center justify-center">
                {propertyData.floorPlanUrl || propertyData.floorplan ? (
                  <div className="relative h-full w-full max-w-4xl">
                    <Image
                      src={propertyData.floorPlanUrl || propertyData.floorplan}
                      alt="Floor plan"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Pohjakuva</h2>
                    <p className="text-gray-500">Ei saatavilla</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="relative h-[70vh] min-h-[600px] bg-gray-100">
              <div className="h-full bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sijainti kartalla</h2>
                  <p className="text-gray-500">Kartta ladataan...</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brochure' && (
            <div className="relative h-[70vh] min-h-[600px] bg-gray-100">
              <div className="h-full">
                {propertyData.propertyBrochureUrl || propertyData.brochure || propertyData.virtualShowing ? (
                  <iframe
                    src={propertyData.propertyBrochureUrl || propertyData.brochure || propertyData.virtualShowing}
                    className="w-full h-full border-0"
                    title="Property Brochure"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Esite</h2>
                      <p className="text-gray-500">Ei saatavilla</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="relative h-[70vh] min-h-[600px] bg-gray-100">
              <div className="h-full flex items-center justify-center px-4">
                {propertyData.videoUrl || propertyData.youtubeUrl || propertyData.video ? (
                  <div className="w-full max-w-5xl">
                    <div className="aspect-video">
                      <iframe
                        src={propertyData.videoUrl || propertyData.youtubeUrl || propertyData.video}
                        className="w-full h-full rounded-lg shadow-xl"
                        allowFullScreen
                        title="Property Video"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Video</h2>
                    <p className="text-gray-500">Ei saatavilla</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation - Bottom Position like Sotheby's */}
        <div className="bg-gray-100 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-6 py-4 font-medium text-sm uppercase tracking-wider transition-all relative ${
                    activeTab === 'photos' 
                      ? 'bg-white text-[var(--color-primary)]' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Valokuvat
                  {activeTab === 'photos' && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('floorplan')}
                  className={`px-6 py-4 font-medium text-sm uppercase tracking-wider transition-all relative ${
                    activeTab === 'floorplan' 
                      ? 'bg-white text-[var(--color-primary)]' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pohjakuva
                  {activeTab === 'floorplan' && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`px-6 py-4 font-medium text-sm uppercase tracking-wider transition-all relative ${
                    activeTab === 'map' 
                      ? 'bg-white text-[var(--color-primary)]' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Kohde kartalla
                  {activeTab === 'map' && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('brochure')}
                  className={`px-6 py-4 font-medium text-sm uppercase tracking-wider transition-all relative ${
                    activeTab === 'brochure' 
                      ? 'bg-white text-[var(--color-primary)]' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Selaa esitettä
                  {activeTab === 'brochure' && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)]"></div>
                  )}
                </button>
                {(propertyData.videoUrl || propertyData.youtubeUrl || propertyData.video) && (
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`px-6 py-4 font-medium text-sm uppercase tracking-wider transition-all relative ${
                      activeTab === 'video' 
                        ? 'bg-white text-[var(--color-primary)]' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Katso video
                    {activeTab === 'video' && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)]"></div>
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
                  {propertyData.area} m<sup>2</sup>
                </h3>
                <p className="text-sm text-gray-600 mt-2">ASUINPINTA-ALA</p>
              </div>
            )}
            {propertyData.totalArea && (
              <div>
                <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                  {propertyData.totalArea} m<sup>2</sup>
                </h3>
                <p className="text-sm text-gray-600 mt-2">KOKONAISALA</p>
              </div>
            )}
            {propertyData.price && (
              <div>
                <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                  {formatPrice(propertyData.price)}
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
            {propertyData.plotArea && (
              <div>
                <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                  {formatNumber(propertyData.plotArea)} m<sup>2</sup>
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
                {propertyData.address}, {propertyData.zipCode} {propertyData.city}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {propertyData.price && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Velaton myyntihinta</span>
                        <span className="font-semibold">{formatPrice(propertyData.price)}</span>
                      </div>
                    )}
                    {propertyData.debtFreePrice && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Velkaosuus</span>
                        <span className="font-semibold">{formatPrice(propertyData.debtFreePrice)}</span>
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
                  </div>
                </div>
              )}
            </div>

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