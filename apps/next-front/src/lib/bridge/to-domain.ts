import { Property } from '@/lib/domain/property.types';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';

const mapper = new LinearToPropertyMapper();

export function bridgeToDomain(current: any, locale: 'fi' | 'sv' | 'en'): Property {
  // Om current redan ser ut som LinearListing – använd map
  return mapper.map(current, locale);
}

