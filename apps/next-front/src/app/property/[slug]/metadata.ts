import { Metadata } from 'next';

/**
 * Generate dynamic metadata for property pages
 * This improves SEO by providing unique titles, descriptions, and Open Graph data
 */
export async function generatePropertyMetadata(
  slug: string,
  lang: string = 'fi'
): Promise<Metadata> {
  try {
    // Fetch property data from our API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sothebysrealty.fi';
    const response = await fetch(`${baseUrl}/api/property/${slug}?lang=${lang}`, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });

    if (!response.ok) {
      // Return default metadata if property not found
      return {
        title: 'Property Not Found - Snellman Sotheby\'s International Realty',
        description: 'The requested property could not be found.',
      };
    }

    const result = await response.json();
    const property = result.data;

    if (!property) {
      return {
        title: 'Property Not Found - Snellman Sotheby\'s International Realty',
        description: 'The requested property could not be found.',
      };
    }

    // Extract key information
    const title = property.title || 'Property';
    const address = property.address || '';
    const city = property.city || '';
    const area = property.area || property.livingArea;
    const price = property.price;
    const rooms = property.rooms || '';
    
    // Create description (max 155 characters for SEO)
    let description = '';
    if (property.description) {
      // Strip HTML tags and truncate
      const plainText = property.description.replace(/<[^>]*>/g, '');
      description = plainText.substring(0, 155);
      if (plainText.length > 155) description += '...';
    } else {
      // Fallback description
      description = `${rooms || 'Property'} ${area ? `${area} m²` : ''} ${city ? `in ${city}` : ''}`.trim();
    }

    // Get first image for Open Graph
    const images = property.images || property.photoUrls || [];
    const firstImage = Array.isArray(images) && images.length > 0 
      ? images[0] 
      : '/images/defaults/placeholder-property.jpg';

    // Format price for title
    const priceText = price && price > 0 
      ? ` - ${new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)}`
      : '';

    // Construct SEO-friendly title
    const seoTitle = `${title}${priceText} | Snellman Sotheby's International Realty`;

    // Canonical URL
    const canonicalUrl = `${baseUrl}/property/${slug}`;

    return {
      title: seoTitle,
      description,
      keywords: `${city}, ${rooms}, kiinteistö, asunto, ${area ? `${area} m²` : ''}, Sotheby's, Finland, real estate`,
      openGraph: {
        title: seoTitle,
        description,
        url: canonicalUrl,
        siteName: 'Snellman Sotheby\'s International Realty',
        images: [
          {
            url: firstImage,
            width: 1200,
            height: 630,
            alt: `${title} - ${address}`,
          },
        ],
        locale: lang === 'sv' ? 'sv_FI' : lang === 'en' ? 'en_FI' : 'fi_FI',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description,
        images: [firstImage],
      },
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'fi': `${canonicalUrl}?lang=fi`,
          'sv': `${canonicalUrl}?lang=sv`,
          'en': `${canonicalUrl}?lang=en`,
        },
      },
    };
  } catch (error) {
    console.error('Error generating property metadata:', error);
    return {
      title: 'Property - Snellman Sotheby\'s International Realty',
      description: 'Premium real estate in Finland',
    };
  }
}

