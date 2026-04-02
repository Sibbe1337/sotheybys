'use client';

import { Link } from '@/lib/navigation';
import NextLink from 'next/link';
import Image from 'next/image';
import { getHomepageTranslation, type SupportedLanguage } from '@/lib/homepage-translations';
import { company } from '@/lib/config/company';

interface Props {
  language: SupportedLanguage;
}

export default function InfoSection({ language }: Props) {
  return (
    <>
      {/* Three Column Section - Avaamme uusia ovia */}
      <section id="avaamme-uusia-ovia" className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Column 1 - Löydä unelmiesi koti */}
              <Link href="/kohteet" className="relative aspect-[4/3] group overflow-hidden block">
                <Image src="/images/content/snellman-sothebys-yritys.jpg" alt={getHomepageTranslation('openNewDoors', language)} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 text-center leading-relaxed drop-shadow-lg">{getHomepageTranslation('openNewDoors', language)}</h3>
                  <span className="inline-block border-2 border-white text-white px-8 py-3 bg-black/30 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all duration-300 text-xs tracking-[0.15em] uppercase font-medium shadow-lg">
                    {getHomepageTranslation('findDreamHome', language)} ›
                  </span>
                </div>
              </Link>

              {/* Column 2 - Om oss / Yritys */}
              <Link href="/yritys" className="relative aspect-[4/3] group overflow-hidden block">
                <Image src="/images/content/snellman-sothebys-yritys-01.jpg" alt={getHomepageTranslation('expertiseHeading', language)} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 text-center leading-relaxed drop-shadow-lg">{getHomepageTranslation('expertiseHeading', language)}</h3>
                  <span className="inline-block border-2 border-white text-white px-8 py-3 bg-black/30 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all duration-300 text-xs tracking-[0.15em] uppercase font-medium shadow-lg">
                    {getHomepageTranslation('readMoreAboutUs', language)} ›
                  </span>
                </div>
              </Link>

              {/* Column 3 - Myymässä / Sälja */}
              <Link href="/myymassa" className="relative aspect-[4/3] group overflow-hidden block">
                <Image src="/images/content/myymassa-banner.jpg" alt={getHomepageTranslation('freeValuationHeading', language)} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 text-center leading-relaxed drop-shadow-lg">{getHomepageTranslation('freeValuationHeading', language)}</h3>
                  <span className="inline-block border-2 border-white text-white px-8 py-3 bg-black/30 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all duration-300 text-xs tracking-[0.15em] uppercase font-medium shadow-lg">
                    {getHomepageTranslation('contactUs', language)} ›
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl md:text-2xl text-gray-900 mb-8 font-light leading-relaxed">
              {language === 'fi' ? (
                <>Upea toimistomme palvelee<br />teitä arkisin 10:00 – 17:00<br />sekä muina aikoina sopimuksen mukaan.</>
              ) : language === 'sv' ? (
                <>Vårt högklassiga kontor betjänar Er<br />på vardagar 10:00 – 17:00<br />på helgerna är vi öppna efter överenskommelse.</>
              ) : (
                <>Our wonderful office is open<br />on weekdays 10:00 – 17:00<br />as well as other times by appointment.</>
              )}
            </h3>
            <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-6 text-gray-700">
              <a href={company.contact.phoneTel} className="text-lg hover:text-[var(--color-primary)] transition-colors font-light">
                {company.contact.phone}
              </a>
              <span className="hidden md:inline text-gray-400">|</span>
              <a href={company.mapsLink} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-[var(--color-primary)] transition-colors font-light">
                {getHomepageTranslation('address', language)}
              </a>
              <span className="hidden md:inline text-gray-400">|</span>
              <a href={company.contact.mailto} className="text-lg hover:text-[var(--color-primary)] transition-colors font-light">
                {company.contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Outlook Report Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden bg-[#16223c]" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
              <div className="absolute inset-0 bg-scroll" style={{ backgroundImage: 'url(/images/content/2026-luxury-outlook-report.jpg)', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className="absolute inset-0 bg-black/25"></div>
              </div>
              <div className="relative z-10 px-4">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-light text-white mb-3 [text-shadow:_0_2px_4px_rgb(0_0_0_/40%)]">
                    2026 Luxury Outlook℠
                  </h2>
                  <h4 className="text-sm md:text-base text-white font-light leading-snug mb-4 [text-shadow:_0_1px_2px_rgb(0_0_0_/40%)]">
                    {language === 'fi'
                      ? 'Vuoden 2026 Luxury Outlook℠ tutkii keskeisiä, tulevaisuuteen suuntautuvia kysymyksiä, jotka muokkaavat luksusasuntomarkkinoita ympäri maailmaa.'
                      : language === 'sv'
                      ? 'Luxury Outlook℠ 2026 undersöker viktiga, framåtblickande frågor som formar lyxbostadsmarknaderna runt om i världen.'
                      : 'The 2026 Luxury Outlook℠ explores key, forward-looking questions shaping luxury real estate markets around the world.'}
                  </h4>
                  <p className="text-center">
                    <a href="https://legacy.sothebysrealty.fi/2026-luxury-outlook-report/" target="_blank" rel="noopener noreferrer" className="inline-block border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300 font-light tracking-wider text-sm uppercase">
                      {language === 'fi' ? 'LUE KOKO 2026 LUXURY OUTLOOK℠ -RAPORTTI ›' : language === 'sv' ? 'LÄS HELA 2026 LUXURY OUTLOOK℠-RAPPORTEN ›' : 'READ THE FULL 2026 LUXURY OUTLOOK℠ REPORT ›'}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Image Links Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rentals */}
              <Link href="/kohteet/vuokrakohteet" className="relative h-80 group overflow-hidden block">
                <Image src="/images/content/snellman-sothebys-vuokrakohteet.jpg" alt={language === 'fi' ? 'Vuokrakohteet' : language === 'sv' ? 'Hyresobjekt' : 'Rental properties'} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-25 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="text-xl font-light mb-3 text-center">
                    {language === 'fi' ? 'Katso meidän uusimmat vuokrakohteet' : language === 'sv' ? 'Se våra senaste hyresobjekt' : 'See our latest rental listings'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-4 py-2 group-hover:bg-white group-hover:text-[#1a3a4a] transition-all duration-300 font-light uppercase tracking-wider text-xs">
                    {language === 'fi' ? 'Vuokraa nyt ›' : language === 'sv' ? 'Hyr nu ›' : 'Rent now ›'}
                  </span>
                </div>
              </Link>

              {/* Careers */}
              <NextLink href="/en/meille-toihin" className="relative h-80 group overflow-hidden block">
                <Image src="/images/content/snellman-sothebys-nakoalapaikka.jpg" alt={language === 'fi' ? 'Työpaikat' : language === 'sv' ? 'Karriär' : 'Careers'} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-25 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="text-xl font-light mb-3 text-center">
                    {language === 'fi' ? 'Näköalapaikka kansainväliseen kiinteistönvälitykseen' : language === 'sv' ? 'En utsiktsplats för internationell fastighetsförmedling' : 'A vantage point for international real estate'}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-4 py-2 group-hover:bg-white group-hover:text-[#1a3a4a] transition-all duration-300 font-light uppercase tracking-wider text-xs">
                    {language === 'fi' ? 'Työskentele kanssamme ›' : language === 'sv' ? 'Jobba med oss ›' : 'Work with us ›'}
                  </span>
                </div>
              </NextLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
