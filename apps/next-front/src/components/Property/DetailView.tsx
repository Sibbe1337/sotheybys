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
import { HeroAddressBadge } from './HeroAddressBadge';
import { TopBar } from './TopBar';
import { t } from '@/lib/i18n/property-translations';
import { isCommercial } from '@/lib/domain/property-type-helpers';

type VM = import('@/lib/presentation/property.view-model').PropertyDetailVM;
type Locale = 'fi' | 'sv' | 'en';
type Props = { vm: VM; locale: Locale };

// Helper to detect Swedish placeholder/instruction texts from CMS
function isPlaceholderText(text?: string): boolean {
  if (!text) return true;
  const placeholders = [
    'lägg till',           // "Add" in Swedish
    'skriv in',            // "Write in" in Swedish  
    'fyll i',              // "Fill in" in Swedish
    'här före texten',     // "here before the text"
    'före lägenhetsbeskrivningen', // "before the apartment description"
    'presentationstexten', // "presentation text"
  ];
  const lower = text.toLowerCase();
  return placeholders.some(p => lower.includes(p));
}

export function DetailView({ vm, locale }: Props) {
  // 🔥 2025-11-18 DENNIS FIX: Use productGroup first, then typeCode (matches property-type-helpers.ts)
  const typeCode = (vm.typeCode || '').toUpperCase();
  const productGroup = (vm.productGroup || '').toUpperCase();
  
  // Extract property type from subtitle as fallback (e.g., "Mökki tai huvila • Kittilä" -> "mökki tai huvila")
  const typeFromSubtitle = (vm.subtitle?.split(' • ')[0] || '').toLowerCase().trim();
  
  // Dennis 2025-11-11: Detect commercial properties first (office, retail, warehouse, etc.)
  const COMMERCIAL_CODES = [
    'OFFICE', 'OFFICE_SPACE', 'TOIMISTO', 'TOIMISTOTILA',
    'LIIKEHUONEISTO', 'COMMERCIAL_PROPERTY', 'COMMERCIAL', 'AFFÄRSLOKAL',
    'WAREHOUSE', 'VARASTO', 'INDUSTRIAL_PROPERTY', 'TEOLLISUUSKIINTEISTÖ'
  ];
  const isCommercialProperty = COMMERCIAL_CODES.includes(typeCode);
  
  // 🔥 CHECK PRODUCTGROUP FIRST (e.g., "APARTMENTS"), then fallback to typeCode
  const isApartment = productGroup === 'APARTMENTS' ||
                      ['KERROSTALO', 'FLAT', 'APARTMENT_BUILDING'].includes(typeCode) ||
                      typeFromSubtitle === 'kerrostalo';
  
  // 🔥 CHECK PRODUCTGROUP FIRST (e.g., "PROPERTIES"), then fallback to typeCode and subtitle
  const isProperty = productGroup === 'PROPERTIES' ||
    [
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
  
  // 🔍 DEBUG: Log detection for debugging - Dennis 2025-11-18: Added productGroup
  console.log(`🔍 Property type detection for ${vm.title}:`, {
    typeCode,
    productGroup,
    typeFromSubtitle,
    isApartment,
    isProperty,
    isRental,
    isCommercialProperty
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
      {/* Top Bar - PDF spec s.3-4 */}
      <TopBar
        address={displayAddress}
        postalCode={vm.postalCode}
        city={vm.city}
        agentEmail={agent.email}
        locale={locale}
      />

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
            address={displayAddress}
            postalCode={vm.postalCode}
            city={vm.city}
            livingArea={vm.livingArea}
            price={vm.debtFreePrice || vm.askPrice}
            propertySlug={vm.slug}
          />
        </div>
      </div>

      {/* Main Content - Dennis: Better mobile padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Share Buttons - Top Right */}
        <div className="flex justify-end mb-6">
          <ShareButtons url={currentUrl} title={vm.title} />
        </div>

        {/* Summary Stats - Dennis 2025-11-11: Added isCommercial */}
        <SummaryStats 
          vm={vm} 
          locale={locale} 
          isApartment={isApartment} 
          isProperty={isProperty} 
          isRental={isRental}
          isCommercial={isCommercialProperty}
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

        {/* GLOBAL LISTING Button - Centered under stats, matching old design */}
        {vm.internationalUrl && (
          <div className="my-6 flex justify-center">
            <a 
              href={vm.internationalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-[#002349] text-white font-semibold uppercase tracking-wider hover:bg-[#001731] transition-colors"
            >
              GLOBAL LISTING »
            </a>
          </div>
        )}

        {/* Main Address Title - H1 heading with street address */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mt-6 mb-2">
          {displayAddress}
        </h1>

        {/* Title Line - Property type and room description */}
        {titleLine && (
          <div className="mb-6 sm:mb-8">
            <p className="text-base sm:text-lg text-gray-600">{titleLine}</p>
          </div>
        )}

        {/* Description Title - Marketing headline before description */}
        {/* Filter out Swedish placeholder texts like "Lägg till Rubriken för presentationstexten här före texten" */}
        {vm.descriptionTitle && !isPlaceholderText(vm.descriptionTitle) && (
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
            {vm.descriptionTitle}
          </h2>
        )}

        {/* Description - Clean prose styling with proper paragraph spacing */}
        {vm.description && (
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="max-w-none text-gray-800 text-base sm:text-lg leading-relaxed space-y-6 [&>div>p]:mb-6 [&>div>p]:leading-relaxed">
              <RichText html={vm.description} />
            </div>
          </div>
        )}

        {/* Agent Section - Dennis: Move AFTER description, BEFORE type-specific sections */}
        {agent.name && (
          <div className="mb-12 bg-white rounded-none shadow-sm p-4 sm:p-6 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              {locale === 'sv' 
                ? 'Tilläggsinfo och visning' 
                : locale === 'en' 
                ? 'Additional Info and Viewing' 
                : 'Lisätiedot ja esittelyt'}
            </h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {agent.photoUrl && (
                <img 
                  src={agent.photoUrl} 
                  alt={agent.name} 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 text-center sm:text-left w-full">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{agent.name}</h3>
                {agent.title && (
                  <p className="text-sm sm:text-base text-gray-600 mb-3">{agent.title}</p>
                )}
                {agent.phone && (
                  <p className="text-sm sm:text-base text-gray-700 mb-2 break-words">
                    <span className="font-medium">
                      {locale === 'sv' ? 'Telefon' : locale === 'en' ? 'Phone' : 'Puhelin'}:
                    </span>{' '}
                    <a href={`tel:${agent.phone}`} className="hover:text-[#002349]">
                      {agent.phone}
                    </a>
                  </p>
                )}
                {agent.email && (
                  <p className="text-sm sm:text-base text-gray-700 mb-4 break-words">
                    <span className="font-medium">
                      {locale === 'sv' ? 'E-post' : locale === 'en' ? 'Email' : 'Sähköposti'}:
                    </span>{' '}
                    <a href={`mailto:${agent.email}`} className="hover:text-[#002349]">
                      {agent.email}
                    </a>
                  </p>
                )}
                <a
                  href={`mailto:${agent.email || 'info@sothebysrealty.fi'}`}
                  className="inline-block px-6 py-2 bg-[#002349] text-white font-semibold rounded-none hover:bg-[#001731] transition-colors"
                >
                  {locale === 'sv' ? 'TA KONTAKT' : locale === 'en' ? 'CONTACT US' : 'OTA YHTEYTTÄ'}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Type-specific Sections
            - Rental → RentalSections
            - Commercial → PropertySections (commercial mode)
            - Apartment (höghus/kerrostalo only) → ApartmentSections
            - Property (including egnahemshus/parhus with productGroup APARTMENTS) → PropertySections
        */}
        <div className="mb-12">
          {isRental && <RentalSections vm={vm} locale={locale} />}
          {!isRental && isCommercialProperty && <PropertySections vm={vm} locale={locale} isCommercial={true} />}
          {!isRental && !isCommercialProperty && isApartment && !isProperty && <ApartmentSections vm={vm} locale={locale} />}
          {!isRental && !isCommercialProperty && isProperty && <PropertySections vm={vm} locale={locale} />}
          {!isRental && !isCommercialProperty && !isApartment && !isProperty && <ApartmentSections vm={vm} locale={locale} />}
        </div>
      </div>
    </div>
  );
}
