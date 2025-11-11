/**
 * HYRESOBJEKT & KOMMERSIELLA LOKALER TESTS
 * Dennis 2025-11-11
 * 
 * Comprehensive tests for rental and commercial property display
 * according to Hyresobjekt.pdf requirements
 */

import { describe, it, expect } from 'vitest';
import { isCommercial } from '../domain/property-type-helpers';
import { PropertyVM } from '../presentation/property.view-model';
import { fmtFee } from '../presentation/formatters/fees';
import { getEnergyStatusLabel } from '../domain/energy';
import type { Property } from '../domain/property.types';
import type { EnergyStatus } from '../domain/energy';

describe('Rental & Commercial Properties', () => {
  
  // ========================================
  // 1. COMMERCIAL PROPERTIES: Business Area Display
  // ========================================
  describe('Commercial Properties - Business Area', () => {
    it('should show businessArea for commercial properties', () => {
      const commercialProperty: Partial<Property> = {
        id: 'office-1',
        slug: 'office-korkeavuorenkatu',
        address: { fi: 'Korkeavuorenkatu', sv: 'Korkeavuorenkatu', en: 'Korkeavuorenkatu' },
        gate: '1',
        city: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
        postalCode: '00100',
        district: { fi: 'Keskusta', sv: 'Centrum', en: 'Downtown' },
        
        meta: {
          typeCode: 'OFFICE_SPACE',  // Commercial property
          listingTypeLabel: { fi: 'Toimistotila', sv: 'Kontorsutrymme', en: 'Office Space' }
        },
        
        dimensions: {
          living: 0,        // Commercial doesn't have living area
          business: 180,    // Business premises area = 180 m²
          total: 200
        },
        
        pricing: { sales: 250000, debtFree: 250000, debt: 0 },
        fees: {},
        features: {},
        media: { images: [] }
      } as Property;
      
      const vm = PropertyVM.toCard(commercialProperty as Property, 'sv');
      
      // Should show businessArea (180 m²), NOT livingArea
      expect(vm.area).toContain('180');
      expect(vm.area).toContain('m²');
    });
    
    it('should use totalArea as fallback if businessArea is missing', () => {
      const commercialProperty: Partial<Property> = {
        id: 'office-2',
        slug: 'office-mannerheimintie',
        address: { fi: 'Mannerheimintie', sv: 'Mannerheimvägen', en: 'Mannerheimintie' },
        city: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
        postalCode: '00100',
        
        meta: {
          typeCode: 'OFFICE',
          listingTypeLabel: { fi: 'Toimistotila', sv: 'Kontorsutrymme', en: 'Office Space' }
        },
        
        dimensions: {
          living: 0,
          business: undefined,  // Missing businessArea
          total: 250            // Should use total as fallback
        },
        
        pricing: { sales: 300000, debtFree: 300000, debt: 0 },
        fees: {},
        features: {},
        media: { images: [] }
      } as Property;
      
      const vm = PropertyVM.toCard(commercialProperty as Property, 'fi');
      
      // Should show totalArea as fallback (250 m²)
      expect(vm.area).toContain('250');
    });
  });
  
  // ========================================
  // 2. RENTAL PROPERTIES: Living + Total Area
  // ========================================
  describe('Rental Properties - Living + Total Area', () => {
    it('should show both livingArea and totalArea for rentals', () => {
      const rentalProperty: Partial<Property> = {
        id: 'rental-1',
        slug: 'rental-mannerheimintie',
        address: { fi: 'Mannerheimintie', sv: 'Mannerheimvägen', en: 'Mannerheimintie' },
        city: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
        postalCode: '00100',
        
        meta: {
          typeCode: 'FLAT',
          rent: 3840,  // Indicates rental property
          listingTypeLabel: { fi: 'Kerrostalo', sv: 'Höghus', en: 'Apartment' }
        },
        
        dimensions: {
          living: 141,      // Living area = 141 m²
          total: 185        // Total area = 185 m²
        },
        
        pricing: { sales: 0, debtFree: 0, debt: 0 },
        fees: {},
        features: {},
        media: { images: [] },
        rental: {
          monthlyRent: 3840,
          securityDeposit: '2 månaders hyra',
          contractType: { fi: 'Toistaiseksi voimassa oleva', sv: 'Tills vidare', en: 'Indefinite' }
        }
      } as Property;
      
      const vmFi = PropertyVM.toCard(rentalProperty as Property, 'fi');
      const vmSv = PropertyVM.toCard(rentalProperty as Property, 'sv');
      const vmEn = PropertyVM.toCard(rentalProperty as Property, 'en');
      
      // Should show livingArea
      expect(vmFi.area).toContain('141');
      
      // Should ALSO show totalArea in areaExtra
      expect(vmFi.areaExtra).toBeDefined();
      expect(vmFi.areaExtra).toContain('185');
      
      // All locales should work
      expect(vmSv.area).toContain('141');
      expect(vmSv.areaExtra).toContain('185');
      expect(vmEn.area).toContain('141');
      expect(vmEn.areaExtra).toContain('185');
    });
    
    it('should only show livingArea if totalArea is missing', () => {
      const rentalProperty: Partial<Property> = {
        id: 'rental-2',
        slug: 'rental-small',
        address: { fi: 'Mannerheimintie', sv: 'Mannerheimvägen', en: 'Mannerheimintie' },
        city: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
        postalCode: '00100',
        
        meta: {
          typeCode: 'FLAT',
          rent: 1200,
          listingTypeLabel: { fi: 'Kerrostalo', sv: 'Höghus', en: 'Apartment' }
        },
        
        dimensions: {
          living: 55,       // Only living area
          total: undefined  // No total area
        },
        
        pricing: { sales: 0, debtFree: 0, debt: 0 },
        fees: {},
        features: {},
        media: { images: [] },
        rental: {
          monthlyRent: 1200,
          contractType: { fi: 'Toistaiseksi voimassa oleva', sv: 'Tills vidare', en: 'Indefinite' }
        }
      } as Property;
      
      const vm = PropertyVM.toCard(rentalProperty as Property, 'sv');
      
      // Should show livingArea
      expect(vm.area).toContain('55');
      
      // Should NOT have areaExtra (totalArea missing)
      expect(vm.areaExtra).toBe(undefined);
    });
  });
  
  // ========================================
  // 3. SECURITY DEPOSIT Display
  // ========================================
  describe('Security Deposit Display', () => {
    it('should format security deposit correctly in VM', () => {
      const rentalProperty: Partial<Property> = {
        id: 'rental-3',
        slug: 'rental-with-deposit',
        address: { fi: 'Mannerheimintie', sv: 'Mannerheimvägen', en: 'Mannerheimintie' },
        city: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
        postalCode: '00100',
        
        meta: {
          typeCode: 'FLAT',
          rent: 3840,
          listingTypeLabel: { fi: 'Kerrostalo', sv: 'Höghus', en: 'Apartment' }
        },
        
        dimensions: { living: 141, total: 185 },
        pricing: { sales: 0, debtFree: 0, debt: 0 },
        fees: {},
        features: {},
        media: { images: [] },
        rental: {
          monthlyRent: 3840,
          securityDeposit: '2 månaders hyra',  // Text-based deposit
          contractType: { fi: 'Toistaiseksi voimassa oleva', sv: 'Tills vidare', en: 'Indefinite' }
        }
      } as Property;
      
      const vm = PropertyVM.toDetail(rentalProperty as Property, 'sv');
      
      // Security deposit should be present
      expect(vm.rental?.securityDeposit).toBeDefined();
      expect(vm.rental?.securityDeposit).toContain('2 månaders hyra');
    });
  });
  
  // ========================================
  // 4. ENERGY CERTIFICATE - English Display
  // ========================================
  describe('Energy Certificate Display', () => {
    it('should show energy status in English correctly', () => {
      const statuses: EnergyStatus[] = [
        'HAS_CERTIFICATE',
        'NOT_REQUIRED_BY_LAW',
        'EXEMPT_BY_ACT'
      ];
      
      const expectedLabels = [
        'Yes',
        'Not required by law',
        'Exempt by Act'
      ];
      
      statuses.forEach((status, index) => {
        const label = getEnergyStatusLabel(status, 'en');
        expect(label).toBe(expectedLabels[index]);
      });
    });
    
    it('should show energy status in Swedish correctly', () => {
      expect(getEnergyStatusLabel('HAS_CERTIFICATE', 'sv')).toBe('Ja');
      expect(getEnergyStatusLabel('NOT_REQUIRED_BY_LAW', 'sv')).toBe('Inget lagstadgat energicertifikat');
      expect(getEnergyStatusLabel('EXEMPT_BY_ACT', 'sv')).toBe('Undantagen enligt energicertifikatlagen');
    });
    
    it('should show energy status in Finnish correctly', () => {
      expect(getEnergyStatusLabel('HAS_CERTIFICATE', 'fi')).toBe('Kyllä');
      expect(getEnergyStatusLabel('NOT_REQUIRED_BY_LAW', 'fi')).toBe('Ei lain edellyttämää energiatodistusta');
      expect(getEnergyStatusLabel('EXEMPT_BY_ACT', 'fi')).toBe('Vapautettu energiatodistuslain nojalla');
    });
  });
  
  // ========================================
  // 5. ENGLISH CURRENCY FORMATTING
  // ========================================
  describe('English Currency Formatting', () => {
    it('should format monthly rent without decimals', () => {
      const rent = 3840;
      
      const formatted = fmtFee(rent, 'en-GB');
      
      // Should be "€3,840/month" (NO .00 decimals)
      expect(formatted).toContain('3,840');
      expect(formatted).toContain('/month');
      expect(formatted).not.toContain('.00');
    });
    
    it('should format rent correctly for all locales', () => {
      const rent = 1500;
      
      const fiFmt = fmtFee(rent, 'fi-FI');
      const svFmt = fmtFee(rent, 'sv-SE');
      const enFmt = fmtFee(rent, 'en-GB');
      
      // Finnish: "1 500 €/kk"
      expect(fiFmt).toContain('1');
      expect(fiFmt).toContain('500');
      expect(fiFmt).toContain('/kk');
      
      // Swedish: "1 500 kr/månad" or "1 500 €/månad"
      expect(svFmt).toContain('1');
      expect(svFmt).toContain('500');
      expect(svFmt).toContain('/månad');
      
      // English: "€1,500/month" (comma as thousands separator, NO .00)
      expect(enFmt).toContain('1,500');
      expect(enFmt).toContain('/month');
      expect(enFmt).not.toContain('.00');
    });
    
    it('should handle large rents correctly in English', () => {
      const rent = 12500;
      
      const formatted = fmtFee(rent, 'en-GB');
      
      // Should be "€12,500/month"
      expect(formatted).toContain('12,500');
      expect(formatted).toContain('/month');
      expect(formatted).not.toContain('.00');
    });
  });
  
  // ========================================
  // 6. COMMERCIAL PROPERTY TYPE DETECTION
  // ========================================
  describe('Commercial Property Type Detection', () => {
    it('should detect office spaces as commercial', () => {
      const commercialCodes = [
        'OFFICE',
        'OFFICE_SPACE',
        'TOIMISTO',
        'TOIMISTOTILA',
        'LIIKEHUONEISTO',
        'COMMERCIAL_PROPERTY',
        'AFFÄRSLOKAL'
      ];
      
      commercialCodes.forEach((code) => {
        const property: Partial<Property> = {
          id: `commercial-${code}`,
          slug: 'commercial-test',
          address: { fi: 'Test', sv: 'Test', en: 'Test' },
          city: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
          postalCode: '00100',
          meta: {
            typeCode: code,
            listingTypeLabel: { fi: 'Toimistotila', sv: 'Kontorsutrymme', en: 'Office Space' }
          },
          dimensions: { living: 0, business: 150 },
          pricing: { sales: 200000, debtFree: 200000, debt: 0 },
          fees: {},
          features: {},
          media: { images: [] }
        } as Property;
        
        expect(isCommercial(property as Property)).toBe(true);
      });
    });
    
    it('should NOT detect apartments as commercial', () => {
      const apartmentCodes = ['FLAT', 'KERROSTALO', 'APARTMENT_BUILDING'];
      
      apartmentCodes.forEach((code) => {
        const property: Partial<Property> = {
          id: `apartment-${code}`,
          slug: 'apartment-test',
          address: { fi: 'Test', sv: 'Test', en: 'Test' },
          city: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
          postalCode: '00100',
          meta: {
            typeCode: code,
            listingTypeLabel: { fi: 'Kerrostalo', sv: 'Höghus', en: 'Apartment' }
          },
          dimensions: { living: 85 },
          pricing: { sales: 350000, debtFree: 350000, debt: 0 },
          fees: {},
          features: {},
          media: { images: [] }
        } as Property;
        
        expect(isCommercial(property as Property)).toBe(false);
      });
    });
  });
  
  // ========================================
  // 7. EDGE CASES
  // ========================================
  describe('Edge Cases', () => {
    it('should show "—" for missing data instead of "0 €"', () => {
      // This is handled in the Field component with alwaysShow=true
      // Test that formatters return empty string for 0/undefined
      expect(fmtFee(0, 'en-GB')).toBe('');
      expect(fmtFee(undefined, 'en-GB')).toBe('');
    });
    
    it('should handle commercial property without businessArea but with totalArea', () => {
      const commercialProperty: Partial<Property> = {
        id: 'commercial-edge',
        slug: 'commercial-no-business-area',
        address: { fi: 'Test', sv: 'Test', en: 'Test' },
        city: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
        postalCode: '00100',
        
        meta: {
          typeCode: 'OFFICE_SPACE',
          listingTypeLabel: { fi: 'Toimistotila', sv: 'Kontorsutrymme', en: 'Office Space' }
        },
        
        dimensions: {
          living: 0,
          business: undefined,  // Missing businessArea
          total: 300            // Should use totalArea as fallback
        },
        
        pricing: { sales: 400000, debtFree: 400000, debt: 0 },
        fees: {},
        features: {},
        media: { images: [] }
      } as Property;
      
      const vm = PropertyVM.toCard(commercialProperty as Property, 'sv');
      
      // Should show totalArea (300 m²) as fallback
      expect(vm.area).toContain('300');
    });
  });
});

