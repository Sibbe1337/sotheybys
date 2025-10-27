import {
  getLocalizedText,
  parseEuroAmount,
  formatBooleanLabel,
  pickFirstNonEmpty,
  quickTranslate,
} from '../property-display';

import { getTranslation } from '../property-translations';

describe('property-display utilities', () => {
  describe('getLocalizedText', () => {
    it('returns direct string for Finnish by default', () => {
      expect(getLocalizedText('Kaunis koti', 'fi')).toBe('Kaunis koti');
    });

    it('falls back to translating Finnish when Swedish is missing', () => {
      const value = { fi: 'Kaunis koti' };
      expect(getLocalizedText(value, 'sv')).toBe('Kaunis hem');
      expect(getLocalizedText(value, 'en')).toBe('Beautiful home');
    });

    it('unwraps nested { value } objects', () => {
      const value = { fi: { value: 'Kauppakeskus' } };
      expect(getLocalizedText(value, 'fi')).toBe('Kauppakeskus');
    });

    it('joins array values', () => {
      const value = ['Ensiluokkainen', { fi: 'valaistus' }];
      expect(getLocalizedText(value, 'fi')).toBe('Ensiluokkainen, valaistus');
    });
  });

  describe('parseEuroAmount', () => {
    it('parses plain numbers', () => {
      expect(parseEuroAmount('1 234 567,89 €')).toBe(1234567.89);
      expect(parseEuroAmount('99.95')).toBe(99.95);
    });

    it('returns null for invalid strings', () => {
      expect(parseEuroAmount('not-a-number')).toBeNull();
    });
  });

  describe('formatBooleanLabel', () => {
    it('translates yes/no based on language', () => {
      expect(formatBooleanLabel(true, 'fi')).toBe(getTranslation('yes', 'fi'));
      expect(formatBooleanLabel(false, 'sv')).toBe(getTranslation('no', 'sv'));
    });

    it('returns dash for unknown values', () => {
      expect(formatBooleanLabel('', 'en')).toBe('—');
    });
  });

  describe('pickFirstNonEmpty', () => {
    it('returns the first non-empty string', () => {
      expect(pickFirstNonEmpty('', ' ', 'value')).toBe('value');
    });

    it('handles numbers and arrays', () => {
      expect(pickFirstNonEmpty(null, 0, 42)).toBe(0); // zero is returned since not null
      expect(pickFirstNonEmpty(null, [], ['A'])).toEqual(['A']);
    });
  });

  describe('quickTranslate', () => {
    it('translates known Finnish terms to Swedish and English', () => {
      expect(quickTranslate('valoisa asunto', 'sv')).toContain('lägenhet');
      expect(quickTranslate('valoisa asunto', 'en')).toContain('apartment');
    });
  });
});
