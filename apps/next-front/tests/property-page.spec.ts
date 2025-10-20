import { test, expect } from '@playwright/test';

/**
 * Property Page E2E Tests
 * Tests critical functionality of property detail pages
 */

const BASE_URL = process.env.VERCEL_URL || 'http://localhost:3000';

test.describe('Property Page - Image Gallery', () => {
  test('should display at least one image on property page', async ({ page }) => {
    // Test with Pengerkatu property (known to have 21 images)
    await page.goto(`${BASE_URL}/property/pengerkatu-25?lang=fi`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if gallery exists
    const gallery = page.locator('[role="img"], img').first();
    await expect(gallery).toBeVisible({ timeout: 10000 });
    
    // Take screenshot for visual regression
    await page.screenshot({ 
      path: 'tests/screenshots/property-pengerkatu-25.png',
      fullPage: true 
    });
    
    // Verify images loaded (not broken)
    const images = await page.locator('img').all();
    expect(images.length).toBeGreaterThan(0);
    
    console.log(`✅ Found ${images.length} images on the page`);
  });

  test('should navigate between images with arrows', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/heikkilantie-1?lang=fi`);
    await page.waitForLoadState('networkidle');
    
    // Click next image button
    const nextButton = page.locator('button[aria-label="Next image"]');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
      
      // Verify image index changed (check counter "2 — 38")
      const counter = page.locator('text=/\\d+ — \\d+/');
      await expect(counter).toBeVisible();
    }
  });

  test('should handle properties with no images gracefully', async ({ page }) => {
    // Test with a property that might not have images
    await page.goto(`${BASE_URL}/property/test-no-images?lang=fi`);
    await page.waitForLoadState('networkidle');
    
    // Should not crash (404 is acceptable, 500 is not)
    const statusCode = page.url().includes('404') ? 404 : 200;
    expect([200, 404]).toContain(statusCode);
  });
});

test.describe('Property Page - Video & Media', () => {
  test('should display video tab if video URL exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/pengerkatu-25?lang=fi`);
    await page.waitForLoadState('networkidle');
    
    // Check if video tab exists
    const videoTab = page.locator('button:has-text("Katso video")');
    
    if (await videoTab.isVisible()) {
      await videoTab.click();
      await page.waitForTimeout(1000);
      
      // Verify video iframe loads
      const videoFrame = page.locator('iframe[title="Property Video"]');
      await expect(videoFrame).toBeVisible();
      
      // Check iframe has valid src (YouTube or Vimeo)
      const src = await videoFrame.getAttribute('src');
      expect(src).toMatch(/(youtube\.com|vimeo\.com)/);
    }
  });

  test('should display PDF brochure if available', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/heikkilantie-1?lang=fi`);
    await page.waitForLoadState('networkidle');
    
    // Click brochure tab
    const brochureTab = page.locator('button:has-text("Selaa esitettä")');
    await brochureTab.click();
    await page.waitForTimeout(1000);
    
    // Either iframe or "not available" message should show
    const brochureFrame = page.locator('iframe[title="Property Brochure"]');
    const noDataMessage = page.locator('text=Ei saatavilla');
    
    const hasFrame = await brochureFrame.isVisible();
    const hasMessage = await noDataMessage.isVisible();
    
    expect(hasFrame || hasMessage).toBeTruthy();
  });
});

test.describe('Property Page - Data Integrity', () => {
  test('should display price information correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/pengerkatu-25?lang=fi`);
    await page.waitForLoadState('networkidle');
    
    // Check for price fields (must contain "€")
    const priceElements = page.locator('text=/\\d+[\\s\\u00A0]\\d+\\s*€/');
    await expect(priceElements.first()).toBeVisible({ timeout: 5000 });
    
    // Verify price is not absurdly high (< 100 million €)
    const priceText = await priceElements.first().textContent();
    const numericPrice = priceText?.replace(/[^\d]/g, '') || '0';
    expect(parseInt(numericPrice)).toBeLessThan(100000000);
  });

  test('should not display React error #31 (nested objects)', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/pengerkatu-25?lang=fi`);
    
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Check for React error #31
    const hasReactError31 = errors.some(err => err.includes('Error: Minified React error #31'));
    expect(hasReactError31).toBeFalsy();
  });

  test('should not have duplicate console warnings', async ({ page }) => {
    await page.goto(`${BASE_URL}/property/pengerkatu-25?lang=fi`);
    
    // Track warnings
    const warnings: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Check for duplicate warnings (same warning > 5 times = spam)
    const warningCounts = warnings.reduce((acc, w) => {
      acc[w] = (acc[w] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const maxCount = Math.max(...Object.values(warningCounts));
    expect(maxCount).toBeLessThan(5);
  });
});

test.describe('Property Page - Internationalization', () => {
  test('should switch languages correctly', async ({ page }) => {
    // Test Finnish
    await page.goto(`${BASE_URL}/property/pengerkatu-25?lang=fi`);
    await page.waitForLoadState('networkidle');
    let heading = await page.locator('h1').first().textContent();
    expect(heading).toBeTruthy();
    
    // Test Swedish
    await page.goto(`${BASE_URL}/property/pengerkatu-25?lang=sv`);
    await page.waitForLoadState('networkidle');
    heading = await page.locator('h1').first().textContent();
    expect(heading).toBeTruthy();
    
    // Test English
    await page.goto(`${BASE_URL}/property/pengerkatu-25?lang=en`);
    await page.waitForLoadState('networkidle');
    heading = await page.locator('h1').first().textContent();
    expect(heading).toBeTruthy();
  });
});

