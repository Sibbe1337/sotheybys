'use client';

import { getSectionLabel, getFieldLabel } from '@/lib/i18n/property-translations';
import { nonEmpty } from '@/lib/presentation/formatters/number';
import type { Locale } from '@/lib/domain/property.types';
import type { PropertyDetailVM } from '@/lib/presentation/property.view-model';

interface RentalSectionsProps {
  vm: PropertyDetailVM;
  locale: Locale;
}

interface FieldProps {
  label: string;
  value?: string | number | boolean;
  alwaysShow?: boolean;
  locale: Locale;
}

function Field({ label, value, alwaysShow = false, locale }: FieldProps) {
  if (!alwaysShow && (value === undefined || value === null || value === '')) return null;
  
  const displayValue = typeof value === 'boolean' 
    ? (value ? getFieldLabel('yes', locale) : getFieldLabel('no', locale))
    : value;

  return (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{displayValue}</span>
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

export function RentalSections({ vm, locale }: RentalSectionsProps) {
  // Check if features exist
  const hasBalcony = vm.features?.find(f => 
    f.label.toLowerCase().includes('parveke') || 
    f.label.toLowerCase().includes('balkong') ||
    f.label.toLowerCase().includes('terrace')
  )?.value;
  const hasSauna = vm.features?.find(f => f.label.toLowerCase().includes('sauna'))?.value;

  return (
    <div>
      {/* Huoneistotiedot (Apartment Details) */}
      <Section title={getSectionLabel('rental.unit', locale)}>
        <Field 
          label={getFieldLabel('floor', locale)} 
          value={vm.floor && vm.floorsTotal ? `${vm.floor}/${vm.floorsTotal}` : vm.floor} 
          alwaysShow 
          locale={locale} 
        />
        <Field label={getFieldLabel('condition', locale)} value={vm.condition} alwaysShow locale={locale} />
        {/* Show balcony/terrace ONLY if "Yes" */}
        {hasBalcony && (
          <Field 
            label={getFieldLabel('balcony', locale) + ' / ' + getFieldLabel('terrace', locale)} 
            value={getFieldLabel('yes', locale)} 
            locale={locale}
          />
        )}
        {/* Show sauna ONLY if "Yes" */}
        {hasSauna && (
          <Field 
            label={getFieldLabel('sauna', locale)} 
            value={getFieldLabel('yes', locale)} 
            locale={locale}
          />
        )}
      </Section>

      {/* Vuokratiedot (Rental Terms) */}
      <Section title={getSectionLabel('rental.rentInfo', locale)}>
        <Field label={getFieldLabel('contractType', locale)} value={vm.rental?.contractType} alwaysShow locale={locale} />
        <Field label={getFieldLabel('availableFrom', locale)} value={vm.availableFrom} alwaysShow locale={locale} />
        <Field label={getFieldLabel('noticePeriod', locale)} value={vm.rental?.noticePeriod} locale={locale} />
        {/* Show pets/smoking ONLY if field is filled (Ja/Nej) */}
        {vm.rental?.petsAllowed !== undefined && (
          <Field label={getFieldLabel('petsAllowed', locale)} value={vm.rental.petsAllowed} locale={locale} />
        )}
        {vm.rental?.smokingAllowed !== undefined && (
          <Field label={getFieldLabel('smokingAllowed', locale)} value={vm.rental.smokingAllowed} locale={locale} />
        )}
      </Section>

      {/* Taloyhtiötiedot - LINUS SPEC: DÖLJ bolagslån/kiinnitykset/tontin omistus/hallintamuoto */}
      <Section title={getSectionLabel('rental.companyBuilding', locale)}>
        <Field label={getFieldLabel('companyName', locale)} value={vm.housingCompanyName} alwaysShow locale={locale} />
        <Field label={getFieldLabel('yearBuilt', locale)} value={vm.yearBuilt} alwaysShow locale={locale} />
        <Field 
          label={getFieldLabel('energyClass', locale)} 
          value={vm.energyClass || (vm.energyCertStatus === 'NOT_REQUIRED_BY_LAW' ? getFieldLabel('energy.notRequired', locale) : undefined)}
          alwaysShow 
          locale={locale} 
        />
        <Field label={getFieldLabel('energyCertificate', locale)} value={vm.energyCertStatus} alwaysShow locale={locale} />
        <Field label={getFieldLabel('elevator', locale)} value={vm.hasElevator} alwaysShow locale={locale} />
        <Field label={getFieldLabel('heatingSystem', locale)} value={vm.heatingSystem} locale={locale} />
        {/* LINUS: NO companyLoans, plotOwnership, housingTenure for rentals! */}
      </Section>

      {/* Kustannukset (Costs) */}
      <Section title={getSectionLabel('rental.costs', locale)}>
        <Field label={getFieldLabel('monthlyRent', locale)} value={vm.rental?.monthlyRent} alwaysShow locale={locale} />
        <Field label={getFieldLabel('securityDeposit', locale)} value={vm.rental?.securityDeposit} alwaysShow locale={locale} />
        <Field label={getFieldLabel('waterFee', locale)} value={vm.fees?.water} locale={locale} />
        <Field label={getFieldLabel('electricityFee', locale)} value={vm.fees?.electricity} locale={locale} />
        <Field label={getFieldLabel('otherPayments', locale)} value={vm.rental?.additionalCostInfo} locale={locale} />
      </Section>
    </div>
  );
}

