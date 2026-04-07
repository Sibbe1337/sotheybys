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
  lget, lv, lvHtml, toBool, pickNV, parseNum,
  firstNumber, applyUnit, normalizeStatus,
  resolve, resolveFi, firstLv, anyLocale
} from './mapper-helpers';
import { extractCoordinates } from './mapper-coordinates';
import { extractDocumentUrls } from './mapper-documents';

export class LinearToPropertyMapper {
  private existingSlugs = new Set<string>();

  async map(src: LinearListing, locale: 'fi' | 'sv' | 'en'): Promise<Property> {
    const nv = src.nonLocalizedValues ?? {};

    // Basic info
    const addressFi = lget(src.address!, 'fi');
    const postalCode = lget(src.postalCode!, locale);
    const cityFi = lget(src.city!, 'fi');
    const districtData = lv(src.district ?? src.districtFree);

    const slug = src.slug
      ? String(src.slug)
      : buildSlug(addressFi, { postalCode, city: cityFi, existingSlugs: this.existingSlugs });
    this.existingSlugs.add(slug);

    const description = lvHtml(src.freeText ?? src.marketingDescription);
    const descriptionTitle = lv(src.freeTextTitle);

    // Pricing — always use Finnish for tax (amount is locale-independent)
    const sales = parseEuro(pickNV(nv, 'askPrice') ?? (src.askPrice && lget(src.askPrice, locale)));
    const debtFree = parseEuro(pickNV(nv, 'debtFreePrice') ?? (src.debtFreePrice && lget(src.debtFreePrice, locale)));
    const debt = Math.max(0, debtFree - sales);
    const propertyTax = parseEuro(resolveFi(src, nv, ['propertyTax', 'realEstateTax'])) || undefined;
    const biddingStartPrice = parseEuro(resolve(src, nv, locale, ['debtlessStartPrice'])) || undefined;
    const biddingUrl = src.biddingUrl || nv.biddingUrl || undefined;

    // Dimensions
    const living = parseNum(pickNV(nv, 'area') ?? lget(src.area!, 'fi')) || 0;
    const otherSpaces = parseNum(resolve(src, nv, 'fi', ['otherArea']));

    let total = parseNum(
      pickNV(nv, 'totalArea', 'total_area', 'kokonaisala') ??
      lget(src.overallArea!, 'fi') ??
      lget(src.totalArea!, 'fi')
    );
    if (!total && otherSpaces && otherSpaces > 0) total = living + otherSpaces;

    // Plot area with unit conversion
    const nvPlot = firstNumber(nv?.plotArea, nv?.lotArea, nv?.siteArea, nv?.propertyArea, nv?.estateArea);
    const unitNv = nv?.plotAreaUnit || nv?.lotAreaUnit || nv?.siteAreaUnit || nv?.propertyAreaUnit || nv?.estateAreaUnit || null;
    const plotFields = ['plotArea', 'lotArea', 'siteArea', 'propertyArea', 'estateArea'] as const;
    const plotFiValues = plotFields.map(f => lget(src[f], 'fi'));
    const localizedPlot = firstNumber(...plotFiValues);
    const plotCandidate = nvPlot ?? localizedPlot;
    const plot = plotCandidate !== undefined
      ? applyUnit(plotCandidate, unitNv, plotFiValues.find(v => v) || null)
      : undefined;

    const business = parseNum(pickNV(nv, 'businessPremiseArea') ?? lget(src.businessPremiseArea!, 'fi'));
    const balcony = parseNum(pickNV(nv, 'balconyArea') ?? lget(src.balconyArea!, 'fi'));
    const terrace = parseNum(pickNV(nv, 'terraceArea') ?? lget(src.terraceArea!, 'fi'));
    const rooms = lget(src.rooms!, locale) || pickNV(nv, 'rooms') || undefined;
    const bedrooms = parseNum(pickNV(nv, 'numberOfBedrooms') ?? lget(src.numberOfBedrooms!, 'fi'));
    const bathrooms = parseNum(pickNV(nv, 'numberOfBathrooms') ?? lget(src.numberOfBathrooms!, 'fi'));

    // Fees — try locale then Finnish fallback
    const feeEuro = (fields: string[]) => parseEuro(resolve(src, nv, locale, fields)) || undefined;
    const maintenance = feeEuro(['renovationCharge', 'maintenanceCharge']);
    const financing = feeEuro(['fundingCharge', 'financingCharge']);
    const water = feeEuro(['waterCharge']);
    const heating = feeEuro(['heatingCharge', 'averageTotalHeatingCharge', 'electricHeatingCharge']);
    const electricity = feeEuro(['electricHeatingCharge']);
    const parking = feeEuro(['parkingCharge']);
    const saunaFee = feeEuro(['saunaCharge']);

    // Features
    const features = {
      balcony: toBool(pickNV(nv, 'hasBalcony', 'balcony') ?? src.hasBalcony ?? src.balcony),
      terrace: toBool(pickNV(nv, 'hasTerrace', 'terrace') ?? src.hasTerrace ?? src.terrace),
      sauna: toBool(pickNV(nv, 'sauna') ?? src.sauna),
      fireplace: toBool(pickNV(nv, 'fireplace') ?? src.fireplace),
      storageRoom: toBool(pickNV(nv, 'storageRoom') ?? src.storageRoom),
      parkingSpace: toBool(pickNV(nv, 'hasParkingSpace', 'parkingSpace') ?? src.hasParkingSpace ?? src.parkingSpace)
    };

    // Meta
    const status = normalizeStatus(pickNV(nv, 'status') ?? lget(src.status!, locale));
    const hasElevator = toBool(src.housingCooperativeElevator ?? src.elevator ?? pickNV(nv, 'housingCooperativeElevator'));
    const rentValue = src.rent ? parseEuro(lget(src.rent, 'fi')) : undefined;
    const floor = lget(src.floor!, locale) || lget(src.floorLocation!, locale) || pickNV(nv, 'floor') || undefined;

    const loansSrc = pickNV(nv, 'companyLoans') ?? src.companyLoans ?? src.taloyhtionLainat;
    const encumbrancesSrc = pickNV(nv, 'housingCooperativeMortgage') ?? src.housingCooperativeMortgage ?? src.propertyMortgage ?? src.encumbranceAmount;
    const loansNum = loansSrc != null ? parseEuro(loansSrc) : null;
    const encumbrancesNum = encumbrancesSrc != null ? parseEuro(encumbrancesSrc) : null;
    const loansDate = lget(src.housingCooperativeMortgageDate!, locale) || lget(src.propertyManagerCertificateDate!, locale) || undefined;

    const identifierFi = pickNV(nv, 'identifier', 'propertyId') ?? lget(src.identifier!, 'fi') ?? undefined;
    const condition = lv(src.condition);
    const propertyIdentifier = resolve(src, nv, locale, ['propertyIdentifier', 'estateName']);
    const propertyBuildingRights = resolve(src, nv, locale, ['propertyBuildingRights', 'buildingRights']);
    const restrictions = lv(src.restrictions);

    const productGroup = anyLocale(src.productGroup)?.toUpperCase().replace(/ /g, '_');
    const typeCode = (anyLocale(src.listingType) || anyLocale(src.propertyType) || anyLocale(src.type))
      ?.toUpperCase().replace(/ /g, '_');
    const listingTypeLabel = localizeListingType(nv?.listingType || lget(src.listingType, 'fi') || '');

    // Energy cert status — try all languages, return first valid
    const energyCertStatus = (() => {
      for (const lang of ['fi', 'sv', 'en'] as const) {
        const status = normalizeEnergyStatus(lget(src.listingHasEnergyCertificate!, lang));
        if (status !== null) return status;
      }
      return null;
    })();

    const plotOwnership = firstLv(src, 'siteOwnershipType', 'lotOwnership', 'plotOwnership', 'landOwnership');

    // Housing tenure with apartment default fallback
    let housingTenure = firstLv(src,
      'housingTenure', 'hallintamuoto', 'tenureType', 'managementForm',
      'housingCooperativeForm', 'companyForm', 'forvaltningsform'
    );
    if (!housingTenure.fi && !housingTenure.sv && !housingTenure.en) {
      // Also check nv fields
      const nvTenure = pickNV(nv, 'housingTenure', 'hallintamuoto', 'housingCooperativeForm');
      if (nvTenure) {
        housingTenure = lv(nvTenure);
      }
    }
    if (!housingTenure.fi && !housingTenure.sv && !housingTenure.en) {
      const lt = nv?.listingType || '';
      if (lt === 'FLAT' || lt === 'APARTMENT') {
        housingTenure = { fi: 'Asunto-osakeyhtiö', sv: 'Bostadsrättsförening', en: 'Housing cooperative' };
      }
    }

    const yearBuilt = (() => {
      const year = Number(nv.yearBuilt ?? nv.completeYear ?? src.yearBuilt ?? src.completeYear ?? lget(src.completeYear!, 'fi'));
      return !isNaN(year) && year > 0 ? year : undefined;
    })();

    // Coordinates & documents
    const coordinates = await extractCoordinates(src, nv, addressFi, postalCode, cityFi);
    const { floorPlanUrl, brochureUrl, brochureIntl, internationalUrl, videoUrl, energyCertUrl } =
      extractDocumentUrls(src, locale, nv);

    // Rental
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

    // Agent
    const agentSource = src.agent || src.realtor;
    const rawAgent: any = agentSource ? {
      name: agentSource.name || src.realtorName,
      phone: src.agent?.phone || src.realtor?.tel,
      email: agentSource.email,
      avatar: agentSource.avatar,
      photoUrl: src.agent?.photo?.sourceUrl || agentSource.avatar,
      jobTitle: agentSource.jobTitle,
      companyName: src.realtor?.primaryCompany?.name
    } : {
      name: src.estateAgentName,
      phone: src.estateAgentPhone,
      email: src.estateAgentEmail
    };

    const { warnings: agentWarnings, ...agentData } = cleanAgentData(rawAgent);
    if (agentWarnings.length > 0) warn('Agent data warnings for', addressFi, agentWarnings);

    // Apartment identifier (gate + number, e.g. "C 47")
    const gateStr = lget(src.gate, 'fi')?.trim();
    const aptNum = lget(src.apartmentNumber, 'fi')?.trim();
    const apartmentIdentifier = gateStr && aptNum ? `${gateStr} ${aptNum}` : gateStr || aptNum || undefined;

    const hasContent = (v: any) => v?.fi || v?.sv || v?.en;

    const property: Property = {
      id: String(nv.id ?? src.id ?? ''),
      slug,
      address: lv(src.address),
      city: lv(src.city),
      district: hasContent(districtData) ? districtData : undefined,
      postalCode,
      apartmentIdentifier,
      gate: gateStr,
      description: hasContent(description) ? description : undefined,
      descriptionTitle: hasContent(descriptionTitle) ? descriptionTitle : undefined,

      pricing: { sales, debtFree, debt, propertyTax, biddingStartPrice, biddingUrl },
      dimensions: { living, total, plot, business, balcony, terrace, rooms, bedrooms, bathrooms },
      fees: { maintenance, financing, water, heating, electricity, parking, sauna: saunaFee },
      features,

      meta: {
        status,
        productGroup,
        typeCode,
        listingTypeLabel,
        identifierFi,
        apartmentType: lv(src.typeOfApartment),
        condition: hasContent(condition) ? condition : undefined,
        energyClass: resolve(src, nv, locale, ['energyClass']) || undefined,
        energyCertStatus,
        heatingSystem: lv(src.heatingSystem),
        ventilationSystem: lv(src.ventilationSystem),
        ownershipType: lv(src.ownershipType),
        plotOwnership,
        housingTenure,
        propertyIdentifier,
        propertyBuildingRights,
        restrictions: hasContent(restrictions) ? restrictions : undefined,
        availableFrom: lv(src.availableFrom ?? src.release ?? src.freeOnText),
        zoning: lv(src.zoningStatus),
        yearBuilt,
        floorsTotal: Number(nv.floorCount ?? src.floorCount) || undefined,
        floor,
        elevator: hasElevator,
        rent: rentValue,
        housingCompany: {
          name: lv(src.housingCooperativeName),
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

      documents: { floorPlan: floorPlanUrl, brochure: brochureUrl, brochureIntl, video: videoUrl, energyCert: energyCertUrl },
      internationalUrl,
      agent: Object.values(agentData).some(v => v) ? agentData : undefined,
      rental: rentalData
    };

    const validation = validateProperty(property);
    if (!validation.success && validation.warnings.length > 0) {
      warn('Property validation warnings for', addressFi, validation.warnings);
    }

    return property;
  }
}
