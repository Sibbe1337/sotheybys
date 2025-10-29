import { log } from '@/lib/logger';

/**
 * Normalize string for slug generation
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Build unique slug with collision prevention
 */
export function buildSlug(
  address: string,
  options?: {
    postalCode?: string;
    city?: string;
    existingSlugs?: Set<string>;
  }
): string {
  const base = normalize(address);
  
  if (!options?.existingSlugs?.has(base)) {
    return base;
  }
  
  // Collision detected - add postal code
  if (options.postalCode) {
    const withPostal = `${base}-${normalize(options.postalCode)}`;
    if (!options.existingSlugs.has(withPostal)) {
      log('Slug collision, adding postal:', { base, withPostal });
      return withPostal;
    }
  }
  
  // Still collision - add city
  if (options.city) {
    const withCity = [base, options.postalCode, options.city]
      .filter((x): x is string => !!x)  // Type guard to ensure string[]
      .map(normalize)
      .join('-');
    
    log('Slug collision, adding city:', { base, withCity });
    return withCity;
  }
  
  // Last resort - add random suffix
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const fallback = `${base}-${randomSuffix}`;
  log('Slug collision, adding random:', { base, fallback });
  
  return fallback;
}

