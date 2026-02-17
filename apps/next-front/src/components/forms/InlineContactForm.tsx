'use client';

import { useState } from 'react';

interface InlineContactFormProps {
  language: 'fi' | 'sv' | 'en';
  translations: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    privacyText: string;
    privacyLink: string;
    newsletterText?: string;
    recaptchaText?: string;
    submitButton: string;
  };
  className?: string;
}

export function InlineContactForm({ language, translations: t, className = '' }: InlineContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          phone: data.get('phone'),
          subject: language === 'fi' ? 'Myyntitoimeksianto' : language === 'sv' ? 'Säljuppdrag' : 'Selling inquiry',
          message: data.get('message') || (language === 'fi' ? 'Yhteydenottopyyntö myyntisivulta' : language === 'sv' ? 'Kontaktförfrågan från säljsidan' : 'Contact request from selling page'),
          language,
        }),
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error();
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="firstName" placeholder={t.firstName} className="w-full px-4 py-3 bg-white border-0 focus:outline-none font-light text-center" required />
        <input type="text" name="lastName" placeholder={t.lastName} className="w-full px-4 py-3 bg-white border-0 focus:outline-none font-light text-center" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="email" name="email" placeholder={t.email} className="w-full px-4 py-3 bg-white border-0 focus:outline-none font-light text-center" required />
        <input type="tel" name="phone" placeholder={t.phone} className="w-full px-4 py-3 bg-white border-0 focus:outline-none font-light text-center" required />
      </div>
      <textarea name="message" placeholder={t.message} rows={5} className="w-full px-4 py-3 bg-white border-0 focus:outline-none font-light resize-none text-center" />
      <div className="flex items-start gap-3">
        <input type="checkbox" id="privacy-sell" required className="mt-1" />
        <label htmlFor="privacy-sell" className="text-sm text-gray-700 font-light">
          {t.privacyText}{' '}
          <a href="/tietosuojaseloste" className="text-[var(--color-primary)] hover:underline">{t.privacyLink}</a>
        </label>
      </div>
      {t.newsletterText && (
        <div className="flex items-start gap-3">
          <input type="checkbox" id="newsletter-sell" className="mt-1" />
          <label htmlFor="newsletter-sell" className="text-sm text-gray-700 font-light">{t.newsletterText}</label>
        </div>
      )}

      {status === 'success' && (
        <div className="p-3 bg-green-50 text-green-800 text-sm text-center">
          {language === 'fi' ? 'Kiitos yhteydenotostasi!' : language === 'sv' ? 'Tack för din kontakt!' : 'Thank you for contacting us!'}
        </div>
      )}
      {status === 'error' && (
        <div className="p-3 bg-red-50 text-red-800 text-sm text-center">
          {language === 'fi' ? 'Virhe! Yritä uudelleen.' : language === 'sv' ? 'Fel! Försök igen.' : 'Error! Try again.'}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[var(--color-primary)] text-white px-6 py-3 hover:bg-[var(--color-primary-dark)] transition-colors duration-300 font-light text-center disabled:opacity-50"
      >
        {isSubmitting ? '...' : t.submitButton}
      </button>
    </form>
  );
}
