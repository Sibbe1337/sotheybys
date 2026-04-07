import { lget, parseNum, pickNV } from './mapper-helpers';
import { LinearListing } from './types';

const KNOWN_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'remmarholmen': { lat: 60.00, lon: 24.51 },
};

export async function extractCoordinates(
  src: LinearListing,
  nv: any,
  address?: string,
  postalCode?: string,
  city?: string
): Promise<{ lat: number; lon: number } | undefined> {
  const lat = parseNum(
    pickNV(nv, 'latitude', 'lat') ??
    lget(src.latitude!, 'fi') ??
    lget(src.mapCoordinates!, 'fi')?.split(',')[0]
  );
  const lon = parseNum(
    pickNV(nv, 'longitude', 'lon', 'lng') ??
    lget(src.longitude!, 'fi') ??
    lget(src.mapCoordinates!, 'fi')?.split(',')[1]
  );

  if (lat && lon) return { lat, lon };

  if (address) {
    const normalizedAddress = address.toLowerCase().trim();
    for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
      if (normalizedAddress.includes(key)) return coords;
    }
  }

  if (address && city) {
    try {
      const fullAddress = postalCode
        ? `${address}, ${postalCode} ${city}, Finland`
        : `${address}, ${city}, Finland`;
      const { geocodeAddress } = await import('@/lib/utils/geocoding');
      const result = await geocodeAddress(fullAddress);
      if (result) return { lat: result.lat, lon: result.lon };
    } catch { /* geocoding unavailable */ }
  }

  return undefined;
}
