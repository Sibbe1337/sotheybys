import { Property, Locale } from '@/lib/domain/property.types';
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
  isRental: boolean;  // NEW Phase 3
  isSold: boolean;    // NEW Phase 3
}

export interface PropertyDetailVM extends PropertyCardVM {
  address: string;      // Street address only (e.g., "Heikkiläntie 1")
  postalCode: string;
  city: string;
  district?: string;    // Stadsdel/District (e.g., "Lauttasaari") - separate from city
  gate?: string;  // Staircase letter only (e.g., "C")
  
  // Rich content (NEW Phase 3)
  description?: string;        // Sanitized HTML
  descriptionTitle?: string;
  
  // Dimensions (expanded Phase 3)
  rooms?: string;              // e.g. "3h+k"
  bedrooms?: number;
  bathrooms?: number;
  balconyArea?: string;        // Formatted
  terraceArea?: string;        // Formatted
  
  // Fees (NEW Phase 3)
  fees: {
    maintenance?: string;      // Formatted as "450 €/kk"
    financing?: string;
    total?: string;            // Sum of all fees
    water?: string;
    heating?: string;
    electricity?: string;
    parking?: string;
    sauna?: string;
  };
  
  // Property tax (ONLY for properties, NOT apartments)
  propertyTax?: number;
  
  // Property-specific fields (DENNIS SPEC)
  propertyIdentifier?: string;       // Kiinteistötunnus
  plotArea?: string;                 // Tontin koko (formatted)
  propertyBuildingRights?: string;   // Rakennusoikeus
  propertyRestrictions?: string;     // Rasitteet ja oikeudet
  propertyMortgages?: string;        // Kiinnitykset
  propertyOtherFees?: string;        // Muut maksut
  
  // Features (NEW Phase 3)
  features: {
    label: string;             // Localized
    value: boolean;
  }[];
  
  // Meta
  status?: 'ACTIVE' | 'SOLD' | 'RESERVED';  // NEW Phase 3
  typeCode?: string;
  apartmentType?: string;
  condition?: string;          // Kunto / Skick (for rentals)
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
  floor?: string;              // NEW Phase 3
  hasElevator: boolean;
  
  // Housing company
  housingCompanyName?: string;
  companyLoans?: number;
  companyEncumbrances?: number;
  companyLoansDate?: string;
  
  // Media
  images: { url: string; thumb?: string; floorPlan?: boolean }[];
  coordinates?: {              // NEW Phase 3
    lat: number;
    lon: number;
  };
  
  // Documents (NEW Phase 3)
  documents: {
    floorPlan?: string;
    brochure?: string;
    brochureIntl?: string;
    video?: string;
    energyCert?: string;
  };
  
  // International marketing
  internationalUrl?: string;  // GLOBAL LISTING URL
  
  // Agent
  agent?: {
    name?: string;
    phone?: string;
    email?: string;
    photoUrl?: string;
    title?: string;
  };
  
  // Rental (NEW Phase 3)
  rental?: {
    monthlyRent: string;       // Formatted
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
    // ✅ MÄKLARE SPEC: Build address with gate letter ONLY (NOT apartment number)
    // Example: "Heikkiläntie 1 C" (not "Heikkiläntie 1 C 47")
    const address = p.address[l] || p.address.fi;
    const title = p.gate ? `${address} ${p.gate}` : address;
    // ✅ SPEC: Use localized listing type label instead of raw code
    const type = lpick(p.meta.listingTypeLabel, l) || (p.meta.typeCode || '').replace(/_/g, ' ');
    const district = p.city[l] || p.city.fi;
    const localeStr = l === 'sv' ? 'sv-SE' : l === 'en' ? 'en-GB' : 'fi-FI';
    
    const area = fmtArea(p.dimensions.living, localeStr);
    const extra = p.dimensions.total ? fmtArea(p.dimensions.total, localeStr) : undefined;
    
    return {
      id: p.id,
      slug: p.slug,
      title,
      subtitle: [type, district].filter(Boolean).join(' • '),
      price: fmtCurrency(p.pricing.sales, localeStr),
      priceDebtFree: p.pricing.debt > 0 ? fmtCurrency(p.pricing.debtFree, localeStr) : undefined,
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

    // Calculate total fees
    const totalFees = calculateTotalFees(p.fees);

    return {
      ...card,
      address: p.address[l] || p.address.fi,  // Street address only
      postalCode: p.postalCode,
      city: p.city[l] || p.city.fi,
      district: p.district ? (p.district[l] || p.district.fi) : undefined,  // Separate district field
      gate: p.gate,
      
      // Rich content (NEW Phase 3)
      // ✅ SPEC: Allow FI fallback for descriptions (user-friendly), but strict for other fields
      description: lpickWithFallback(p.description, l, true), // Allow FI fallback
      descriptionTitle: lpickWithFallback(p.descriptionTitle, l, true),

      // Dimensions (NEW Phase 3)
      rooms: p.dimensions.rooms,
      bedrooms: p.dimensions.bedrooms,
      bathrooms: p.dimensions.bathrooms,
      balconyArea: p.dimensions.balcony ? fmtArea(p.dimensions.balcony, localeStr) : undefined,
      terraceArea: p.dimensions.terrace ? fmtArea(p.dimensions.terrace, localeStr) : undefined,

      // Fees (NEW Phase 3)
      fees: {
        maintenance: fmtFee(p.fees.maintenance, localeStr),
        financing: fmtFee(p.fees.financing, localeStr),
        total: totalFees > 0 ? fmtFee(totalFees, localeStr) : undefined,
        water: fmtFee(p.fees.water, localeStr),
        heating: fmtFee(p.fees.heating, localeStr),
        electricity: fmtFee(p.fees.electricity, localeStr),
        parking: fmtFee(p.fees.parking, localeStr),
        sauna: fmtFee(p.fees.sauna, localeStr)
      },

      // Property tax (ONLY for properties, NOT apartments)
      propertyTax: p.pricing.propertyTax || undefined,

      // Property-specific fields (DENNIS SPEC)
      propertyIdentifier: p.meta.propertyIdentifier,
      plotArea: p.dimensions.plot ? fmtArea(p.dimensions.plot, localeStr) : undefined,
      propertyBuildingRights: p.meta.propertyBuildingRights,
      propertyRestrictions: lpick(p.meta.restrictions, l),
      propertyMortgages: undefined, // TODO: Add to Property type if needed
      propertyOtherFees: undefined, // TODO: Add to Property type if needed

      // Features (NEW Phase 3)
      features: this.getFeaturesList(p, l),

      // Meta
      status: p.meta.status,
      typeCode: p.meta.typeCode,
      // ✅ SPEC: Use lpick for technical data (allows FI fallback for non-translated system values)
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

      // Housing company (allow FI fallback for company names)
      housingCompanyName: lpick(p.meta.housingCompany.name, l),
      companyLoans: p.meta.housingCompany.loans || undefined,
      companyEncumbrances: p.meta.housingCompany.encumbrances || undefined,
      companyLoansDate: p.meta.housingCompany.loansDate ? formatDate(p.meta.housingCompany.loansDate, l) : undefined,

      // Media
      images: p.media.images,
      coordinates: p.media.coordinates,

      // Documents (NEW Phase 3)
      documents: p.documents,

      // International marketing
      internationalUrl: p.internationalUrl,

      // Agent
      agent: p.agent,

      // Rental (NEW Phase 3)
      rental: p.rental ? {
        monthlyRent: fmtFee(p.rental.monthlyRent, localeStr),
        // ✅ SPEC: Rental metadata with FI fallback (technical data)
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

  /**
   * Check if property is a rental
   */
  static isRental(p: Property): boolean {
    return !!p.meta.rent && p.meta.rent > 0;
  }

  /**
   * Get localized feature list
   */
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

