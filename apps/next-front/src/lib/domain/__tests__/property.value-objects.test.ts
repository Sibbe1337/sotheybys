/**
 * Tests for Property Value Objects
 * 
 * Per spec: Unicode-safe parseEuro, Area formatting
 */

import { describe, it, expect } from 'vitest';
import { parseEuro, Area } from '../property.value-objects';

describe('parseEuro', () => {
  it('should parse standard euro format', () => {
    expect(parseEuro('300 000 €')).toBe(300000);
    expect(parseEuro('1 500 €')).toBe(1500);
    expect(parseEuro('50 €')).toBe(50);
  });

  it('should parse with comma decimals', () => {
    expect(parseEuro('300 000,50 €')).toBe(300000.5);
    expect(parseEuro('1 234,56 €')).toBe(1234.56);
  });

  it('should handle various Unicode spaces', () => {
    expect(parseEuro('300\u0020000 €')).toBe(300000); // Regular space
    expect(parseEuro('300\u00A0000 €')).toBe(300000); // Non-breaking space
    expect(parseEuro('300\u2009000 €')).toBe(300000); // Thin space
    expect(parseEuro('300\u202F000 €')).toBe(300000); // Narrow no-break space
  });

  it('should handle strings without euro symbol', () => {
    expect(parseEuro('300 000')).toBe(300000);
    expect(parseEuro('1234,56')).toBe(1234.56);
  });

  it('should handle plain numbers', () => {
    expect(parseEuro('300000')).toBe(300000);
    expect(parseEuro('1234.56')).toBe(1234.56);
  });

  it('should return 0 for invalid input', () => {
    expect(parseEuro('abc')).toBe(0);
    expect(parseEuro('')).toBe(0);
    expect(parseEuro('   ')).toBe(0);
  });

  it('should return 0 for undefined/null', () => {
    expect(parseEuro(undefined)).toBe(0);
    expect(parseEuro(null as any)).toBe(0);
  });

  it('should handle negative values', () => {
    expect(parseEuro('-1 500 €')).toBe(-1500);
    expect(parseEuro('-1234,56 €')).toBe(-1234.56);
  });
});

describe('Area.create', () => {
  it('should create area with m²', () => {
    const area = Area.create(75, 'm²');
    expect(area.value).toBe(75);
    expect(area.unit).toBe('m²');
    expect(area.toString()).toBe('75 m²');
  });

  it('should create area with ha', () => {
    const area = Area.create(2.5, 'ha');
    expect(area.value).toBe(2.5);
    expect(area.unit).toBe('ha');
    expect(area.toString()).toBe('2.5 ha');
  });

  it('should format with correct precision', () => {
    const area1 = Area.create(75.5, 'm²');
    expect(area1.toString()).toBe('75.5 m²');
    
    const area2 = Area.create(75.123, 'm²');
    expect(area2.toString()).toBe('75.123 m²');
  });

  it('should handle zero value', () => {
    const area = Area.create(0, 'm²');
    expect(area.toString()).toBe('0 m²');
  });

  it('should convert large m² to ha', () => {
    // For plot areas >= 10,000 m², we typically convert to ha
    const largeArea = 25000; // m²
    const inHectares = largeArea / 10000;
    const area = Area.create(inHectares, 'ha');
    expect(area.toString()).toBe('2.5 ha');
  });
});

describe('Area edge cases', () => {
  it('should handle very small values', () => {
    const area = Area.create(0.01, 'm²');
    expect(area.value).toBe(0.01);
  });

  it('should handle very large values', () => {
    const area = Area.create(999999, 'm²');
    expect(area.value).toBe(999999);
  });

  it('should maintain precision for hectares', () => {
    const area = Area.create(2.456789, 'ha');
    expect(area.value).toBeCloseTo(2.456789, 6);
  });
});
