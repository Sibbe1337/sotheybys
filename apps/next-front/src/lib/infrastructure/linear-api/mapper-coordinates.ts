/**
 * MAPPER COORDINATES
 *
 * Coordinate extraction and geocoding fallback logic
 * used by the Linear API → Property mapper.
 */

import { lget, parseNum, pickNV } from './mapper-helpers';
import { LinearListing } from './types';

// Hardcoded coordinates for properties that don't geocode well (islands, etc.)
const KNOWN_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'remmarholmen': { lat: 60.00, lon: 24.51 }, // Island in Porkkala, Kirkkonummi
};

export async function extractCoordinates(
  src: LinearListing,
  nv: any,
  address?: string,
  postalCode?: string,
  city?: string
): Promise<{ lat: number; lon: number } | undefined> {
  // Try multiple field names for latitude/longitude
  const lat = parseNum(
    pickNV(nv, 'latitude', 'lat') ??
    lget(src.latitude!, 'fi') ??
    lget((src as any).mapCoordinates!, 'fi')?.split(',')[0]
  );

  const lon = parseNum(
    pickNV(nv, 'longitude', 'lon', 'lng') ??
    lget(src.longitude!, 'fi') ??
    lget((src as any).mapCoordinates!, 'fi')?.split(',')[1]
  );

  // If coordinates exist, return them
  if (lat && lon) {
    return { lat, lon };
  }

  // FALLBACK 1: Check hardcoded coordinates for known problematic addresses
  if (address) {
    const normalizedAddress = address.toLowerCase().trim();
    for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
      if (normalizedAddress.includes(key)) {
        console.log(`[Mapper] Using hardcoded coordinates for ${address}`);
        return coords;
      }
    }
  }

  // FALLBACK 2: Geocode from address if coordinates missing
  if (address && city) {
    try {
      const fullAddress = postalCode
        ? `${address}, ${postalCode} ${city}, Finland`
        : `${address}, ${city}, Finland`;

      // Use dynamic import to avoid circular dependencies
      const { geocodeAddress } = await import('@/lib/utils/geocoding');
      const result = await geocodeAddress(fullAddress);

      if (result) {
        return { lat: result.lat, lon: result.lon };
      }
    } catch (error) {
      console.error('[Mapper] Geocoding failed:', error);
    }
  }

  return undefined;
}
