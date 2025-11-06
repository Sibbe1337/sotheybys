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
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

export function SummaryStats({ vm, locale, isApartment, isProperty, isRental }: SummaryStatsProps) {
  // Extract numeric values for per m² calculations
  const salesPriceNum = vm.price ? parseInt(vm.price.replace(/[^0-9]/g, '')) : undefined;
  const debtFreePriceNum = vm.priceDebtFree ? parseInt(vm.priceDebtFree.replace(/[^0-9]/g, '')) : undefined;
  const livingAreaNum = vm.area ? parseInt(vm.area.replace(/[^0-9]/g, '')) : undefined;
  const plotAreaNum = vm.plotArea ? parseInt(vm.plotArea.replace(/[^0-9]/g, '')) : undefined;

  // PDF spec s.5: Labels for prices
  const debtFreeLabel = locale === 'sv' ? 'Vh (Skuldfritt pris)' : locale === 'en' ? 'Debt-free price (Vh)' : 'Vh (Velaton hinta)';
  const askPriceLabel = locale === 'sv' ? 'Mh (Försäljningspris)' : locale === 'en' ? 'Sales price (Mh)' : 'Mh (Myyntihinta)';
  
  // PDF spec s.6: District and City separation
  const districtValue = vm.district || vm.subtitle?.split(' • ')[1];
  const cityValue = vm.city;

  // Apartment stats
  if (isApartment && !isRental) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 py-6 border-y border-gray-200">
        <Stat 
          label={t('stats.livingArea', locale)} 
          value={vm.area} 
        />
        {/* PDF spec s.5-6: Show BOTH Vh and Mh even when equal */}
        <Stat 
          label={debtFreeLabel} 
          value={vm.priceDebtFree || vm.price} 
          sub={fmtPerM2(debtFreePriceNum || salesPriceNum, livingAreaNum, locale)}
        />
        <Stat 
          label={askPriceLabel} 
          value={vm.price} 
          sub={fmtPerM2(salesPriceNum, livingAreaNum, locale)}
        />
        {/* PDF spec s.5: District (stadsdel) separate from city */}
        {districtValue && (
          <Stat 
            label={locale === 'sv' ? 'Stadsdel' : locale === 'en' ? 'District' : 'Kaupunginosa'} 
            value={districtValue} 
          />
        )}
        <Stat 
          label={locale === 'sv' ? 'Stad' : locale === 'en' ? 'City' : 'Kaupunki'} 
          value={cityValue} 
        />
        <Stat 
          label={t('stats.yearBuilt', locale)} 
          value={vm.yearBuilt} 
        />
      </div>
    );
  }

  // Property/Estate stats
  if (isProperty && !isRental) {
    // PDF spec s.5: Separate district and city
    const districtValue = vm.district || vm.subtitle?.split(' • ')[1];
    const cityValue = vm.city;

    return (
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 py-6 border-y border-gray-200">
        <Stat 
          label={t('stats.livingArea', locale)} 
          value={vm.area} 
        />
        {/* PDF spec s.5: Show Total area for properties */}
        <Stat 
          label={t('stats.totalArea', locale)} 
          value={vm.areaExtra} 
        />
        <Stat 
          label={askPriceLabel} 
          value={vm.price} 
          sub={fmtPerM2(salesPriceNum, livingAreaNum, locale)}
        />
        {districtValue && (
          <Stat 
            label={locale === 'sv' ? 'Stadsdel' : locale === 'en' ? 'District' : 'Kaupunginosa'} 
            value={districtValue} 
          />
        )}
        <Stat 
          label={locale === 'sv' ? 'Stad' : locale === 'en' ? 'City' : 'Kaupunki'} 
          value={cityValue} 
        />
        <Stat 
          label={t('stats.plotArea', locale)} 
          value={fmtPlotArea(plotAreaNum, locale)} 
        />
      </div>
    );
  }

  // Rental stats
  if (isRental) {
    const districtValue = vm.district || vm.subtitle?.split(' • ')[1];
    const cityValue = vm.city;

    return (
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 py-6 border-y border-gray-200">
        <Stat 
          label={t('stats.livingArea', locale)} 
          value={vm.area} 
        />
        <Stat 
          label={t('fields.monthlyRent', locale)} 
          value={vm.rental?.monthlyRent} 
        />
        <Stat 
          label={t('fields.securityDeposit', locale)} 
          value={vm.rental?.securityDeposit} 
        />
        {districtValue && (
          <Stat 
            label={locale === 'sv' ? 'Stadsdel' : locale === 'en' ? 'District' : 'Kaupunginosa'} 
            value={districtValue} 
          />
        )}
        <Stat 
          label={locale === 'sv' ? 'Stad' : locale === 'en' ? 'City' : 'Kaupunki'} 
          value={cityValue} 
        />
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

