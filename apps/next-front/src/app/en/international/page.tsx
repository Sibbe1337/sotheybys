import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export default function InternationalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section with Background */}
        <section 
          className="relative h-[600px] flex items-center justify-center text-white"
          style={{
            backgroundImage: 'url("/images/international/stockholm-cityscape.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-thin mb-6">
              Your international broker<br />
              locally
            </h1>
            <p className="text-lg md:text-xl font-light mb-12">
              26,100 agents in 1,000 offices in 84 countries and territories
            </p>
            <Link 
              href="/en/international"
              className="international-button"
            >
              READ MORE &gt;
            </Link>
          </div>
        </section>

        {/* Social Media Icons */}
        <section className="py-6 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-6">
              <a 
                href="https://www.facebook.com/Snellmansothebysrealty/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center
                         text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/snellman-sothebys-international-realty" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center
                         text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="mailto:info@sothebysrealty.fi"
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center
                         text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Unique global<br />
                reach and local expertise
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-gray-700">
                <a href="tel:+358103156900" className="hover:text-[var(--color-primary)] transition-colors font-light">
                  +358 (0)10 315 6900
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="https://goo.gl/maps/8HptT8TwUp42" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-[var(--color-primary)] transition-colors font-light">
                  Kasarmikatu 34, 00130<br className="md:hidden" />
                  Helsinki
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="mailto:info@sothebysrealty.fi" className="hover:text-[var(--color-primary)] transition-colors font-light">
                  info@sothebysrealty.fi
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-8">
                We open new doors internationally
              </h2>
              <div className="space-y-4 text-gray-700 font-light leading-relaxed">
                <p>
                  Our expertise is not based solely on local market knowledge, as we also work in 
                  international markets. Sotheby's International Realty®, as well as us as part of a large chain, has access 
                  to the most effective and influential marketing and advertising channels around the world.
                </p>
                <p>
                  We highlight all the homes for sale as unique properties in both domestic and international 
                  channels. We select and recommend the best marketing channels for your property. Our advertising is visible 
                  in all major digital and print marketing channels both in Finland and around the world...
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* Sweden */}
              <div className="group">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/international/sweden-waterfront.jpg"
                    alt="Sweden"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-light text-gray-900 mb-2">Sweden</h3>
                  <p className="text-sm text-gray-600 font-light italic mb-3">
                    Perfecting Work-Life Balance<br />
                    by: Iyna Bort Caruso
                  </p>
                  <p className="text-gray-700 font-light text-sm leading-relaxed mb-4">
                    Sweden real estate dates back centuries and yet progressiveness defines its architecture, design 
                    aesthetic and social welfare system. One of the world's most generous social services systems 
                    includes universal health care, affordable child care and a parental leave policy of up to 480 paid 
                    days per child. Life is good for seniors, too. A 2013 report by Global AgeWatch ranked Sweden 
                    first out of 91 countries when considering such factors as health care, income security and the 
                    environment for older adults. On the job, Sweden's corporate culture emphasizes live-work 
                    balance believing perks like flexible working hours yields a more productive work force...
                  </p>
                  <a href="#" className="text-[var(--color-primary)] hover:underline font-light text-sm">
                    Read more...
                  </a>
                </div>
              </div>

              {/* Portugal */}
              <div className="group">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/international/portugal-coast.jpg"
                    alt="Portugal"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-light text-gray-900 mb-2">Portugal</h3>
                  <p className="text-sm text-gray-600 font-light italic mb-3">
                    Iberian Beauty<br />
                    by: Iyna Bort Caruso
                  </p>
                  <p className="text-gray-700 font-light text-sm leading-relaxed mb-4">
                    Portugal is a country best appreciated slowly, like a sip of its vintage port wine.<br /><br />
                    A founding member of the European Union and euro zone, Portugal has transitioned from an economy 
                    based on traditional industries to one based on technology. Leading international companies are 
                    investing here. Its infrastructure is strong and establishing a business is fast. For those interested in 
                    relocating, the opportunity to settle in this charmed corner of the continent through a burgeoning 
                    Portugal luxury real estate market is a powerful incentive...
                  </p>
                  <a href="#" className="text-[var(--color-primary)] hover:underline font-light text-sm">
                    Read more...
                  </a>
                </div>
              </div>

              {/* Mallorca */}
              <div className="group">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/international/mallorca-harbor.jpg"
                    alt="Mallorca"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-light text-gray-900 mb-2">Mallorca</h3>
                  <p className="text-sm text-gray-600 font-light italic mb-3">
                    Abundance in the Balearics<br />
                    by: Iyna Bort Caruso
                  </p>
                  <p className="text-gray-700 font-light text-sm leading-relaxed mb-4">
                    Joan Miró painted here. Frederic Chopin composed here. Robert Graves wrote here.<br /><br />
                    Here is Mallorca, part of Spain's Balearic Islands. The Balearic isles, an autonomous archipelago, are 
                    clustered in the Mediterranean. Mallorca is the largest of the four main islands, followed by Minorca, Ibiza 
                    and Formentera. The Carthaginians, Romans, Vandals, Moors, French and British all left their marks here...
                  </p>
                  <a href="#" className="text-[var(--color-primary)] hover:underline font-light text-sm">
                    Read more...
                  </a>
                </div>
              </div>

              {/* Estonia */}
              <div className="group">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/international/stockholm-cityscape.jpg"
                    alt="Estonia"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-light text-gray-900 mb-2">Estonia</h3>
                  <p className="text-sm text-gray-600 font-light italic mb-3">
                    Living in Estonia<br />
                    by: Iyna Bort Caruso
                  </p>
                  <p className="text-gray-700 font-light text-sm leading-relaxed mb-4">
                    Estonia withstood centuries of foreign rule including the Danes, Swedes, Germans and Russians – both 
                    Tsarist and Soviet, the last Russian troops left in 1994. Today the smallest of the Baltic States is a member of 
                    the European Union and NATO. It is especially proud of its high tech culture. It also has one of the world's 
                    longest paid maternity leaves.<br /><br />
                    Estonia lies on the shores of the Baltic Sea, a ferry ride from Finland and Sweden and a three-hour flight 
                    or less to most major European cities. The republic is made up of 15 counties and more than 2,000 islands, 
                    most of them small in size with tiny populations to match...
                  </p>
                  <a href="#" className="text-[var(--color-primary)] hover:underline font-light text-sm">
                    Read more...
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Property Types Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Urban Metropolitan */}
              <div className="group cursor-pointer">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/international/new-york-skyline.jpg"
                    alt="Urban Metropolitan Properties"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                    <h3 className="text-2xl font-light mb-4">
                      Urban Metropolitan<br />
                      Properties
                    </h3>
                    <button className="border border-white px-6 py-2 hover:bg-white hover:text-black transition-all uppercase text-sm font-light">
                      DISCOVER YOUR OWN URBAN<br />
                      OASIS...►
                    </button>
                  </div>
                </div>
              </div>

              {/* Luxury Ski */}
              <div className="group cursor-pointer">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/international/ski-mountain-property.jpg"
                    alt="Luxury Ski Properties"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                    <h3 className="text-2xl font-light mb-4">
                      Luxury Ski Properties
                    </h3>
                    <button className="border border-white px-6 py-2 hover:bg-white hover:text-black transition-all uppercase text-sm font-light">
                      FIND SKI PROPERTIES...►
                    </button>
                  </div>
                </div>
              </div>

              {/* Tranquil Beachfront */}
              <div className="group cursor-pointer">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/international/beachfront-property.jpg"
                    alt="Tranquil Beachfront Homes"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                    <h3 className="text-2xl font-light mb-4">
                      Tranquil Beachfront<br />
                      Homes
                    </h3>
                    <button className="border border-white px-6 py-2 hover:bg-white hover:text-black transition-all uppercase text-sm font-light">
                      OWN A SLICE OF PARADISE...►
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* More Destinations */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* Florida */}
              <div className="bg-gray-50 p-8">
                <h3 className="text-2xl font-light text-gray-900 mb-4">Florida</h3>
                <p className="text-sm text-gray-600 font-light italic mb-3">
                  The Sunshine State is the Subtropical Capital of Cool<br />
                  by: Amy Reeves
                </p>
                <p className="text-gray-700 font-light text-sm leading-relaxed mb-4">
                  Welcome to Miami, a city with two distinct personalities. Over the years, it has played a colorful array 
                  of roles from pirates' lair to drug runners' paradise to a refined beach resort. It has survived booms and 
                  busts. It was built on a murky mangrove swamp that once lured only mosquitoes and snakes. The one constant 
                  in Miami: It has always courted reinvention.<br /><br />
                  The greater Miami mindset is one of preservation and reinvention. Historic Art Deco and Miami 
                  Modern architecture, mix with spiraling post-modern towers. It is an evolving, sun-drenched 
                  skyline.<br /><br />
                  The fact is that art permeates the city year-round. Whole neighborhoods have been revitalized by its 
                  creative community, making Miami real estate a great investment for aesthetes...
                </p>
                <a href="#" className="text-[var(--color-primary)] hover:underline font-light text-sm">
                  Read more...
                </a>
              </div>

              {/* Provence */}
              <div className="bg-gray-50 p-8">
                <h3 className="text-2xl font-light text-gray-900 mb-4">Provence-Alpes – Côte d'Azur</h3>
                <p className="text-sm text-gray-600 font-light italic mb-3">
                  Real Estate Royalty<br />
                  by: Amy Reeves
                </p>
                <p className="text-gray-700 font-light text-sm leading-relaxed mb-4">
                  Sunny southeastern France shines brightly above the region's bounty. The area, known as Provence-Alpes-
                  Côte d'Azur, covers a section of France with near fairy-tale riches. Within a short drive, one can travel from an Alpine peak, pass 
                  lavender fields, vineyards and medieval villages and end up on the glorious Mediterranean coast.<br /><br />
                  This historically stable and resilient property market has long attracted European elite. Buyers 
                  from the U.K. famously make their playground here but the locale has a global stature. The region 
                  borders Italy to the east, the Mediterranean to the south, the Rhone River to the west and the 
                  foothills of the Southern Alps to the north...
                </p>
                <a href="#" className="text-[var(--color-primary)] hover:underline font-light text-sm">
                  Read more...
                </a>
              </div>

              {/* New York */}
              <div className="bg-gray-50 p-8">
                <h3 className="text-2xl font-light text-gray-900 mb-4">New York</h3>
                <p className="text-sm text-gray-600 font-light italic mb-3">
                  America's Global Address<br />
                  by: Amy Reeves
                </p>
                <p className="text-gray-700 font-light text-sm leading-relaxed mb-4">
                  Think of Manhattan, and a barrage of images comes to mind. Broadway, Wall Street, Times 
                  Square. The city is as boundless as a skyscraper and as diverse as the structures that line its 
                  horizon. Manhattan isn't just an American city but a world capital fueled by finance, fashion, health 
                  care, and media. This makes Manhattan one of the premier markets in the world for luxury real estate, 
                  with high end condos, luxurious penthouses and elegant homes...
                </p>
                <a href="#" className="text-[var(--color-primary)] hover:underline font-light text-sm">
                  Read more...
                </a>
              </div>

              {/* Empty space for layout */}
              <div></div>

            </div>
          </div>
        </section>

        {/* Bottom Property Types */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Wine & Vineyard */}
              <div className="group cursor-pointer">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/international/vineyard-property.jpg"
                    alt="Wine & Vineyard Properties"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                    <h3 className="text-2xl font-light mb-4">
                      Wine & Vineyard<br />
                      Properties
                    </h3>
                    <button className="border border-white px-6 py-2 hover:bg-white hover:text-black transition-all uppercase text-sm font-light">
                      SEARCH FINE WINERY AND<br />
                      VINEYARDS...►
                    </button>
                  </div>
                </div>
              </div>

              {/* Champion Golf */}
              <div className="group cursor-pointer">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/international/golf-property.jpg"
                    alt="Champion Golf Properties"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                    <h3 className="text-2xl font-light mb-4">
                      Champion Golf<br />
                      Properties
                    </h3>
                    <button className="border border-white px-6 py-2 hover:bg-white hover:text-black transition-all uppercase text-sm font-light">
                      VIEW GOLF PROPERTIES...►
                    </button>
                  </div>
                </div>
              </div>

              {/* Majestic Mountain */}
              <div className="group cursor-pointer">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/international/ski-mountain-property.jpg"
                    alt="Majestic Mountain Properties"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                    <h3 className="text-2xl font-light mb-4">
                      Majestic Mountain<br />
                      Properties
                    </h3>
                    <button className="border border-white px-6 py-2 hover:bg-white hover:text-black transition-all uppercase text-sm font-light">
                      EXPLORE RUGGED<br />
                      LANDSCAPES & RETREATS...►
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}