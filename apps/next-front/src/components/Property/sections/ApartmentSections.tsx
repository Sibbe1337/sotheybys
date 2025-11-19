'use client';

import { getSectionLabel, getFieldLabel } from '@/lib/i18n/property-translations';
import { fmtPerM2 } from '@/lib/presentation/formatters/perSquareMeter';
import { fmtFee } from '@/lib/presentation/formatters/fees';
import { nonEmpty } from '@/lib/presentation/formatters/number';
import { getEnergyStatusLabel } from '@/lib/domain/energy';
import { translateBoolean, translateCommonTerm } from '@/lib/presentation/common-terms';
import type { Locale } from '@/lib/domain/property.types';
import type { PropertyDetailVM } from '@/lib/presentation/property.view-model';
import type { EnergyStatus } from '@/lib/domain/energy';

interface ApartmentSectionsProps {
  vm: PropertyDetailVM;
  locale: Locale;
}

interface FieldProps {
  label: string;
  value?: string | number | boolean;
  sub?: string;
  alwaysShow?: boolean;
  locale?: Locale;
}

function Field({ label, value, sub, alwaysShow = false, locale = 'fi' }: FieldProps) {
  // Early return if no value and not required to show
  if (!alwaysShow && (value === undefined || value === null || value === '' || (typeof value === 'number' && (isNaN(value) || value === 0)))) {
    return null;
  }
  
  // Handle display value
  let displayValue: string | number | undefined;
  if (typeof value === 'boolean') {
    displayValue = translateBoolean(value, locale);
  } else if (value === undefined || value === null || value === '' || (typeof value === 'number' && (isNaN(value) || value === 0))) {
    // Show default text for alwaysShow fields with no/invalid data
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
    <div className="bg-white rounded-none shadow-sm p-6 mb-6">
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

export function ApartmentSections({ vm, locale }: ApartmentSectionsProps) {
  // Map locale for formatters
  const localeStr = locale === 'sv' ? 'sv-SE' : locale === 'en' ? 'en-GB' : 'fi-FI';
  
  // Extract numeric values for per m² calculations
  const salesPriceNum = parseEuropeanNumber(vm.price);
  const debtFreePriceNum = parseEuropeanNumber(vm.priceDebtFree);
  // Dennis: Skuldandel should ALWAYS be POSITIVE
  // Formula: debtPart = debtFree - sales (if debtFree > sales, show positive difference)
  const debtPartNum = salesPriceNum && debtFreePriceNum ? Math.abs(debtFreePriceNum - salesPriceNum) : undefined;
  const livingAreaNum = parseEuropeanNumber(vm.area);

  // Calculate total fees (sum of maintenance + financing + other fees, NOT water/electricity)
  const maintenanceNum = parseEuropeanNumber(vm.fees?.maintenance) || 0;
  const financingNum = parseEuropeanNumber(vm.fees?.financing) || 0;
  const totalFeesNum = maintenanceNum + financingNum;
  
  // Dennis 2025-11-10: DEBUG - Log fees to see if they exist
  if (typeof window !== 'undefined') {
    console.log('[FEES DEBUG]', {
      locale,
      maintenance: vm.fees?.maintenance,
      financing: vm.fees?.financing,
      maintenanceNum,
      financingNum,
      totalFeesNum
    });
  }
  
  // Dennis: Use fmtFee for localized suffix (€/kk → €/månad → €/month)
  const totalFees = totalFeesNum > 0 ? fmtFee(totalFeesNum, localeStr) : undefined;

  return (
    <div>
      {/* Huoneistotiedot */}
      <Section title={getSectionLabel('apartment.unit', locale)}>
        <Field 
          label={getFieldLabel('floor', locale)} 
          value={vm.floor && vm.floorsTotal ? `${vm.floor}/${vm.floorsTotal}` : vm.floor}
          alwaysShow 
        />
        <Field 
          label={getFieldLabel('balcony', locale)} 
          value={vm.features?.find(f => f.label.toLowerCase().includes('parveke') || f.label.toLowerCase().includes('balkong') || f.label.toLowerCase().includes('balcony'))?.value ? getFieldLabel('yes', locale) : undefined}
        />
        <Field 
          label={getFieldLabel('sauna', locale)} 
          value={vm.features?.find(f => f.label.toLowerCase().includes('sauna'))?.value ? getFieldLabel('yes', locale) : undefined}
        />
      </Section>

      {/* Yhtiö- ja Rakennustiedot - LINUS SPEC: EN ruta, Hissi här, bolagslån/kiinnitykset endast om data */}
      <Section title={getSectionLabel('apartment.companyBuilding', locale)}>
        <Field label={getFieldLabel('yearBuilt', locale)} value={vm.yearBuilt} alwaysShow locale={locale} />
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
        <Field label={getFieldLabel('elevator', locale)} value={vm.hasElevator} alwaysShow locale={locale} />
        <Field label={getFieldLabel('companyName', locale)} value={vm.housingCompanyName} alwaysShow locale={locale} />
        <Field label={getFieldLabel('plotOwnership', locale)} value={vm.plotOwnership} alwaysShow locale={locale} />
        <Field label={getFieldLabel('housingTenure', locale)} value={vm.housingTenure} alwaysShow locale={locale} />
        <Field label={getFieldLabel('heatingSystem', locale)} value={vm.heatingSystem} locale={locale} />
        {/* Company loans/mortgages - only if data exists */}
        <Field label={getFieldLabel('companyLoans', locale)} value={vm.companyLoans ? `${vm.companyLoans} €` : undefined} />
        <Field label={getFieldLabel('companyMortgages', locale)} value={vm.companyEncumbrances ? `${vm.companyEncumbrances} €` : undefined} />
      </Section>

      {/* Kustannukset */}
      <Section title={getSectionLabel('apartment.costs', locale)}>
        {/* Hintatiedot */}
        <SubSection title={getSectionLabel('apartment.priceInfo', locale)}>
          <Field 
            label={getFieldLabel('debtFreePrice', locale)} 
            value={vm.priceDebtFree}
            alwaysShow 
          />
          <Field 
            label={getFieldLabel('salesPrice', locale)} 
            value={vm.price}
            alwaysShow 
          />
          <Field 
            label={getFieldLabel('debtPart', locale)} 
            value={debtPartNum && debtPartNum > 0 ? `${Math.abs(debtPartNum).toLocaleString(localeStr)} €` : undefined}
          />
        </SubSection>

        {/* Asumiskustannukset */}
        <SubSection title={getSectionLabel('apartment.housingCosts', locale)}>
          <Field 
            label={getFieldLabel('maintenanceFee', locale)} 
            value={vm.fees?.maintenance}
            sub={fmtPerM2(maintenanceNum, livingAreaNum, localeStr)}
          />
          <Field 
            label={getFieldLabel('financingFee', locale)} 
            value={vm.fees?.financing}
            sub={fmtPerM2(financingNum, livingAreaNum, localeStr)}
          />
          <Field 
            label={getFieldLabel('otherFees', locale)} 
            value={undefined} // TODO: Add if available in data
          />
          <Field 
            label={getFieldLabel('totalFees', locale)} 
            value={totalFees}
          />
          <Field 
            label={getFieldLabel('waterFee', locale)} 
            value={vm.fees?.water}
            // PDF spec s.6: NO €/m² for water fee (uses correct unit like €/kk/hlö instead)
          />
        </SubSection>

        {/* Muut kustannukset */}
        <SubSection title={getSectionLabel('apartment.otherCosts', locale)}>
          <Field 
            label={getFieldLabel('otherPayments', locale)} 
            value={undefined} // TODO: Add if available
          />
        </SubSection>
      </Section>

      {/* Muut tiedot - LINUS SPEC: Vapautuminen + Omistusmuoto här */}
      <Section title={getSectionLabel('apartment.other', locale)}>
        <Field label={getFieldLabel('availableFrom', locale)} value={vm.availableFrom} alwaysShow locale={locale} />
        <Field label={getFieldLabel('ownershipType', locale)} value={vm.ownershipType} alwaysShow locale={locale} />
        <Field label={getFieldLabel('zoning', locale)} value={vm.zoning} alwaysShow locale={locale} />
      </Section>


      {/* Dennis 2025-11-19: Mandatory Legal Disclaimer - Updated text, placed at end after all property info */}
      <div className="mt-6 p-6 bg-gray-50 border-l-4 border-[#002349] text-sm text-gray-800 leading-relaxed">
        <p className="font-medium">
          {locale === 'fi' && 'Tämä ilmoitus ei ole virallinen myyntiesite. Lisätiedot saat välittäjältä.'}
          {locale === 'sv' && 'Denna annons är inte en officiell försäljningsbrochyr. Mer information fås av mäklaren.'}
          {locale === 'en' && 'This listing is not an official sales brochure. For more information, please contact the agent.'}
        </p>
      </div>

      {/* PDF spec s.11: "Asiakirjat & Linkit" block removed - documents available via MediaTabs */}
    </div>
  );
}

