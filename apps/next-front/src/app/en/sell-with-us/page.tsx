import Link from 'next/link';
import Image from 'next/image';
import { VideoSection } from '@/components/ui/VideoSection';

export const revalidate = 60;

export default function SellingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section with Background */}
        <section 
          className="relative h-[600px] flex items-center justify-center text-white"
          style={{
            backgroundImage: 'url("/images/international/helsinki-waterfront.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/70 to-[var(--color-primary)]/50"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-thin mb-8">
              Sell with Us
            </h1>
            <p className="text-lg md:text-xl font-light leading-relaxed mb-12 max-w-3xl mx-auto">
              We want to create a sustainable customer relationship where we take into account your smallest 
              needs and wishes. We discuss openly and listen carefully, as our mission 
              is to make your dreams come true.
            </p>
            <Link 
              href="/en/contact-us"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 
                       hover:bg-white hover:text-[var(--color-primary)] transition-all duration-300 
                       font-light uppercase tracking-wider text-sm"
            >
              MAKE THE PROPERTY DEAL OF YOUR LIFE &gt;
            </Link>
          </div>
        </section>

        {/* Attention Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
                Don't just get it on the market. Get it the attention it deserves.
              </h2>
              <p className="text-lg text-gray-700 font-light leading-relaxed mb-8">
                For those who demand an elevated service like none other, there's Sotheby's International Realty. 
                We're the industry's best agents, curating with incomparable attention to style and detail. 
                We're here for you to help sell your home at a scale you just won't find anywhere else.
              </p>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Welcome to a successful property transaction!
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-gray-700">
                <a href="tel:+358103156900" className="hover:text-[var(--color-primary)] transition-colors font-light">
                  +358 (0)10 315 6900
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="https://goo.gl/maps/8HptT8TwUp42" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-[var(--color-primary)] transition-colors font-light">
                  Kasarmikatu 34,<br className="md:hidden" />
                  00130 Helsinki
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="mailto:info@sothebysrealty.fi" className="hover:text-[var(--color-primary)] transition-colors font-light">
                  info@sothebysrealty.fi
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Form and Mission Section Side by Side */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {/* Valuation Form */}
              <div className="bg-gray-100 p-8 lg:p-12">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
                  Book a free valuation!
                </h2>
                <p className="text-gray-700 font-light mb-2">
                  Do you know your property's market value?
                </p>
                <p className="text-gray-700 font-light mb-8">
                  Invite us for a free valuation – you'll get the most knowledgeable assessment in the area.
                </p>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                  </div>
                  
                  <textarea
                    placeholder="Message"
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light resize-none"
                  />
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacy-en"
                      required
                      className="mt-1"
                    />
                    <label htmlFor="privacy-en" className="text-sm text-gray-700 font-light">
                      I have read the{' '}
                      <Link href="/en/privacy-policy" className="text-[var(--color-primary)] hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="newsletter-en"
                      className="mt-1"
                    />
                    <label htmlFor="newsletter-en" className="text-sm text-gray-700 font-light">
                      I want to receive the Snellman Sotheby's Newsletter
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[var(--color-primary)] text-white px-6 py-3 hover:bg-[#0f2633] 
                             transition-colors duration-300 font-light"
                  >
                    Send
                  </button>
                </form>
              </div>

              {/* Mission Section */}
              <div className="bg-white p-8 lg:p-12">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
                  Mission of Honor
                </h2>
                <div className="space-y-4 text-gray-700 font-light leading-relaxed text-sm">
                  <p>
                    Snellman | Sotheby's International Realty Finland operates as part of one of the world's largest and most successful 
                    real estate brokerage chains Sotheby's International Realty®, so we offer you an extensive contact network 
                    with experts. Our sales channels cover an efficient global marketing network.
                  </p>
                  <p>
                    We specialize in premium properties. Every assignment receives a position as our sales property that guarantees it special, 
                    higher quality service than usual.
                  </p>
                  <p>
                    We offer you extensive expertise in both domestic and international markets. We represent the best expertise 
                    in the industry and handle the entire sales process from beginning to end with heart. We guarantee that through us 
                    you have access to the industry's most modern and efficient marketing channels as well as an extensive customer network. 
                    This way we achieve the highest possible sales price for your property.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* A Valuable Relationship Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 text-center">
                A Valuable Relationship
              </h2>
              <div className="space-y-6 text-gray-700 font-light leading-relaxed text-base">
                <p>
                  Our wish is that cooperation with us always equals a long-term relationship on a personal level. 
                  We regard every single one of our customers as unique and valuable, all aspects considered. 
                  We all have different needs and preferences, and we discuss and customize according to our customers' wishes and requirements. 
                  Our mission is to make your dream come true.
                </p>
                <p>
                  Snellman Sotheby's International Realty Finland is part of one of the most prestigious real estate chains in the world. 
                  Membership in Sotheby's International Realty® equals membership in a global network with excessive expertise, 
                  vital contacts, extraordinary sales channels as well as access to the most effective marketing channels available.
                </p>
                <p>
                  We specialize in luxury and high-end real estate and we provide you the most desirable of homes that the market has to offer. 
                  Our experienced team members are always honored to share their expertise with you and we wish to be part of the process 
                  from beginning to end. We guarantee you access to the latest marketing channels, the correct customer network, 
                  the highest possible price and of course an experience you will fondly remember.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Service Promise Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 text-center">
                Our Service Promise
              </h2>
              <div className="space-y-6 text-gray-700 font-light leading-relaxed text-base">
                <p>
                  We want to support you when you are about to make one of the most important financial decisions of your life 
                  and make sure you take the right choice. We guarantee that you get our experienced experts' opinion and support 
                  throughout the whole process. Our highest wish is that all our customers feel comfortable with us and that 
                  cooperation in the future will be a natural decision for every one of our customers.
                </p>
                <p>
                  Please do not forget to ask for a service offer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-12 text-center">
                Price List
              </h2>
              
              <div className="bg-gray-50 p-8 md:p-12 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left pb-4 font-light text-lg">Broker / Sales Assignments</th>
                      <th className="text-right pb-4 font-light text-lg"></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Apartments</td>
                      <td className="py-3 text-right font-light">5% incl. VAT 25.5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Properties</td>
                      <td className="py-3 text-right font-light">6% incl. VAT 25.5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Long-distance and special listings</td>
                      <td className="py-3 text-right font-light">7% incl. VAT 25.5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Assignment for rentals</td>
                      <td className="py-3 text-right font-light">2 months rent incl. VAT 25.5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Minimum fee</td>
                      <td className="py-3 text-right font-light">€5750 incl. VAT 25.5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">International visibility</td>
                      <td className="py-3 text-right font-light">+0.50% incl. VAT 25.5%**</td>
                    </tr>
                  </tbody>
                </table>
                
                <table className="w-full mt-8">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left pb-4 font-light text-lg">Start-up fee</th>
                      <th className="text-right pb-4 font-light text-lg"></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Apartments</td>
                      <td className="py-3 text-right font-light">From €500 incl. VAT 25.5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Properties / Long-distance and special listings</td>
                      <td className="py-3 text-right font-light">From €3000 incl. VAT 25.5%*</td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="mt-8 text-sm text-gray-600 font-light">
                  <p>* According to agreement</p>
                  <p>** When applicable</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <VideoSection 
          videoId="hdXkBWw9wk0"
          title="Why Sell With Us?"
          subtitle="See how we help our clients achieve successful property transactions"
        />

        {/* Consumer Dispute Section */}
        <section className="py-12 bg-[var(--color-primary)] text-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl font-light mb-4">
                Consumer Dispute
              </h2>
              <p className="font-light mb-2">
                A dispute concerning the agreement can be brought to the Consumer Disputes Board for resolution.
              </p>
              <p className="font-light">
                More information at:{' '}
                <a href="https://www.kuluttajariita.fi" target="_blank" rel="noopener noreferrer" 
                   className="text-white underline hover:text-gray-200">
                  www.kuluttajariita.fi
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}