'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useActiveTab, useTabRouting } from './DetailTabs';
import { RichText } from '@/lib/presentation/components/RichText';
import { cleanAgentData } from '@/lib/domain/agent-utils';
import { fmtCurrency } from '@/lib/presentation/formatters/currency';
import { fmtArea } from '@/lib/presentation/formatters/area';

type VM = import('@/lib/presentation/property.view-model').PropertyDetailVM;
type Locale = 'fi' | 'sv' | 'en';
type Props = { vm: VM; locale: Locale };

const MapView = dynamic(() => import('./MapView').then(m => m.MapView), { ssr: false });

export function DetailView({ vm, locale }: Props) {
  const tab = useActiveTab('overview');
  const setTab = useTabRouting();

  // Type | Huoneistoselitelmä under images/address
  const typePrefix = vm.typeCode ? vm.typeCode.replace(/_/g, ' ') : '';
  const aptLine = [typePrefix, vm.apartmentType].filter(Boolean).join(' | ');

  const agent = cleanAgentData(vm.agent || {});
  
  const tabs = [
    ['overview', locale === 'sv' ? 'Översikt' : locale === 'en' ? 'Overview' : 'Yleiskatsaus'],
    ['apartment', locale === 'sv' ? 'Lägenhet' : locale === 'en' ? 'Apartment' : 'Huoneistotiedot'],
    ['company', locale === 'sv' ? 'Bolag & Byggnad' : locale === 'en' ? 'Company & Building' : 'Yhtiö- ja Rakennustiedot'],
    ['costs', locale === 'sv' ? 'Kostnader' : locale === 'en' ? 'Costs' : 'Kustannukset'],
    ['other', locale === 'sv' ? 'Övrig info' : locale === 'en' ? 'Other info' : 'Muut tiedot'],
    ['documents', locale === 'sv' ? 'Dokument' : locale === 'en' ? 'Documents' : 'Asiakirjat & Linkit'],
    ['map', locale === 'sv' ? 'Karta' : locale === 'en' ? 'Map' : 'Kartta']
  ];

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
function Row({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
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
        {locale === 'sv' ? 'Lägenhetsinformation' : locale === 'en' ? 'Apartment Information' : 'Huoneistotiedot'}
      </h3>
      <div className="space-y-2">
        <Row 
          label={locale === 'sv' ? 'Typ' : locale === 'en' ? 'Type' : 'Tyyppi'} 
          value={vm.apartmentType} 
        />
        {/* Add more apartment-specific fields when available in VM */}
      </div>
    </div>
  );
}

function CompanyAndBuilding({ vm, locale }: Props) {
  const localeStr = locale === 'sv' ? 'sv-SE' : locale === 'en' ? 'en-GB' : 'fi-FI';
  
  return (
    <div className="bg-white rounded-none shadow-sm p-6">
      <h3 className="text-xl font-light mb-4">
        {locale === 'sv' ? 'Bolag & Byggnad' : locale === 'en' ? 'Company & Building' : 'Yhtiö- ja Rakennustiedot'}
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">
            {locale === 'sv' ? 'Byggnadsinformation' : locale === 'en' ? 'Building Information' : 'Rakennustiedot'}
          </h4>
          <Row 
            label={locale === 'sv' ? 'Byggår' : locale === 'en' ? 'Year Built' : 'Rakennusvuosi'} 
            value={vm.yearBuilt} 
          />
          <Row 
            label={locale === 'sv' ? 'Energiklass' : locale === 'en' ? 'Energy Class' : 'Energialuokka'} 
            value={vm.energyClass} 
          />
          <Row 
            label={locale === 'sv' ? 'Värmesystem' : locale === 'en' ? 'Heating System' : 'Lämmitysjärjestelmä'} 
            value={vm.heatingSystem} 
          />
          <Row 
            label={locale === 'sv' ? 'Ventilation' : locale === 'en' ? 'Ventilation' : 'Ilmanvaihto'} 
            value={vm.ventilationSystem} 
          />
          <Row 
            label={locale === 'sv' ? 'Hiss' : locale === 'en' ? 'Elevator' : 'Hissi'} 
            value={vm.hasElevator ? (locale === 'sv' ? 'Ja' : locale === 'en' ? 'Yes' : 'Kyllä') : (vm.hasElevator === false ? (locale === 'sv' ? 'Nej' : locale === 'en' ? 'No' : 'Ei') : undefined)} 
          />
          {vm.floorsTotal && (
            <Row 
              label={locale === 'sv' ? 'Antal våningar' : locale === 'en' ? 'Number of Floors' : 'Kerrosten lukumäärä'} 
              value={vm.floorsTotal} 
            />
          )}
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">
            {locale === 'sv' ? 'Bolagsinformation' : locale === 'en' ? 'Company Information' : 'Yhtiötiedot'}
          </h4>
          <Row 
            label={locale === 'sv' ? 'Bolagsnamn' : locale === 'en' ? 'Company Name' : 'Yhtiön nimi'} 
            value={vm.housingCompanyName} 
          />
          {vm.companyLoans != null && (
            <Row 
              label={locale === 'sv' ? 'Bolagets lån' : locale === 'en' ? 'Company Loans' : 'Taloyhtiön lainat'} 
              value={fmtCurrency(vm.companyLoans, localeStr)} 
            />
          )}
          {vm.companyEncumbrances != null && (
            <Row 
              label={locale === 'sv' ? 'Bolagets inteckningar' : locale === 'en' ? 'Company Encumbrances' : 'Taloyhtiön kiinnitykset'} 
              value={fmtCurrency(vm.companyEncumbrances, localeStr)} 
            />
          )}
          {vm.companyLoansDate && (
            <Row 
              label={locale === 'sv' ? 'Lånets datum' : locale === 'en' ? 'Loan Date' : 'Lainan päivämäärä'} 
              value={vm.companyLoansDate} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Costs({ vm, locale }: Props) {
  return (
    <div className="bg-white rounded-none shadow-sm p-6">
      <h3 className="text-xl font-light mb-4">
        {locale === 'sv' ? 'Kostnader' : locale === 'en' ? 'Costs' : 'Kustannukset'}
      </h3>
      <div className="space-y-2">
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
        {/* Add more cost-related fields when available in VM (maintenance fees, etc.) */}
      </div>
    </div>
  );
}

function OtherInfo({ vm, locale }: Props) {
  return (
    <div className="bg-white rounded-none shadow-sm p-6">
      <h3 className="text-xl font-light mb-4">
        {locale === 'sv' ? 'Övrig information' : locale === 'en' ? 'Other Information' : 'Muut tiedot'}
      </h3>
      <div className="space-y-2">
        <Row 
          label={locale === 'sv' ? 'Ägandeform' : locale === 'en' ? 'Ownership Type' : 'Omistusmuoto'} 
          value={vm.ownershipType} 
        />
        <Row 
          label={locale === 'sv' ? 'Tomtägandeform' : locale === 'en' ? 'Plot Ownership' : 'Tontin omistus'} 
          value={vm.plotOwnership} 
        />
        <Row 
          label={locale === 'sv' ? 'Besittningsform' : locale === 'en' ? 'Housing Tenure' : 'Hallintamuoto'} 
          value={vm.housingTenure} 
        />
        <Row 
          label={locale === 'sv' ? 'Tillgänglig från' : locale === 'en' ? 'Available From' : 'Vapautuminen'} 
          value={vm.availableFrom} 
        />
        <Row 
          label={locale === 'sv' ? 'Planläggning' : locale === 'en' ? 'Zoning' : 'Kaavoitus'} 
          value={vm.zoning} 
        />
      </div>
    </div>
  );
}

function Documents({ vm, locale }: Props) {
  return (
    <div className="bg-white rounded-none shadow-sm p-6">
      <h3 className="text-xl font-light mb-4">
        {locale === 'sv' ? 'Dokument & Länkar' : locale === 'en' ? 'Documents & Links' : 'Asiakirjat & Linkit'}
      </h3>
      <div className="space-y-2">
        <p className="text-gray-600 text-sm">
          {locale === 'sv' 
            ? 'Dokument och länkar exponeras när domänfält är mappade' 
            : locale === 'en'
            ? 'Documents and links will be exposed when domain fields are mapped'
            : 'Asiakirjat ja linkit näytetään kun domain-kentät on liitetty'}
        </p>
        {/* Add document links when available in VM */}
      </div>
    </div>
  );
}

