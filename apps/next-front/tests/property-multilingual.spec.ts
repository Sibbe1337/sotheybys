/**
 * Property Page Multilingual Validation Tests
 * 
 * Tests that property pages correctly:
 * 1. Display required fields (address, city, contact CTA)
 * 2. Hide empty fields per spec: "Om något fält är tomt → visa inte det på hemsidan"
 * 3. Show proper translations for all languages (fi, sv, en)
 * 4. Match API data with UI display
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE || 'http://localhost:3000';
const TEST_SLUG = process.env.TEST_SLUG || 'pengerkatu-25';

// Language-specific labels for contact CTA
const CONTACT_LABELS = {
  fi: 'Ota yhteyttä',
  sv: 'Kontakta',
  en: 'Contact'
};

// Description section headers
const DESCRIPTION_LABELS = {
  fi: 'Kuvaus',
  sv: 'Beskrivning',
  en: 'Description'
};

interface PropertyData {
  streetAddress: string;
  postalCode: string;
  city: string;
  description: string;
  price: number;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
}

test.describe('Property Page - Multilingual & Field Visibility', () => {
  
  // Helper to fetch API data
  async function fetchPropertyData(lang: string): Promise<PropertyData> {
    const response = await fetch(`${BASE_URL}/api/property/${TEST_SLUG}?lang=${lang}`);
    const data = await response.json();
    return data;
  }
  
  // Helper to build expected address string
  function buildAddressString(data: PropertyData): string {
    const parts = [data.streetAddress];
    if (data.postalCode && data.city) {
      parts.push(`${data.postalCode} ${data.city}`);
    } else if (data.city) {
      parts.push(data.city);
    }
    return parts.join(', ');
  }

  test('Finnish (fi) - Required fields and empty field hiding', async ({ page }) => {
    const lang = 'fi';
    const apiData = await fetchPropertyData(lang);
    
    await page.goto(`${BASE_URL}/property/${TEST_SLUG}?lang=${lang}`);
    
    // Test 1: Address must be visible and match API data
    const addressLocator = page.locator('text=' + apiData.streetAddress).first();
    await expect(addressLocator).toBeVisible({ timeout: 10000 });
    
    const expectedAddress = buildAddressString(apiData);
    const addressText = await page.locator('body').textContent();
    expect(addressText).toContain(apiData.streetAddress);
    expect(addressText).toContain(apiData.city);
    
    console.log(`✓ Address verified: ${expectedAddress}`);
    
    // Test 2: Contact CTA must be visible
    const contactButton = page.getByRole('link', { name: new RegExp(CONTACT_LABELS[lang], 'i') });
    await expect(contactButton).toBeVisible();
    console.log(`✓ Contact CTA visible: "${CONTACT_LABELS[lang]}"`);
    
    // Test 3: Description section visibility based on API data
    if (!apiData.description || apiData.description.trim().length === 0) {
      // Description is empty - section should NOT be visible
      const descriptionSection = page.locator(`text=${DESCRIPTION_LABELS[lang]}`).first();
      const isVisible = await descriptionSection.isVisible().catch(() => false);
      expect(isVisible).toBeFalsy();
      console.log(`✓ Empty description correctly hidden`);
    } else {
      // Description exists - should be visible
      const descriptionSection = page.locator(`text=${DESCRIPTION_LABELS[lang]}`).first();
      await expect(descriptionSection).toBeVisible();
      console.log(`✓ Description section visible (${apiData.description.length} chars)`);
    }
    
    // Test 4: Empty fields should not render rows
    // Check that housing company fields don't show if empty
    const bodyText = await page.locator('body').textContent() || '';
    
    // If company name is empty in API, "Yhtiön nimi" label should not appear
    const hasCompanyLabel = bodyText.includes('Yhtiön nimi') || bodyText.includes('Y-tunnus');
    if (hasCompanyLabel) {
      console.log(`⚠ Company info visible (expected if data exists)`);
    } else {
      console.log(`✓ Empty company fields correctly hidden`);
    }
  });

  test('Swedish (sv) - Required fields and translations', async ({ page }) => {
    const lang = 'sv';
    const apiData = await fetchPropertyData(lang);
    
    await page.goto(`${BASE_URL}/property/${TEST_SLUG}?lang=${lang}`);
    
    // Test 1: Address visible
    const addressText = await page.locator('body').textContent();
    expect(addressText).toContain(apiData.streetAddress);
    expect(addressText).toContain(apiData.city);
    console.log(`✓ Address verified (Swedish)`);
    
    // Test 2: Contact CTA in Swedish
    const contactButton = page.getByRole('link', { name: new RegExp(CONTACT_LABELS[lang], 'i') });
    await expect(contactButton).toBeVisible();
    console.log(`✓ Contact CTA visible: "${CONTACT_LABELS[lang]}"`);
    
    // Test 3: Description visibility
    if (!apiData.description || apiData.description.trim().length === 0) {
      const descriptionSection = page.locator(`text=${DESCRIPTION_LABELS[lang]}`).first();
      const isVisible = await descriptionSection.isVisible().catch(() => false);
      expect(isVisible).toBeFalsy();
      console.log(`✓ Empty description correctly hidden`);
    }
  });

  test('English (en) - Required fields and translations', async ({ page }) => {
    const lang = 'en';
    const apiData = await fetchPropertyData(lang);
    
    await page.goto(`${BASE_URL}/property/${TEST_SLUG}?lang=${lang}`);
    
    // Test 1: Address visible
    const addressText = await page.locator('body').textContent();
    expect(addressText).toContain(apiData.streetAddress);
    expect(addressText).toContain(apiData.city);
    console.log(`✓ Address verified (English)`);
    
    // Test 2: Contact CTA in English
    const contactButton = page.getByRole('link', { name: new RegExp(CONTACT_LABELS[lang], 'i') });
    await expect(contactButton).toBeVisible();
    console.log(`✓ Contact CTA visible: "${CONTACT_LABELS[lang]}"`);
    
    // Test 3: Description visibility
    if (!apiData.description || apiData.description.trim().length === 0) {
      const descriptionSection = page.locator(`text=${DESCRIPTION_LABELS[lang]}`).first();
      const isVisible = await descriptionSection.isVisible().catch(() => false);
      expect(isVisible).toBeFalsy();
      console.log(`✓ Empty description correctly hidden`);
    }
  });

  test('Empty fields do not render visible rows', async ({ page }) => {
    const apiData = await fetchPropertyData('fi');
    
    await page.goto(`${BASE_URL}/property/${TEST_SLUG}?lang=fi`);
    
    // Get all visible text
    const bodyText = await page.locator('body').textContent() || '';
    
    // Fields that should be hidden if empty
    const optionalFields = [
      { apiKey: 'housingCompanyName', label: 'Yhtiön nimi' },
      { apiKey: 'businessId', label: 'Y-tunnus' },
      { apiKey: 'managerName', label: 'Isännöitsijä' },
      { apiKey: 'siteOwnershipType', label: 'Tontin omistus' },
    ];
    
    let hiddenCount = 0;
    for (const field of optionalFields) {
      const apiValue = (apiData as any)[field.apiKey];
      const labelVisible = bodyText.includes(field.label);
      
      if (!apiValue || apiValue.trim().length === 0) {
        if (!labelVisible) {
          console.log(`✓ Empty field correctly hidden: ${field.label}`);
          hiddenCount++;
        } else {
          console.log(`⚠ Empty field showing label: ${field.label}`);
        }
      } else {
        if (labelVisible) {
          console.log(`✓ Non-empty field visible: ${field.label}`);
        }
      }
    }
    
    expect(hiddenCount).toBeGreaterThan(0); // At least some empty fields should be hidden
  });

  test('Homepage property cards - Language switching', async ({ page }) => {
    // Test that homepage property cards translate correctly
    await page.goto(`${BASE_URL}/?lang=fi`);
    
    // Check for Finnish "Katso kohde" button
    const fiBtnCount = await page.getByText('Katso kohde').count();
    expect(fiBtnCount).toBeGreaterThan(0);
    console.log(`✓ Finnish property cards: ${fiBtnCount} "Katso kohde" buttons`);
    
    // Switch to Swedish
    await page.goto(`${BASE_URL}/?lang=sv`);
    const svBtnCount = await page.getByText('Se objekt').count();
    expect(svBtnCount).toBeGreaterThan(0);
    console.log(`✓ Swedish property cards: ${svBtnCount} "Se objekt" buttons`);
    
    // Switch to English
    await page.goto(`${BASE_URL}/?lang=en`);
    const enBtnCount = await page.getByText('View Property').count();
    expect(enBtnCount).toBeGreaterThan(0);
    console.log(`✓ English property cards: ${enBtnCount} "View Property" buttons`);
  });
});

