import React from 'react';
import { getTranslation, type SupportedLanguage } from '@/lib/property-translations';
import { SectionCard } from './SectionCard';
import { LabelValueList, type LabelValueItem } from './LabelValueList';
import type { AdditionalMaterialLink, DocumentLink } from './types';

interface RentalViewProps {
  activeTab: string;
  language: SupportedLanguage;
  descriptionParagraphs: string[];
  apartmentDetailsItems: LabelValueItem[];
  rentalInfoItems: LabelValueItem[];
  buildingFactsItems: LabelValueItem[];
  housingCompanyItems: LabelValueItem[];
  rentItems: LabelValueItem[];
  additionalCostItems?: LabelValueItem[];
  includedInRentText?: string;
  documents: DocumentLink[];
  notProvidedText: string;
}

export default function RentalView({
  activeTab,
  language,
  descriptionParagraphs,
  apartmentDetailsItems,
  rentalInfoItems,
  buildingFactsItems,
  housingCompanyItems,
  rentItems,
  additionalCostItems = [],
  includedInRentText,
  documents,
  notProvidedText
}: RentalViewProps) {
  return (
    <>
      {/* OVERVIEW TAB - Yleiskatsaus */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Description section */}
          {descriptionParagraphs.length > 0 && (
            <SectionCard title={getTranslation('rentalDescription', language)}>
              <div className="prose prose-sm sm:prose max-w-none">
                {descriptionParagraphs.map((paragraph: string, idx: number) => (
                  <p key={idx} className="mb-3 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {/* DETAILS TAB - Huoneistotiedot & Vuokratiedot */}
      {activeTab === 'details' && (
        <div className="space-y-8">
          {/* Apartment details section */}
          <SectionCard title={getTranslation('apartmentDetails', language)}>
            <LabelValueList items={apartmentDetailsItems} placeholder={notProvidedText} />
          </SectionCard>

          {/* Rental information section - ALWAYS visible */}
          <SectionCard title={getTranslation('rentalInformation', language)}>
            <LabelValueList items={rentalInfoItems} placeholder={notProvidedText} />
          </SectionCard>
        </div>
      )}

      {/* BUILDING TAB - Rakennus & Yhtiö */}
      {activeTab === 'building' && (
        <div className="space-y-8">
          {/* Building facts section - Only shown if items exist (hidden for rentals) */}
          {buildingFactsItems.length > 0 && (
            <SectionCard title={getTranslation('buildingFacts', language)}>
              <LabelValueList items={buildingFactsItems} placeholder={notProvidedText} />
            </SectionCard>
          )}

          {/* Housing company section - ALWAYS visible (for rentals, this is the combined section) */}
          <SectionCard title={getTranslation('housingCompanyInfo', language)}>
            <LabelValueList items={housingCompanyItems} placeholder={notProvidedText} />
          </SectionCard>
        </div>
      )}

      {/* COSTS TAB - Kustannukset */}
      {activeTab === 'costs' && (
        <div className="space-y-8">
          {/* Rent - ALWAYS visible */}
          <SectionCard title={getTranslation('costs', language)}>
            <LabelValueList items={rentItems} placeholder={notProvidedText} />
          </SectionCard>

          {/* Additional costs - ONLY if exists */}
          {additionalCostItems.length > 0 && (
            <SectionCard title={getTranslation('additionalCosts', language)}>
              <LabelValueList items={additionalCostItems} />
            </SectionCard>
          )}

          {/* What's included in rent - ONLY if exists */}
          {includedInRentText && includedInRentText.trim() !== '' && (
            <SectionCard title={getTranslation('includedInRent', language)}>
              <p className="text-gray-700 leading-relaxed">{includedInRentText}</p>
            </SectionCard>
          )}
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
