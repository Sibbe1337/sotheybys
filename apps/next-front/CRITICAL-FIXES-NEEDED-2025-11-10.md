# KRITISKA FIXES - Baserat på Dennis Screenshots 2025-11-10

## 🔴 PROBLEM 1: Skuldandel -2465 € (BORDE VARA DOLT)

**Screenshot visar:**
```
Velkaosuus: -2465 €
```

**Ska vara:**
- Dolt (inte visas) om negativt eller 0
- Positivt värde om verkligt debt finns

**Status i kod:**
- Rad 112 i ApartmentSections.tsx har `Math.abs(debtFreePriceNum - salesPriceNum)`
- Men verkar inte fungera i deployed version

**Fix:**
```typescript
// Visa ENDAST om debtFreePrice > salesPrice (verklig skuld)
const debtPartNum = debtFreePriceNum && salesPriceNum && debtFreePriceNum > salesPriceNum 
  ? debtFreePriceNum - salesPriceNum 
  : undefined;
```

---

## 🔴 PROBLEM 2: €/m² syns fortfarande

**Screenshot visar:**
```
Velaton hinta: 880 000 €
               8 148 €/m²    ← DETTA SKA BORT
               
Myyntihinta:   877 535 €
               8 125 €/m²    ← DETTA SKA BORT
```

**Status i kod:**
- Ingen `sub=` i nuvarande kod (redan borttagen)
- Men screenshot visar att det fortfarande finns

**Fix:**
- Verifiera att INGEN `Field` komponent för priser har `sub=` prop
- Säkerställ deploy fungerar

---

## 🔴 PROBLEM 3: Vh (Velaton hinta) försvinner på svenska

**Screenshot visar:**
```
Velaton hinta: —          ← TOM på svenska
```

**Möjlig orsak:**
- Svenska översättning saknas i view-model
- `priceDebtFree` inte satt för svenska

**Fix:**
- Säkerställ att `vm.priceDebtFree` ALLTID sätts för apartments
- Lägg till fallback till finska om svenska saknas

---

## 🔴 PROBLEM 4: Total yta saknas för fastigheter

**Screenshot visar:**
```
Boarea:    260 m²
Total yta: 410 m²          ← FINNS i Linear data
```

**Men på objektskort syns:**
```
260 | 1 300 m²             ← 410 SAKNAS
```

**Ska vara:**
```
260 / 410 | 1 300 m²
```

**Fix:**
- `FeaturedPropertyCard.tsx` line 122-135: Säkerställ att `totalArea` inkluderas
- `formatPropertyArea()` funktion behöver läggas till

---

## 🔴 PROBLEM 5: För många bilder i carousel

**Screenshot visar:**
```
1 / 64                     ← ALLA bilder visas
1 / 50                     ← ALLA bilder visas
```

**Ska vara:**
```
1 / 3                      ← MAX 3 bilder
```

**Status i kod:**
- Rad 79 i FeaturedPropertyCard.tsx har `.slice(0, 3)`
- Men screenshot visar att det inte fungerar

**Fix:**
- Verifiera att slice(0, 3) används FÖRE carousel initialization
- Kanske problem med att `images` prop skickas in med alla bilder från parent

---

## 📝 ACTION PLAN:

1. ✅ Verifiera slice(0,3) i PropertyGridNew.tsx OCH FeaturedPropertyGrid.tsx
2. ✅ Fixa Vh försvinner på svenska (lpickWithFallback)
3. ✅ Fixa Total yta saknas på kort
4. ✅ Dubbelkolla att €/m² VERKLIGEN är borta
5. ✅ Dubbelkolla att skuldandel aldrig visas om negativt

---

## 🚀 DEPLOYMENT:

Efter fixes:
1. Commit med tydlig message
2. Push till main
3. Vänta på Vercel deploy (~2-3 min)
4. Dennis verifierar

