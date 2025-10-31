'use client';

import { getSectionLabel, getFieldLabel } from '@/lib/i18n/property-translations';
import { fmtPerM2 } from '@/lib/presentation/formatters/perSquareMeter';
import { nonEmpty } from '@/lib/presentation/formatters/number';
import { getEnergyStatusLabel } from '@/lib/domain/energy';
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
}

function Field({ label, value, sub, alwaysShow = false }: FieldProps) {
  // Hide if no value and not marked as "always show"
  if (!alwaysShow && (value === undefined || value === null || value === '')) return null;
  
  // Handle boolean values and empty values
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

export function ApartmentSections({ vm, locale }: ApartmentSectionsProps) {
  // Extract numeric values for per m² calculations
  const salesPriceNum = vm.price ? parseInt(vm.price.replace(/[^0-9]/g, '')) : undefined;
  const debtFreePriceNum = vm.priceDebtFree ? parseInt(vm.priceDebtFree.replace(/[^0-9]/g, '')) : undefined;
  const debtPartNum = salesPriceNum && debtFreePriceNum ? salesPriceNum - debtFreePriceNum : undefined;
  const livingAreaNum = vm.area ? parseInt(vm.area.replace(/[^0-9]/g, '')) : undefined;

  // Calculate total fees (sum of maintenance + financing + other fees, NOT water/electricity)
  const maintenanceNum = vm.fees?.maintenance ? parseInt(vm.fees.maintenance.replace(/[^0-9]/g, '')) : 0;
  const financingNum = vm.fees?.financing ? parseInt(vm.fees.financing.replace(/[^0-9]/g, '')) : 0;
  const totalFeesNum = maintenanceNum + financingNum;
  const totalFees = totalFeesNum > 0 ? `${totalFeesNum} €/kk` : undefined;

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
          value={vm.features?.find(f => f.label.toLowerCase().includes('parveke') || f.label.toLowerCase().includes('balkong'))?.value ? getFieldLabel('yes', locale) : undefined}
        />
        <Field 
          label={getFieldLabel('sauna', locale)} 
          value={vm.features?.find(f => f.label.toLowerCase().includes('sauna'))?.value ? getFieldLabel('yes', locale) : undefined}
        />
      </Section>

      {/* Yhtiö- ja Rakennustiedot - LINUS SPEC: EN ruta, Hissi här, bolagslån/kiinnitykset endast om data */}
      <Section title={getSectionLabel('apartment.companyBuilding', locale)}>
        <Field label={getFieldLabel('yearBuilt', locale)} value={vm.yearBuilt} alwaysShow />
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
        <Field label={getFieldLabel('elevator', locale)} value={vm.hasElevator} alwaysShow />
        <Field label={getFieldLabel('companyName', locale)} value={vm.housingCompanyName} alwaysShow />
        <Field label={getFieldLabel('plotOwnership', locale)} value={vm.plotOwnership} alwaysShow />
        <Field label={getFieldLabel('housingTenure', locale)} value={vm.housingTenure} alwaysShow />
        <Field label={getFieldLabel('heatingSystem', locale)} value={vm.heatingSystem} />
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
            sub={fmtPerM2(debtFreePriceNum, livingAreaNum, locale)}
            alwaysShow 
          />
          <Field 
            label={getFieldLabel('salesPrice', locale)} 
            value={vm.price}
            sub={fmtPerM2(salesPriceNum, livingAreaNum, locale)}
            alwaysShow 
          />
          <Field 
            label={getFieldLabel('debtPart', locale)} 
            value={debtPartNum ? `${debtPartNum} €` : undefined}
          />
        </SubSection>

        {/* Asumiskustannukset */}
        <SubSection title={getSectionLabel('apartment.housingCosts', locale)}>
          <Field 
            label={getFieldLabel('maintenanceFee', locale)} 
            value={vm.fees?.maintenance}
            sub={fmtPerM2(maintenanceNum, livingAreaNum, locale)}
          />
          <Field 
            label={getFieldLabel('financingFee', locale)} 
            value={vm.fees?.financing}
            sub={fmtPerM2(financingNum, livingAreaNum, locale)}
          />
          <Field 
            label={getFieldLabel('otherFees', locale)} 
            value={undefined} // TODO: Add if available in data
          />
          <Field 
            label={getFieldLabel('totalFees', locale)} 
            value={totalFees}
            sub={fmtPerM2(totalFeesNum, livingAreaNum, locale)}
          />
          <Field 
            label={getFieldLabel('waterFee', locale)} 
            value={vm.fees?.water}
            sub={fmtPerM2(vm.fees?.water ? parseInt(vm.fees.water.replace(/[^0-9]/g, '')) : 0, livingAreaNum, locale)}
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
        <Field label={getFieldLabel('availableFrom', locale)} value={vm.availableFrom} alwaysShow />
        <Field label={getFieldLabel('ownershipType', locale)} value={vm.ownershipType} alwaysShow />
        <Field label={getFieldLabel('zoning', locale)} value={vm.zoning} alwaysShow />
      </Section>

      {/* Asiakirjat & Linkit */}
      <Section title={getSectionLabel('apartment.docs', locale)}>
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

