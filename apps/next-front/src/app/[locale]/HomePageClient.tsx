'use client';

import { useEffect, useState } from 'react';
import HeroCarousel from '@/components/Homepage/HeroCarousel';
import FeaturedPropertiesSection from '@/components/Homepage/FeaturedPropertiesSection';
import InfoSection from '@/components/Homepage/InfoSection';
import ContactCtaSection from '@/components/Homepage/ContactCtaSection';
import NewsletterSection from '@/components/Homepage/NewsletterSection';
import { getHomepageTranslation, type SupportedLanguage } from '@/lib/homepage-translations';
import type { Locale } from '@/i18n/config';
import type { Property } from '@/lib/domain/property.types';

const getTranslatedSlides = (language: SupportedLanguage) => [
  {
    id: '1',
    youtubeBg: 'vZRncaI6Lw8',
    image: '/images/hero/slide-1.jpg',
    title: getHomepageTranslation('hero2Title', language),
    subtitle: getHomepageTranslation('hero2Subtitle', language),
    buttonText: getHomepageTranslation('hero2Button', language),
    buttonLink: '/kohteet'
  },
  {
    id: '2',
    image: '/images/hero/slide-2.jpg',
    title: getHomepageTranslation('hero3Title', language),
    subtitle: getHomepageTranslation('hero3Subtitle', language),
    buttonText: getHomepageTranslation('hero3Button', language),
    buttonLink: '/yritys'
  },
  {
    id: '3',
    image: '/images/hero/slide-3.jpg',
    title: getHomepageTranslation('hero1Title', language),
    subtitle: getHomepageTranslation('hero1Subtitle', language),
    buttonText: getHomepageTranslation('hero1Button', language),
    buttonLink: '/yhteystiedot'
  }
];

export default function HomePageClient({
  locale,
  initialProperties = []
}: {
  locale: Locale;
  initialProperties?: Property[];
}) {
  const language = locale as SupportedLanguage;
  const [properties, setProperties] = useState<Property[]>(initialProperties);

  useEffect(() => {
    if (initialProperties.length > 0) {
      setProperties(initialProperties);
    }
  }, [initialProperties]);

  const heroSlides = getTranslatedSlides(language);

  const h1Text =
    language === 'fi'
      ? "Snellman Sotheby's International Realty — Kiinteistönvälitys Helsingissä"
      : language === 'sv'
      ? "Snellman Sotheby's International Realty — Fastighetsmäklare i Helsingfors"
      : "Snellman Sotheby's International Realty — Real Estate in Helsinki";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <h1 className="sr-only">{h1Text}</h1>
        <HeroCarousel slides={heroSlides} />

        {/* Social Share Links */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-4">
              <a href="https://www.facebook.com/sharer/sharer.php?u=https://sothebysrealty.fi/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-80 transition-opacity" title="Share on Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://sothebysrealty.fi/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0077b5] flex items-center justify-center text-white hover:opacity-80 transition-opacity" title="Share on LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="mailto:?subject=&body=https://sothebysrealty.fi/" className="w-10 h-10 rounded-full bg-[#666666] flex items-center justify-center text-white hover:opacity-80 transition-opacity" title="Send by email">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
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

        <InfoSection language={language} />
        <FeaturedPropertiesSection properties={properties} language={language} />
        <ContactCtaSection language={language} />
        <NewsletterSection language={language} />
      </main>
    </div>
  );
}
