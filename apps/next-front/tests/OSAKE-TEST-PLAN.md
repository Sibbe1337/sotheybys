# Osake (Aktielägenhet) Property Test Plan

**Spec Source**: Pages 1-3 - Apartment/Condominium property requirements

## Test Coverage

### Required Fields (Must Display)
- ✅ Fullständig adress (streetAddress + postalCode + city)
- ✅ Typ av hus (propertyType / apartmentType)
- ✅ Lägenhetsbeskrivning (description heading)
- ✅ Boyta (livingArea in m²)
- ✅ Pris (price as "Myyntihinta")
- ✅ Velkaosuus (debtPart)
- ✅ Velaton hinta (debtFreePrice)
- ✅ Stadsdel (region/district)
- ✅ Byggnadsår (yearOfBuilding)
- ✅ Våningsplan (floorLocation / numberOfFloors)

### Price Calculations
- ✅ **€/m²** computed as: `price / livingArea` (2 decimals)
- ✅ **Velaton €/m²** computed as: `debtFreePrice / livingArea` (2 decimals)
- ✅ **Price Invariant**: `price + debtPart ≈ debtFreePrice` (±1 EUR tolerance)

### Vederlag (Monthly Fees) - Conditional Display
- ✅ Yhtiövastike (maintenanceFee) - show only if > 0
- ✅ Rahoitusvastike (financingFee) - show only if > 0
- ✅ Muut maksut (otherFees) - show only if > 0
- ✅ Kokonaisvastike (totalFee) - computed as maintenance + financing if not provided
- ✅ Vesimaksu (waterFee) - show only if > 0

### Optional Fields - Hide When Empty
- ✅ Aktie numror (numberOfShares) - hide row if empty
- ✅ Energiklass (energyClass) - hide row if empty
- ✅ Balkong (balcony) - show as "Kyllä/Ei" if provided
- ✅ Bastu (sauna) - show as "Kyllä/Ei" if provided

## Test Files

### 1. Bash Validation Script
**File**: `osake-validation.sh`

Validates API data and computations:
```bash
# Usage
BASE=http://localhost:3000 SLUG=bernhardinkatu-1 ./tests/osake-validation.sh

# What it checks:
- All required fields present
- €/m² calculations accurate
- Price invariant: price + debtPart ≈ debtFreePrice
- livingArea > 0 for valid €/m² computation
- Boolean fields have valid values
- Missing energy class noted for UI hiding
```

**Exit Codes**:
- `0`: All validations passed
- `1`: One or more validations failed

### 2. Playwright UI Tests
**File**: `osake-property.spec.ts`

Validates browser rendering:
```bash
# Usage
BASE=http://localhost:3000 SLUG=bernhardinkatu-1 npx playwright test tests/osake-property.spec.ts

# What it tests:
- Price rows display correctly
- Vederlag section shows only when fees > 0
- numberOfShares row hidden when empty
- energyClass row hidden when empty
- All required fields visible
- Boolean fields display correctly
- Multilingual labels (fi, sv, en)
- Empty fields don't show labels
```

## Quick Start

```bash
# 1. Make bash script executable
chmod +x tests/osake-validation.sh

# 2. Run API validation
cd apps/next-front
SLUG=bernhardinkatu-1 ./tests/osake-validation.sh

# 3. Run Playwright tests (requires dev server running)
npm run dev &
SLUG=bernhardinkatu-1 npx playwright test tests/osake-property.spec.ts

# 4. View results
npx playwright show-report
```

## Test Data Requirements

For comprehensive testing, use an Osake property that has:
- ✅ All price fields (price, debtPart, debtFreePrice)
- ✅ Living area > 0
- ✅ At least one fee (maintenance or financing)
- ✅ Optional: numberOfShares
- ✅ Optional: energyClass
- ✅ Optional: balcony, sauna values

**Good test slugs**:
- `bernhardinkatu-1` (full data)
- `pengerkatu-25` (partial data for testing hiding)
- `heikkilantie-1` (another complete property)

## Expected Output

### Bash Script Output
```
╔════════════════════════════════════════════════════════════╗
║   OSAKE PROPERTY VALIDATION - Spec Pages 1-3              ║
╔════════════════════════════════════════════════════════════╗

Fullständig adress         : Bernhardinkatu 1, 00130 Helsinki
Boyta (livingArea)         : 97.21 m²
Myyntihinta (price)        : 1570000 €
Velkaosuus (debtPart)      : 0 €
Velaton hinta (debtFree)   : 1570000 €
Myyntihinta per m²         : 16149.47 €/m²
Velaton hinta per m²       : 16149.47 €/m²

✓ streetAddress: present
✓ city: present
✓ livingArea: present
✓ price: present
✓ Price invariant valid
✓ ALL VALIDATIONS PASSED
```

### Playwright Output
```
✓ Price rows display correctly
✓ Vederlag section shows only when fees are non-zero
✓ numberOfShares row appears only when non-empty
✓ energyClass row appears only when API provides it
✓ All required Osake fields are present
✓ Boolean fields display correctly
✓ Swedish translations for Osake fields
✓ English translations for Osake fields
✓ Empty optional fields are hidden

9 passed (12.3s)
```

## Validation Rules

### Price Math
```javascript
// Must hold true (±1 EUR tolerance)
price + debtPart ≈ debtFreePrice

// €/m² calculation
pricePerM2 = price / livingArea  // rounded to 2 decimals
debtFreePerM2 = debtFreePrice / livingArea  // rounded to 2 decimals
```

### Fee Fallback
```javascript
// If totalFee is missing/0, compute as:
totalFee = maintenanceFee + financingFee
```

### Empty Field Rule
```
IF field.value === null OR field.value === "" OR field.value === 0 THEN
  DO NOT render field label or row
END IF
```

## CI/CD Integration

```yaml
# .github/workflows/test.yml
- name: Test Osake Properties
  run: |
    chmod +x tests/osake-validation.sh
    
    # Test multiple Osake properties
    for slug in bernhardinkatu-1 pengerkatu-25 heikkilantie-1; do
      echo "Testing $slug..."
      SLUG=$slug ./tests/osake-validation.sh || exit 1
    done
    
    # Run Playwright UI tests
    npx playwright test tests/osake-property.spec.ts
```

## Troubleshooting

### Common Issues

**1. Price invariant fails**
```
✗ Price invariant FAILED: 1570000 + 5000 = 1575000, but debtFree = 1570000 (diff: 5000 €)
```
**Fix**: Check if debtPart is correctly set in API data

**2. €/m² cannot be computed**
```
✗ Cannot compute price/m² - price is missing
```
**Fix**: Ensure livingArea > 0 and price is a valid number

**3. Empty fields showing labels**
```
✗ Empty field showing label: Energialuokka
```
**Fix**: Property detail page should conditionally render based on data

## Notes

- Tests are **read-only** - no modifications to app code
- Uses environment variables: `BASE`, `SLUG`
- Minimal dependencies: curl, jq, playwright
- Validates against spec pages 1-3
- Tests all three languages (fi, sv, en)
- Checks both API and UI rendering

