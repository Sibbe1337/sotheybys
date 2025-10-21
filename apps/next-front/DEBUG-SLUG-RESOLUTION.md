# Debug: 404 Slug Resolution Issue

## Problem
`remmarholmen` returns 404 despite alias configuration pointing to `remmarholmen-1`

## Debugging Steps

### 1. Check if Property Exists in Cache
```bash
cd apps/next-front
node check-cache.js | grep -i remmar
```

**What to look for:**
- Does `remmarholmen-1` exist?
- What's the exact slug spelling?
- Is it `remmarholmen`, `Remmarholmen-1`, or something else?

### 2. Check API Response
```bash
# Check if server is running
curl -I http://localhost:3000/api/property/remmarholmen

# Get full response
curl http://localhost:3000/api/property/remmarholmen?lang=fi | jq '.'
```

**Expected response if working:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Expected response if not found:**
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "slug": "remmarholmen",
  "normalized": "remmarholmen",
  "resolved": "remmarholmen-1"
}
```

### 3. Check Browser Console
Open browser console and check what the API is returning:
```javascript
fetch('/api/property/remmarholmen?lang=fi')
  .then(r => r.json())
  .then(console.log)
```

### 4. Common Issues

#### Issue A: Property Not in Cache
**Symptoms:** `check-cache.js` doesn't show the property
**Solution:** 
```bash
# Refresh the cache
cd apps/next-front
rm -rf .cache
npm run dev  # Will rebuild cache on startup
```

#### Issue B: Alias Not Loading
**Symptoms:** API logs show original slug, not resolved slug
**Solution:**
1. Check `src/config/property-aliases.json` exists
2. Restart dev server (aliases loaded at startup)
3. Check console logs for "🔍 Slug resolution"

#### Issue C: Case Sensitivity
**Symptoms:** Exact slug works but variations don't
**Solution:** Normalization should handle this, but verify:
```bash
# All these should work:
curl http://localhost:3000/api/property/remmarholmen
curl http://localhost:3000/api/property/Remmarholmen
curl http://localhost:3000/api/property/REMMARHOLMEN
```

#### Issue D: Wrong Property Slug in Data
**Symptoms:** Alias points to wrong slug
**Solution:** Find the actual slug:
```bash
node check-cache.js | grep -i remmar
# Update alias in src/config/property-aliases.json
```

### 5. Quick Fix Checklist

- [ ] Dev server is running (`npm run dev`)
- [ ] `src/config/property-aliases.json` exists and is valid JSON
- [ ] Property exists in cache (run `node check-cache.js`)
- [ ] Alias points to correct slug
- [ ] Restarted dev server after changing aliases
- [ ] Browser console shows the actual error from API

### 6. Manual Test Commands

```bash
cd apps/next-front

# 1. Check all properties in cache
node check-cache.js > cache-dump.txt
cat cache-dump.txt | grep -i remmar

# 2. Test API directly
curl -v http://localhost:3000/api/property/remmarholmen?lang=fi

# 3. Test slug normalization
node -e "
const normalize = (s) => s.trim().toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/[^a-z0-9-]/g, '');
console.log('Normalized:', normalize('Remmarholmen'));
"

# 4. Check if alias file is being loaded
grep -r "property-aliases.json" src/
```

### 7. Expected Console Logs

When API route is hit, you should see:
```
🔍 Slug resolution: {
  rawSlug: 'remmarholmen',
  normalizedSlug: 'remmarholmen',
  resolvedSlug: 'remmarholmen-1'
}
```

If you don't see this, the API route isn't being hit or console.log was removed.

### 8. Production Debugging (Vercel)

If this works locally but fails in production:

```bash
# Check Vercel logs
vercel logs [deployment-url]

# Look for:
- "🔍 Slug resolution" logs
- JSON import errors
- Cache initialization errors
```

**Common production issues:**
1. JSON imports not supported → Convert to `.ts` file
2. Cache not initialized → Check instrumentation hook
3. Environment differences → Check file paths

### 9. Convert Alias File to TypeScript (if JSON import fails)

If you see "Cannot find module" error for the JSON file:

```typescript
// src/config/property-aliases.ts
export const PROPERTY_ALIASES: Record<string, string> = {
  'albertinkatu-19-b': 'albertinkatu-19-b-3',
  'remmarholmen': 'remmarholmen-1',
  'tehtaankatu-19-g': 'tehtaankatu-19-g-15',
  'pengerkatu': 'pengerkatu-25',
  'bernhardinkatu': 'bernhardinkatu-1',
  'heikkilantie': 'heikkilantie-1',
  'nuikontie-140': 'nuijontie-140'
};
```

Then update the API route:
```typescript
// src/app/api/property/[slug]/route.ts
import { PROPERTY_ALIASES } from '@/config/property-aliases';

const ALIAS_MAP: Record<string, string> = PROPERTY_ALIASES;
```

### 10. Immediate Workaround

If you need a quick fix right now, add the property directly:

**Option A:** Update alias to match exact slug in data
```json
{
  "remmarholmen": "actual-slug-from-check-cache"
}
```

**Option B:** Add all variations
```json
{
  "remmarholmen": "remmarholmen-1",
  "remmarholmen-1": "remmarholmen-1",
  "Remmarholmen": "remmarholmen-1",
  "REMMARHOLMEN": "remmarholmen-1"
}
```

### 11. Verify Fix

After making changes:

```bash
# 1. Restart server
npm run dev

# 2. Test in browser
open http://localhost:3000/property/remmarholmen?lang=fi

# 3. Check API
curl http://localhost:3000/api/property/remmarholmen?lang=fi | jq '.success'
# Should output: true

# 4. Check console
# Look for: "🔍 Slug resolution: { ... }"
```

---

## Most Likely Causes (in order)

1. **Property not in cache** (70% of cases)
   - Solution: Refresh cache or check Linear API data

2. **Alias points to wrong slug** (20% of cases)
   - Solution: Run `node check-cache.js` and update alias

3. **Dev server not restarted** (5% of cases)
   - Solution: Kill and restart `npm run dev`

4. **JSON import issue** (5% of cases)
   - Solution: Convert to `.ts` file

---

## Getting Help

If none of this works, provide:
1. Output of `node check-cache.js | grep -i remmar`
2. Output of `curl http://localhost:3000/api/property/remmarholmen?lang=fi`
3. Browser console screenshot
4. Server console logs (look for "🔍 Slug resolution")

