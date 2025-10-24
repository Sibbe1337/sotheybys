import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/wordpress';
import { fetchLinearListings, fetchTestLinearListings } from '@/lib/linear-api-adapter';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';
import PropertyDetailEnhanced from '@/components/Property/PropertyDetailEnhanced';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { Metadata } from 'next';

interface PropertyPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    lang?: string;
  };
}

// Define the property interface with ACF fields
interface PropertyWithACF {
  title: string;
  slug: string;
  content?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
  images?: Array<{
    url: string;
    title?: string;
    isMain?: boolean;
  }>;
  acfRealEstate?: {
    property?: {
      address?: string;
      city?: string;
      price?: string;
      debtFreePrice?: string;
      area?: string;
      rooms?: string;
      bedrooms?: string;
      bathrooms?: string;
      propertyType?: string;
      status?: string;
      description?: string;
      externalLinks?: Array<{
        label: string;
        url: string;
      }>;
      videoUrl?: string | null;
      // Additional property details
      maintenanceCharge?: string;
      waterCharge?: string;
      shareNumbers?: string;
      floor?: string;
      floorCount?: string;
      energyClass?: string;
      constructionMaterial?: string;
      housingCooperativeName?: string;
      propertyManagerName?: string;
      propertyManagerOffice?: string;
      heatingSystem?: string;
      constructionYear?: string;
      lotOwnership?: string;
      // Additional detailed fields
      balcony?: string;
      terrace?: string;
      sauna?: string;
      elevator?: string;
      parkingSpaces?: string;
      lotArea?: string;
      buildingMaterialFacade?: string;
      roofMaterial?: string;
      roofType?: string;
      windowsDirection?: string;
      kitchenDescription?: string;
      bathroomDescription?: string;
      condition?: string;
      furnished?: string;
      antenna?: string;
      autoparkingType?: string;
      generalCondition?: string;
      listingType?: string;
      // Marketing content fields
      freeText?: string;
      freeTextTitle?: string;
      marketingSubtitle?: string;
      marketingHighlights?: string[];
      marketingSellingPoints?: string[];
      marketingLocationDescription?: string;
      marketingAgentNotes?: string;
      hasMarketingContent?: boolean;
    };
    agent?: {
      name?: string;
      phone?: string;
      email?: string;
    };
  };
}

export const revalidate = 60;

// Helper function to fetch property data
async function fetchPropertyData(slug: string, lang: string = 'fi'): Promise<PropertyWithACF | null> {
  // CRITICAL: Use the API route which properly maps all fields
  // This ensures siteOwnershipType, ownershipType, housingTenure are correctly mapped
  try {
    // Determine the base URL for server-side fetching
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/property/${slug}?lang=${lang}`, {
      next: { revalidate: 60 }
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return result.data as PropertyWithACF;
      }
    }
  } catch (error) {
    console.error('Error fetching property from API:', error);
  }
  
  // Fallback: Try WordPress
  return await getPostBySlug(slug) as PropertyWithACF;
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = await fetchPropertyData(params.slug);
  
  if (!property) {
    return {
      title: 'Kohde ei löytynyt | Snellman Sotheby\'s International Realty',
      description: 'Valitettavasti etsimääsi kohdetta ei löytynyt.',
    };
  }

  const propertyData = property?.acfRealEstate?.property || {};
  const {
    address,
    city,
    price,
    debtFreePrice,
    area,
    rooms,
    propertyType,
    freeTextTitle,
    description,
    marketingSubtitle,
  } = propertyData;

  // Create title with key information
  const title = freeTextTitle || `${address || property.title} - ${city || 'Suomi'}`;
  const fullTitle = `${title} | Snellman Sotheby\'s International Realty`;

  // Create comprehensive description
  let metaDescription = marketingSubtitle || description || property.content || '';
  
  // Add key property details to description if not already included
  const details = [];
  if (area) {
    details.push(`${area} m²`);
  }
  if (rooms) {
    details.push(`${rooms} huonetta`);
  }
  if (price || debtFreePrice) {
    const displayPrice = price || debtFreePrice || '';
    if (displayPrice) {
      details.push(`${new Intl.NumberFormat('fi-FI').format(parseInt(displayPrice))} €`);
    }
  }
  
  if (details.length > 0 && metaDescription.length < 120) {
    metaDescription = `${metaDescription} | ${details.join(' • ')}`;
  }

  // Truncate description to appropriate length for meta description
  if (metaDescription.length > 160) {
    metaDescription = metaDescription.substring(0, 157) + '...';
  }

  // Get the first image for Open Graph
  const mainImage = property.images?.find(img => img.isMain) || property.images?.[0];
  const ogImage = mainImage?.url || property.featuredImage?.node?.sourceUrl;

  return {
    title: fullTitle,
    description: metaDescription,
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      type: 'website',
      siteName: 'Snellman Sotheby\'s International Realty',
      locale: 'fi_FI',
      ...(ogImage && {
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${address || property.title} - ${city || 'Suomi'}`,
        }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    alternates: {
      canonical: `/kohde/${params.slug}`,
    },
  };
}

// Generate structured data for SEO
function generateStructuredData(property: PropertyWithACF, propertyData: any, agentData: any) {
  const images = property?.images || [];
  const mainImage = images.find(img => img.isMain) || images[0];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: propertyData.freeTextTitle || property.title || '',
    description: propertyData.marketingSubtitle || propertyData.description || property.content || '',
    image: images.map(img => img.url).filter(Boolean),
    url: `https://sothebysrealty.fi/kohde/${property.slug}`,
    
    // Property details
    ...(propertyData.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: propertyData.address,
        addressLocality: propertyData.city || '',
        addressRegion: propertyData.province || '',
        postalCode: propertyData.postalCode || '',
        addressCountry: 'FI'
      }
    }),
    
    // Price information
    ...(propertyData.price || propertyData.debtFreePrice) && {
      offers: {
        '@type': 'Offer',
        price: propertyData.price || propertyData.debtFreePrice,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock'
      }
    },
    
    // Property specifications
    ...(propertyData.area && { floorSize: { '@type': 'QuantitativeValue', value: propertyData.area, unitText: 'MTK' } }),
    ...(propertyData.rooms && { numberOfRooms: propertyData.rooms }),
    ...(propertyData.bedrooms && { numberOfBedrooms: propertyData.bedrooms }),
    ...(propertyData.bathrooms && { numberOfBathrooms: propertyData.bathrooms }),
    ...(propertyData.floor && { floorLevel: propertyData.floor }),
    ...(propertyData.constructionYear && { yearBuilt: propertyData.constructionYear }),
    
    // Additional details
    ...(propertyData.propertyType && { additionalType: propertyData.propertyType }),
    ...(propertyData.lotArea && { 
      lotSize: { 
        '@type': 'QuantitativeValue', 
        value: propertyData.lotArea, 
        unitText: 'MTK' 
      } 
    }),
    
    // Agent information
    ...(agentData && {
      realEstateAgent: {
        '@type': 'RealEstateAgent',
        name: agentData.name || 'Snellman Sotheby\'s International Realty',
        telephone: agentData.phone || '',
        email: agentData.email || '',
        brand: {
          '@type': 'Brand',
          name: 'Snellman Sotheby\'s International Realty'
        }
      }
    }),
    
    // Publisher
    publisher: {
      '@type': 'Organization',
      name: 'Snellman Sotheby\'s International Realty',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sothebysrealty.fi/logo.png'
      }
    }
  };
}

export default async function PropertyDetailPage({ params, searchParams }: PropertyPageProps) {
  const { slug } = params;
  const language = searchParams?.lang || 'fi';
  
  // Use shared function to fetch property data
  const property = await fetchPropertyData(slug, language);
  
  if (!property) {
    notFound();
  }

  // Extract property data and agent data
  // For Linear API data, the property details might be at the root level
  const propertyData = property?.acfRealEstate?.property || property || {};
  const agentData = property?.acfRealEstate?.agent || null;
  const images = property?.images || [];
  
  // Generate structured data
  const structuredData = generateStructuredData(property, propertyData, agentData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ErrorBoundary>
        <PropertyDetailEnhanced 
          property={property}
          propertyData={propertyData}
          agentData={agentData}
          images={images}
          language={language as 'fi' | 'sv' | 'en'}
        />
      </ErrorBoundary>
    </>
  );
}