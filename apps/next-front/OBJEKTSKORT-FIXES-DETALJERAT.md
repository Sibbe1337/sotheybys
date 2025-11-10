# OBJEKTSKORT & DETALJSIDA - FÖRBÄTTRINGAR

## Status från Dennis (2025-11-10)

### ✅ Fixat:
- ✅ Vattenkostnaden ser bra ut
- ✅ €/m² borttaget från försäljningspriserna

### ❌ Kvarstående problem:

---

## 1. OBJEKTSKORT - BILDKARUSELL

### Problem 1A: Dots/Bollar syns på bilderna
**Nuvarande beteende:**
- De inringade bollarna (carousel dots) syns nere på bilderna

**Önskat beteende:**
- Bollarna ska INTE synas på bilderna
- Ta bort dots helt från objektskorten

**Filer att ändra:**
- `apps/next-front/src/components/Property/FeaturedPropertyCard.tsx`
- Ta bort hela dots-sektionen från carousel

### Problem 1B: För många bilder i karusellen
**Nuvarande beteende:**
- Alla bilder för objektet visas när man bläddrar

**Önskat beteende:**
- Endast de 3 första bilderna ska visas i karusellen
- Detta gäller både "Hem" och "Objekt" flikar

**Filer att ändra:**
- `apps/next-front/src/components/Property/FeaturedPropertyCard.tsx`
- `apps/next-front/src/components/Property/FeaturedPropertyGrid.tsx`
- `apps/next-front/src/components/Property/PropertyGridNew.tsx`

**Implementation:**
```typescript
// Begränsa till 3 första bilderna
const displayImages = (images && images.length > 0 ? images : (image ? [image] : [])).slice(0, 3);
```

---

## 2. OBJEKTSKORT - AREA DISPLAY FÖR FASTIGHETER

### Problem 2A: Total yta saknas
**Nuvarande beteende:**
- Total yta visas inte efter boarea för vissa fastigheter

**Önskat beteende:**
- För fastigheter: "Boarea / Total yta | Tomtyta"
- Exempel: Linnunpääntie ska visa **"265 / 290 | 320,84 ha"**
  - Boarea: 265 m²
  - Total yta: 290 m²
  - Tomtyta: 320,84 ha

**Filer att ändra:**
- `apps/next-front/src/lib/presentation/formatters/area.ts` - `formatPropertyArea()`
- `apps/next-front/src/components/Property/FeaturedPropertyCard.tsx`

### Problem 2B: Tomtyta visar fel enhet
**Nuvarande beteende:**
- Mailatie visar "12,99 m²" på objektskort

**Önskat beteende:**
- Mailatie ska visa "0,1299 ha" (eller "1 299 m²")
- Stora tomter (>10 000 m²) ska visas i hektar (ha)

**Filer att ändra:**
- `apps/next-front/src/lib/presentation/formatters/area.ts` - `fmtPlot()`

---

## 3. OBJEKTSKORT - LAYOUT KONSISTENS

### Problem 3A: Olika layout mellan "Hem" och "Objekt"
**Nuvarande beteende:**
- Objektskorten ser olika ut på "Hem" fliken och "Objekt" fliken

**Önskat beteende:**
- Samma `FeaturedPropertyCard` layout på båda flikar
- Objekt-fliken: När objekt visas en efter en (list view) ska layouten matcha nuvarande hemsida

**Önskad struktur på varje kort:**
1. **Bildkarusell** (3 första bilderna, inga dots)
2. **Objektstyp** (Fastighet / Lägenhet / etc.)
3. **Presentationstextens rubrik** (titel från Linear)
4. **Adress** (Gata + trappan) | Stad | Boarea | Pris
   - För lägenheter: Skuldfritt pris (Vh)
   - För fastigheter: Försäljningspris (Mh)
5. **Lägenhetsbeskrivning** (kort beskrivning)
6. **Mäklarinfo** (foto, namn, telefon) + "Ota yhteyttä" knapp
7. **"Katso kohde" knapp** (full bredd)

**Filer att kontrollera:**
- `apps/next-front/src/components/Property/FeaturedPropertyCard.tsx`
- `apps/next-front/src/components/Property/PropertyGridNew.tsx`

---

## 4. FILTER FUNKTIONEN

### Problem: Visar inte alla objekt
**Nuvarande beteende:**
- Filter visar t.ex. "14 objekt till salu varav 7 lägenheter och 3 egnahemshus"
- Men antal matchar inte rätt

**Önskat beteende:**
- Filter ska visa ALLA objekt som har status ON_SALE (ACTIVE eller RESERVED)
- Rätt antal per objektstyp

**Filer att undersöka:**
- `apps/next-front/src/app/[locale]/properties/page.tsx`
- Backend filter logic för objektstyp

---

## 5. MEDIATABS KNAPPAR FUNGERAR INTE

### Problem 5A: "Objekt på kartan" fungerar inte
**Nuvarande beteende:**
- Knappen är klickbar men inget händer

**Möjliga orsaker:**
1. Koordinater saknas i datan från Linear
2. Map-komponenten laddas inte korrekt
3. Tab-switching logik fungerar inte

**Filer att undersöka:**
- `apps/next-front/src/components/Property/MediaTabs.tsx`
- Kontrollera `coordinates` prop och `tab.enabled` logik
- Kontrollera Map-komponenten

### Problem 5B: "Bläddra broschyren" fungerar inte
**Nuvarande beteende:**
- Knappen är klickbar men inget händer

**Möjliga orsaker:**
1. Broschyr URL saknas i datan från Linear
2. Brochure viewer fungerar inte

**Filer att undersöka:**
- `apps/next-front/src/components/Property/MediaTabs.tsx`
- Kontrollera `brochureUrl` prop och `tab.enabled` logik

### Problem 5C: Video visar konstigt format
**Nuvarande beteende:**
- När man klickar på "Katso video" visas videon i fel format

**Önskat beteende:**
- Video ska visas i rätt aspect ratio (16:9)
- Embedded YouTube/Vimeo player ska fungera korrekt

**Filer att fixa:**
- `apps/next-front/src/components/Property/MediaTabs.tsx`
- Lägg till `aspect-[16/9]` wrapper för video iframe

---

## 6. PRESENTATIONSTEXTER - SPRÅKPROBLEM

### Problem: Texter går inte hand i hand med sidans språk
**Nuvarande beteende:**
- Ibland syns alla tre språks presentationstexter samtidigt
- Ibland syns bara finska versionen vid språkbyte

**Önskat beteende:**
- Endast rätt språks presentationstext ska visas
- Om översättning saknas, visa finska som fallback

**Filer att undersöka:**
- `apps/next-front/src/components/Property/DetailView.tsx`
- `apps/next-front/src/lib/infrastructure/linear-api/mapper.ts`
- Kontrollera hur `description` hanteras per språk

---

## 7. BOENDEKOSTNADER & BALKONG - SPRÅKPROBLEM

### Problem 7A: Boendekostnader försvinner
**Status:**
- Rapporterat fixat men Dennis säger det fortfarande är problem

**Filer att dubbelkolla:**
- `apps/next-front/src/components/Property/sections/ApartmentSections.tsx`
- Kontrollera att `fmtFee` används med rätt locale

### Problem 7B: Balkong försvinner på engelska
**Nuvarande beteende:**
- Balkong-fältet försvinner för lägenheter när man byter till engelska

**Filer att fixa:**
- `apps/next-front/src/components/Property/sections/ApartmentSections.tsx`
- `apps/next-front/src/lib/infrastructure/linear-api/mapper.ts`
- Lägg till engelsk fallback för balkongfält

---

## 8. KARTFUNKTIONEN PÅ OBJEKTSIDAN

### Problem: Karta fungerar inte på "Alla objekt" sidan
**Nuvarande beteende:**
- Map view knappen finns men visar inga objekt

**Önskat beteende:**
- Karta ska visa alla objekt med koordinater
- Klick på marker öppnar objektet

**Filer att undersöka:**
- `apps/next-front/src/app/[locale]/properties/page.tsx`
- Map component implementation

---

## 9. TELEFONVY - MOBIL OPTIMERING

### Problem 9A: Övre balken (TopBar)
**Nuvarande beteende:**
- "For Sale >> Adress .... Contact us" är inte optimerad för mobil i upprätt läge

**Önskat beteende:**
- Allt ska synas tydligt på skärmen
- Samma stil som nuvarande hemsida

**Filer att fixa:**
- `apps/next-front/src/components/Property/TopBar.tsx`
- Bättre text truncation och padding

### Problem 9B: Medieknappar layout
**Nuvarande beteende:**
- Knappar syns inte alla på mobil

**Önskat beteende:**
- 3 knappar på översta raden, 2 under (eller liknande)
- Alla knappar ska vara synliga utan scroll

**Filer att fixa:**
- `apps/next-front/src/components/Property/MediaTabs.tsx`
- Justera grid layout för mobil

### Problem 9C: Filter-sektion på objekt-sidan
**Nuvarande beteende:**
- Tar för mycket plats vertikalt

**Önskat beteende:**
- Mer koncis layout, filterfunktioner bredvid varandra
- "Hae kohteita" / "Sök objekt" rubrik SKA vara FÖRE filterfunktionerna

**Filer att fixa:**
- `apps/next-front/src/app/[locale]/properties/page.tsx`
- Filter component layout

### Problem 9D: Adressruta på hero
**Nuvarande beteende:**
- Adress och nummer på samma rad

**Önskat beteende:**
- Adressens nummer ska vara på första raden
- Exempel för Mustanlahdentie:
  ```
  Mustanlahdentie 4 A 11
  02780 Espoo
  ```

**Filer att fixa:**
- `apps/next-front/src/components/Property/HeroAddressBadge.tsx`
- Splitta adress på två rader

---

## 10. ÖVERSÄTTNINGAR - GENERELLT

### Problem: Fält försvinner vid språkbyte
**Exempel:**
- Hiss
- Vederlag
- Balkong

**Önskat beteende:**
- Alla fält ska hållas synliga på alla språk
- Om översättning saknas, visa finska som fallback

**Filer att fixa:**
- `apps/next-front/src/lib/infrastructure/linear-api/mapper.ts`
- Lägg till `lpickWithFallback` för alla relevanta fält
- Använd 'fi' som fallback för alla språk

---

## 11. FASTIGHET FÄLT - BOSTADSYTA & TOTALYTA

### Problem: Helsingintie 99 saknar Total yta
**Önskat beteende:**
- Både Bostadsyta/Boarea OCH Totalyta ska synas för fastigheter i informationsboxen

**Filer att kontrollera:**
- `apps/next-front/src/components/Property/SummaryStats.tsx`
- `apps/next-front/src/components/Property/sections/PropertySections.tsx`
- `apps/next-front/src/lib/infrastructure/linear-api/mapper.ts`

---

## 12. SKULDANDEL - NEGATIVT VÄRDE

### Problem: Fortfarande negativt
**Nuvarande beteende:**
- Skuldandel visar negativt värde för vissa lägenheter

**Önskat beteende:**
- Skuldandel ska ALLTID vara positivt (eller 0)
- Använd `Math.abs()` för att garantera positivt värde

**Filer att dubbelkolla:**
- `apps/next-front/src/components/Property/sections/ApartmentSections.tsx`
- Raderna med `debtPartNum`

---

## PRIORITET

### KRITISKA (Måste fixas först):
1. ❗ Objektskort dots - ta bort
2. ❗ Objektskort 3 bilder limit
3. ❗ Area display för fastigheter (Boarea / Total yta | Tomtyta)
4. ❗ MediaTabs knappar fungerar inte
5. ❗ Skuldandel negativt värde

### VIKTIGA:
6. Presentationstexter språkproblem
7. Tomtyta enhet (ha vs m²)
8. Boendekostnader & Balkong språkproblem
9. Filter funktionen
10. Objektskort layout konsistens

### FÖRBÄTTRINGAR:
11. Telefonvy optimering
12. Kartfunktionen
13. Översättningar generellt
14. Adressruta hero layout

---

## NEXT STEPS

1. Fixa bildkarusellen (dots + 3 bilder limit)
2. Fixa area display för fastigheter
3. Undersök MediaTabs knappar (koordinater, brochure, video)
4. Fixa skuldandel Math.abs()
5. Undersök språkproblem för presentationstexter
6. Mobil optimering

