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
    flags: ['fi', 'se', 'gb', 'fr', 'de']
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
    flags: ['fi', 'se', 'gb', 'ru', 'fr']
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
    name: 'Tea Kåyhkö',
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
    flags: ['fi']
  },
  {
    id: '9',
    name: 'Sima Shaygan',
    title: 'Sales Associate, B.Sc, KiLaT',
    email: 'sima@sothebysrealty.fi',
    phone: '+358 (0)44 235 3979',
    image: '/images/staff/sima-shaygan.jpg',
    description: '',
    flags: ['fi', 'gb', 'ir']
  },
  {
    id: '10',
    name: 'Dennis Forsman',
    title: 'Sales Assistant',
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
    ir: '🇮🇷'
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
        {/* Hero Section */}
        <section className="relative bg-gray-50 py-16 text-center">
          <div className="container mx-auto px-4">
            <p className="text-gray-600 text-sm mb-2">
              Tervetuloa tapaamaan meitä, kuulemme mielellämme miten voimme palvella juuri sinua.
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900">
              Henkilökuntamme
            </h1>
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

        {/* Contact Section */}
        <section className="py-16 bg-[#1a3a4a] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h2 className="text-3xl font-light mb-6">Tilaa Uutiskirjeemme</h2>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nimi"
                      className="w-full px-4 py-3 bg-transparent border-b border-white/30 text-white placeholder-white/60 focus:border-white focus:outline-none transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Sähköposti"
                      className="w-full px-4 py-3 bg-transparent border-b border-white/30 text-white placeholder-white/60 focus:border-white focus:outline-none transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Puhelin"
                      className="w-full px-4 py-3 bg-transparent border-b border-white/30 text-white placeholder-white/60 focus:border-white focus:outline-none transition-colors"
                    />
                    <div className="flex items-start gap-3 mt-6">
                      <input
                        type="checkbox"
                        id="privacy"
                        className="mt-1"
                      />
                      <label htmlFor="privacy" className="text-sm text-white/80">
                        Olen tutustunut tietosuojaselosteeseen
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="mt-6 px-8 py-3 bg-white text-[#1a3a4a] hover:bg-gray-100 transition-colors font-light tracking-wider uppercase text-sm"
                    >
                      Tilaa
                    </button>
                  </form>
                </div>

                {/* Office Info */}
                <div>
                  <h3 className="text-3xl font-light mb-6">Helsinki</h3>
                  <div className="space-y-3 text-white/80">
                    <p className="flex items-start gap-3">
                      <span className="shrink-0">📍</span>
                      <span>
                        Kasarmikatu 34,<br />
                        00130 Helsinki
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span>📞</span>
                      <a href="tel:+358103156900" className="hover:text-white transition-colors">
                        +358 (0)10 315 6900
                      </a>
                    </p>
                    <p className="flex items-center gap-3">
                      <span>✉️</span>
                      <a href="mailto:info@sothebysrealty.fi" className="hover:text-white transition-colors">
                        info@sothebysrealty.fi
                      </a>
                    </p>
                    <p className="flex items-center gap-3">
                      <span>🏢</span>
                      <span>Y-tunnus: 2644749-2</span>
                    </p>
                  </div>

                  {/* Team Photo */}
                  <div className="mt-8">
                    <div className="relative h-96 rounded-lg overflow-hidden">
                      <Image
                        src="/images/staff/team-photo.jpg"
                        alt="Snellman Sotheby's International Realty Team"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
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