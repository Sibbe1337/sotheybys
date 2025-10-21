# 🔍 Debugging Property 404 Issues

## Problem
Properties display correctly on the homepage but return 404 when clicking "Katso kohde" (View property).

Example: **Remmarholmen** shows in listings but `/property/remmarholmen` returns 404.

---

## Quick Diagnosis (Browser-Based)

### Option 1: Use the Debug Tool (Easiest)

1. **Visit:** `https://your-site.vercel.app/debug-404.html`
2. **Run all 3 steps** in the tool
3. **Follow the suggested fix** at the bottom

### Option 2: Manual Browser Console (5 minutes)

Open your live site and press `F12` (or `Cmd+Option+I` on Mac) to open DevTools Console.

#### Step A: Find the actual slug being used

```javascript
// On the homepage, run:
document.querySelectorAll('a[href*="remmar"]').forEach(link => {
  const slug = link.getAttribute('href').split('/').pop();
  console.log('Slug:', slug, '| Link:', link.href);
});
```

**Copy the slug value** (e.g., `Remmarholmen`, `remmarholmen-1`, etc.)

#### Step B: Test if API can find it

```javascript
// Replace 'SLUG_HERE' with the slug from Step A:
const slug = 'remmarholmen'; // <-- CHANGE THIS

fetch(`/api/property/${slug}?lang=fi`)
  .then(r => r.json())
  .then(data => {
    console.log('API Response:', data);
    if (data.success) {
      console.log('✅ FOUND:', data.data.title);
    } else {
      console.log('❌ NOT FOUND');
      console.log('  Normalized:', data.normalized);
      console.log('  Resolved:', data.resolved);
    }
  });
```

#### Step C: Find all "remmar" properties in cache

```javascript
fetch('/api/homepage')
  .then(r => r.json())
  .then(data => {
    const matches = data.listings?.filter(p => 
      p.title?.toLowerCase().includes('remmar') ||
      p.slug?.toLowerCase().includes('remmar')
    );
    console.log('Properties found:', matches.length);
    matches?.forEach(p => {
      console.log('  →', p.slug, '|', p.title);
    });
  });
```

---

## Common Issues & Solutions

### Issue 1: Slug Mismatch

**Symptoms:**
- Homepage uses slug `Remmarholmen`
- Alias expects `remmarholmen-1`
- API can't find property

**Fix:**

1. Find actual slug (from Step C above)
2. Update `src/config/property-aliases.json`:
   ```json
   {
     "aliases": {
       "remmarholmen": "actual-slug-from-step-c",
       ...
     }
   }
   ```
3. Commit and push (triggers Vercel redeploy)

### Issue 2: Property Not in Cache

**Symptoms:**
- Step C returns 0 matches
- API returns `NOT_FOUND`

**Possible Causes:**
1. **Not published in Linear** → Check Linear API
2. **Filtered out** → Check filtering logic in `src/lib/listings-cache.ts`
3. **Cache not synced yet** → Wait 10 minutes (auto-sync interval)

**Fix:**
- If not published: Publish in Linear
- If filtered: Adjust filter
- If waiting for sync: Wait or restart server to force sync

### Issue 3: Case Sensitivity

**Symptoms:**
- `/property/Remmarholmen` works (capital R)
- `/property/remmarholmen` doesn't work (lowercase r)

**Fix:**
This should already be handled by `normalizeSlug()` function in:
`src/app/api/property/[slug]/route.ts`

If it's still case-sensitive, the normalization isn't working. Check:
1. Is the API route file saved?
2. Has it been deployed?
3. Are there any TypeScript errors?

### Issue 4: Alias Not Loading

**Symptoms:**
- Server logs show: `resolvedSlug === normalizedSlug`
- No alias mapping applied

**Fix:**
1. Check `property-aliases.json` is valid JSON
2. Restart dev server (aliases load at startup)
3. Check for JSON import errors in server logs

---

## Server-Side Debugging (If You Have Access)

### Check Server Logs

When someone visits `/property/remmarholmen`, look for:

```
🔍 Slug resolution: {
  rawSlug: 'remmarholmen',
  normalizedSlug: 'remmarholmen',
  resolvedSlug: 'remmarholmen-1'  // ← should show alias if configured
}
```

If `resolvedSlug` equals `normalizedSlug`, the alias isn't being applied.

### Force Cache Refresh

If you have SSH access:

```bash
# Restart the app (triggers cache reload)
pm2 restart next-front

# Or kill and start
pm2 delete next-front
cd apps/next-front
npm run build
pm2 start ecosystem.config.js
```

On Vercel: Just redeploy (push to main branch).

---

## Prevention: Add Properties Correctly

When adding a new property that might have slug variations:

1. **Check the slug** in Linear/WordPress
   - Example: Property is `Albertinkatu 19 B 3`
   - Generated slug might be: `albertinkatu-19-b-3`

2. **Add marketing aliases** if needed:
   ```json
   {
     "albertinkatu-19-b": "albertinkatu-19-b-3",
     "albertinkatu": "albertinkatu-19-b-3"
   }
   ```

3. **Test before deploying:**
   ```bash
   curl "http://localhost:3000/api/property/albertinkatu?lang=fi"
   # Should return success: true
   ```

---

## Testing Checklist

Before marking this as "fixed":

- [ ] Homepage displays property correctly
- [ ] Clicking "Katso kohde" loads detail page (no 404)
- [ ] Works in all 3 languages (fi, sv, en)
- [ ] URL variations work:
  - `/property/remmarholmen`
  - `/property/Remmarholmen`
  - `/property/remmarholmen-1`
- [ ] API returns `success: true`
- [ ] No console errors in browser or server logs

---

## Need Help?

Run the debug tool and provide:

1. **Output from Step 1** (slug on homepage)
2. **Output from Step 2** (API response)
3. **Output from Step 3** (cache search)
4. **Screenshot** of any error messages

This will help identify the exact issue!

