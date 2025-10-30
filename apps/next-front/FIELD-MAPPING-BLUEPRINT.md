# 🧭 FIELD MAPPING BLUEPRINT

**Complete Guide: Linear API → Property Domain Model → UI Presentation**

**Last Updated:** 2025-10-30  
**Based on:** Dennis' Implementation List + Clean Architecture

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Mapping Strategy](#mapping-strategy)
3. [Language Rules](#language-rules)
4. [Field Categories](#field-categories)
5. [Formatting Rules](#formatting-rules)
6. [Known Issues & Fixes](#known-issues--fixes)

---

## 🎯 OVERVIEW

This blueprint defines **exactly** how every field flows from Linear API to the UI:

```
Linear API → mapper.ts → Property (domain) → view-model.ts → UI
```

### Key Principles

1. **Hide empty fields** (B Strategy implemented ✅)
2. **Localized labels** for all displayed text
3. **Smart fallbacks** when data is missing
4. **Type-safe** transformations
5. **Conditional rendering** based on property type

---

## 🔄 MAPPING STRATEGY

### **Phase 1: API → Domain** (`mapper.ts`)
Extract from Linear API, handle nulls/undefined, convert types

### **Phase 2: Domain → ViewModel** (`property.view-model.ts`)
Transform for UI, format values, apply locale-specific rules

### **Phase 3: ViewModel → UI** (`DetailView.tsx`, `PropertyCardNew.tsx`)
Render with conditional logic, hide if empty (B Strategy ✅)

---

## 🌍 LANGUAGE RULES

### **"Ej angivet" / "Not specified" Handling**

| Language | Text when field is empty |
|----------|--------------------------|
| FI | "Ei ilmoitettu" |
| SV | "Ej angivet" |
| EN | "Not specified" |

### **Implementation**

```typescript
function withPlaceholder(
  value: string | undefined, 
  locale: 'fi' | 'sv' | 'en'
): string {
  const missing = { 
    fi: 'Ei ilmoitettu', 
    sv: 'Ej angivet', 
    en: 'Not specified' 
  };
  return value && value.trim() !== '' ? value : missing[locale];
}
```

### **✅ B Strategy: Hide Instead of Showing Placeholder**

**We DO NOT use placeholders anymore!** Instead:
```typescript
// ❌ OLD (shows "Ej angivet"):
<Row label="Byggår" value={vm.yearBuilt} alwaysVisible />

// ✅ NEW (hides field if empty):
{vm.yearBuilt && <Row label="Byggår" value={vm.yearBuilt} />}
```

---

## 📊 FIELD CATEGORIES

## 1️⃣ **BASINFORMATION (Basic Info)**

| UI Label (SV) | Property Field | Linear API Fields | Fallback/Fix | Language Rule |
|---------------|----------------|-------------------|--------------|---------------|
| **Adress** | `address` | `address` | Always localized (fi/sv/en) | Use `lv()` |
| **Stad** | `city` | `city` | Always localized | `lv()` |
| **Postnummer** | `postalCode` | `postalCode` | Hide if empty ✅ | Always in active language |
| **Kohdenumero** | `meta.identifierFi` | `identifier.fi.value` | Optional, hide if empty ✅ | Numeric |
| **Typ av objekt** | `meta.typeCode` | `listingType` | Translate via `localizeListingType()` | Localized text (sv/en/fi) |
| **Huoneistoselitelmä** | `meta.apartmentType` | `typeOfApartment` | Hide if empty ✅ | `lv()` |
| **Beskrivningstext** | `description` | `freeText`, `marketingDescription` | Use `marketingDescription` if `freeText` empty | `lv()` |

---

## 2️⃣ **HUONEISTOTIEDOT (Apartment Info)**

| UI Label (SV) | Property Field | Linear API Fields | Fallback/Fix | Language Rule |
|---------------|----------------|-------------------|--------------|---------------|
| **Våning (Kerros)** | `meta.floor` | `floor`, `floorLocation` | Hide if both empty ✅ | Display as-is |
| **Antal våningar** | `meta.floorsTotal` | `floorCount`, `nonLocalizedValues.floorCount` | Hide if empty ✅ | Only show if >0 |
| **Hiss** | `meta.elevator` | `housingCooperativeElevator`, `elevator` | Fix with `toBool()` – 'Kyllä'→true | Always show Ja/Nej |
| **Balkong** | `features.balcony` | `hasBalcony` | Hide if false ✅ | Show in selected language |
| **Bastu** | `features.sauna` | `sauna` | Hide if false ✅ | — |
| **Terrass** | `features.terrace` | `hasTerrace`, `terrace` | Hide if false ✅ | — |
| **Skick** | `meta.condition` | `condition` | Translate "Hyvä"→"Bra" | Localized via `lv()` |
| **Tillträde** | `meta.availableFrom` | `availableFrom`, `freeOnText` | Hide if empty ✅ | `lv()` |
| **Antal rum** | `dimensions.rooms` | `roomCount` | Parse int from `nonLocalizedValues` | — |
| **Antal sovrum** | `dimensions.bedrooms` | `bedroomCount` | Parse int | — |

---

## 3️⃣ **YHTIÖ- & RAKENNUSTIEDOT (Company & Building)**

| UI Label (SV) | Property Field | Linear API Fields | Fallback/Fix | Language |
|---------------|----------------|-------------------|--------------|----------|
| **Byggnadsår** | `meta.yearBuilt` | `yearBuilt`, `completeYear`, `constructionYear` | Take first that exists, hide if empty ✅ | — |
| **Energiklass** | `meta.energyClass` | `energyClass` | Hide if empty ✅ | — |
| **Energiatodistus** | `meta.energyCertStatus` | `listingHasEnergyCertificate` | `normalizeEnergyStatus()` – 'Ei lain edellyttämää' → NOT_REQUIRED_BY_LAW | — |
| **Värmesystem** | `meta.heatingSystem` | `heatingSystem` | Hide if empty ✅ | `lv()` |
| **Ventilation** | `meta.ventilationSystem` | `ventilationSystem` | Hide if empty ✅ | `lv()` |
| **Husbolagets namn** | `meta.housingCompany.name` | `housingCooperativeName` | Hide if empty ✅ | `lv()` |
| **Bolagets lån** | `meta.housingCompany.loans` | `companyLoans`, `taloyhtionLainat` | Parse Euro → hide if 0 ✅ | — |
| **Bolagets inteckningar** | `meta.housingCompany.encumbrances` | `housingCooperativeMortgage`, `propertyMortgage`, `encumbranceAmount` | Parse Euro, hide if 0 ✅ | — |
| **Bolagets datum** | `meta.housingCompany.loansDate` | `housingCooperativeMortgageDate`, `propertyManagerCertificateDate` | Hide if empty ✅ | Date format per language |
| **Tomtägande** | `meta.plotOwnership` | `siteOwnershipType`, `lotOwnership` | Hide if empty ✅ | `lv()` |
| **Hallintamuoto** | `meta.housingTenure` | `housingTenure` | Hide if empty ✅ | `lv()` |

---

## 4️⃣ **KUSTANNUKSET (Economics)**

| UI Label (SV) | Property Field | Linear API Fields | Fallback/Fix | Format |
|---------------|----------------|-------------------|--------------|--------|
| **Velaton hinta** | `pricing.debtFree` | `debtFreePrice` | `parseEuro()` | € |
| **Myyntihinta** | `pricing.sales` | `askPrice` | `parseEuro()` | € |
| **Velkaosuus** | `pricing.debt` | Calculated (debtFree − sales) | Hide if 0 ✅ | € |
| **Hoitovastike** | `fees.maintenance` | `maintenanceCharge`, `mandatoryCharges` | `parseEuro`, hide if 0 ✅ | €/mån |
| **Rahoitusvastike** | `fees.financing` | `fundingCharge`, `financingCharge` | `parseEuro`, hide if 0 ✅ | €/mån |
| **Vesimaksu** | `fees.water` | `waterCharge` | `parseEuro`, hide if 0 ✅ | €/mån |
| **Totalt vederlag** | (beräkning) | maintenance + financing + other | Round 2 decimals | €/mån |
| **€/m²** | (beräkning) | price / livingArea | Only if livingArea > 0 | € |
| **Kiinteistövero** | `fees.propertyTax` | `propertyTax` | **Only for properties** ⚠️, hide if 0 ✅ | € |

---

## 5️⃣ **FASTIGHETER (Properties) - Unique Fields**

| UI Label (SV) | Property Field | Linear API Fields | Fallback/Fix |
|---------------|----------------|-------------------|--------------|
| **Kiinteistötunnus** | `meta.propertyIdentifier` | `propertyIdentifier` | Requires API field, hide if empty ✅ |
| **Tomtstorlek** | `dimensions.plot` | `plotArea`, `lotArea`, `nonLocalizedValues.lotArea` | Show in ha if ≥ 10,000 m² |
| **Rakennusoikeus** | `meta.propertyBuildingRights` | `propertyBuildingRights` | Hide if empty ✅ |
| **Rasitteet** | `meta.restrictions` | `restrictions` | Hide if empty ✅ |
| **Kaavatilanne** | `meta.zoning` | `zoningStatus` | Hide if empty ✅ |

---

## 6️⃣ **HYRESOBJEKT (Rentals)**

| UI Label (SV) | Property Field | Linear API Fields | Fallback/Fix |
|---------------|----------------|-------------------|--------------|
| **Månadshyra** | `rental.monthlyRent` | `rent` | `parseEuro()` |
| **Deposition** | `rental.securityDeposit` | `securityDepositType` | Show text + amount |
| **Avtalstyp** | `rental.contractType` | `rentalContractType` | Hide if empty ✅ |
| **Tillträde** | `rental.availableFrom` | `availableFrom`, `freeOnText` | — |
| **Uppsägningstid** | `rental.earliestTermination` | `earliestTerminateDate` | — |
| **Vattenavgift** | `fees.water` | `waterCharge` | Fallback to `otherChargeDescription` |
| **Elavgift** | `fees.electricity` | `electricHeatingCharge`, `electricityContract` | Hide if empty ✅ |
| **Husdjur** | `rental.petsAllowed` | `petsAllowed` | `toBool()` |
| **Rökning** | `rental.smokingAllowed` | `smokingAllowed` | `toBool()` |

---

## 7️⃣ **DOKUMENT, BILDER & KARTA (Documents, Images & Map)**

| UI Label | Property Field | Linear API Fields | Notes |
|----------|----------------|-------------------|-------|
| **Bilder** | `media.images[]` | `images[]` | compressed → url |
| **Planritning** | `documents.floorPlan` | `floorPlanUrl`, `images.isFloorPlan` | First match |
| **Broschyr** | `documents.brochure` | `brochureUrl`, `internationalBrochureUrl` | — |
| **Video** | `documents.video` | `videoUrl` | — |
| **Virtuell visning** | `documents.virtualTour` | `virtualShowing` | — |
| **Energicertifikat** | `documents.energyCert` | `energyCertificateUrl` | — |
| **Koordinater** | `media.coordinates` | `mapCoordinates.fi.value` | Handle [lon, lat] array |

---

## 8️⃣ **MÄKLARE & VISNINGAR (Agent & Showings)**

| UI Label | Property Field | Linear API Fields | Notes |
|----------|----------------|-------------------|-------|
| **Mäklare namn** | `agent.name` | `agent.name`, `realtor.name` | Always show |
| **Telefon** | `agent.phone` | `agent.phone`, `realtor.tel` | — |
| **E-post** | `agent.email` | `agent.email`, `realtor.email` | — |
| **Titel** | `agent.title` | `agent.jobTitle` | — |
| **Foto** | `agent.photoUrl` | `agent.avatar`, `agent.photo.sourceUrl` | — |
| **Företag** | `agent.companyName` | `realtor.primaryCompany.name` | — |
| **Visningar** | `presentations[]` | `presentations[]` | Dates + times localized |

---

## 🧮 FORMATTING RULES

| Type | Rule |
|------|------|
| **Price / Cost** | `Intl.NumberFormat(locale, {style:'currency', currency:'EUR'})` |
| **Plot Size** | `≥ 10,000 m² → (area/10000).toFixed(2)+' ha'` |
| **Floor** | `floor + '/' + floorsTotal` if total exists |
| **Energy Class** | If missing → text "Ei lain edellyttämää energiatodistusta" |
| **Boolean** | Kyllä/Ja/Yes → true, Ei/Nej/No → false |
| **Date** | `Intl.DateTimeFormat(locale)` |
| **Hide-if-empty** | ✅ **All fields hide if null/0/empty** (B Strategy) |

---

## ⚠️ KNOWN ISSUES & FIXES

| Problem | Cause | Fix |
|---------|-------|-----|
| **Hiss showed wrong value** | Linear returned "Ei" as string | Use `toBool()` + locale check ✅ |
| **Company loans showed 0 €** | Wrong field name (kiinnitykset ↔ lainat) | Changed mapping in mapper ✅ |
| **Omistusmuoto / Hallintamuoto = null** | Missing in API | Hide if empty ✅ |
| **Energy missing** | null | `normalizeEnergyStatus()` → "Ei lain edellyttämää…" ✅ |
| **Ventilation** | null | Hide if empty ✅ |
| **API returns [lon, lat]** | Array format | Update `extractCoordinates()` ✅ |
| **Pets/Smoking null** | Empty boolean | Default false + hide ✅ |

---

## ✅ B STRATEGY IMPLEMENTATION STATUS

**✅ COMPLETED:** All fields now hide when empty instead of showing "Uppgift saknas"!

### **Files Updated:**
1. `src/components/Property/DetailView.tsx`
   - Building Info: Hide empty fields ✅
   - Company Info: Hide empty fields ✅
   - Ownership & Terms: Hide empty fields ✅

### **Before (A Strategy):**
```typescript
<Row label="Byggår" value={vm.yearBuilt} alwaysVisible />
// Shows: "Byggår: Uppgift saknas"
```

### **After (B Strategy):**
```typescript
{vm.yearBuilt && <Row label="Byggår" value={vm.yearBuilt} />}
// Shows nothing if empty!
```

---

## 🎯 SUMMARY

This blueprint ensures:

1. ✅ **100% consistent field mappings**
2. ✅ **No "Ej angivet" spam** (B Strategy implemented)
3. ✅ **All optional fields hide when empty**
4. ✅ **Proper localization** on 3 languages (fi/sv/en)
5. ✅ **Type-safe transformations**
6. ✅ **Clear documentation** for all developers

---

## 📚 RELATED FILES

| File | Purpose |
|------|---------|
| `src/lib/infrastructure/linear-api/mapper.ts` | Phase 1: API → Domain |
| `src/lib/infrastructure/linear-api/field-mappings.ts` | Mapping configuration |
| `src/lib/presentation/property.view-model.ts` | Phase 2: Domain → ViewModel |
| `src/components/Property/DetailView.tsx` | Phase 3: ViewModel → UI |
| `src/lib/domain/locale-utils.ts` | Localization helpers |
| `src/lib/presentation/formatters/` | UI formatting |

---

**Last Updated:** 2025-10-30  
**Status:** ✅ B Strategy Complete, C Strategy Documented  
**Next:** Improve data quality in Linear API (ongoing)


