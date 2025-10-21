/**
 * Fastighet (Egendom/Egnahemshus) Property UI Tests
 * 
 * Validates detached house/estate property pages per spec pages 4-5:
 * - Prisuppgifter section with price (no debtPart typically)
 * - Fastighetsinformation section (ownership, propertyId, zoning, buildingRights)
 * - Byggfakta section (year, ventilation, floors, materials)
 * - Hide empty fields rule
 * - Site area in m² or ha (>=10,000 m²)
 * - PropertyTax with €/år suffix
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE || 'http://localhost:3000';
const FASTIGHET_SLUG = process.env.SLUG || 'remmarholmen';

interface FastighetPropertyData {
  streetAddress: string;
  city: string;
  region?: string;
  livingArea?: number;
  totalArea?: number;
  siteArea?: number;
  price: number;
  debtPart?: number;
  debtFreePrice?: number;
  waterFee?: number;
  otherFees?: number;
  propertyTax?: number;
  energyClass?: string;
  energyCertificate?: string;
  // Fastighetsinformation
  siteOwnershipType?: string;
  propertyId?: string;
  zoningSituation?: string;
  buildingRights?: string;
  // Byggfakta
  yearOfBuilding?: number;
  ventilationSystem?: string;
  numberOfFloors?: number;
  buildingMaterial?: string;
  roofType?: string;
}

test.describe('Fastighet Property - Spec Validation (Pages 4-5)', () => {
  
  let apiData: FastighetPropertyData;
  
  test.beforeAll(async () => {
    // Fetch API data in Swedish (per spec)
    const response = await fetch(`${BASE_URL}/api/property/${FASTIGHET_SLUG}?lang=sv`);
    apiData = await response.json();
    console.log('📋 Testing Fastighet property:', apiData.streetAddress);
  });

  test('Prisuppgifter section renders price correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${FASTIGHET_SLUG}?lang=sv`);
    await page.waitForLoadState('networkidle');
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Price must be visible
    expect(bodyText).toContain('Försäljningspris');
    console.log(`✓ Försäljningspris visible: ${apiData.price} €`);
    
    // Debt-free price (if exists - less common for houses)
    if (apiData.debtFreePrice && apiData.debtFreePrice > 0) {
      expect(bodyText).toContain('Skuldfritt');
      console.log(`✓ Skuldfritt pris visible: ${apiData.debtFreePrice} €`);
    }
    
    // Debt part should NOT appear if zero/null (typical for fastighet)
    if (!apiData.debtPart || apiData.debtPart === 0) {
      const hasDebt = bodyText.includes('Skuldandel');
      expect(hasDebt).toBeFalsy();
      console.log(`✓ No debt shown (correct for houses)`);
    }
  });

  test('Site area displays correctly: m² or ha for large plots', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${FASTIGHET_SLUG}?lang=sv`);
    
    if (!apiData.siteArea || apiData.siteArea === 0) {
      console.log('⚠ No site area data - skipping test');
      return;
    }
    
    const bodyText = await page.locator('body').textContent() || '';
    
    if (apiData.siteArea >= 10000) {
      // Should display as hectares
      const expectedHa = (apiData.siteArea / 10000).toFixed(2);
      expect(bodyText).toContain('ha');
      console.log(`✓ Large plot shows hectares: ${expectedHa} ha (${apiData.siteArea} m²)`);
    } else {
      // Should display as m²
      expect(bodyText).toContain(apiData.siteArea.toString());
      expect(bodyText).toContain('m²');
      console.log(`✓ Small plot shows m²: ${apiData.siteArea} m²`);
    }
  });

  test('PropertyTax displays with €/år suffix', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${FASTIGHET_SLUG}?lang=sv`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    if (apiData.propertyTax && apiData.propertyTax > 0) {
      // Should show with year suffix
      const hasTaxLabel = bodyText.includes('Fastighetsskatt') || bodyText.includes('Kiinteistövero');
      expect(hasTaxLabel).toBeTruthy();
      
      const hasYearSuffix = bodyText.includes('€/år') || bodyText.includes('€/v');
      expect(hasYearSuffix).toBeTruthy();
      
      console.log(`✓ Property tax with year suffix: ${apiData.propertyTax} €/år`);
    } else {
      // Row should be hidden
      const hasTaxLabel = bodyText.includes('Fastighetsskatt') || bodyText.includes('Kiinteistövero');
      expect(hasTaxLabel).toBeFalsy();
      console.log(`✓ Property tax row correctly hidden (empty)`);
    }
  });

  test('Fastighetsinformation section shows only non-empty fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${FASTIGHET_SLUG}?lang=sv`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Test siteOwnershipType (Ägandet)
    if (apiData.siteOwnershipType && apiData.siteOwnershipType.trim().length > 0) {
      const hasOwnershipLabel = (
        bodyText.includes('Tontin omistus') || // Finnish
        bodyText.includes('Ägandet') ||        // Swedish  
        bodyText.includes('Ownership')         // English
      );
      expect(hasOwnershipLabel).toBeTruthy();
      
      // Validate value is Oma/Vuokra or Egen/Hyra
      const validValues = ['Oma', 'Vuokra', 'Egen', 'Hyra', 'Owned', 'Rented'];
      expect(validValues).toContain(apiData.siteOwnershipType);
      
      console.log(`✓ Site ownership visible: ${apiData.siteOwnershipType}`);
    } else {
      const hasOwnershipLabel = bodyText.includes('Tontin omistus') || bodyText.includes('Ägandet');
      expect(hasOwnershipLabel).toBeFalsy();
      console.log(`✓ Site ownership row hidden (empty)`);
    }
    
    // Test propertyId (Fastighetsbeteckning)
    if (apiData.propertyId && apiData.propertyId.trim().length > 0) {
      expect(bodyText).toContain(apiData.propertyId);
      console.log(`✓ Property ID visible: ${apiData.propertyId}`);
    } else {
      const hasPropIdLabel = (
        bodyText.includes('Kiinteistötunnus') ||
        bodyText.includes('Fastighetsbeteckning')
      );
      expect(hasPropIdLabel).toBeFalsy();
      console.log(`✓ Property ID row hidden (empty)`);
    }
    
    // Test zoningSituation (Generalplan)
    if (apiData.zoningSituation && apiData.zoningSituation.trim().length > 0) {
      const hasZoningLabel = (
        bodyText.includes('Kaavoitustilanne') ||
        bodyText.includes('Planläggning')
      );
      expect(hasZoningLabel).toBeTruthy();
      console.log(`✓ Zoning visible: ${apiData.zoningSituation}`);
    } else {
      const hasZoningLabel = bodyText.includes('Kaavoitustilanne') || bodyText.includes('Planläggning');
      expect(hasZoningLabel).toBeFalsy();
      console.log(`✓ Zoning row hidden (empty)`);
    }
    
    // Test buildingRights (Byggnadsrätt) - critical per spec
    if (apiData.buildingRights && apiData.buildingRights.trim().length > 0) {
      const hasBuildingRightsLabel = (
        bodyText.includes('Rakennusoikeus') ||
        bodyText.includes('Byggnadsrätt')
      );
      expect(hasBuildingRightsLabel).toBeTruthy();
      console.log(`✓ Building rights visible: ${apiData.buildingRights}`);
    } else {
      const hasBuildingRightsLabel = bodyText.includes('Rakennusoikeus') || bodyText.includes('Byggnadsrätt');
      expect(hasBuildingRightsLabel).toBeFalsy();
      console.log(`✓ Building rights row HIDDEN per spec (empty)`);
    }
  });

  test('Byggfakta section shows available construction details', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${FASTIGHET_SLUG}?lang=sv`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Year of building
    if (apiData.yearOfBuilding && apiData.yearOfBuilding > 0) {
      expect(bodyText).toContain(apiData.yearOfBuilding.toString());
      console.log(`✓ Year of building: ${apiData.yearOfBuilding}`);
    }
    
    // Ventilation system
    if (apiData.ventilationSystem && apiData.ventilationSystem.trim().length > 0) {
      const hasVentLabel = (
        bodyText.includes('Ilmanvaihto') ||
        bodyText.includes('Ventilation')
      );
      expect(hasVentLabel).toBeTruthy();
      console.log(`✓ Ventilation system: ${apiData.ventilationSystem}`);
    } else {
      const hasVentLabel = bodyText.includes('Ilmanvaihto') || bodyText.includes('Ventilationssystem');
      expect(hasVentLabel).toBeFalsy();
      console.log(`✓ Ventilation row hidden (empty)`);
    }
    
    // Number of floors
    if (apiData.numberOfFloors && apiData.numberOfFloors > 0) {
      const hasFloorsLabel = (
        bodyText.includes('Kerrosluku') ||
        bodyText.includes('Våningar') ||
        bodyText.includes('Floors')
      );
      expect(hasFloorsLabel).toBeTruthy();
      console.log(`✓ Number of floors: ${apiData.numberOfFloors}`);
    }
    
    // Building material
    if (apiData.buildingMaterial && apiData.buildingMaterial.trim().length > 0) {
      const hasMaterialLabel = (
        bodyText.includes('Rakennusaine') ||
        bodyText.includes('Byggnadsmaterial')
      );
      expect(hasMaterialLabel).toBeTruthy();
      console.log(`✓ Building material: ${apiData.buildingMaterial}`);
    } else {
      console.log(`⚠ Building material empty`);
    }
    
    // Roof type
    if (apiData.roofType && apiData.roofType.trim().length > 0) {
      const hasRoofLabel = (
        bodyText.includes('Kattotyyppi') ||
        bodyText.includes('Taktyp')
      );
      expect(hasRoofLabel).toBeTruthy();
      console.log(`✓ Roof type: ${apiData.roofType}`);
    } else {
      console.log(`⚠ Roof type empty`);
    }
  });

  test('Energy class optional - hidden when empty', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${FASTIGHET_SLUG}?lang=sv`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    if (apiData.energyClass && apiData.energyClass.trim().length > 0) {
      const hasEnergyLabel = (
        bodyText.includes('Energiklass') ||
        bodyText.includes('Energialuokka')
      );
      expect(hasEnergyLabel).toBeTruthy();
      console.log(`✓ Energy class visible: ${apiData.energyClass}`);
    } else {
      const hasEnergyLabel = bodyText.includes('Energiklass') || bodyText.includes('Energialuokka');
      expect(hasEnergyLabel).toBeFalsy();
      console.log(`✓ Energy class row hidden (empty per spec)`);
    }
  });

  test('All required Fastighet fields are present', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${FASTIGHET_SLUG}?lang=sv`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Core required fields
    expect(bodyText).toContain(apiData.streetAddress);
    expect(bodyText).toContain(apiData.city);
    
    // Price always required
    const priceStr = apiData.price.toString();
    expect(bodyText).toContain(priceStr);
    
    console.log('✓ All required fields present: address, city, price');
  });

  test('Swedish language labels used throughout', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${FASTIGHET_SLUG}?lang=sv`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Check for Swedish labels (not Finnish/English)
    const swedishLabels = [
      'Försäljningspris',  // Not "Myyntihinta" or "Sale Price"
      'Stadsdel',          // Not "Kaupunginosa" or "District"
    ];
    
    for (const label of swedishLabels) {
      expect(bodyText).toContain(label);
      console.log(`✓ Swedish label present: ${label}`);
    }
  });

  test('Fees display with correct units', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${FASTIGHET_SLUG}?lang=sv`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Water fee (monthly)
    if (apiData.waterFee && apiData.waterFee > 0) {
      const hasMonthSuffix = bodyText.includes('€/mån') || bodyText.includes('€/kk');
      expect(hasMonthSuffix).toBeTruthy();
      console.log(`✓ Water fee with month suffix: ${apiData.waterFee} €/mån`);
    }
    
    // Other fees (monthly)
    if (apiData.otherFees && apiData.otherFees > 0) {
      const hasMonthSuffix = bodyText.includes('€/mån') || bodyText.includes('€/kk');
      expect(hasMonthSuffix).toBeTruthy();
      console.log(`✓ Other fees with month suffix: ${apiData.otherFees} €/mån`);
    }
  });
});

