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

  // Building facts (Rakennustiedot)
  buildingFactsItems: LabelValueItem[];

  // Housing company info (Taloyhtiön tiedot)
  housingCompanyItems: LabelValueItem[];

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

  // Other info (Muut tiedot)
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
  buildingFactsItems,
  housingCompanyItems,
  priceItems,
  livingCostItems,
  otherCostItems,
  costSummary,
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
          {/* Description section - placed under gallery and address */}
          {(descriptionParagraphs.length > 0 || showAutoTranslationNotice || agentNotes) && (
            <SectionCard title={getTranslation('presentationText', language)}>
              {showAutoTranslationNotice && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-700">
                  <p className="font-medium">{notice.title}</p>
                  <p className="text-xs mt-1">{notice.body}</p>
                </div>
              )}

              <div className="prose prose-lg max-w-none text-gray-700">
                {descriptionParagraphs.map((paragraph, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">{getTranslation('highlights', language)}</h3>
                  <ul className="space-y-2">
                    {highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-[#002349] mt-1">•</span>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Selling Points */}
              {sellingPoints.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">{getTranslation('sellingPoints', language)}</h3>
                  <div className="grid gap-2">
                    {sellingPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agent Notes */}
              {agentNotes && (
                <div className="mt-8 p-4 bg-[#002349]/5 rounded-lg border-l-4 border-[#002349]">
                  <p className="text-gray-700 italic">{agentNotes}</p>
                </div>
              )}
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

      {/* BUILDING TAB - Rakennus & yhtiö */}
      {activeTab === 'building' && (
        <div className="space-y-8">
          {/* Building Facts - Rakennustiedot */}
          <SectionCard title={getTranslation('buildingFacts', language)}>
            {buildingFactsItems.length > 0 ? (
              <LabelValueList items={buildingFactsItems} placeholder={notProvidedText} />
            ) : (
              <p className="text-sm text-gray-500 italic">{notProvidedText}</p>
            )}
          </SectionCard>

          {/* Housing Company Info - Taloyhtiön tiedot */}
          <SectionCard title={getTranslation('housingCompanyInfo', language)}>
            {housingCompanyItems.length > 0 ? (
              <LabelValueList items={housingCompanyItems} placeholder={notProvidedText} />
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
            {zoningText ? (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">
                  {getTranslation('zoning', language)}
                </h4>
                <p className="text-gray-700 text-sm whitespace-pre-line">{zoningText}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">{notProvidedText}</p>
            )}
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
