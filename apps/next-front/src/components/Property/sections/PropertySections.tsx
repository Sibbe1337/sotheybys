'use client';

import { getSectionLabel, getFieldLabel } from '@/lib/i18n/property-translations';
import { fmtPerM2, fmtPlotArea } from '@/lib/presentation/formatters/perSquareMeter';
import { nonEmpty } from '@/lib/presentation/formatters/number';
import { getEnergyStatusLabel } from '@/lib/domain/energy';
import { translateBoolean, translateCommonTerm } from '@/lib/presentation/common-terms';
import type { Locale } from '@/lib/domain/property.types';
import type { PropertyDetailVM } from '@/lib/presentation/property.view-model';
import type { EnergyStatus } from '@/lib/domain/energy';

interface PropertySectionsProps {
  vm: PropertyDetailVM;
  locale: Locale;
  isCommercial?: boolean; // Dennis 2025-11-12: Support for commercial properties
}

interface FieldProps {
  label: string;
  value?: string | number | boolean;
  sub?: string;
  alwaysShow?: boolean;
  locale?: Locale;
}

function Field({ label, value, sub, alwaysShow = false, locale = 'fi' }: FieldProps) {
  if (!alwaysShow && (value === undefined || value === null || value === '')) return null;
  
  // Handle boolean values
  let displayValue: string | number | undefined;
  if (typeof value === 'boolean') {
    displayValue = translateBoolean(value, locale);
  } else if (value === undefined || value === null || value === '') {
    // Show default text for alwaysShow fields with no data
    displayValue = '—';
  } else if (typeof value === 'string') {
    // Translate common Finnish terms
    displayValue = translateCommonTerm(value, locale);
  } else {
    displayValue = value;
  }

  return (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <div className="text-right">
        <span className="font-medium text-gray-900">{displayValue}</span>
        {sub && <div className="text-sm text-gray-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
        {title}
      </h2>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="text-lg font-medium text-gray-800 mb-3">{title}</h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

// 🔥 LINUS FIX: Universal number parsing (handles both European "1 363,55 €" and English "€1,570,000")
function parseEuropeanNumber(value?: string): number | undefined {
  if (!value) return undefined;
  
  // Remove currency symbols and spaces first
  let cleaned = value.replace(/[€$£¥]/g, '').replace(/\s+/g, '');
  
  // Check if it's English format (comma as thousands separator, e.g., "1,570,000")
  // English format: has comma followed by exactly 3 digits
  if (/,\d{3}/.test(cleaned)) {
    // English format: remove commas (thousands separator)
    cleaned = cleaned.replace(/,/g, '');
  } else {
    // European format: replace comma with dot (decimal separator)
    cleaned = cleaned.replace(',', '.');
  }
  
  // Remove any remaining non-numeric characters except dot
  cleaned = cleaned.replace(/[^0-9.]/g, '');
  
  const num = parseFloat(cleaned);
  return Number.isFinite(num) && num > 0 ? num : undefined;
}

export function PropertySections({ vm, locale, isCommercial = false }: PropertySectionsProps) {
  // Map locale for formatters
  const localeStr = locale === 'sv' ? 'sv-SE' : locale === 'en' ? 'en-GB' : 'fi-FI';
  
  const salesPriceNum = parseEuropeanNumber(vm.price);
  const livingAreaNum = parseEuropeanNumber(vm.area);
  const plotAreaNum = parseEuropeanNumber(vm.plotArea);

  return (
    <div>
      {/* Kiinteistötiedot - LINUS SPEC: DÖLJ housingTenure/Hallintamuoto för fastigheter */}
      <Section title={getSectionLabel('property.info', locale)}>
        <Field label={getFieldLabel('propertyId', locale)} value={vm.propertyIdentifier} alwaysShow locale={locale} />
        <Field 
          label={getFieldLabel('plotSize', locale)} 
          value={fmtPlotArea(plotAreaNum, locale)} 
          alwaysShow 
          locale={locale}
        />
        <Field label={getFieldLabel('plotOwnership', locale)} value={vm.plotOwnership} alwaysShow locale={locale} />
        <Field label={getFieldLabel('plan', locale)} value={vm.zoning} alwaysShow locale={locale} />
        <Field 
          label={getFieldLabel('energyClass', locale)} 
          value={vm.energyClass}
          alwaysShow 
          locale={locale}
        />
        <Field 
          label={getFieldLabel('energyCertificate', locale)} 
          value={vm.energyCertStatus ? getEnergyStatusLabel(vm.energyCertStatus as EnergyStatus, locale) : undefined}
          alwaysShow 
          locale={locale}
        />
        <Field label={getFieldLabel('availableFrom', locale)} value={vm.availableFrom} alwaysShow locale={locale} />
        <Field label={getFieldLabel('plotRights', locale)} value={vm.propertyBuildingRights} locale={locale} />
        <Field label={getFieldLabel('servitudes', locale)} value={vm.propertyRestrictions} locale={locale} />
        {/* LINUS: NO housingTenure/Hallintamuoto for properties! */}
      </Section>

      {/* Rakennustiedot (Building Facts) */}
      <Section title={getSectionLabel('property.building', locale)}>
        <Field label={getFieldLabel('yearBuilt', locale)} value={vm.yearBuilt} alwaysShow locale={locale} />
        <Field label={getFieldLabel('heatingSystem', locale)} value={vm.heatingSystem} locale={locale} />
        <Field label={getFieldLabel('ventilationSystem', locale)} value={vm.ventilationSystem} locale={locale} />
        <Field label={getFieldLabel('floorsTotal', locale)} value={vm.floorsTotal} locale={locale} />
      </Section>

      {/* Kustannukset (Costs) */}
      <Section title={getSectionLabel('property.costs', locale)}>
        <SubSection title={getSectionLabel('property.priceInfo', locale)}>
          <Field 
            label={getFieldLabel('salesPrice', locale)} 
            value={vm.price}
            alwaysShow 
            locale={locale}
          />
          <Field 
            label={getFieldLabel('propertyTax', locale)} 
            value={vm.propertyTax ? `${vm.propertyTax} €` : undefined}
            alwaysShow 
            locale={locale}
          />
          <Field label={getFieldLabel('mortgages', locale)} value={vm.propertyMortgages} locale={locale} />
          <Field label={getFieldLabel('otherPayments', locale)} value={vm.propertyOtherFees} locale={locale} />
        </SubSection>
      </Section>

      {/* PDF spec s.11: "Asiakirjat & Linkit" block removed - documents available via MediaTabs */}
    </div>
  );
}
