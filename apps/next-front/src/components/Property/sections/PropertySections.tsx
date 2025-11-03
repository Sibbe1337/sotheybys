'use client';

import { getSectionLabel, getFieldLabel } from '@/lib/i18n/property-translations';
import { fmtPerM2, fmtPlotArea } from '@/lib/presentation/formatters/perSquareMeter';
import { nonEmpty } from '@/lib/presentation/formatters/number';
import { getEnergyStatusLabel } from '@/lib/domain/energy';
import type { Locale } from '@/lib/domain/property.types';
import type { PropertyDetailVM } from '@/lib/presentation/property.view-model';
import type { EnergyStatus } from '@/lib/domain/energy';

interface PropertySectionsProps {
  vm: PropertyDetailVM;
  locale: Locale;
}

interface FieldProps {
  label: string;
  value?: string | number | boolean;
  sub?: string;
  alwaysShow?: boolean;
}

function Field({ label, value, sub, alwaysShow = false }: FieldProps) {
  if (!alwaysShow && (value === undefined || value === null || value === '')) return null;
  
  // Handle boolean values
  let displayValue: string | number | undefined;
  if (typeof value === 'boolean') {
    displayValue = value ? getFieldLabel('yes', 'fi') : getFieldLabel('no', 'fi');
  } else if (value === undefined || value === null || value === '') {
    // Show default text for alwaysShow fields with no data
    displayValue = '—';
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

// 🔥 LINUS FIX: Proper European number parsing (handles "1 363,55 €" correctly)
function parseEuropeanNumber(value?: string): number | undefined {
  if (!value) return undefined;
  // Remove spaces (thousands separator), replace comma with dot (decimal), remove non-numeric chars
  const cleaned = value.replace(/\s+/g, '').replace(',', '.').replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) && num > 0 ? num : undefined;
}

export function PropertySections({ vm, locale }: PropertySectionsProps) {
  const salesPriceNum = parseEuropeanNumber(vm.price);
  const livingAreaNum = parseEuropeanNumber(vm.area);
  const plotAreaNum = parseEuropeanNumber(vm.plotArea);

  return (
    <div>
      {/* Kiinteistötiedot - LINUS SPEC: DÖLJ housingTenure/Hallintamuoto för fastigheter */}
      <Section title={getSectionLabel('property.info', locale)}>
        <Field label={getFieldLabel('propertyId', locale)} value={vm.propertyIdentifier} alwaysShow />
        <Field 
          label={getFieldLabel('plotSize', locale)} 
          value={fmtPlotArea(plotAreaNum, locale)} 
          alwaysShow 
        />
        <Field label={getFieldLabel('plotOwnership', locale)} value={vm.plotOwnership} alwaysShow />
        <Field label={getFieldLabel('plan', locale)} value={vm.zoning} alwaysShow />
        <Field 
          label={getFieldLabel('energyClass', locale)} 
          value={vm.energyClass}
          alwaysShow 
        />
        <Field 
          label={getFieldLabel('energyCertificate', locale)} 
          value={vm.energyCertStatus ? getEnergyStatusLabel(vm.energyCertStatus as EnergyStatus, locale) : undefined}
          alwaysShow 
        />
        <Field label={getFieldLabel('availableFrom', locale)} value={vm.availableFrom} alwaysShow />
        <Field label={getFieldLabel('plotRights', locale)} value={vm.propertyBuildingRights} />
        <Field label={getFieldLabel('servitudes', locale)} value={vm.propertyRestrictions} />
        {/* LINUS: NO housingTenure/Hallintamuoto for properties! */}
      </Section>

      {/* Rakennustiedot (Building Facts) */}
      <Section title={getSectionLabel('property.building', locale)}>
        <Field label={getFieldLabel('yearBuilt', locale)} value={vm.yearBuilt} alwaysShow />
        <Field label={getFieldLabel('heatingSystem', locale)} value={vm.heatingSystem} />
        <Field label={getFieldLabel('ventilationSystem', locale)} value={vm.ventilationSystem} />
        <Field label={getFieldLabel('floorsTotal', locale)} value={vm.floorsTotal} />
      </Section>

      {/* Kustannukset (Costs) */}
      <Section title={getSectionLabel('property.costs', locale)}>
        <SubSection title={getSectionLabel('property.priceInfo', locale)}>
          <Field 
            label={getFieldLabel('salesPrice', locale)} 
            value={vm.price}
            sub={fmtPerM2(salesPriceNum, livingAreaNum, locale)}
            alwaysShow 
          />
          <Field 
            label={getFieldLabel('propertyTax', locale)} 
            value={vm.propertyTax ? `${vm.propertyTax} €` : undefined}
            alwaysShow 
          />
          <Field label={getFieldLabel('mortgages', locale)} value={vm.propertyMortgages} />
          <Field label={getFieldLabel('otherPayments', locale)} value={vm.propertyOtherFees} />
        </SubSection>
      </Section>

      {/* Asiakirjat & Linkit */}
      <Section title={getSectionLabel('property.docs', locale)}>
        {vm.documents?.brochure && (
          <div className="py-2">
            <a href={vm.documents.brochure} target="_blank" rel="noopener noreferrer" className="text-[#002349] hover:underline">
              {getFieldLabel('brochure', locale)}
            </a>
          </div>
        )}
        {vm.documents?.energyCert && (
          <div className="py-2">
            <a href={vm.documents.energyCert} target="_blank" rel="noopener noreferrer" className="text-[#002349] hover:underline">
              {getFieldLabel('energyCertificate', locale)}
            </a>
          </div>
        )}
        {vm.documents?.floorPlan && (
          <div className="py-2">
            <a href={vm.documents.floorPlan} target="_blank" rel="noopener noreferrer" className="text-[#002349] hover:underline">
              {getFieldLabel('floorPlan', locale)}
            </a>
          </div>
        )}
      </Section>
    </div>
  );
}

