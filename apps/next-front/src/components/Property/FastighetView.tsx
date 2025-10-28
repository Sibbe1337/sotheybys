import { CubeIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { SectionCard } from './SectionCard';
import { LabelValueList, type LabelValueItem } from './LabelValueList';
import { getTranslation, type SupportedLanguage } from '@/lib/property-translations';
import type { AdditionalMaterialLink, AdditionalMaterialType, DocumentLink } from './types';

export interface CostSummary {
  monthly?: string;
  yearly?: string;
}

interface FastighetViewProps {
  activeTab: string;
  language: SupportedLanguage;
  descriptionParagraphs: string[];
  showAutoTranslationNotice: boolean;
  highlights: string[];
  sellingPoints: string[];
  agentNotes?: string;
  additionalMaterials: AdditionalMaterialLink[];
  estateItems: LabelValueItem[];
  rightsText?: string;
  buildingItems: LabelValueItem[];
  priceItems: LabelValueItem[];
  livingCostItems: LabelValueItem[];
  otherCostItems: LabelValueItem[];
  costSummary?: CostSummary;
  documents: DocumentLink[];
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

const materialIcon = (type: AdditionalMaterialType) => {
  switch (type) {
    case 'video':
      return <VideoCameraIcon className="w-5 h-5 text-[#002349]" />;
    case 'virtualTour':
      return <CubeIcon className="w-5 h-5 text-[#002349]" />;
    default:
      return <span className="text-[#002349] text-sm">•</span>;
  }
};

export default function FastighetView({
  activeTab,
  language,
  descriptionParagraphs,
  showAutoTranslationNotice,
  highlights,
  sellingPoints,
  agentNotes,
  additionalMaterials,
  estateItems,
  rightsText,
  buildingItems,
  priceItems,
  livingCostItems,
  otherCostItems,
  costSummary,
  documents,
  notProvidedText
}: FastighetViewProps) {
  const notice = translationNotice(language);

  return (
    <>
      {activeTab === 'overview' && (
        <div className="space-y-8">
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

      {activeTab === 'property-details' && (
        <div className="space-y-8">
          <SectionCard title={getTranslation('estateInfo', language)}>
            {estateItems.length > 0 ? (
              <LabelValueList items={estateItems} placeholder={notProvidedText} />
            ) : (
              <p className="text-sm text-gray-500 italic">{notProvidedText}</p>
            )}
            {rightsText && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-600 mb-1">{getTranslation('rightsAndEncumbrances', language)}</h4>
                <p className="text-gray-700 text-sm whitespace-pre-line">{rightsText}</p>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === 'building' && (
        <div className="space-y-8">
          <SectionCard title={getTranslation('buildingInfo', language)}>
            {buildingItems.length > 0 ? (
              <LabelValueList items={buildingItems} placeholder={notProvidedText} />
            ) : (
              <p className="text-sm text-gray-500 italic">{notProvidedText}</p>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === 'costs' && (
        <div className="space-y-8">
          <SectionCard title={getTranslation('priceDetails', language)}>
            {priceItems.length > 0 ? (
              <LabelValueList items={priceItems} placeholder={notProvidedText} />
            ) : (
              <p className="text-sm text-gray-500 italic">{notProvidedText}</p>
            )}
          </SectionCard>

          {livingCostItems.length > 0 && (
            <SectionCard title={getTranslation('housingCosts', language)}>
              <LabelValueList items={livingCostItems} placeholder={notProvidedText} />
            </SectionCard>
          )}

          {otherCostItems.length > 0 && (
            <SectionCard title={getTranslation('otherCosts', language)}>
              <LabelValueList items={otherCostItems} placeholder={notProvidedText} />
            </SectionCard>
          )}

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

      {activeTab === 'documents' && (
        <div className="space-y-8">
          {documents.length > 0 ? (
            <SectionCard title={getTranslation('documents', language)}>
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
            <SectionCard title={getTranslation('documents', language)}>
              <p className="text-sm text-gray-500 italic">{notProvidedText}</p>
            </SectionCard>
          )}
        </div>
      )}
    </>
  );
}
