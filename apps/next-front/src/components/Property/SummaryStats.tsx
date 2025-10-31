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

  // Apartment stats
  if (isApartment && !isRental) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-6 border-y border-gray-200">
        <Stat 
          label={t('stats.livingArea', locale)} 
          value={vm.area} 
        />
        <Stat 
          label={t('stats.price', locale)} 
          value={vm.price} 
          sub={fmtPerM2(salesPriceNum, livingAreaNum, locale)}
        />
        <Stat 
          label={t('stats.debtFree', locale)} 
          value={vm.priceDebtFree} 
          sub={fmtPerM2(debtFreePriceNum, livingAreaNum, locale)}
        />
        <Stat 
          label={t('stats.district', locale)} 
          value={vm.subtitle?.split(' • ')[1] || vm.city} 
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
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-6 border-y border-gray-200">
        <Stat 
          label={t('stats.livingArea', locale)} 
          value={vm.area} 
        />
        <Stat 
          label={t('stats.totalArea', locale)} 
          value={vm.areaExtra} 
        />
        <Stat 
          label={t('stats.price', locale)} 
          value={vm.price} 
          sub={fmtPerM2(salesPriceNum, livingAreaNum, locale)}
        />
        <Stat 
          label={t('stats.district', locale)} 
          value={vm.subtitle?.split(' • ')[1] || vm.city} 
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
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-6 border-y border-gray-200">
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
        <Stat 
          label={t('stats.district', locale)} 
          value={vm.subtitle?.split(' • ')[1] || vm.city} 
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

