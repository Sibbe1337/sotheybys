# Spec Verification - Phase A: Critical i18n Fixes ✅ COMPLETE

**Date:** 2025-01-29  
**Status:** Phase A Complete  
**Next:** Phase B (UI/UX Alignment)

---

## 🎯 Phase A Goals (from Plan)

1. ✅ Implement `lpickStrict()` and replace `lpick()` where needed
2. ✅ Add placeholder logic to `Row` component  
3. ✅ Move all tab/section labels to JSON files

---

## ✅ What Was Implemented

### 1. Strict Locale Enforcement (`locale-utils.ts`)

**Problem:** Original `lpick()` silently fell back to Finnish, violating spec requirement.

**Spec Requirement:**
> "Strict locale selection per field... do not silently fallback to FI on SV/EN"  
> "If requested language value is missing: Show placeholder ('Tieto puuttuu' / 'Uppgift saknas')"

**Solution Implemented:**

```typescript
// NEW: Strict picker - no FI fallback
export function lpickStrict(
  lv: LocalizedValue | undefined,
  locale: Locale
): string {
  if (!lv) return '';
  const value = lv[locale];
  if (!value || value.trim() === '') {
    // Return locale-specific placeholder (NOT fi fallback)
    return MISSING_TRANSLATION_PLACEHOLDERS[locale];
  }
  return value;
}

// Placeholders per locale
const MISSING_TRANSLATION_PLACEHOLDERS = {
  fi: 'Tieto puuttuu',
  sv: 'Uppgift saknas',
  en: 'Information unavailable'
};
```

**Additional Functions:**
- `lpickWithFallback()` - Explicit control over FI fallback
- `getPlaceholder(locale)` - Get placeholder text for missing data
- Original `lpick()` marked as `@deprecated` but kept for backward compatibility

**Files Modified:**
- ✅ `src/lib/domain/locale-utils.ts`

---

### 2. Always-Visible Fields with Placeholders

**Problem:** Original `Row` component hid fields when value was empty, violating spec.

**Spec Requirement:**
> "Always-visible fields (Floor, Energy class, Heating, Company name, etc.) must show label + placeholder if value is missing"

**Solution Implemented:**

```typescript
function Row({ 
  label, 
  value, 
  alwaysVisible = false,  // NEW param
  locale = 'fi' 
}: { 
  label: string; 
  value?: string | number | boolean; 
  alwaysVisible?: boolean;
  locale?: Locale;
}) {
  // Hide if not always-visible and value is empty
  if (!alwaysVisible && (value === undefined || value === null || value === '')) {
    return null;
  }
  
  // Show placeholder if always-visible but empty
  const hasValue = value !== undefined && value !== null && value !== '';
  const displayValue = hasValue ? String(value) : getPlaceholder(locale);
  
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium ${hasValue ? 'text-gray-900' : 'text-gray-400 italic'}`}>
        {displayValue}
      </span>
    </div>
  );
}
```

**Always-Visible Fields Marked (per spec):**

**Apartments:**
- ✅ Floor (`alwaysVisible` in ApartmentInfo)
- ✅ Energy class (`alwaysVisible` in CompanyAndBuilding)
- ✅ Heating system (`alwaysVisible` in CompanyAndBuilding)
- ✅ Elevator (`alwaysVisible` in CompanyAndBuilding)
- ✅ Year built (`alwaysVisible` in CompanyAndBuilding)
- ✅ Company name (`alwaysVisible` in CompanyAndBuilding)
- ✅ Company loans (`alwaysVisible` in CompanyAndBuilding)
- ✅ Company encumbrances (`alwaysVisible` in CompanyAndBuilding)
- ✅ Lot ownership (`alwaysVisible` in OtherInfo)
- ✅ Housing tenure (`alwaysVisible` in OtherInfo)
- ✅ Zoning (`alwaysVisible` in OtherInfo)

**Files Modified:**
- ✅ `src/components/property/DetailView.tsx` (Row component updated)
- ✅ `src/components/property/DetailView.tsx` (ApartmentInfo section)
- ✅ `src/components/property/DetailView.tsx` (CompanyAndBuilding section)
- ✅ `src/components/property/DetailView.tsx` (OtherInfo section)

---

### 3. i18n JSON Translation Keys

**Problem:** Tabs and labels were hardcoded inline with ternary operators.

**Spec Requirement:**
> "Labels/tabs/section names must come from i18n JSON files"

**Solution Implemented:**

**JSON Structure Added:**
```json
{
  "property": {
    "tabs": {
      "overview": "...",
      "apartment": "...",
      "company": "...",
      "costs": "...",
      "other": "...",
      "documents": "...",
      "map": "..."
    },
    "sections": {
      "images": "...",
      "keyFeatures": "...",
      "apartmentInfo": "...",
      "companyAndBuilding": "...",
      "buildingInfo": "...",
      "companyInfo": "...",
      "purchasePrice": "...",
      "monthlyFees": "...",
      "rentalInfo": "...",
      "ownershipAndTerms": "...",
      "features": "..."
    },
    "fields": {
      "type": "...",
      "apartmentType": "...",
      "rooms": "...",
      "floor": "...",
      "yearBuilt": "...",
      "energyClass": "...",
      "elevator": "...",
      "companyName": "...",
      "companyLoans": "...",
      "companyEncumbrances": "...",
      "yes": "...",
      "no": "...",
      // ... 40+ field keys
    },
    "empty": {
      "noDocuments": "...",
      "noCoordinates": "...",
      "contactAgent": "..."
    }
  }
}
```

**Translation Helper Created:**
```typescript
// src/lib/i18n/property-translations.ts

export function t(key: string, locale: Locale): string;
export function getTabLabel(tabId: string, locale: Locale): string;
export function getSectionLabel(sectionId: string, locale: Locale): string;
export function getFieldLabel(fieldId: string, locale: Locale): string;
export function getAllTabs(locale: Locale): Array<[string, string]>;
```

**Usage in Components:**
```typescript
// BEFORE (hardcoded)
const tabs = [
  ['overview', locale === 'sv' ? 'Översikt' : locale === 'en' ? 'Overview' : 'Yleiskatsaus'],
  // ... repeated for each tab
];

// AFTER (from JSON)
const tabs = getAllTabs(locale);
```

```typescript
// BEFORE (hardcoded labels)
<Row 
  label={locale === 'sv' ? 'Byggår' : locale === 'en' ? 'Year Built' : 'Rakennusvuosi'} 
  value={vm.yearBuilt} 
/>

// AFTER (from JSON)
<Row 
  label={getFieldLabel('yearBuilt', locale)} 
  value={vm.yearBuilt} 
  alwaysVisible
  locale={locale}
/>
```

**Files Added:**
- ✅ `src/lib/i18n/property-translations.ts` (NEW)

**Files Modified:**
- ✅ `messages/fi.json` (added `property` section)
- ✅ `messages/sv.json` (added `property` section)
- ✅ `messages/en.json` (added `property` section)
- ✅ `src/components/property/DetailView.tsx` (uses translation helpers)

---

## 📊 Phase A Summary

| Task | Status | Files Changed | Lines Added/Modified |
|------|--------|---------------|---------------------|
| Strict locale enforcement | ✅ Complete | 1 file | ~90 lines |
| Always-visible placeholders | ✅ Complete | 1 file | ~30 lines |
| i18n JSON keys | ✅ Complete | 4 files | ~250 lines |
| Translation helper | ✅ Complete | 1 file (new) | ~80 lines |
| **TOTAL** | **✅ Complete** | **6 files** | **~450 lines** |

---

## 🔍 Verification Checklist

### Strict i18n
- [x] `lpickStrict()` returns placeholder instead of FI fallback
- [x] `getPlaceholder()` returns locale-specific text
- [x] `lpick()` marked as deprecated
- [x] `lpickWithFallback()` provides explicit control

### Always-Visible Fields
- [x] Floor shows placeholder if empty
- [x] Energy class shows placeholder if empty
- [x] Heating system shows placeholder if empty
- [x] Elevator shows Ja/Nej/Yes/No or placeholder
- [x] Year built shows placeholder if empty
- [x] Company name shows placeholder if empty
- [x] Company loans shows placeholder if null
- [x] Company encumbrances shows placeholder if null
- [x] Lot ownership shows placeholder if empty
- [x] Housing tenure shows placeholder if empty
- [x] Zoning shows placeholder if empty

### i18n JSON
- [x] All 7 tab labels in JSON
- [x] All 11 section labels in JSON
- [x] All 40+ field labels in JSON
- [x] Yes/No labels in JSON
- [x] Empty state messages in JSON
- [x] All 3 locales covered (FI/SV/EN)

### Component Updates
- [x] DetailView uses `getAllTabs()`
- [x] DetailView uses `getFieldLabel()`
- [x] DetailView uses `getSectionLabel()`
- [x] Row component supports `alwaysVisible` prop
- [x] Row component supports `locale` prop

---

## 🚀 Next Steps: Phase B (UI/UX Alignment)

Per the original plan, Phase B includes:

### 4. Add 6-latest grid to list page
- **File:** `src/app/[locale]/kohteet/page.tsx`
- **Spec:** "Top grid: 6 latest objects (image-only cards)"
- **Status:** ⏳ Not started

### 5. Verify/fix dual sliders
- **File:** `src/components/Property/PropertySearch.tsx`
- **Spec:** "both handles must be draggable"
- **Status:** ⏳ Needs verification

### 6. Remove rounded corners from cards
- **File:** `src/components/Property/PropertyGrid.tsx`
- **Spec:** "Cards with sharp corners (no rounded)"
- **Status:** ⏳ Needs verification

### 7. Verify mobile filter behavior
- **File:** `src/components/Property/PropertySearch.tsx`
- **Spec:** "Filter panel not sticky on mobile"
- **Status:** ⏳ Needs verification

---

## 📝 Notes

- Original `lpick()` kept for backward compatibility but marked deprecated
- Translation helper works in client components (no `useTranslations` hook needed)
- Placeholder text is styled with gray italic to distinguish from real values
- All locale-specific text now centralized in JSON files

---

**Phase A Status:** ✅ **COMPLETE** (3/3 tasks)  
**Overall Progress:** Phase A of 4 phases complete  
**Estimated Remaining Work:** Phases B, C, D per original plan

