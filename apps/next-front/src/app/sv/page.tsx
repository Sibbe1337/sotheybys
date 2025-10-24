import HeroCarousel from '@/components/Homepage/HeroCarousel';
import PropertyGrid from '@/components/Property/PropertyGrid';
import { getClient } from '@/lib/wordpress';
import { GET_HOMEPAGE_DATA } from '@/graphql/homepage-queries';
import { fetchLinearListings, fetchTestLinearListings } from '@/lib/linear-api-adapter';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/config/images';

export const revalidate = 60; // ISR: revalidate every 60 seconds

// Default hero slides matching the original site - Swedish version
const defaultSlides = [
  {
    id: '1',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/57809e7b-2fe2-430d-a7d7-aff39337d0c1/ead27130-4e08-465e-af6d-500d593ae0db.jpg',
    title: 'Din internationella mäklare lokalt',
    subtitle: '26 100 mäklare • 1100 kontor • 84 länder och regioner',
    buttonText: 'Vi öppnar nya dörrar',
    buttonLink: '#vi-oppnar-nya-dorrar'
  },
  {
    id: '2',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/3cfbb584-8fc0-493a-8b2f-66edf18b027a/e3ffa954-b4a1-4ed6-bed1-f131955d96c2.jpg',
    title: 'Välkommen till en framgångsrik bostadsaffär!',
    subtitle: 'Se alla våra objekt till salu.',
    buttonText: 'Hitta ditt drömhem',
    buttonLink: '/sv/objekt/'
  },
  {
    id: '3',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/d01a884f-d504-4652-adf7-29026c1a7449/700fc7d6-6bab-4e3b-baf8-816b8a9f5a02.jpg',
    title: 'Snellman Sotheby\'s International Realty®',
    subtitle: 'Vi vill skapa en hållbar kundrelation där vi tar hänsyn till era minsta önskemål och behov.',
    buttonText: 'Bekanta dig med vårt arbetssätt',
    buttonLink: '/sv/om-oss/'
  },
  {
    id: '4',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/95bfa5eb-449f-40b8-987b-6f65dde19cc0/9e7aa9bf-6a73-4120-a0f4-b75e1eb29b4c.jpg',
    title: 'Referenser',
    subtitle: 'Ett urval av sålda objekt',
    buttonText: 'Se objekten',
    buttonLink: '/sv/objekt/referenser/'
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
        city: 'Helsingfors',
        bedrooms: undefined,
        bathrooms: undefined,
        area: 97.21,
        propertyType: 'Höghus',
        status: 'Till salu',
        description: '3r, k, sovrum/arbetsrum, loft, 2 x badrum, 2 ingångar'
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
        propertyType: 'Egnahemshus',
        status: 'Till salu',
        description: '6 sovrum, öppet kök, vardagsrum, matplats, loft, hall, badrum, bastu, 3 wc, förråd, terrass, carport'
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
        city: 'Raseborg',
        bedrooms: 4,
        bathrooms: undefined,
        area: 385,
        propertyType: 'Egnahemshus',
        status: 'Till salu',
        description: 'Huvudbyggnad; 4 sovrum, vardagsrum, 2 matplatser, Sidobyggnad; 4 sovrum, Bastubyggnad.'
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
        city: 'Nådendal',
        bedrooms: 2,
        bathrooms: 2,
        area: 158,
        propertyType: 'Egnahemshus',
        status: 'Till salu',
        description: '2 sovrum, vardagsrum, öppet kök, matplats, 2 badrum, bastu, 3 wc, förråd, terrass, garage, strandbastu'
      }
    }
  },
  {
    id: '5',
    title: 'Albertsgatan 19 B',
    slug: 'albertinkatu-19-b',
    featuredImage: {
      node: {
        sourceUrl: 'https://d33xsej2pkrh3b.cloudfront.net/640x427,fit,q85,f=webp/oviproprodmedia/Production/realty/57809e7b-2fe2-430d-a7d7-aff39337d0c1/ead27130-4e08-465e-af6d-500d593ae0db.jpg',
        altText: 'Albertsgatan 19 B'
      }
    },
    acfRealEstate: {
      property: {
        price: undefined,
        address: 'Albertsgatan 19 B',
        city: 'Helsingfors',
        bedrooms: 2,
        bathrooms: 2,
        area: 108,
        propertyType: 'Höghus',
        status: 'Till salu',
        description: '2-3r, k, 2 badrum/wc, hall.'
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
        city: 'Kyrkslätt',
        bedrooms: 2,
        bathrooms: undefined,
        area: 150,
        propertyType: 'Egnahemshus',
        status: 'Till salu',
        description: 'Huvudbyggnad: 2-3r, öppet kök, badrum, 2 wc, förråd, hall., Sidobyggnad: öppet kök, vardagsrum, Strandbastu och stuga, förråd'
      }
    }
  }
];

export default async function HomePage() {
  try {
    // Fetch homepage data from WordPress
    const { data } = await getClient().query({
      query: GET_HOMEPAGE_DATA,
    });

    // Extract data
    const homepage = data?.page;
    const properties = data?.posts?.nodes || [];
    const mediaItems = data?.mediaItems?.nodes || [];
    
    // Try to fetch from Linear API
    let displayProperties = sampleProperties;
    
    try {
      // First try real Linear API
      const linearProperties = await fetchLinearListings();
      
      if (linearProperties && linearProperties.length > 0) {
        console.log('Using Linear API properties');
        displayProperties = linearProperties;
      } else {
        // If no real properties, try test API for demo
        console.log('Trying test Linear API...');
        const testProperties = await fetchTestLinearListings();
        if (testProperties && testProperties.length > 0) {
          console.log('Using test Linear API properties');
          displayProperties = testProperties;
        }
      }
    } catch (error) {
      console.log('Using sample properties, Linear API error:', error);
    }
    
    // Process hero slides
    let heroSlides = defaultSlides;
    
    // Check if ACF slider data exists
    if (homepage?.acf?.heroSlider?.slide && homepage.acf.heroSlider.slide.length > 0) {
      heroSlides = homepage.acf.heroSlider.slide.map((slide: any, index: number) => ({
        id: `slide-${index}`,
        image: slide.image?.sourceUrl || defaultSlides[0].image,
        title: slide.title || 'Välkommen till Sotheby\'s',
        subtitle: slide.subtitle || '',
        buttonText: slide.buttonText || 'LÄS MER',
        buttonLink: slide.buttonLink || '/sv/objekt'
      }));
    }

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
                  Objekt till salu
                </h2>
                <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-6"></div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
                  Upptäck vår noggrant utvalda samling av lyxfastigheter på Finlands mest eftertraktade platser
                </p>
              </div>

              {/* Property Grid */}
              <PropertyGrid properties={displayProperties} />
              
              {/* View All Button */}
              <div className="text-center mt-12">
                <Link
                  href="/sv/objekt"
                  className="inline-block bg-[#1a3a4a] text-white px-8 py-3 
                           hover:bg-[#0f2633] transition-colors duration-300 
                           font-light uppercase tracking-wider text-sm"
                >
                  Alla våra objekt till salu
                </Link>
              </div>
            </div>
          </section>

          {/* Three Column Section - Vi öppnar nya dörrar */}
          <section id="vi-oppnar-nya-dorrar" className="py-16 bg-white">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8">
                  Välkommen till en framgångsrik bostadsaffär!
                </h2>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                  Vi har fört en av världens största fastighetsförmedlingskedjor, Sotheby's International Realty®, 
                  kunskap och erfarenhet till den finska bostadsmarknaden. Genom att öppna fastighetsmarknaderna 
                  över nationsgränserna vill vi utveckla hela branschen. Vår inspiration kommer från intressanta 
                  och unika objekt över hela världen.
                </p>
              </div>

              {/* Three Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="relative h-80 group overflow-hidden">
                  <Image
                    src="/images/content/snellman-sothebys-yritys.jpg"
                    alt="Vi öppnar nya dörrar"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
                    <h3 className="text-2xl font-light mb-4 text-center">Vi öppnar nya dörrar!</h3>
                    <Link 
                      href="/sv/objekt"
                      className="inline-block border-2 border-white text-white px-6 py-2 
                               hover:bg-white hover:text-[#1a3a4a] transition-all duration-300 
                               font-light uppercase tracking-wider text-sm"
                    >
                      Hitta ditt drömhem
                    </Link>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="relative h-80 group overflow-hidden">
                  <Image
                    src="/images/content/snellman-sothebys-kutsu-arviokaynnille.jpg"
                    alt="Expertis"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#324b72] bg-opacity-80 flex flex-col items-center justify-center text-white p-8">
                    <h3 className="text-2xl font-light mb-4 text-center">
                      Expertis som sträcker sig från kvarteret till staden och runt om i världen
                    </h3>
                    <Link 
                      href="/sv/om-oss"
                      className="inline-block border-2 border-white text-white px-6 py-2 
                               hover:bg-white hover:text-[#324b72] transition-all duration-300 
                               font-light uppercase tracking-wider text-sm"
                    >
                      Läs mer om vårt företag
                    </Link>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="relative h-80 group overflow-hidden">
                  <Image
                    src="/images/content/snellman-sothebys-nakoalapaikka.jpg"
                    alt="Värdering"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-60 flex flex-col items-center justify-center text-white p-8">
                    <h3 className="text-2xl font-light mb-4 text-center">
                      Bjud in oss för en kostnadsfri värdering
                    </h3>
                    <Link 
                      href="/sv/salj-med-oss"
                      className="inline-block border-2 border-white text-white px-6 py-2 
                               hover:bg-white hover:text-gray-800 transition-all duration-300 
                               font-light uppercase tracking-wider text-sm"
                    >
                      Kontakta oss
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
                Vårt magnifika kontor betjänar<br />
                er vardagar 10:00 – 17:00<br />
                samt övriga tider enligt överenskommelse.
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
                      Kasarmikatu 34, 00130 Helsingfors
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
                  Prenumerera på vårt nyhetsbrev
                </h2>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Förnamn"
                    className="w-full px-4 py-3 bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 font-light"
                  />
                  <input
                    type="text"
                    placeholder="Efternamn"
                    className="w-full px-4 py-3 bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 font-light"
                  />
                  <input
                    type="email"
                    placeholder="E-post"
                    className="w-full px-4 py-3 bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 font-light"
                  />
                  <div className="flex items-start text-left">
                    <input type="checkbox" className="mt-1 mr-2" required />
                    <label className="text-white text-sm font-light">
                      Jag har läst dataskyddsbeskrivningen{' '}
                      <a href="/sv/dataskyddsbeskrivning" className="underline hover:no-underline">
                        Dataskyddsbeskrivning
                      </a>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#1a3a4a] text-white px-8 py-3 
                             hover:bg-[#0f2633] transition-colors duration-300 
                             font-light uppercase tracking-wider text-sm"
                  >
                    Prenumerera
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
      </div>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);
    
    // Fallback UI
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <HeroCarousel slides={defaultSlides} />
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-4">
                Laddar...
              </h2>
              <p className="text-gray-600">Vänligen uppdatera sidan</p>
            </div>
          </section>
        </main>
      </div>
    );
  }
}