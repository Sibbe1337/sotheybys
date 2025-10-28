import { SectionCard } from './SectionCard';
import { LabelValueList, type LabelValueItem } from './LabelValueList';
import { getTranslation, type SupportedLanguage } from '@/lib/property-translations';
import type { AdditionalMaterialLink, DocumentLink } from './types';
import { CubeIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

export interface ApartmentViewProps {
  activeTab: string;
  language: SupportedLanguage;

  // Overview section
  descriptionParagraphs: string[];
  showAutoTranslationNotice: boolean;
  highlights: string[];
  sellingPoints: string[];
  agentNotes?: string;
  additionalMaterials: AdditionalMaterialLink[];

  // Apartment details (Huoneistotiedot)
  apartmentDetailsItems: LabelValueItem[];

  // Company and Building info (Yhtiö- ja Rakennustiedot) - MERGED section
  companyAndBuildingItems: LabelValueItem[];

  // Costs - Price info (Hintatiedot)
  priceItems: LabelValueItem[];

  // Costs - Living costs (Asumiskustannukset)
  livingCostItems: LabelValueItem[];

  // Costs - Other costs (Muut kustannukset) - NO propertyTax for apartments!
  otherCostItems: LabelValueItem[];

  // Cost summary
  costSummary?: {
    monthly?: string;
    yearly?: string;
  };

  // Other info (Muut tiedot) - includes ownershipType and availableFrom
  otherInfoItems?: LabelValueItem[];
  zoningText?: string;

  // Documents
  documents: DocumentLink[];

  // Placeholder text
  notProvidedText: string;
}

const translationNotice = (language: SupportedLanguage) => {
  if (language === 'sv') {
    return {
      title: '📝 Automatisk översättning',
      body: 'Vissa termer har översatts automatiskt från finska. Kontakta mäklaren för fullständig översättning.'
    };
  }
  if (language === 'en') {
    return {
      title: '📝 Automatic translation',
      body: 'Some terms have been automatically translated from Finnish. Contact the agent for a complete translation.'
    };
  }
  return {
    title: '📝 Automaattinen käännös',
    body: 'Joidenkin termien käännös on tehty automaattisesti suomesta. Ota yhteyttä välittäjään saadaksesi täydellisen käännöksen.'
  };
};

const materialIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <VideoCameraIcon className="w-5 h-5 text-[#002349]" />;
    case 'virtualTour':
      return <CubeIcon className="w-5 h-5 text-[#002349]" />;
    default:
      return <span className="text-[#002349] text-sm">•</span>;
  }
};

/**
 * ApartmentView component for displaying apartment (lägenhet) properties
 * according to the specification with exact field visibility rules.
 *
 * IMPORTANT: This view must NEVER show propertyTax (kiinteistövero) for apartments.
 */
export default function ApartmentView({
  activeTab,
  language,
  descriptionParagraphs,
  showAutoTranslationNotice,
  highlights,
  sellingPoints,
  agentNotes,
  additionalMaterials,
  apartmentDetailsItems,
  companyAndBuildingItems,
  priceItems,
  livingCostItems,
  otherCostItems,
  costSummary,
  otherInfoItems,
  zoningText,
  documents,
  notProvidedText
}: ApartmentViewProps) {
  const notice = translationNotice(language);

  return (
    <>
      {/* OVERVIEW TAB - Yleiskatsaus / Översikt */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Description section */}
          {descriptionParagraphs.length > 0 && (
            <SectionCard title={getTranslation('apartmentDescription', language)}>
              <div className="prose prose-sm sm:prose max-w-none">
                {descriptionParagraphs.map((paragraph: string, idx: number) => (
                  <p key={idx} className="mb-3 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Additional Materials */}
          {additionalMaterials.length > 0 && (
            <SectionCard title={getTranslation('additionalMaterials', language)}>
              <div className="flex flex-wrap gap-3">
                {additionalMaterials.map((item, idx) => (
                  <a
                    key={`${item.label}-${idx}`}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                  >
                    {materialIcon(item.type)}
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {/* DETAILS TAB - Huoneistotiedot */}
      {activeTab === 'details' && (
        <div className="space-y-8">
          <SectionCard title={getTranslation('apartmentDetails', language)}>
            {apartmentDetailsItems.length > 0 ? (
              <LabelValueList items={apartmentDetailsItems} placeholder={notProvidedText} />
            ) : (
              <p className="text-sm text-gray-500 italic">{notProvidedText}</p>
            )}
          </SectionCard>
        </div>
      )}

      {/* BUILDING TAB - Yhtiö- ja Rakennustiedot (merged section) */}
      {activeTab === 'building' && (
        <div className="space-y-8">
          {/* Company and Building Info - NO subsection titles per Dennis requirement */}
          <SectionCard title={getTranslation('buildingAndCompany', language)}>
            {companyAndBuildingItems.length > 0 ? (
              <LabelValueList items={companyAndBuildingItems} placeholder={notProvidedText} />
            ) : (
              <p className="text-sm text-gray-500 italic">{notProvidedText}</p>
            )}
          </SectionCard>
        </div>
      )}

      {/* COSTS TAB - Kustannukset */}
      {activeTab === 'costs' && (
        <div className="space-y-8">
          {/* Price Information - Hintatiedot (always visible) */}
          <SectionCard title={getTranslation('priceInformation', language)}>
            {priceItems.length > 0 ? (
              <LabelValueList items={priceItems} placeholder={notProvidedText} />
            ) : (
              <p className="text-sm text-gray-500 italic">{notProvidedText}</p>
            )}
          </SectionCard>

          {/* Living Costs - Asumiskustannukset (show only if has values) */}
          {livingCostItems.length > 0 && (
            <SectionCard title={getTranslation('livingCosts', language)}>
              <LabelValueList items={livingCostItems} placeholder={notProvidedText} />
            </SectionCard>
          )}

          {/* Other Costs - Muut kustannukset (show only if has values) */}
          {/* IMPORTANT: propertyTax should already be filtered out before passing otherCostItems */}
          {otherCostItems.length > 0 && (
            <SectionCard title={getTranslation('otherCostsSection', language)}>
              <LabelValueList items={otherCostItems} placeholder={notProvidedText} />
            </SectionCard>
          )}

          {/* Cost Summary */}
          {(costSummary?.monthly || costSummary?.yearly) && (
            <div className="bg-[#002349] text-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-light mb-4">{getTranslation('costSummary', language)}</h3>
              <div className="space-y-3">
                {costSummary?.monthly && (
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">{getTranslation('totalMonthlyCosts', language)}</span>
                    <span className="font-medium text-xl">{costSummary.monthly}</span>
                  </div>
                )}
                {costSummary?.yearly && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/80">{getTranslation('totalYearlyCosts', language)}</span>
                    <span className="font-medium text-xl">{costSummary.yearly}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LOCATION TAB - Muut tiedot (Other Information) */}
      {activeTab === 'location' && (
        <div className="space-y-8">
          <SectionCard title={getTranslation('otherInformation', language)}>
            {/* Other info items (Omistusmuoto, Vapautuminen) */}
            {otherInfoItems && otherInfoItems.length > 0 && (
              <div className="mb-6">
                <LabelValueList items={otherInfoItems} placeholder={notProvidedText} />
              </div>
            )}

            {/* Zoning information */}
            {zoningText ? (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">
                  {getTranslation('zoning', language)}
                </h4>
                <p className="text-gray-700 text-sm whitespace-pre-line">{zoningText}</p>
              </div>
            ) : !otherInfoItems || otherInfoItems.length === 0 ? (
              <p className="text-sm text-gray-500 italic">{notProvidedText}</p>
            ) : null}
          </SectionCard>
        </div>
      )}

      {/* DOCUMENTS TAB - Asiakirjat & Linkit */}
      {activeTab === 'documents' && (
        <div className="space-y-8">
          {documents.length > 0 ? (
            <SectionCard title={getTranslation('documentsAndLinks', language)}>
              <div className="space-y-3">
                {documents.map((doc, idx) => (
                  <a
                    key={`${doc.href}-${idx}`}
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#002349] hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700">{doc.label}</span>
                  </a>
                ))}
              </div>
            </SectionCard>
          ) : (
            <SectionCard title={getTranslation('documentsAndLinks', language)}>
              <p className="text-sm text-gray-500 italic">{notProvidedText}</p>
            </SectionCard>
          )}
        </div>
      )}
    </>
  );
}
