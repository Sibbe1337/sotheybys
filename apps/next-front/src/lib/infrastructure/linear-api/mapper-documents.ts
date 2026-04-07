/**
 * MAPPER DOCUMENTS
 *
 * Document, brochure, video, and media URL extraction logic
 * used by the Linear API → Property mapper.
 */

import { lget } from './mapper-helpers';
import { LinearListing } from './types';

// 🔥 DENNIS FIX: Extract URLs from "Länkar" field in Linear CMS
// Linear CMS has a generic "links" array where all URLs are stored
function extractLinkFromArray(
  src: LinearListing,
  locale: 'fi' | 'sv' | 'en',
  pattern: RegExp,
  _purpose: string
): string | undefined {
  const linksArray = (src as any).links;

  if (!linksArray) {
    return undefined;
  }

  // Handle if links is localized object with arrays
  const localeLinks = linksArray[locale] || linksArray['fi'] || linksArray;

  // 🎯 FIX: Linear returns { key, value: [...], category }, extract the value!
  const actualLinks = localeLinks?.value || localeLinks;

  if (!Array.isArray(actualLinks)) {
    return undefined;
  }

  // Find first link matching pattern
  // 🎯 FIX: Linear API uses "value" key, not "url"!
  const found = actualLinks.find((link: any) => {
    const url = link?.value || link?.url || link;
    return pattern.test(url);
  });

  return found?.value || found?.url || found;
}

// Dennis 2025-01-29: Extract URL from links array by link NAME (e.g., "SIR")
function extractLinkByName(
  src: LinearListing,
  locale: 'fi' | 'sv' | 'en',
  name: string
): string | undefined {
  const linksArray = (src as any).links;

  if (!linksArray) {
    return undefined;
  }

  // Handle if links is localized object with arrays
  const localeLinks = linksArray[locale] || linksArray['fi'] || linksArray;
  const actualLinks = localeLinks?.value || localeLinks;

  if (!Array.isArray(actualLinks)) {
    return undefined;
  }

  // Find link by name (case-insensitive)
  const found = actualLinks.find((link: any) => {
    const linkName = link?.name || link?.key || link?.label || '';
    return linkName.toLowerCase() === name.toLowerCase();
  });

  return found?.value || found?.url;
}

export interface DocumentUrls {
  floorPlanUrl: string | undefined;
  brochureUrl: string | undefined;
  brochureIntl: string | undefined;
  internationalUrl: string | undefined;
  videoUrl: string | undefined;
  energyCertUrl: string | undefined;
}

export function extractDocumentUrls(
  src: LinearListing,
  locale: 'fi' | 'sv' | 'en',
  nv: any
): DocumentUrls {
  const floorPlanUrl = lget(src.floorPlanUrl!, locale) ||
                       src.images?.find(i => i.isFloorPlan)?.url ||
                       extractLinkFromArray(src, locale, /pohjakuva|floorplan|planritning/i, 'floor plan') ||
                       undefined;

  // 🔥 DENNIS FIX: Broschyr kan vara i flera olika fält eller i links-array
  const brochureUrl = lget((src as any).virtualTourUrl!, locale) ||
                      lget(src.brochureUrl!, locale) ||
                      lget(src.propertyBrochureUrl!, locale) ||
                      extractLinkFromArray(src, locale, /esitteet|brochure|broschyr/i, 'brochure') ||
                      undefined;

  const brochureIntl = lget(src.internationalBrochureUrl!, locale) ||
                       extractLinkFromArray(src, locale, /sothebysrealty\.com\/eng/i, 'international listing') ||
                       undefined;

  // Dennis 2025-12-15: International URL (Global Listing on sothebysrealty.com)
  // Dennis 2025-01-29: Updated to match more URL patterns and also find by link name "SIR"
  const internationalUrl = lget((src as any).internationalUrl!, locale) ||
                           lget((src as any).internationalListingUrl!, locale) ||
                           lget((src as any).globalListingUrl!, locale) ||
                           extractLinkFromArray(src, locale, /sothebysrealty\.com/i, 'global listing') ||
                           extractLinkByName(src, locale, 'SIR') ||
                           undefined;

  const videoUrl = lget(src.videoUrl!, locale) ||
                   extractLinkFromArray(src, locale, /youtu\.be|youtube\.com|vimeo\.com/i, 'video') ||
                   undefined;

  const energyCertUrl = lget(src.energyCertificateUrl!, locale) || undefined;

  return { floorPlanUrl, brochureUrl, brochureIntl, internationalUrl, videoUrl, energyCertUrl };
}
