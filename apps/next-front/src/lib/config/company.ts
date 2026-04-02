/**
 * Centralized company contact info, social media, and branding.
 * Single source of truth — import this instead of hardcoding values.
 */

export const company = {
  name: 'Snellman Sotheby\'s International Realty',
  businessId: '2644749-2',

  contact: {
    email: 'info@sothebysrealty.fi',
    phone: '+358 (0)10 315 6900',
    phoneTel: 'tel:+358101356900',
  },

  address: {
    fi: { street: 'Kasarmikatu 34,', city: '00130 Helsinki' },
    sv: { street: 'Kaserngatan 34,', city: '00130 Helsingfors' },
    en: { street: 'Kasarmikatu 34,', city: '00130 Helsinki' },
  },

  social: {
    facebook: 'https://www.facebook.com/Snellmansothebysrealty/',
    instagram: 'https://www.instagram.com/sothebysrealtyfinland/',
    linkedin: 'https://www.linkedin.com/company/snellman-sothebys-international-realty',
    youtube: 'https://www.youtube.com/@SnellmanSothebysIntRealty',
    pinterest: 'https://www.pinterest.com/snellmansir/',
  },

  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.9571707835125!2d24.94553971610621!3d60.164887881959004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bc8de21e969%3A0xb98ee1b9d2531ab!2sSnellman+Sotheby\'s+International+Realty!5e0!3m2!1sen!2sfi!4v1549539258229',
  mapsLink: 'https://goo.gl/maps/LjvLpXQFdT82',

  website: 'https://sothebysrealty.fi',
} as const;
