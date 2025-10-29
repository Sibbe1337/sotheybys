import { MetadataRoute } from 'next';

/**
 * Dynamic Sitemap Generator for next-intl
 * Automatically generates sitemap.xml with all properties and pages
 * Uses path-based locale routing: /, /sv, /en
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

      // Generate URLs for each property in all three languages using new locale structure
      propertyUrls = listings.flatMap((listing: any) => {
        const slug = listing.slug || listing.id;
        const updatedAt = listing.updatedAt ? new Date(listing.updatedAt) : new Date();

        return [
          // Finnish (default locale - no prefix)
          {
            url: `${baseUrl}/kohde/${slug}`,
            lastModified: updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.8,
          },
          // Swedish
          {
            url: `${baseUrl}/sv/kohde/${slug}`,
            lastModified: updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.8,
          },
          // English
          {
            url: `${baseUrl}/en/kohde/${slug}`,
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

  // Static pages with high priority using next-intl path-based routing
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage (all languages)
    {
      url: baseUrl, // Finnish (default)
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

    // Property listings (all languages) - using unified /kohteet path
    {
      url: `${baseUrl}/kohteet`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sv/kohteet`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/kohteet`,
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
      url: `${baseUrl}/sv/kohteet/vuokrakohteet`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/kohteet/vuokrakohteet`,
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
      url: `${baseUrl}/sv/kohteet/referenssit`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/kohteet/referenssit`,
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
      url: `${baseUrl}/sv/kohteet/ostotoimeksiannot`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/kohteet/ostotoimeksiannot`,
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
      url: `${baseUrl}/sv/myymassa`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/myymassa`,
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
      url: `${baseUrl}/sv/yritys`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/yritys`,
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
      url: `${baseUrl}/sv/henkilosto`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/henkilosto`,
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
      url: `${baseUrl}/sv/yhteystiedot`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/yhteystiedot`,
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
      url: `${baseUrl}/sv/kansainvalisesti`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/kansainvalisesti`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },

    // Work with us (all languages)
    {
      url: `${baseUrl}/meille-toihin`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sv/meille-toihin`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/meille-toihin`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Combine static pages and property pages
  return [...staticPages, ...propertyUrls];
}
