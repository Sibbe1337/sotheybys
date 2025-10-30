# 🚨 EMERGENCY FIX - Bildcache Problem

## Problem
Alla objekt visar samma bilder (Bernhardinkatu) trots fixes.

## Troliga orsaker

### 1. Browser Cache (MEST TROLIGT)
Browsern cachar gamla bilder baserat på URL.

**LÖSNING:**
```bash
# Hårdrefresh i Chrome:
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows)

# Eller rensa cache:
Chrome DevTools → Network → Disable cache (checkbox)
```

### 2. Vercel Image Cache
Vercel cachar optimerade bilder.

**LÖSNING:**
```bash
# Rensa Vercel image cache:
vercel --prod --force --yes
```

### 3. Linear API returnerar samma data
API:et kan ha fel data.

**TEST:**
```bash
# Kolla om API returnerar olika bilder:
curl -H "Authorization: LINEAR-API-KEY $LINEAR_API_KEY" \
     -H "x-company-id: $LINEAR_COMPANY_ID" \
     "https://api.linear.fi/api/v1/listings?languages[]=fi" | \
     jq '.[] | {address: .address.fi.value, firstImage: .images[0].url}' | head -20
```

### 4. Image Key inte unik nog
Vår key kanske inte tvingar React att re-rendera.

**TEST I KODEN:**
```typescript
// ImageCarousel.tsx - lägg till timestamp i key
const imageKey = `${propertyId}-${currentIndex}-${Date.now()}`;
```

## Snabb Test
Öppna Chrome DevTools Console och kör:
```javascript
// Se vilka bilder som laddas
document.querySelectorAll('img').forEach(img => {
  console.log(img.alt, ':', img.src.substring(0, 60));
});
```

## Om INGET funkar
Det finns en kärnbugg i image-mappningen. Kör då:
```bash
npm run dev
# Öppna http://localhost:3000/sv/kohde/heikkilantie-1-c-47
# Öppna Console
# Kolla loggen från ImageCarousel useEffect
```

