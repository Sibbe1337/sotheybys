import type { Property } from '@/lib/domain/property.types';

interface PropertyTypeFilter {
  id: string;
  label: { fi: string; sv: string; en: string };
  image: string;
  filter: (p: Property) => boolean;
}

function isOnSaleNotRental(p: Property): boolean {
  const rent = p.meta.rent || 0;
  const isOnSale = !p.meta.status || p.meta.status === 'ACTIVE' || p.meta.status === 'RESERVED';
  return rent <= 0 && isOnSale;
}

export const PROPERTY_TYPES: PropertyTypeFilter[] = [
  {
    id: 'all',
    label: { fi: 'Kaikki kohteet', sv: 'Alla objekt', en: 'All properties' },
    image: '/images/property-types/all.svg',
    filter: isOnSaleNotRental,
  },
  {
    id: 'highrise',
    label: { fi: 'Kerrostalot', sv: 'Höghus', en: 'Apartment buildings' },
    image: '/images/property-types/apartment.svg',
    filter: (p) => {
      if (!isOnSaleNotRental(p)) return false;
      const type = (p.meta.typeCode || '').toLowerCase();
      return type.includes('kerrostalo') || type.includes('apartment_building') || (type.includes('flat') && !type.includes('row') && !type.includes('semi'));
    },
  },
  {
    id: 'detached',
    label: { fi: 'Omakotitalot', sv: 'Egnahemshus', en: 'Detached houses' },
    image: '/images/property-types/house.svg',
    filter: (p) => {
      if (!isOnSaleNotRental(p)) return false;
      const type = (p.meta.typeCode || '').toLowerCase();
      if (type.includes('paritalo') || type.includes('parhus') || type.includes('mökki') || type.includes('stuga') || type.includes('cottage')) return false;
      return type.includes('omakotitalo') || type.includes('detached');
    },
  },
  {
    id: 'townhouse',
    label: { fi: 'Rivitalot', sv: 'Radhus', en: 'Townhouses' },
    image: '/images/property-types/townhouse.svg',
    filter: (p) => {
      if (!isOnSaleNotRental(p)) return false;
      const type = (p.meta.typeCode || '').toLowerCase();
      if (type.includes('paritalo') || type.includes('semi_detached') || type.includes('parhus')) return false;
      return type.includes('rivi') || type.includes('row') || type.includes('townhouse') || type.includes('radhus');
    },
  },
  {
    id: 'semidetached',
    label: { fi: 'Paritalot', sv: 'Parhus', en: 'Semi-detached houses' },
    image: '/images/property-types/townhouse.svg',
    filter: (p) => {
      if (!isOnSaleNotRental(p)) return false;
      const type = (p.meta.typeCode || '').toLowerCase();
      return type.includes('paritalo') || type.includes('semi_detached') || type.includes('parhus');
    },
  },
  {
    id: 'cottage',
    label: { fi: 'Mökit ja huvilat', sv: 'Stugor och villor', en: 'Cottages and villas' },
    image: '/images/property-types/cottage.svg',
    filter: (p) => {
      if (!isOnSaleNotRental(p)) return false;
      const type = (p.meta.typeCode || '').toLowerCase();
      return type.includes('mökki') || type.includes('huvila') || type.includes('cottage') || type.includes('cabin') || type.includes('stuga');
    },
  },
  {
    id: 'farm',
    label: { fi: 'Maatilat', sv: 'Gårdar', en: 'Farms' },
    image: '/images/property-types/farm.svg',
    filter: (p) => {
      if (!isOnSaleNotRental(p)) return false;
      const type = (p.meta.typeCode || '').toLowerCase();
      return type.includes('maatila') || type.includes('farm') || type.includes('estate') || type.includes('gård');
    },
  },
];
