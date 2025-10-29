# Phase 3 Part D: Legacy Cleanup Plan

**Status:** 🔄 IN PROGRESS  
**Date:** 2025-10-29  
**Risk Level:** ⚠️ MEDIUM (Breaking changes)

---

## 📋 Overview

Phase 3 Part D focuses on **removing legacy code** now that migration is complete:
- Remove old routes (non-locale versions)
- Keep API routes (used by some components still)
- Document what remains for Phase 4

---

## 🗑️ Files to DELETE (Safe - Migrated to [locale] versions)

### 1. Old Property Routes (WITHOUT locale prefix)
All these have been migrated to `/app/[locale]/kohteet/`:

```
✅ DELETE: apps/next-front/src/app/kohteet/page.tsx
   Reason: Replaced by /app/[locale]/kohteet/page.tsx (migrated Phase 1)

✅ DELETE: apps/next-front/src/app/kohteet/vuokrakohteet/page.tsx  
   Reason: Replaced by /app/[locale]/kohteet/vuokrakohteet/page.tsx (migrated Phase 3C)

✅ DELETE: apps/next-front/src/app/kohteet/referenssit/page.tsx
   Reason: Replaced by /app/[locale]/kohteet/referenssit/page.tsx (migrated Phase 3C)

⚠️ KEEP: apps/next-front/src/app/kohteet/ostotoimeksiannot/page.tsx
   Reason: No [locale] version yet - migrate in Phase 4
```

### 2. Old Property Detail Route (WITHOUT locale prefix)

```
⚠️ CHECK: apps/next-front/src/app/[locale]/kohde/[slug]/page.tsx
   Status: Still uses fetchLinearListings - needs migration
   Action: Migrate to new use case (GetPropertyBySlug)
```

---

## ⚠️ Files to KEEP (Still Used by API Routes)

### 1. Legacy Adapter (Temporarily)
```
⏳ KEEP: apps/next-front/src/lib/linear-api-adapter.ts
   Reason: Used by:
   - /api/listings/route.ts
   - /api/property-ui/[slug]/route.ts
   - /api/listings-ui/route.ts
   - /api/debug/rental-check/route.ts
   - src/lib/content.ts
   
   Phase 4 Action: Migrate API routes to use cases, then delete
```

### 2. API Routes (Need Migration in Phase 4)
```
⏳ KEEP: apps/next-front/src/app/api/listings/route.ts
⏳ KEEP: apps/next-front/src/app/api/property-ui/[slug]/route.ts
⏳ KEEP: apps/next-front/src/app/api/listings-ui/route.ts
⏳ KEEP: apps/next-front/src/app/api/debug/rental-check/route.ts

Phase 4 Action: Refactor to use GetProperties/GetPropertyBySlug use cases
```

### 3. Utility Files
```
⏳ KEEP: apps/next-front/src/lib/content.ts
   Reason: Uses fetchLinearListings
   Phase 4 Action: Refactor or delete if unused
```

---

## ✅ Safe Deletions (Phase 3 Part D)

### Step 1: Delete Old Route Files
These are **safe to delete** because they're fully replaced:

```bash
rm apps/next-front/src/app/kohteet/page.tsx
rm apps/next-front/src/app/kohteet/vuokrakohteet/page.tsx
rm apps/next-front/src/app/kohteet/referenssit/page.tsx
```

**Why Safe:**
- Next.js will use `/app/[locale]/kohteet/*` routes
- Middleware redirects to locale-prefixed URLs
- No functionality loss

### Step 2: Verify Build Still Works
```bash
npm run build
```

**Expected:**
- ✅ Build succeeds
- ✅ 49 routes prerendered
- ✅ No TypeScript errors
- ✅ Locale routes still work

---

## ⏳ Deferred to Phase 4

### 1. Migrate Property Detail Page
**File:** `apps/next-front/src/app/[locale]/kohde/[slug]/page.tsx`

**Current State:**
```tsx
import { fetchLinearListings, fetchTestLinearListings } from '@/lib/linear-api-adapter';
```

**Target State:**
```tsx
import { GetPropertyBySlug } from '@/lib/application/get-property-by-slug.usecase';
```

**Why Defer:** Complex page, needs careful testing

---

### 2. Migrate API Routes
**Files:**
- `apps/next-front/src/app/api/listings/route.ts`
- `apps/next-front/src/app/api/property-ui/[slug]/route.ts`
- `apps/next-front/src/app/api/listings-ui/route.ts`

**Target:** Use `GetProperties` and `GetPropertyBySlug` use cases

**Why Defer:** Need to ensure backward compatibility with existing consumers

---

### 3. Delete Legacy Adapter
**File:** `apps/next-front/src/lib/linear-api-adapter.ts`

**When:** After all API routes and property detail page are migrated

**Verification:**
```bash
# Check no remaining imports
grep -r "from.*linear-api-adapter" apps/next-front/src/

# Should return 0 results
```

---

## 🎯 Implementation Plan

### Phase 3 Part D (NOW - Safe Deletions)
1. ✅ Delete old route files (kohteet/*, vuokrakohteet/*, referenssit/*)
2. ✅ Run build to verify
3. ✅ Test locale routes still work
4. ✅ Commit changes

### Phase 4 (LATER - API Migration)
1. Migrate property detail page to GetPropertyBySlug
2. Migrate API routes to use cases
3. Delete legacy adapter
4. Final cleanup

---

## 📊 Impact Analysis

### Safe to Delete (Phase 3D)
| File | LOC | Replaced By | Risk |
|------|-----|-------------|------|
| `app/kohteet/page.tsx` | ~120 | `app/[locale]/kohteet/page.tsx` | ✅ None |
| `app/kohteet/vuokrakohteet/page.tsx` | ~287 | `app/[locale]/kohteet/vuokrakohteet/page.tsx` | ✅ None |
| `app/kohteet/referenssit/page.tsx` | ~121 | `app/[locale]/kohteet/referenssit/page.tsx` | ✅ None |

**Total LOC to Delete:** ~528 lines

### To Migrate (Phase 4)
| File | LOC | Complexity | Priority |
|------|-----|------------|----------|
| `[locale]/kohde/[slug]/page.tsx` | ~200 | High | High |
| `api/listings/route.ts` | ~50 | Medium | Medium |
| `api/property-ui/[slug]/route.ts` | ~50 | Medium | Low |
| `lib/linear-api-adapter.ts` | ~700 | High | After all migrated |

---

## 🧪 Testing Checklist

After deletion:
- [ ] Build succeeds (`npm run build`)
- [ ] 49 routes prerendered
- [ ] `/fi/kohteet` loads
- [ ] `/sv/kohteet` loads
- [ ] `/en/kohteet` loads
- [ ] `/fi/kohteet/vuokrakohteet` loads
- [ ] `/sv/kohteet/vuokrakohteet` loads
- [ ] `/fi/kohteet/referenssit` loads
- [ ] No 404 errors
- [ ] No TypeScript errors

---

## 🚀 Execute Phase 3D

Ready to delete safe files?

```bash
# 1. Delete old routes
rm apps/next-front/src/app/kohteet/page.tsx
rm apps/next-front/src/app/kohteet/vuokrakohteet/page.tsx
rm apps/next-front/src/app/kohteet/referenssit/page.tsx

# 2. Verify build
npm run build

# 3. Commit
git add -A
git commit -m "chore(cleanup): Phase 3 Part D - Remove old non-locale routes"
```

---

**Phase 3 Part D: Safe deletions ready to execute! 🎯**

