'use client';

import { useEffect, useState } from 'react';
import HeroCarousel from '@/components/Homepage/HeroCarousel';
import FeaturedPropertyGrid from '@/components/Property/FeaturedPropertyGrid';
import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { VideoSection } from '@/components/ui/VideoSection';
import { getHomepageTranslation, type SupportedLanguage } from '@/lib/homepage-translations';
// Legacy imports removed - now using new API endpoints
import type { Locale } from '@/i18n/config';

// Function to get translated hero slides
const getTranslatedSlides = (language: SupportedLanguage) => [
  {
    id: '1',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/57809e7b-2fe2-430d-a7d7-aff39337d0c1/ead27130-4e08-465e-af6d-500d593ae0db.jpg',
    title: getHomepageTranslation('hero1Title', language),
    subtitle: getHomepageTranslation('hero1Subtitle', language),
    buttonText: getHomepageTranslation('hero1Button', language),
    buttonLink: '/yhteystiedot'
  },
  {
    id: '2',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/3cfbb584-8fc0-493a-8b2f-66edf18b027a/e3ffa954-b4a1-4ed6-bed1-f131955d96c2.jpg',
    title: getHomepageTranslation('hero2Title', language),
    subtitle: getHomepageTranslation('hero2Subtitle', language),
    buttonText: getHomepageTranslation('hero2Button', language),
    buttonLink: '/kohteet'
  },
  {
    id: '3',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/d01a884f-d504-4652-adf7-29026c1a7449/700fc7d6-6bab-4e3b-baf8-816b8a9f5a02.jpg',
    title: getHomepageTranslation('hero3Title', language),
    subtitle: getHomepageTranslation('hero3Subtitle', language),
    buttonText: getHomepageTranslation('hero3Button', language),
    buttonLink: '/yritys'
  },
  {
    id: '4',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/95bfa5eb-449f-40b8-987b-6f65dde19cc0/9e7aa9bf-6a73-4120-a0f4-b75e1eb29b4c.jpg',
    title: getHomepageTranslation('hero4Title', language),
    subtitle: getHomepageTranslation('hero4Subtitle', language),
    buttonText: getHomepageTranslation('hero4Button', language),
    buttonLink: '/kohteet/referenssit'
  }
];

// Sample properties matching the original site data
const sampleProperties = [
  {
    id: '1',
    title: 'Tehtaankatu 19 G',
    slug: 'tehtaankatu-19-g',
    featuredImage: {
      node: {
        sourceUrl: 'https://d33xsej2pkrh3b.cloudfront.net/640x427,fit,q85,f=webp/oviproprodmedia/Production/realty/b826dae2-022f-4c20-ab1d-0d2cd695b169/0953adec-13b7-4694-b9d8-0750f8a98eb1.jpg',
        altText: 'Tehtaankatu 19 G'
      }
    },
    acfRealEstate: {
      property: {
        price: '00150',
        address: 'Tehtaankatu 19 G',
        city: 'Helsinki',
        bedrooms: undefined,
        bathrooms: undefined,
        area: 97.21,
        propertyType: 'Kerrostalo',
        status: 'Myynnissä',
        description: '3h, k, makuu/työtila, parvitila, 2 x kph, 2 sis. käyntiä'
      }
    }
  },
  {
    id: '2',
    title: 'Vuosselintie 19',
    slug: 'vuosselintie-19',
    featuredImage: {
      node: {
        sourceUrl: 'https://d33xsej2pkrh3b.cloudfront.net/640x427,fit,q85,f=webp/oviproprodmedia/Production/realty/385f115f-21a1-4c3b-a6b6-01378b48a849/f152590d-9abc-457e-81c1-dc85b7749ee2.jpg',
        altText: 'Vuosselintie 19'
      }
    },
    acfRealEstate: {
      property: {
        price: undefined,
        address: 'Vuosselintie 19',
        city: 'Kuusamo',
        bedrooms: 6,
        bathrooms: undefined,
        area: 147,
        propertyType: 'Omakotitalo',
        status: 'Myynnissä',
        description: '6 mh, avok., oh, rt, parvi, aula, kph, s, 3 wc, khh/varasto, terassi, autokatos'
      }
    }
  },
  {
    id: '3',
    title: 'Kurö, Orrholmen',
    slug: 'kuro-orrholmen',
    featuredImage: {
      node: {
        sourceUrl: 'https://d33xsej2pkrh3b.cloudfront.net/640x427,fit,q85,f=webp/oviproprodmedia/Production/realty/d01a884f-d504-4652-adf7-29026c1a7449/700fc7d6-6bab-4e3b-baf8-816b8a9f5a02.jpg',
        altText: 'Kurö, Orrholmen'
      }
    },
    acfRealEstate: {
      property: {
        price: undefined,
        address: 'Kurö, Orrholmen',
        city: 'Raasepori',
        bedrooms: 4,
        bathrooms: undefined,
        area: 385,
        propertyType: 'Omakotitalo',
        status: 'Myynnissä',
        description: 'Päärakennus; 4mh, oh, rt x 2, Sivurakennus; 4mh, Saunarakennus.'
      }
    }
  },
  {
    id: '4',
    title: 'Nuikontie 140',
    slug: 'nuikontie-140',
    featuredImage: {
      node: {
        sourceUrl: 'https://d33xsej2pkrh3b.cloudfront.net/640x427,fit,q85,f=webp/oviproprodmedia/Production/realty/3cfbb584-8fc0-493a-8b2f-66edf18b027a/e3ffa954-b4a1-4ed6-bed1-f131955d96c2.jpg',
        altText: 'Nuikontie 140'
      }
    },
    acfRealEstate: {
      property: {
        price: '1200000',
        address: 'Nuikontie 140',
        city: 'Naantali',
        bedrooms: 2,
        bathrooms: 2,
        area: 158,
        propertyType: 'Omakotitalo',
        status: 'Myynnissä',
        description: '2 mh, olohuone, avok, rt, 2 kph, s, 3 wc, khh, vh, terassi, var, ak, rantasauna'
      }
    }
  },
  {
    id: '5',
    title: 'Albertinkatu 19 B',
    slug: 'albertinkatu-19-b',
    featuredImage: {
      node: {
        sourceUrl: 'https://d33xsej2pkrh3b.cloudfront.net/640x427,fit,q85,f=webp/oviproprodmedia/Production/realty/57809e7b-2fe2-430d-a7d7-aff39337d0c1/ead27130-4e08-465e-af6d-500d593ae0db.jpg',
        altText: 'Albertinkatu 19 B'
      }
    },
    acfRealEstate: {
      property: {
        price: undefined,
        address: 'Albertinkatu 19 B',
        city: 'Helsinki',
        bedrooms: 2,
        bathrooms: 2,
        area: 108,
        propertyType: 'Kerrostalo',
        status: 'Myynnissä',
        description: '2-3h, k, 2 kph/wc, et.'
      }
    }
  },
  {
    id: '6',
    title: 'Remmarholmen',
    slug: 'remmarholmen',
    featuredImage: {
      node: {
        sourceUrl: 'https://d33xsej2pkrh3b.cloudfront.net/640x427,fit,q85,f=webp/oviproprodmedia/Production/realty/a9b5f30b-cb2d-46d8-a821-7d6b2162e440/a81fd16d-1377-4f7e-bb38-f16e1fcd4c2a.jpg',
        altText: 'Remmarholmen'
      }
    },
    acfRealEstate: {
      property: {
        price: undefined,
        address: 'Remmarholmen',
        city: 'Kirkkonummi',
        bedrooms: 2,
        bathrooms: undefined,
        area: 150,
        propertyType: 'Omakotitalo',
        status: 'Myynnissä',
        description: 'Päärak: 2-3h, avok, kph, 2 wc, khh, et., Sivurak: avok, oh, Rantas. ja tupa, var'
      }
    }
  }
];

/**
 * Client component for homepage
 * Accepts locale as prop from server component parent
 */
import type { Property } from '@/lib/domain/property.types';

export default function HomePageClient({ 
  locale, 
  initialProperties = [] 
}: { 
  locale: Locale;
  initialProperties?: Property[];
}) {
  const language = locale as SupportedLanguage;
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);

  // 🏗️ SERVER-SIDE RENDERING: Properties are now fetched on server (no CORS!)
  useEffect(() => {
    if (initialProperties.length > 0) {
      console.log('✅ Using server-fetched properties:', initialProperties.length);
      setProperties(initialProperties);
    } else {
      console.warn('⚠️ No server properties, showing empty state');
    }
  }, [initialProperties]);

  // Get translated slides
  const heroSlides = getTranslatedSlides(language);
  const displayProperties = properties;

  // Split properties into references (sold) and featured (for sale)
  const referenceProperties = displayProperties.filter(p => 
    p.meta.status === 'SOLD' || p.meta.status === 'RESERVED'
  ).slice(0, 6);
  
  const featuredProperties = displayProperties.filter(p => 
    !p.meta.status || p.meta.status === 'ACTIVE'
  ).slice(0, 6);
  
  const rentalProperties = displayProperties.filter(p => 
    p.meta.rent && p.meta.rent > 0
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Carousel */}
        <HeroCarousel slides={heroSlides} />

        {/* Company Info Section */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
                Snellman Sotheby's International Realty®
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                {getHomepageTranslation('welcomeText', language)}
              </p>
            </div>
          </div>
        </section>

        {/* Reference Properties Section */}
        {referenceProperties.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-gray-900 mb-4">
                  {language === 'fi' ? 'Referenssit' : language === 'sv' ? 'Referenser' : 'References'}
                </h2>
                <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-6"></div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
                  {language === 'fi' ? 'Valikoima myydyistä kohteista' : language === 'sv' ? 'Urval av sålda objekt' : 'Selection of sold properties'}
                </p>
              </div>
              <FeaturedPropertyGrid properties={referenceProperties} locale={locale} />
              <div className="text-center mt-12">
                <Link
                  href="/kohteet/referenssit"
                  className="inline-block bg-[#1a3a4a] text-white px-8 py-3
                           hover:bg-[#0f2633] transition-colors duration-300
                           font-light uppercase tracking-wider text-sm"
                >
                  {language === 'fi' ? 'Tutustu kohteisiin' : language === 'sv' ? 'Se objekten' : 'View properties'}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Three Column Section - Avaamme uusia ovia */}
        <section id="avaamme-uusia-ovia" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8">
                {getHomepageTranslation('welcomeHeading', language)}
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                {getHomepageTranslation('welcomeText', language)}
              </p>
            </div>

            {/* Three Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 */}
              <Link href="/kohteet" className="relative h-80 group overflow-hidden block">
                <Image
                  src="/images/content/snellman-sothebys-yritys.jpg"
                  alt={getHomepageTranslation('openNewDoors', language)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">{getHomepageTranslation('openNewDoors', language)}</h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-2
                             group-hover:bg-white group-hover:text-[#1a3a4a] transition-all duration-300
                             font-light uppercase tracking-wider text-sm"
                  >
                    {getHomepageTranslation('findDreamHome', language)}
                  </span>
                </div>
              </Link>

              {/* Column 2 */}
              <Link href="/yritys" className="relative h-80 group overflow-hidden block">
                <Image
                  src="/images/content/snellman-sothebys-kutsu-arviokaynnille.jpg"
                  alt={getHomepageTranslation('expertiseHeading', language)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#324b72] bg-opacity-80 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">
                    {getHomepageTranslation('expertiseHeading', language)}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-2
                             group-hover:bg-white group-hover:text-[#324b72] transition-all duration-300
                             font-light uppercase tracking-wider text-sm"
                  >
                    {getHomepageTranslation('readMoreAboutUs', language)}
                  </span>
                </div>
              </Link>

              {/* Column 3 */}
              <div className="relative h-80 group overflow-hidden">
                <Image
                  src="/images/content/snellman-sothebys-nakoalapaikka.jpg"
                  alt={getHomepageTranslation('freeValuationHeading', language)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gray-800 bg-opacity-60 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">
                    {getHomepageTranslation('freeValuationHeading', language)}
                  </h3>
                  <a
                    href="#newsletter"
                    className="inline-block border-2 border-white text-white px-6 py-2
                             hover:bg-white hover:text-gray-800 transition-all duration-300
                             font-light uppercase tracking-wider text-sm"
                  >
                    {getHomepageTranslation('contactUs', language)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Hours Section */}
        <section className="py-12 bg-[#f8f8f8]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                {getHomepageTranslation('officeHoursLine1', language)}
              </h3>
              <p className="text-lg text-gray-700 font-light mb-2">
                {getHomepageTranslation('officeHoursLine2', language)}
              </p>
              <p className="text-lg text-gray-700 font-light">
                {getHomepageTranslation('officeHoursLine3', language)}
              </p>
              <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-6 text-gray-700">
                <a href="tel:+358103156900" className="hover:text-[var(--color-primary)] transition-colors font-light">
                  +358 (0)10 315 6900
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="https://goo.gl/maps/8HptT8TwUp42" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-[var(--color-primary)] transition-colors font-light">
                  Kasarmikatu 34, 00130 Helsinki
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="mailto:info@sothebysrealty.fi" className="hover:text-[var(--color-primary)] transition-colors font-light">
                  info@sothebysrealty.fi
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Luxury Outlook Report Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <Image
                    src="/images/content/luxury-outlook-2025.jpg"
                    alt="2025 Luxury Outlook"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
                    2025 Luxury Outlook℠
                  </h2>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                    {language === 'fi' 
                      ? 'Vuoden 2025 Luxury Outlook℠ tutkii keskeisiä, tulevaisuuteen suuntautuvia kysymyksiä, jotka muokkaavat luksusasuntomarkkinoita ympäri maailmaa.'
                      : language === 'sv'
                      ? 'Luxury Outlook℠ 2025 undersöker viktiga, framåtblickande frågor som formar lyxbostadsmarknaderna runt om i världen.'
                      : 'The 2025 Luxury Outlook℠ explores key, forward-looking questions shaping luxury real estate markets around the world.'}
                  </p>
                  <a
                    href="https://www.sothebysrealty.com/eng/luxury-outlook"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#1a3a4a] text-white px-8 py-3
                             hover:bg-[#0f2633] transition-colors duration-300
                             font-light uppercase tracking-wider text-sm"
                  >
                    {language === 'fi' ? 'Lue koko raportti' : language === 'sv' ? 'Läs hela rapporten' : 'Read full report'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three Image Links Section */}
        <section className="py-0 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* References */}
              <Link href="/kohteet/referenssit" className="relative h-80 group overflow-hidden block">
                <Image
                  src="/images/content/snellman-sothebys-referenssit.jpg"
                  alt={language === 'fi' ? 'Referenssit' : language === 'sv' ? 'Referenser' : 'References'}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">
                    {language === 'fi' ? 'Valikoima myydyistä kohteista' : language === 'sv' ? 'Urval av sålda objekt' : 'Selection of sold properties'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-2
                             group-hover:bg-white group-hover:text-[#1a3a4a] transition-all duration-300
                             font-light uppercase tracking-wider text-sm"
                  >
                    {language === 'fi' ? 'Katso referenssit' : language === 'sv' ? 'Se referenser' : 'View references'}
                  </span>
                </div>
              </Link>

              {/* Rentals */}
              <Link href="/kohteet/vuokrakohteet" className="relative h-80 group overflow-hidden block">
                <Image
                  src="/images/content/snellman-sothebys-vuokrakohteet.jpg"
                  alt={language === 'fi' ? 'Vuokrakohteet' : language === 'sv' ? 'Hyresobjekt' : 'Rental properties'}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">
                    {language === 'fi' ? 'Katso meidän uusimmat vuokrakohteet' : language === 'sv' ? 'Se våra senaste hyresobjekt' : 'View our latest rental properties'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-2
                             group-hover:bg-white group-hover:text-[#1a3a4a] transition-all duration-300
                             font-light uppercase tracking-wider text-sm"
                  >
                    {language === 'fi' ? 'Vuokraa nyt' : language === 'sv' ? 'Hyr nu' : 'Rent now'}
                  </span>
                </div>
              </Link>

              {/* Careers */}
              <Link href="/meille-toihin" className="relative h-80 group overflow-hidden block">
                <Image
                  src="/images/content/snellman-sothebys-nakoalapaikka.jpg"
                  alt={language === 'fi' ? 'Työpaikat' : language === 'sv' ? 'Karriär' : 'Careers'}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-4 text-center">
                    {language === 'fi' ? 'Näköalapaikka kansainväliseen kiinteistönvälitykseen' : language === 'sv' ? 'Utsiktsplats för internationell fastighetsförmedling' : 'International real estate career opportunity'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-2
                             group-hover:bg-white group-hover:text-[#1a3a4a] transition-all duration-300
                             font-light uppercase tracking-wider text-sm"
                  >
                    {language === 'fi' ? 'Työskentele kanssamme' : language === 'sv' ? 'Arbeta med oss' : 'Work with us'}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        {featuredProperties.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-gray-900 mb-4">
                  {language === 'fi' ? 'Valikoidut myynnissä olevat kohteet' : language === 'sv' ? 'Utvalda objekt till salu' : 'Featured properties for sale'}
                </h2>
                <div className="w-24 h-0.5 bg-gray-300 mx-auto"></div>
              </div>
              <FeaturedPropertyGrid properties={featuredProperties} locale={locale} />
              <div className="text-center mt-12">
                <Link
                  href="/kohteet"
                  className="inline-block bg-[#1a3a4a] text-white px-8 py-3
                           hover:bg-[#0f2633] transition-colors duration-300
                           font-light uppercase tracking-wider text-sm"
                >
                  {language === 'fi' ? 'Kaikki myynnissä olevat kohteemme' : language === 'sv' ? 'Alla våra objekt till salu' : 'All our properties for sale'}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Rental Properties Section */}
        {rentalProperties.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-gray-900 mb-4">
                  {language === 'fi' ? 'Uusimmat vuokrakohteet' : language === 'sv' ? 'Senaste hyresobjekt' : 'Latest rental properties'}
                </h2>
                <div className="w-24 h-0.5 bg-gray-300 mx-auto"></div>
              </div>
              <FeaturedPropertyGrid properties={rentalProperties} locale={locale} />
              <div className="text-center mt-12">
                <Link
                  href="/kohteet/vuokrakohteet"
                  className="inline-block bg-[#1a3a4a] text-white px-8 py-3
                           hover:bg-[#0f2633] transition-colors duration-300
                           font-light uppercase tracking-wider text-sm"
                >
                  {language === 'fi' ? 'Kaikki vuokrakohteemme' : language === 'sv' ? 'Alla våra hyresobjekt' : 'All our rental properties'}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Valuation Form Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
                  {language === 'fi' ? 'Kutsu meidät arviokäynnille!' : language === 'sv' ? 'Bjud in oss på värderingsbesök!' : 'Invite us for a valuation visit!'}
                </h2>
                <p className="text-lg text-gray-600 font-light mb-2">
                  {language === 'fi' ? 'Oletko ostamassa? Oletko myymässä? Etsitkö sijoituskohteita?' : language === 'sv' ? 'Köper du? Säljer du? Letar du efter investeringsobjekt?' : 'Are you buying? Are you selling? Looking for investment properties?'}
                </p>
                <p className="text-lg text-gray-600 font-light">
                  {language === 'fi' ? 'Kerro miten voimme auttaa ja otamme sinuun yhteyttä.' : language === 'sv' ? 'Berätta hur vi kan hjälpa dig så kontaktar vi dig.' : 'Tell us how we can help and we will contact you.'}
                </p>
              </div>
              <form className="space-y-4 bg-white p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={getHomepageTranslation('firstName', language)}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                    required
                  />
                  <input
                    type="text"
                    placeholder={getHomepageTranslation('lastName', language)}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder={getHomepageTranslation('email', language)}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                    required
                  />
                  <input
                    type="tel"
                    placeholder={language === 'fi' ? 'Puhelinnumero' : language === 'sv' ? 'Telefonnummer' : 'Phone number'}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                    required
                  />
                </div>
                <textarea
                  placeholder={language === 'fi' ? 'Viesti' : language === 'sv' ? 'Meddelande' : 'Message'}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light resize-none"
                ></textarea>
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="privacy-valuation" required className="mt-1" />
                  <label htmlFor="privacy-valuation" className="text-sm text-gray-700 font-light">
                    {getHomepageTranslation('privacyConsent', language)}{' '}
                    <a href="/tietosuojaseloste" className="text-[var(--color-primary)] hover:underline">
                      {getHomepageTranslation('privacyPolicy', language)}
                    </a>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[var(--color-primary)] text-white px-6 py-3 hover:bg-[var(--color-primary-dark)]
                           transition-colors duration-300 font-light uppercase tracking-wider text-sm"
                >
                  {language === 'fi' ? 'Lähetä' : language === 'sv' ? 'Skicka' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="newsletter" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
                  {getHomepageTranslation('subscribeNewsletter', language)}
                </h2>
                <p className="text-lg text-gray-600 font-light">
                  {language === 'fi' 
                    ? 'Oletko kiinnostunut arvokodeista ja uniikeista kiinteistöistä? Tilaa uutiskirjeemme, niin pysyt ajan tasalla.'
                    : language === 'sv'
                    ? 'Är du intresserad av värdefulla hem och unika fastigheter? Prenumerera på vårt nyhetsbrev så håller du dig uppdaterad.'
                    : 'Interested in valuable homes and unique properties? Subscribe to our newsletter to stay updated.'}
                </p>
              </div>
              <form className="space-y-4 bg-gray-50 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={getHomepageTranslation('firstName', language)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                    required
                  />
                  <input
                    type="text"
                    placeholder={getHomepageTranslation('lastName', language)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder={getHomepageTranslation('email', language)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                  required
                />
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="privacy-newsletter" required className="mt-1" />
                  <label htmlFor="privacy-newsletter" className="text-sm text-gray-700 font-light">
                    {getHomepageTranslation('privacyConsent', language)}{' '}
                    <a href="/tietosuojaseloste" className="text-[var(--color-primary)] hover:underline">
                      {getHomepageTranslation('privacyPolicy', language)}
                    </a>
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="newsletter-consent" className="mt-1" />
                  <label htmlFor="newsletter-consent" className="text-sm text-gray-700 font-light">
                    {language === 'fi' 
                      ? 'Haluan vastaanottaa Snellman Sotheby\'s uutiskirjeen'
                      : language === 'sv'
                      ? 'Jag vill ta emot Snellman Sotheby\'s nyhetsbrev'
                      : 'I want to receive Snellman Sotheby\'s newsletter'}
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[var(--color-primary)] text-white px-6 py-3 hover:bg-[var(--color-primary-dark)]
                           transition-colors duration-300 font-light uppercase tracking-wider text-sm"
                >
                  {getHomepageTranslation('subscribe', language)}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
