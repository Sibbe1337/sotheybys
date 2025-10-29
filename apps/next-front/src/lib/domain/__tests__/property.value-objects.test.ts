import { describe, it, expect } from 'vitest';
import { parseEuro, Price, Area } from '../property.value-objects';

describe('parseEuro', () => {
  it('handles Unicode spaces (NBSP, thin space, etc.)', () => {
    expect(parseEuro('1\u00a0462\u00a0587,91 €')).toBe(1462587.91); // NBSP
    expect(parseEuro('1\u2009234\u2009567,89 €')).toBe(1234567.89); // Thin space
    expect(parseEuro('1 234 567,89 €')).toBe(1234567.89); // Regular space
  });

  it('handles various European number formats', () => {
    expect(parseEuro('142.951.999,45 €')).toBe(142951999.45);
    expect(parseEuro('1 234 567,89')).toBe(1234567.89);
    expect(parseEuro('550,55€/kk')).toBe(550.55);
    expect(parseEuro('344,44 €/kk')).toBe(344.44);
  });

  it('handles edge cases', () => {
    expect(parseEuro('0,00')).toBe(0);
    expect(parseEuro('-')).toBe(0);
    expect(parseEuro('')).toBe(0);
    expect(parseEuro(undefined)).toBe(0);
    expect(parseEuro(null)).toBe(0);
    expect(parseEuro(12345)).toBe(12345);
  });

  it('handles invalid input gracefully', () => {
    expect(parseEuro('abc')).toBe(0);
    expect(parseEuro('€€€')).toBe(0);
    expect(parseEuro('not-a-number')).toBe(0);
  });

  it('handles negative numbers', () => {
    expect(parseEuro('-1.234,56')).toBe(-1234.56);
    expect(parseEuro('-500 000,00 €')).toBe(-500000);
  });
});

describe('Price', () => {
  it('creates price from various inputs', () => {
    const price1 = Price.create('1 462 587,91 €');
    expect(price1.value).toBe(1462587.91);

    const price2 = Price.create('500000');
    expect(price2.value).toBe(500000);
  });

  it('throws on negative prices', () => {
    expect(() => new Price(-100)).toThrow('Price cannot be negative');
  });

  it('formats price correctly', () => {
    const price = new Price(1462587.91);
    expect(price.format('fi-FI')).toContain('462');
    expect(price.format('fi-FI')).toContain('€');
  });
});

describe('Area', () => {
  it('creates area from various inputs', () => {
    const area1 = Area.create('123,45 m²');
    expect(area1.value).toBe(123.45);

    const area2 = Area.create('100');
    expect(area2.value).toBe(100);
  });

  it('handles Unicode spaces in area', () => {
    const area = Area.create('123\u00a0456');
    expect(area.value).toBe(123456);
  });

  it('throws on negative area', () => {
    expect(() => new Area(-50)).toThrow('Area cannot be negative');
  });

  it('formats area correctly', () => {
    const area = new Area(123.45);
    expect(area.format('fi-FI')).toContain('123');
    expect(area.format('fi-FI')).toContain('m²');
  });
});

