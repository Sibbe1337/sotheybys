import { MetadataRoute } from 'next';

/**
 * Dynamic Sitemap Generator
 * Automatically generates sitemap.xml with all properties and pages
 * Updates every time a new property is added to Linear API
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sothebysrealty.fi';
  
  // Fetch all properties from Linear API
  let propertyUrls: MetadataRoute.Sitemap = [];
  
  try {
    const response = await fetch(`${baseUrl}/api/proxy/listings`, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    
    if (response.ok) {
      const listings = await response.json();
      
      // Generate URLs for each property in all three languages
      propertyUrls = listings.flatMap((listing: any) => {
        const slug = listing.slug || listing.id;
        const updatedAt = listing.updatedAt ? new Date(listing.updatedAt) : new Date();
        
        return [
          {
            url: `${baseUrl}/property/${slug}`,
            lastModified: updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.8,
          },
          {
            url: `${baseUrl}/property/${slug}?lang=fi`,
            lastModified: updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.8,
          },
          {
            url: `${baseUrl}/property/${slug}?lang=sv`,
            lastModified: updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.8,
          },
          {
            url: `${baseUrl}/property/${slug}?lang=en`,
            lastModified: updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.8,
          }
        ];
      });
    }
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
  }

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage (all languages)
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/?lang=fi`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sv`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    
    // Property listings (all languages)
    {
      url: `${baseUrl}/kohteet`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sv/objekt`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/properties`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    
    // Rental properties (all languages)
    {
      url: `${baseUrl}/kohteet/vuokrakohteet`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sv/objekt/hyresobjekt`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/properties/rentals`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    
    // References (all languages)
    {
      url: `${baseUrl}/kohteet/referenssit`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sv/objekt/referenser`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/properties/references`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    
    // Purchase assignments (all languages)
    {
      url: `${baseUrl}/kohteet/ostotoimeksiannot`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sv/objekt/kopuppdrag`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/properties/purchase-assignments`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    
    // Sell with us (all languages)
    {
      url: `${baseUrl}/myymassa`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sv/salj-med-oss`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/sell-with-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    
    // About us (all languages)
    {
      url: `${baseUrl}/yritys`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sv/om-oss`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    
    // Staff (all languages)
    {
      url: `${baseUrl}/henkilosto`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sv/personal`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/staff`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    
    // Contact (all languages)
    {
      url: `${baseUrl}/yhteystiedot`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sv/kontakta-oss`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    
    // International (all languages)
    {
      url: `${baseUrl}/kansainvalisesti`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sv/internationellt`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/international`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Combine static pages and property pages
  return [...staticPages, ...propertyUrls];
}
