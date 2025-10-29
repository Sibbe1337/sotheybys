import { PropertyCardVM } from '@/lib/presentation/property.view-model';

// Bridge from old format to new PropertyCardVM if needed
export function bridgeToView(oldProperty: any): PropertyCardVM {
  return {
    id: oldProperty.id || '',
    slug: oldProperty.slug || '',
    title: oldProperty.title || oldProperty.address || '',
    subtitle: [oldProperty.city, oldProperty.district].filter(Boolean).join(' • '),
    price: oldProperty.price || '0 €',
    priceDebtFree: oldProperty.debtFreePrice,
    area: oldProperty.area || '0 m²',
    areaExtra: oldProperty.totalArea,
    image: oldProperty.image || oldProperty.featuredImage,
    hasDebt: !!oldProperty.debt && oldProperty.debt > 0,
    hasPlot: !!oldProperty.plotArea,
    isRental: !!oldProperty.rent && oldProperty.rent > 0, // Phase 3: Check for rental
    isSold: oldProperty.status?.toLowerCase() === 'sold' || oldProperty.status?.toLowerCase() === 'myyty' // Phase 3: Check for sold
  };
}

