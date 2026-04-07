import { Property, Locale } from '@/lib/domain/property.types';
import { isCommercial } from '@/lib/domain/property-type-helpers';
import { fmtCurrency } from './formatters/currency';
import { fmtArea } from './formatters/area';
import { fmtFee, fmtFeeWithoutSuffix, calculateTotalFees } from './formatters/fees';
import { formatDate } from './formatters/date';
import { lpick, lpickWithFallback, lpickStrict } from '@/lib/domain/locale-utils';

export interface PropertyCardVM {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  priceDebtFree?: string;
  area: string;
  areaExtra?: string;
  image: string | undefined;
  hasDebt: boolean;
  hasPlot: boolean;
  isRental: boolean;
  isSold: boolean;
}

export interface PropertyDetailVM extends PropertyCardVM {
  address: string;
  postalCode: string;
  city: string;
  district?: string;
  gate?: string;

  description?: string;
  descriptionTitle?: string;

  rooms?: string;
  bedrooms?: number;
  bathrooms?: number;
  balconyArea?: string;
  terraceArea?: string;

  fees: {
    maintenance?: string;
    financing?: string;
    total?: string;
    water?: string;
    heating?: string;
    electricity?: string;
    parking?: string;
    sauna?: string;
  };

  propertyTax?: number;

  propertyIdentifier?: string;
  plotArea?: number;
  livingArea?: number;

  askPrice?: number;
  debtFreePrice?: number;
  propertyBuildingRights?: string;
  propertyRestrictions?: string;
  propertyMortgages?: string;
  propertyOtherFees?: string;

  features: {
    label: string;
    value: boolean;
  }[];

  status?: 'ACTIVE' | 'SOLD' | 'RESERVED';
  typeCode?: string;
  productGroup?: string;
  apartmentType?: string;
  condition?: string;
  energyClass?: string;
  energyCertStatus?: string;
  heatingSystem?: string;
  ventilationSystem?: string;
  ownershipType?: string;
  plotOwnership?: string;
  housingTenure?: string;
  availableFrom?: string;
  zoning?: string;
  yearBuilt?: number;
  floorsTotal?: number;
  floor?: string;
  hasElevator: boolean;

  housingCompanyName?: string;
  companyLoans?: number;
  companyEncumbrances?: number;
  companyLoansDate?: string;

  images: { url: string; thumb?: string; floorPlan?: boolean }[];
  coordinates?: {
    lat: number;
    lon: number;
  };

  documents: {
    floorPlan?: string;
    brochure?: string;
    brochureIntl?: string;
    video?: string;
    energyCert?: string;
  };

  internationalUrl?: string;
  biddingUrl?: string;

  agent?: {
    name?: string;
    phone?: string;
    email?: string;
    photoUrl?: string;
    title?: string;
  };

  rental?: {
    monthlyRent: string;
    securityDeposit?: string;
    contractType?: string;
    earliestTermination?: string;
    noticePeriod?: string;
    additionalCostInfo?: string;
    petsAllowed?: boolean;
    smokingAllowed?: boolean;
  };
}

export class PropertyVM {
  static toCard(p: Property, l: Locale): PropertyCardVM {
    // Build address with gate letter only (not apartment number)
    const address = p.address[l] || p.address.fi;
    const title = p.gate ? `${address} ${p.gate}` : address;
    const type = lpick(p.meta.listingTypeLabel, l) || (p.meta.typeCode || '').replace(/_/g, ' ');
    const district = p.city[l] || p.city.fi;
    const localeStr = l === 'sv' ? 'sv-SE' : l === 'en' ? 'en-GB' : 'fi-FI';

    const isCommercialProperty = isCommercial(p);
    const isRental = this.isRental(p);

    // Commercial: business area (or total fallback). Normal: living area.
    const area = isCommercialProperty
      ? fmtArea(p.dimensions.business || p.dimensions.total, localeStr)
      : fmtArea(p.dimensions.living, localeStr);

    const extra = isRental && p.dimensions.total
      ? fmtArea(p.dimensions.total, localeStr)
      : (p.dimensions.total ? fmtArea(p.dimensions.total, localeStr) : undefined);

    return {
      id: p.id,
      slug: p.slug,
      title,
      subtitle: [type, district].filter(Boolean).join(' • '),
      price: fmtCurrency(p.pricing.sales, localeStr),
      priceDebtFree: fmtCurrency(p.pricing.debtFree, localeStr),
      area,
      areaExtra: extra,
      image: p.media.images.find(img => !img.floorPlan)?.url || p.media.images[0]?.url,
      hasDebt: p.pricing.debt > 0,
      hasPlot: !!p.dimensions.plot && p.dimensions.plot > 0,
      isRental: this.isRental(p),
      isSold: p.meta.status === 'SOLD'
    };
  }

  static toDetail(p: Property, l: Locale): PropertyDetailVM {
    const card = this.toCard(p, l);
    const localeStr = l === 'sv' ? 'sv-SE' : l === 'en' ? 'en-GB' : 'fi-FI';
    const totalFees = calculateTotalFees(p.fees);

    return {
      ...card,
      address: p.address[l] || p.address.fi,
      postalCode: p.postalCode,
      city: p.city[l] || p.city.fi,
      district: p.district ? (p.district[l] || p.district.fi) : undefined,
      gate: p.gate,

      // Allow FI fallback for descriptions (user-friendly)
      description: lpickWithFallback(p.description, l, true),
      descriptionTitle: lpickWithFallback(p.descriptionTitle, l, true),

      rooms: p.dimensions.rooms,
      bedrooms: p.dimensions.bedrooms,
      bathrooms: p.dimensions.bathrooms,
      balconyArea: p.dimensions.balcony ? fmtArea(p.dimensions.balcony, localeStr) : undefined,
      terraceArea: p.dimensions.terrace ? fmtArea(p.dimensions.terrace, localeStr) : undefined,

      fees: {
        maintenance: fmtFee(p.fees.maintenance, localeStr, true),
        financing: fmtFee(p.fees.financing, localeStr, true),
        total: totalFees > 0 ? fmtFee(totalFees, localeStr, true) : undefined,
        water: fmtFee(p.fees.water, localeStr),
        heating: fmtFee(p.fees.heating, localeStr),
        electricity: fmtFee(p.fees.electricity, localeStr),
        parking: fmtFee(p.fees.parking, localeStr),
        sauna: fmtFee(p.fees.sauna, localeStr)
      },

      propertyTax: p.pricing.propertyTax || undefined,

      propertyIdentifier: p.meta.propertyIdentifier,
      plotArea: p.dimensions.plot,
      livingArea: p.dimensions.living,
      askPrice: p.pricing.sales,
      debtFreePrice: p.pricing.debtFree,
      propertyBuildingRights: p.meta.propertyBuildingRights,
      propertyRestrictions: lpick(p.meta.restrictions, l),

      features: this.getFeaturesList(p, l),

      status: p.meta.status,
      typeCode: p.meta.typeCode,
      productGroup: p.meta.productGroup,
      apartmentType: lpick(p.meta.apartmentType, l),
      condition: lpick(p.meta.condition, l),
      energyClass: p.meta.energyClass,
      energyCertStatus: p.meta.energyCertStatus || undefined,
      heatingSystem: lpick(p.meta.heatingSystem, l),
      ventilationSystem: lpick(p.meta.ventilationSystem, l),
      ownershipType: lpick(p.meta.ownershipType, l),
      plotOwnership: lpick(p.meta.plotOwnership, l),
      housingTenure: lpick(p.meta.housingTenure, l),
      availableFrom: lpick(p.meta.availableFrom, l),
      zoning: lpick(p.meta.zoning, l),
      yearBuilt: p.meta.yearBuilt,
      floorsTotal: p.meta.floorsTotal,
      floor: p.meta.floor,
      hasElevator: p.meta.elevator === true,

      housingCompanyName: lpick(p.meta.housingCompany.name, l),
      companyLoans: p.meta.housingCompany.loans || undefined,
      companyEncumbrances: p.meta.housingCompany.encumbrances || undefined,
      companyLoansDate: p.meta.housingCompany.loansDate ? formatDate(p.meta.housingCompany.loansDate, l) : undefined,

      images: p.media.images,
      coordinates: p.media.coordinates,

      documents: p.documents,

      internationalUrl: p.internationalUrl,
      biddingUrl: p.pricing.biddingUrl || undefined,

      agent: p.agent,

      rental: p.rental ? {
        monthlyRent: fmtFee(p.rental.monthlyRent, localeStr),
        securityDeposit: lpick(p.rental.securityDeposit, l),
        contractType: lpick(p.rental.contractType, l),
        earliestTermination: lpick(p.rental.earliestTermination, l),
        noticePeriod: lpick(p.rental.noticePeriod, l),
        additionalCostInfo: lpick(p.rental.additionalCostInfo, l),
        petsAllowed: p.rental.petsAllowed,
        smokingAllowed: p.rental.smokingAllowed
      } : undefined
    };
  }

  static isRental(p: Property): boolean {
    return !!p.meta.rent && p.meta.rent > 0;
  }

  static getFeaturesList(p: Property, l: Locale): { label: string; value: boolean }[] {
    const labels = {
      fi: {
        balcony: 'Parveke',
        terrace: 'Terassi',
        sauna: 'Sauna',
        fireplace: 'Takka',
        storageRoom: 'Varastohuone',
        parkingSpace: 'Autopaikka'
      },
      sv: {
        balcony: 'Balkong',
        terrace: 'Terrass',
        sauna: 'Bastu',
        fireplace: 'Öppen spis',
        storageRoom: 'Förråd',
        parkingSpace: 'Parkeringsplats'
      },
      en: {
        balcony: 'Balcony',
        terrace: 'Terrace',
        sauna: 'Sauna',
        fireplace: 'Fireplace',
        storageRoom: 'Storage Room',
        parkingSpace: 'Parking Space'
      }
    };

    const localeLabels = labels[l];

    return [
      { label: localeLabels.balcony, value: p.features.balcony === true },
      { label: localeLabels.terrace, value: p.features.terrace === true },
      { label: localeLabels.sauna, value: p.features.sauna === true },
      { label: localeLabels.fireplace, value: p.features.fireplace === true },
      { label: localeLabels.storageRoom, value: p.features.storageRoom === true },
      { label: localeLabels.parkingSpace, value: p.features.parkingSpace === true }
    ];
  }
}
