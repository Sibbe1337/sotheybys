# PROBLEM PÅ LIVE-SIDAN - 2025-11-10

Live URL: https://next-front-puce.vercel.app/fi

## 🔴 KRITISKA BUGGAR (från live-sidan):

### 1. Mailatie 3 - Tomtyta 12,99 m² (ska vara 0,1299 ha)
```
Live:  185 m² / 215 m² | 12,99 m²
Fix:   185 / 215 | 0,1299 ha
```

**Problem:** 
- Linear har förmodligen 0.1299 i `plotArea` men utan enhet
- Vår kod tolkar det som m² istället för ha
- 0.1299 * 100 = 12.99 m² (helt fel!)

**Fix:**
- Kolla Linear raw data för Mailatie
- Säkerställ att `applyUnit()` hanterar små värden (<1) som hektar

---

### 2. Linnunpääntie 128 - Total yta saknas (265 m² | 3,2084 ha)
```
Live:  265 m² | 3,2084 ha
Fix:   265 / 290 | 320,84 ha
```

**Problem:**
- `dimensions.total` är undefined för detta objekt
- Linear har förmodligen "Total yta: 290 m²" men vi läser den inte

**Fix:**
- Verifiera mapping i `mapper.ts` rad 213-224
- Kanske Linear använder annat fältnamn för denna fastighet?

---

### 3. Mellstenintie 13 A - Tomtyta 3 994 m² (ska vara 0,3994 ha)
```
Live:  340 m² / 504 m² | 3 994 m²
Fix:   340 / 504 | 0,3994 ha
```

**Problem:**
- 3994 m² < 10000 så visas i m²
- Men Dennis vill att detta ska vara i ha (0,3994 ha)

**Möjlig lösning:**
- Ändra gräns från 10000 m² till 1000 m²?
- Eller alltid visa ha för fastigheter/villor?

---

### 4. Mustanlahdentie 4 A 11 - Total yta saknas
```
Live:  260 m² | 1 300 m²
Fix:   260 / 410 | 1 300 m²
```

**Problem:**
- `dimensions.total` är undefined
- Linear har "Total yta: 410 m²" men vi läser den inte

**Fix:**
- Samma som #2 - verifiera mapping

---

### 5. Helsingintie 99 - Suspekt liten tomtyta (12,17 m²)
```
Live:  115 m² | 12,17 m²
```

**Problem:**
- 12,17 m² är absurt litet för en omakotitalo
- Förmodligen samma problem som Mailatie (ha → m² conversion fel)

---

## 📊 ROOT CAUSE ANALYS:

### Problem A: Total yta saknas för fastigheter
**Affected:** Linnunpääntie, Mustanlahdentie

**Kod att kolla:**
```typescript
// mapper.ts rad 215-224
let total = parseNum(
  pickNV(nv, 'totalArea') ?? 
  lget(src.totalArea!, 'fi') ?? 
  lget((src as any).overallArea, 'fi')
);

if (!total && otherSpaces && otherSpaces > 0) {
  total = living + otherSpaces;
}
```

**Möjliga orsaker:**
1. Linear använder annat fältnamn (`kokonaisala`, `totalYta`, etc)
2. Fältet finns men är null/undefined
3. Vi läser fel språk (ska alltid läsa 'fi')

---

### Problem B: Tomtyta fel enhet (m² istället för ha)
**Affected:** Mailatie, Helsingintie, Mellstenintie

**Kod att kolla:**
```typescript
// FeaturedPropertyCard.tsx rad 94-102
const plot = (n?: number | null) => {
  if (typeof n !== 'number' || n <= 0) return '';
  if (n >= 10000) {
    const ha = (n / 10000).toFixed(4);
    return `${ha.replace('.', ',')} ha`;
  }
  return area(n);
};
```

**Problem:**
- Mailatie har `plotArea = 0.1299` i Linear (antagligen i ha)
- Vi behandlar det som m² → 0.1299 m² → visar "12,99 m²" (fel!)
- Vi måste detektera om värdet är < 100 → troligen i ha-enhet

**Fix:**
```typescript
const plot = (n?: number | null) => {
  if (typeof n !== 'number' || n <= 0) return '';
  
  // Dennis: Om värdet är mycket litet (<100), antagligen redan i ha
  if (n < 100) {
    const formatted = new Intl.NumberFormat(L, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(n);
    return `${formatted} ha`;
  }
  
  // Stort värde (>= 10000 m²) → konvertera till ha
  if (n >= 10000) {
    const ha = n / 10000;
    const formatted = new Intl.NumberFormat(L, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(ha);
    return `${formatted} ha`;
  }
  
  // Medelstort värde (100-9999) → visa i m²
  return area(n);
};
```

---

## 🚀 ACTION ITEMS:

1. **Fix tomtyta enhet-problem** (Mailatie, Helsingintie)
   - Lägg till logik: `if (n < 100) → redan i ha`
   - Testa med Mailatie (ska visa 0,1299 ha)

2. **Fix total yta saknas** (Linnunpääntie, Mustanlahdentie)
   - Kolla Linear raw data för dessa objekt
   - Lägg till alternativa fältnamn i mapper

3. **Beslut: Ha-gräns**
   - Ska vi alltid visa ha för fastigheter oavsett storlek?
   - Eller behåll 10000 m² gräns?

4. **Verifiera på live:**
   - Mailatie: 185 / 215 | 0,1299 ha ✓
   - Linnunpääntie: 265 / 290 | 320,84 ha ✓
   - Mellstenintie: 340 / 504 | 0,3994 ha ✓
   - Mustanlahdentie: 260 / 410 | 1 300 m² ✓

