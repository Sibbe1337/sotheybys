# Property Page Tests - Multilingual Validation

Tests for validating multilingual property pages against spec requirements:
- **Spec**: "Fält som ska visas på hemsidan – Gemensamt för alla objekt"
- **Rule**: "Om något fält är tomt → visa inte det på hemsidan"

## Test Suite

### 1. API Validation (Bash + curl + jq)
**File**: `api-validation.sh`

Tests API endpoints directly:
- ✓ `streetAddress` is non-empty
- ✓ `city` is non-empty  
- ✓ `description` may be empty (UI test validates hiding)
- ✓ `price`, `debtPart`, `debtFreePrice` are numeric when present
- ✓ All tests run for fi, sv, en

**Usage**:
```bash
# Test localhost
BASE=http://localhost:3000 ./tests/api-validation.sh

# Test production
BASE=https://your-site.vercel.app TEST_SLUG=pengerkatu-25 ./tests/api-validation.sh

# Make executable first
chmod +x tests/api-validation.sh
```

### 2. UI Validation (Playwright)
**File**: `property-multilingual.spec.ts`

Tests browser rendering:
- ✓ Address line matches API data
- ✓ Contact CTA visible with correct translation
- ✓ Empty description section is hidden
- ✓ Empty fields don't render visible rows
- ✓ Translations work across fi/sv/en

**Usage**:
```bash
# Run all tests
BASE=http://localhost:3000 npx playwright test tests/property-multilingual.spec.ts

# Run specific test
npx playwright test -g "Finnish"

# Debug mode
npx playwright test --debug tests/property-multilingual.spec.ts

# With custom slug
TEST_SLUG=bernhardinkatu-1 npx playwright test tests/property-multilingual.spec.ts
```

## Requirements

### For Bash Script:
- `curl` (usually pre-installed)
- `jq` (install: `brew install jq` on macOS)

### For Playwright:
```bash
npm install -D @playwright/test
npx playwright install
```

## Expected Results

### ✅ Pass Criteria:
1. All required fields (address, city) are non-empty
2. Empty description → no "Kuvaus/Beskrivning/Description" section
3. Price fields are numeric when present
4. Contact CTA visible in all languages
5. Empty optional fields (company name, etc.) don't show labels

### ❌ Fail Criteria:
- Missing required fields (address, city)
- Empty fields showing labels/sections
- Non-numeric price values
- Missing contact CTA
- Translation mismatch

## Quick Test Run

```bash
# 1. Start dev server
cd apps/next-front
npm run dev

# 2. In another terminal, run bash tests
./tests/api-validation.sh

# 3. Run Playwright tests
npx playwright test tests/property-multilingual.spec.ts --headed

# 4. View report
npx playwright show-report
```

## CI/CD Integration

Add to your GitHub Actions or CI pipeline:

```yaml
- name: Run API validation
  run: |
    chmod +x tests/api-validation.sh
    BASE=${{ secrets.STAGING_URL }} ./tests/api-validation.sh

- name: Run Playwright tests
  run: |
    npx playwright install --with-deps
    BASE=${{ secrets.STAGING_URL }} npx playwright test tests/property-multilingual.spec.ts
```

## Test Coverage

| Requirement | Bash Script | Playwright | Status |
|-------------|-------------|------------|--------|
| streetAddress non-empty | ✓ | ✓ | ✅ |
| city non-empty | ✓ | ✓ | ✅ |
| Empty field hiding | - | ✓ | ✅ |
| Price numeric | ✓ | - | ✅ |
| Contact CTA visible | - | ✓ | ✅ |
| Multilingual labels | - | ✓ | ✅ |
| Homepage cards translate | - | ✓ | ✅ |

## Notes

- Tests are **read-only** - no app code modifications
- Uses environment variables for flexibility
- Minimal dependencies (curl, jq, playwright)
- Works with any property slug via `TEST_SLUG` env var
- Output includes color-coded results and debugging info

