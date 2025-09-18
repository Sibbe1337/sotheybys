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

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Our Services
              </h2>
              <div className="space-y-4 text-gray-700 font-light leading-relaxed max-w-4xl mx-auto">
                <p>
                  We want to be involved in the major financial decision-making of your life, with the dignity it requires. 
                  You can always be assured that you will receive the most knowledgeable and confidential advice from our experienced brokers.
                </p>
                <p>
                  We want to be part of the entire sales process, from the free valuation to the deal. 
                  Our uncompromising goal is that the cooperation is fruitful and that all our customers return to us in the future as well.
                </p>
                <p className="pt-4">
                  Request a service quote with a free valuation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Our Services Column */}
              <div className="bg-white p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-8">
                  Our Services
                </h2>
                <div className="space-y-4 text-gray-700 font-light text-sm leading-relaxed">
                  <p>
                    We want to be involved in the major financial decision-making of your life, with the dignity it requires. 
                    You can always be assured that you will receive the most knowledgeable and confidential advice from our experienced brokers.
                  </p>
                  <p>
                    We want to be part of the entire sales process, from the free valuation to the deal. 
                    Our uncompromising goal is that the cooperation is fruitful and that all our customers return to us in the future as well.
                  </p>
                  <p className="pt-4">
                    Request a service quote with a free valuation.
                  </p>
                </div>
              </div>

              {/* Price List Column */}
              <div className="bg-white p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-8">
                  Price List
                </h2>
                <div className="space-y-1 text-sm">
                  <div className="font-light text-gray-700 mb-4">
                    <div className="mb-2">Brokerage / Sales Assignment</div>
                    <div className="grid grid-cols-2 gap-y-1">
                      <div>Apartment shares</div>
                      <div className="text-right">5% incl. VAT 25.5%*</div>
                      <div>Properties</div>
                      <div className="text-right">6% incl. VAT 25.5%*</div>
                      <div>Remote and special properties</div>
                      <div className="text-right">7% incl. VAT 25.5%*</div>
                      <div>Rental assignment</div>
                      <div className="text-right">2 months' rent incl. VAT 25.5%*</div>
                      <div>Minimum fee</div>
                      <div className="text-right">€5750 incl. VAT 25.5%*</div>
                      <div>International visibility</div>
                      <div className="text-right">+0.50% incl. VAT 25.5%**</div>
                    </div>
                  </div>
                  <div className="font-light text-gray-700 pt-4">
                    <div className="mb-2">Initial fee</div>
                    <div className="grid grid-cols-2 gap-y-1">
                      <div>Apartment shares</div>
                      <div className="text-right">From €500 incl. VAT 25.5%*</div>
                      <div>Properties / Remote and special properties</div>
                      <div className="text-right">From €3000 incl. VAT 25.5%*</div>
                    </div>
                  </div>
                  <div className="pt-4 text-xs text-gray-600">
                    <p>* Or by agreement</p>
                    <p>** As applicable</p>
                  </div>
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