/**
 * LINEAR API TO DOMAIN MODEL MAPPER
 * 
 * This mapper transforms raw Linear API data into our Property domain model.
 * 
 * 📖 DOCUMENTATION: See field-mappings.ts for complete field mapping blueprint
 *    showing all Linear API fields, their target domain fields, and transformation rules.
 * 
 * Based on: DENNIS_IMPLEMENTATIONSLISTA_DETALJERAD.md
 */

import { Property, LocalizedValue } from '@/lib/domain/property.types';
import { parseEuro } from '@/lib/domain/property.value-objects';
import { normalizeEnergyStatus } from '@/lib/domain/energy';
import { buildSlug } from '@/lib/domain/slug';
import { cleanAgentData } from '@/lib/domain/agent-utils';
import { validateProperty } from '@/lib/domain/property.schema';
import { log, warn } from '@/lib/logger';
import { localizeListingType } from './listing-type-localizer';
import { LinearListing, LinearLocalized } from './types';

const YES = new Set(['kyllä', 'ja', 'yes', 'on', '1', 'true', true, 1]);
const NO = new Set(['ei', 'nej', 'no', 'off', '0', 'false', false, 0]);

function lget(src: LinearLocalized, l: 'fi' | 'sv' | 'en'): string {
  if (src == null) return '';
  if (typeof src === 'string') return src || '';
  const v = (src as any)[l];
  if (!v) return '';
  return typeof v === 'string' ? v : (v?.value ?? '');
}

function lv(src: LinearLocalized | undefined): LocalizedValue {
  return {
    fi: lget(src, 'fi'),
    sv: lget(src, 'sv') || undefined,
    en: lget(src, 'en') || undefined
  };
}

// LINUS FIX: Convert plain text line breaks to HTML paragraphs
function textToHtml(text: string | undefined | null): string {
  if (!text) return '';
  
  // Split by double line breaks (paragraphs) or single line breaks
  const paragraphs = text
    .split(/\n\n+/) // Split on double+ line breaks (paragraph separators)
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => {
      // Within each paragraph, replace single line breaks with <br>
      const withBreaks = para.replace(/\n/g, '<br>');
      return `<p>${withBreaks}</p>`;
    });
  
  return paragraphs.join('');
}

// LINUS FIX: Apply textToHtml to LocalizedValue
function lvHtml(src: LinearLocalized | undefined): LocalizedValue {
  return {
    fi: textToHtml(lget(src, 'fi')),
    sv: textToHtml(lget(src, 'sv')),
    en: textToHtml(lget(src, 'en')),
  };
}

function toBool(v: any): boolean | undefined {
  // ✅ FIX: Extract value from localized object structure
  let rawValue = v;
  
  // Handle localized object: { fi: { key: '...', value: 'Kyllä', category: '...' } }
  if (v && typeof v === 'object' && v.fi?.value !== undefined) {
    rawValue = v.fi.value;
  }
  // Handle LinearLocalized: { fi: 'Kyllä', sv: 'Ja', en: 'Yes' }
  else if (v && typeof v === 'object' && v.fi !== undefined && typeof v.fi === 'string') {
    rawValue = v.fi;
  }
  
  if (rawValue === null || rawValue === undefined) return undefined;
  
  const s = String(rawValue).trim().toLowerCase();
  if (YES.has(s) || YES.has(rawValue)) return true;
  if (NO.has(s) || NO.has(rawValue)) return false;
  
  log('⚠️ Unrecognized boolean value:', v);
  return undefined;
}

function pickNV(nv: any, ...keys: string[]) {
  for (const k of keys) {
    if (nv?.[k] != null && nv[k] !== '') return nv[k];
  }
  return undefined;
}

function parseNum(val: any): number | undefined {
  if (val == null || val === '') return undefined;
  const str = String(val).replace(/[^\d.,]/g, '').replace(',', '.');
  const num = parseFloat(str);
  return Number.isFinite(num) && num > 0 ? num : undefined;
}

// LINUS FIX: Robust area number parsing (handles "2 400 m²" → 2400)
function parseAreaNumber(input: any): number | undefined {
  if (!input) return undefined;
  const s = String(input).replace(/\s+/g, '').replace(/[^\d.,-]/g, '').replace(',', '.');
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

// LINUS FIX: Get first valid number from multiple sources
function firstNumber(...vals: Array<any>): number | undefined {
  for (const v of vals) {
    const n = typeof v === 'number' ? v : parseAreaNumber(v);
    if (Number.isFinite(n) && (n as number) > 0) return n as number;
  }
  return undefined;
}

// LINUS FIX: Unit-aware area conversion
function normalizeUnit(u?: string | null): 'SQM'|'ARE'|'HECTARE'|undefined {
  if (!u) return undefined;
  const s = String(u).trim().toUpperCase();
  if (s.includes('SQUARE') || s.includes('SQM') || s === 'M2' || s === 'M²') return 'SQM';
  if (s.includes('ARE') || s === 'A') return 'ARE';
  if (s.includes('HECTAR') || s === 'HA') return 'HECTARE';
  return undefined;
}

function applyUnit(n: number, unit?: string | null, rawText?: string | null): number {
  const nu = normalizeUnit(unit);
  if (nu === 'ARE') return n * 100;
  if (nu === 'HECTARE') return n * 10000;
  // Fallback: localized string contains 'ha'
  const raw = (rawText || '').toLowerCase();
  if (raw.includes(' ha') || raw.endsWith('ha') || raw.includes('hehtaari')) return n * 10000;
  return n; // default m²
}

function normalizeStatus(val: any): 'ACTIVE' | 'SOLD' | 'RESERVED' | undefined {
  const s = String(val || '').toLowerCase();
  if (/myyty|sold|såld/.test(s)) return 'SOLD';
  if (/varattu|reserved|reserverad/.test(s)) return 'RESERVED';
  if (/aktiivinen|active|aktiv/.test(s)) return 'ACTIVE';
  return undefined;
}

function extractCoordinates(src: LinearListing, nv: any): { lat: number; lon: number } | undefined {
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

  return lat && lon ? { lat, lon } : undefined;
}

export class LinearToPropertyMapper {
  private existingSlugs = new Set<string>();

  map(src: LinearListing, locale: 'fi' | 'sv' | 'en'): Property {
    const nv = src.nonLocalizedValues ?? {};

    // ========== BASIC INFO ==========
    const addressFi = lget(src.address!, 'fi');
    const postalCode = lget(src.postalCode!, locale);
    const cityFi = lget(src.city!, 'fi');
    const districtData = lv(src.district ?? src.districtFree);
    
    const slug = src.slug 
      ? String(src.slug) 
      : buildSlug(addressFi, {
          postalCode,
          city: cityFi,
          existingSlugs: this.existingSlugs
        });
    
    this.existingSlugs.add(slug);

    // ========== RICH CONTENT (NEW) ==========
    // LINUS FIX: Convert line breaks to HTML for proper formatting
    const description = lvHtml(src.freeText ?? src.marketingDescription);
    const descriptionTitle = lv(src.freeTextTitle);

    // ========== PRICING ==========
    const sales = parseEuro(pickNV(nv, 'askPrice') ?? (src.askPrice && lget(src.askPrice, locale)));
    const debtFree = parseEuro(pickNV(nv, 'debtFreePrice') ?? (src.debtFreePrice && lget(src.debtFreePrice, locale)));
    const debt = Math.max(0, debtFree - sales);
    
    // Property tax (Kiinteistövero) - ONLY for properties, not apartments
    // Dennis: Use 'fi' as fallback since tax data is often only in Finnish
    const propertyTax = parseEuro(
      pickNV(nv, 'propertyTax', 'realEstateTax') ?? 
      (src.propertyTax && (lget(src.propertyTax, locale) || lget(src.propertyTax, 'fi'))) ?? 
      (src.realEstateTax && (lget(src.realEstateTax, locale) || lget(src.realEstateTax, 'fi')))
    ) || undefined;

    // ========== DIMENSIONS (EXPANDED) ==========
    const living = parseNum(pickNV(nv, 'area') ?? lget(src.area!, 'fi')) || 0;
    
    // Dennis 2025-11-10: Parse "Yta för andra utrymmen" 
    // lget() already extracts .value from Linear's nested structure
    const otherSpaces = parseNum(pickNV(nv, 'otherArea') ?? lget((src as any).otherArea, 'fi'));
    
    // Dennis 2025-11-10: Total area for properties
    // lget() handles Linear's structure: overallArea.fi.value = "60 m²"
    let total = parseNum(
      pickNV(nv, 'totalArea', 'total_area', 'kokonaisala') ??
      lget((src as any).overallArea, 'fi') ??
      lget(src.totalArea!, 'fi')
    );

    // If no explicit total but we have otherSpaces, calculate: total = living + otherSpaces
    if (!total && otherSpaces && otherSpaces > 0) {
      total = living + otherSpaces;
    }
    
    // LINUS FIX: Unit-aware plot area - try multiple sources + convert units to m²
    // Dennis 2025-11-10: Added propertyArea, estateArea for "Fastighetens areal"
    const nvPlot = firstNumber(nv?.plotArea, nv?.lotArea, nv?.siteArea, nv?.propertyArea, nv?.estateArea);
    const unitNv = nv?.plotAreaUnit || nv?.lotAreaUnit || nv?.siteAreaUnit || nv?.propertyAreaUnit || nv?.estateAreaUnit || null;
    const lotAreaFi = lget((src as any).lotArea, 'fi');
    const plotAreaFi = lget((src as any).plotArea, 'fi');
    const siteAreaFi = lget((src as any).siteArea, 'fi');
    const propertyAreaFi = lget((src as any).propertyArea, 'fi');
    const estateAreaFi = lget((src as any).estateArea, 'fi');
    const localizedPlot = firstNumber(plotAreaFi, lotAreaFi, siteAreaFi, propertyAreaFi, estateAreaFi);
    // Source value + unit conversion (output always in m²)
    const plotCandidate = nvPlot ?? localizedPlot;
    const plot = plotCandidate !== undefined ? applyUnit(plotCandidate, unitNv, plotAreaFi || lotAreaFi || siteAreaFi || propertyAreaFi || estateAreaFi) : undefined;
    
    // DEBUG: Log plot sources in development
    if (process.env.NODE_ENV !== 'production') {
      const id = nv?.id || (src as any)?.id;
      // Dennis: Always log Mailatie to debug the 13 m² vs 1299 m² issue
      if (plot !== undefined || (id && id.toLowerCase().includes('mailatie'))) {
        console.debug('[PLOT DEBUG]', {
          id,
          nvPlot, unitNv,
          localized: { plotAreaFi, lotAreaFi, siteAreaFi, propertyAreaFi, estateAreaFi },
          rawLotAreaFi: (src as any).lotArea?.fi,
          plotCandidate,
          plotFinal: plot
        });
      }
    }
    
    const balcony = parseNum(pickNV(nv, 'balconyArea') ?? lget(src.balconyArea!, 'fi'));
    const terrace = parseNum(pickNV(nv, 'terraceArea') ?? lget(src.terraceArea!, 'fi'));
    const rooms = lget(src.rooms!, locale) || pickNV(nv, 'rooms') || undefined;
    const bedrooms = parseNum(pickNV(nv, 'numberOfBedrooms') ?? lget(src.numberOfBedrooms!, 'fi'));
    const bathrooms = parseNum(pickNV(nv, 'numberOfBathrooms') ?? lget(src.numberOfBathrooms!, 'fi'));

    // ========== FEES (NEW) ==========
    const maintenance = parseEuro(
      pickNV(nv, 'renovationCharge', 'maintenanceCharge') ?? 
      lget(src.maintenanceCharge!, locale) ?? 
      lget(src.renovationCharge!, locale)
    ) || undefined;

    const financing = parseEuro(
      pickNV(nv, 'fundingCharge', 'financingCharge') ?? 
      lget(src.fundingCharge!, locale) ?? 
      lget(src.financingCharge!, locale)
    ) || undefined;

    const water = parseEuro(pickNV(nv, 'waterCharge') ?? lget(src.waterCharge!, locale)) || undefined;
    const heating = parseEuro(
      pickNV(nv, 'heatingCharge', 'averageTotalHeatingCharge', 'electricHeatingCharge') ?? 
      lget(src.heatingCharge!, locale) ?? 
      lget(src.averageTotalHeatingCharge!, locale) ?? 
      lget(src.electricHeatingCharge!, locale)
    ) || undefined;
    
    const electricity = parseEuro(pickNV(nv, 'electricHeatingCharge') ?? lget(src.electricHeatingCharge!, locale)) || undefined;
    const parking = parseEuro(pickNV(nv, 'parkingCharge') ?? lget(src.parkingCharge!, locale)) || undefined;
    const saunaFee = parseEuro(pickNV(nv, 'saunaCharge') ?? lget(src.saunaCharge!, locale)) || undefined;

    // ========== FEATURES (NEW) ==========
    const features = {
      balcony: toBool(pickNV(nv, 'hasBalcony', 'balcony') ?? src.hasBalcony ?? src.balcony),
      terrace: toBool(pickNV(nv, 'hasTerrace', 'terrace') ?? src.hasTerrace ?? src.terrace),
      sauna: toBool(pickNV(nv, 'sauna') ?? src.sauna),
      fireplace: toBool(pickNV(nv, 'fireplace') ?? src.fireplace),
      storageRoom: toBool(pickNV(nv, 'storageRoom') ?? src.storageRoom),
      parkingSpace: toBool(pickNV(nv, 'hasParkingSpace', 'parkingSpace') ?? src.hasParkingSpace ?? src.parkingSpace)
    };

    // ========== META (EXPANDED) ==========
    const status = normalizeStatus(pickNV(nv, 'status') ?? lget(src.status!, locale));
    const elevatorRaw = src.housingCooperativeElevator ?? src.elevator ?? pickNV(nv, 'housingCooperativeElevator');
    const hasElevator = toBool(elevatorRaw);
    const rentValue = src.rent ? parseEuro(lget(src.rent, locale)) : undefined;
    const floor = lget(src.floor!, locale) || lget(src.floorLocation!, locale) || pickNV(nv, 'floor') || undefined;

    // Company loans and encumbrances
    const loansSrc = pickNV(nv, 'companyLoans') ?? src.companyLoans ?? (src as any).taloyhtionLainat;
    const encumbrancesSrc = pickNV(nv, 'housingCooperativeMortgage') ?? src.housingCooperativeMortgage ?? src.propertyMortgage ?? src.encumbranceAmount;

    const loansNum = loansSrc != null ? parseEuro(loansSrc) : null;
    const encumbrancesNum = encumbrancesSrc != null ? parseEuro(encumbrancesSrc) : null;

    const loansDate = lget(src.housingCooperativeMortgageDate!, locale) || lget(src.propertyManagerCertificateDate!, locale) || undefined;

    // ========== ADDITIONAL META (Blueprint completion) ==========
    const identifierFi = pickNV(nv, 'identifier', 'propertyId') ?? lget((src as any).identifier!, 'fi') ?? undefined;
    const condition = lv((src as any).condition);
    
    // Dennis: Property data often only in Finnish - use 'fi' as fallback
    const propertyIdentifier = pickNV(nv, 'propertyIdentifier', 'estateName') ?? 
      lget((src as any).propertyIdentifier!, locale) ?? 
      lget((src as any).propertyIdentifier!, 'fi') ?? 
      undefined;
    
    const propertyBuildingRights = pickNV(nv, 'propertyBuildingRights', 'buildingRights') ?? 
      lget((src as any).propertyBuildingRights!, locale) ?? 
      lget((src as any).propertyBuildingRights!, 'fi') ?? 
      undefined;
    
    const restrictions = lv((src as any).restrictions);

    // ========== COORDINATES (NEW) ==========
    const coordinates = extractCoordinates(src, nv);

    // ========== DOCUMENTS (NEW) ==========
    const floorPlanUrl = lget(src.floorPlanUrl!, locale) || 
                         src.images?.find(i => i.isFloorPlan)?.url || 
                         undefined;
    
    const brochureUrl = lget(src.brochureUrl!, locale) || 
                        lget(src.propertyBrochureUrl!, locale) || 
                        undefined;
    
    const brochureIntl = lget(src.internationalBrochureUrl!, locale) || undefined;
    const videoUrl = lget(src.videoUrl!, locale) || undefined;
    const energyCertUrl = lget(src.energyCertificateUrl!, locale) || undefined;

    // ========== RENTAL (NEW) ==========
    let rentalData: Property['rental'] = undefined;
    if (rentValue && rentValue > 0) {
      rentalData = {
        monthlyRent: rentValue,
        securityDeposit: lv(src.securityDeposit),
        contractType: lv(src.rentalContractType),
        earliestTermination: lv(src.earliestTermination),
        petsAllowed: toBool(pickNV(nv, 'petsAllowed') ?? src.petsAllowed),
        smokingAllowed: toBool(pickNV(nv, 'smokingAllowed') ?? src.smokingAllowed)
      };
    }

    // ========== AGENT / REALTOR ==========
    // Linear API uses both "agent" and "realtor" field names
    const agentSource = src.agent || src.realtor;
    const rawAgent: any = agentSource ? {
      name: agentSource.name || src.realtorName,
      phone: (src.agent as any)?.phone || (src.realtor as any)?.tel,
      email: agentSource.email,
      avatar: agentSource.avatar,
      photoUrl: (src.agent as any)?.photo?.sourceUrl || agentSource.avatar,
      jobTitle: agentSource.jobTitle,
      companyName: (src.realtor as any)?.primaryCompany?.name
    } : {
      name: (src as any).estateAgentName,
      phone: (src as any).estateAgentPhone,
      email: (src as any).estateAgentEmail
    };
    
    const { warnings: agentWarnings, ...agentData } = cleanAgentData(rawAgent);
    
    if (agentWarnings.length > 0) {
      warn('Agent data warnings for', addressFi, agentWarnings);
    }

    // ========== APARTMENT IDENTIFIER ==========
    // Build apartment identifier from gate (rappu) + apartment number (e.g., "C 47")
    const gateStr = lget(src.gate, 'fi')?.trim();
    const aptNum = lget(src.apartmentNumber, 'fi')?.trim();
    const apartmentIdentifier = gateStr && aptNum ? `${gateStr} ${aptNum}` : gateStr || aptNum || undefined;

    // ========== BUILD PROPERTY ==========
    const property: Property = {
      id: String(nv.id ?? src.id ?? ''),
      slug,

      address: lv(src.address),
      city: lv(src.city),
      district: districtData.fi || districtData.sv || districtData.en ? districtData : undefined,
      postalCode,
      apartmentIdentifier,
      gate: gateStr,  // Store gate letter separately for address display

      // NEW: Rich content
      description: description.fi || description.sv || description.en ? description : undefined,
      descriptionTitle: descriptionTitle.fi || descriptionTitle.sv || descriptionTitle.en ? descriptionTitle : undefined,

      pricing: { sales, debtFree, debt, propertyTax },

      dimensions: { 
        living, 
        total, 
        plot,
        balcony,
        terrace,
        rooms,
        bedrooms,
        bathrooms
      },

      // NEW: Fees
      fees: {
        maintenance,
        financing,
        water,
        heating,
        electricity,
        parking,
        sauna: saunaFee
      },

      // NEW: Features
      features,

      meta: {
        status,
        // ✅ Extract typeCode with MULTIPLE fallbacks (listingType, propertyType, type)
        typeCode: (() => {
          // Try listingType first (preferred)
          let rawType = lget(src.listingType, 'en') || lget(src.listingType, 'fi') || lget(src.listingType, 'sv');
          
          // Fallback to propertyType if listingType is empty
          if (!rawType) {
            rawType = lget(src.propertyType, 'en') || lget(src.propertyType, 'fi') || lget(src.propertyType, 'sv');
          }
          
          // Final fallback to type field
          if (!rawType) {
            rawType = lget(src.type, 'en') || lget(src.type, 'fi') || lget(src.type, 'sv');
          }
          
          // DEBUG logging if still empty
          if (!rawType && addressFi) {
            console.log(`⚠️  ALL typeCode sources empty for ${addressFi}`);
          }
          
          return rawType.toUpperCase().replace(/ /g, '_');
        })(),
        listingTypeLabel: localizeListingType(lget(src.listingType, 'en') || lget(src.listingType, 'fi') || lget(src.listingType, 'sv') || ''), // ✅ SPEC: Localized listing type
        
        // Basic metadata (from blueprint)
        identifierFi,
        apartmentType: lv(src.typeOfApartment),
        condition: condition.fi || condition.sv || condition.en ? condition : undefined,
        
        // Energy & systems - LINUS FIX: Fallback locale → fi → nv
        energyClass: (() => {
          const fromLocale = lget((src as any).energyClass, locale);
          const fromFi = lget((src as any).energyClass, 'fi');
          const fromNv = typeof nv?.energyClass === 'string' ? nv.energyClass : undefined;
          return [fromLocale, fromFi, fromNv].find(v => v && String(v).trim() !== '') || undefined;
        })(),
        energyCertStatus: (() => {
          const fromLocale = lget(src.listingHasEnergyCertificate!, locale);
          const fromFi = lget(src.listingHasEnergyCertificate!, 'fi');
          return normalizeEnergyStatus(fromLocale || fromFi);
        })(),
        heatingSystem: lv(src.heatingSystem),
        ventilationSystem: lv(src.ventilationSystem),
        
        // Ownership & tenure
        ownershipType: lv((src as any).ownershipType),
        plotOwnership: lv((src as any).siteOwnershipType ?? (src as any).lotOwnership),
        housingTenure: lv((src as any).housingTenure),
        
        // Property-specific
        propertyIdentifier,
        propertyBuildingRights,
        restrictions: restrictions.fi || restrictions.sv || restrictions.en ? restrictions : undefined,
        
        // Dates & availability
        availableFrom: lv((src as any).availableFrom ?? (src as any).release ?? (src as any).freeOnText),
        zoning: lv((src as any).zoningStatus),
        
        // Building details
        yearBuilt: Number(
          nv.yearBuilt ?? 
          nv.completeYear ?? 
          (src as any).yearBuilt ?? 
          (src as any).completeYear ?? 
          lget((src as any).completeYear!, 'fi')
        ) || undefined,
        floorsTotal: Number(nv.floorCount ?? (src as any).floorCount) || undefined,
        floor,
        elevator: hasElevator,
        
        // Rental flag
        rent: rentValue,
        
        // Housing company info
        housingCompany: {
          name: lv((src as any).housingCooperativeName),
          loans: loansNum,
          encumbrances: encumbrancesNum,
          loansDate
        }
      },

      media: {
        images: (src.images ?? []).map(i => ({
          url: i.compressed || i.url,
          thumb: i.thumbnail,
          floorPlan: !!i.isFloorPlan
        })),
        coordinates
      },

      // NEW: Documents
      documents: {
        floorPlan: floorPlanUrl,
        brochure: brochureUrl,
        brochureIntl,
        video: videoUrl,
        energyCert: energyCertUrl
      },

      agent: Object.values(agentData).some(v => v) ? agentData : undefined,

      // NEW: Rental
      rental: rentalData
    };

    // Validate with Zod
    const validation = validateProperty(property);
    if (!validation.success && validation.warnings.length > 0) {
      warn('Property validation warnings for', addressFi, validation.warnings);
    }

    return property;
  }
}

