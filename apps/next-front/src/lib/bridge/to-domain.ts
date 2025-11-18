import { Property } from '@/lib/domain/property.types';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';

const mapper = new LinearToPropertyMapper();

export async function bridgeToDomain(current: any, locale: 'fi' | 'sv' | 'en'): Promise<Property> {
  // Om current redan ser ut som LinearListing – använd map
  return await mapper.map(current, locale);
}

