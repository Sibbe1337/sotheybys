'use client';

import { useState } from 'react';

interface ContactFormProps {
  translations: {
    heroTitle: string;
    privacyLabel: string;
    privacyLink: string;
    recaptchaText: string;
    submitBtn: string;
    // Language-specific placeholders
    namePlaceholder?: string;
    emailPlaceholder?: string;
    phonePlaceholder?: string;
    messagePlaceholder?: string;
  };
}

export default function ContactForm({ translations: t }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    privacy: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.name.split(' ')[0] || formData.name,
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.phone,
          subject: 'Kontaktformulär / Contact form',
          message: formData.message,
          language: 'fi',
        }),
      });
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '', privacy: false });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error();
      }
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-8 shadow-lg">
      <h1 className="text-2xl font-light text-gray-900 mb-6 text-center">
        {t.heroTitle}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder={t.namePlaceholder || 'Nimi'}
          className="w-full px-4 py-3 border border-gray-300 focus:border-[#002349] focus:outline-none text-sm"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input
          type="email"
          placeholder={t.emailPlaceholder || 'Sähköposti'}
          className="w-full px-4 py-3 border border-gray-300 focus:border-[#002349] focus:outline-none text-sm"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input
          type="tel"
          placeholder={t.phonePlaceholder || 'Puhelin'}
          className="w-full px-4 py-3 border border-gray-300 focus:border-[#002349] focus:outline-none text-sm"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
        <textarea
          placeholder={t.messagePlaceholder || 'Viesti'}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 focus:border-[#002349] focus:outline-none text-sm resize-none"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
        />
        
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="privacy"
            className="mt-1"
            checked={formData.privacy}
            onChange={(e) => setFormData({...formData, privacy: e.target.checked})}
          />
          <label htmlFor="privacy" className="text-xs text-gray-600">
            {t.privacyLabel} <a href="#" className="text-[#002349] underline">{t.privacyLink}</a>
          </label>
        </div>
        
        <p className="text-[10px] text-gray-500 leading-tight">
          {t.recaptchaText}
        </p>
        
        {submitStatus === 'success' && (
          <div className="p-3 bg-green-50 text-green-800 text-sm text-center">
            Kiitos yhteydenotostasi! / Tack för din kontakt! / Thank you!
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="p-3 bg-red-50 text-red-800 text-sm text-center">
            Virhe! Yritä uudelleen. / Fel! Försök igen. / Error! Try again.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !formData.privacy}
          className="w-full bg-[#002349] text-white py-3 hover:bg-[#001731] transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
        >
          {isSubmitting ? '...' : t.submitBtn}
        </button>
      </form>
    </div>
  );
}

