# 📋 DENNIS TODO LIST - IMPLEMENTATION CHECKLIST

**Based on WhatsApp Conversation (Oct 23-29, 2025)**  
**Current Status:** In Progress  
**Last Updated:** October 30, 2025

---

## 🎯 **PRIORITERAD LISTA**

### 🔴 **KRITISKA PUNKTER (Måste Fixas)**

#### 1. ✅ Objektkortens Layout - BILAGA 2 (DONE)
**Status:** ✅ Complete  
**Description:** Exakt kopia av den befintliga webbplatsens objektkort.

**Requirements:**
- ✅ Kantiga hörn (inte rundade)
- ✅ Exakt samma innehåll och layout som BILAGA 2
- ✅ Pris och €/m² format
- ✅ Objekttyp + huoneistoselitelmä
- ✅ Mäklarinfo + bild
- ✅ "Kontakta" länk/knapp
- ✅ Emoji-ikoner för features (🏠 🛏️ 📐)

**Files:**
- `src/components/Property/PropertyCardNew.tsx` ✅
- `src/components/Property/PropertyGridNew.tsx` ✅

---

#### 2. 🔴 6 Senaste Objekt - Carousel/Slider (TODO)
**Status:** ⚠️ **PARTIALLY DONE** - PropertyHeroCarousel exists but needs verification

**Dennis Feedback:**
> "sidan för objekten ser inte likadan ut som vår nuvarande (bilder på 6 senaste objekt i början av sidan saknas)"

**Requirements:**
- 📸 **6 senaste objekt i början** av `/kohteet` sidan
- 🎠 **Carousel/Slider format** (INTE grid med 6 separata kort)
- 🔄 Auto-play med navigation
- 👆 Swipe support på mobil

**Current Implementation:**
```typescript
// apps/next-front/src/app/[locale]/kohteet/page.tsx
<PropertyHeroCarousel 
  properties={latest6} 
  locale={locale}
/>
```

**Verification Needed:**
- [ ] Verify carousel displays correctly on `/kohteet`
- [ ] Verify auto-play works
- [ ] Verify navigation arrows work
- [ ] Verify mobile swipe works
- [ ] Match exact styling from old site

---

#### 3. 🔴 Objekttyp före Huoneistoselitelmä (TODO)
**Status:** ❌ **NOT DONE**

**Dennis Feedback:**
> "objekttypen saknas fortfarande före huoneistoselitelmän (ex ska det stå Höghus | 5h, kök, badrum..) Nu står det endast 5h, kök, badrum"

**Requirements:**
- Visa objekttyp (t.ex. "Höghus", "Rivitalo", "Kerrostalo")
- Separator: `|`
- Sedan huoneistoselitelmä (t.ex. "5h, kök, badrum")
- **Format:** `Höghus | 5h, kök, badrum`

**Example:**
```
Current:  5h, kök, badrum
Expected: Höghus | 5h, kök, badrum
```

**Files to Update:**
- `src/components/Property/PropertyCardNew.tsx`
- `src/lib/presentation/property.view-model.ts` (add apartmentSubType field)

**Implementation:**
```typescript
// PropertyCardNew.tsx
<p className="text-gray-600 text-sm">
  {property.meta.apartmentSubType && (
    <>{property.meta.apartmentSubType} | </>
  )}
  {property.meta.apartmentType}
</p>
```

---

#### 4. 🔴 Mäklarinformation + Bild (TODO)
**Status:** ⚠️ **PARTIALLY DONE** - Data exists but needs verification

**Dennis Feedback:**
> "mäklarinfon saknas" + "fixa mäklarens information så det synns + bild på mäklaren"

**Requirements:**
- Mäklarens namn
- Telefonnummer
- E-post
- **Bild på mäklaren** ← Key requirement
- Titel (t.ex. "Sales Assistant")

**Current State:**
- PropertyCardNew includes agent info
- Need to verify photo displays correctly

**Verification:**
- [ ] Agent photo displays in property card
- [ ] Agent photo displays on property detail page
- [ ] Photo has correct aspect ratio and styling
- [ ] Fallback if no photo available

---

#### 5. 🟡 Adress Komplett - "C 47" Problem (TODO)
**Status:** ❌ **NOT FIXED**

**Dennis Feedback:**
> "Märkte även att Heikkiläntie adressen är fel. Ska vara Heikkiläntie 1 C 47, 00210. Den är för tillfället endast Heikkiläntie 1, 00210 (C 47 fattas)"

**Requirements:**
- Visa fullständig adress inklusive lägenhetsbokstav/nummer
- Format: `Heikkiläntie 1 C 47, 00210`
- Kontrollera **alla adresser**

**Investigation Needed:**
- [ ] Check if "C 47" is in Linear API (field: `apartmentNumber`, `stairway`, or similar)
- [ ] Check if mapper extracts this field
- [ ] Update display logic to include apartment identifier

**Files:**
- `src/lib/infrastructure/linear-api/mapper.ts`
- `src/lib/domain/property.types.ts` (add `apartmentIdentifier` field?)

---

### 🟡 **VIKTIGA FUNKTIONER (Bör Fixas)**

#### 6. 🟡 Storleks- och Prisjusteringsfunktion (TODO)
**Status:** ❌ **NOT WORKING**

**Dennis Feedback:**
> "minimi pris och storleks filterfunktionen fungerar inte (går inte att justera)"

**Issue:**
Minimum värdet går inte att justera i filter UI.

**Files:**
- Property filter component (need to locate)
- Likely in `src/components/Property/` or `src/app/[locale]/kohteet/`

**Investigation:**
- [ ] Locate filter component
- [ ] Debug slider/input controls
- [ ] Fix minimum value adjustment
- [ ] Verify maximum value works too

---

#### 7. 🟡 Objektstyp Filtreringsfunktion (TODO)
**Status:** ❌ **INCLUDES RENTALS**

**Dennis Feedback:**
> "fixa objektstyp "kohdetyyppi" filtreringsfunktionen så att de innehåller alla de objekt som är till salu (TA BORT HYRESOBJEKT FRÅN DENNA LISTA)"

**Requirements:**
- Filter ska endast visa objekttyper för **till salu** objekt
- **INGEN** hyresobjekt i denna lista
- Rental properties har egen sida: `/kohteet/vuokrakohteet`

**Implementation:**
```typescript
// Filter logic
const saleProperties = allProperties.filter(p => !p.meta.rent || p.meta.rent === 0);
const uniqueTypes = [...new Set(saleProperties.map(p => p.meta.typeCode))];
```

---

#### 8. 🟡 Kartafunktion (TODO)
**Status:** ❌ **NOT WORKING**

**Dennis Feedback:**
> "Karta funktionen på objektsvyn fungerar inte BILAGA 4"

**Issue:**
Map view on `/kohteet` page is not functioning.

**Files:**
- `src/components/Property/PropertyMap.tsx`
- Need to verify Google Maps API key
- Check console for errors

**Investigation:**
- [ ] Verify Google Maps API key is set
- [ ] Check browser console for errors
- [ ] Test PropertyMap component
- [ ] Verify coordinates extraction from properties

---

#### 9. 🟡 Telefonlayout - Sticky Header (TODO)
**Status:** ❌ **TOO MUCH VISIBLE**

**Dennis Feedback:**
> "fixa telefonlayouten så att endast övre balken med vår logo + tre strecken för menyn syns då man scrollar ner. tallenna, vertaile, jaa och tulosta ska INTE synas då man scrollar ner då de täcker vyn"

**Requirements:**
- Vid scroll: **endast** logo + hamburger-meny synlig
- **INTE synligt:** "Tallenna", "Vertaile", "Jaa", "Tulosta" knappar
- Dessa knappar täcker för mycket av vyn på mobil

**Files:**
- `src/components/Header/Header.tsx`
- Mobile header component

**Implementation:**
```css
.mobile-header-scroll {
  /* Only show logo + hamburger on scroll */
  .action-buttons {
    display: none;
  }
}
```

---

### 🟢 **SPRÅK & ÖVERSÄTTNINGAR (Pågående)**

#### 10. 🟢 Språkhantering - Översättningar (MOSTLY DONE)
**Status:** ✅ **MOSTLY COMPLETE**

**Dennis Feedback:**
> "Kontrollera att hemsidans språk matchar all text på hemsidan. Märkte att ex. objektens beskrivande text och några andra fält inklusive värden inte var korrekt översatta"

**Requirements:**
- ✅ Alla etiketter på rätt språk (fi/sv/en)
- ✅ "Uppgift saknas" istället för auto-translate
- ✅ Beskrivande text på rätt språk
- ✅ Alla fältvärden översatta korrekt

**Completed:**
- ✅ `lpickStrict` implementation
- ✅ Localized property types
- ✅ "Ej angivet" / "Ei ilmoitettu" / "Not specified" placeholders
- ✅ AutoTranslateBanner for non-Finnish descriptions

**Remaining:**
- [ ] Verify ALL object types (apartments, properties, rentals)
- [ ] Double-check all field labels and values

---

### 🟢 **VEDERLAG & KOSTNADER (Done)**

#### 11. ✅ Vederlag Display Rules (DONE)
**Status:** ✅ **COMPLETE**

**Dennis Feedback:**
> "Ingen av objekten nu på din sida har något annat vederlag än endast skötselvederlag (Hoitovastike). Men ifall det finns av de andra vederlagen ska de även skillt synas, och ytterligare isf det Totala vederlaget"

**Requirements:**
- ✅ Visa varje vederlag separat om det finns
- ✅ Visa totala månadsvederlaget om flera vederlag finns
- ✅ Hide-if-empty regel för alla rader
- ✅ Format: "€/mån" och "€/m²"

**Implemented in:**
- `src/components/Property/DetailView.tsx`
- `src/lib/presentation/property.view-model.ts`

---

### 🟢 **DATA KVALITET (Ongoing)**

#### 12. 🟢 "Uppgift saknas" Problem (66.2% COMPLETE)
**Status:** 🟡 **IN PROGRESS**

**Dennis Feedback:**
(Implicit från screenshots som visar många "Uppgift saknas" fält)

**Current Status:**
- ✅ Mapper extracts all available data correctly
- ✅ Schema validates against correct fields
- ✅ 66.2% data quality score
- ⏳ **33.8% missing data needs manual entry in Linear**

**Action Required:**
- Fill missing data in Linear Admin (see `DATA-QUALITY-ACTION-PLAN.md`)
- Fields most commonly missing:
  - `housingTenure` (7/8 properties)
  - `fundingCharge` (6/8 properties)
  - `housingCooperativeMortgage` (5/8 properties)
  - `energyClass` (4/8 properties)
  - `hasBalcony` (4/8 properties)

---

## 📊 **PROGRESS SUMMARY**

| Category | Status | Count | Completion |
|----------|--------|-------|------------|
| 🔴 Kritiska | In Progress | 5 items | 20% |
| 🟡 Viktiga | Not Started | 4 items | 0% |
| 🟢 Språk | Complete | 1 item | 100% |
| 🟢 Vederlag | Complete | 1 item | 100% |
| 🟢 Data | In Progress | 1 item | 66% |
| **TOTAL** | **In Progress** | **12 items** | **~50%** |

---

## 🎯 **PRIORITERAT ARBETFLÖDE**

### Sprint 1: Kritiska UI-fixar (Est: 3-4 hours)
1. ✅ Objektkortens layout (DONE)
2. 🔴 Objekttyp före huoneistoselitelmä (30 min)
3. 🔴 Mäklarinfo + bild verification (30 min)
4. 🔴 Adress "C 47" fix (1 hour)
5. 🔴 Carousel verification (1 hour)

### Sprint 2: Funktioner (Est: 3-4 hours)
6. 🟡 Filter: Storleks/pris justering (1 hour)
7. 🟡 Filter: Ta bort hyresobjekt (30 min)
8. 🟡 Kartafunktion fix (1-2 hours)
9. 🟡 Telefonlayout sticky header (1 hour)

### Sprint 3: Data Kvalitet (Est: 1 hour + Dennis time)
10. 🟢 Översättningar final verification (30 min)
11. 🟢 Fill missing Linear data (60 min - Dennis)

**Total Est:** 7-9 hours development + 1 hour Dennis

---

## 📝 **NOTES & CLARIFICATIONS**

### From Dennis Chat:
- "gör det gärna 1:1" - Make exact copies, don't improvise
- "dessa alla fält som behövs för lägenheter" - He sent detailed field requirements (see BILAGA)
- "kan du vänligen granska dessa lite noggrannare" - Careful review needed

### Key Design Principles:
1. **Exact Match:** Copy existing site design exactly
2. **Hide-if-empty:** Don't show empty fields
3. **Language Consistency:** All UI in correct language
4. **No Auto-translate:** Show placeholders instead

---

## 🔗 **RELATED FILES**

- `FIELD-MAPPING-BLUEPRINT.md` - Field mapping documentation
- `DATA-QUALITY-ACTION-PLAN.md` - Data entry checklist
- `LINEAR-API-FIELD-INVESTIGATION.md` - Field availability report
- `DENNIS-FEEDBACK-TRACKER.md` - Feedback tracking (old)

---

**Next Review:** After Sprint 1 completion  
**Expected Completion:** November 1, 2025

