import { notFound } from 'next/navigation';
import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { GetPropertyBySlug } from '@/lib/application/get-property-by-slug.usecase';
import { PropertyVM } from '@/lib/presentation/property.view-model';
import { DetailView } from '@/components/Property/DetailView';
import { EmptyState } from '@/components/EmptyState';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { Metadata } from 'next';
import { log } from '@/lib/logger';
import type { Locale } from '@/i18n/config';

interface PropertyPageProps {
  params: {
    slug: string;
    locale: 'fi' | 'sv' | 'en';
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

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

// ✅ LINUS: Pre-generate all property pages at build time
export async function generateStaticParams() {
  try {
    const { getLinearAPIUrl, getLinearAPIKey, getLinearCompanyId } = await import('@/lib/config/linear-api.config');
    const apiUrl = getLinearAPIUrl();
    const apiKey = getLinearAPIKey();
    const companyId = getLinearCompanyId();
    
    const LinearAPIClient = (await import('@/lib/infrastructure/linear-api/client')).LinearAPIClient;
    const LinearToPropertyMapper = (await import('@/lib/infrastructure/linear-api/mapper')).LinearToPropertyMapper;
    const GetProperties = (await import('@/lib/application/get-properties.usecase')).GetProperties;
    
    const client = new LinearAPIClient(apiUrl, apiKey, companyId);
    const mapper = new LinearToPropertyMapper();
    const useCase = new GetProperties(client, mapper);
    
    const properties = await useCase.execute('fi'); // Use Finnish as base
    
    // Generate params for ALL locales
    const params = properties.flatMap(property => [
      { locale: 'fi', slug: property.slug },
      { locale: 'sv', slug: property.slug },
      { locale: 'en', slug: property.slug }
    ]);
    
    log(`✅ generateStaticParams: Generated ${params.length} property pages (${properties.length} properties × 3 locales)`);
    return params;
  } catch (error) {
    console.error('❌ generateStaticParams failed:', error);
    return [];
  }
}

// ✅ NEW: Simplified fetch using clean architecture
async function fetchProperty(slug: string, locale: Locale) {
  try {
    const { getLinearAPIUrl, getLinearAPIKey, getLinearCompanyId } = await import('@/lib/config/linear-api.config');
    const apiUrl = getLinearAPIUrl();
    const apiKey = getLinearAPIKey();
    const companyId = getLinearCompanyId();
    
    const client = new LinearAPIClient(apiUrl, apiKey, companyId);
    const mapper = new LinearToPropertyMapper();
    const useCase = new GetPropertyBySlug(client, mapper);
    
    const domain = await useCase.execute(slug, locale);
    if (!domain) return null;
    
    log(`✅ Property fetched: ${domain.address.fi} (locale: ${locale})`);
    return domain;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const locale = params.locale || 'fi';
  const domain = await fetchProperty(params.slug, locale);
  
  if (!domain) {
    const titles = {
      fi: 'Kohde ei löytynyt | Snellman Sotheby\'s International Realty',
      sv: 'Objekt hittades inte | Snellman Sotheby\'s International Realty',
      en: 'Property not found | Snellman Sotheby\'s International Realty'
    };
    return {
      title: titles[locale],
      description: locale === 'sv' ? 'Objektet du letade efter hittades inte.' : 
                   locale === 'en' ? 'The property you were looking for was not found.' :
                   'Valitettavasti etsimääsi kohdetta ei löytynyt.',
    };
  }

  // Use ViewModel for consistent formatting
  const vm = PropertyVM.toDetail(domain, locale);
  
  const title = `${vm.title} - ${vm.city} | Snellman Sotheby's International Realty`;
  const description = vm.subtitle || `${vm.area} • ${vm.price}`;
  const ogImage = vm.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Snellman Sotheby\'s International Realty',
      locale: locale === 'sv' ? 'sv_SE' : locale === 'en' ? 'en_GB' : 'fi_FI',
      ...(ogImage && {
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: vm.title,
        }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
    
    // Price information - ✅ SPEC FIX: Use numeric price (not string)
    ...(propertyData.price || propertyData.debtFreePrice) && {
      offers: {
        '@type': 'Offer',
        price: parseInt(propertyData.price || propertyData.debtFreePrice) || 0,
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

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug, locale } = params;
  
  // ✅ NEW ARCHITECTURE: Fetch property using clean architecture
  const domain = await fetchProperty(slug, locale);
  
  if (!domain) {
    // ✅ SPEC: Show empty state instead of 404 for missing property
    return <EmptyState locale={locale} type="property-not-found" />;
  }

  // ✅ NEW: Transform domain model to ViewModel for presentation
  const vm = PropertyVM.toDetail(domain, locale);
  
  // JSON-LD for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: vm.title,
    description: vm.subtitle || vm.description || '',
    image: vm.images.map(img => img.url),
    url: `https://sothebysrealty.fi/${locale}/kohde/${slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: vm.title,
      addressLocality: vm.city,
      postalCode: vm.postalCode,
      addressCountry: 'FI'
    },
    offers: {
      '@type': 'Offer',
      price: domain.pricing.sales, // ✅ Numeric value for JSON-LD
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock'
    },
    floorSize: { '@type': 'QuantitativeValue', value: domain.dimensions.living, unitText: 'MTK' },
    numberOfRooms: domain.dimensions.rooms,
    ...(domain.dimensions.bedrooms && { numberOfBedrooms: domain.dimensions.bedrooms }),
    ...(domain.dimensions.bathrooms && { numberOfBathrooms: domain.dimensions.bathrooms }),
    ...(domain.meta.yearBuilt && { yearBuilt: domain.meta.yearBuilt }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ErrorBoundary>
        <DetailView vm={vm} locale={locale} />
      </ErrorBoundary>
    </>
  );
}