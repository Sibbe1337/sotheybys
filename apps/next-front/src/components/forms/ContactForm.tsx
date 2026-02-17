'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ContactFormProps {
  language: 'fi' | 'sv' | 'en';
  showSubjectField?: boolean;
  defaultSubject?: string;
  className?: string;
}

const translations = {
  fi: {
    firstName: 'Etunimi',
    lastName: 'Sukunimi',
    email: 'Sähköposti',
    phone: 'Puhelin',
    subject: 'Aihe',
    message: 'Viesti',
    subjectOptions: {
      buying: 'Haluan ostaa',
      selling: 'Haluan myydä',
      renting: 'Haluan vuokrata',
      valuation: 'Arviointi',
      other: 'Muu asia'
    },
    privacyText: 'Olen lukenut tietosuojaselosteen ja hyväksyn tietojeni käsittelyn',
    privacyLink: 'Tietosuojaseloste',
    submit: 'Lähetä viesti',
    thankYou: 'Kiitos yhteydenotostasi!',
    errorMessage: 'Lomakkeen lähetys epäonnistui. Yritä uudelleen.',
    emailSubject: 'Yhteydenotto: '
  },
  sv: {
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    email: 'E-post',
    phone: 'Telefon',
    subject: 'Ämne',
    message: 'Meddelande',
    subjectOptions: {
      buying: 'Jag vill köpa',
      selling: 'Jag vill sälja',
      renting: 'Jag vill hyra',
      valuation: 'Värdering',
      other: 'Annat ärende'
    },
    privacyText: 'Jag har läst dataskyddsbeskrivningen och godkänner behandlingen av mina uppgifter',
    privacyLink: 'Dataskyddsbeskrivning',
    submit: 'Skicka meddelande',
    thankYou: 'Tack för din kontakt!',
    errorMessage: 'Formuläret kunde inte skickas. Försök igen.',
    emailSubject: 'Kontakt: '
  },
  en: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    subject: 'Subject',
    message: 'Message',
    subjectOptions: {
      buying: 'I want to buy',
      selling: 'I want to sell',
      renting: 'I want to rent',
      valuation: 'Valuation',
      other: 'Other inquiry'
    },
    privacyText: 'I have read the privacy policy and accept the processing of my data',
    privacyLink: 'Privacy Policy',
    submit: 'Send Message',
    thankYou: 'Thank you for contacting us!',
    errorMessage: 'Failed to submit form. Please try again.',
    emailSubject: 'Contact Inquiry: '
  }
};

export const ContactForm: React.FC<ContactFormProps> = ({
  language = 'fi',
  showSubjectField = true,
  defaultSubject = '',
  className = ''
}) => {
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: defaultSubject,
    message: '',
    privacy: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare email subject with language-specific prefix
      const subjectText = formData.subject 
        ? t.subjectOptions[formData.subject as keyof typeof t.subjectOptions] || formData.subject
        : t.subjectOptions.other;
      
      const emailSubject = `${t.emailSubject}${subjectText}`;
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          subject: subjectText,
          message: formData.message,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send');
      }
      
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: defaultSubject,
        message: '',
        privacy: false
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-light text-gray-700 mb-2">
            {t.firstName} *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-light text-gray-700 mb-2">
            {t.lastName} *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
          {t.email} *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                   focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-light text-gray-700 mb-2">
          {t.phone}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                   focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      {showSubjectField && (
        <div>
          <label htmlFor="subject" className="block text-sm font-light text-gray-700 mb-2">
            {t.subject}
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:outline-none focus:border-[var(--color-primary)]"
          >
            <option value="">{t.subjectOptions.other}</option>
            <option value="buying">{t.subjectOptions.buying}</option>
            <option value="selling">{t.subjectOptions.selling}</option>
            <option value="renting">{t.subjectOptions.renting}</option>
            <option value="valuation">{t.subjectOptions.valuation}</option>
            <option value="other">{t.subjectOptions.other}</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-light text-gray-700 mb-2">
          {t.message} *
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                   focus:outline-none focus:border-[var(--color-primary)] resize-none"
        />
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="privacy"
          name="privacy"
          checked={formData.privacy}
          onChange={handleChange}
          required
          className="mt-1 mr-3"
        />
        <label htmlFor="privacy" className="text-sm font-light text-gray-700">
          {t.privacyText}{' '}
          <a href="/tietosuojaseloste" className="underline hover:no-underline">
            {t.privacyLink}
          </a> *
        </label>
      </div>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg">
          {t.thankYou}
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">
          {t.errorMessage}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || !formData.privacy}
        className="w-full md:w-auto"
      >
        {isSubmitting ? '...' : t.submit}
      </Button>
    </form>
  );
};
