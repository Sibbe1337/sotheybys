/**
 * Tests for Locale Utilities
 * 
 * Per spec: Strict locale enforcement, no silent FI fallback
 */

import { describe, it, expect } from 'vitest';
import { 
  lpickStrict, 
  lpickWithFallback, 
  lpickWithIndicator, 
  getPlaceholder 
} from '../locale-utils';
import type { LocalizedValue, Locale } from '../property.types';

describe('lpickStrict', () => {
  it('should return requested locale value when available', () => {
    const lv: LocalizedValue = { fi: 'Suomi', sv: 'Sverige', en: 'Finland' };
    expect(lpickStrict(lv, 'sv')).toBe('Sverige');
    expect(lpickStrict(lv, 'en')).toBe('Finland');
    expect(lpickStrict(lv, 'fi')).toBe('Suomi');
  });

  it('should return placeholder when locale missing (NO FI fallback)', () => {
    const lv: LocalizedValue = { fi: 'Suomi', sv: undefined, en: undefined };
    expect(lpickStrict(lv, 'sv')).toBe('Uppgift saknas');
    expect(lpickStrict(lv, 'en')).toBe('Information unavailable');
  });

  it('should return empty string for undefined input', () => {
    expect(lpickStrict(undefined, 'fi')).toBe('');
  });

  it('should return placeholder for empty string value', () => {
    const lv: LocalizedValue = { fi: 'Suomi', sv: '', en: '   ' };
    expect(lpickStrict(lv, 'sv')).toBe('Uppgift saknas');
    expect(lpickStrict(lv, 'en')).toBe('Information unavailable');
  });
});

describe('lpickWithFallback', () => {
  it('should use FI fallback when allowFiFallback is true', () => {
    const lv: LocalizedValue = { fi: 'Suomi', sv: undefined, en: undefined };
    expect(lpickWithFallback(lv, 'sv', true)).toBe('Suomi');
    expect(lpickWithFallback(lv, 'en', true)).toBe('Suomi');
  });

  it('should NOT use FI fallback when allowFiFallback is false', () => {
    const lv: LocalizedValue = { fi: 'Suomi', sv: undefined, en: undefined };
    expect(lpickWithFallback(lv, 'sv', false)).toBe('Uppgift saknas');
    expect(lpickWithFallback(lv, 'en', false)).toBe('Information unavailable');
  });

  it('should prefer requested locale over FI fallback', () => {
    const lv: LocalizedValue = { fi: 'Suomi', sv: 'Sverige', en: undefined };
    expect(lpickWithFallback(lv, 'sv', true)).toBe('Sverige');
  });
});

describe('lpickWithIndicator', () => {
  it('should indicate when value is missing', () => {
    const lv: LocalizedValue = { fi: 'Suomi', sv: undefined, en: undefined };
    
    const result = lpickWithIndicator(lv, 'sv');
    expect(result.isMissing).toBe(true);
    expect(result.value).toBe('Suomi'); // Falls back to FI
  });

  it('should indicate when value is present', () => {
    const lv: LocalizedValue = { fi: 'Suomi', sv: 'Sverige', en: 'Finland' };
    
    const result = lpickWithIndicator(lv, 'sv');
    expect(result.isMissing).toBe(false);
    expect(result.value).toBe('Sverige');
  });
});

describe('getPlaceholder', () => {
  it('should return correct placeholder for each locale', () => {
    expect(getPlaceholder('fi')).toBe('Tieto puuttuu');
    expect(getPlaceholder('sv')).toBe('Uppgift saknas');
    expect(getPlaceholder('en')).toBe('Information unavailable');
  });
});

