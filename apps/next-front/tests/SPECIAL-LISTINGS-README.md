# Special Listing Types Test Stubs

Test stubs for AUCTION and RENTAL property types that gracefully skip when data is not available.

## Test Files

### 1. Auction Properties (Spec Page 6)
**Files**: 
- `auction-property.spec.ts` (Playwright UI test)

**What it validates**:
- ✅ Shows "budgivning med start från" instead of normal price trio
- ✅ Displays starting bid when available
- ✅ Shows auction date when provided
- ✅ Hides normal price labels (Myyntihinta, Velkaosuus, etc.)
- ✅ Multilingual: Huutokauppa (fi), Budgivning (sv), Auction (en)
- ✅ **Gracefully skips if `saleType !== 'auction'`**

**Usage**:
```bash
# Will skip if not an auction property
SLUG=test-auction-property npx playwright test tests/auction-property.spec.ts

# Once auction data is available:
SLUG=actual-auction-slug npx playwright test tests/auction-property.spec.ts --headed
```

**Expected API Structure**:
```json
{
  "saleType": "auction",
  "startingBid": 500000,
  "auctionDate": "2025-11-15T10:00:00"
}
```

**UI Changes Needed** (when enabled):
```typescript
// In property detail page component
if (property.saleType === 'auction') {
  return (
    <div>
      <h3>{t('auctionStartingFrom')}</h3>
      <Price>{property.startingBid}</Price>
      {property.auctionDate && (
        <p>{t('auctionDate')}: {formatDate(property.auctionDate)}</p>
      )}
    </div>
  );
} else {
  // Normal price trio
  return <PriceSection ... />
}
```

---

### 2. Rental Properties
**Files**: 
- `rental-validation.sh` (Bash API validator)

**What it validates**:
- ✅ All required rental fields present
- ✅ Address & city
- ✅ Property type (apartment/house/row house)
- ✅ Living area
- ✅ Room count
- ✅ Monthly rent (numeric)
- ✅ Included in rent (array)
- ✅ Extra costs (array)
- ✅ Availability date
- ✅ Contract type (fixed-term/indefinite)
- ✅ Landlord contact (name + phone/email)
- ✅ **Gracefully skips if `listingType !== 'rental'`**

**Usage**:
```bash
# Make executable
chmod +x tests/rental-validation.sh

# Will skip if not a rental
SLUG=test-rental ./tests/rental-validation.sh

# Once rental data is available:
SLUG=actual-rental-slug ./tests/rental-validation.sh
```

**Expected API Structure**:
```json
{
  "listingType": "rental",
  "streetAddress": "Mannerheimintie 1",
  "city": "Helsinki",
  "propertyType": "apartment",
  "livingArea": 65,
  "rooms": 3,
  "monthlyRent": 1200,
  "includedInRent": ["water", "heating", "internet"],
  "extraCosts": [
    {"type": "electricity", "amount": 50},
    {"type": "parking", "amount": 80}
  ],
  "availabilityDate": "2025-12-01",
  "contractType": "fixed-term",
  "landlordContact": {
    "name": "Kiinteistö Oy Example",
    "phone": "+358 40 123 4567",
    "email": "info@example.fi"
  }
}
```

**jq Validation Logic**:
```bash
# The script uses jq to check:
echo "$RESPONSE" | jq -r '.listingType // ""'
# If == "rental", validates all fields
# Otherwise, skips with friendly message
```

---

### 3. PropertyCard Component Tests
**Files**: 
- `PropertyCard.test.tsx` (Jest + React Testing Library)

**What it validates**:
- ✅ Uses `<LocaleLink>` for language preservation
- ✅ Price formatted in fi-FI locale, no cents
- ✅ Title displayed (HTML tags stripped)
- ✅ Address format: "Street, PostalCode City"
- ✅ Shows PropertyTypeChip when available
- ✅ MetaRow with bedrooms, bathrooms, area (appends " m²" if missing)
- ✅ Agent chip with photo, name, phone
- ✅ Hides all empty values (no placeholder "0")
- ✅ Multilingual (fi/sv/en)

**Usage**:
```bash
# Run tests
npm test PropertyCard.test.tsx

# Watch mode
npm test PropertyCard.test.tsx -- --watch

# Coverage
npm test PropertyCard.test.tsx -- --coverage
```

**Test Coverage**:
```
✓ Complete data rendering (7 tests)
✓ Missing data handling (8 tests)
✓ Internationalization (3 tests)
✓ Price formatting (2 tests)

20 tests total
```

---

## Setup Instructions

### Prerequisites
```bash
# Install dependencies
npm install

# For Playwright tests
npm install -D @playwright/test
npx playwright install

# For Jest tests
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Running All Special Listing Tests
```bash
# 1. Auction test (skips if not auction)
npx playwright test tests/auction-property.spec.ts

# 2. Rental validation (skips if not rental)
./tests/rental-validation.sh

# 3. PropertyCard unit tests (always runs)
npm test PropertyCard.test.tsx
```

---

## Translation Keys to Add

### Auction (when enabled)
```typescript
// Add to homepage-translations.ts
export const HOMEPAGE_TRANSLATIONS = {
  // ... existing keys ...
  
  // Auction keys
  auctionStartingFrom: {
    fi: 'Huutokauppa alkaen',
    sv: 'Budgivning med start från',
    en: 'Auction starting from'
  },
  startingBid: {
    fi: 'Lähtöhinta',
    sv: 'Utgångspris',
    en: 'Starting bid'
  },
  auctionDate: {
    fi: 'Huutokauppa-aika',
    sv: 'Auktionstid',
    en: 'Auction date'
  }
};
```

### Rental (when enabled)
```typescript
// Add to homepage-translations.ts or create rental-translations.ts
export const RENTAL_TRANSLATIONS = {
  monthlyRent: {
    fi: 'Vuokra',
    sv: 'Månadshyra',
    en: 'Monthly rent'
  },
  includedInRent: {
    fi: 'Vuokraan sisältyy',
    sv: 'Ingår i hyran',
    en: 'Included in rent'
  },
  availableFrom: {
    fi: 'Vapautuu',
    sv: 'Tillgänglig från',
    en: 'Available from'
  },
  contractType: {
    fi: 'Sopimus',
    sv: 'Kontraktstyp',
    en: 'Contract type'
  },
  fixedTerm: {
    fi: 'Määräaikainen',
    sv: 'Tidsbegränsad',
    en: 'Fixed-term'
  },
  indefinite: {
    fi: 'Toistaiseksi',
    sv: 'Tillsvidare',
    en: 'Indefinite'
  },
  landlord: {
    fi: 'Vuokranantaja',
    sv: 'Hyresvärd',
    en: 'Landlord'
  }
};
```

---

## CI/CD Integration

```yaml
# .github/workflows/test-special-listings.yml
name: Test Special Listings

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run PropertyCard tests
        run: npm test PropertyCard.test.tsx
      
      - name: Test Auction (will skip if no data)
        run: npx playwright test tests/auction-property.spec.ts
      
      - name: Test Rental (will skip if no data)
        run: |
          chmod +x tests/rental-validation.sh
          ./tests/rental-validation.sh || echo "Rental test skipped"
```

---

## When to Enable

### Auction Tests
Enable when:
1. ✅ API returns `saleType: "auction"` for at least one property
2. ✅ `startingBid` field is populated
3. ✅ UI component checks `property.saleType` and conditionally renders

### Rental Tests
Enable when:
1. ✅ API returns `listingType: "rental"` for at least one property
2. ✅ All required rental fields are in API response
3. ✅ Rental detail page component is created

---

## Expected Output

### Auction Test (when skipped)
```
⚠️  Property is not an auction - tests will be skipped
   Current saleType: sale

4 tests skipped
```

### Auction Test (when enabled)
```
✓ Auction property shows "budgivning med start från"
✓ Auction date displayed when available
✓ Finnish translation: "Huutokauppa alkaen"
✓ English translation: "Auction starting from"

4 passed (8.2s)
```

### Rental Test (when skipped)
```
╔════════════════════════════════════════════════════════════╗
║   NOT A RENTAL PROPERTY - TESTS SKIPPED                    ║
╚════════════════════════════════════════════════════════════╝

Current listing type: sale

TO ENABLE RENTAL TESTS:
1. Add a rental property with listingType: 'rental'
2. Run: SLUG=your-rental-slug ./tests/rental-validation.sh
```

### Rental Test (when enabled)
```
✓ Rental property detected

VALIDATION CHECKS
═══════════════════════════════════════════════════════════
✓ streetAddress: present
✓ city: present
✓ monthlyRent: present
✓ landlordContact.name: present
✓ includedInRent[]: water, heating, internet

✓ ALL RENTAL VALIDATIONS PASSED
```

### PropertyCard Test (always runs)
```
 PASS  tests/PropertyCard.test.tsx
  PropertyCard Component Contract
    Complete Data Rendering
      ✓ renders all elements when complete data is provided (42ms)
      ✓ appends " m²" to area when missing (12ms)
      ✓ does not append " m²" if already present (11ms)
    Missing Data Handling
      ✓ renders city without postal code when postal code is missing (15ms)
      ✓ does not render excerpt when empty (8ms)
      ✓ strips HTML tags from excerpt (10ms)
      ✓ does not render price when undefined (9ms)
      ✓ does not render PropertyTypeChip when propertyType is missing (7ms)
      ✓ hides empty meta values (9ms)
      ✓ does not render agent section when agent is missing (8ms)
      ✓ does not render agent phone when missing (11ms)
    Internationalization
      ✓ uses Swedish translations when language is "sv" (13ms)
      ✓ uses English translations when language is "en" (12ms)
      ✓ defaults to Finnish when language is not specified (10ms)
    Price Formatting
      ✓ formats price in fi-FI locale without cents (14ms)
      ✓ formats price without decimal places (13ms)

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
```

---

## Notes

- All tests are **read-only** - no app code modifications required
- Tests gracefully skip when data is not available
- PropertyCard tests always run (no data dependency)
- Use environment variables for flexibility: `BASE`, `SLUG`
- Tests follow the same pattern as osake/fastighet tests
- Ready for CI/CD integration

