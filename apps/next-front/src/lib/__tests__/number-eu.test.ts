import { parseEuroNumber, formatEuroCurrency, formatFinnishNumber } from '../number-eu';

describe('parseEuroNumber', () => {
  test.each([
    ['142.951.999,45 €', 142951999.45],
    ['1 234 567,89', 1234567.89],
    ['550,55€/kk', 550.55],
    ['344,44 €/kk', 344.44],
    ['0,00', 0],
    ['-', 0],
    ['', 0],
    [undefined, 0],
    [null, 0],
    [12345, 12345],
    ['142.951.999', 142951999],
    ['999,45', 999.45],
    ['1 000 000', 1000000],
    ['500 000', 500000],
    ['650 000', 650000],
    ['142.951,00', 142951],
    ['144.220,00', 144220],
  ])('parses %p → %p', (input, expected) => {
    expect(parseEuroNumber(input as any)).toBeCloseTo(expected, 6);
  });

  it('handles NaN gracefully', () => {
    expect(parseEuroNumber('abc')).toBe(0);
    expect(parseEuroNumber('€€€')).toBe(0);
  });

  it('handles negative numbers', () => {
    expect(parseEuroNumber('-1.234,56')).toBeCloseTo(-1234.56);
  });
});

describe('formatEuroCurrency', () => {
  it('formats Finnish currency', () => {
    expect(formatEuroCurrency(142951999)).toBe('142 951 999 €');
    expect(formatEuroCurrency(500000)).toBe('500 000 €');
    expect(formatEuroCurrency(0)).toBe('0 €');
  });

  it('parses and formats strings', () => {
    expect(formatEuroCurrency('142.951.999,45 €')).toBe('142 951 999 €');
    expect(formatEuroCurrency('550,55')).toBe('551 €'); // Rounded
  });

  it('handles null/undefined', () => {
    expect(formatEuroCurrency(null)).toBe('0 €');
    expect(formatEuroCurrency(undefined)).toBe('0 €');
  });
});

describe('formatFinnishNumber', () => {
  it('formats numbers with Finnish locale', () => {
    expect(formatFinnishNumber(142951999)).toBe('142 951 999');
    expect(formatFinnishNumber(550.55, 2)).toBe('550,55');
  });

  it('handles decimals parameter', () => {
    expect(formatFinnishNumber(1234.5678, 0)).toBe('1 235'); // Rounded
    expect(formatFinnishNumber(1234.5678, 2)).toBe('1 234,57');
  });
});

