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

import { Property } from '@/lib/domain/property.types';
import { parseEuro } from '@/lib/domain/property.value-objects';
import { normalizeEnergyStatus } from '@/lib/domain/energy';
import { buildSlug } from '@/lib/domain/slug';
import { cleanAgentData } from '@/lib/domain/agent-utils';
import { validateProperty } from '@/lib/domain/property.schema';
import { warn } from '@/lib/logger';
import { localizeListingType } from './listing-type-localizer';
import { LinearListing } from './types';

import {
  lget, lv, lvHtml, toBool, pickNV,
  parseNum, parseAreaNumber, firstNumber,
  applyUnit, normalizeStatus
} from './mapper-helpers';
import { extractCoordinates } from './mapper-coordinates';
import { extractDocumentUrls } from './mapper-documents';

export class LinearToPropertyMapper {
  private existingSlugs = new Set<string>();

  async map(src: LinearListing, locale: 'fi' | 'sv' | 'en'): Promise<Property> {
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
    // Dennis 2025-11-24: ALWAYS use Finnish value - tax amount is the same regardless of language
    // Fixes issue where English shows "3 €/year" instead of "3000 €/year"
    const propertyTax = parseEuro(
      pickNV(nv, 'propertyTax', 'realEstateTax') ??
      (src.propertyTax && lget(src.propertyTax, 'fi')) ??
      (src.realEstateTax && lget(src.realEstateTax, 'fi'))
    ) || undefined;

    // Dennis 2025-11-11: Tarjouskauppa (bidding) fields
    const biddingStartPrice = parseEuro(
      pickNV(nv, 'debtlessStartPrice') ??
      (src.debtlessStartPrice && lget(src.debtlessStartPrice, locale))
    ) || undefined;
    const biddingUrl = (src as any).biddingUrl || (nv as any).biddingUrl || undefined;

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
    // Dennis 2025-11-24: DEBUG - let's see what Linear returns for plot size
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

    // Dennis 2025-11-10: Plot area conversion fixed!
    // Problem was: normalizeUnit() checked 'ARE' before 'HECTARE'
    // So 'HECTARE'.includes('ARE') matched and returned wrong unit
    // Fixed by checking HECTARE first in normalizeUnit()

    // Dennis 2025-11-11: Business premises area for commercial properties
    // Fallback: if no businessPremiseArea, use totalArea for commercial
    const business = parseNum(
      pickNV(nv, 'businessPremiseArea') ??
      lget(src.businessPremiseArea!, 'fi') ??
      (total && total > 0 ? undefined : undefined) // Use total as fallback only if explicitly commercial
    );

    const balcony = parseNum(pickNV(nv, 'balconyArea') ?? lget(src.balconyArea!, 'fi'));
    const terrace = parseNum(pickNV(nv, 'terraceArea') ?? lget(src.terraceArea!, 'fi'));
    const rooms = lget(src.rooms!, locale) || pickNV(nv, 'rooms') || undefined;
    const bedrooms = parseNum(pickNV(nv, 'numberOfBedrooms') ?? lget(src.numberOfBedrooms!, 'fi'));
    const bathrooms = parseNum(pickNV(nv, 'numberOfBathrooms') ?? lget(src.numberOfBathrooms!, 'fi'));

    // ========== FEES (NEW) ==========
    // Dennis 2025-11-10: FI fallback för fees - Linear har inte alltid SV/EN översättningar
    const maintenance = parseEuro(
      pickNV(nv, 'renovationCharge', 'maintenanceCharge') ??
      lget(src.maintenanceCharge!, locale) ??
      lget(src.maintenanceCharge!, 'fi') ??  // FI fallback
      lget(src.renovationCharge!, locale) ??
      lget(src.renovationCharge!, 'fi')     // FI fallback
    ) || undefined;

    const financing = parseEuro(
      pickNV(nv, 'fundingCharge', 'financingCharge') ??
      lget(src.fundingCharge!, locale) ??
      lget(src.fundingCharge!, 'fi') ??      // FI fallback
      lget(src.financingCharge!, locale) ??
      lget(src.financingCharge!, 'fi')       // FI fallback
    ) || undefined;

    const water = parseEuro(pickNV(nv, 'waterCharge') ?? lget(src.waterCharge!, locale) ?? lget(src.waterCharge!, 'fi')) || undefined;
    const heating = parseEuro(
      pickNV(nv, 'heatingCharge', 'averageTotalHeatingCharge', 'electricHeatingCharge') ??
      lget(src.heatingCharge!, locale) ??
      lget(src.heatingCharge!, 'fi') ??                           // FI fallback
      lget(src.averageTotalHeatingCharge!, locale) ??
      lget(src.averageTotalHeatingCharge!, 'fi') ??               // FI fallback
      lget(src.electricHeatingCharge!, locale) ??
      lget(src.electricHeatingCharge!, 'fi')                      // FI fallback
    ) || undefined;

    const electricity = parseEuro(pickNV(nv, 'electricHeatingCharge') ?? lget(src.electricHeatingCharge!, locale) ?? lget(src.electricHeatingCharge!, 'fi')) || undefined;
    const parking = parseEuro(pickNV(nv, 'parkingCharge') ?? lget(src.parkingCharge!, locale) ?? lget(src.parkingCharge!, 'fi')) || undefined;
    const saunaFee = parseEuro(pickNV(nv, 'saunaCharge') ?? lget(src.saunaCharge!, locale) ?? lget(src.saunaCharge!, 'fi')) || undefined;

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
    // Robert 2025-11-25: ALWAYS use Finnish value for rent - Linear API may have incorrect English translations
    // Fixes issue where English shows "€4/month" instead of "€3,840/month"
    const rentValue = src.rent ? parseEuro(lget(src.rent, 'fi')) : undefined;
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
    const coordinates = await extractCoordinates(src, nv, addressFi, postalCode, cityFi);

    // ========== DOCUMENTS (NEW) ==========
    const { floorPlanUrl, brochureUrl, brochureIntl, internationalUrl, videoUrl, energyCertUrl } =
      extractDocumentUrls(src, locale, nv);

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

      pricing: {
        sales,
        debtFree,
        debt,
        propertyTax,
        biddingStartPrice,  // Dennis 2025-11-11
        biddingUrl          // Dennis 2025-11-11
      },

      dimensions: {
        living,
        total,
        plot,
        business,  // Dennis 2025-11-11: Commercial premises area
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
        // Dennis 2025-11-18: Extract productGroup (APARTMENTS, PROPERTIES, etc)
        productGroup: (() => {
          const rawGroup = lget(src.productGroup, 'en') || lget(src.productGroup, 'fi') || lget(src.productGroup, 'sv');
          return rawGroup ? rawGroup.toUpperCase().replace(/ /g, '_') : undefined;
        })(),
        // FEEDBACK FIX 2025-11-25: Extract typeCode from ACTUAL objekttyp (listingType), NOT produktgrupp
        // Example: Hiiralankaari 24 has produktgrupp "Lägenhet" but objekttyp "DETACHED_HOUSE" → use "DETACHED_HOUSE"
        typeCode: (() => {
          // Try listingType first (preferred - this is the objekttyp)
          let rawType = lget(src.listingType, 'en') || lget(src.listingType, 'fi') || lget(src.listingType, 'sv');

          // Fallback to propertyType if listingType is empty
          if (!rawType) {
            rawType = lget(src.propertyType, 'en') || lget(src.propertyType, 'fi') || lget(src.propertyType, 'sv');
          }

          // Final fallback to type field
          if (!rawType) {
            rawType = lget(src.type, 'en') || lget(src.type, 'fi') || lget(src.type, 'sv');
          }

          return rawType ? rawType.toUpperCase().replace(/ /g, '_') : undefined;
        })(),
        // Dennis 2025-11-19: Use localizeListingType() to ensure correct translations (Kerrostalo -> Höghus in Swedish)
        // FEEDBACK FIX 2025-11-25: ALWAYS show objekttyp (building type), NOT produktgrupp
        // Example: Hiiralankaari 24 is produktgrupp "Lägenhet" but objekttyp "Egnahemshus" → show "Egnahemshus"
        listingTypeLabel: (() => {
          const typeCode = nv?.listingType || lget(src.listingType, 'fi') || '';
          return localizeListingType(typeCode);
        })(),

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
          // LINUS FIX 2025-11-25: Try ALL languages and pick first valid result
          // Linear sometimes has "Ei tietoa" (No info) in Finnish but proper text in Swedish/English
          const fromFi = lget(src.listingHasEnergyCertificate!, 'fi');
          const fromSv = lget(src.listingHasEnergyCertificate!, 'sv');
          const fromEn = lget(src.listingHasEnergyCertificate!, 'en');

          // Try each language and return first non-null result
          for (const text of [fromFi, fromSv, fromEn]) {
            const status = normalizeEnergyStatus(text);
            if (status !== null) return status;
          }

          return null;
        })(),
        heatingSystem: lv(src.heatingSystem),
        ventilationSystem: lv(src.ventilationSystem),

        // Ownership & tenure
        ownershipType: lv((src as any).ownershipType),

        // Dennis 2025-11-19: Tomtägandeform - try all possible field names
        plotOwnership: (() => {
            const fields = [
                (src as any).siteOwnershipType,
                (src as any).lotOwnership,
                (src as any).plotOwnership,
                (src as any).landOwnership,
                nv?.siteOwnershipType,
                nv?.plotOwnership
            ];
            for (const field of fields) {
                const value = lv(field);
                if (value.fi || value.sv || value.en) return value;
            }
            return { fi: '', sv: '', en: '' };
        })(),

        // Dennis 2025-11-19: Förvaltningsform/Hallintamuoto - try all possible field names
        housingTenure: (() => {
            // DEBUG: Log ownership-related fields
            console.log('🔍 OWNERSHIP-RELATED FIELDS:');
            console.log('  ownershipType:', (src as any).ownershipType ? JSON.stringify((src as any).ownershipType) : 'null');
            console.log('  ownershipForm:', (src as any).ownershipForm ? JSON.stringify((src as any).ownershipForm) : 'null');
            console.log('  ägandeform:', (src as any).ägandeform ? JSON.stringify((src as any).ägandeform) : 'null');
            console.log('  agandeform:', (src as any).agandeform ? JSON.stringify((src as any).agandeform) : 'null');

            const fields = [
                (src as any).housingTenure,
                (src as any).hallintamuoto,  // Finnish field name
                (src as any).tenureType,
                (src as any).managementForm,
                (src as any).housingCooperativeForm,
                (src as any).companyForm,
                (src as any).forvaltningsform,  // Swedish field name
                nv?.housingTenure,
                nv?.hallintamuoto,
                nv?.housingCooperativeForm
            ];

            if ((src as any).housingTenure) {
                console.log('🔍 LINEAR API housingTenure FULL OBJECT:', JSON.stringify((src as any).housingTenure, null, 2));
                console.log('🔍 housingTenure.fi:', (src as any).housingTenure.fi);
                console.log('🔍 housingTenure.sv:', (src as any).housingTenure.sv);
                console.log('🔍 housingTenure.en:', (src as any).housingTenure.en);
            } else {
                console.log('❌ housingTenure field does not exist in API response');
            }

            for (const field of fields) {
                const value = lv(field);
                if (value.fi || value.sv || value.en) {
                    console.log('✅ Found housingTenure:', value);
                    return value;
                }
            }
            console.log('❌ No housingTenure found in any field - using default for apartments');

            // TEMPORARY FIX: If this is an apartment and housingTenure is null,
            // default to "Bostadsrättsförening" (most common in Finland/Sweden)
            const listingType = nv?.listingType || '';
            if (listingType === 'FLAT' || listingType === 'APARTMENT') {
                return {
                    fi: 'Asunto-osakeyhtiö',
                    sv: 'Bostadsrättsförening',
                    en: 'Housing cooperative'
                };
            }

            return { fi: '', sv: '', en: '' };
        })(),

        // Property-specific
        propertyIdentifier,
        propertyBuildingRights,
        restrictions: restrictions.fi || restrictions.sv || restrictions.en ? restrictions : undefined,

        // Dates & availability
        availableFrom: lv((src as any).availableFrom ?? (src as any).release ?? (src as any).freeOnText),
        zoning: lv((src as any).zoningStatus),

        // Building details
        yearBuilt: (() => {
          const year = Number(
            nv.yearBuilt ??
            nv.completeYear ??
            (src as any).yearBuilt ??
            (src as any).completeYear ??
            lget((src as any).completeYear!, 'fi')
          );
          return (!isNaN(year) && year > 0) ? year : undefined;
        })(),
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

      // Dennis 2025-12-15: International listing URL (Global Listing)
      internationalUrl,

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
