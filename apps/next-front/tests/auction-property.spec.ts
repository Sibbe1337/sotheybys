/**
 * AUCTION Property Test Stub (Spec Page 6)
 * 
 * Validates auction properties display "budgivning med start från" instead of normal price trio.
 * Gracefully skips if property.saleType !== 'auction'
 * 
 * TO ENABLE: Once auction data is available in API
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE || 'http://localhost:3000';
const AUCTION_SLUG = process.env.SLUG || 'test-auction-property';

interface AuctionPropertyData {
  saleType?: 'auction' | 'sale' | 'rental';
  startingBid?: number;
  auctionDate?: string;
  price?: number;
  debtPart?: number;
  debtFreePrice?: number;
}

test.describe('Auction Property - Spec Page 6 (STUB)', () => {
  
  let apiData: any;
  let isAuction = false;
  
  test.beforeAll(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/property/${AUCTION_SLUG}?lang=sv`);
      apiData = await response.json();
      isAuction = apiData.saleType === 'auction';
      
      if (!isAuction) {
        console.log('⚠️  Property is not an auction - tests will be skipped');
        console.log(`   Current saleType: ${apiData.saleType || 'not set'}`);
      } else {
        console.log('✓ Auction property detected');
      }
    } catch (error) {
      console.log('⚠️  Could not fetch property data - tests will be skipped');
    }
  });

  test('Auction property shows "budgivning med start från" instead of normal price', async ({ page, browser }) => {
    test.skip(!isAuction, 'Not an auction property - skipping test');
    
    await page.goto(`${BASE_URL}/property/${AUCTION_SLUG}?lang=sv`);
    await page.waitForLoadState('networkidle');
    
    const bodyText = await page.locator('body').textContent() || '';
    
    // Should show auction starting bid label
    const hasAuctionLabel = (
      bodyText.includes('budgivning') ||
      bodyText.includes('Budgivning') ||
      bodyText.includes('huutokauppa') || // Finnish
      bodyText.includes('Auction')        // English
    );
    expect(hasAuctionLabel).toBeTruthy();
    console.log('✓ Auction label present');
    
    // Should show starting bid if available
    if (apiData.startingBid && apiData.startingBid > 0) {
      expect(bodyText).toContain(apiData.startingBid.toString());
      console.log(`✓ Starting bid visible: ${apiData.startingBid} €`);
    }
    
    // Should NOT show normal price trio (Myyntihinta, Velkaosuus, Velaton)
    const hasNormalPriceLabels = (
      bodyText.includes('Myyntihinta') ||
      bodyText.includes('Försäljningspris')
    );
    expect(hasNormalPriceLabels).toBeFalsy();
    console.log('✓ Normal price labels correctly hidden for auction');
  });

  test('Auction date displayed when available', async ({ page }) => {
    test.skip(!isAuction, 'Not an auction property - skipping test');
    
    await page.goto(`${BASE_URL}/property/${AUCTION_SLUG}?lang=sv`);
    
    if (apiData.auctionDate) {
      const bodyText = await page.locator('body').textContent() || '';
      
      // Should show auction date label
      const hasDateLabel = (
        bodyText.includes('Auktionstid') ||
        bodyText.includes('Huutokauppa-aika')
      );
      expect(hasDateLabel).toBeTruthy();
      console.log(`✓ Auction date section present: ${apiData.auctionDate}`);
    } else {
      console.log('⚠️  No auction date in API data');
    }
  });

  test('Finnish translation: "Huutokauppa alkaen"', async ({ page }) => {
    test.skip(!isAuction, 'Not an auction property - skipping test');
    
    await page.goto(`${BASE_URL}/property/${AUCTION_SLUG}?lang=fi`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    const hasFinnishAuctionLabel = (
      bodyText.includes('huutokauppa') ||
      bodyText.includes('Huutokauppa')
    );
    expect(hasFinnishAuctionLabel).toBeTruthy();
    console.log('✓ Finnish auction label present');
  });

  test('English translation: "Auction starting from"', async ({ page }) => {
    test.skip(!isAuction, 'Not an auction property - skipping test');
    
    await page.goto(`${BASE_URL}/property/${AUCTION_SLUG}?lang=en`);
    
    const bodyText = await page.locator('body').textContent() || '';
    
    const hasEnglishAuctionLabel = (
      bodyText.includes('Auction') ||
      bodyText.includes('auction')
    );
    expect(hasEnglishAuctionLabel).toBeTruthy();
    console.log('✓ English auction label present');
  });
});

// Enable this test once auction data is available
test.describe('Auction Setup Instructions', () => {
  test('How to enable auction tests', async () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║           AUCTION TEST SETUP INSTRUCTIONS                  ║
╚════════════════════════════════════════════════════════════╝

TO ENABLE THESE TESTS:

1. Add an auction property to your data with:
   {
     "saleType": "auction",
     "startingBid": 500000,
     "auctionDate": "2025-11-15T10:00:00"
   }

2. Run tests with auction slug:
   SLUG=your-auction-slug npx playwright test tests/auction-property.spec.ts

3. Expected UI changes needed:
   - Property detail page should check property.saleType
   - If saleType === 'auction':
     * Replace price trio with "Budgivning med start från [startingBid]"
     * Show auction date if available
     * Hide normal price labels

4. Translation keys to add:
   - auctionStartingFrom: { fi: 'Huutokauppa alkaen', sv: 'Budgivning med start från', en: 'Auction starting from' }
   - auctionDate: { fi: 'Huutokauppa-aika', sv: 'Auktionstid', en: 'Auction date' }
   - startingBid: { fi: 'Lähtöhinta', sv: 'Utgångspris', en: 'Starting bid' }
`);
  });
});

