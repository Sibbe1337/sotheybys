import { GetPropertyBySlug } from '@/lib/application/get-property-by-slug.usecase';
import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { PropertyVM } from '@/lib/presentation/property.view-model';
import { DetailView } from '@/components/Property/DetailView';
import type { Metadata } from 'next';

interface PropertyPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    lang?: string;
  };
}

export const revalidate = 300;
export const dynamic = 'force-static';
export const dynamicParams = false;

// Helper function to fetch property data using new use case
async function fetchPropertyData(slug: string, lang: 'fi' | 'sv' | 'en' = 'fi') {
  const uc = new GetPropertyBySlug(
    new LinearAPIClient(
      process.env.LINEAR_API_URL || '',
      process.env.LINEAR_API_KEY
    ),
    new LinearToPropertyMapper()
  );

  return await uc.execute(slug, lang);
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params, searchParams }: PropertyPageProps): Promise<Metadata> {
  const lang = (searchParams?.lang || 'fi') as 'fi' | 'sv' | 'en';
  const domain = await fetchPropertyData(params.slug, lang);
  
  if (!domain) {
    return {
      title: 'Kohde ei löytynyt | Snellman Sotheby\'s International Realty',
      description: 'Valitettavasti etsimääsi kohdetta ei löytynyt.',
    };
  }

  const vm = PropertyVM.toDetail(domain, lang);
  const address = vm.title;
  const city = vm.city;

  // Create title with key information
  const title = `${address} - ${city}`;
  const fullTitle = `${title} | Snellman Sotheby\'s International Realty`;

  // Create comprehensive description
  const details = [
    vm.area,
    vm.apartmentType,
    vm.price
  ].filter(Boolean);
  
  const metaDescription = details.join(' • ').substring(0, 160);

  // Get the first image for Open Graph
  const ogImage = vm.images?.[0]?.url;

  return {
    title: fullTitle,
    description: metaDescription,
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      type: 'website',
      siteName: 'Snellman Sotheby\'s International Realty',
      locale: lang === 'sv' ? 'sv_SE' : lang === 'en' ? 'en_US' : 'fi_FI',
      ...(ogImage && {
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${address} - ${city}`,
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
function generateStructuredData(vm: ReturnType<typeof PropertyVM.toDetail>, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: vm.title,
    description: vm.subtitle,
    image: vm.images.map(img => img.url).filter(Boolean),
    url: `https://sothebysrealty.fi/kohde/${slug}`,
    
    // Property details
    address: {
      '@type': 'PostalAddress',
      streetAddress: vm.title,
      addressLocality: vm.city,
      postalCode: vm.postalCode,
      addressCountry: 'FI'
    },
    
    // Price information
    offers: {
      '@type': 'Offer',
      price: vm.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock'
    },
    
    // Property specifications
    ...(vm.yearBuilt && { yearBuilt: vm.yearBuilt }),
    
    // Agent information
    ...(vm.agent && {
      realEstateAgent: {
        '@type': 'RealEstateAgent',
        name: vm.agent.name || 'Snellman Sotheby\'s International Realty',
        telephone: vm.agent.phone || '',
        email: vm.agent.email || '',
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
  const lang = (searchParams?.lang || 'fi') as 'fi' | 'sv' | 'en';
  
  // Use new use case to fetch property data
  const domain = await fetchPropertyData(slug, lang);
  
  // NEVER throw notFound() for empty translation - only for non-existent slug
  if (!domain) {
    // Empty state instead of 404
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-4">
            {lang === 'sv' ? 'Objekt hittades inte' : lang === 'en' ? 'Property not found' : 'Kohdetta ei löytynyt'}
          </h1>
          <a href={`/${lang}/kohteet`} className="text-blue-600 hover:underline">
            {lang === 'sv' ? 'Tillbaka till objekten' : lang === 'en' ? 'Back to properties' : 'Takaisin kohteisiin'}
          </a>
        </div>
      </div>
    );
  }

  const vm = PropertyVM.toDetail(domain, lang);
  
  // Generate structured data
  const structuredData = generateStructuredData(vm, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DetailView vm={vm} locale={lang} />
    </>
  );
}