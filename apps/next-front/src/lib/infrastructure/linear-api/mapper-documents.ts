import { lget } from './mapper-helpers';
import { LinearListing } from './types';

function getLinks(src: LinearListing, locale: 'fi' | 'sv' | 'en'): any[] {
  const linksArray = src.links;
  if (!linksArray) return [];
  const localeLinks = (linksArray as any)[locale] || (linksArray as any)['fi'] || linksArray;
  const actualLinks = localeLinks?.value || localeLinks;
  return Array.isArray(actualLinks) ? actualLinks : [];
}

function extractLinkFromArray(src: LinearListing, locale: 'fi' | 'sv' | 'en', pattern: RegExp): string | undefined {
  const found = getLinks(src, locale).find((link: any) => {
    const url = link?.value || link?.url || link;
    return pattern.test(url);
  });
  return found?.value || found?.url || found;
}

function extractLinkByName(src: LinearListing, locale: 'fi' | 'sv' | 'en', name: string): string | undefined {
  const found = getLinks(src, locale).find((link: any) => {
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

export function extractDocumentUrls(src: LinearListing, locale: 'fi' | 'sv' | 'en', nv: any): DocumentUrls {
  const floorPlanUrl = lget(src.floorPlanUrl!, locale) ||
    src.images?.find(i => i.isFloorPlan)?.url ||
    extractLinkFromArray(src, locale, /pohjakuva|floorplan|planritning/i) ||
    undefined;

  const brochureUrl = lget(src.virtualTourUrl!, locale) ||
    lget(src.brochureUrl!, locale) ||
    lget(src.propertyBrochureUrl!, locale) ||
    extractLinkFromArray(src, locale, /esitteet|brochure|broschyr/i) ||
    undefined;

  const brochureIntl = lget(src.internationalBrochureUrl!, locale) ||
    extractLinkFromArray(src, locale, /sothebysrealty\.com\/eng/i) ||
    undefined;

  const internationalUrl = lget(src.internationalUrl!, locale) ||
    lget(src.internationalListingUrl!, locale) ||
    lget(src.globalListingUrl!, locale) ||
    extractLinkFromArray(src, locale, /sothebysrealty\.com/i) ||
    extractLinkByName(src, locale, 'SIR') ||
    undefined;

  const videoUrl = lget(src.videoUrl!, locale) ||
    extractLinkFromArray(src, locale, /youtu\.be|youtube\.com|vimeo\.com/i) ||
    undefined;

  const energyCertUrl = lget(src.energyCertificateUrl!, locale) || undefined;

  return { floorPlanUrl, brochureUrl, brochureIntl, internationalUrl, videoUrl, energyCertUrl };
}
