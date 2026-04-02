'use client';

import Image from 'next/image';
import { getHomepageTranslation, type SupportedLanguage } from '@/lib/homepage-translations';

interface Props {
  language: SupportedLanguage;
}

export default function NewsletterSection({ language }: Props) {
  return (
    <section id="newsletter" className="py-16 relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/content/snellman-sothebys-newsletter.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#002349]/80"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-light text-white mb-4">
              {getHomepageTranslation('subscribeNewsletter', language)}
            </h2>
            <p className="text-lg text-white/80 font-light">
              {language === 'fi'
                ? 'Oletko kiinnostunut arvokodeista ja uniikeista kiinteistöistä? Tilaa uutiskirjeemme, niin pysyt ajan tasalla.'
                : language === 'sv'
                ? 'Är du intresserad av värdefulla hem och unika fastigheter? Prenumerera på vårt nyhetsbrev så håller du dig uppdaterad.'
                : 'Interested in valuable homes and unique properties? Subscribe to our newsletter to stay updated.'}
            </p>
          </div>
          <form className="space-y-4 bg-white/10 backdrop-blur-sm p-8" onSubmit={async (e) => {
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
                  firstName: data.get('nl_firstName'),
                  lastName: data.get('nl_lastName'),
                  email: data.get('nl_email'),
                  phone: '',
                  subject: language === 'fi' ? 'Uutiskirjeen tilaus' : language === 'sv' ? 'Nyhetsbrevsprenumeration' : 'Newsletter subscription',
                  message: language === 'fi' ? 'Haluan tilata uutiskirjeen' : language === 'sv' ? 'Jag vill prenumerera på nyhetsbrevet' : 'I want to subscribe to the newsletter',
                  language,
                }),
              });
              if (res.ok) {
                form.reset();
                btn.textContent = language === 'fi' ? 'Kiitos!' : language === 'sv' ? 'Tack!' : 'Thank you!';
                setTimeout(() => { btn.textContent = getHomepageTranslation('subscribe', language); btn.disabled = false; }, 3000);
              } else { throw new Error(); }
            } catch { btn.textContent = language === 'fi' ? 'Virhe!' : language === 'sv' ? 'Fel!' : 'Error!'; btn.disabled = false; }
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="nl_firstName" placeholder={getHomepageTranslation('firstName', language)} className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light" required />
              <input type="text" name="nl_lastName" placeholder={getHomepageTranslation('lastName', language)} className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light" required />
            </div>
            <input type="email" name="nl_email" placeholder={getHomepageTranslation('email', language)} className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-[var(--color-primary)] font-light" required />
            <div className="flex items-start gap-3">
              <input type="checkbox" id="privacy-newsletter" required className="mt-1" />
              <label htmlFor="privacy-newsletter" className="text-sm text-white font-light">
                {getHomepageTranslation('privacyConsent', language)}{' '}
                <a href="/tietosuojaseloste" className="text-white underline hover:text-white/80">
                  {getHomepageTranslation('privacyPolicy', language)}
                </a>
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="newsletter-consent" className="mt-1" />
              <label htmlFor="newsletter-consent" className="text-sm text-white font-light">
                {language === 'fi'
                  ? "Haluan vastaanottaa Snellman Sotheby's uutiskirjeen"
                  : language === 'sv'
                  ? "Jag vill ta emot Snellman Sotheby's nyhetsbrev"
                  : "I want to receive Snellman Sotheby's newsletter"}
              </label>
            </div>
            <button type="submit" className="w-full bg-[var(--color-primary)] text-white px-6 py-3 hover:bg-[var(--color-primary-dark)] transition-colors duration-300 font-light uppercase tracking-wider text-sm">
              {getHomepageTranslation('subscribe', language)}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
