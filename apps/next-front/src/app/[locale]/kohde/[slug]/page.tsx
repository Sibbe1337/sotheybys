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

// ✅ Use ISR (Incremental Static Regeneration) instead of SSR
export const revalidate = 300; // Regenerate every 5 minutes

// ✅ Ensure all locales are statically generated at build time
export const dynamicParams = true; // Allow new properties to be generated on-demand

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
      canonical: `https://sothebysrealty.fi/${locale}/kohde/${params.slug}`,
      languages: {
        'fi-FI': `https://sothebysrealty.fi/fi/kohde/${params.slug}`,
        'sv-SE': `https://sothebysrealty.fi/sv/kohde/${params.slug}`,
        'en-GB': `https://sothebysrealty.fi/en/kohde/${params.slug}`,
      },
    },
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