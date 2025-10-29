import { Link } from '@/lib/navigation';
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
              Sälj med oss
            </h1>
            <p className="text-lg md:text-xl font-light leading-relaxed mb-12 max-w-3xl mx-auto">
              Vi vill skapa en hållbar kundrelation där vi tar hänsyn till dina minsta behov och önskemål. 
              Vi diskuterar öppet och lyssnar noga, för vår uppgift är att förverkliga dina drömmar.
            </p>
            <Link 
              href="/sv/kontakta-oss"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 
                       hover:bg-white hover:text-[var(--color-primary)] transition-all duration-300 
                       font-light uppercase tracking-wider text-sm"
            >
              GÖR DITT LIVS BOSTADSAFFÄR &gt;
            </Link>
          </div>
        </section>

        {/* Attention Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
                Få det inte bara på marknaden. Ge det uppmärksamheten det förtjänar.
              </h2>
              <p className="text-lg text-gray-700 font-light leading-relaxed mb-8">
                För dem som kräver en förhöjd service som ingen annan, finns Sotheby's International Realty. 
                Vi är branschens bästa mäklare och vår omsorg om stil och detaljer är oöverträffad. 
                Vi finns här för att hjälpa dig sälja ditt hem i en skala du helt enkelt inte hittar någon annanstans.
              </p>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
                Välkommen till en lyckad bostadsaffär!
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-gray-700">
                <a href="tel:+358103156900" className="hover:text-[var(--color-primary)] transition-colors font-light">
                  +358 (0)10 315 6900
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a href="https://goo.gl/maps/8HptT8TwUp42" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-[var(--color-primary)] transition-colors font-light">
                  Kasarmikatu 34,<br className="md:hidden" />
                  00130 Helsingfors
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
                  Boka ett gratis värderingsbesök!
                </h2>
                <p className="text-gray-700 font-light mb-2">
                  Känner du till din bostads marknadsvärde?
                </p>
                <p className="text-gray-700 font-light mb-8">
                  Bjud in oss på ett gratis värderingsbesök – du får områdets mest sakkunniga utlåtande.
                </p>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Förnamn"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Efternamn"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="E-post"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Telefonnummer"
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light"
                      required
                    />
                  </div>
                  
                  <textarea
                    placeholder="Meddelande"
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light resize-none"
                  />
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacy-sv"
                      required
                      className="mt-1"
                    />
                    <label htmlFor="privacy-sv" className="text-sm text-gray-700 font-light">
                      Jag har läst{' '}
                      <Link href="/sv/integritetspolicy" className="text-[var(--color-primary)] hover:underline">
                        integritetspolicyn
                      </Link>
                    </label>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="newsletter-sv"
                      className="mt-1"
                    />
                    <label htmlFor="newsletter-sv" className="text-sm text-gray-700 font-light">
                      Jag vill få Snellman Sotheby's nyhetsbrev
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[var(--color-primary)] text-white px-6 py-3 hover:bg-[var(--color-primary-dark)] 
                             transition-colors duration-300 font-light"
                  >
                    Skicka
                  </button>
                </form>
              </div>

              {/* Mission Section */}
              <div className="bg-white p-8 lg:p-12">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
                  Hedersuppdrag
                </h2>
                <div className="space-y-4 text-gray-700 font-light leading-relaxed text-sm">
                  <p>
                    Snellman | Sotheby's International Realty Finland fungerar som en del av en av världens största och mest framgångsrika 
                    fastighetsförmedlingskedjor Sotheby's International Realty®, så vi erbjuder dig ett omfattande kontaktnätverk 
                    med experter. Våra försäljningskanaler täcker ett effektivt globalt marknadsföringsnätverk.
                  </p>
                  <p>
                    Vi är specialiserade på värdebostäder. Varje uppdrag får som vårt försäljningsobjekt en ställning som garanterar det en speciell, 
                    högre kvalitetsservice än vanligt.
                  </p>
                  <p>
                    Vi erbjuder dig omfattande expertis på både inhemska och internationella marknader. Vi representerar branschens bästa 
                    kunnande och hanterar hela försäljningsprocessen från början till slut med hjärtat. Vi garanterar att du genom oss har 
                    tillgång till branschens mest moderna och effektiva marknadsföringskanaler samt ett omfattande kundnätverk. 
                    På så sätt uppnår vi högsta möjliga försäljningspris för din bostad.
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
                Ett värdefullt förhållande
              </h2>
              <div className="space-y-6 text-gray-700 font-light leading-relaxed text-base">
                <p>
                  Vår önskan är att samarbetet med oss alltid innebär en långsiktig relation på personlig nivå. 
                  Vi betraktar var och en av våra kunder som unika och värdefulla, med hänsyn till alla aspekter. 
                  Vi har alla olika behov och preferenser, och vi diskuterar och anpassar enligt våra kunders önskemål och krav. 
                  Vårt uppdrag är att förverkliga din dröm.
                </p>
                <p>
                  Snellman Sotheby's International Realty Finland är en del av en av världens mest prestigefyllda 
                  fastighetskedjor. Medlemskap i Sotheby's International Realty® innebär medlemskap i ett globalt nätverk 
                  med omfattande expertis, vitala kontakter, extraordinära försäljningskanaler samt tillgång till de mest 
                  effektiva marknadsföringskanalerna som finns.
                </p>
                <p>
                  Vi är specialiserade på lyxfastigheter och premium-bostäder och erbjuder dig de mest eftertraktade hemmen 
                  på marknaden. Våra erfarna teammedlemmar är alltid hedrade att dela med sig av sin expertis till dig, 
                  och vi vill vara en del av processen från början till slut. Vi garanterar att du får tillgång till de 
                  senaste marknadsföringskanalerna, rätt kundnätverk, högsta möjliga pris och naturligtvis en upplevelse 
                  du kommer att minnas med glädje.
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
                Vårt servicelöfte
              </h2>
              <div className="space-y-6 text-gray-700 font-light leading-relaxed text-base">
                <p>
                  Vi vill stödja dig när du är på väg att fatta ett av ditt livs viktigaste ekonomiska beslut 
                  och se till att du gör rätt val. Vi garanterar att du får våra erfarna experters åsikter 
                  och stöd genom hela processen. Vår högsta önskan är att alla våra kunder känner sig bekväma 
                  med oss och att samarbete i framtiden blir ett naturligt beslut för var och en av våra kunder.
                </p>
                <p>
                  Glöm inte att be om en tjänsteoffert.
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
                Prislista
              </h2>
              
              <div className="bg-gray-50 p-8 md:p-12 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left pb-4 font-light text-lg">Mäklare / Försäljningsuppdrag</th>
                      <th className="text-right pb-4 font-light text-lg"></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Bostadsaktier</td>
                      <td className="py-3 text-right font-light">5 % inkl. moms 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Fastigheter</td>
                      <td className="py-3 text-right font-light">6 % inkl. moms 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Distans- och specialobjekt</td>
                      <td className="py-3 text-right font-light">7 % inkl. moms 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Uthyrningsuppdrag</td>
                      <td className="py-3 text-right font-light">2 mån hyra inkl. moms 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Minimiarvode</td>
                      <td className="py-3 text-right font-light">5750 € inkl. moms 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Internationell synlighet</td>
                      <td className="py-3 text-right font-light">+0,50 % inkl. moms 25,5%**</td>
                    </tr>
                  </tbody>
                </table>
                
                <table className="w-full mt-8">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left pb-4 font-light text-lg">Startavgift</th>
                      <th className="text-right pb-4 font-light text-lg"></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Bostadsaktier</td>
                      <td className="py-3 text-right font-light">Från 500 € inkl. moms 25,5%*</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-light">Fastigheter / Distans- och specialobjekt</td>
                      <td className="py-3 text-right font-light">Från 3000 € inkl. moms 25,5%*</td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="mt-8 text-sm text-gray-600 font-light">
                  <p>* Eller enligt överenskommelse</p>
                  <p>** I tillämpliga delar</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <VideoSection 
          videoId="hdXkBWw9wk0"
          title="Varför sälja med oss?"
          subtitle="Se hur vi hjälper våra kunder till en framgångsrik bostadsaffär"
        />

        {/* Consumer Dispute Section */}
        <section className="py-12 bg-[var(--color-primary)] text-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl font-light mb-4">
                Konsumenttvist
              </h2>
              <p className="font-light mb-2">
                En tvist som gäller avtalet kan föras till konsumenttvistenämnden för avgörande.
              </p>
              <p className="font-light">
                Mer information på:{' '}
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