/**
 * Image configuration and mappings
 * Maps old WordPress URLs to local assets or CDN URLs
 */

export const imageConfig = {
  // Default fallback images
  defaults: {
    noImage: '/images/defaults/noimage.jpg',
    noImageSmall: '/images/defaults/noimage-150x150.jpg',
    propertyPlaceholder: '/images/defaults/property-placeholder.svg',
    avatarPlaceholder: '/images/defaults/no-avatar.gif'
  },

  // Logo variations
  logos: {
    main: '/sothebys-logo-white.svg',
    mainDark: '/logo.png',
    mainHD: '/images/logos/logo-main-dummy-hd.png',
    small: '/images/logos/logo-small-dummy.png'
  },

  // Icons
  icons: {
    arrowLeft: '/images/icons/a-l.svg',
    arrowRight: '/images/icons/a-r.svg',
    search: '/images/icons/search-icon.svg',
    zoom: '/images/icons/zoom-icon.svg'
  },

  // Map old WordPress URLs to new locations
  urlMappings: {
    'https://sothebysrealty.fi/wp-content/uploads/2019/01/400.png': '/images/defaults/property-placeholder.svg',
    'https://sothebysrealty.fi/wp-content/uploads/2019/02/snellman-sothebys-yritys.jpg': '/images/content/snellman-sothebys-yritys.jpg',
    'https://sothebysrealty.fi/wp-content/uploads/2022/01/snellman-sothebys-nakoalapaikka-kansainvaliseen-kiinteistonvalitykseen-ratakatu.png': '/images/content/snellman-sothebys-nakoalapaikka.jpg',
    'https://sothebysrealty.fi/wp-content/uploads/2019/02/snellman-sothebys-kutsu-arviokaynnille.jpg': '/images/content/snellman-sothebys-kutsu-arviokaynnille.jpg',
    'https://sothebysrealty.fi/wp-content/uploads/2019/01/snellman-sothebys-toimisto.jpg': '/images/content/snellman-sothebys-toimisto.jpg',
    'https://sothebysrealty.fi/wp-content/uploads/2019/01/sothebys-international-realty-verkosto.jpg': '/images/content/sothebys-international-realty-verkosto.jpg',
    'https://sothebysrealty.fi/wp-content/uploads/2019/01/sothebys-maailmankartta.jpg': '/images/content/sothebys-maailmankartta.jpg',
    'https://sothebysrealty.fi/wp-content/uploads/2019/02/snellman-sothebys-newsletter.jpg': '/images/content/snellman-sothebys-newsletter.jpg'
  }
};

/**
 * Helper function to get the correct image URL
 * Checks if the URL should be mapped to a local asset
 */
export function getImageUrl(originalUrl: string): string {
  // Check if we have a mapping for this URL
  if (imageConfig.urlMappings[originalUrl as keyof typeof imageConfig.urlMappings]) {
    return imageConfig.urlMappings[originalUrl as keyof typeof imageConfig.urlMappings];
  }
  
  // Return original URL if no mapping exists
  return originalUrl;
}

/**
 * Get placeholder image based on type
 */
export function getPlaceholderImage(type: 'property' | 'avatar' | 'general' = 'general'): string {
  switch (type) {
    case 'property':
      return imageConfig.defaults.propertyPlaceholder;
    case 'avatar':
      return imageConfig.defaults.avatarPlaceholder;
    default:
      return imageConfig.defaults.noImage;
  }
}
