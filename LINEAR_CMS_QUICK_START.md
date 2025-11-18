# ⚡ LINEAR CMS QUICK START

## 🎯 ENKLASTE SÄTTET: Använd "Länkar"-fältet!

Istället för att fylla i massa olika fält, **lägg ALLA dina länkar i "Länkar"-fältet**! 
Koden hittar automatiskt rätt URL för varje ändamål.

---

## 📋 STEG-FÖR-STEG

### 1️⃣ Grunddata (OBLIGATORISKT för kartor)
```yaml
address (fi): "Mellstenintie 13"
postalCode (fi): "00210"
city (fi): "Helsinki"
```
→ **Kartan geocodas automatiskt!** 🗺️

---

### 2️⃣ Lägg till alla länkar i "Länkar"-fältet

**Hitta fältet:**
- Gå till objektets information
- Scrolla till **"Länkar"** sektionen
- Du ser språkflikar: `en` | `fi` | `sv`

**Lägg till dina länkar:**

#### För SVENSKA (sv):
```
https://sothebysrealty.fi/kohde/albertinkatu-19-b-20/
https://sothebysrealty.fi/esitteet/albertinkatu-19-b-20/
https://youtu.be/z0Sws7RvVW4s
https://www.sothebysrealty.com/eng/sales/detail/...
```

#### För FINSKA (fi):
```
https://sothebysrealty.fi/kohde/albertinkatu-19-b-20/
https://sothebysrealty.fi/esitteet/albertinkatu-19-b-20/
https://youtu.be/z0Sws7RvVW4s
https://www.sothebysrealty.com/eng/sales/detail/...
```

#### För ENGELSKA (en):
```
https://sothebysrealty.fi/kohde/albertinkatu-19-b-20/
https://sothebysrealty.fi/esitteet/albertinkatu-19-b-20/
https://youtu.be/z0Sws7RvVW4s
https://www.sothebysrealty.com/eng/sales/detail/...
```

---

## 🤖 VAD KODEN GÖR AUTOMATISKT

### Från "Länkar"-fältet hittar koden:

| URL-typ | Identifieras av | Resultat |
|---------|----------------|----------|
| **Broschyr** | `/esitteet/` eller `brochure` | ✅ "Bläddra broschyren" fungerar |
| **Video** | `youtube.com` eller `youtu.be` eller `vimeo.com` | ✅ "Titta video" fungerar |
| **Global Listing** | `sothebysrealty.com/eng` | ✅ "Global listing" länk visas |
| **Planritning** | `pohjakuva` eller `floorplan` | ✅ "Bottenplan" fungerar |

---

## ✅ RESULTAT

När du har fyllt i:
- ✅ Address, city, postalCode
- ✅ Länkar-fältet med alla URLs

**Då fungerar:**
1. 🗺️ **Kartan** (auto-geocoding från adress)
2. 📄 **Broschyren** (hittas från /esitteet/ URL)
3. 📹 **Video** (hittas från YouTube/Vimeo URL)
4. 🌐 **Global listing** (hittas från sothebysrealty.com/eng URL)
5. 📐 **Planritning** (om URL innehåller "pohjakuva")

---

## 📸 BILDEXEMPEL

```
┌──────────────────────────────────────────┐
│ Länkar (?)                               │
├──────────────────────────────────────────┤
│  en  │  fi  │  sv  │  +                  │
├──────────────────────────────────────────┤
│ https://sothebysrealty.fi/kohde/al...   │
│ https://sothebysrealty.fi/esitteet/...  │ ← Broschyr
│ https://sothebysrealty.fi/esitteet/...  │
│ https://youtu.be/z0Sws7RvVW4s           │ ← Video
│ https://www.sothebysrealty.com/...      │ ← Global
│                                          │
│ [+] Lägg till                            │
└──────────────────────────────────────────┘
```

---

## 🆚 JÄMFÖRELSE: Gamla vs Nya sättet

### ❌ GAMLA SÄTTET (Komplicerat):
```
✓ Fyll i virtualTourUrl för broschyr
✓ Fyll i videoUrl för video
✓ Fyll i internationalUrl för global listing (väntar på API)
✓ Fyll i floorPlanUrl för planritning
✓ Fyll i energyCertificateUrl för energicertifikat
```
→ 5 olika fält att komma ihåg!

### ✅ NYA SÄTTET (Smart):
```
✓ Fyll i "Länkar"-fältet med ALLA dina URLs
```
→ 1 fält! Koden hittar automatiskt rätt URL för varje ändamål! 🎯

---

## 💡 TIPS

### Vill du använda olika länkar per språk?
```
Svenska (sv):
- https://sothebysrealty.fi/esitteet/albertinkatu-19-b-20/

Finska (fi):
- https://sothebysrealty.fi/esitteet/albertinkatu-19-b-20/

Engelska (en):
- https://sothebysrealty.com/eng/sales/detail/...
```

### Vill du lägga till en beskrivning?
```
Lägg till "Länknamn" fältet:
- URL: https://sothebysrealty.fi/esitteet/...
- Namn: "Esite PDF"
```
(Koden använder URL:en oavsett namn)

---

## ❓ FELSÖKNING

### Broschyren visas inte?
✅ Kolla att URL:en innehåller `/esitteet/` eller `brochure`

### Video fungerar inte?
✅ Kolla att URL:en är från YouTube eller Vimeo

### Global listing syns inte?
✅ Kolla att URL:en innehåller `sothebysrealty.com/eng`

### Kartan visas inte?
✅ Kolla att address, city, postalCode är ifyllda
✅ Öppna browser console (F12) och leta efter "[Mapper] Geocoding"

---

## 🎯 CHECKLIST FÖR NYA OBJEKT

```
□ Address, city, postalCode ifyllda
□ Bilder uppladdade (minst 1)
□ "Länkar" fältet ifyllt med:
  □ Broschyr-URL (om finns)
  □ Video-URL (om finns)
  □ Global listing URL (om finns)
  □ Planritning-URL (om finns)
□ Energiklass (energyClass) ifylld: "C"
□ Agent-uppgifter kompletta
□ Pris och kostnader korrekta
□ Beskrivning (freeText) ifylld
```

---

## 📞 SUPPORT

Fungerar något inte?
1. Öppna browser console (F12)
2. Leta efter meddelanden som börjar med `[Mapper]` eller `[MediaTabs]`
3. Kontrollera att URLs är korrekta och tillgängliga

---

**Skapad:** 2025-11-18
**Uppdaterad:** Med smart links-array extraktion! 🎉

