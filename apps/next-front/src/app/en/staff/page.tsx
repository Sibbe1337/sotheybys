import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

// Actual staff data from Sotheby's website
const staffMembers = [
  {
    id: '1',
    name: 'Robert Charpentier',
    title: 'Chairman, M.Sc., LKV',
    email: 'robert@sothebysrealty.fi',
    phone: '+358 (0)400 243 011',
    image: '/images/staff/robert-charpentier.jpg',
    description: '',
    flags: ['fi', 'se', 'gb', 'de']
  },
  {
    id: '2',
    name: 'Niclas Sergelius',
    title: 'Partner, LKV',
    email: 'niclas@sothebysrealty.fi',
    phone: '+358 (0)40 569 1369',
    image: '/images/staff/niclas-sergelius.jpg',
    description: '',
    flags: ['fi', 'se', 'gb', 'de']
  },
  {
    id: '3',
    name: 'Heidi Metsänen',
    title: 'Global Sales Coordinator, M.Sc., LKV',
    email: 'heidi@sothebysrealty.fi',
    phone: '+358 (0)50 421 0905',
    image: '/images/staff/heidi-metsanen.jpg',
    description: '',
    flags: ['fi', 'se', 'gb', 'fr']
  },
  {
    id: '4',
    name: 'Soile Goodall',
    title: 'Senior Broker, LKV',
    email: 'soile@sothebysrealty.fi',
    phone: '+358 (0)40 533 5333',
    image: '/images/staff/soile-goodall.jpg',
    description: '',
    flags: ['fi', 'gb']
  },
  {
    id: '5',
    name: 'Tea Käyhkö',
    title: 'Senior Broker, BA, MA, LKV',
    email: 'tea@sothebysrealty.fi',
    phone: '+358 (0)50 370 1893',
    image: '/images/staff/tea-kayhko.jpg',
    description: '',
    flags: ['fi', 'se', 'gb']
  },
  {
    id: '6',
    name: 'Kadri-Ann Õunap',
    title: 'Sales Associate, Notary, KED, KIAT',
    email: 'kadri-ann@sothebysrealty.fi',
    phone: '+358 (0)40 154 7844',
    image: '/images/staff/kadri-ann-ounap.jpg',
    description: '',
    flags: ['fi', 'se', 'gb', 'ee', 'ru']
  },
  {
    id: '7',
    name: 'Ali Ahola',
    title: 'Senior Broker, LKV',
    email: 'ali@sothebysrealty.fi',
    phone: '+358 (0)40 523 5251',
    image: '/images/staff/ali-ahola.jpg',
    description: '',
    flags: ['fi']
  },
  {
    id: '8',
    name: 'Petteri Huovila',
    title: 'Senior Advisor, LKV',
    email: 'petteri@sothebysrealty.fi',
    phone: '+358 (0)400 889 138',
    image: '/images/staff/petteri-huovila.jpg',
    description: '',
    flags: ['fi', 'se']
  },
  {
    id: '9',
    name: 'Sima Shaygan',
    title: 'Sales Associate, B.Sc, KiLaT',
    email: 'sima@sothebysrealty.fi',
    phone: '+358 (0)44 235 3979',
    image: '/images/staff/sima-shaygan.jpg',
    description: '',
    flags: ['fi', 'gb', 'ir', 'tr']
  },
  {
    id: '10',
    name: 'Dennis Forsman',
    title: 'Sales Assistant, B.Sc.',
    email: 'dennis@sothebysrealty.fi',
    phone: '+358 (0)44 999 4407',
    image: '/images/staff/dennis-forsman.jpg',
    description: '',
    flags: ['fi', 'se', 'gb']
  },
  {
    id: '11',
    name: 'Johan Schröder',
    title: 'Graphic Designer',
    email: 'johan@sothebysrealty.fi',
    phone: '+358 (0)50 536 9106',
    image: '/images/staff/johan-schroder.jpg',
    description: '',
    flags: ['fi', 'se', 'gb']
  }
];

// Language flag components
const LanguageFlags = ({ flags }: { flags: string[] }) => {
  const flagEmojis: Record<string, string> = {
    fi: '🇫🇮',
    se: '🇸🇪',
    gb: '🇬🇧',
    de: '🇩🇪',
    fr: '🇫🇷',
    ru: '🇷🇺',
    ee: '🇪🇪',
    ir: '🇮🇷',
    tr: '🇹🇷'
  };

  return (
    <div className="flex gap-1 justify-center">
      {flags.map((flag) => (
        <span key={flag} className="text-sm opacity-60" title={flag.toUpperCase()}>
          {flagEmojis[flag] || flag}
        </span>
      ))}
    </div>
  );
};

export default function StaffPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section with Background */}
        <section 
          className="relative h-[500px] flex items-center justify-center text-white"
          style={{
            backgroundImage: 'url("/images/international/henkilosto_34.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-[#1a3352]/60"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-thin mb-8">
              Staff
            </h1>
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
                         text-gray-600 hover:text-[#1a3352] hover:border-[#1a3352] transition-colors"
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
                         text-gray-600 hover:text-[#1a3352] hover:border-[#1a3352] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="mailto:info@sothebysrealty.fi"
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center
                         text-gray-600 hover:text-[#1a3352] hover:border-[#1a3352] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-6">
                Our experienced and professional staff will be happy<br />
                to provide you with more information.
              </h2>
              <p className="text-gray-600 font-light">
                Welcome to meet us, we're happy to hear how we can serve you.
              </p>
            </div>
          </div>
        </section>

        {/* Staff Grid */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {staffMembers.map((member) => (
                  <div key={member.id} className="text-center">
                    {/* Photo */}
                    <div className="relative mb-4 mx-auto" style={{ width: '200px', height: '280px' }}>
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="200px"
                        className="object-cover grayscale"
                      />
                    </div>
                    
                    {/* Info */}
                    <h3 className="text-xl font-normal text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {member.title}
                    </p>
                    
                    {/* Contact */}
                    <div className="space-y-1 mb-3">
                      <a 
                        href={`tel:${member.phone.replace(/\s/g, '')}`} 
                        className="block text-sm text-gray-700 hover:text-[#002349] transition-colors"
                      >
                        {member.phone}
                      </a>
                      <a 
                        href={`mailto:${member.email}`} 
                        className="block text-sm text-gray-700 hover:text-[#002349] transition-colors"
                      >
                        {member.email}
                      </a>
                    </div>
                    
                    {/* Language Flags */}
                    <LanguageFlags flags={member.flags} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Contact Form Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-light text-gray-900 mb-4">
                If you have any questions, you can always contact us<br />
                by calling, sending an email, or visiting<br />
                our office!
              </h2>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8 text-gray-700 font-light">
                <div>
                  <p className="text-lg">+358 (0)10 315 6900</p>
                </div>
                <div className="hidden md:block text-gray-400">|</div>
                <div>
                  <p className="text-lg">Kasarmikatu 34,</p>
                  <p className="text-lg">00130 Helsinki</p>
                </div>
                <div className="hidden md:block text-gray-400">|</div>
                <div>
                  <p className="text-lg">info@sothebysrealty.fi</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto bg-gray-400 p-8 md:p-12">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light"
                  />
                </div>
                
                <div>
                  <textarea
                    placeholder="Message"
                    rows={6}
                    className="w-full px-4 py-3 border-0 bg-white placeholder-gray-500 font-light resize-none"
                    required
                  />
                </div>
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy-staff-en"
                    name="privacy"
                    required
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="privacy-staff-en" className="text-sm font-light text-gray-700">
                    I have read and accept the <a href="#" className="text-[#1a3352] underline">Privacy Policy</a>
                  </label>
                </div>
                
                <div className="text-center">
                  <p className="text-xs font-light text-gray-600 mb-4">
                    This site is protected by reCAPTCHA and the Google{' '}
                    <a href="#" className="text-[#1a3352] underline">Privacy Policy</a> and{' '}
                    <a href="#" className="text-[#1a3352] underline">Terms of Service</a> apply.
                  </p>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#1a3352] text-white hover:bg-[#0f2633] transition-colors font-light uppercase tracking-wider"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Office Location Section */}
        <section className="py-0">
          <div className="grid md:grid-cols-2">
            {/* Left Column - Office Info */}
            <div className="bg-[#5a7a94] p-12 md:p-16 text-white">
              <h3 className="text-3xl font-light mb-6">Our Helsinki Office</h3>
              <div className="space-y-4 text-gray-100 font-light">
                <p>
                  In our office located in the heart of Helsinki, you&apos;ll meet a team of motivated and knowledgeable agents whose goal is to make your dreams come true.
                </p>
                <p>
                  Our office is surrounded by the dynamic Kaartinkaupunki district with its fashion boutiques, fine dining restaurants, and high-quality hotels.
                </p>
                <p>
                  You can walk to our office in just a few minutes from the Esplanade or Senate Square.
                </p>
                <a 
                  href="https://goo.gl/maps/LjvLpXQFdT82" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-white border border-white px-6 py-2 hover:bg-white hover:text-[#5a7a94] transition-all"
                >
                  Get Directions →
                </a>
              </div>
            </div>
            
            {/* Right Column - Map */}
            <div className="h-full min-h-[450px]">
              <iframe 
                loading="lazy" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.9571707835125!2d24.94553971610621!3d60.164887881959004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bc8de21e969%3A0xb98ee1b9d2531ab!2sSnellman+Sotheby's+International+Realty!5e0!3m2!1sen!2sfi!4v1549539258229" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0, minHeight: '450px' }} 
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}