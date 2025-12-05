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

        {/* Social Share Links */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-4">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=https://sothebysrealty.fi/`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                title="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href={`https://www.linkedin.com/shareArticle?mini=true&url=https://sothebysrealty.fi/`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0077b5] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                title="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href={`mailto:?subject=&body=https://sothebysrealty.fi/`}
                className="w-10 h-10 rounded-full bg-[#666666] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                title="Send by email"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Welcome Section - "Tervetuloa onnistuneeseen asuntokauppaan!" */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-light text-gray-700 mb-6">
                {getHomepageTranslation('welcomeHeading', language)}
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                {getHomepageTranslation('welcomeText', language)}
              </p>
            </div>
          </div>
        </section>

        {/* Three Column Section - Avaamme uusia ovia */}
        <section id="avaamme-uusia-ovia" className="py-16 bg-white">
          <div className="container mx-auto px-4">
{/* Section header removed - text is now in the hero carousel */}

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
                  <h3 className="text-2xl font-light mb-6 text-center">{getHomepageTranslation('openNewDoors', language)}</h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-2.5
                             group-hover:bg-white group-hover:text-black transition-all duration-300
                             font-light text-xs tracking-wide"
                  >
                    {getHomepageTranslation('findDreamHome', language)} ›
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
                  <h3 className="text-2xl font-light mb-6 text-center">
                    {getHomepageTranslation('expertiseHeading', language)}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-2.5
                             group-hover:bg-white group-hover:text-[#324b72] transition-all duration-300
                             font-light text-xs tracking-wide"
                  >
                    {getHomepageTranslation('readMoreAboutUs', language)} ›
                  </span>
                </div>
              </Link>

              {/* Column 3 */}
              <Link href="/myymassa" className="relative h-80 group overflow-hidden block">
                <Image
                  src="/images/content/snellman-sothebys-kutsu-arviokaynnille.jpg"
                  alt={getHomepageTranslation('freeValuationHeading', language)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#4a6b8a] bg-opacity-70 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-2xl font-light mb-6 text-center">
                    {getHomepageTranslation('freeValuationHeading', language)}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-2.5
                             group-hover:bg-white group-hover:text-[#4a6b8a] transition-all duration-300
                             font-light text-xs tracking-wide"
                  >
                    {getHomepageTranslation('contactUs', language)} ›
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Office Hours Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-gray-900 mb-8">
                {language === 'fi' ? (
                  <>
                    Upea toimistomme palvelee<br />
                    teitä arkisin 10:00 – 17:00<br />
                    sekä muina aikoina sopimuksen mukaan.
                  </>
                ) : language === 'sv' ? (
                  <>
                    Vårt fantastiska kontor betjänar<br />
                    dig vardagar 10:00 – 17:00<br />
                    samt andra tider enligt överenskommelse.
                  </>
                ) : (
                  <>
                    Our great office serves<br />
                    you on weekdays 10:00 – 17:00<br />
                    and at other times by appointment.
                  </>
                )}
            </h3>
              <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-6 text-gray-700">
                <a href="tel:+358103156900" className="text-lg hover:text-[var(--color-primary)] transition-colors font-light">
                  +358 (0)10 315 6900
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="https://goo.gl/maps/8HptT8TwUp42" target="_blank" rel="noopener noreferrer" 
                   className="text-lg hover:text-[var(--color-primary)] transition-colors font-light">
                  Kasarmikatu 34, 00130 Helsinki
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="mailto:info@sothebysrealty.fi" className="text-lg hover:text-[var(--color-primary)] transition-colors font-light">
                  info@sothebysrealty.fi
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Luxury Outlook Report Section */}
        <section className="relative overflow-hidden bg-[#16223c] py-16">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-scroll"
            style={{
              backgroundImage: 'url(/images/content/luxury-outlook-2025.jpg)',
              backgroundPosition: '50% -94px',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/25"></div>
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light text-white mb-6 [text-shadow:_0_2px_4px_rgb(0_0_0_/40%)]">
                2025 Luxury Outlook℠
              </h2>
              <h4 className="text-base md:text-lg text-white font-light leading-relaxed mb-8 [text-shadow:_0_1px_2px_rgb(0_0_0_/40%)]">
                {language === 'fi' 
                  ? 'Vuoden 2025 Luxury Outlook℠ tutkii keskeisiä, tulevaisuuteen suuntautuvia kysymyksiä, jotka muokkaavat luksusasuntomarkkinoita ympäri maailmaa.'
                  : language === 'sv'
                  ? 'Luxury Outlook℠ 2025 undersöker viktiga, framåtblickande frågor som formar lyxbostadsmarknaderna runt om i världen.'
                  : 'The 2025 Luxury Outlook℠ explores key, forward-looking questions shaping luxury real estate markets around the world.'}
              </h4>
              <p className="text-center">
                <a
                  href="https://www.sothebysrealty.com/eng/luxury-outlook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border-2 border-white text-white px-8 py-3
                           hover:bg-white hover:text-black transition-colors duration-300
                           font-light tracking-wider text-sm uppercase"
                >
                  {language === 'fi' ? 'LUE KOKO 2025 LUXURY OUTLOOK℠ -RAPORTTI ›' : language === 'sv' ? 'LÄS HELA 2025 LUXURY OUTLOOK℠-RAPPORTEN ›' : 'READ THE FULL 2025 LUXURY OUTLOOK℠ REPORT ›'}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Four Image Links Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* References */}
              <Link href="/kohteet/referenssit" className="relative h-80 group overflow-hidden block">
                <Image
                  src="/images/content/snellman-sothebys-referenssit.jpg"
                  alt={language === 'fi' ? 'Referenssit' : language === 'sv' ? 'Referenser' : 'References'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="text-xl font-light mb-3 text-center">
                    {language === 'fi' ? 'Valikoima myydyistä kohteista' : language === 'sv' ? 'Urval av sålda objekt' : 'Selection of sold properties'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-4 py-2
                             group-hover:bg-white group-hover:text-[#1a3a4a] transition-all duration-300
                             font-light uppercase tracking-wider text-xs"
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="text-xl font-light mb-3 text-center">
                    {language === 'fi' ? 'Katso meidän uusimmat vuokrakohteet' : language === 'sv' ? 'Se våra senaste hyresobjekt' : 'View our latest rental properties'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-4 py-2
                             group-hover:bg-white group-hover:text-[#1a3a4a] transition-all duration-300
                             font-light uppercase tracking-wider text-xs"
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="text-xl font-light mb-3 text-center">
                    {language === 'fi' ? 'Näköalapaikka kansainväliseen kiinteistönvälitykseen' : language === 'sv' ? 'Utsiktsplats för internationell fastighetsförmedling' : 'International real estate career opportunity'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-4 py-2
                             group-hover:bg-white group-hover:text-[#1a3a4a] transition-all duration-300
                             font-light uppercase tracking-wider text-xs"
                  >
                    {language === 'fi' ? 'Työskentele kanssamme' : language === 'sv' ? 'Arbeta med oss' : 'Work with us'}
                  </span>
                </div>
              </Link>

              {/* Selling - New 4th box */}
              <Link href="/myymassa" className="relative h-80 group overflow-hidden block">
                <Image
                  src="/images/content/snellman-sothebys-kutsu-arviokaynnille.jpg"
                  alt={language === 'fi' ? 'Myymässä' : language === 'sv' ? 'Till salu' : 'Selling'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="text-xl font-light mb-3 text-center">
                    {language === 'fi' ? 'Myy kanssamme' : language === 'sv' ? 'Sälj med oss' : 'Sell with us'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-4 py-2
                             group-hover:bg-white group-hover:text-[#1a3a4a] transition-all duration-300
                             font-light uppercase tracking-wider text-xs"
                  >
                    {language === 'fi' ? 'Lue lisää' : language === 'sv' ? 'Läs mer' : 'Read more'}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Properties Section - 3 Column Grid */}
        {featuredProperties.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              {/* Section Title */}
              <h2 className="text-3xl lg:text-4xl font-light text-center mb-12">
                {language === 'fi' 
                  ? 'Valikoidut myynnissä olevat kohteet'
                  : language === 'sv' 
                    ? 'Utvalda objekt till salu' 
                    : 'Selected properties for sale'}
              </h2>

              {/* Property Cards Grid - 3 columns, 2 rows = 6 properties */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.map((property) => {
                  const addressStr = typeof property.address === 'string' ? property.address : property.address.fi;
                  const cityStr = typeof property.city === 'string' ? property.city : property.city.fi;
                  const descriptionStr = property.description 
                    ? (typeof property.description === 'string' ? property.description : property.description.fi)
                    : '';
                  const listingTypeStr = property.meta.listingTypeLabel
                    ? (typeof property.meta.listingTypeLabel === 'string' 
                        ? property.meta.listingTypeLabel 
                        : property.meta.listingTypeLabel.fi)
                    : '';
                  const districtStr = property.district
                    ? (typeof property.district === 'string' ? property.district : property.district.fi)
                    : '';

                  return (
                    <div
                      key={property.id}
                      className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    >
                      {/* Property Image with Carousel Navigation */}
                      <div className="relative group">
                        <a href={`/${locale}/kohde/${property.slug}`} className="block">
                          <div className="relative h-56 overflow-hidden">
                            <Image
                              src={property.media.images[0]?.url || '/images/placeholder.jpg'}
                              alt={addressStr}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        </a>
                        {/* Carousel Arrows */}
                        {property.media.images.length > 1 && (
                          <>
                            <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Property Details */}
                      <div className="p-5 flex-grow flex flex-col">
                        <a href={`/${locale}/kohde/${property.slug}`} className="block mb-auto">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {addressStr}
                          </h3>
                          <p className="text-lg font-normal text-gray-900 mb-3">
                            {property.pricing.debtFree 
                              ? new Intl.NumberFormat('fi-FI').format(property.pricing.debtFree) + ' €'
                              : property.pricing.sales 
                                ? new Intl.NumberFormat('fi-FI').format(property.pricing.sales) + ' €'
                                : ''}
                          </p>
                          <p className="text-sm text-gray-700 font-light mb-3 line-clamp-3 leading-relaxed">
                            {descriptionStr}
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            {property.dimensions.living && `${property.dimensions.living} m²`}
                            {property.dimensions.total && property.dimensions.total !== property.dimensions.living && ` / ${property.dimensions.total} m²`}
                            {property.dimensions.plot && ` | ${property.dimensions.plot} m²`}
                          </p>
                        </a>
                        
                        {/* Property Type and Location Tags */}
                        {(listingTypeStr || districtStr) && (
                          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-gray-600">
                            {listingTypeStr && (
                              <span className="inline-flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                                {listingTypeStr}
                              </span>
                            )}
                            {districtStr && (
                              <span className="inline-flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {districtStr}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Agent Info & Buttons */}
                        <div className="mt-auto pt-4 border-t border-gray-200">
                          {property.agent && (
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {property.agent.photoUrl && (
                                  <Image
                                    src={property.agent.photoUrl}
                                    alt={property.agent.name || ''}
                                    width={40}
                                    height={40}
                                    className="rounded-full flex-shrink-0"
                                  />
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{property.agent.name}</p>
                                  <p className="text-xs text-gray-600 truncate">{property.agent.phone}</p>
                                </div>
                              </div>
                              <a
                                href={`tel:${property.agent.phone?.replace(/\s/g, '')}`}
                                className="border border-gray-900 text-gray-900 px-3 py-1.5 text-xs
                                         hover:bg-gray-900 hover:text-white transition-colors duration-300
                                         font-normal uppercase tracking-wide whitespace-nowrap flex-shrink-0 ml-2"
                              >
                                {language === 'fi' ? 'OTA YHTEYTTÄ' : language === 'sv' ? 'KONTAKTA' : 'CONTACT'}
                  </a>
                            </div>
                          )}
                          
                          <a
                            href={`/${locale}/kohde/${property.slug}`}
                            className="block w-full bg-[#002349] text-white text-center px-6 py-2.5
                                     hover:bg-[#001731] transition-colors duration-300
                                     font-normal uppercase tracking-wide text-sm"
                          >
                            {language === 'fi' ? 'NÄYTÄ KOHDE' : language === 'sv' ? 'VISA OBJEKT' : 'VIEW PROPERTY'}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* View All Button */}
              <div className="text-center mt-12">
                <Link
                  href="/kohteet"
                  className="inline-block bg-[#002349] text-white px-8 py-3
                           hover:bg-[#001731] transition-colors duration-300
                           font-light uppercase tracking-wider text-sm"
                >
                  {language === 'fi' ? 'Kaikki myynnissä olevat kohteemme' : language === 'sv' ? 'Alla våra objekt till salu' : 'All our properties for sale'}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Latest Rental Properties Section */}
        {rentalProperties.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl lg:text-4xl font-light text-center mb-12">
                {language === 'fi' 
                  ? 'Uusimmat vuokrakohteet'
                  : language === 'sv' 
                    ? 'Senaste hyresobjekt' 
                    : 'Latest rental properties'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentalProperties.map((property) => {
                  const addressStr = typeof property.address === 'string' ? property.address : property.address.fi;
                  const cityStr = typeof property.city === 'string' ? property.city : property.city.fi;
                  const descriptionStr = property.description 
                    ? (typeof property.description === 'string' ? property.description : property.description.fi)
                    : '';

                  return (
                    <div
                      key={property.id}
                      className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    >
                      <div className="relative group">
                        <a href={`/${locale}/kohde/${property.slug}`} className="block">
                          <div className="relative h-56 overflow-hidden">
                            <Image
                              src={property.media.images[0]?.url || '/images/placeholder.jpg'}
                              alt={addressStr}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        </a>
                      </div>

                      <div className="p-5 flex-grow flex flex-col">
                        <a href={`/${locale}/kohde/${property.slug}`} className="block mb-auto">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {addressStr}
                          </h3>
                          <p className="text-lg font-normal text-gray-900 mb-3">
                            {property.meta.rent 
                              ? new Intl.NumberFormat('fi-FI').format(property.meta.rent) + ' €/kk'
                              : ''}
                          </p>
                          <p className="text-sm text-gray-700 font-light mb-3 line-clamp-3 leading-relaxed">
                            {descriptionStr}
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            {property.dimensions.living && `${property.dimensions.living} m²`}
                          </p>
                        </a>
                        
                        <a
                          href={`/${locale}/kohde/${property.slug}`}
                          className="block w-full bg-[#002349] text-white text-center px-6 py-2.5
                                   hover:bg-[#001731] transition-colors duration-300
                                   font-normal uppercase tracking-wide text-sm mt-auto"
                        >
                          {language === 'fi' ? 'NÄYTÄ KOHDE' : language === 'sv' ? 'VISA OBJEKT' : 'VIEW PROPERTY'}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center mt-12">
                <Link
                  href="/kohteet/vuokrakohteet"
                  className="inline-block bg-[#002349] text-white px-8 py-3
                           hover:bg-[#001731] transition-colors duration-300
                           font-light uppercase tracking-wider text-sm"
                  >
                  {language === 'fi' ? 'Kaikki vuokrakohteemme' : language === 'sv' ? 'Alla våra hyresobjekt' : 'All our rental properties'}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Contact CTA Section - "Kutsu meidät arviokäynnille!" */}
        <section className="py-16 bg-[#f2f2f2]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left column - Text */}
              <div className="lg:pl-12">
                <h2 className="text-3xl lg:text-4xl font-light text-[#5a7a94] mb-6">
                  {language === 'fi' 
                    ? 'Kutsu meidät arviokäynnille!'
                    : language === 'sv'
                    ? 'Bjud in oss till ett värderingsbesök!'
                    : 'Invite us for a valuation visit!'}
                </h2>
                <p className="text-lg text-gray-700 font-light leading-relaxed mb-4">
                  {language === 'fi' 
                    ? 'Oletko ostamassa? Oletko myymässä? Etsitkö sijoituskohteita?'
                    : language === 'sv'
                    ? 'Köper du? Säljer du? Letar du efter investeringsobjekt?'
                    : 'Are you buying? Are you selling? Looking for investment properties?'}
                </p>
                <p className="text-lg text-gray-700 font-light leading-relaxed mb-4">
                  {language === 'fi' 
                    ? 'Kerro miten voimme auttaa och otamme sinuun yhteyttä.'
                    : language === 'sv'
                    ? 'Berätta hur vi kan hjälpa till så kontaktar vi dig.'
                    : 'Tell us how we can help and we will contact you.'}
                </p>
                <p className="text-lg text-gray-700 font-light leading-relaxed mb-4">
                  {language === 'fi' 
                    ? 'Oletko kiinnostunut arvokodeista ja uniikeista kiinteistöistä?'
                    : language === 'sv'
                    ? 'Är du intresserad av värdefulla hem och unika fastigheter?'
                    : 'Interested in valuable homes and unique properties?'}
                </p>
                <p className="text-lg text-gray-700 font-light leading-relaxed">
                  {language === 'fi' 
                    ? 'Tilaa uutiskirjeemme, niin pysyt ajan tasalla.'
                    : language === 'sv'
                    ? 'Prenumerera på vårt nyhetsbrev så håller du dig uppdaterad.'
                    : 'Subscribe to our newsletter to stay updated.'}
                </p>
              </div>

              {/* Right column - Form */}
              <div className="bg-white p-8">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={language === 'fi' ? 'Etunimi' : language === 'sv' ? 'Förnamn' : 'First name'}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#002349] text-center"
                      required
                    />
                    <input
                      type="text"
                      placeholder={language === 'fi' ? 'Sukunimi' : language === 'sv' ? 'Efternamn' : 'Last name'}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#002349] text-center"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder={language === 'fi' ? 'Sähköposti' : language === 'sv' ? 'E-post' : 'Email'}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#002349] text-center"
                      required
                    />
                    <input
                      type="tel"
                      placeholder={language === 'fi' ? 'Puhelinnumero' : language === 'sv' ? 'Telefonnummer' : 'Phone number'}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#002349] text-center"
                      required
                    />
                  </div>
                  <textarea
                    placeholder={language === 'fi' ? 'Viesti' : language === 'sv' ? 'Meddelande' : 'Message'}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#002349] text-center"
                    required
                  />
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="privacy-contact" required className="mt-1" />
                    <label htmlFor="privacy-contact" className="text-sm text-gray-700">
                      {language === 'fi' 
                        ? <>Olen tutustunut Tietosuojaselosteeseen <a href="http://sothebysrealty.fi/tietosuojaseloste/" target="_blank" rel="noopener noreferrer" className="underline">Tietosuojaseloste</a></>
                        : language === 'sv'
                        ? <>Jag har läst integritetspolicyn <a href="http://sothebysrealty.fi/sv/tietosuojaseloste/" target="_blank" rel="noopener noreferrer" className="underline">Integritetspolicy</a></>
                        : <>I have read the privacy policy <a href="http://sothebysrealty.fi/en/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a></>}
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="newsletter-contact" className="mt-1" />
                    <label htmlFor="newsletter-contact" className="text-sm text-gray-700">
                      {language === 'fi' 
                        ? 'Haluan vastaanottaa Snellman Sotheby\'s uutiskirjeen'
                        : language === 'sv'
                        ? 'Jag vill ta emot Snellman Sotheby\'s nyhetsbrev'
                        : 'I want to receive Snellman Sotheby\'s newsletter'}
                    </label>
                  </div>
                  <p className="text-xs text-white">
                    {language === 'fi' 
                      ? <>Tämän sivun suojaa reCAPTCHA, mikä tarkoittaa, että Googlen <a href="https://policies.google.com/privacy?hl=fi" target="_blank" rel="noopener noreferrer" className="underline">tietosuojakäytännöt</a> ja <a href="https://policies.google.com/terms?hl=fi" target="_blank" rel="noopener noreferrer" className="underline">käyttöehdot</a> ovat voimassa.</>
                      : language === 'sv'
                      ? <>Denna sida skyddas av reCAPTCHA, vilket innebär att Googles <a href="https://policies.google.com/privacy?hl=sv" target="_blank" rel="noopener noreferrer" className="underline">sekretesspolicy</a> och <a href="https://policies.google.com/terms?hl=sv" target="_blank" rel="noopener noreferrer" className="underline">användarvillkor</a> gäller.</>
                      : <>This page is protected by reCAPTCHA, which means that Google's <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">privacy policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">terms of service</a> apply.</>}
                  </p>
                  <button
                    type="submit"
                    className="w-full bg-[#8e740b] text-white px-6 py-3 hover:bg-[#7a6409]
                             transition-colors duration-300 font-light text-center"
                  >
                    {language === 'fi' ? 'Lähetä' : language === 'sv' ? 'Skicka' : 'Send'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="newsletter" className="py-16 relative">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/content/snellman-sothebys-newsletter-bg.jpg"
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#002349]/80"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-light text-white mb-4">
                {getHomepageTranslation('subscribeNewsletter', language)}
              </h2>
                <p className="text-lg text-white/80 font-light">
                  {language === 'fi' 
                    ? 'Oletko kiinnostunut arvokodeista ja uniikeista kiinteistöistä? Tilaa uutiskirjeemme, niin pysyt ajan tasalla.'
                    : language === 'sv'
                    ? 'Är du intresserad av värdefulla hem och unika fastigheter? Prenumerera på vårt nyhetsbrev så håller du dig uppdaterad.'
                    : 'Interested in valuable homes and unique properties? Subscribe to our newsletter to stay updated.'}
                </p>
              </div>
              <form className="space-y-4 bg-white/10 backdrop-blur-sm p-8">
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
                  <label htmlFor="privacy-newsletter" className="text-sm text-white font-light">
                    {getHomepageTranslation('privacyConsent', language)}{' '}
                    <a href="/tietosuojaseloste" className="text-white underline hover:text-white/80">
                      {getHomepageTranslation('privacyPolicy', language)}
                    </a>
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="newsletter-consent" className="mt-1" />
                  <label htmlFor="newsletter-consent" className="text-sm text-white font-light">
                    {language === 'fi' 
                      ? 'Haluan vastaanottaa Snellman Sotheby\'s uutiskirjeen'
                      : language === 'sv'
                      ? 'Jag vill ta emot Snellman Sotheby\'s nyhetsbrev'
                      : 'I want to receive Snellman Sotheby\'s newsletter'}
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#8e740b] text-white px-6 py-3 hover:bg-[#7a6409]
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
