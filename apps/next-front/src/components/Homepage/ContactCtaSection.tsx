'use client';

import type { SupportedLanguage } from '@/lib/homepage-translations';

interface Props {
  language: SupportedLanguage;
}

export default function ContactCtaSection({ language }: Props) {
  return (
    <section className="py-16 bg-[#d8d8d8]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left column - Text */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-6">
                {language === 'fi'
                  ? 'Kutsu meidät maksuttomalle arviokäynnille!'
                  : language === 'sv'
                  ? 'Bjud in oss för en kostnadsfri värdering!'
                  : 'Invite us for a free property valuation!'}
              </h2>
              <p className="text-base text-black font-light leading-relaxed mb-4">
                {language === 'fi'
                  ? 'Oletko ostamassa? Oletko myymässä? Etsitkö sijoituskohteita?'
                  : language === 'sv'
                  ? 'Funderar du på att köpa eller sälja? Söker du investeringsobjekt?'
                  : 'Are you buying? Are you selling? Looking for investment properties?'}
              </p>
              <p className="text-base text-black font-light leading-relaxed mb-4">
                {language === 'fi'
                  ? 'Kerro miten voimme auttaa ja otamme sinuun yhteyttä.'
                  : language === 'sv'
                  ? 'Berätta hur vi kan hjälpa så kontaktar vi dig.'
                  : 'Tell us how we can help and we will contact you.'}
              </p>
              <p className="text-base text-black font-light leading-relaxed mb-4">
                {language === 'fi'
                  ? 'Oletko kiinnostunut arvokkaista kodeista ja ainutlaatuisista kiinteistöistä?'
                  : language === 'sv'
                  ? 'Är du intresserad av exklusiva hem och värdefastigheter? Kontakta oss!'
                  : 'Interested in valuable homes and unique properties? Contact us!'}
              </p>
              <p className="text-base text-black font-light leading-relaxed">
                {language === 'fi'
                  ? 'Tilaa uutiskirjeemme, niin pysyt ajan tasalla asuntomarkkinoiden kehityksestä.'
                  : language === 'sv'
                  ? 'Beställ vårt nyhetsbrev så håller vi dig uppdaterad om bostadsmarknaden.'
                  : 'Subscribe to our newsletter to stay updated on the housing market.'}
              </p>
            </div>

            {/* Right column - Form */}
            <div className="bg-white p-6">
              <form className="space-y-3" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                btn.disabled = true;
                btn.textContent = '...';
                try {
                  const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      firstName: data.get('firstName'),
                      lastName: data.get('lastName'),
                      email: data.get('email'),
                      phone: data.get('phone'),
                      subject: language === 'fi' ? 'Yhteydenottolomake' : language === 'sv' ? 'Kontaktformulär' : 'Contact form',
                      message: data.get('message'),
                      language,
                    }),
                  });
                  if (res.ok) {
                    form.reset();
                    btn.textContent = language === 'fi' ? 'Kiitos!' : language === 'sv' ? 'Tack!' : 'Thank you!';
                    setTimeout(() => { btn.textContent = language === 'fi' ? 'Lähetä' : language === 'sv' ? 'Skicka' : 'Send'; btn.disabled = false; }, 3000);
                  } else { throw new Error(); }
                } catch { btn.textContent = language === 'fi' ? 'Virhe!' : language === 'sv' ? 'Fel!' : 'Error!'; btn.disabled = false; }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" name="firstName" placeholder={language === 'fi' ? 'Etunimi' : language === 'sv' ? 'Förnamn' : 'First name'} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#002349] text-center bg-white placeholder-gray-400" required />
                  <input type="text" name="lastName" placeholder={language === 'fi' ? 'Sukunimi' : language === 'sv' ? 'Efternamn' : 'Surname'} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#002349] text-center bg-white placeholder-gray-400" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="email" name="email" placeholder={language === 'fi' ? 'Sähköposti' : language === 'sv' ? 'Email' : 'Email'} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#002349] text-center bg-white placeholder-gray-400" required />
                  <input type="tel" name="phone" placeholder={language === 'fi' ? 'Puhelinnumero' : language === 'sv' ? 'Telefonnummer' : 'Phone number'} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#002349] text-center bg-white placeholder-gray-400" required />
                </div>
                <textarea name="message" placeholder={language === 'fi' ? 'Viesti' : language === 'sv' ? 'Meddelande' : 'Message'} rows={5} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#002349] text-center bg-white placeholder-gray-400" required />
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="privacy-contact" required className="mt-1" />
                  <label htmlFor="privacy-contact" className="text-xs text-gray-700">
                    {language === 'fi'
                      ? <>Olen tutustunut <a href="http://sothebysrealty.fi/tietosuojaseloste/" target="_blank" rel="noopener noreferrer" className="underline">Tietosuojaselosteeseen</a></>
                      : language === 'sv'
                      ? <>Jag har läst <a href="http://sothebysrealty.fi/sv/tietosuojaseloste/" target="_blank" rel="noopener noreferrer" className="underline">Integritetspolicyn</a></>
                      : <>I have read the <a href="http://sothebysrealty.fi/en/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a></>}
                  </label>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="newsletter-contact" className="mt-1" />
                  <label htmlFor="newsletter-contact" className="text-xs text-gray-700">
                    {language === 'fi'
                      ? "Haluan vastaanottaa Snellman Sotheby's uutiskirjeen"
                      : language === 'sv'
                      ? "Jag vill ta emot Snellman Sotheby's nyhetsbrev"
                      : "I want to receive Snellman Sotheby's newsletter"}
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  {language === 'fi'
                    ? <>Tämän sivun suojaa reCAPTCHA, mikä tarkoittaa, että Googlen <a href="https://policies.google.com/privacy?hl=fi" target="_blank" rel="noopener noreferrer" className="underline">tietosuojakäytännöt</a> ja <a href="https://policies.google.com/terms?hl=fi" target="_blank" rel="noopener noreferrer" className="underline">käyttöehdot</a> ovat voimassa.</>
                    : language === 'sv'
                    ? <>Denna sida skyddas av reCAPTCHA, vilket innebär att Googles <a href="https://policies.google.com/privacy?hl=sv" target="_blank" rel="noopener noreferrer" className="underline">sekretesspolicy</a> och <a href="https://policies.google.com/terms?hl=sv" target="_blank" rel="noopener noreferrer" className="underline">användarvillkor</a> gäller.</>
                    : <>This page is protected by reCAPTCHA, which means that Google&apos;s <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">privacy policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">terms of service</a> apply.</>}
                </p>
                <button type="submit" className="w-full bg-[#002349] text-white px-6 py-3 hover:bg-[#001731] transition-colors duration-300 font-light text-center uppercase tracking-wider text-sm">
                  {language === 'fi' ? 'Lähetä' : language === 'sv' ? 'Skicka' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
