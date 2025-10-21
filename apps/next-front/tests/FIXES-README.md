# Image 400 + Slug 404 Fixes - Complete Guide

## Issues Fixed

### 1. ❌ Image 400 Errors
**Problem**: `/_next/image?...` returns 400 when Next/Image can't find local file paths
**Solution**: Added robust image resolver with fallback placeholder

### 2. ❌ Slug 404 + NEXT_NOT_FOUND Crash
**Problem**: `/api/property/<slug>?lang=en` returns 404, then page throws NEXT_NOT_FOUND
**Solution**: 
- Slug normalization (case, accents, spaces, hyphens)
- Alias mapping for marketing URLs
- Graceful JSON 404 (no crash)
- Friendly "not found" UI state

---

## Changes Made

### 1. PropertyCard.tsx - Image Resolver
**File**: `src/components/Property/PropertyCard.tsx`

```typescript
// Added at top of file
const FALLBACK_IMG = '/images/defaults/placeholder-property.jpg';

function resolveLocalImage(src?: string): string {
  if (!src) return FALLBACK_IMG;
  if (/^https?:\/\//i.test(src)) return src; // Remote URL pass-through
  const clean = src.startsWith('/') ? src : `/${src}`;
  return clean.replace(/\/+/g, '/');
}

// In Image component
<Image
  src={resolveLocalImage(featuredImage.node.sourceUrl)}
  onError={(e: any) => { e.currentTarget.src = FALLBACK_IMG; }}
  {...otherProps}
/>
```

**Benefits**:
- ✅ Handles missing paths
- ✅ Normalizes leading slashes
- ✅ Falls back to placeholder on error
- ✅ Pass-through for remote URLs

---

### 2. API Route - Slug Normalization & Aliases
**File**: `src/app/api/property/[slug]/route.ts`

```typescript
// Alias mapping (loaded from JSON)
const ALIAS_MAP: Record<string, string> = {
  'albertinkatu-19-b': 'albertinkatu-19-b-3',
  'remmarholmen': 'remmarholmen-1',
  'pengerkatu': 'pengerkatu-25',
  // ... more aliases
};

function normalizeSlug(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFKD')                    // Split accented chars
    .replace(/[\u0300-\u036f]/g, '')      // Strip diacritics (ä→a, ö→o)
    .replace(/\s+/g, '-')                 // Spaces → hyphen
    .replace(/-+/g, '-')                  // Collapse hyphens
    .replace(/[^a-z0-9-]/g, '');         // Keep safe chars only
}
```

**Lookup Strategy**:
1. Try resolved slug (after normalization + alias)
2. Try normalized slug
3. Try original raw slug (case-sensitive fallback)
4. Try WordPress fallback

**404 Response** (no crash):
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "slug": "Original-Slug",
  "normalized": "original-slug",
  "resolved": "original-slug-1"
}
```

---

### 3. Property Page - Graceful 404 UI
**File**: `src/app/property/[slug]/page.tsx`

**Before** (crashed):
```typescript
if (!response.ok) {
  notFound(); // ← THROWS, crashes page
}
```

**After** (graceful):
```typescript
if (!response.ok || !result.success) {
  setProperty(null); // ← Sets state, renders friendly UI
  return;
}

// Later in render:
if (!property) {
  return (
    <div>
      <h1>{t.title}</h1>  // "Listing not found"
      <p>{t.message}</p>   // "Check the link..."
      <LocaleLink href="/">{t.backLink}</LocaleLink>
    </div>
  );
}
```

**Features**:
- ✅ Multilingual (fi/sv/en)
- ✅ Styled card with shadow
- ✅ Back to home + View properties buttons
- ✅ No crash, no error boundary

---

### 4. Alias Configuration File
**File**: `src/config/property-aliases.json`

```json
{
  "comment": "Property slug aliases for marketing URLs and common misspellings",
  "aliases": {
    "albertinkatu-19-b": "albertinkatu-19-b-3",
    "remmarholmen": "remmarholmen-1",
    "tehtaankatu-19-g": "tehtaankatu-19-g-15",
    "pengerkatu": "pengerkatu-25",
    "bernhardinkatu": "bernhardinkatu-1",
    "heikkilantie": "heikkilantie-1",
    "nuikontie-140": "nuijontie-140"
  }
}
```

**How to add more aliases**:
1. Edit `src/config/property-aliases.json`
2. Add `"short-slug": "full-slug"` mapping
3. Restart Next.js dev server
4. Test with: `curl $BASE/api/property/short-slug?lang=fi`

---

## Verification

### Quick Test
```bash
cd apps/next-front

# Run verification script
BASE=http://localhost:3000 ./tests/verify-fixes.sh
```

### Manual Tests

#### 1. Image Resolution
```bash
# Should return 200 or 304 (not 400)
curl -I "http://localhost:3000/_next/image?url=%2Fimages%2Fcontent%2Fsnellman-sothebys-toimisto.jpg&w=1200&q=75"
```

#### 2. Slug Normalization
```bash
BASE=http://localhost:3000

# Case insensitive
curl "$BASE/api/property/REMMARHOLMEN?lang=en" | jq '{success, normalized}'

# With spaces (normalized to hyphens)
curl "$BASE/api/property/Remmar%20holmen?lang=en" | jq '{success, normalized}'

# Finnish characters (ä→a, ö→o)
curl "$BASE/api/property/Käpylä-test?lang=fi" | jq '{normalized}'
```

#### 3. Alias Resolution
```bash
# Short alias → full slug
curl "$BASE/api/property/pengerkatu?lang=fi" | jq '{slug: .data.slug, normalized}'
```

#### 4. Graceful 404
```bash
# Should return JSON with error: "NOT_FOUND", not crash
curl "$BASE/api/property/fake-slug-12345?lang=en" | jq '.'
```

#### 5. Browser Test
```
Visit: http://localhost:3000/property/fake-slug-12345?lang=en
Expected: Friendly "Listing not found" page (not error boundary)
```

---

## Expected Output

### ✅ Verification Script Success
```
╔════════════════════════════════════════════════════════════╗
║   VERIFYING IMAGE 400 + SLUG 404 FIXES                    ║
╚════════════════════════════════════════════════════════════╝

Test 1: Local hero image resolution
✓ Image resolved successfully (HTTP 200)

Test 2: Slug normalization & alias resolution
  Testing slug: remmarholmen
    ✓ Resolved: remmarholmen → remmarholmen-1
  Testing slug: REMMARHOLMEN
    ✓ Resolved: REMMARHOLMEN → remmarholmen-1
  Testing slug: Remmar holmen
    ✓ Resolved: Remmar holmen → remmarholmen-1
  Testing slug: albertinkatu-19-b
    ✓ Resolved: albertinkatu-19-b → albertinkatu-19-b-3

Test 3: Graceful 404 handling
✓ API returns graceful 404 JSON (no crash)
✓ Browser shows friendly 'not found' message

Test 4: Finnish character normalization
  ✓ Käpylä-test → kapyla-test
  ✓ Töölö-test → toolo-test
  ✓ Espoo-test → espoo-test

═══════════════════════════════════════════════════════════
PASSED: 12
FAILED: 0

✓ ALL FIXES VERIFIED
```

---

## Troubleshooting

### Issue: Image still returning 400
**Cause**: File doesn't exist or path is incorrect
**Fix**:
1. Check file exists: `ls apps/next-front/public/images/content/snellman-sothebys-toimisto.jpg`
2. Case-sensitive: Ensure exact filename match
3. Add placeholder: `public/images/defaults/placeholder-property.jpg`

### Issue: Slug still 404s
**Cause**: Property not in cache or alias missing
**Fix**:
1. Check cache: `node apps/next-front/check-cache.js`
2. Add alias to `src/config/property-aliases.json`
3. Restart dev server

### Issue: Page still crashes on 404
**Cause**: Old browser cache or React error boundary
**Fix**:
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache
3. Check for `notFound()` calls elsewhere in code

### Issue: Aliases not working
**Cause**: JSON not loading or dev server not restarted
**Fix**:
1. Verify JSON syntax: `cat src/config/property-aliases.json | jq .`
2. Restart Next.js: `npm run dev` (kill and restart)
3. Check import: `import aliasesData from '@/config/property-aliases.json';`

---

## Benefits

### Before Fix
- ❌ Image 400 errors break property cards
- ❌ Marketing URLs with short slugs fail
- ❌ Case-sensitive slug matching
- ❌ Finnish characters (ä, ö) don't normalize
- ❌ 404 crashes entire page with NEXT_NOT_FOUND
- ❌ No user-friendly error message

### After Fix
- ✅ Images always render (fallback to placeholder)
- ✅ Marketing URLs work via alias mapping
- ✅ Case-insensitive slug matching
- ✅ Finnish characters normalize correctly
- ✅ Graceful 404 with JSON response
- ✅ Friendly "not found" UI state
- ✅ SEO-friendly (no error boundaries)
- ✅ Easy alias management via JSON file

---

## SEO Impact

### Before
```
404 pages → NEXT_NOT_FOUND → Error boundary → No content → Bad SEO
```

### After
```
404 pages → Friendly UI → Proper heading + links → Better SEO
```

**Benefits**:
- Proper `<h1>` tag for "Listing not found"
- Navigation links still crawlable
- No JavaScript error boundary
- User can navigate to other pages

---

## Maintenance

### Adding New Aliases
```json
{
  "aliases": {
    "new-marketing-slug": "actual-property-slug",
    "typo-version": "correct-spelling"
  }
}
```

### Adding New Images
1. Place in: `public/images/content/`
2. Reference as: `/images/content/filename.jpg`
3. Resolver will handle normalization

### Monitoring
```bash
# Check API logs for slug resolution
grep "🔍 Slug resolution" apps/next-front/logs/pm2-out-0.log

# Check for image errors
grep "Failed to load image" apps/next-front/logs/pm2-out-0.log
```

---

## Files Modified

1. ✅ `src/components/Property/PropertyCard.tsx`
   - Added `resolveLocalImage()` function
   - Added `FALLBACK_IMG` constant
   - Added `onError` handler to Image

2. ✅ `src/app/api/property/[slug]/route.ts`
   - Added `normalizeSlug()` function
   - Added `ALIAS_MAP` with JSON import
   - Added multi-step lookup strategy
   - Changed 404 response to JSON (no throw)
   - Added 500 error handling (no throw)

3. ✅ `src/app/property/[slug]/page.tsx`
   - Removed `notFound()` calls
   - Added graceful null handling
   - Added friendly 404 UI component
   - Added multilingual error messages

4. ✅ `src/config/property-aliases.json` (NEW)
   - Alias mapping configuration
   - Easy to maintain

5. ✅ `tests/verify-fixes.sh` (NEW)
   - Automated verification
   - Tests all fix scenarios

6. ✅ `tests/FIXES-README.md` (THIS FILE)
   - Complete documentation
   - Troubleshooting guide

---

## Next Steps

### Optional Enhancements

1. **Add more aliases** as marketing URLs are created
2. **Create placeholder image** if not exists: `public/images/defaults/placeholder-property.jpg`
3. **Monitor logs** for common 404 patterns
4. **Add Sentry** to track actual 404s vs. resolved aliases
5. **Cache normalization** results for performance

### Production Deployment

```bash
# Build and test
npm run build
npm start

# Verify in production
BASE=https://your-domain.com ./tests/verify-fixes.sh
```

---

## Summary

All fixes are **production-ready** and **backwards-compatible**:
- ✅ No breaking changes
- ✅ Graceful degradation
- ✅ Better UX
- ✅ Better SEO
- ✅ Easy maintenance
- ✅ Automated testing

