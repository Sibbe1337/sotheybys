'use client';

import { Suspense, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import HeroCarousel from '@/components/Homepage/HeroCarousel';
import PropertyGrid from '@/components/Property/PropertyGrid';
import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { getHomepageTranslation, type SupportedLanguage } from '@/lib/homepage-translations';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';
import { convertCompleteLinearToWordPressFormat } from '@/lib/linear-api-complete-converter';

// Function to get translated hero slides
const getTranslatedSlides = (language: SupportedLanguage) => [
  {
    id: '1',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/57809e7b-2fe2-430d-a7d7-aff39337d0c1/ead27130-4e08-465e-af6d-500d593ae0db.jpg',
    title: getHomepageTranslation('hero1Title', language),
    subtitle: getHomepageTranslation('hero1Subtitle', language),
    buttonText: getHomepageTranslation('hero1Button', language),
    buttonLink: '#avaamme-uusia-ovia'
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

function HomePageContent() {
  const locale = useLocale();
  const language = (locale || 'fi') as SupportedLanguage;
  const [properties, setProperties] = useState<any[]>(sampleProperties);
  const [loading, setLoading] = useState(true);
  
  // Fetch real properties from Linear API cache
  useEffect(() => {
    async function loadProperties() {
      try {
        await ensureCacheInitialized();
        const linearProperties = listingsCache.getListings();
        
        if (linearProperties && linearProperties.length > 0) {
          console.log('✅ Using real Linear API properties:', linearProperties.length);
          
          // 🏠 FILTER OUT RENTAL PROPERTIES - Only show sale properties on homepage
          const saleProperties = linearProperties.filter(listing => {
            // listingsCache.getListings() returns CompleteLinearAPIListing[]
            // Access rent from listing.rent.fi.value structure
            const rentValue = listing.rent?.fi?.value;
            const hasRent = rentValue && 
                            String(rentValue).trim().length > 0 && 
                            String(rentValue) !== '0' &&
                            String(rentValue) !== 'null' &&
                            !String(rentValue).toLowerCase().includes('null');
            
            if (hasRent) {
              const address = listing.address?.fi?.value || 'Unknown';
              console.log(`🏠 HOMEPAGE: RENTAL FOUND: ${address} | Rent: "${rentValue}" | EXCLUDING from homepage`);
            }
            return !hasRent; // Exclude properties with rent field
          });
          
          console.log(`✅ Filtered ${saleProperties.length} sale properties for homepage (excluded ${linearProperties.length - saleProperties.length} rentals)`);
          
          // 💎 SORT BY PRICE: Most expensive first (Premium branding)
          // VIKTIGT: Använd SKULDFRITT PRIS (debtFreePrice) som primär sortering
          saleProperties.sort((a, b) => {
            // Prioritera debtFreePrice, fallback till askPrice
            const priceA = parseFloat(a.nonLocalizedValues?.debtFreePrice || a.nonLocalizedValues?.askPrice || '0') || 0;
            const priceB = parseFloat(b.nonLocalizedValues?.debtFreePrice || b.nonLocalizedValues?.askPrice || '0') || 0;
            return priceB - priceA; // Descending order (highest first)
          });
          
          console.log(`💎 Sorted ${saleProperties.length} properties by price (highest first)`);
          
          // Transform Linear API format to WordPress format for PropertyCard compatibility
          const transformedProperties = saleProperties.map(listing => {
            const converted = convertCompleteLinearToWordPressFormat(listing);
            // Ensure featuredImage is in the correct nested format for PropertyCard
            return {
              ...converted,
              featuredImage: converted.featuredImage ? {
                node: {
                  sourceUrl: converted.featuredImage,
                  altText: converted.title || converted.acfRealEstate?.property?.address || ''
                }
              } : {
                node: {
                  sourceUrl: '/images/defaults/placeholder-property.jpg',
                  altText: converted.title || 'Property'
                }
              }
            };
          });
          setProperties(transformedProperties);
        } else {
          console.warn('⚠️ No Linear properties found, using sample data');
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        console.warn('⚠️ Using sample properties as fallback');
      } finally {
        setLoading(false);
      }
    }
    
    loadProperties();
  }, []);
  
  // Get translated slides
  const heroSlides = getTranslatedSlides(language);
  const displayProperties = properties;

    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Carousel */}
          <HeroCarousel slides={heroSlides} />

          {/* Properties Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-gray-900 mb-4">
                  {getHomepageTranslation('propertiesHeading', language)}
                </h2>
                <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-6"></div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
                  {getHomepageTranslation('propertiesSubtitle', language)}
                </p>
              </div>

              {/* Property Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#002349] border-r-transparent" role="status">
                    <span className="sr-only">Loading properties...</span>
                  </div>
                  <p className="mt-4 text-gray-600 font-light">
                    {getHomepageTranslation('loading', language) || 'Ladataan kohteita...'}
                  </p>
                </div>
              ) : (
                <PropertyGrid properties={displayProperties} language={language} />
              )}
              
              {/* View All Button */}
              <div className="text-center mt-12">
                <Link
                  href="/kohteet"
                  className="inline-block bg-[#1a3a4a] text-white px-8 py-3 
                           hover:bg-[#0f2633] transition-colors duration-300 
                           font-light uppercase tracking-wider text-sm"
                >
                  {getHomepageTranslation('viewAllProperties', language)}
                </Link>
              </div>
            </div>
          </section>

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
                <div className="relative h-80 group overflow-hidden">
                  <Image
                    src="/images/content/snellman-sothebys-yritys.jpg"
                    alt={getHomepageTranslation('openNewDoors', language)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
                    <h3 className="text-2xl font-light mb-4 text-center">{getHomepageTranslation('openNewDoors', language)}</h3>
                    <Link 
                      href="/kohteet"
                      className="inline-block border-2 border-white text-white px-6 py-2 
                               hover:bg-white hover:text-[#1a3a4a] transition-all duration-300 
                               font-light uppercase tracking-wider text-sm"
                    >
                      {getHomepageTranslation('findDreamHome', language)}
                    </Link>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="relative h-80 group overflow-hidden">
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
                    <Link 
                      href="/yritys"
                      className="inline-block border-2 border-white text-white px-6 py-2 
                               hover:bg-white hover:text-[#324b72] transition-all duration-300 
                               font-light uppercase tracking-wider text-sm"
                    >
                      {getHomepageTranslation('readMoreAboutUs', language)}
                    </Link>
                  </div>
                </div>

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
                    <Link 
                      href="/myymassa"
                      className="inline-block border-2 border-white text-white px-6 py-2 
                               hover:bg-white hover:text-gray-800 transition-all duration-300 
                               font-light uppercase tracking-wider text-sm"
                    >
                      {getHomepageTranslation('contactUs', language)}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Office Hours Section */}
          <section className="py-8 bg-white">
            <div className="container mx-auto px-4 text-center">
              <h3 className="text-2xl font-light text-gray-900">
                {getHomepageTranslation('officeHoursLine1', language)}<br />
                {getHomepageTranslation('officeHoursLine2', language)}<br />
                {getHomepageTranslation('officeHoursLine3', language)}
              </h3>
            </div>
          </section>

          {/* Contact Info Bar */}
          <section className="py-8 bg-gray-100">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h4 className="text-lg font-light">
                    <a href="tel:+358103156900" className="text-gray-900 hover:text-[#1a3a4a] transition-colors">
                      +358 (0)10 315 6900
                    </a>
                  </h4>
                </div>
                <div>
                  <h4 className="text-lg font-light">
                    <a  
                      href="https://goo.gl/maps/8HptT8TwUp42" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-[#1a3a4a] transition-colors"
                    >
                      Kasarmikatu 34, 00130 Helsinki
                    </a>
                  </h4>
                </div>
                <div>
                  <h4 className="text-lg font-light">
                    <a 
                      href="mailto:info@sothebysrealty.fi" 
                      className="text-gray-900 hover:text-[#1a3a4a] transition-colors"
                    >
                      info@sothebysrealty.fi
                    </a>
                  </h4>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section 
            className="py-16 bg-cover bg-center relative"
            style={{ backgroundImage: 'url(/images/content/snellman-sothebys-newsletter.jpg)' }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-md mx-auto text-center">
                <h2 className="text-3xl font-light text-white mb-8">
                  {getHomepageTranslation('subscribeNewsletter', language)}
                </h2>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder={getHomepageTranslation('firstName', language)}
                    className="w-full px-4 py-3 bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 font-light"
                  />
                  <input
                    type="text"
                    placeholder={getHomepageTranslation('lastName', language)}
                    className="w-full px-4 py-3 bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 font-light"
                  />
                  <input
                    type="email"
                    placeholder={getHomepageTranslation('email', language)}
                    className="w-full px-4 py-3 bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 font-light"
                  />
                  <div className="flex items-start text-left">
                    <input type="checkbox" className="mt-1 mr-2" required />
                    <label className="text-white text-sm font-light">
                      {getHomepageTranslation('privacyConsent', language)}{' '}
                      <a href="/tietosuojaseloste" className="underline hover:no-underline">
                        {getHomepageTranslation('privacyPolicy', language)}
                      </a>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#1a3a4a] text-white px-8 py-3 
                             hover:bg-[#0f2633] transition-colors duration-300 
                             font-light uppercase tracking-wider text-sm"
                  >
                    {getHomepageTranslation('subscribe', language)}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
      </div>
    );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}