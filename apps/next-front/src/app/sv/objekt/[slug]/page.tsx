'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Facebook, Linkedin, Mail } from 'lucide-react';
import { getYouTubeEmbedUrl, isValidYouTubeUrl } from '@/lib/utils';
import { 
  MultilingualPropertyListing, 
  getLocalizedValue, 
  formatPriceLocalized,
  formatAreaLocalized 
} from '@/lib/property-types-multilang';

interface PropertyPageProps {
  params: {
    slug: string;
  };
}

export default function SwedishPropertyPage({ params }: PropertyPageProps) {
  const { slug } = params;
  const language = 'sv' as const;
  const [property, setProperty] = useState<MultilingualPropertyListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('photos');

  useEffect(() => {
    async function loadProperty() {
      try {
        const response = await fetch(`/api/property/${slug}?lang=${language}`);
        
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

        // Debug: Check for LocalizedString objects in wrong fields
        const prop = result.data;
        console.log('🔍 Client Debug - Field Types:', {
          postalCode: { type: typeof prop.postalCode, value: prop.postalCode },
          energyClass: { type: typeof prop.energyClass, value: prop.energyClass },
          estateAgentName: { type: typeof prop.estateAgentName, value: prop.estateAgentName },
          estateAgentPhone: { type: typeof prop.estateAgentPhone, value: prop.estateAgentPhone },
          estateAgentEmail: { type: typeof prop.estateAgentEmail, value: prop.estateAgentEmail },
        });
        
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002349]"></div>
      </div>
    );
  }

  if (!property) {
    notFound();
  }

  const title = getLocalizedValue(property.heading, language, 'fi');
  const address = getLocalizedValue(property.streetAddress, language, 'fi');
  const city = getLocalizedValue(property.city, language, 'fi');
  const description = getLocalizedValue(property.description, language, 'fi');
  const images = property.photoUrls || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#002349] text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-6">
            <div className="text-sm">
              <Link href="/sv/objekt" className="text-white/90 hover:text-white transition-colors">
                Objekt Till Salu
              </Link>
              <span className="mx-2 text-white/60">»</span>
              <span className="text-white">{title}</span>
            </div>
            <Link 
              href={`mailto:info@sothebysrealty.fi?subject=Förfrågan om: ${title}`}
              className="inline-block px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-[#002349] transition-all duration-300 uppercase tracking-wider text-sm font-medium"
            >
              Kontakta Oss
            </Link>
          </div>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div className="relative">
        {activeTab === 'photos' && images.length > 0 && (
          <div className="relative bg-black">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0">
                {images.map((imageSrc, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      currentImageIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <Image
                      src={imageSrc}
                      alt={`${title} - Bild ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="100vw"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white w-14 h-14 flex items-center justify-center transition-all hover:bg-white/20"
                  aria-label="Föregående bild"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white w-14 h-14 flex items-center justify-center transition-all hover:bg-white/20"
                  aria-label="Nästa bild"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
                <div className="absolute bottom-4 right-4 text-white text-sm font-light tracking-wider">
                  {currentImageIndex + 1} — {images.length}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Property Details */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {property.livingArea > 0 && (
              <div>
                <h3 className="text-3xl font-bold text-[#002349]">
                  {formatAreaLocalized(property.livingArea, language)}
                </h3>
                <p className="text-sm text-gray-600 mt-2">BOAREA</p>
              </div>
            )}
            {property.salesPrice > 0 && (
              <div>
                <h3 className="text-3xl font-bold text-[#002349]">
                  {formatPriceLocalized(property.salesPrice, language)}
                </h3>
                <p className="text-sm text-gray-600 mt-2">FÖRSÄLJNINGSPRIS</p>
              </div>
            )}
            {city && (
              <div>
                <h3 className="text-3xl font-bold text-[#002349]">{city}</h3>
                <p className="text-sm text-gray-600 mt-2">STADSDEL</p>
              </div>
            )}
            {property.energyClass && (
              <div>
                <h3 className="text-3xl font-bold text-[#002349]">{property.energyClass}</h3>
                <p className="text-sm text-gray-600 mt-2">ENERGIKLASS</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Property Title and Description */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#002349] mb-4">
              {title}
            </h1>
            {address && (
              <h2 className="text-xl text-gray-600 mb-2">
                {address}, {property.postalCode} {city}
              </h2>
            )}
          </div>

          {/* Description */}
          <div className="max-w-4xl mx-auto">
            {description && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-[#002349] mb-4">Beskrivning</h3>
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              </div>
            )}
          </div>

          {/* Agent Contact */}
          {property.estateAgentName && (
            <div className="max-w-2xl mx-auto text-center py-8">
              <h3 className="text-2xl font-semibold mb-6">Ytterligare Information</h3>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{property.estateAgentName}</h3>
                  <p className="text-gray-600">Fastighetsmäklare</p>
                  {property.estateAgentPhone && (
                    <p className="mt-2">
                      <a href={`tel:${property.estateAgentPhone}`} className="text-[#002349] hover:underline">
                        {property.estateAgentPhone}
                      </a>
                    </p>
                  )}
                  {property.estateAgentEmail && (
                    <p>
                      <a href={`mailto:${property.estateAgentEmail}`} className="text-[#002349] hover:underline">
                        {property.estateAgentEmail}
                      </a>
                    </p>
                  )}
                  <a 
                    href={`mailto:${property.estateAgentEmail || 'info@sothebysrealty.fi'}`}
                    className="inline-block mt-4 bg-[#002349] text-white px-6 py-3 rounded hover:bg-[#001731] transition-colors"
                  >
                    KONTAKTA OSS
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Amenities */}
          {(property.sauna || property.balcony || property.energyCertificate) && (
            <div className="max-w-4xl mx-auto mt-8">
              <h3 className="text-2xl font-semibold text-[#002349] mb-4">Bekvämligheter</h3>
              <div className="flex gap-3 flex-wrap">
                {property.sauna && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                    🧖 Bastu
                  </span>
                )}
                {property.balcony && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
                    🪴 Balkong
                  </span>
                )}
                {property.energyCertificate && (
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
                    ⚡ Energicertifikat
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

