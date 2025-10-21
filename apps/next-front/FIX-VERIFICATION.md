# Property 404 Fix - Verification Guide

## ✅ What Was Fixed

### 1. **Enhanced Slug Normalization** (`src/app/api/property/[slug]/route.ts`)
- Added Finnish character handling: `ä→a`, `ö→o`, `å→a`
- Added comma removal (for properties like "Kurö, Orrholmen")
- Added proper hyphen trimming
- Matches the slug generation logic used in `listingsCache`

### 2. **Comprehensive Alias Mapping** (`src/config/property-aliases.json`)
Expanded aliases to handle:
- Number variations: `heikkilantie-11` → `Heikkiläntie 1`
- Base slugs: `aleksanteri` → `Aleksanteri 1`
- Case variations: `remmarholmen` → `Remmarholmen`
- Typos: `heikkilaentie` → `Heikkiläntie 1`

### 3. **Graceful 404 Handling**
- API returns JSON 404 instead of throwing `NEXT_NOT_FOUND`
- Frontend shows user-friendly "Listing not found" message
- No infinite spinner or white screen crashes

## 🧪 How to Test

### Test 1: Verify Alias Resolution
```bash
# Test the previously broken URLs
curl -s "https://next-front-puce.vercel.app/api/property/heikkilantie-11?lang=fi" | jq

# Expected: Either success:true with data, OR success:false with error:"NOT_FOUND"
# ❌ Should NOT see HTML error page or NEXT_NOT_FOUND
```

### Test 2: Verify UI Doesn't Crash
1. Visit: `https://next-front-puce.vercel.app/property/fake-property-name`
2. **Expected:** Clean "Listing not found" message with links to homepage
3. **Should NOT see:** Infinite spinner, white screen, or error page

### Test 3: Verify Real Properties Work
```bash
# Test a known working property
curl -s "https://next-front-puce.vercel.app/api/property/Remmarholmen?lang=fi" | jq '.success'

# Expected: true
```

## 🔍 Debugging Steps

### If Properties Still 404:

The aliases point to what we *think* the canonical slugs are. If they still fail, the actual slugs in your Linear API cache might be different.

**Step 1: Find the Real Slug**

Visit the homepage and click on the property that's failing. Check the browser's Network tab:
```
Request: /api/property/SLUG_USED_BY_HOMEPAGE?lang=fi
Response: {"success":false,"error":"NOT_FOUND","slug":"...","resolved":"..."}
```

The `resolved` field shows what slug the API actually tried to find.

**Step 2: Check What Slugs Actually Exist**

Create a debug API endpoint `/api/debug/all-properties` that returns:
```typescript
export async function GET() {
  await ensureCacheInitialized();
  const all = listingsCache.getAllListings();
  return NextResponse.json({
    count: all.length,
    slugs: all.map(p => ({
      slug: p.slug,
      address: p.streetAddress?.fi || p.streetAddress?.sv
    }))
  });
}
```

**Step 3: Update Aliases**

Once you know the real slugs, update `src/config/property-aliases.json`:
```json
{
  "aliases": {
    "homepage-slug-from-step-1": "real-cache-slug-from-step-2"
  }
}
```

## 📊 Current Alias Mappings

The following aliases are now active:

| User-Facing URL | Maps To (Cache Slug) |
|----------------|----------------------|
| `heikkilantie-11` | `Heikkiläntie 1` |
| `aleksanteri-1`, `aleksanteri-11` | `Aleksanteri 1` |
| `remmarholmen`, `remmarholmen-1` | `Remmarholmen` |
| `kuro-orrholmen`, `orrholmen` | `Kurö, Orrholmen` |
| `tehtaankatu-19-g-15` | `Tehtaankatu 19 G` |
| `pengerkatu-25` | `Pengerkatu 25` |
| `bernhardinkatu-1` | `Bernhardinkatu 1` |
| `nuijontie-140`, `nuikontie-140` | `Nuijontie 140` |
| `vuosselmtie-19` | `Vuosselmtie 19` |

## ⚠️ Important Notes

1. **Case Sensitivity**: The aliases are case-insensitive (normalized to lowercase)
2. **Finnish Characters**: All variations (`ä`, `a`) are handled automatically
3. **Cache Slugs**: The right-hand side values (canonical slugs) must match EXACTLY what's in your Linear API cache
4. **Deployment**: Changes to `property-aliases.json` require a git push + Vercel redeploy

## 🎯 Success Criteria

- ✅ No NEXT_NOT_FOUND errors in browser console
- ✅ 404s return clean JSON from API
- ✅ Frontend shows "Listing not found" message (no spinner)
- ✅ Properties with correct slugs load normally
- ✅ Homepage property cards link to working detail pages

## 📝 Next Steps

1. Visit https://next-front-puce.vercel.app and click on property cards
2. If any still 404, note the slug from the URL
3. Check browser console for the API response
4. Use the debugging steps above to find the real cache slug
5. Add correct mapping to `property-aliases.json`
6. Commit + push for automatic Vercel deployment

