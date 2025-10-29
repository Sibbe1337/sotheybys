'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useActiveTab, useTabRouting } from './DetailTabs';
import { RichText } from '@/lib/presentation/components/RichText';
import { cleanAgentData } from '@/lib/domain/agent-utils';
import { fmtCurrency } from '@/lib/presentation/formatters/currency';
import { fmtArea } from '@/lib/presentation/formatters/area';
import { getAllTabs, getFieldLabel, getSectionLabel } from '@/lib/i18n/property-translations';
import { getPlaceholder, lpickWithIndicator } from '@/lib/domain/locale-utils';
import { AutoTranslateBanner } from '@/components/AutoTranslateBanner';

type VM = import('@/lib/presentation/property.view-model').PropertyDetailVM;
type Locale = 'fi' | 'sv' | 'en';
type Props = { vm: VM; locale: Locale };

const MapView = dynamic(() => import('./MapView').then(m => m.MapView), { ssr: false });

export function DetailView({ vm, locale }: Props) {
  const tab = useActiveTab('overview');
  const setTab = useTabRouting();

  // Type | Huoneistoselitelmä under images/address
  // ✅ SPEC FIX: Use localized listing type label from ViewModel
  const typePrefix = vm.subtitle.split(' • ')[0] || ''; // Extract type from subtitle
  const aptLine = [typePrefix, vm.apartmentType].filter(Boolean).join(' | ');

  const agent = cleanAgentData(vm.agent || {});
  
  // ✅ SPEC FIX: Tabs from i18n JSON files
  const tabs = getAllTabs(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      {!!vm.images?.length && (
        <section className="relative h-[60vh] bg-black">
          <Image 
            src={vm.images[0].url} 
            alt={vm.title} 
            fill 
            className="object-cover" 
            priority 
          />
        </section>
      )}

      {/* Under hero: address, type | huoneistoselitelmä */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-light text-gray-900 mb-2">{vm.title}</h1>
          <p className="text-lg text-gray-600 mb-2">{vm.city}, {vm.postalCode}</p>
          {aptLine && <p className="text-lg text-gray-900 mb-4">{aptLine}</p>}
          {/* Description (sanitized) */}
          {vm.description && (
            <div className="prose prose-gray max-w-none">
              <RichText html={vm.description} />
            </div>
          )}
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map(([id, label]) => (
              <button 
                key={id} 
                onClick={() => setTab(id)}
                className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  tab === id 
                    ? 'border-[#002349] text-[#002349] font-medium' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content + sidebar */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {tab === 'overview' && <Overview vm={vm} locale={locale} />}
            {tab === 'apartment' && <ApartmentInfo vm={vm} locale={locale} />}
            {tab === 'company' && <CompanyAndBuilding vm={vm} locale={locale} />}
            {tab === 'costs' && <Costs vm={vm} locale={locale} />}
            {tab === 'other' && <OtherInfo vm={vm} locale={locale} />}
            {tab === 'documents' && <Documents vm={vm} locale={locale} />}
            {tab === 'map' && <MapView vm={vm} />}
          </div>

          {/* Sidebar: Agent + Key Info */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-none shadow-sm p-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 block">
                    {locale === 'sv' ? 'Försäljningspris' : locale === 'en' ? 'Sales Price' : 'Myyntihinta'}
                  </span>
                  <span className="text-2xl font-light text-gray-900">{vm.price}</span>
                </div>
                {vm.priceDebtFree && (
                  <div>
                    <span className="text-sm text-gray-600 block">
                      {locale === 'sv' ? 'Skuldfritt pris' : locale === 'en' ? 'Debt-free Price' : 'Velaton hinta'}
                    </span>
                    <span className="text-xl font-light text-gray-900">{vm.priceDebtFree}</span>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600 block">
                    {locale === 'sv' ? 'Yta' : locale === 'en' ? 'Area' : 'Pinta-ala'}
                  </span>
                  <span className="text-xl font-light text-gray-900">{vm.area}</span>
                </div>
              </div>
            </div>

            {/* Agent Card */}
            {(agent.name || agent.phone || agent.email) && (
              <div className="bg-white rounded-none shadow-sm p-6">
                <h3 className="text-xl font-light mb-4">
                  {locale === 'sv' ? 'Mäklaren' : locale === 'en' ? 'Agent' : 'Välittäjä'}
                </h3>
                {agent.photoUrl && (
                  <div className="flex justify-center mb-3">
                    <Image 
                      src={agent.photoUrl} 
                      alt={agent.name || 'Agent'} 
                      width={120} 
                      height={120} 
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                {agent.name && <p className="text-center font-medium mb-1">{agent.name}</p>}
                {agent.title && <p className="text-center text-sm text-gray-600 mb-3">{agent.title}</p>}
                <div className="space-y-2">
                  {agent.phone && (
                    <a 
                      href={`tel:${agent.phone}`} 
                      className="block bg-[#0A2B49] text-white text-center py-2 rounded-none hover:bg-[#002349] transition-colors"
                    >
                      {agent.phone}
                    </a>
                  )}
                  {agent.email && (
                    <a 
                      href={`mailto:${agent.email}`} 
                      className="block border border-gray-300 text-center py-2 rounded-none hover:border-[#002349] hover:text-[#002349] transition-colors"
                    >
                      {locale === 'sv' ? 'Skicka e-post' : locale === 'en' ? 'Send email' : 'Lähetä sähköposti'}
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}

/* ------- Helper component for consistent row display ------- */
/**
 * Row component with support for always-visible fields (per spec)
 * 
 * @param label - Field label
 * @param value - Field value
 * @param alwaysVisible - If true, shows placeholder when value is empty (per spec requirement)
 * @param locale - Current locale for placeholder text
 */
function Row({ 
  label, 
  value, 
  alwaysVisible = false, 
  locale = 'fi' 
}: { 
  label: string; 
  value?: string | number | boolean; 
  alwaysVisible?: boolean;
  locale?: Locale;
}) {
  // Hide if not always-visible and value is empty
  if (!alwaysVisible && (value === undefined || value === null || value === '')) {
    return null;
  }
  
  // Determine display value
  const hasValue = value !== undefined && value !== null && value !== '';
  const displayValue = hasValue ? String(value) : getPlaceholder(locale);
  
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium ${hasValue ? 'text-gray-900' : 'text-gray-400 italic'}`}>
        {displayValue}
      </span>
    </div>
  );
}

/* ------- Tab Content Sections ------- */

function Overview({ vm, locale }: Props) {
  return (
    <div className="space-y-6">
      {/* Gallery */}
      {vm.images?.length > 0 && (
        <div className="bg-white rounded-none shadow-sm p-6">
          <h3 className="text-xl font-light mb-4">
            {locale === 'sv' ? 'Bilder' : locale === 'en' ? 'Images' : 'Kuvat'}
          </h3>
          <div className="grid md:grid-cols-3 gap-2">
            {vm.images.slice(0, 9).map((img, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-none">
                <Image 
                  src={img.url} 
                  alt={`${vm.title} - Image ${i + 1}`} 
                  fill 
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Features */}
      <div className="bg-white rounded-none shadow-sm p-6">
        <h3 className="text-xl font-light mb-4">
          {locale === 'sv' ? 'Snabbfakta' : locale === 'en' ? 'Key Features' : 'Perustiedot'}
        </h3>
        <div className="space-y-2">
          <Row label={locale === 'sv' ? 'Pris' : locale === 'en' ? 'Price' : 'Hinta'} value={vm.price} />
          {vm.priceDebtFree && <Row label={locale === 'sv' ? 'Skuldfritt pris' : locale === 'en' ? 'Debt-free Price' : 'Velaton hinta'} value={vm.priceDebtFree} />}
          <Row label={locale === 'sv' ? 'Yta' : locale === 'en' ? 'Area' : 'Pinta-ala'} value={vm.area} />
          {vm.areaExtra && <Row label={locale === 'sv' ? 'Total yta' : locale === 'en' ? 'Total Area' : 'Kokonaispinta-ala'} value={vm.areaExtra} />}
          {vm.yearBuilt && <Row label={locale === 'sv' ? 'Byggår' : locale === 'en' ? 'Year Built' : 'Rakennusvuosi'} value={vm.yearBuilt} />}
          {vm.energyClass && <Row label={locale === 'sv' ? 'Energiklass' : locale === 'en' ? 'Energy Class' : 'Energialuokka'} value={vm.energyClass} />}
        </div>
      </div>
    </div>
  );
}

function ApartmentInfo({ vm, locale }: Props) {
  return (
    <div className="bg-white rounded-none shadow-sm p-6">
      <h3 className="text-xl font-light mb-4">
        {getSectionLabel('apartmentInfo', locale)}
      </h3>
      <div className="space-y-2">
        <Row 
          label={getFieldLabel('apartmentType', locale)} 
          value={vm.apartmentType} 
          locale={locale}
        />
        <Row 
          label={getFieldLabel('rooms', locale)} 
          value={vm.rooms} 
          locale={locale}
        />
        {vm.bedrooms && (
          <Row 
            label={getFieldLabel('bedrooms', locale)} 
            value={vm.bedrooms} 
            locale={locale}
          />
        )}
        {vm.bathrooms && (
          <Row 
            label={getFieldLabel('bathrooms', locale)} 
            value={vm.bathrooms} 
            locale={locale}
          />
        )}
        {/* ✅ SPEC: Floor is always-visible */}
        <Row 
          label={getFieldLabel('floor', locale)} 
          value={vm.floor} 
          alwaysVisible
          locale={locale}
        />
        <Row 
          label={getFieldLabel('area', locale)} 
          value={vm.area} 
          locale={locale}
        />
        {vm.areaExtra && (
          <Row 
            label={getFieldLabel('totalArea', locale)} 
            value={vm.areaExtra} 
            locale={locale}
          />
        )}
        {vm.balconyArea && (
          <Row 
            label={getFieldLabel('balconyArea', locale)} 
            value={vm.balconyArea} 
            locale={locale}
          />
        )}
        {vm.terraceArea && (
          <Row 
            label={getFieldLabel('terraceArea', locale)} 
            value={vm.terraceArea} 
            locale={locale}
          />
        )}
      </div>
    </div>
  );
}

function CompanyAndBuilding({ vm, locale }: Props) {
  const localeStr = locale === 'sv' ? 'sv-SE' : locale === 'en' ? 'en-GB' : 'fi-FI';
  
  // ✅ SPEC: Elevator value formatting
  const elevatorValue = vm.hasElevator 
    ? getFieldLabel('yes', locale)
    : (vm.hasElevator === false ? getFieldLabel('no', locale) : undefined);
  
  return (
    <div className="bg-white rounded-none shadow-sm p-6">
      <h3 className="text-xl font-light mb-4">
        {getSectionLabel('companyAndBuilding', locale)}
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">
            {getSectionLabel('buildingInfo', locale)}
          </h4>
          {/* ✅ SPEC: Always-visible fields show placeholder if empty */}
          <Row 
            label={getFieldLabel('yearBuilt', locale)} 
            value={vm.yearBuilt} 
            alwaysVisible
            locale={locale}
          />
          <Row 
            label={getFieldLabel('energyClass', locale)} 
            value={vm.energyClass} 
            alwaysVisible
            locale={locale}
          />
          <Row 
            label={getFieldLabel('heatingSystem', locale)} 
            value={vm.heatingSystem} 
            alwaysVisible
            locale={locale}
          />
          <Row 
            label={getFieldLabel('ventilationSystem', locale)} 
            value={vm.ventilationSystem} 
            locale={locale}
          />
          <Row 
            label={getFieldLabel('elevator', locale)} 
            value={elevatorValue} 
            alwaysVisible
            locale={locale}
          />
          {vm.floorsTotal && (
            <Row 
              label={getFieldLabel('floorsTotal', locale)} 
              value={vm.floorsTotal} 
              locale={locale}
            />
          )}
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">
            {getSectionLabel('companyInfo', locale)}
          </h4>
          {/* ✅ SPEC: Company name, loans, encumbrances always visible */}
          <Row 
            label={getFieldLabel('companyName', locale)} 
            value={vm.housingCompanyName} 
            alwaysVisible
            locale={locale}
          />
          <Row 
            label={getFieldLabel('companyLoans', locale)} 
            value={vm.companyLoans != null ? fmtCurrency(vm.companyLoans, localeStr) : undefined} 
            alwaysVisible
            locale={locale}
          />
          <Row 
            label={getFieldLabel('companyEncumbrances', locale)} 
            value={vm.companyEncumbrances != null ? fmtCurrency(vm.companyEncumbrances, localeStr) : undefined} 
            alwaysVisible
            locale={locale}
          />
          {vm.companyLoansDate && (
            <Row 
              label={getFieldLabel('companyLoansDate', locale)} 
              value={vm.companyLoansDate} 
              locale={locale}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Costs({ vm, locale }: Props) {
  const hasFees = vm.fees.maintenance || vm.fees.financing || vm.fees.water || 
                  vm.fees.heating || vm.fees.electricity || vm.fees.parking || vm.fees.sauna;
  
  return (
    <div className="bg-white rounded-none shadow-sm p-6">
      <h3 className="text-xl font-light mb-4">
        {locale === 'sv' ? 'Kostnader' : locale === 'en' ? 'Costs' : 'Kustannukset'}
      </h3>
      
      {/* Purchase Price */}
      <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">
          {locale === 'sv' ? 'Köpeskilling' : locale === 'en' ? 'Purchase Price' : 'Kauppahinta'}
        </h4>
        <Row 
          label={locale === 'sv' ? 'Försäljningspris' : locale === 'en' ? 'Sales Price' : 'Myyntihinta'} 
          value={vm.price} 
        />
        {vm.priceDebtFree && (
          <Row 
            label={locale === 'sv' ? 'Skuldfritt pris' : locale === 'en' ? 'Debt-free Price' : 'Velaton hinta'} 
            value={vm.priceDebtFree} 
          />
        )}
      </div>
      
      {/* Monthly Fees */}
      {hasFees && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">
            {locale === 'sv' ? 'Månatliga avgifter' : locale === 'en' ? 'Monthly Fees' : 'Kuukausittaiset kulut'}
          </h4>
          {vm.fees.maintenance && (
            <Row 
              label={locale === 'sv' ? 'Underhållsavgift' : locale === 'en' ? 'Maintenance Fee' : 'Hoitovastike'} 
              value={vm.fees.maintenance} 
            />
          )}
          {vm.fees.financing && (
            <Row 
              label={locale === 'sv' ? 'Finansieringsavgift' : locale === 'en' ? 'Financing Fee' : 'Rahoitusvastike'} 
              value={vm.fees.financing} 
            />
          )}
          {vm.fees.water && (
            <Row 
              label={locale === 'sv' ? 'Vattenavgift' : locale === 'en' ? 'Water Fee' : 'Vesimaksu'} 
              value={vm.fees.water} 
            />
          )}
          {vm.fees.heating && (
            <Row 
              label={locale === 'sv' ? 'Uppvärmningsavgift' : locale === 'en' ? 'Heating Fee' : 'Lämmitysmaksu'} 
              value={vm.fees.heating} 
            />
          )}
          {vm.fees.electricity && (
            <Row 
              label={locale === 'sv' ? 'Elavgift' : locale === 'en' ? 'Electricity Fee' : 'Sähkömaksu'} 
              value={vm.fees.electricity} 
            />
          )}
          {vm.fees.parking && (
            <Row 
              label={locale === 'sv' ? 'Parkeringsavgift' : locale === 'en' ? 'Parking Fee' : 'Autopaikkamaksu'} 
              value={vm.fees.parking} 
            />
          )}
          {vm.fees.sauna && (
            <Row 
              label={locale === 'sv' ? 'Bastuavgift' : locale === 'en' ? 'Sauna Fee' : 'Saunamaksu'} 
              value={vm.fees.sauna} 
            />
          )}
          {vm.fees.total && (
            <Row 
              label={locale === 'sv' ? 'Totalt per månad' : locale === 'en' ? 'Total per Month' : 'Yhteensä / kk'} 
              value={vm.fees.total} 
            />
          )}
        </div>
      )}
      
      {/* Rental Info */}
      {vm.rental && (
        <div className="space-y-2 mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">
            {locale === 'sv' ? 'Hyresinformation' : locale === 'en' ? 'Rental Information' : 'Vuokratiedot'}
          </h4>
          <Row 
            label={locale === 'sv' ? 'Månadshyra' : locale === 'en' ? 'Monthly Rent' : 'Vuokra / kk'} 
            value={vm.rental.monthlyRent} 
          />
          {vm.rental.securityDeposit && (
            <Row 
              label={locale === 'sv' ? 'Depositionsavgift' : locale === 'en' ? 'Security Deposit' : 'Vakuus'} 
              value={vm.rental.securityDeposit} 
            />
          )}
          {vm.rental.contractType && (
            <Row 
              label={locale === 'sv' ? 'Avtalstyp' : locale === 'en' ? 'Contract Type' : 'Sopimuksen tyyppi'} 
              value={vm.rental.contractType} 
            />
          )}
          {vm.rental.earliestTermination && (
            <Row 
              label={locale === 'sv' ? 'Tidigaste uppsägning' : locale === 'en' ? 'Earliest Termination' : 'Aikaisin irtisanominen'} 
              value={vm.rental.earliestTermination} 
            />
          )}
          {vm.rental.petsAllowed !== undefined && (
            <Row 
              label={locale === 'sv' ? 'Husdjur tillåtna' : locale === 'en' ? 'Pets Allowed' : 'Lemmikit sallittu'} 
              value={vm.rental.petsAllowed 
                ? (locale === 'sv' ? 'Ja' : locale === 'en' ? 'Yes' : 'Kyllä')
                : (locale === 'sv' ? 'Nej' : locale === 'en' ? 'No' : 'Ei')
              } 
            />
          )}
          {vm.rental.smokingAllowed !== undefined && (
            <Row 
              label={locale === 'sv' ? 'Rökning tillåten' : locale === 'en' ? 'Smoking Allowed' : 'Tupakointi sallittu'} 
              value={vm.rental.smokingAllowed 
                ? (locale === 'sv' ? 'Ja' : locale === 'en' ? 'Yes' : 'Kyllä')
                : (locale === 'sv' ? 'Nej' : locale === 'en' ? 'No' : 'Ei')
              } 
            />
          )}
        </div>
      )}
    </div>
  );
}

function OtherInfo({ vm, locale }: Props) {
  const hasFeatures = vm.features && vm.features.some(f => f.value);
  
  return (
    <div className="space-y-6">
      {/* Legal & Ownership */}
      <div className="bg-white rounded-none shadow-sm p-6">
        <h3 className="text-xl font-light mb-4">
          {getSectionLabel('ownershipAndTerms', locale)}
        </h3>
        <div className="space-y-2">
          <Row 
            label={getFieldLabel('ownershipType', locale)} 
            value={vm.ownershipType} 
            locale={locale}
          />
          {/* ✅ SPEC: Lot ownership is always-visible */}
          <Row 
            label={getFieldLabel('lotOwnership', locale)} 
            value={vm.plotOwnership} 
            alwaysVisible
            locale={locale}
          />
          {/* ✅ SPEC: Housing tenure is always-visible */}
          <Row 
            label={getFieldLabel('housingTenure', locale)} 
            value={vm.housingTenure} 
            alwaysVisible
            locale={locale}
          />
          <Row 
            label={getFieldLabel('availableFrom', locale)} 
            value={vm.availableFrom} 
            locale={locale}
          />
          {/* ✅ SPEC: Zoning is always-visible */}
          <Row 
            label={getFieldLabel('zoning', locale)} 
            value={vm.zoning} 
            alwaysVisible
            locale={locale}
          />
        </div>
      </div>
      
      {/* Features */}
      {hasFeatures && (
        <div className="bg-white rounded-none shadow-sm p-6">
          <h3 className="text-xl font-light mb-4">
            {locale === 'sv' ? 'Egenskaper' : locale === 'en' ? 'Features' : 'Ominaisuudet'}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {vm.features.map((feature, i) => (
              <div 
                key={i} 
                className={`flex items-center space-x-2 ${feature.value ? 'text-gray-900' : 'text-gray-400'}`}
              >
                <span className={`text-lg ${feature.value ? 'text-green-600' : 'text-gray-300'}`}>
                  {feature.value ? '✓' : '✗'}
                </span>
                <span className={feature.value ? 'font-medium' : ''}>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Documents({ vm, locale }: Props) {
  const hasDocuments = vm.documents.floorPlan || vm.documents.brochure || 
                       vm.documents.brochureIntl || vm.documents.video || 
                       vm.documents.energyCert;
  
  return (
    <div className="bg-white rounded-none shadow-sm p-6">
      <h3 className="text-xl font-light mb-4">
        {locale === 'sv' ? 'Dokument & Länkar' : locale === 'en' ? 'Documents & Links' : 'Asiakirjat & Linkit'}
      </h3>
      
      {hasDocuments ? (
        <div className="space-y-3">
          {vm.documents.floorPlan && (
            <a 
              href={vm.documents.floorPlan} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border border-gray-200 hover:border-[#002349] hover:bg-gray-50 transition-colors rounded-none"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">
                  {locale === 'sv' ? 'Planlösning' : locale === 'en' ? 'Floor Plan' : 'Pohjapiirros'}
                </span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          
          {vm.documents.brochure && (
            <a 
              href={vm.documents.brochure} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border border-gray-200 hover:border-[#002349] hover:bg-gray-50 transition-colors rounded-none"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-medium">
                  {locale === 'sv' ? 'Objektsbroschyr' : locale === 'en' ? 'Property Brochure' : 'Esittelyaineisto'}
                </span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          
          {vm.documents.brochureIntl && (
            <a 
              href={vm.documents.brochureIntl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border border-gray-200 hover:border-[#002349] hover:bg-gray-50 transition-colors rounded-none"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                <span className="font-medium">
                  {locale === 'sv' ? 'Internationell broschyr' : locale === 'en' ? 'International Brochure' : 'Kansainvälinen esite'}
                </span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          
          {vm.documents.energyCert && (
            <a 
              href={vm.documents.energyCert} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border border-gray-200 hover:border-[#002349] hover:bg-gray-50 transition-colors rounded-none"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium">
                  {locale === 'sv' ? 'Energicertifikat' : locale === 'en' ? 'Energy Certificate' : 'Energiatodistus'}
                </span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          
          {vm.documents.video && (
            <a 
              href={vm.documents.video} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border border-gray-200 hover:border-[#002349] hover:bg-gray-50 transition-colors rounded-none"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">
                  {locale === 'sv' ? 'Videovisning' : locale === 'en' ? 'Video Tour' : 'Video-esittely'}
                </span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">
          {locale === 'sv' 
            ? 'Inga dokument tillgängliga för närvarande' 
            : locale === 'en'
            ? 'No documents available at this time'
            : 'Ei asiakirjoja saatavilla tällä hetkellä'}
        </p>
      )}
    </div>
  );
}

