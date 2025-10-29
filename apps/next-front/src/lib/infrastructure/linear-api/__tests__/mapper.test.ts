import { describe, it, expect } from 'vitest';
import { LinearToPropertyMapper } from '../mapper';
import { LinearListing } from '../types';

describe('LinearToPropertyMapper', () => {
  const mapper = new LinearToPropertyMapper();

  it('maps loans & encumbrances correctly with Unicode spaces', () => {
    const listing: Partial<LinearListing> = {
      nonLocalizedValues: {
        id: 'test-1',
        askPrice: '1190000',
        debtFreePrice: '1190000'
      },
      address: { fi: { value: 'Testikatu 1' } },
      city: { fi: { value: 'Helsinki' } },
      postalCode: { fi: { value: '00100' } },
      housingCooperativeMortgage: { fi: { value: '1\u00a0625\u00a0002,18 €' } }, // NBSP
      companyLoans: { fi: { value: '1 462 587,91 €' } } // Regular space
    };

    const property = mapper.map(listing as LinearListing, 'fi');

    expect(property.meta.housingCompany.loans).toBe(1462587.91);
    expect(property.meta.housingCompany.encumbrances).toBe(1625002.18);
  });

  it('calculates debt correctly', () => {
    const listing: Partial<LinearListing> = {
      nonLocalizedValues: {
        id: 'test-2',
        askPrice: '500000',
        debtFreePrice: '650000'
      },
      address: { fi: { value: 'Testikatu 2' } },
      city: { fi: { value: 'Helsinki' } },
      postalCode: { fi: { value: '00100' } }
    };

    const property = mapper.map(listing as LinearListing, 'fi');

    expect(property.pricing.sales).toBe(500000);
    expect(property.pricing.debtFree).toBe(650000);
    expect(property.pricing.debt).toBe(150000);
  });

  it('handles elevator "Kyllä" correctly', () => {
    const listing: Partial<LinearListing> = {
      nonLocalizedValues: { id: 'test-3' },
      address: { fi: { value: 'Testikatu 3' } },
      city: { fi: { value: 'Helsinki' } },
      postalCode: { fi: { value: '00100' } },
      housingCooperativeElevator: { fi: { value: 'Kyllä' } }
    };

    const property = mapper.map(listing as LinearListing, 'fi');

    expect(property.meta.elevator).toBe(true);
  });

  it('handles missing Swedish translation gracefully', () => {
    const listing: Partial<LinearListing> = {
      nonLocalizedValues: { id: 'test-4' },
      address: { fi: { value: 'Testikatu 4' } },
      city: { fi: { value: 'Helsinki' } },
      postalCode: { fi: { value: '00100' } },
      typeOfApartment: { fi: { value: '3h+k' } } // No Swedish translation
    };

    const property = mapper.map(listing as LinearListing, 'sv');

    // Should fallback to Finnish
    expect(property.address.fi).toBe('Testikatu 4');
    expect(property.address.sv).toBeUndefined();
  });

  it('normalizes energy status correctly', () => {
    const testCases = [
      { input: 'Kyllä', expected: 'HAS_CERTIFICATE' as const },
      { input: 'Ei lain edellyttämää energiatodistusta', expected: 'NOT_REQUIRED_BY_LAW' as const },
      { input: 'Vapautettu energiatodistuslain nojalla', expected: 'EXEMPT_BY_ACT' as const },
      { input: '', expected: null }
    ];

    testCases.forEach(({ input, expected }) => {
      const listing: Partial<LinearListing> = {
        nonLocalizedValues: { id: `test-energy-${input}` },
        address: { fi: { value: 'Testikatu' } },
        city: { fi: { value: 'Helsinki' } },
        postalCode: { fi: { value: '00100' } },
        listingHasEnergyCertificate: { fi: { value: input } }
      };

      const property = mapper.map(listing as LinearListing, 'fi');
      expect(property.meta.energyCertStatus).toBe(expected);
    });
  });

  it('generates unique slugs with collision prevention', () => {
    const listings: Partial<LinearListing>[] = [
      {
        nonLocalizedValues: { id: 'test-5a' },
        address: { fi: { value: 'Mannerheimintie 1' } },
        city: { fi: { value: 'Helsinki' } },
        postalCode: { fi: { value: '00100' } }
      },
      {
        nonLocalizedValues: { id: 'test-5b' },
        address: { fi: { value: 'Mannerheimintie 1' } }, // Same address
        city: { fi: { value: 'Helsinki' } },
        postalCode: { fi: { value: '00200' } } // Different postal code
      }
    ];

    const property1 = mapper.map(listings[0] as LinearListing, 'fi');
    const property2 = mapper.map(listings[1] as LinearListing, 'fi');

    expect(property1.slug).toBe('mannerheimintie-1');
    expect(property2.slug).toContain('00200'); // Should include postal code
    expect(property1.slug).not.toBe(property2.slug);
  });

  it('handles various boolean inputs', () => {
    const testCases = [
      { input: 'Kyllä', expected: true },
      { input: 'Ja', expected: true },
      { input: 'Yes', expected: true },
      { input: '1', expected: true },
      { input: 'Ei', expected: false },
      { input: 'Nej', expected: false },
      { input: 'No', expected: false },
      { input: '0', expected: false },
      { input: 'unknown', expected: undefined }
    ];

    testCases.forEach(({ input, expected }) => {
      const listing: Partial<LinearListing> = {
        nonLocalizedValues: { id: `test-bool-${input}` },
        address: { fi: { value: 'Testikatu' } },
        city: { fi: { value: 'Helsinki' } },
        postalCode: { fi: { value: '00100' } },
        housingCooperativeElevator: { fi: { value: input } }
      };

      const property = mapper.map(listing as LinearListing, 'fi');
      expect(property.meta.elevator).toBe(expected);
    });
  });

  it('handles rental properties', () => {
    const listing: Partial<LinearListing> = {
      nonLocalizedValues: { id: 'test-rent' },
      address: { fi: { value: 'Vuokratalo 1' } },
      city: { fi: { value: 'Helsinki' } },
      postalCode: { fi: { value: '00100' } },
      rent: { fi: { value: '1500 €/kk' } }
    };

    const property = mapper.map(listing as LinearListing, 'fi');

    expect(property.meta.rent).toBe(1500);
  });
});

