'use client';

import { t } from '@/lib/i18n/property-translations';
import { fmtPerM2, fmtPlotArea } from '@/lib/presentation/formatters/perSquareMeter';
import type { Locale } from '@/lib/domain/property.types';
import type { PropertyDetailVM } from '@/lib/presentation/property.view-model';

interface SummaryStatsProps {
  vm: PropertyDetailVM;
  locale: Locale;
  isApartment: boolean;
  isProperty: boolean;
  isRental: boolean;
  isCommercial: boolean;  // Dennis 2025-11-11: Commercial properties support
}

interface StatProps {
  label: string;
  value?: string | number;
  sub?: string;
}

function Stat({ label, value, sub }: StatProps) {
  if (!value) return null;
  
  return (
    <div className="flex flex-col">
      <div className="text-xs sm:text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-base sm:text-lg font-semibold text-gray-900 break-words">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

export function SummaryStats({ vm, locale, isApartment, isProperty, isRental, isCommercial }: SummaryStatsProps) {
  // Extract numeric values for per m² calculations
  const salesPriceNum = vm.price ? parseInt(vm.price.replace(/[^0-9]/g, '')) : undefined;
  const debtFreePriceNum = vm.priceDebtFree ? parseInt(vm.priceDebtFree.replace(/[^0-9]/g, '')) : undefined;
  const livingAreaNum = vm.area ? parseInt(vm.area.replace(/[^0-9]/g, '')) : undefined;
  // plotArea is now a number, no need to parse
  const plotAreaNum = vm.plotArea;

  // Dennis: Full labels in stats (not Vh/Mh abbreviations - those are for cards only)
  const debtFreeLabel = locale === 'sv' ? 'Skuldfritt pris' : locale === 'en' ? 'Debt-free price' : 'Velaton hinta';
  const askPriceLabel = locale === 'sv' ? 'Försäljningspris' : locale === 'en' ? 'Sales price' : 'Myyntihinta';
  
  // Dennis: Only show STADSDEL (district), NOT city in stats
  const districtValue = vm.district || vm.subtitle?.split(' • ')[1];

  // Apartment stats
  if (isApartment && !isRental) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 py-4 sm:py-6 border-y border-gray-200">
        <Stat 
          label={t('stats.livingArea', locale)} 
          value={vm.area} 
        />
        {/* Dennis: Show BOTH prices but NO €/m² sub-text */}
        <Stat 
          label={debtFreeLabel} 
          value={vm.priceDebtFree || vm.price} 
        />
        <Stat 
          label={askPriceLabel} 
          value={vm.price} 
        />
        {/* Dennis: ONLY Stadsdel (district), NO City */}
        {districtValue && (
          <Stat 
            label={locale === 'sv' ? 'Stadsdel' : locale === 'en' ? 'District' : 'Kaupunginosa'} 
            value={districtValue} 
          />
        )}
        <Stat 
          label={t('stats.yearBuilt', locale)} 
          value={vm.yearBuilt} 
        />
      </div>
    );
  }

  // Commercial stats - Dennis 2025-11-11: Show businessArea instead of livingArea
  if (isCommercial && !isRental) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 py-4 sm:py-6 border-y border-gray-200">
        <Stat 
          label={t('fields.businessArea', locale)} 
          value={vm.area} 
        />
        {/* Dennis: Price WITHOUT €/m² sub-text */}
        <Stat 
          label={askPriceLabel} 
          value={vm.price} 
        />
        {/* Dennis: ONLY Stadsdel, NO City */}
        {districtValue && (
          <Stat 
            label={locale === 'sv' ? 'Stadsdel' : locale === 'en' ? 'District' : 'Kaupunginosa'} 
            value={districtValue} 
          />
        )}
        <Stat 
          label={t('stats.yearBuilt', locale)} 
          value={vm.yearBuilt} 
        />
      </div>
    );
  }

  // Property/Estate stats
  if (isProperty && !isRental) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 py-4 sm:py-6 border-y border-gray-200">
        <Stat 
          label={t('stats.livingArea', locale)} 
          value={vm.area} 
        />
        {/* Dennis: Show Total area for properties */}
        <Stat 
          label={t('stats.totalArea', locale)} 
          value={vm.areaExtra} 
        />
        {/* Dennis: Price WITHOUT €/m² sub-text */}
        <Stat 
          label={askPriceLabel} 
          value={vm.price} 
        />
        {/* Dennis: ONLY Stadsdel, NO City */}
        {districtValue && (
          <Stat 
            label={locale === 'sv' ? 'Stadsdel' : locale === 'en' ? 'District' : 'Kaupunginosa'} 
            value={districtValue} 
          />
        )}
        <Stat 
          label={t('stats.plotArea', locale)} 
          value={fmtPlotArea(plotAreaNum, locale === 'sv' ? 'sv-SE' : locale === 'en' ? 'en-GB' : 'fi-FI')} 
        />
      </div>
    );
  }

  // Rental stats - Dennis 2025-11-11: Show both livingArea AND totalArea
  // Dennis 2025-11-12: Support commercial rentals (Office Space) - show businessArea instead
  if (isRental) {
    const areaLabel = isCommercial 
      ? t('fields.businessArea', locale)  // "Liiketilan pinta-ala" for commercial
      : t('stats.livingArea', locale);     // "Asuinpinta-ala" for residential
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 py-4 sm:py-6 border-y border-gray-200">
        <Stat 
          label={areaLabel} 
          value={vm.area} 
        />
        {/* Dennis 2025-11-11: Show Total Area if exists for rentals */}
        {/* Dennis 2025-11-12: HIDE Total Area for commercial rentals - only show for residential */}
        {vm.areaExtra && !isCommercial && (
          <Stat 
            label={t('fields.totalArea', locale)} 
            value={vm.areaExtra} 
          />
        )}
        <Stat 
          label={t('fields.monthlyRent', locale)} 
          value={vm.rental?.monthlyRent} 
        />
        <Stat 
          label={t('fields.securityDeposit', locale)} 
          value={vm.rental?.securityDeposit} 
        />
        {/* Dennis: ONLY Stadsdel, NO City */}
        {districtValue && (
          <Stat 
            label={locale === 'sv' ? 'Stadsdel' : locale === 'en' ? 'District' : 'Kaupunginosa'} 
            value={districtValue} 
          />
        )}
        <Stat 
          label={t('fields.availableFrom', locale)} 
          value={vm.availableFrom} 
        />
      </div>
    );
  }

  // Default fallback
  return null;
}

