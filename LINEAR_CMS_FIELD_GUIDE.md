# 📋 LINEAR CMS FIELD GUIDE

## Översikt över viktiga fält och var de läggs till

Denna guide visar exakt var och hur du fyller i data i Linear CMS för att alla funktioner ska fungera på webbplatsen.

---

## 🗺️ 1. KARTOR (Maps)

### Problem:
"Karttadata ei saatavilla" visas istället för karta

### Lösning:
Koden **geocodar automatiskt** från adress! Du behöver bara fylla i:

#### Fält som behövs:
```
✅ address (fi): "Hiiralankaari 24"
✅ postalCode (fi): "00330"
✅ city (fi): "Helsinki"
```

#### Alternativt (om geocoding misslyckas):
Fyll i koordinater manuellt:

**Alternativ A - Separata fält:**
```
latitude (fi): 60.159324
longitude (fi): 24.795143
```

**Alternativ B - Kombinerat fält:**
```
mapCoordinates (fi): 60.159324,24.795143
```

### Hur hitta koordinater:
1. Öppna [Google Maps](https://maps.google.com)
2. Högerklicka på platsen
3. Välj "Copy coordinates"
4. Klistra in i Linear CMS

---

## 📄 2. BROSCHYRER (Brochures)

### Problem:
"Ingen broschyr tillgänglig" visas i "Bläddra broschyren"-tab

### Lösning (2 alternativ):

#### **Alternativ A: Använd "Länkar" fältet (REKOMMENDERAT! 🌟)**

Fyll i **ALLA** dina länkar i "Länkar"-fältet i Linear CMS, så hittar koden automatiskt rätt URL baserat på URL-mönster!

**Exempel:**
```
Fält: "Länkar" (med språkflikar: fi, sv, en)

Lägg till dessa länkar:
- https://sothebysrealty.fi/kohde/albertinkatu-19-b-20/
- https://sothebysrealty.fi/esitteet/albertinkatu-19-b-20/ ← Broschyr!
- https://youtu.be/z0Sws7RvVW4s ← Video!
- https://www.sothebysrealty.com/eng/sales/... ← Global listing!
```

**Koden hittar automatiskt:**
- Broschyr: URLs med `/esitteet/`, `brochure`, eller `broschyr`
- Video: URLs med `youtube.com`, `youtu.be`, eller `vimeo.com`
- Global listing: URLs med `sothebysrealty.com/eng`

#### **Alternativ B: Använd specifika fält**

Om du föredrar separata fält:
```
1. virtualTourUrl (fi)    ← "Virtuell visning" i UI
2. brochureUrl (fi)
3. propertyBrochureUrl (fi)
```

### Bildexempel från Linear CMS:
```
┌─────────────────────────────────────────────┐
│ Virtuell visning                            │
├─────────────────────────────────────────────┤
│ Virtuell visning har visat sig intressera   │
│ kunder. Lägg till en länk till den          │
│ virtuella visningen här.                    │
│                                             │
│ Länk till virtuell visning:                 │
│ [https://sothebysrealty.fi/esitteet/...]   │
│                                             │
│ [Kopiera länk till virtuell visning]        │
└─────────────────────────────────────────────┘
```

### Vad som fungerar:
- ✅ PDF-broschyrer (https://sothebysrealty.fi/esitteet/...)
- ✅ Externa tjänster (Matterport, etc.)
- ✅ Direktlänkar till PDF-filer

---

## 📐 3. PLANRITNINGAR (Floor Plans)

### Problem:
"Ingen planritning tillgänglig" visas i "Bottenplan"-tab

### Lösning:
Lägg till planritning i Linear CMS

#### Fält som används:
```
1. floorPlanUrl (fi)           ← Direktlänk till PDF/bild
2. images → isFloorPlan: true  ← Markera en bild som planritning
```

### Exempel:
```
Alternativ A - Direktlänk:
floorPlanUrl (fi): https://example.com/planritning.pdf

Alternativ B - Bild:
I images-arrayen, sätt isFloorPlan: true för planritningsbilden
```

---

## ⚡ 4. ENERGIKLASS (Energy Class)

### Problem:
Energiklass visas inte eller visas fel

### Lösning:
Fyll i energiklass-fältet

#### Fält som används (i prioritetsordning):
```
1. energyClass (locale) ← Prioritet: användarens språk
2. energyClass (fi)     ← Fallback: finska
3. energyClass (nv)     ← Fallback: nonLocalizedValues
```

### Tillåtna värden:
```
A, B, C, D, E, F, G
```

### Exempel:
```
energyClass (fi): "C"
energyClass (sv): "C"
energyClass (en): "C"
```

### Vanliga problem:
```
❌ Fel: "C-klass", "klass C", "Energiklass C"
✅ Rätt: "C"

❌ Fel: "c" (lowercase)
✅ Rätt: "C" (uppercase)
```

---

## 🌐 5. GLOBAL LISTING URL (SIR International)

### Problem:
"Global listing" länk saknas på objektsidan

### Lösning (2 alternativ):

#### **Alternativ A: Lägg till i "Länkar" fältet (FUNGERAR NU! ✅)**
```
Länk: https://www.sothebysrealty.com/eng/sales/detail/...
```
Koden hittar automatiskt sothebysrealty.com/eng länkar!

#### **Alternativ B: Vänta på specifikt fält**
```
⚠️ Status: VÄNTAR PÅ LINEAR API-UPPDATERING
internationalUrl (fi): https://www.sothebysrealty.com/eng/sales/...
```

Detta specifika fält finns **INTE** i Linear API än, men du kan använda "Länkar"-fältet istället!

---

## 📹 6. VIDEO (Bonus)

### Lösning (2 alternativ):

#### **Alternativ A: Lägg till i "Länkar" fältet (ENKLAST! 🌟)**
```
Länk: https://youtu.be/z0Sws7RvVW4s
```
Koden hittar automatiskt YouTube/Vimeo-länkar!

#### **Alternativ B: Använd specifikt fält**
```
videoUrl (fi): https://youtube.com/watch?v=...
```

### Tjänster som stöds:
- ✅ YouTube (youtube.com, youtu.be)
- ✅ Vimeo (vimeo.com)
- ✅ Direktlänkar till MP4

---

## 🔍 7. ENERGICERTIFIKAT

### Fält:
```
energyCertificateUrl (fi): https://example.com/cert.pdf
```

---

## 📊 SAMMANFATTNING

| Feature | Fält i Linear CMS | Status |
|---------|-------------------|--------|
| **Kartor** | address + city + postalCode | ✅ AUTO-GEOCODING! |
| **Broschyrer** | virtualTourUrl | ✅ FUNGERAR |
| **Planritningar** | floorPlanUrl | ⏳ Fyll i data |
| **Energiklass** | energyClass | ⏳ Fyll i data |
| **Global Listing** | internationalUrl | ⚠️ Väntar på API |
| **Video** | videoUrl | ✅ FUNGERAR |
| **Energicertifikat** | energyCertificateUrl | ✅ FUNGERAR |

---

## 🛠️ SNABBGUIDE: Lägg till komplett objektdata

### Minimum för att kartan ska fungera:
```yaml
address (fi): "Mellstenintie 13"
postalCode (fi): "00210"
city (fi): "Helsinki"
```
→ Kartan geocodas automatiskt! ✅

### För komplett objektpresentation:
```yaml
# GRUNDDATA
address (fi): "Mellstenintie 13"
postalCode (fi): "00210"
city (fi): "Helsinki"

# MEDIA (alla frivilliga men rekommenderade)
virtualTourUrl (fi): "https://sothebysrealty.fi/esitteet/..."
floorPlanUrl (fi): "https://example.com/planritning.pdf"
videoUrl (fi): "https://youtube.com/watch?v=..."

# TEKNISK DATA
energyClass (fi): "C"
energyCertificateUrl (fi): "https://example.com/cert.pdf"

# INTERNATIONELL (när API är klart)
internationalUrl (fi): "https://sothebysrealty.com/..."
```

---

## ❓ FELSÖKNING

### "Karttadata ej tillgänglig"
1. ✅ Kolla att address, city, postalCode är ifyllda
2. ✅ Öppna browser console - leta efter "[Mapper] Geocoding address"
3. ✅ Om geocoding misslyckas, lägg till koordinater manuellt

### "Ingen broschyr tillgänglig"
1. ✅ Fyll i "Länk till virtuell visning" (virtualTourUrl)
2. ✅ Kontrollera att länken fungerar i browser
3. ✅ Koden letar även efter brochureUrl och propertyBrochureUrl

### Energiklass visas inte
1. ✅ Använd bara bokstaven: "C" inte "C-klass"
2. ✅ Använd uppercase: "C" inte "c"
3. ✅ Fyll i minst finska (fi): energyClass (fi): "C"

### Planritning visas inte
1. ✅ Lägg till floorPlanUrl (fi)
2. ✅ Eller markera en bild med isFloorPlan: true
3. ✅ Se till att länken är tillgänglig

---

## 📞 SUPPORT

Om något inte fungerar trots att du fyllt i rätt data:

1. **Öppna browser console** (F12)
2. **Leta efter fel-meddelanden** som börjar med:
   - `[Mapper]`
   - `[MediaTabs]`
   - `[Geocoding]`
3. **Kolla build-loggar** på Vercel för server-side errors

---

## ✅ CHECKLIST FÖR NYA OBJEKT

```
□ Address, city, postalCode ifyllda (för auto-geocoding)
□ Bilder uppladdade (minst 1)
□ Virtuell visning-länk (virtualTourUrl) om broschyr finns
□ Planritning (floorPlanUrl) om tillgänglig
□ Energiklass (energyClass) korrekt ifylld
□ Video (videoUrl) om tillgänglig
□ Agent-uppgifter kompletta
□ Pris och kostnader korrekta
□ Beskrivning (freeText) ifylld
```

---

**Uppdaterad:** 2025-11-18
**Version:** 2.0 (med auto-geocoding!)

