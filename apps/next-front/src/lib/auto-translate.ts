/**
 * Automatic Translation Service
 * Provides fallback translations when content is only available in Finnish
 */

import type { Locale } from '@/i18n/config';

// For backward compatibility
export type SupportedLanguage = Locale;

// Simple in-memory cache for translations
const translationCache = new Map<string, string>();

/**
 * Generate cache key for translation
 */
function getCacheKey(text: string, from: string, to: string): string {
  // Use first 100 chars + hash for cache key to avoid huge keys
  const textPreview = text.substring(0, 100);
  return `${from}-${to}-${textPreview}`;
}

/**
 * Simple Finnish to Swedish translation fallback
 * This is a basic implementation - in production, use a proper translation API
 */
async function translateFiToSv(text: string): Promise<string> {
  if (!text) return text;
  
  // Common real estate terms mapping (Finnish → Swedish)
  const commonTerms: Record<string, string> = {
    // Property types
    'asunto': 'lägenhet',
    'huoneisto': 'lägenhet',
    'talo': 'hus',
    'omakotitalo': 'villa',
    'rivitalo': 'radhus',
    'kerrostalo': 'flerbostadshus',
    
    // Rooms
    'keittiö': 'kök',
    'makuuhuone': 'sovrum',
    'olohuone': 'vardagsrum',
    'kylpyhuone': 'badrum',
    'sauna': 'bastu',
    'parveke': 'balkong',
    'terassi': 'terrass',
    
    // Features
    'hissi': 'hiss',
    'autotalli': 'garage',
    'piha': 'gård',
    'kellari': 'källare',
    
    // Descriptions
    'valoisa': 'ljus',
    'tilava': 'rymlig',
    'moderni': 'modern',
    'uusi': 'ny',
    'kaunis': 'vacker',
    'sijainti': 'läge',
    'keskusta': 'centrum',
    
    // Common phrases
    'hyvä': 'bra',
    'erinomainen': 'utmärkt',
    'loistava': 'fantastisk',
    'upea': 'underbar',
  };
  
  let translated = text;
  
  // Replace common terms (case-insensitive)
  for (const [fi, sv] of Object.entries(commonTerms)) {
    const regex = new RegExp(`\\b${fi}\\b`, 'gi');
    translated = translated.replace(regex, (match) => {
      // Preserve capitalization
      if (match[0] === match[0].toUpperCase()) {
        return sv.charAt(0).toUpperCase() + sv.slice(1);
      }
      return sv;
    });
  }
  
  // Add note about automatic translation
  if (translated !== text) {
    return translated;
  }
  
  return text;
}

/**
 * Simple Finnish to English translation fallback
 */
async function translateFiToEn(text: string): Promise<string> {
  if (!text) return text;
  
  // Common real estate terms mapping (Finnish → English)
  const commonTerms: Record<string, string> = {
    // Property types
    'asunto': 'apartment',
    'huoneisto': 'apartment',
    'talo': 'house',
    'omakotitalo': 'detached house',
    'rivitalo': 'townhouse',
    'kerrostalo': 'apartment building',
    
    // Rooms
    'keittiö': 'kitchen',
    'makuuhuone': 'bedroom',
    'olohuone': 'living room',
    'kylpyhuone': 'bathroom',
    'sauna': 'sauna',
    'parveke': 'balcony',
    'terassi': 'terrace',
    
    // Features
    'hissi': 'elevator',
    'autotalli': 'garage',
    'piha': 'yard',
    'kellari': 'basement',
    
    // Descriptions
    'valoisa': 'bright',
    'tilava': 'spacious',
    'moderni': 'modern',
    'uusi': 'new',
    'kaunis': 'beautiful',
    'sijainti': 'location',
    'keskusta': 'city center',
    
    // Common phrases
    'hyvä': 'good',
    'erinomainen': 'excellent',
    'loistava': 'great',
    'upea': 'wonderful',
  };
  
  let translated = text;
  
  // Replace common terms (case-insensitive)
  for (const [fi, en] of Object.entries(commonTerms)) {
    const regex = new RegExp(`\\b${fi}\\b`, 'gi');
    translated = translated.replace(regex, (match) => {
      // Preserve capitalization
      if (match[0] === match[0].toUpperCase()) {
        return en.charAt(0).toUpperCase() + en.slice(1);
      }
      return en;
    });
  }
  
  return translated;
}

/**
 * Translate text with caching
 */
export async function translateText(
  text: string,
  targetLanguage: SupportedLanguage,
  sourceLanguage: SupportedLanguage = 'fi'
): Promise<string> {
  if (!text || targetLanguage === sourceLanguage) {
    return text;
  }
  
  // Check cache first
  const cacheKey = getCacheKey(text, sourceLanguage, targetLanguage);
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  let translated = text;
  
  try {
    // Translate based on target language
    if (sourceLanguage === 'fi' && targetLanguage === 'sv') {
      translated = await translateFiToSv(text);
    } else if (sourceLanguage === 'fi' && targetLanguage === 'en') {
      translated = await translateFiToEn(text);
    }
    // Add more language pairs as needed
    
    // Cache the result
    translationCache.set(cacheKey, translated);
    
  } catch (error) {
    console.warn('Translation failed:', error);
    // Return original text on error
    return text;
  }
  
  return translated;
}

/**
 * Check if we should show translation disclaimer
 */
export function needsTranslationDisclaimer(
  originalText: string,
  translatedText: string
): boolean {
  // If text changed significantly, show disclaimer
  return originalText !== translatedText && translatedText.length > 50;
}

