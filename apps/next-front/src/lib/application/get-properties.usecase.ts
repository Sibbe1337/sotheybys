import { LinearAPIClient } from '@/lib/infrastructure/linear-api/client';
import { LinearToPropertyMapper } from '@/lib/infrastructure/linear-api/mapper';
import { Property } from '@/lib/domain/property.types';

export class GetProperties {
  constructor(
    private client: LinearAPIClient,
    private mapper: LinearToPropertyMapper
  ) {}

  async execute(locale: 'fi' | 'sv' | 'en'): Promise<Property[]> {
    const raw = await this.client.fetchListings();
    return raw.map((r: any) => this.mapper.map(r, locale));
  }
}

