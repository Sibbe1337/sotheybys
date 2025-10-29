import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { Property } from '@/lib/domain/property.types';

export class GetPropertyBySlug {
  constructor(
    private client: LinearAPIClient,
    private mapper: LinearToPropertyMapper
  ) {}

  async execute(slug: string, locale: 'fi' | 'sv' | 'en'): Promise<Property | null> {
    const raw = await this.client.fetchListingBySlug(slug);
    return raw ? this.mapper.map(raw, locale) : null;
  }
}

