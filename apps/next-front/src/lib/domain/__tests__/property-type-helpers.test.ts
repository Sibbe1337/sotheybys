/**
 * Tests for Property Type Helpers
 * 
 * Per spec: Type-specific layouts (apartments vs properties vs rentals)
 */

import { describe, it, expect } from 'vitest';
import { 
  isApartment, 
  isProperty, 
  isRental, 
  getPropertyCategory,
  shouldShowPropertyTax,
  shouldShowCompanyInfo
} from '../property-type-helpers';
import type { Property } from '../property.types';

const createMockProperty = (overrides: Partial<Property> = {}): Property => ({
  id: 'test-1',
  slug: 'test-property',
  address: { fi: 'Testikatu 1', sv: undefined, en: undefined },
  postalCode: '00100',
  city: { fi: 'Helsinki', sv: undefined, en: undefined },
  pricing: { sales: 300000, debtFree: 250000, debt: 50000 },
  dimensions: { living: 75 },
  fees: {},
  features: {},
  meta: {
    typeCode: 'FLAT',
    status: 'ACTIVE',
    housingCompany: {}
  },
  media: { images: [] },
  documents: {},
  ...overrides
});

describe('isApartment', () => {
  it('should identify KERROSTALO as apartment', () => {
    const property = createMockProperty({ meta: { typeCode: 'KERROSTALO', status: 'ACTIVE', housingCompany: {} } });
    expect(isApartment(property)).toBe(true);
  });

  it('should identify FLAT as apartment', () => {
    const property = createMockProperty({ meta: { typeCode: 'FLAT', status: 'ACTIVE', housingCompany: {} } });
    expect(isApartment(property)).toBe(true);
  });

  it('should identify APARTMENT_BUILDING as apartment', () => {
    const property = createMockProperty({ meta: { typeCode: 'APARTMENT_BUILDING', status: 'ACTIVE', housingCompany: {} } });
    expect(isApartment(property)).toBe(true);
  });

  it('should handle lowercase codes', () => {
    const property = createMockProperty({ meta: { typeCode: 'flat', status: 'ACTIVE', housingCompany: {} } });
    expect(isApartment(property)).toBe(true);
  });

  it('should NOT identify OMAKOTITALO as apartment', () => {
    const property = createMockProperty({ meta: { typeCode: 'OMAKOTITALO', status: 'ACTIVE', housingCompany: {} } });
    expect(isApartment(property)).toBe(false);
  });
});

describe('isProperty', () => {
  it('should identify OMAKOTITALO as property', () => {
    const property = createMockProperty({ meta: { typeCode: 'OMAKOTITALO', status: 'ACTIVE', housingCompany: {} } });
    expect(isProperty(property)).toBe(true);
  });

  it('should identify DETACHED_HOUSE as property', () => {
    const property = createMockProperty({ meta: { typeCode: 'DETACHED_HOUSE', status: 'ACTIVE', housingCompany: {} } });
    expect(isProperty(property)).toBe(true);
  });

  it('should identify DETACHEDHOUSE (no underscore) as property', () => {
    const property = createMockProperty({ meta: { typeCode: 'DETACHEDHOUSE', status: 'ACTIVE', housingCompany: {} } });
    expect(isProperty(property)).toBe(true);
  });

  it('should identify COTTAGE_OR_VILLA as property', () => {
    const property = createMockProperty({ meta: { typeCode: 'COTTAGE_OR_VILLA', status: 'ACTIVE', housingCompany: {} } });
    expect(isProperty(property)).toBe(true);
  });

  it('should NOT identify FLAT as property', () => {
    const property = createMockProperty({ meta: { typeCode: 'FLAT', status: 'ACTIVE', housingCompany: {} } });
    expect(isProperty(property)).toBe(false);
  });
});

describe('isRental', () => {
  it('should identify property with rent as rental', () => {
    const property = createMockProperty({ 
      rental: { monthlyRent: 1200, petsAllowed: false, smokingAllowed: false } 
    });
    expect(isRental(property)).toBe(true);
  });

  it('should NOT identify property without rental object as rental', () => {
    const property = createMockProperty();
    expect(isRental(property)).toBe(false);
  });

  it('should NOT identify property with zero rent as rental', () => {
    const property = createMockProperty({ 
      rental: { monthlyRent: 0, petsAllowed: false, smokingAllowed: false } 
    });
    expect(isRental(property)).toBe(false);
  });
});

describe('getPropertyCategory', () => {
  it('should return "rental" for rental properties', () => {
    const property = createMockProperty({ 
      rental: { monthlyRent: 1200, petsAllowed: false, smokingAllowed: false } 
    });
    expect(getPropertyCategory(property)).toBe('rental');
  });

  it('should return "apartment" for apartments', () => {
    const property = createMockProperty({ meta: { typeCode: 'FLAT', status: 'ACTIVE', housingCompany: {} } });
    expect(getPropertyCategory(property)).toBe('apartment');
  });

  it('should return "property" for properties', () => {
    const property = createMockProperty({ meta: { typeCode: 'OMAKOTITALO', status: 'ACTIVE', housingCompany: {} } });
    expect(getPropertyCategory(property)).toBe('property');
  });

  it('should prioritize rental over apartment', () => {
    const property = createMockProperty({ 
      meta: { typeCode: 'FLAT', status: 'ACTIVE', housingCompany: {} },
      rental: { monthlyRent: 1200, petsAllowed: false, smokingAllowed: false } 
    });
    expect(getPropertyCategory(property)).toBe('rental');
  });
});

describe('shouldShowPropertyTax', () => {
  it('should return true for properties', () => {
    const property = createMockProperty({ meta: { typeCode: 'OMAKOTITALO', status: 'ACTIVE', housingCompany: {} } });
    expect(shouldShowPropertyTax(property)).toBe(true);
  });

  it('should return false for apartments', () => {
    const property = createMockProperty({ meta: { typeCode: 'FLAT', status: 'ACTIVE', housingCompany: {} } });
    expect(shouldShowPropertyTax(property)).toBe(false);
  });
});

describe('shouldShowCompanyInfo', () => {
  it('should return true for apartments', () => {
    const property = createMockProperty({ meta: { typeCode: 'FLAT', status: 'ACTIVE', housingCompany: {} } });
    expect(shouldShowCompanyInfo(property)).toBe(true);
  });

  it('should return false for properties', () => {
    const property = createMockProperty({ meta: { typeCode: 'OMAKOTITALO', status: 'ACTIVE', housingCompany: {} } });
    expect(shouldShowCompanyInfo(property)).toBe(false);
  });
});

