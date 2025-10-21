# Fastighet (Egendom/Egnahemshus) Property Test Plan

**Spec Source**: Pages 4-5 - Detached house/estate property requirements

## Test Coverage

### Required Fields (Must Display)
- ✅ Bostadsyta (livingArea in m²)
- ✅ Total yta (totalArea in m²)
- ✅ Pris (price) - no debtPart typically for houses
- ✅ Skuldfritt pris (debtFreePrice) if applicable
- ✅ Stadsdel (region/district)
- ✅ Tomtstorlek (siteArea) - **m² or ha based on size**
- ✅ Byggnadsår (yearOfBuilding)

### Fees & Taxes
- ✅ Vattenavgift (waterFee) - €/mån
- ✅ Andra avgifter (otherFees) - €/mån
- ✅ Fastighetsskatt (propertyTax) - **€/år** (not /mån!)

### Fastighetsinformation Section
- ✅ Ägandet / Tontin omistus (siteOwnershipType)
  - Valid values: `Oma`/`Vuokra` (fi) or `Egen`/`Hyra` (sv)
  - Hide if empty
- ✅ Fastighetsbeteckning / Kiinteistötunnus (propertyId)
- ✅ Generalplan / Kaavoitustilanne (zoningSituation)
- ✅ Byggnadsrätt / Rakennusoikeus (buildingRights)
  - **Critical**: Hide row if empty per spec

### Byggfakta Section
- ✅ Byggnadsår (yearOfBuilding)
- ✅ Ventilationssystem (ventilationSystem)
- ✅ Våningsmängd (numberOfFloors)
- ✅ Byggnadsmaterial (buildingMaterial)
- ✅ Taktyp (roofType)

### Optional Fields - Hide When Empty
- ✅ Energiklass (energyClass)
- ✅ Energicertifikat (energyCertificate)

## Special Rules

### 1. Site Area Display Logic
```
IF siteArea >= 10,000 m² THEN
  Display as: (siteArea / 10000).toFixed(2) + " ha"
  Example: 15000 m² → "1.50 ha"
ELSE
  Display as: siteArea + " m²"
  Example: 8500 m² → "8500 m²"
END IF
```

### 2. Property Tax Suffix
```
propertyTax should display as: value + " €/år"
Example: 2400 → "2400 €/år"
NOT €/mån (that's for monthly fees)
```

### 3. Ownership Type Validation
```
siteOwnershipType must be one of:
- Finnish: "Oma" or "Vuokra"
- Swedish: "Egen" or "Hyra"
- English: "Owned" or "Rented"

If empty → hide entire row
```

### 4. Building Rights - Critical
```
Per spec: "hide if empty"
IF buildingRights is null/empty THEN
  DO NOT render row at all
END IF
```

## Test Files

### 1. Bash Validation Script
**File**: `fastighet-validation.sh`

Tests API data with Swedish locale:
```bash
# Usage
BASE=http://localhost:3000 SLUG=remmarholmen ./tests/fastighet-validation.sh

# What it validates:
✓ Site area units (m² vs ha conversion)
✓ Property tax is numeric (UI adds €/år)
✓ Site ownership type is valid enum
✓ Building rights presence/absence
✓ Required fields present
✓ Optional fields correctly empty/present
```

### 2. Playwright UI Tests
**File**: `fastighet-property.spec.ts`

Tests Swedish UI rendering:
```bash
# Usage
BASE=http://localhost:3000 SLUG=remmarholmen npx playwright test tests/fastighet-property.spec.ts

# What it validates:
✓ Prisuppgifter section shows price
✓ Site area in correct units (m²/ha)
✓ Property tax with €/år suffix
✓ Fastighetsinformation rows hide when empty
✓ Byggfakta shows construction details
✓ Energy class optional
✓ Swedish language labels
✓ Fee units correct (€/mån)
```

## Quick Start

```bash
# 1. Make script executable
chmod +x tests/fastighet-validation.sh

# 2. Test API (Swedish locale per spec)
cd apps/next-front
SLUG=remmarholmen ./tests/fastighet-validation.sh

# 3. Test UI (requires dev server)
npm run dev &
SLUG=remmarholmen npx playwright test tests/fastighet-property.spec.ts --headed

# 4. Test with different property
SLUG=nuikontie-140 ./tests/fastighet-validation.sh
SLUG=nuikontie-140 npx playwright test tests/fastighet-property.spec.ts
```

## Test Data Requirements

For comprehensive testing, use a Fastighet property that has:
- ✅ Site area (both <10k and >10k m² properties)
- ✅ Property tax value
- ✅ At least some Fastighetsinformation fields
- ✅ Construction details (year, floors, materials)
- ✅ Optional: energy class, building rights

**Good test slugs**:
- `remmarholmen` (island property with site area)
- `nuikontie-140` (complete house data)
- `kuro-orrholmen` (another estate)

## Expected Output

### Bash Script Output
```
╔════════════════════════════════════════════════════════════╗
║   FASTIGHET PROPERTY VALIDATION - Spec Pages 4-5           ║
╔════════════════════════════════════════════════════════════╗

Tomtstorlek (siteArea)         : 1.50 ha (15000 m²)
Fastighetsskatt (propertyTax)  : 2400 €/år

VALIDATION CHECKS
═══════════════════════════════════════════════════════════
✓ siteArea >= 10,000 m² → should display as hectares (ha)
  Expected UI: 1.50 ha
✓ propertyTax is numeric: 2400 (UI should add €/år)
✓ siteOwnershipType valid: Oma
✓ buildingRights is empty → row should NOT render in UI

✓ ALL VALIDATIONS PASSED
```

### Playwright Output
```
✓ Prisuppgifter section renders price correctly
✓ Site area displays correctly: m² or ha for large plots
✓ PropertyTax displays with €/år suffix
✓ Fastighetsinformation section shows only non-empty fields
✓ Byggfakta section shows available construction details
✓ Energy class optional - hidden when empty
✓ All required Fastighet fields are present
✓ Swedish language labels used throughout
✓ Fees display with correct units

9 passed (11.2s)
```

## Key Differences from Osake (Apartments)

| Aspect | Osake | Fastighet |
|--------|-------|-----------|
| Debt Part | Usually present | Rare/absent |
| Site Area | N/A | Required, m²/ha |
| Property Tax | N/A or yearly | Required, €/år |
| Ownership | N/A | Oma/Vuokra |
| Building Rights | N/A | Optional |
| Fees | Monthly (vederlag) | Water/other only |
| Spec Pages | 1-3 | 4-5 |

## CI/CD Integration

```yaml
# .github/workflows/test-fastighet.yml
- name: Test Fastighet Properties
  run: |
    chmod +x tests/fastighet-validation.sh
    
    # Test multiple house properties
    for slug in remmarholmen nuikontie-140 kuro-orrholmen; do
      echo "Testing $slug..."
      SLUG=$slug ./tests/fastighet-validation.sh || exit 1
    done
    
    # Run Playwright UI tests
    npx playwright test tests/fastighet-property.spec.ts
```

## Troubleshooting

### Issue: Site area showing wrong units
```
✗ Expected "ha" but seeing "15000 m²"
```
**Fix**: Check if `siteArea >= 10000` condition is implemented in UI component

### Issue: Property tax shows €/mån instead of €/år
```
✗ Expected "2400 €/år" but seeing "2400 €/mån"
```
**Fix**: Ensure propertyTax uses year suffix, not month suffix like fees

### Issue: Empty buildingRights still showing label
```
✗ Building rights row visible but value is empty
```
**Fix**: Component should conditionally render based on data presence

### Issue: Ownership type validation fails
```
⚠ siteOwnershipType unexpected value: "own"
```
**Fix**: Ensure API returns correct enum: Oma/Vuokra or Egen/Hyra

## Notes

- All tests use **Swedish locale** (`?lang=sv`) per spec pages 4-5
- Tests are **read-only** - no app code modifications
- Site area conversion is critical: 10,000 m² threshold
- Property tax must show €/år, not €/mån
- Empty field hiding is mandatory per spec
- Building rights field is specifically mentioned for hiding when empty

