# Phase 3 Implementation Plan

**Status:** 📋 Planning  
**Estimated Duration:** 2-3 days  
**Dependencies:** Phase 1 ✅ & Phase 2 ✅ Complete  

---

## 🎯 Phase 3 Objectives

### Primary Goals
1. **Complete UI Migration** - Migrate remaining property views to new architecture
2. **Expand Domain Coverage** - Map all relevant Linear API fields
3. **Remove Legacy Code** - Delete old mappers and duplicate type definitions
4. **Performance Optimization** - Implement distributed caching if needed

### Success Criteria
- ✅ All property-related pages use new use cases
- ✅ No duplicate property type definitions
- ✅ Test coverage > 80% for critical paths
- ✅ Performance metrics meet or exceed baseline
- ✅ Zero `notFound()` errors for locale routes in production logs

---

## 📋 Phase 3 Breakdown

### Part A: Complete Domain Model (Priority: HIGH)

**Goal:** Map all remaining Linear API fields to domain model

#### 1. Add Missing Fields to Property Type

```typescript
// src/lib/domain/property.types.ts

export interface Property {
  // ... existing fields ...

  // NEW: Rich content
  description?: LocalizedValue;       // freeText / marketingDescription
  descriptionTitle?: LocalizedValue;  // freeTextTitle

  // NEW: Location
  coordinates?: {
    lat: number;
    lon: number;
  };
  
  // NEW: Documents & Media
  documents: {
    floorPlan?: string;      // URL to floor plan PDF
    brochure?: string;       // URL to property brochure
    brochureIntl?: string;   // International brochure
    energyCert?: string;     // Energy certificate URL
    video?: string;          // YouTube/Vimeo URL
  };

  // NEW: Detailed dimensions
  dimensions: {
    living: number;
    total?: number;
    plot?: number;
    balcony?: number;        // Parvekkeen pinta-ala
    terrace?: number;        // Terassin pinta-ala
    rooms?: string;          // e.g. "3h+k"
    bedrooms?: number;
    bathrooms?: number;
  };

  // NEW: Financial details
  fees: {
    maintenance?: number;    // Hoitovastike
    financing?: number;      // Rahoitusvastike
    water?: number;          // Vesimaksu
    heating?: number;        // Lämmityskustannus
    electricity?: number;    // Sähkökustannus
    parking?: number;        // Autopaikkamaksu
    sauna?: number;          // Saunamaksu
  };

  // NEW: Property features (booleans)
  features: {
    balcony?: boolean;
    terrace?: boolean;
    sauna?: boolean;
    fireplace?: boolean;
    storageRoom?: boolean;
  };

  // NEW: Rental-specific (if rent > 0)
  rental?: {
    monthlyRent: number;
    securityDeposit?: LocalizedValue;
    contractType?: LocalizedValue;
    earliestTermination?: LocalizedValue;
    petsAllowed?: boolean;
    smokingAllowed?: boolean;
  };
}
```

**Files to Update:**
- `src/lib/domain/property.types.ts` ⭐
- `src/lib/infrastructure/linear-api/mapper.ts` ⭐
- `src/lib/presentation/property.view-model.ts`

**Estimated Time:** 4-6 hours

---

### Part B: Complete View Model Coverage (Priority: HIGH)

#### 2. Expand PropertyDetailVM

```typescript
// src/lib/presentation/property.view-model.ts

export interface PropertyDetailVM extends PropertyCardVM {
  // ... existing fields ...

  // NEW: Rich content
  description?: string;        // Sanitized HTML
  descriptionTitle?: string;

  // NEW: Financial breakdown
  fees: {
    maintenance?: string;      // Formatted as "450 €/kk"
    financing?: string;
    total?: string;            // Sum of all fees
    water?: string;
    heating?: string;
  };

  // NEW: Room details
  rooms?: string;              // "3h+k"
  bedrooms?: number;
  bathrooms?: number;

  // NEW: Documents
  documents: {
    floorPlan?: string;
    brochure?: string;
    brochureIntl?: string;
    energyCert?: string;
    video?: string;
  };

  // NEW: Coordinates for map
  coordinates?: {
    lat: number;
    lon: number;
  };

  // NEW: Features list
  features: {
    label: string;             // Localized
    value: boolean;
  }[];
}
```

**New Methods in PropertyVM:**

```typescript
export class PropertyVM {
  // ... existing methods ...

  static formatFees(p: Property, l: Locale): PropertyDetailVM['fees'] {
    // Format all fees with locale-specific currency
  }

  static getFeaturesList(p: Property, l: Locale): { label: string; value: boolean }[] {
    // Return localized feature list (Sauna, Parveke, etc.)
  }

  static isRental(p: Property): boolean {
    return !!p.meta.rent && p.meta.rent > 0;
  }
}
```

**Files to Update:**
- `src/lib/presentation/property.view-model.ts` ⭐
- `src/lib/presentation/formatters/fees.ts` (NEW)

**Estimated Time:** 3-4 hours

---

### Part C: Update UI Components (Priority: HIGH)

#### 3. Complete DetailView Sections

**Update Files:**
```
src/components/Property/
├── DetailView.tsx           ⭐ Update Costs, Documents sections
├── MapView.tsx              ⭐ Integrate real map (Leaflet/Mapbox)
└── FeaturesList.tsx         🆕 New component for features
```

**DetailView Updates:**

```typescript
// In Costs section - add full fee breakdown
function Costs({ vm, locale }: Props) {
  return (
    <div className="bg-white rounded-none shadow-sm p-6">
      <h3>Kustannukset</h3>
      
      {/* Pricing */}
      <Row label="Myyntihinta" value={vm.price} />
      {vm.priceDebtFree && <Row label="Velaton hinta" value={vm.priceDebtFree} />}
      
      {/* NEW: Fees breakdown */}
      <h4 className="mt-6 mb-3">Kuukausittaiset kulut</h4>
      {vm.fees.maintenance && <Row label="Hoitovastike" value={vm.fees.maintenance} />}
      {vm.fees.financing && <Row label="Rahoitusvastike" value={vm.fees.financing} />}
      {vm.fees.water && <Row label="Vesimaksu" value={vm.fees.water} />}
      {vm.fees.total && (
        <Row 
          label="Yhteensä" 
          value={vm.fees.total} 
          className="font-bold border-t-2 mt-2 pt-2"
        />
      )}
    </div>
  );
}

// In Documents section - add real links
function Documents({ vm, locale }: Props) {
  const { documents } = vm;
  const hasAnyDocument = Object.values(documents).some(Boolean);
  
  if (!hasAnyDocument) {
    return <EmptyState locale={locale} />;
  }

  return (
    <div className="bg-white rounded-none shadow-sm p-6">
      <h3>Asiakirjat & Linkit</h3>
      
      <div className="space-y-3">
        {documents.floorPlan && (
          <DocumentLink 
            href={documents.floorPlan} 
            label={locale === 'sv' ? 'Planlösning' : locale === 'en' ? 'Floor Plan' : 'Pohjapiirros'} 
            icon="📄"
          />
        )}
        {documents.brochure && (
          <DocumentLink 
            href={documents.brochure} 
            label={locale === 'sv' ? 'Broschyr' : locale === 'en' ? 'Brochure' : 'Esite'} 
            icon="📑"
          />
        )}
        {documents.video && (
          <DocumentLink 
            href={documents.video} 
            label={locale === 'sv' ? 'Video' : locale === 'en' ? 'Video' : 'Video'} 
            icon="🎥"
          />
        )}
        {documents.energyCert && (
          <DocumentLink 
            href={documents.energyCert} 
            label={locale === 'sv' ? 'Energicertifikat' : locale === 'en' ? 'Energy Certificate' : 'Energiatodistus'} 
            icon="⚡"
          />
        )}
      </div>
    </div>
  );
}
```

**New Component: FeaturesList.tsx**

```typescript
// src/components/Property/FeaturesList.tsx
'use client';

interface FeaturesListProps {
  features: { label: string; value: boolean }[];
}

export function FeaturesList({ features }: FeaturesListProps) {
  const activeFeatures = features.filter(f => f.value);
  
  if (activeFeatures.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeFeatures.map(feature => (
        <span 
          key={feature.label}
          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
        >
          ✓ {feature.label}
        </span>
      ))}
    </div>
  );
}
```

**MapView with Real Map:**

```typescript
// src/components/Property/MapView.tsx
'use client';

import { useEffect, useRef } from 'react';
import type { PropertyDetailVM } from '@/lib/presentation/property.view-model';

export function MapView({ vm }: { vm: PropertyDetailVM }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vm.coordinates || !mapRef.current) return;

    // TODO: Integrate Leaflet or Mapbox
    // For now, use Google Maps Static API or similar
    const { lat, lon } = vm.coordinates;
    
    // Example with Leaflet (requires: npm install leaflet react-leaflet)
    import('leaflet').then((L) => {
      const map = L.map(mapRef.current!).setView([lat, lon], 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(vm.title);
    });
  }, [vm.coordinates, vm.title]);

  if (!vm.coordinates) {
    return (
      <div className="bg-gray-100 h-96 flex items-center justify-center">
        <p className="text-gray-500">Koordinater saknas</p>
      </div>
    );
  }

  return <div ref={mapRef} className="h-96 w-full" />;
}
```

**Files to Update:**
- `src/components/Property/DetailView.tsx` ⭐
- `src/components/Property/MapView.tsx` ⭐
- `src/components/Property/FeaturesList.tsx` 🆕
- `src/components/Property/DocumentLink.tsx` 🆕

**Estimated Time:** 4-5 hours

---

### Part D: Migrate Rental Properties View (Priority: MEDIUM)

#### 4. Update Rental Properties Page

**Goal:** Use new architecture for `/kohteet/vuokrakohteet`

```typescript
// src/app/[locale]/kohteet/vuokrakohteet/page.tsx

import { GetProperties } from '@/lib/application/get-properties.usecase';
import { PropertyVM } from '@/lib/presentation/property.view-model';
// ... imports

export default async function RentalPropertiesPage({ params: { locale } }) {
  const uc = new GetProperties(
    new LinearAPIClient(process.env.LINEAR_API_URL!, process.env.LINEAR_API_KEY),
    new LinearToPropertyMapper()
  );

  const allProperties = await uc.execute(locale);
  
  // Filter rentals using domain logic
  const rentals = allProperties.filter(p => PropertyVM.isRental(p));
  
  const vms = rentals.map(p => PropertyVM.toCard(p, locale));

  return <PropertyGrid cards={vms} locale={locale} title="Vuokrakohteet" />;
}
```

**Files to Update:**
- `src/app/[locale]/kohteet/vuokrakohteet/page.tsx` ⭐

**Estimated Time:** 1-2 hours

---

### Part E: Migrate References Page (Priority: MEDIUM)

#### 5. Update References/Sold Properties Page

```typescript
// src/app/[locale]/kohteet/referenssit/page.tsx

export default async function ReferencesPage({ params: { locale } }) {
  const uc = new GetProperties(...);
  const allProperties = await uc.execute(locale);
  
  // Filter sold properties
  // Note: Need to add 'status' field to domain model
  const sold = allProperties.filter(p => p.meta.status === 'SOLD');
  
  const vms = sold.map(p => PropertyVM.toCard(p, locale));

  return <PropertyGrid cards={vms} locale={locale} title="Referenssit" />;
}
```

**Requirements:**
- Add `status?: 'ACTIVE' | 'SOLD' | 'RESERVED'` to Property.meta
- Update mapper to handle status from Linear API

**Files to Update:**
- `src/lib/domain/property.types.ts` (add status)
- `src/lib/infrastructure/linear-api/mapper.ts` (map status)
- `src/app/[locale]/kohteet/referenssit/page.tsx` ⭐

**Estimated Time:** 2-3 hours

---

### Part F: Remove Legacy Code (Priority: HIGH)

#### 6. Clean Up Old Mappers and Types

**Files to DELETE:**
```
src/lib/
├── linear-api-adapter.ts           ❌ Delete (replaced by infrastructure/linear-api/)
├── linear-api-complete-converter.ts ❌ Delete
├── linear-api-to-property-mapper.ts ❌ Delete
├── property-types.ts               ❌ Delete (replaced by domain/property.types.ts)
├── property-types-multilang.ts     ❌ Delete
└── linear-ui-mapper.ts             ❌ Delete
```

**Files to UPDATE (remove old imports):**
```
src/app/[locale]/kohteet/page.tsx
src/components/Property/PropertySearch.tsx
src/components/Property/PropertyCard.tsx
```

**Before Deletion Checklist:**
- [ ] Verify all pages use new use cases
- [ ] Verify all components use PropertyCardVM/PropertyDetailVM
- [ ] Run full test suite
- [ ] Build successfully
- [ ] No TypeScript errors

**Estimated Time:** 2-3 hours

---

### Part G: Implement Advanced Features (Priority: LOW)

#### 7. Distributed Cache with @vercel/kv

**When to implement:** If Vercel cold starts cause cache misses

```typescript
// src/lib/infrastructure/cache/kv-store.ts

import { kv } from '@vercel/kv';
import { CacheAdapter } from './adapter';

export class KVCacheAdapter implements CacheAdapter {
  async get<T>(key: string): Promise<T | null> {
    return await kv.get(key);
  }

  async set<T>(key: string, value: T, options?: { ttl?: number }): Promise<void> {
    await kv.set(key, value, { ex: options?.ttl ?? 600 });
  }

  async delete(key: string): Promise<void> {
    await kv.del(key);
  }

  async clear(): Promise<void> {
    // Note: KV doesn't have "clear all" - need to track keys
    console.warn('KV clear() not implemented');
  }

  async isExpired(key: string): Promise<boolean> {
    const ttl = await kv.ttl(key);
    return ttl === -2; // Key doesn't exist
  }
}
```

**Usage:**
```typescript
// In use case
const cache = process.env.VERCEL_KV_REST_API_URL
  ? new KVCacheAdapter()
  : new MemoryCacheAdapter();
```

**Estimated Time:** 3-4 hours

---

#### 8. Enhanced Search & Filters

**Goal:** Client-side filtering using domain data

```typescript
// src/components/Property/PropertyFilters.tsx
'use client';

interface PropertyFiltersProps {
  properties: PropertyCardVM[];
  onFilterChange: (filtered: PropertyCardVM[]) => void;
  locale: Locale;
}

export function PropertyFilters({ properties, onFilterChange, locale }: PropertyFiltersProps) {
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: Infinity,
    minArea: 0,
    maxArea: Infinity,
    hasDebt: undefined as boolean | undefined,
    hasPlot: undefined as boolean | undefined,
  });

  useEffect(() => {
    const filtered = properties.filter(p => {
      // Parse price back to number for filtering
      const price = parsePriceFromFormatted(p.price);
      const area = parseAreaFromFormatted(p.area);

      return (
        price >= filters.minPrice &&
        price <= filters.maxPrice &&
        area >= filters.minArea &&
        area <= filters.maxArea &&
        (filters.hasDebt === undefined || p.hasDebt === filters.hasDebt) &&
        (filters.hasPlot === undefined || p.hasPlot === filters.hasPlot)
      );
    });

    onFilterChange(filtered);
  }, [filters, properties, onFilterChange]);

  return (
    <div className="bg-white p-6 rounded shadow-sm">
      {/* Filter UI */}
    </div>
  );
}
```

**Estimated Time:** 4-6 hours

---

## 📊 Phase 3 Timeline

### Week 1
- **Day 1-2:** Part A - Complete Domain Model
- **Day 3:** Part B - Expand View Models
- **Day 4-5:** Part C - Update UI Components

### Week 2
- **Day 1:** Part D - Rental Properties Migration
- **Day 2:** Part E - References Page Migration
- **Day 3:** Part F - Remove Legacy Code
- **Day 4:** Testing & Bug Fixes
- **Day 5:** Part G (Optional) - Advanced Features

**Total Estimated Time:** 25-35 hours (3-5 days)

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```bash
# New test files to create:
src/lib/presentation/__tests__/
├── property.view-model.test.ts     # Test VM transformations
└── formatters/fees.test.ts         # Test fee formatting

src/components/Property/__tests__/
├── FeaturesList.test.tsx
└── DocumentLink.test.tsx
```

### Integration Tests

```typescript
// tests/integration/property-detail.test.ts

describe('Property Detail Page', () => {
  it('should display all sections for complete property', async () => {
    const property = mockCompleteProperty();
    const vm = PropertyVM.toDetail(property, 'fi');
    
    expect(vm.description).toBeDefined();
    expect(vm.documents.floorPlan).toBeDefined();
    expect(vm.coordinates).toBeDefined();
    expect(vm.fees.total).toBeDefined();
  });

  it('should handle rental properties', async () => {
    const rental = mockRentalProperty();
    const vm = PropertyVM.toDetail(rental, 'fi');
    
    expect(PropertyVM.isRental(rental)).toBe(true);
    expect(vm.rental).toBeDefined();
  });
});
```

### E2E Tests (Optional - Playwright)

```typescript
// e2e/property-detail.spec.ts

test('property detail page navigation', async ({ page }) => {
  await page.goto('/kohde/heikkilantie-1');
  
  // Test tab navigation
  await page.click('text=Yhtiö- ja Rakennustiedot');
  await expect(page).toHaveURL(/tab=company/);
  
  // Test language switching
  await page.click('[href="/sv/kohde/heikkilantie-1"]');
  await expect(page).toHaveURL(/\/sv\//);
  
  // Verify key fields
  await expect(page.locator('text=Hiss')).toBeVisible();
  await expect(page.locator('text=1 462 587,91 €')).toBeVisible();
});
```

---

## 📈 Success Metrics

### Code Quality
- [ ] Test coverage > 80% for new code
- [ ] No TypeScript `any` types (except interfaces for external data)
- [ ] No linter warnings
- [ ] All components use strict i18n (lpick helper)

### Performance
- [ ] Lighthouse Performance > 85
- [ ] Time to Interactive < 3s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### User Experience
- [ ] No 404 errors on locale routes
- [ ] All forms functional in all languages
- [ ] Map loads within 1s
- [ ] Documents open in new tab

### Business Logic
- [ ] Rental properties correctly filtered
- [ ] Sold properties show "SOLD" badge
- [ ] All fees calculated correctly
- [ ] Agent contact forms work

---

## 🚨 Risk Mitigation

### High Risk Items

1. **Map Integration**
   - Risk: External dependency (Leaflet/Mapbox)
   - Mitigation: Keep placeholder, implement async
   - Fallback: Static map image

2. **Legacy Code Removal**
   - Risk: Breaking existing pages
   - Mitigation: Migrate all pages first, test thoroughly
   - Rollback: Git revert if issues found

3. **Performance Regression**
   - Risk: Adding features slows page load
   - Mitigation: Code splitting, lazy loading
   - Monitoring: Lighthouse CI in build pipeline

### Medium Risk Items

1. **Data Completeness**
   - Risk: Linear API missing fields
   - Mitigation: Handle undefined gracefully
   - Fallback: Empty state components

2. **Translation Coverage**
   - Risk: Not all content translated
   - Mitigation: Already handled by strict i18n
   - Fallback: Empty string (no fi fallback)

---

## 🔄 Rollback Plan

If critical issues found:

```bash
# 1. Revert Phase 3 changes
git log --oneline | grep "Phase 3"
git revert <commit-hash>

# 2. Or revert to Phase 2 tag
git tag phase-2-complete
git reset --hard phase-2-complete

# 3. Emergency deploy previous version
vercel rollback
```

---

## 📚 Documentation Deliverables

### To Create in Phase 3
- [ ] `MAP-INTEGRATION-GUIDE.md` - How to add coordinates
- [ ] `FEES-CALCULATION-SPEC.md` - Fee calculation logic
- [ ] `RENTAL-PROPERTIES-SPEC.md` - Rental-specific features
- [ ] `PHASE-3-IMPLEMENTATION-SUMMARY.md` - Post-completion summary

### To Update
- [ ] `README.md` - Update with Phase 3 completion
- [ ] `LINEAR-API-FIELD-MAPPING.md` - Add new mapped fields
- [ ] `DEPLOYMENT-CHECKLIST.md` - Add Phase 3 verification steps

---

## 🎯 Phase 4 Preview (Future)

After Phase 3 completion, consider:

1. **Advanced Search**
   - Elasticsearch integration
   - Fuzzy search
   - Saved searches

2. **User Accounts**
   - Favorite properties
   - Search alerts
   - Viewing history

3. **CMS Integration**
   - Editable content blocks
   - A/B testing
   - Marketing campaigns

4. **Analytics**
   - Property view tracking
   - Conversion funnels
   - User behavior analysis

5. **Mobile App**
   - React Native
   - Share domain logic
   - Offline support

---

## ✅ Phase 3 Kickoff Checklist

Before starting Phase 3:

- [ ] Phase 2 deployed to production
- [ ] No critical bugs in Phase 2
- [ ] Customer feedback collected
- [ ] Team aligned on priorities
- [ ] Environment variables verified
- [ ] Test data prepared
- [ ] Monitoring set up (Sentry/LogRocket)

---

## 🤝 Team Assignment (Suggested)

### Backend Focus
- **Domain Model Expansion** (Part A)
- **Mapper Updates** (Part A)
- **Use Case Updates** (Part D, E)

### Frontend Focus
- **View Model Updates** (Part B)
- **UI Component Updates** (Part C)
- **Testing** (All parts)

### DevOps Focus
- **Map Integration** (Part C)
- **Cache Implementation** (Part G)
- **Performance Monitoring** (Ongoing)

---

**Document Created:** 2025-01-29  
**Last Updated:** 2025-01-29  
**Status:** Ready for Review  
**Estimated Start Date:** After Phase 2 deployment verification  

---

**Questions or concerns?** Discuss with team before proceeding.

**Ready to start?** Begin with Part A (Domain Model Expansion).

