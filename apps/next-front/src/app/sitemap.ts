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
            alternates: {
              languages: {
                fi: `${baseUrl}/property/${slug}?lang=fi`,
                sv: `${baseUrl}/property/${slug}?lang=sv`,
                en: `${baseUrl}/property/${slug}?lang=en`,
              }
            }
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
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          fi: baseUrl,
          sv: `${baseUrl}/sv`,
          en: `${baseUrl}/en`,
        }
      }
    },
    
    // Property listings (all languages)
    {
      url: `${baseUrl}/kohteet`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: {
        languages: {
          fi: `${baseUrl}/kohteet`,
          sv: `${baseUrl}/sv/objekt`,
          en: `${baseUrl}/en/properties`,
        }
      }
    },
    
    // Rental properties (all languages)
    {
      url: `${baseUrl}/kohteet/vuokrakohteet`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          fi: `${baseUrl}/kohteet/vuokrakohteet`,
          sv: `${baseUrl}/sv/objekt/hyresobjekt`,
          en: `${baseUrl}/en/properties/rentals`,
        }
      }
    },
    
    // References (all languages)
    {
      url: `${baseUrl}/kohteet/referenssit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          fi: `${baseUrl}/kohteet/referenssit`,
          sv: `${baseUrl}/sv/objekt/referenser`,
          en: `${baseUrl}/en/properties/references`,
        }
      }
    },
    
    // Purchase assignments (all languages)
    {
      url: `${baseUrl}/kohteet/ostotoimeksiannot`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          fi: `${baseUrl}/kohteet/ostotoimeksiannot`,
          sv: `${baseUrl}/sv/objekt/kopuppdrag`,
          en: `${baseUrl}/en/properties/purchase-assignments`,
        }
      }
    },
    
    // Sell with us (all languages)
    {
      url: `${baseUrl}/myymassa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          fi: `${baseUrl}/myymassa`,
          sv: `${baseUrl}/sv/salj-med-oss`,
          en: `${baseUrl}/en/sell-with-us`,
        }
      }
    },
    
    // About us (all languages)
    {
      url: `${baseUrl}/yritys`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          fi: `${baseUrl}/yritys`,
          sv: `${baseUrl}/sv/om-oss`,
          en: `${baseUrl}/en/about-us`,
        }
      }
    },
    
    // Staff (all languages)
    {
      url: `${baseUrl}/henkilosto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          fi: `${baseUrl}/henkilosto`,
          sv: `${baseUrl}/sv/personal`,
          en: `${baseUrl}/en/staff`,
        }
      }
    },
    
    // Contact (all languages)
    {
      url: `${baseUrl}/yhteystiedot`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          fi: `${baseUrl}/yhteystiedot`,
          sv: `${baseUrl}/sv/kontakta-oss`,
          en: `${baseUrl}/en/contact-us`,
        }
      }
    },
    
    // International (all languages)
    {
      url: `${baseUrl}/kansainvalisesti`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          fi: `${baseUrl}/kansainvalisesti`,
          sv: `${baseUrl}/sv/internationellt`,
          en: `${baseUrl}/en/international`,
        }
      }
    },
  ];

  // Combine static pages and property pages
  return [...staticPages, ...propertyUrls];
}

