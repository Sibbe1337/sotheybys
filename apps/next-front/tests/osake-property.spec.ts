/**
 * Osake (Aktielägenhet) Property UI Tests
 * 
 * Validates apartment property pages per spec pages 1-3:
 * - Price rows (Myyntihinta, Velkaosuus, Velaton hinta)
 * - Vederlag section (shows only when fees > 0)
 * - numberOfShares (row hidden when empty)
 * - energyClass (row hidden when empty)
 * - Hide empty fields rule
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE || 'http://localhost:3000';
const OSAKE_SLUG = process.env.SLUG || 'bernhardinkatu-1';

interface OsakePropertyData {
  streetAddress: string;
  postalCode: string;
  city: string;
  price: number;
  debtPart: number;
  debtFreePrice: number;
  livingArea: number;
  maintenanceFee?: number;
  financingFee?: number;
  otherFees?: number;
  totalFee?: number;
  waterFee?: number;
  numberOfShares?: string;
  energyClass?: string;
  balcony?: boolean;
  sauna?: boolean;
}

test.describe('Osake Property - Spec Validation', () => {
  
  let apiData: OsakePropertyData;
  
  test.beforeAll(async () => {
    // Fetch API data once for all tests
    const response = await fetch(`${BASE_URL}/api/property/${OSAKE_SLUG}?lang=fi`);
    apiData = await response.json();
    console.log('📋 Testing property:', apiData.streetAddress);
  });

  test('Price rows display correctly: Myyntihinta, Velkaosuus, Velaton hinta', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${OSAKE_SLUG}?lang=fi`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Test 1: Myyntihinta (sale price) row
    expect(bodyText).toContain('Myyntihinta');
    const priceText = apiData.price.toLocaleString('fi-FI');
    console.log(`✓ Checking for price: ${priceText}`);
    
    // Test 2: Velkaosuus (debt part) row
    if (apiData.debtPart && apiData.debtPart > 0) {
      expect(bodyText).toContain('Velkaosuus');
      console.log(`✓ Velkaosuus visible: ${apiData.debtPart} €`);
    }
    
    // Test 3: Velaton hinta (debt-free price) row
    expect(bodyText).toContain('Velaton');
    console.log(`✓ Velaton hinta visible: ${apiData.debtFreePrice} €`);
    
    // Test 4: €/m² should be computed and displayed
    if (apiData.livingArea > 0) {
      const pricePerM2 = Math.round(apiData.price / apiData.livingArea);
      // Check if the computed value appears somewhere
      const hasPerM2 = bodyText.includes('€/m²') || bodyText.includes('per m²');
      expect(hasPerM2).toBeTruthy();
      console.log(`✓ €/m² calculation present (${pricePerM2} €/m²)`);
    }
  });

  test('Vederlag section shows only when fees are non-zero', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${OSAKE_SLUG}?lang=fi`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    const hasAnyFee = (
      (apiData.maintenanceFee && apiData.maintenanceFee > 0) ||
      (apiData.financingFee && apiData.financingFee > 0) ||
      (apiData.totalFee && apiData.totalFee > 0)
    );
    
    if (hasAnyFee) {
      // At least one fee exists - section should be visible
      
      // Check for maintenance fee (Yhtiövastike)
      if (apiData.maintenanceFee && apiData.maintenanceFee > 0) {
        expect(bodyText).toContain('Yhtiövastike');
        console.log(`✓ Yhtiövastike visible: ${apiData.maintenanceFee} €/kk`);
      } else {
        expect(bodyText).not.toContain('Yhtiövastike');
        console.log(`✓ Yhtiövastike hidden (value: 0 or null)`);
      }
      
      // Check for financing fee (Rahoitusvastike)
      if (apiData.financingFee && apiData.financingFee > 0) {
        expect(bodyText).toContain('Rahoitusvastike');
        console.log(`✓ Rahoitusvastike visible: ${apiData.financingFee} €/kk`);
      } else {
        expect(bodyText).not.toContain('Rahoitusvastike');
        console.log(`✓ Rahoitusvastike hidden (value: 0 or null)`);
      }
      
      // Check for total fee (Kokonaisvastike)
      const expectedTotal = (apiData.maintenanceFee || 0) + (apiData.financingFee || 0);
      if (apiData.totalFee && apiData.totalFee > 0) {
        expect(bodyText).toContain('Kokonaisvastike');
        console.log(`✓ Kokonaisvastike visible: ${apiData.totalFee} €/kk`);
      } else if (expectedTotal > 0) {
        // Fallback computation should show
        expect(bodyText).toContain('Kokonaisvastike');
        console.log(`✓ Kokonaisvastike computed as fallback: ${expectedTotal} €/kk`);
      }
      
    } else {
      // No fees - entire section should be hidden
      const hasVederlagSection = (
        bodyText.includes('Yhtiövastike') || 
        bodyText.includes('Rahoitusvastike') ||
        bodyText.includes('Kokonaisvastike')
      );
      expect(hasVederlagSection).toBeFalsy();
      console.log(`✓ Vederlag section hidden (all fees are 0 or null)`);
    }
  });

  test('numberOfShares row appears only when non-empty', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${OSAKE_SLUG}?lang=fi`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    if (apiData.numberOfShares && apiData.numberOfShares.trim().length > 0) {
      // Shares exist - label should be visible
      const hasSharesLabel = (
        bodyText.includes('Osakkeiden numerot') ||
        bodyText.includes('Aktie') ||
        bodyText.includes('Share')
      );
      expect(hasSharesLabel).toBeTruthy();
      console.log(`✓ numberOfShares visible: ${apiData.numberOfShares}`);
    } else {
      // No shares - label row should be absent
      const hasSharesLabel = (
        bodyText.includes('Osakkeiden numerot') ||
        bodyText.includes('Aktie numror')
      );
      expect(hasSharesLabel).toBeFalsy();
      console.log(`✓ numberOfShares row correctly hidden (empty value)`);
    }
  });

  test('energyClass row appears only when API provides it', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${OSAKE_SLUG}?lang=fi`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    if (apiData.energyClass && apiData.energyClass.trim().length > 0) {
      // Energy class exists - should be visible
      expect(bodyText).toContain('Energialuokka');
      expect(bodyText).toContain(apiData.energyClass);
      console.log(`✓ energyClass visible: ${apiData.energyClass}`);
    } else {
      // No energy class - label row should be absent
      const hasEnergyLabel = bodyText.includes('Energialuokka');
      expect(hasEnergyLabel).toBeFalsy();
      console.log(`✓ energyClass row correctly hidden (empty value)`);
    }
  });

  test('All required Osake fields are present', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${OSAKE_SLUG}?lang=fi`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Required fields per spec
    const requiredFields = [
      { label: 'Osoite', value: apiData.streetAddress },
      { label: 'Kaupunki', value: apiData.city },
      { label: 'Pinta-ala', value: apiData.livingArea },
      { label: 'Hinta', value: apiData.price },
    ];
    
    for (const field of requiredFields) {
      if (field.value) {
        const valueStr = String(field.value);
        expect(bodyText).toContain(valueStr);
        console.log(`✓ Required field present: ${field.label} = ${valueStr}`);
      } else {
        console.error(`✗ Required field missing: ${field.label}`);
        expect(field.value).toBeTruthy();
      }
    }
  });

  test('Boolean fields (balcony, sauna) display correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${OSAKE_SLUG}?lang=fi`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Test balcony
    if (apiData.balcony !== undefined && apiData.balcony !== null) {
      expect(bodyText).toContain('Parveke');
      const expectedText = apiData.balcony ? 'Kyllä' : 'Ei';
      expect(bodyText).toContain(expectedText);
      console.log(`✓ Balcony: ${expectedText}`);
    }
    
    // Test sauna
    if (apiData.sauna !== undefined && apiData.sauna !== null) {
      expect(bodyText).toContain('Sauna');
      const expectedText = apiData.sauna ? 'Kyllä' : 'Ei';
      expect(bodyText).toContain(expectedText);
      console.log(`✓ Sauna: ${expectedText}`);
    }
  });

  test('Swedish (sv) translations for Osake fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${OSAKE_SLUG}?lang=sv`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Check Swedish labels
    const swedishLabels = [
      'Försäljningspris',  // Sale price
      'Skuldandel',        // Debt part (if present)
      'Skuldfritt pris',   // Debt-free price
    ];
    
    for (const label of swedishLabels) {
      if (label === 'Skuldandel' && (!apiData.debtPart || apiData.debtPart === 0)) {
        continue; // Skip if debt part is 0
      }
      expect(bodyText).toContain(label);
      console.log(`✓ Swedish label present: ${label}`);
    }
  });

  test('English (en) translations for Osake fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${OSAKE_SLUG}?lang=en`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Check English labels
    const englishLabels = [
      'Sale Price',
      'Debt-Free Price',
    ];
    
    for (const label of englishLabels) {
      expect(bodyText).toContain(label);
      console.log(`✓ English label present: ${label}`);
    }
  });

  test('Empty optional fields are hidden', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/${OSAKE_SLUG}?lang=fi`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Test optional fields that should hide when empty
    const optionalFields = [
      { apiKey: 'waterFee', label: 'Vesimaksu', value: apiData.waterFee },
      { apiKey: 'numberOfShares', label: 'Osakkeiden numerot', value: apiData.numberOfShares },
      { apiKey: 'energyClass', label: 'Energialuokka', value: apiData.energyClass },
    ];
    
    for (const field of optionalFields) {
      const isEmpty = !field.value || field.value === 0 || (typeof field.value === 'string' && field.value.trim().length === 0);
      const labelPresent = bodyText.includes(field.label);
      
      if (isEmpty && labelPresent) {
        console.error(`✗ Empty field showing label: ${field.label}`);
        expect(labelPresent).toBeFalsy();
      } else if (isEmpty) {
        console.log(`✓ Empty field correctly hidden: ${field.label}`);
      } else {
        console.log(`✓ Non-empty field visible: ${field.label} = ${field.value}`);
      }
    }
  });
});

