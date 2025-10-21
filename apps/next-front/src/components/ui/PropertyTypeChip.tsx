import React from 'react';
import { cn } from '@/lib/utils';

interface PropertyTypeChipProps {
  type: string;
  className?: string;
  language?: 'fi' | 'sv' | 'en';
}

// Multi-language translations for property types
const typeTranslations: Record<string, Record<'fi' | 'sv' | 'en', string>> = {
  'asunto': { fi: 'Asunto', sv: 'Lägenhet', en: 'Apartment' },
  'lägenhet': { fi: 'Asunto', sv: 'Lägenhet', en: 'Apartment' },
  'apartment': { fi: 'Asunto', sv: 'Lägenhet', en: 'Apartment' },
  'omakotitalo': { fi: 'Omakotitalo', sv: 'Villa', en: 'Detached house' },
  'villa': { fi: 'Omakotitalo', sv: 'Villa', en: 'Detached house' },
  'kerrostalo': { fi: 'Kerrostalo', sv: 'Flervåningshus', en: 'Apartment building' },
  'rivitalo': { fi: 'Rivitalo', sv: 'Radhus', en: 'Townhouse' },
  'radhus': { fi: 'Rivitalo', sv: 'Radhus', en: 'Townhouse' },
  'townhouse': { fi: 'Rivitalo', sv: 'Radhus', en: 'Townhouse' },
  'paritalo': { fi: 'Paritalo', sv: 'Parhus', en: 'Semi-detached' },
  'parhus': { fi: 'Paritalo', sv: 'Parhus', en: 'Semi-detached' },
  'erillistalo': { fi: 'Erillistalo', sv: 'Fristående hus', en: 'Detached house' },
  'tila': { fi: 'Tila', sv: 'Gård', en: 'Farm' },
  'gård': { fi: 'Tila', sv: 'Gård', en: 'Farm' },
  'farm': { fi: 'Tila', sv: 'Gård', en: 'Farm' },
  'mökki': { fi: 'Mökki', sv: 'Stuga', en: 'Cottage' },
  'stuga': { fi: 'Mökki', sv: 'Stuga', en: 'Cottage' },
  'cottage': { fi: 'Mökki', sv: 'Stuga', en: 'Cottage' },
  'tontti': { fi: 'Tontti', sv: 'Tomt', en: 'Plot' },
  'tomt': { fi: 'Tontti', sv: 'Tomt', en: 'Plot' },
  'plot': { fi: 'Tontti', sv: 'Tomt', en: 'Plot' },
  'liiketila': { fi: 'Liiketila', sv: 'Affärslokal', en: 'Commercial' },
  'affärslokal': { fi: 'Liiketila', sv: 'Affärslokal', en: 'Commercial' },
  'commercial': { fi: 'Liiketila', sv: 'Affärslokal', en: 'Commercial' },
};

export const PropertyTypeChip: React.FC<PropertyTypeChipProps> = ({ 
  type, 
  className,
  language = 'fi'
}) => {
  const normalizedType = type.toLowerCase().trim();
  const translations = typeTranslations[normalizedType];
  const displayType = translations?.[language] || type;
  
  return (
    <span 
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        'bg-gray-100 text-gray-800 border border-gray-200',
        className
      )}
    >
      {displayType}
    </span>
  );
};

export default PropertyTypeChip;
