# Google Maps API Key Setup - Completed ✅

## 📋 Vad som gjordes

### 1. Projekt skapat
```bash
Project ID: snellman-sothebys
Project Name: Snellman Sothebys
Project Number: 198451477929
```

### 2. APIs aktiverade
- ✅ Maps JavaScript API (`maps-backend.googleapis.com`)
- ✅ Places API (`places-backend.googleapis.com`)

### 3. API Key skapad
```
Display Name: Snellman Sothebys Maps
Key ID: 79274c36-62fd-4850-9646-dfaa24755b7f
API Key: AIzaSyCY3ot-av1UVcMjpBgtBrwZMiH7KlM3HHs
```

### 4. Säkerhetsrestriktioner
**Browser Restrictions (HTTP Referrers):**
- `localhost:*` - För lokal utveckling
- `*.snellmansothebys.fi/*` - För produktion
- `*.sothebysrealty.fi/*` - För produktion

**API Restrictions:**
- Endast Maps JavaScript API
- Endast Places API

### 5. Environment Variable
Lagt till i `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCY3ot-av1UVcMjpBgtBrwZMiH7KlM3HHs
```

## 🚀 Nästa steg

### Starta om utvecklingsservern
```bash
cd /Users/emilsoujeh/sothebys/apps/next-front
npm run dev
```

### Testa kartvy
1. Gå till http://localhost:3001/kohteet (eller /properties)
2. Klicka på **Map-knappen** (📍) längst ner till höger
3. Du bör se en Google Maps-karta med fastigheter!

## ⚠️ Billing Note

Projektet har inte billing aktiverat ännu (quota limit nådd). Detta påverkar INTE utveckling eller testning, men kan behövas för produktion om du överskrider gratistjänsten:

**Google Maps gratis tier:**
- $200 gratis krediter per månad
- ~28,000 map loads gratis per månad
- Efter det: $7 per 1000 map loads

**För att aktivera billing senare:**
1. Gå till [Google Cloud Console](https://console.cloud.google.com/billing)
2. Skapa ett nytt billing account eller öka kvoten
3. Länka projektet `snellman-sothebys` till billing account

## 🔒 Säkerhet

✅ API-nyckeln är begränsad till:
- Endast dina domäner (localhost, snellmansothebys.fi, sothebysrealty.fi)
- Endast Maps och Places APIs
- Ingen annan kan använda din nyckel

## 📊 Övervaka användning

Kolla användning i [Google Cloud Console](https://console.cloud.google.com/):
1. Välj projekt: `snellman-sothebys`
2. Gå till "APIs & Services" → "Dashboard"
3. Se requests och kostnader

## 🔧 Hantera API Key

**Lista alla nycklar:**
```bash
gcloud alpha services api-keys list --project=snellman-sothebys
```

**Uppdatera restrictions:**
```bash
gcloud alpha services api-keys update 79274c36-62fd-4850-9646-dfaa24755b7f \
  --allowed-referrers="localhost:*,*.snellmansothebys.fi/*"
```

**Ta bort nyckel:**
```bash
gcloud alpha services api-keys delete 79274c36-62fd-4850-9646-dfaa24755b7f
```

## 📚 Dokumentation

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)

