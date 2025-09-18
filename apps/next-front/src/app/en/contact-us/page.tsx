import Image from 'next/image';

export const revalidate = 60;

export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-6">
                Contact Us
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-light">
                We're here for you
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-light text-gray-900 mb-8">
                    Send a Message
                  </h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-light text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:border-[#1a3a4a] font-light"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-light text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:border-[#1a3a4a] font-light"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:border-[#1a3a4a] font-light"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-light text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:border-[#1a3a4a] font-light"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-light text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:border-[#1a3a4a] font-light"
                      >
                        <option value="">Select a subject</option>
                        <option value="buying">I'm buying</option>
                        <option value="selling">I'm selling</option>
                        <option value="renting">I'm renting</option>
                        <option value="valuation">Property valuation</option>
                        <option value="other">Other inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-light text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:border-[#1a3a4a] font-light resize-none"
                      />
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="privacy"
                        name="privacy"
                        required
                        className="mt-1 mr-3"
                      />
                      <label htmlFor="privacy" className="text-sm font-light text-gray-700">
                        I have read the privacy policy and accept the processing of my data *
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full md:w-auto px-8 py-4 bg-[#1a3a4a] text-white 
                               hover:bg-[#0f2633] transition-colors duration-300 
                               font-light tracking-wider uppercase text-sm"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                {/* Contact Information */}
                <div className="lg:pl-12">
                  <h2 className="text-2xl font-light text-gray-900 mb-8">
                    Contact Information
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Office Info */}
                    <div>
                      <h3 className="text-lg font-light text-gray-900 mb-4">
                        Office
                      </h3>
                      <div className="space-y-2 text-gray-700 font-light">
                        <p>Kasarmikatu 34, 00130 Helsinki</p>
                        <p className="mt-4">
                          <a href="tel:+358103156900" className="text-[#1a3a4a] hover:text-[#0f2633] transition-colors">
                            +358 (0)10 315 6900
                          </a>
                        </p>
                        <p>
                          <a href="mailto:info@sothebysrealty.fi" className="text-[#1a3a4a] hover:text-[#0f2633] transition-colors">
                            info@sothebysrealty.fi
                          </a>
                        </p>
                      </div>
                    </div>

                    {/* Opening Hours */}
                    <div>
                      <h3 className="text-lg font-light text-gray-900 mb-4">
                        Opening Hours
                      </h3>
                      <div className="space-y-2 text-gray-700 font-light">
                        <p>Weekdays: 10:00 – 17:00</p>
                        <p>Saturday: By appointment</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>

                    {/* Company Info */}
                    <div>
                      <h3 className="text-lg font-light text-gray-900 mb-4">
                        Company Information
                      </h3>
                      <div className="space-y-2 text-gray-700 font-light">
                        <p>Ab Snellman LKV Oy</p>
                        <p>Business ID: 2644749-2</p>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="mt-12">
                    <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 font-light">Map</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Image Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-gray-900 mb-4">
                  Welcome to Our Office
                </h2>
                <p className="text-lg text-gray-600 font-light">
                  Our beautiful office is located in the heart of Helsinki on Kasarmikatu
                </p>
              </div>
              <div className="relative h-96 lg:h-[500px]">
                <Image
                  src="/images/content/snellman-sothebys-toimisto.jpg"
                  alt="Snellman Sotheby's office"
                  fill
                  sizes="100vw"
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>    
    </div>
  );
}