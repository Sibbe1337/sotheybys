/**
 * GEOCODING UTILITY
 * 
 * Converts address to coordinates using Google Maps Geocoding API
 * Fallback: Uses Nominatim (OpenStreetMap) if Google API key not available
 */

interface GeocodingResult {
  lat: number;
  lon: number;
  source: 'google' | 'nominatim' | 'cache';
}

// In-memory cache to avoid repeated API calls
const geocodeCache = new Map<string, GeocodingResult>();

/**
 * Geocode address using Google Maps Geocoding API
 */
async function geocodeWithGoogle(address: string): Promise<GeocodingResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('[Geocoding] Google Maps API key not found, falling back to Nominatim');
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&region=fi&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results[0]) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lon: location.lng,
        source: 'google'
      };
    }

    console.warn('[Geocoding] Google API returned no results for:', address);
    return null;
  } catch (error) {
    console.error('[Geocoding] Google API error:', error);
    return null;
  }
}

/**
 * Geocode address using Nominatim (OpenStreetMap) - FREE fallback
 */
async function geocodeWithNominatim(address: string): Promise<GeocodingResult | null> {
  try {
    // Add Finland to improve results
    const searchAddress = address.includes('Finland') ? address : `${address}, Finland`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchAddress)}&format=json&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Snellman-Sothebys-Website/1.0'
      }
    });
    
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        source: 'nominatim'
      };
    }

    console.warn('[Geocoding] Nominatim returned no results for:', address);
    return null;
  } catch (error) {
    console.error('[Geocoding] Nominatim error:', error);
    return null;
  }
}

/**
 * Main geocoding function with cache and fallback
 * 
 * @param address - Full address string (e.g., "Hiiralankaari 24, 00330 Helsinki")
 * @returns Coordinates or null if geocoding fails
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!address || address.trim() === '') {
    return null;
  }

  // Normalize address for cache key
  const cacheKey = address.toLowerCase().trim();

  // Check cache first
  if (geocodeCache.has(cacheKey)) {
    const cached = geocodeCache.get(cacheKey)!;
    console.log('[Geocoding] Cache hit:', address, cached);
    return { ...cached, source: 'cache' };
  }

  // Try Google first
  let result = await geocodeWithGoogle(address);

  // Fallback to Nominatim if Google fails
  if (!result) {
    result = await geocodeWithNominatim(address);
  }

  // Cache result (even if null, to avoid repeated failed lookups)
  if (result) {
    geocodeCache.set(cacheKey, result);
    console.log('[Geocoding] Success:', address, result);
  } else {
    console.warn('[Geocoding] Failed for address:', address);
  }

  return result;
}

/**
 * Batch geocode multiple addresses
 * Rate-limited to avoid API throttling
 */
export async function geocodeAddressBatch(
  addresses: string[], 
  delayMs: number = 200
): Promise<Map<string, GeocodingResult | null>> {
  const results = new Map<string, GeocodingResult | null>();

  for (const address of addresses) {
    const result = await geocodeAddress(address);
    results.set(address, result);
    
    // Rate limit: wait between requests
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Clear geocoding cache (useful for testing)
 */
export function clearGeocodeCache() {
  geocodeCache.clear();
}

