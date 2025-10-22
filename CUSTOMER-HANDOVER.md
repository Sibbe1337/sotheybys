# 🏠 Snellman Sotheby's International Realty - Customer Handover Documentation

**Datum:** 22 Oktober 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready

---

## 📋 Innehållsförteckning

1. [Översikt](#översikt)
2. [Vad Som Är Klart](#vad-som-är-klart)
3. [Teknisk Arkitektur](#teknisk-arkitektur)
4. [Deployment & Hosting](#deployment--hosting)
5. [Innehållshantering (CMS)](#innehållshantering-cms)
6. [SEO & Prestanda](#seo--prestanda)
7. [Underhåll & Support](#underhåll--support)
8. [Kända Begränsningar](#kända-begränsningar)
9. [Kontaktinformation](#kontaktinformation)

---

## 🎯 Översikt

Snellman Sotheby's International Realty webbplats är en modern, flerspråkig fastighetsportal byggd med Next.js 14, integrerad med Linear.fi API för fastighetsdata och Sanity CMS för innehållshantering.

### **Live URLs:**
- **Production:** https://next-front-puce.vercel.app
- **Sanity Studio (CMS):** http://localhost:3333 (kör lokalt med `npm run dev`)

### **Språk:**
- 🇫🇮 Finska (fi) - Primärt språk
- 🇸🇪 Svenska (sv)
- 🇬🇧 Engelska (en)

---

## ✅ Vad Som Är Klart

### **1. Hemsida (Homepage)**
- ✅ Hero-sektion med företagsinformation
- ✅ Utvalda fastigheter (Featured Properties)
- ✅ Automatisk synkronisering med Linear API
- ✅ Responsiv design (mobil, tablet, desktop)
- ✅ Flerspråkig (fi/sv/en)

### **2. Fastighetssidor (Property Listings)**

#### **Försäljning (Till Salu):**
- ✅ `/kohteet` (Finska)
- ✅ `/sv/objekt` (Svenska)
- ✅ `/en/properties` (Engelska)

#### **Uthyrning (Hyresobjekt):**
- ✅ `/kohteet/vuokrakohteet` (Finska)
- ✅ `/sv/objekt/hyresobjekt` (Svenska)
- ✅ `/en/properties/rentals` (Engelska)

#### **Referenser (Sålda Objekt):**
- ✅ `/kohteet/referenssit` (Finska)
- ✅ `/sv/objekt/referenser` (Svenska)
- ✅ `/en/properties/references` (Engelska)

### **3. Fastighetsdetaljer (Property Detail Pages)**

#### **Funktioner:**
- ✅ Bildgalleri med thumbnails och fullskärmsvy
- ✅ Fastighetsinformation (pris, storlek, rum, etc.)
- ✅ Välkomsttext med fastighetens rubrik
- ✅ Fullständig beskrivning
- ✅ Prisuppgifter (försäljning eller hyra)
- ✅ Underhållsavgifter och andra kostnader
- ✅ Planlösning (om tillgänglig)
- ✅ Karta med fastighetens läge
- ✅ PDF-broschyr (om tillgänglig)
- ✅ Mäklarinformation med foto och kontaktuppgifter
- ✅ Schema.org strukturerad data för SEO

#### **Fastighetstyper:**
- ✅ Lägenheter (Osake/Aktielägenhet)
- ✅ Fastigheter (Kiinteistö/Egendom)
- ✅ Hyresobjekt (Vuokrakohteet/Hyresobjekt)

#### **Location-fält (NYTT - 22 Okt 2025):**
- ✅ **`districtFree`** - Visar korrekt stadsdel (t.ex. "Lauttasaari/Drumsö")
- ✅ **`address`** - Gatuadress (t.ex. "Heikkiläntie 1")
- ✅ **`freeTextTitle`** - Välkomsttext rubrik
- ✅ **`district`, `partOfCity`, `region`** - Tillgängliga när API tillhandahåller data

### **4. Företagssidor**

#### **Om Företaget:**
- ✅ `/yritys` (Finska)
- ✅ `/sv/om-oss` (Svenska)
- ✅ `/en/about` (Engelska)

#### **Personal (Staff):**
- ✅ `/henkilosto` (Finska)
- ✅ `/sv/personal` (Svenska)
- ✅ `/en/staff` (Engelska)
- ✅ Alla mäklare med foto och kontaktuppgifter
- ✅ **OBS:** Niclas Sergelius har tagits bort från alla sidor

#### **Kontakt:**
- ✅ `/yhteystiedot` (Finska)
- ✅ `/sv/kontakt` (Svenska)
- ✅ `/en/contact` (Engelska)

#### **Internationellt:**
- ✅ `/kansainvalisesti` (Finska)
- ✅ `/sv/internationellt` (Svenska)
- ✅ `/en/internationally` (Engelska)

#### **Sälja Med Oss:**
- ✅ `/myymassa` (Finska)
- ✅ `/sv/salj-med-oss` (Svenska)
- ✅ `/en/sell-with-us` (Engelska)
- ✅ Video-sektion
- ✅ Social sharing
- ✅ Kontaktkort
- ✅ Teamfoto

#### **Köpuppdrag (Purchase Assignments):**
- ✅ `/kohteet/ostotoimeksiannot` (Finska)
- ✅ `/sv/objekt/kopuppdrag` (Svenska)
- ✅ `/en/properties/purchase-assignments` (Engelska)

### **5. Navigation & Header**
- ✅ Responsiv navigation (desktop + mobil)
- ✅ Flerspråkig meny
- ✅ Språkväljare (fi/sv/en)
- ✅ Sökfunktion
- ✅ Dropdown-menyer för objekttyper
- ✅ Adobe Typekit-fonter (Freight Display, Freight Text, Freight Sans)
- ✅ Sotheby's branding (färger och logo)

### **6. Footer**
- ✅ Kontaktinformation (adress, telefon, email)
- ✅ Sociala medier-länkar
- ✅ Teamfoto
- ✅ Copyright-information

### **7. SEO & Prestanda**
- ✅ Dynamiska meta-taggar per sida
- ✅ Open Graph & Twitter Cards
- ✅ Sitemap.xml (automatiskt genererad)
- ✅ Robots.txt
- ✅ Schema.org JSON-LD för fastigheter
- ✅ Hreflang-taggar för flerspråkighet
- ✅ Beskrivande alt-texter på bilder
- ✅ Next.js Image-optimering
- ✅ Server-side rendering (SSR)

---

## 🏗️ Teknisk Arkitektur

### **Frontend:**
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Språk:** TypeScript
- **Deployment:** Vercel

### **Backend & Data:**
- **Fastighetsdata:** Linear.fi External API
  - Endpoint: `https://linear-external-api.azurewebsites.net`
  - Autentisering: API Key + Company ID
- **CMS:** Sanity.io
  - Project ID: `uy5hhchg`
  - Dataset: `production`

### **API Routes:**
- `/api/homepage` - Hämtar featured properties för hemsidan
- `/api/property/[slug]` - Hämtar fastighetsdetal jer
- `/api/proxy/listings` - Proxy för Linear API (undviker CORS)

### **Dataflöde:**
```
Linear API → Next.js API Routes → Data Transformation → Frontend Components
                                          ↓
                                    Sanity CMS (för statiskt innehåll)
```

---

## 🚀 Deployment & Hosting

### **Vercel (Production):**
1. **Automatisk Deployment:**
   - Varje push till `main` branch deployas automatiskt
   - Build-tid: ~2-3 minuter
   - URL: https://next-front-puce.vercel.app

2. **Environment Variables (Vercel):**
   ```
   LINEAR_EXTERNAL_BASE=https://linear-external-api.azurewebsites.net
   COMPANY_ID=[Din Company ID]
   LINEAR_API_KEY=[Din API Key]
   NEXT_PUBLIC_APP_URL=https://next-front-puce.vercel.app
   ```

3. **Deployment-kommandon:**
   ```bash
   # Lokalt
   cd /Users/emilsoujeh/sothebys
   git add -A
   git commit -m "Your message"
   git push origin main
   
   # Vercel deployas automatiskt
   ```

### **Lokalt (Development):**
```bash
cd /Users/emilsoujeh/sothebys/apps/next-front
npm install
npm run dev
# Öppna http://localhost:3000
```

---

## 📝 Innehållshantering (CMS)

### **Sanity Studio:**

#### **Starta Lokalt:**
```bash
cd /Users/emilsoujeh/sothebys/apps/studio
npm install
npm run dev
# Öppna http://localhost:3333
```

#### **Vad Kan Redigeras:**
- ✅ Featured Listings (utvalda fastigheter på hemsidan)
- ✅ Statiska sidor (om företaget, kontakt, etc.)
- ✅ Global inställningar

#### **Deployment:**
Sanity Studio kan deployas till Sanity's hosting:
```bash
cd /Users/emilsoujeh/sothebys/apps/studio
npm run deploy
```

---

## 🔍 SEO & Prestanda

### **SEO-funktioner:**
1. **Dynamiska Meta-taggar:**
   - Varje fastighetssida har unik title och description
   - Open Graph-bilder för social sharing
   - Twitter Cards

2. **Sitemap:**
   - Automatiskt genererad: `/sitemap.xml`
   - Inkluderar alla fastigheter och statiska sidor
   - Uppdateras automatiskt vid nya fastigheter

3. **Robots.txt:**
   - Tillåter alla sökmotorer
   - Länk till sitemap

4. **Schema.org:**
   - RealEstateListing strukturerad data
   - Ger rich snippets i Google

5. **Hreflang:**
   - Korrekt språkmarkering för fi/sv/en
   - Hjälper Google visa rätt språkversion

### **Prestanda:**
- ✅ Server-side rendering (SSR)
- ✅ Image-optimering (Next.js Image)
- ✅ Code splitting
- ✅ Lazy loading av bilder
- ✅ Caching av API-anrop

---

## 🛠️ Underhåll & Support

### **Regelbundet Underhåll:**

#### **1. Uppdatera Dependencies:**
```bash
cd /Users/emilsoujeh/sothebys/apps/next-front
npm update
npm audit fix
```

#### **2. Kontrollera Linear API:**
- Verifiera att API-nyckeln är giltig
- Testa endpoints: `/api/proxy/listings`

#### **3. Backup:**
- GitHub repository: https://github.com/Sibbe1337/sotheybys.git
- Sanity dataset kan exporteras via Sanity Dashboard

### **Felsökning:**

#### **Problem: Fastigheter visas inte**
1. Kontrollera Linear API-anslutning:
   ```bash
   curl -s "https://next-front-puce.vercel.app/api/proxy/listings" | jq '.[0].address'
   ```
2. Verifiera environment variables i Vercel
3. Kolla Vercel deployment logs

#### **Problem: Bilder laddas inte**
1. Kontrollera att bilderna finns i Linear API
2. Verifiera Next.js Image-konfiguration
3. Kolla browser console för fel

#### **Problem: SEO-problem**
1. Testa med Google Search Console
2. Verifiera sitemap: `/sitemap.xml`
3. Kontrollera robots.txt: `/robots.txt`

---

## ⚠️ Kända Begränsningar

### **1. Linear API-begränsningar:**
- ❌ `/v2/property/{id}` endpoint **saknar** location-fält (`districtFree`, `district`, `partOfCity`)
- ✅ **Lösning:** Vi använder `/v2/listings` endpoint istället (innehåller alla fält)

### **2. Fält Som Kan Vara Tomma:**
- `estateType` - Fastighetstyp (null i API för närvarande)
- `propertyType` - Fastighetstyp (null i API för närvarande)
- `freeTextTitle` - Välkomsttext rubrik (finns inte för alla fastigheter)

### **3. Bildformat:**
- Linear API returnerar bilder i olika format
- Vissa äldre fastigheter kan ha lägre bildkvalitet

---

## 📞 Kontaktinformation

### **Utvecklare:**
- **Namn:** [Din Namn]
- **Email:** [Din Email]
- **GitHub:** https://github.com/Sibbe1337/sotheybys

### **Teknisk Support:**
- **Vercel:** https://vercel.com/support
- **Sanity:** https://www.sanity.io/help
- **Linear.fi:** [Deras support-kontakt]

### **Dokumentation:**
- **Next.js:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Sanity:** https://www.sanity.io/docs

---

## 🎉 Sammanfattning

Webbplatsen är **production-ready** och innehåller:
- ✅ Fullständig flerspråkig funktionalitet (fi/sv/en)
- ✅ Alla fastighetssidor och företagssidor
- ✅ SEO-optimerad
- ✅ Responsiv design
- ✅ Integrerad med Linear API
- ✅ CMS för innehållshantering
- ✅ Automatisk deployment via Vercel

**Senaste Fixes (22 Okt 2025):**
- ✅ `districtFree` visar korrekt stadsdel (t.ex. "Lauttasaari")
- ✅ `address` visar korrekt gatuadress
- ✅ `freeTextTitle` visar välkomsttext rubrik
- ✅ Alla debug-loggar borttagna för produktion

**Redo för kund!** 🚀

---

**Skapad:** 22 Oktober 2025  
**Senast Uppdaterad:** 22 Oktober 2025  
**Version:** 1.0

