import { Suspense } from 'react';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import HomePageClient from './HomePageClient';
import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { GetProperties } from '@/lib/application/get-properties.usecase';
import { PropertyVM } from '@/lib/presentation/property.view-model';
import { getLinearAPIUrl, getLinearAPIKey } from '@/lib/config/linear-api.config';

// Force static generation for all locales
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

/**
 * Generate static params for all locales
 * This ensures all locale homepage routes are pre-rendered at build time
 * CRITICAL: This must be here to force Vercel to generate /fi, /sv, /en routes
 */
export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

/**
 * Server Component wrapper for the homepage
 * Fetches properties on server-side (avoids CORS issues)
 * Passes data as props to client component
 */
export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // 🏗️ SERVER-SIDE: Fetch properties here (no CORS issues)
  let properties: any[] = [];
  
  try {
    const apiUrl = getLinearAPIUrl();
    const apiKey = getLinearAPIKey();
    
    const client = new LinearAPIClient(apiUrl, apiKey);
    const mapper = new LinearToPropertyMapper();
    const getPropertiesUseCase = new GetProperties(client, mapper);
    
    const domainProperties = await getPropertiesUseCase.execute(locale as Locale);
    const cardVMs = domainProperties.map(p => PropertyVM.toCard(p, locale as Locale));
    
    // Filter out rentals, only show sales on homepage
    const saleProperties = cardVMs.filter(vm => !vm.isRental);
    
    // Transform to legacy format for PropertyCard compatibility
    properties = saleProperties.map(vm => ({
      slug: vm.slug,
      title: vm.title,
      featuredImage: vm.image ? {
        node: {
          sourceUrl: vm.image,
          altText: vm.title
        }
      } : {
        node: {
          sourceUrl: '/images/defaults/placeholder-property.jpg',
          altText: vm.title
        }
      },
      acfRealEstate: {
        property: {
          address: vm.title, // PropertyCardVM title contains full address
          city: vm.subtitle, // PropertyCardVM subtitle contains city
          price: vm.price,
          debtFreePrice: vm.priceDebtFree,
          area: vm.area,
          rooms: '', // PropertyCardVM doesn't have rooms field
          propertyType: '', // PropertyCardVM doesn't have type field
          status: vm.isSold ? 'sold' : 'available',
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching properties on server:', error);
    // Properties will be empty array, HomePageClient will use sample data
  }
  
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomePageClient locale={locale as Locale} initialProperties={properties} />
    </Suspense>
  );
}
