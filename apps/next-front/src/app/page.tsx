import HeroCarousel from '@/components/Homepage/HeroCarousel';
import PropertyGrid from '@/components/Property/PropertyGrid';
import { getClient } from '@/lib/wordpress';
import { GET_HOMEPAGE_DATA } from '@/graphql/homepage-queries';
import { fetchLinearListings, fetchTestLinearListings } from '@/lib/linear-api-adapter';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/config/images';

export const revalidate = 60; // ISR: revalidate every 60 seconds

// Default hero slides matching the original site
const defaultSlides = [
  {
    id: '1',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/57809e7b-2fe2-430d-a7d7-aff39337d0c1/ead27130-4e08-465e-af6d-500d593ae0db.jpg',
    title: 'Kansainvälinen välittäjäsi paikallisesti',
    subtitle: '26 100 välittäjää 1100 välitystoimistossa 84 maassa ja alueella',
    buttonText: 'Avaamme uusia ovia',
    buttonLink: '#avaamme-uusia-ovia'
  },
  {
    id: '2',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/3cfbb584-8fc0-493a-8b2f-66edf18b027a/e3ffa954-b4a1-4ed6-bed1-f131955d96c2.jpg',
    title: 'Tervetuloa onnistuneeseen asuntokauppaan!',
    subtitle: 'Katso kaikki myynnissä olevat kohteemme.',
    buttonText: 'Löydä unelmien koti',
    buttonLink: 'https://sothebysrealty.fi/kohteet/'
  },
  {
    id: '3',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/d01a884f-d504-4652-adf7-29026c1a7449/700fc7d6-6bab-4e3b-baf8-816b8a9f5a02.jpg',
    title: 'Snellman Sotheby\'s International Realty®',
    subtitle: 'Haluamme luoda kestävän asiakassuhteen, jossa otamme huomioon teidän pienimmätkin toiveet ja tarpeet.',
    buttonText: 'Tutustu toimintatapaamme',
    buttonLink: 'https://sothebysrealty.fi/yritys/'
  },
  {
    id: '4',
    image: 'https://d33xsej2pkrh3b.cloudfront.net/1920x1280,fit,q85,f=webp/oviproprodmedia/Production/realty/95bfa5eb-449f-40b8-987b-6f65dde19cc0/9e7aa9bf-6a73-4120-a0f4-b75e1eb29b4c.jpg',
    title: 'Referenssit',
    subtitle: 'Valikoima myydyistä kohteista',
    buttonText: 'Tutustu kohteisiin',
    buttonLink: 'https://sothebysrealty.fi/wp/kohteet/referenssit/'
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
        title: slide.title || 'Welcome to Sotheby\'s',
        subtitle: slide.subtitle || '',
        buttonText: slide.buttonText || 'LEARN MORE',
        buttonLink: slide.buttonLink || '/properties'
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
                  Myyntikohteet
                </h2>
                <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-6"></div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
                  Tutustu huolella valittuun kokoelmaamme ylellisiä kiinteistöjä Suomen halutuimmissa kohteissa
                </p>
              </div>

              {/* Property Grid */}
              <PropertyGrid properties={displayProperties} />
              
              {/* View All Button */}
              <div className="text-center mt-12">
                <Link
                  href="/kohteet"
                  className="inline-block bg-[#1a3a4a] text-white px-8 py-3 
                           hover:bg-[#0f2633] transition-colors duration-300 
                           font-light uppercase tracking-wider text-sm"
                >
                  Kaikki myynnissä olevat kohteemme
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
                  Tervetuloa onnistuneeseen asuntokauppaan!
                </h2>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                  Olemme tuoneet Suomen asuntomarkkinoille yhden maailman suurimman kiinteistönvälitysketjun 
                  Sotheby's International Realty®:n osaamisen ja kokemuksen. Avaamalla kiinteistömarkkinat 
                  yli valtakunnan rajojen haluamme kehittää koko alaa. Inspiraationamme toimivat mielenkiintoiset 
                  ja uniikit kohteet kaikkialla maailmassa.
                </p>
              </div>

              {/* Three Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="relative h-80 group overflow-hidden">
                  <Image
                    src="/images/content/snellman-sothebys-yritys.jpg"
                    alt="Avaamme uusia ovia"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
                    <h3 className="text-2xl font-light mb-4 text-center">Avaamme uusia ovia!</h3>
                    <Link 
                      href="/kohteet"
                      className="inline-block border-2 border-white text-white px-6 py-2 
                               hover:bg-white hover:text-[#1a3a4a] transition-all duration-300 
                               font-light uppercase tracking-wider text-sm"
                    >
                      Löydä unelmiesi koti
                    </Link>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="relative h-80 group overflow-hidden">
                  <Image
                    src="/images/content/snellman-sothebys-kutsu-arviokaynnille.jpg"
                    alt="Asiantuntemus"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#324b72] bg-opacity-80 flex flex-col items-center justify-center text-white p-8">
                    <h3 className="text-2xl font-light mb-4 text-center">
                      Asiantuntemus joka ulottuu korttelista kaupunkiin ja aina maailman ympäri
                    </h3>
                    <Link 
                      href="/yritys"
                      className="inline-block border-2 border-white text-white px-6 py-2 
                               hover:bg-white hover:text-[#324b72] transition-all duration-300 
                               font-light uppercase tracking-wider text-sm"
                    >
                      Lue lisää yrityksestämme
                    </Link>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="relative h-80 group overflow-hidden">
                  <Image
                    src="/images/content/snellman-sothebys-nakoalapaikka.jpg"
                    alt="Arviokäynti"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-60 flex flex-col items-center justify-center text-white p-8">
                    <h3 className="text-2xl font-light mb-4 text-center">
                      Kutsu meidät maksuttomalle arviokäynnille
                    </h3>
                    <Link 
                      href="/myymassa"
                      className="inline-block border-2 border-white text-white px-6 py-2 
                               hover:bg-white hover:text-gray-800 transition-all duration-300 
                               font-light uppercase tracking-wider text-sm"
                    >
                      Ota meihin yhteyttä
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
                Upea toimistomme palvelee<br />
                teitä arkisin 10:00 – 17:00<br />
                sekä muina aikoina sopimuksen mukaan.
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
                      Kasarmikatu 34,<br />00130 Helsinki
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
                  Tilaa Uutiskirjeemme
                </h2>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Etunimi"
                    className="w-full px-4 py-3 bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 font-light"
                  />
                  <input
                    type="text"
                    placeholder="Sukunimi"
                    className="w-full px-4 py-3 bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 font-light"
                  />
                  <input
                    type="email"
                    placeholder="Sähköposti"
                    className="w-full px-4 py-3 bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 font-light"
                  />
                  <div className="flex items-start text-left">
                    <input type="checkbox" className="mt-1 mr-2" required />
                    <label className="text-white text-sm font-light">
                      Olen tutustunut Tietosuojaselosteeseen{' '}
                      <a href="/tietosuojaseloste" className="underline hover:no-underline">
                        Tietosuojaseloste
                      </a>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#1a3a4a] text-white px-8 py-3 
                             hover:bg-[#0f2633] transition-colors duration-300 
                             font-light uppercase tracking-wider text-sm"
                  >
                    Tilaa
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
                Loading...
              </h2>
              <p className="text-gray-600">Please refresh the page</p>
            </div>
          </section>
        </main>
      </div>
    );
  }
}