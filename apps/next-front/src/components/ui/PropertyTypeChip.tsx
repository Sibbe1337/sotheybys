import React from 'react';
import { cn } from '@/lib/utils';

interface PropertyTypeChipProps {
  type: string;
  className?: string;
}

// Map common property types to display names
const typeMap: Record<string, string> = {
  'asunto': 'Asunto',
  'omakotitalo': 'Omakotitalo',
  'kerrostalo': 'Kerrostalo',
  'rivitalo': 'Rivitalo',
  'paritalo': 'Paritalo',
  'erillistalo': 'Erillistalo',
  'mökki': 'Mökki',
  'tontti': 'Tontti',
  'liiketila': 'Liiketila',
  // Add more mappings as needed
};

export const PropertyTypeChip: React.FC<PropertyTypeChipProps> = ({ 
  type, 
  className 
}) => {
  const displayType = typeMap[type.toLowerCase()] || type;
  
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
