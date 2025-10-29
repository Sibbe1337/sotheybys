# 🚀 Deployment Checklist - Phase 2 Complete

## Pre-Deployment Checks

### 1. Local Build Verification
```bash
# Clean build
rm -rf .next
npm run build

# This automatically runs:
# - next build
# - scripts/assert-locales.js (breaks build if routes missing)
```

**Expected Output:**
```
✅ All critical locale routes prerendered successfully
📊 Total prerendered routes: [number]
```

### 2. Local Production Test
```bash
# Start production server locally
npm run start

# Test in browser:
# - http://localhost:3001/fi
# - http://localhost:3001/sv
# - http://localhost:3001/en
```

### 3. Environment Variables Check

Verify these are set in your production environment:

```env
LINEAR_API_URL=https://[your-linear-api]
LINEAR_API_KEY=[your-api-key]
NEXT_PUBLIC_SITE_URL=https://sothebysrealty.fi
LOG=0  # Set to 1 for debugging

# Optional for later:
# VERCEL_KV_REST_API_URL=
# VERCEL_KV_REST_API_TOKEN=
```

## Deployment Steps

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy to production
vercel --prod

# Or push to main branch for auto-deploy
git add .
git commit -m "Phase 2: Property detail page with clean architecture"
git push origin main
```

### Option B: Custom Server

```bash
# Build for production
npm run build

# Start with PM2 (if configured)
npm run pm2:start

# Or start directly
npm run start
```

## Post-Deployment Verification

### Critical Routes (Must Work)

#### 1. Locale Routes
- [ ] `https://sothebysrealty.fi/fi` - Finnish homepage
- [ ] `https://sothebysrealty.fi/sv` - Swedish homepage
- [ ] `https://sothebysrealty.fi/en` - English homepage

#### 2. Property List Routes
- [ ] `/fi/kohteet` - Finnish properties
- [ ] `/sv/kohteet` - Swedish properties (should NOT 404 even if translations missing)
- [ ] `/en/kohteet` - English properties (should NOT 404 even if translations missing)

#### 3. Property Detail Routes
- [ ] `/kohde/heikkilantie-1?lang=fi` - Finnish detail
- [ ] `/kohde/heikkilantie-1?lang=sv` - Swedish detail
- [ ] `/kohde/heikkilantie-1?lang=en` - English detail

#### 4. Static Pages
- [ ] `/fi/henkilosto` - Staff page
- [ ] `/sv/henkilosto` - Staff page (Swedish)
- [ ] `/fi/yhteystiedot` - Contact page
- [ ] `/fi/yritys` - Company page

### Feature Verification

#### Property Detail Page Checklist

Test with Heikkiläntie example:

1. **Layout & Hero**
   - [ ] Hero image loads correctly
   - [ ] Address shows: "Heikkiläntie 1"
   - [ ] City shows: "Helsinki, 00210"

2. **Type & Apartment Type**
   - [ ] **Type appears BEFORE "Huoneistoselitelmä"** under hero
   - [ ] Shows format: "KERROSTALO | 2h+k" (or similar)
   - [ ] **No Finnish text leak in Swedish/English views**

3. **Tabs Navigation**
   - [ ] All 7 tabs render: Overview, Apartment, Company & Building, Costs, Other Info, Documents, Map
   - [ ] Clicking tab updates URL to `?tab=apartment` etc.
   - [ ] **Browser back/forward works** with tab state
   - [ ] **Language prefix preserved** when switching tabs

4. **"Yhtiö- ja Rakennustiedot" Section**
   - [ ] **Hiss (Elevator) is in THIS section** (not in Huoneistotiedot)
   - [ ] Shows: "Kyllä" or "Ei" or "Ja/Nej" (localized)
   - [ ] **Taloyhtiön lainat**: Shows "1 462 587,91 €" (formatted correctly)
   - [ ] **Taloyhtiön kiinnitykset**: Shows "1 625 002,18 €" (separate from loans)
   - [ ] Lainan päivämäärä: Shows date if available

5. **"Muut tiedot" Section**
   - [ ] **Vapautuminen (Available From)** appears here
   - [ ] **Omistusmuoto (Ownership Type)** appears here
   - [ ] Kaavoitus (Zoning) appears here

6. **Agent Card (Sidebar)**
   - [ ] Agent name displays
   - [ ] Agent photo loads (if available)
   - [ ] Phone number is clickable `tel:` link
   - [ ] **Email is clickable `mailto:` link** (not raw URL)
   - [ ] Title/role displays

7. **Price Card (Sidebar)**
   - [ ] Myyntihinta (Sales Price) displays
   - [ ] Velaton hinta (Debt-free Price) displays if hasDebt
   - [ ] Pinta-ala (Area) displays

8. **Empty State (Non-existent slug)**
   - [ ] Navigate to `/kohde/does-not-exist-slug`
   - [ ] **Should show empty state** (not 404)
   - [ ] Link back to properties works

### Performance Checks

```bash
# Check prerendered routes
cat .next/prerender-manifest.json | jq '.routes | keys'

# Should include:
# /fi, /sv, /en
# /fi/kohteet, /sv/kohteet, /en/kohteet
# All static pages for all locales
```

### Browser DevTools Checks

1. **Console Errors**
   - [ ] No React hydration errors
   - [ ] No "NEXT_NOT_FOUND" errors for locale routes
   - [ ] No import errors

2. **Network Tab**
   - [ ] Static pages return `200 OK`
   - [ ] No unnecessary API calls on static pages
   - [ ] Images load with Next/Image optimization

3. **Lighthouse Score** (Optional but recommended)
   - [ ] Performance > 80
   - [ ] Accessibility > 90
   - [ ] Best Practices > 90
   - [ ] SEO > 90

## Rollback Plan

If critical issues found in production:

```bash
# Revert to previous deployment (Vercel)
vercel rollback

# Or revert Git commit
git revert HEAD
git push origin main
```

## Known Limitations (MVP)

✅ **Working as designed:**
- Map shows placeholder (coords not yet in domain)
- Documents section shows placeholder (links not yet in domain)
- Some translations may show empty state (strict i18n policy)
- Description field placeholder (waiting for marketing content in domain)

❌ **Should NOT happen:**
- 404 on `/sv` or `/en` routes
- `notFound()` error for missing translations
- Agent email showing URL instead of email
- Hiss in Huoneistotiedot instead of Yhtiö- ja Rakennustiedot
- Loans and encumbrances showing as same value

## Success Criteria

✅ All checkboxes above are checked
✅ No NEXT_NOT_FOUND errors in production logs
✅ Heikkiläntie property shows correct data structure
✅ All three languages (fi/sv/en) accessible
✅ Tab navigation preserves language
✅ Build completes without errors

## Next Steps After Successful Deployment

1. **Monitor logs** for first 24 hours
2. **Collect feedback** on new detail page structure
3. **Plan Phase 3** migration (remaining UI components)
4. **Consider** adding @vercel/kv for distributed cache

---

**Phase 2 Deployed:** [DATE]  
**Verified By:** [YOUR NAME]  
**Production URL:** https://sothebysrealty.fi  
**Status:** [ ] Success [ ] Issues Found

