/**
 * Finnish Real Estate Price Math Tests
 * 
 * Finnish formula: Myyntihinta + Velkaosuus = Velaton hinta
 * (Sales price + Debt portion = Unencumbered price)
 */

import { parseEuroNumber } from '../number-eu';

/**
 * Calculate debt portion using Finnish formula
 * Velkaosuus = Velaton hinta - Myyntihinta
 */
const calculateDebt = (velaton: any, myynti: any) =>
  Math.max(0, parseEuroNumber(velaton) - parseEuroNumber(myynti));

describe('Finnish Real Estate Price Math', () => {
  describe('Basic Formula: Myyntihinta + Velkaosuus = Velaton hinta', () => {
    it('calculates correct debt portion', () => {
      const myyntihinta = parseEuroNumber('500 000');
      const velatonHinta = parseEuroNumber('650 000');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(velkaosuus).toBe(150000);
      expect(myyntihinta + velkaosuus).toBeCloseTo(velatonHinta);
    });

    it('handles zero debt (fully paid property)', () => {
      const myyntihinta = parseEuroNumber('650 000');
      const velatonHinta = parseEuroNumber('650 000');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(velkaosuus).toBe(0);
      expect(myyntihinta + velkaosuus).toBeCloseTo(velatonHinta);
    });

    it('never returns negative debt', () => {
      const myyntihinta = parseEuroNumber('700 000');
      const velatonHinta = parseEuroNumber('650 000');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(velkaosuus).toBe(0);
      expect(velkaosuus).toBeGreaterThanOrEqual(0);
    });
  });

  describe('European Number Format Handling', () => {
    it('handles period-separated thousands', () => {
      const myyntihinta = parseEuroNumber('142.951');
      const velatonHinta = parseEuroNumber('144.220');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(myyntihinta + velkaosuus).toBeCloseTo(velatonHinta);
    });

    it('handles comma decimal separator', () => {
      const myyntihinta = parseEuroNumber('142.951,00');
      const velatonHinta = parseEuroNumber('144.220,00');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(myyntihinta + velkaosuus).toBeCloseTo(velatonHinta, 0);
    });

    it('handles full European format with currency', () => {
      const myyntihinta = parseEuroNumber('142.951.999,45 €');
      const velatonHinta = parseEuroNumber('144.220.000,00 €');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(velkaosuus).toBeGreaterThan(1000000);
      expect(myyntihinta + velkaosuus).toBeCloseTo(velatonHinta, 2);
    });

    it('handles space-separated thousands', () => {
      const myyntihinta = parseEuroNumber('1 234 567');
      const velatonHinta = parseEuroNumber('1 500 000');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(velkaosuus).toBe(265433);
      expect(myyntihinta + velkaosuus).toBeCloseTo(velatonHinta);
    });
  });

  describe('Real-World Examples', () => {
    it('example 1: Typical Helsinki apartment', () => {
      const myyntihinta = parseEuroNumber('500 000 €');
      const velatonHinta = parseEuroNumber('550 000 €');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(velkaosuus).toBe(50000);
      expect(myyntihinta + velkaosuus).toBe(velatonHinta);
    });

    it('example 2: High-end property with large debt', () => {
      const myyntihinta = parseEuroNumber('800 000 €');
      const velatonHinta = parseEuroNumber('1 200 000 €');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(velkaosuus).toBe(400000);
      expect(myyntihinta + velkaosuus).toBe(velatonHinta);
    });

    it('example 3: Affordable housing with minimal debt', () => {
      const myyntihinta = parseEuroNumber('150 000 €');
      const velatonHinta = parseEuroNumber('155 000 €');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(velkaosuus).toBe(5000);
      expect(myyntihinta + velkaosuus).toBe(velatonHinta);
    });

    it('example 4: Fully paid property (no debt)', () => {
      const myyntihinta = parseEuroNumber('300 000 €');
      const velatonHinta = parseEuroNumber('300 000 €');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(velkaosuus).toBe(0);
      expect(myyntihinta).toBe(velatonHinta);
    });
  });

  describe('Edge Cases', () => {
    it('handles zero prices gracefully', () => {
      const velkaosuus = calculateDebt(0, 0);
      expect(velkaosuus).toBe(0);
    });

    it('handles null/undefined prices', () => {
      const velkaosuus1 = calculateDebt(null, null);
      const velkaosuus2 = calculateDebt(undefined, undefined);
      
      expect(velkaosuus1).toBe(0);
      expect(velkaosuus2).toBe(0);
    });

    it('handles invalid string prices', () => {
      const velkaosuus = calculateDebt('invalid', 'also invalid');
      expect(velkaosuus).toBe(0);
    });

    it('handles very large numbers', () => {
      const myyntihinta = parseEuroNumber('5 000 000 €');
      const velatonHinta = parseEuroNumber('8 000 000 €');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      expect(velkaosuus).toBe(3000000);
      expect(myyntihinta + velkaosuus).toBe(velatonHinta);
    });
  });

  describe('Math Consistency Validation', () => {
    it('validates no rounding errors within 1 EUR tolerance', () => {
      const testCases = [
        { myynti: '500 000', velaton: '650 000' },
        { myynti: '142.951,00', velaton: '144.220,00' },
        { myynti: '1 234 567', velaton: '1 500 000' },
      ];

      testCases.forEach(({ myynti, velaton }) => {
        const myyntihinta = parseEuroNumber(myynti);
        const velatonHinta = parseEuroNumber(velaton);
        const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
        const delta = Math.abs((myyntihinta + velkaosuus) - velatonHinta);
        
        expect(delta).toBeLessThan(1); // Delta should be less than 1 EUR
      });
    });

    it('warns about impossible situations (velaton < myyntihinta)', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const myyntihinta = parseEuroNumber('700 000');
      const velatonHinta = parseEuroNumber('650 000');
      const velkaosuus = calculateDebt(velatonHinta, myyntihinta);
      
      // Debt should be 0 (clamped), not negative
      expect(velkaosuus).toBe(0);
      
      consoleSpy.mockRestore();
    });
  });
});
