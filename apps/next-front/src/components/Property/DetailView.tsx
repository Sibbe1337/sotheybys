'use client';

import { RichText } from '@/lib/presentation/components/RichText';
import { cleanAgentData } from '@/lib/domain/agent-utils';
import { getPlaceholder, lpickWithIndicator } from '@/lib/domain/locale-utils';
import { MediaTabs } from './MediaTabs';
import { ShareButtons } from './ShareButtons';
import { SummaryStats } from './SummaryStats';
import { ApartmentSections } from './sections/ApartmentSections';
import { PropertySections } from './sections/PropertySections';
import { RentalSections } from './sections/RentalSections';
import { t } from '@/lib/i18n/property-translations';

type VM = import('@/lib/presentation/property.view-model').PropertyDetailVM;
type Locale = 'fi' | 'sv' | 'en';
type Props = { vm: VM; locale: Locale };

export function DetailView({ vm, locale }: Props) {
  // 🔥 LINUS FIX: Type-specific layout detection with ROBUST subtitle fallback
  const typeCode = (vm.typeCode || '').toUpperCase();
  
  // Extract property type from subtitle as fallback (e.g., "Mökki tai huvila • Kittilä" -> "mökki tai huvila")
  const typeFromSubtitle = (vm.subtitle?.split(' • ')[0] || '').toLowerCase().trim();
  
  const isApartment = ['KERROSTALO', 'FLAT', 'APARTMENT_BUILDING'].includes(typeCode) ||
                      typeFromSubtitle === 'kerrostalo';
  
  // Check typeCode first, then fallback to subtitle keywords
  const isProperty = [
    'OMAKOTITALO', 'DETACHED_HOUSE', 'DETACHEDHOUSE',
    'RIVITALO', 'TOWNHOUSE',
    'PARITALO', 'SEMI_DETACHED_HOUSE',
    'LUHTITALO', 'TERRACED_HOUSE',
    'COTTAGE_OR_VILLA', 'MÖKKI_TAI_HUVILA',
    'TONTTI', 'PLOT',
    'MAATILA', 'FARM',
    'VUOKRATALO', 'RENTAL_HOUSE'
  ].includes(typeCode) || 
  // 🔥 ROOT FIX: If typeCode is missing, detect from subtitle keywords
  (!typeCode && ['mökki', 'huvila', 'omakotitalo', 'tontti', 'maatila', 'rivitalo', 'paritalo',
                  'villa', 'cottage', 'detached', 'townhouse', 'plot', 'farm',
                  'stuga', 'tomt', 'gård', 'radhus', 'parhus'].some(kw => typeFromSubtitle.includes(kw)));
  
  const isRental = !!vm.rental;
  
  // 🔍 DEBUG: Log detection for debugging
  console.log(`🔍 Property type detection for ${vm.title}:`, {
    typeCode,
    typeFromSubtitle,
    isApartment,
    isProperty,
    isRental
  });
  
  const typePrefix = vm.subtitle.split(' • ')[0] || ''; // Objektstyp (Kerrostalo, etc.)
  
  // ✅ MÄKLARE SPEC: Address should show street + gate letter ONLY (NOT apartment number)
  // Example: "Heikkiläntie 1 C" (not "Heikkiläntie 1 C 47")
  // Use vm.address (street only) + vm.gate (letter only) for robust address building
  const displayAddress = vm.gate ? `${vm.address} ${vm.gate}` : vm.address;
  
  // ✅ DENNIS SPEC: "Kerrostalo | 5-6h, k, kph, wc, vh, lasitettu parveke och terassi"
  const titleLine = vm.apartmentType 
    ? `${typePrefix} | ${vm.apartmentType}`
    : typePrefix;

  const agent = cleanAgentData(vm.agent || {});
  
  // 🔥 LINUS FIX: Force complete re-mount when property OR locale changes
  // Without this, React caches images/data from previous property (brain-dead bug!)
  const componentKey = `${vm.id || vm.slug}-${locale}`;

  // Get current page URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Extract floor plans from images or documents
  const floorPlanImages = vm.images.filter(img => img.floorPlan);
  const floorPlanUrls = vm.documents?.floorPlan ? [vm.documents.floorPlan] : [];
  const allFloorPlans = floorPlanUrls.length > 0 ? floorPlanUrls : undefined;

  return (
    <div key={componentKey} className="min-h-screen bg-gray-50">
      {/* Media Tabs - Full width */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <MediaTabs
            images={vm.images}
            title={vm.title}
            propertyId={vm.id}
            floorPlans={allFloorPlans}
            coordinates={vm.coordinates}
            brochureUrl={vm.documents?.brochure || vm.documents?.brochureIntl}
            videoUrl={vm.documents?.video}
            locale={locale}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Share Buttons - Top Right */}
        <div className="flex justify-end mb-6">
          <ShareButtons url={currentUrl} title={vm.title} />
        </div>

        {/* Summary Stats */}
        <SummaryStats 
          vm={vm} 
          locale={locale} 
          isApartment={isApartment} 
          isProperty={isProperty} 
          isRental={isRental} 
        />

        {/* Bidding Link - if bidding property */}
        {vm.price?.includes('alkaen') && (
          <div className="my-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-sm text-gray-700 mb-2">
              {locale === 'sv' ? 'Budgivning med start från' : locale === 'en' ? 'Bidding starting from' : 'Budgivning alkaa hinnasta'} {vm.price}
            </p>
            <a 
              href="#bidding" 
              className="inline-block text-[#002349] font-medium hover:underline"
            >
              {locale === 'sv' ? 'Följ budgivningen »' : locale === 'en' ? 'Follow bidding »' : 'Seuraa tarjouskilpailua »'}
            </a>
          </div>
        )}

        {/* GLOBAL LISTING Button */}
        {vm.internationalUrl && (
          <div className="my-6">
            <a 
              href={vm.internationalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-[#8e740b] text-white font-semibold rounded hover:bg-[#7a6209] transition-colors"
            >
              {t('media.global', locale)}
            </a>
          </div>
        )}

        {/* Title, Address, Type */}
        <div className="my-8">
          {vm.descriptionTitle && (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {vm.descriptionTitle}
            </h1>
          )}
          <p className="text-xl text-gray-700 mb-2">
            {displayAddress}, {vm.postalCode} {vm.city}
          </p>
          {titleLine && (
            <p className="text-lg text-gray-600">{titleLine}</p>
          )}
        </div>

        {/* Description - Steve Jobs inspired: MAXIMUM breathing room for clarity */}
        {vm.description && (
          <div className="mb-12 bg-white rounded-lg shadow-sm p-8 md:p-10">
            <div className="prose prose-lg max-w-none text-gray-700 [&>p]:mb-10 [&>p]:leading-loose [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
              <RichText html={vm.description} />
            </div>
          </div>
        )}

        {/* Type-specific Sections */}
        <div className="mb-12">
          {isRental && <RentalSections vm={vm} locale={locale} />}
          {!isRental && isApartment && <ApartmentSections vm={vm} locale={locale} />}
          {!isRental && isProperty && <PropertySections vm={vm} locale={locale} />}
        </div>

        {/* Agent Card - Moved higher, no sidebar */}
        {agent.name && (
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('fields.agent', locale)}
            </h2>
            <div className="flex items-start gap-4">
              {agent.photoUrl && (
                <img 
                  src={agent.photoUrl} 
                  alt={agent.name} 
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{agent.name}</h3>
                {agent.title && (
                  <p className="text-gray-600 mb-2">{agent.title}</p>
                )}
                {agent.phone && (
                  <p className="text-gray-700 mb-1">
                    <a href={`tel:${agent.phone}`} className="hover:text-[#002349]">
                      {agent.phone}
                    </a>
                  </p>
                )}
                {agent.email && (
                  <p className="text-gray-700">
                    <a href={`mailto:${agent.email}`} className="hover:text-[#002349]">
                      {agent.email}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
