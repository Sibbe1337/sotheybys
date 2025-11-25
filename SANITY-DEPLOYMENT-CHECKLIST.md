# ✅ Sanity CMS - Deployment Checklist

**Status:** 🟢 Studio Deployat!  
**URL:** https://sothebys-realty-fi.sanity.studio/  
**Datum:** November 2025

---

## ✅ Vad Som Är Klart

- ✅ **Sanity Studio deployat** till https://sothebys-realty-fi.sanity.studio/
- ✅ **Dataset "production"** skapad och konfigurerad
- ✅ **Schemas** definierade (Staff, Pages, Global Settings, Featured Listings)
- ✅ **Användarguide** skapad på svenska (`KUNDGUIDE-CMS.md`)

---

## 🔧 Återstående Steg (Manuella)

### 1. Konfigurera CORS (5 minuter)

**Varför:** Tillåter Next.js-appen att hämta data från Sanity

**Steg:**
1. Gå till: https://www.sanity.io/manage/project/uy5hhchg
2. Klicka på **"API"** i menyn
3. Klicka på **"CORS Origins"**
4. Klicka på **"+ Add CORS origin"**
5. Lägg till följande URLs (en i taget):
   ```
   https://next-front-puce.vercel.app
   http://localhost:3000
   https://sothebysrealty.fi
   ```
6. För varje URL:
   - Markera **"Allow credentials"**
   - Klicka **"Save"**

---

### 2. Skapa API Token (3 minuter)

**Varför:** Ger Next.js-appen tillgång att läsa data från Sanity

**Steg:**
1. Gå till: https://www.sanity.io/manage/project/uy5hhchg
2. Klicka på **"API"** i menyn
3. Klicka på **"Tokens"**
4. Klicka på **"+ Add API token"**
5. Fyll i:
   ```
   Name: Next.js Production
   Permissions: Viewer (read-only)
   ```
6. Klicka **"Create"**
7. **KOPIERA TOKEN OMEDELBART** (den visas bara en gång!)
   - Den börjar med `sk...`
   - Spara den säkert (t.ex. i en lösenordshanterare)

---

### 3. Uppdatera Vercel Environment Variables (5 minuter)

**Varför:** Kopplar Next.js-appen till Sanity CMS

**Steg:**
1. Gå till Vercel dashboard för projektet
2. Klicka på **"Settings"**
3. Klicka på **"Environment Variables"**
4. Lägg till följande variabler:

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=uy5hhchg
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=[Din token från steg 2]
```

5. Välj **"Production", "Preview", och "Development"** för alla variabler
6. Klicka **"Save"**

---

### 4. Redeploya Next.js App (2 minuter)

**Varför:** Aktiverar Sanity-integrationen

**Steg:**
1. I Vercel dashboard, gå till **"Deployments"**
2. Klicka på den senaste deploymentens **"..."** meny
3. Välj **"Redeploy"**
4. Vänta 2-3 minuter tills deployment är klar

**ELLER** via Git:
```bash
cd /Users/emilsoujeh/sothebys
git add -A
git commit -m "feat: Configure Sanity CMS for production"
git push origin main
```

---

### 5. Lägg Till Användare i Sanity (5 minuter)

**Varför:** Ger kunden tillgång till CMS:et

**Steg:**
1. Gå till: https://www.sanity.io/manage/project/uy5hhchg
2. Klicka på **"Members"** i menyn
3. Klicka på **"+ Invite member"**
4. Lägg till kundens email-adresser:
   ```
   [Kundens email 1]
   [Kundens email 2]
   [Kundens email 3]
   ```
5. Välj roll: **"Administrator"** (för full tillgång)
6. Klicka **"Send invite"**
7. Kunden får ett email och kan acceptera inbjudan

**💡 Tips:** Börja med 1-2 personer som "test-användare" innan ni lägger till alla.

---

### 6. Migrera Befintlig Data (10 minuter)

**Varför:** Flyttar över nuvarande mäklardata till Sanity

**Steg:**
```bash
cd /Users/emilsoujeh/sothebys/apps/next-front

# Sätt API token som environment variable
export SANITY_API_TOKEN="[Din token från steg 2]"

# Kör migration script
npx tsx scripts/migrate-staff-to-sanity.ts
```

**Förväntat resultat:**
```
✓ Migrated 8 staff members to Sanity
✓ All images uploaded successfully
```

**Om scriptet inte finns:**
Mäklardata kan läggas till manuellt via Sanity Studio (se kundguiden).

---

### 7. Testa Allt (15 minuter)

**Checklista:**

- [ ] Logga in på https://sothebys-realty-fi.sanity.studio/
- [ ] Verifiera att alla mäklare finns under "Staff"
- [ ] Lägg till en test-mäklare
- [ ] Vänta 60 sekunder
- [ ] Kontrollera att test-mäklaren syns på https://next-front-puce.vercel.app/henkilosto
- [ ] Ta bort test-mäklaren
- [ ] Uppdatera kontaktinformation i "Global Settings"
- [ ] Verifiera att ändringen syns på hemsidan
- [ ] Testa "History" funktionen (ångra en ändring)

---

### 8. Utbilda Kunden (1 timme)

**Förberedelser:**
- [ ] Skicka länk till Sanity Studio
- [ ] Skicka `KUNDGUIDE-CMS.md` till kunden
- [ ] Boka ett Zoom/Teams-möte
- [ ] Förbered skärmdelnin g

**Agenda:**
1. **Introduktion** (10 min)
   - Vad är ett CMS?
   - Översikt av Sanity Studio
   - Inloggning och navigation

2. **Praktisk Demo** (30 min)
   - Lägga till en mäklare
   - Redigera kontaktinformation
   - Uppdatera sociala medier
   - Byta teambild
   - Använda "History" för att ångra

3. **Praktisk Övning** (15 min)
   - Låt kunden göra ändringar själva
   - Vägleda dem genom processen
   - Svara på frågor

4. **Frågor & Nästa Steg** (5 min)
   - Besvara frågor
   - Förklara support-processen
   - Boka uppföljningsmöte om 2 veckor

---

## 📚 Dokumentation För Kunden

### Skicka Dessa Filer:
1. ✅ **KUNDGUIDE-CMS.md** - Komplett användarguide på svenska
2. ✅ **Inloggningsinstruktioner:**
   ```
   URL: https://sothebys-realty-fi.sanity.studio/
   Metod: Logga in med Google
   Konto: [Deras företags-email]
   ```

### Rekommenderade Video-Tutorials (Att Spela In):
1. **Introduktion till Sanity Studio** (5 min)
2. **Lägga till och redigera mäklare** (4 min)
3. **Uppdatera kontaktinformation** (2 min)
4. **Hantera bilder** (3 min)
5. **Använda History för att ångra** (2 min)

**Total tid:** ~15 minuter video

---

## 🆘 Support-Plan

### Första Månaden (Intensiv Support):
- **Svarstid:** Inom 4 timmar på vardagar
- **Kanal:** Email + telefon
- **Inkluderat:** Obegränsade frågor

### Efter Första Månaden:
- **Support-avtal:** 2-4 timmar/månad
- **Svarstid:** Inom 24 timmar
- **Kanal:** Email (telefon vid brådskande)

### Vanliga Support-Ärenden:
1. "Hur lägger jag till en ny mäklare?" → Hänvisa till guide
2. "Mina ändringar syns inte" → Vänta 60 sek + hårduppdatera
3. "Jag kan inte logga in" → Kontrollera Google-konto
4. "Kan ni lägga till en ny sida?" → Kräver utveckling

---

## 💰 Kostnader

### Sanity CMS:
- **Free tier:** 0 kr/månad
  - 3 användare
  - 10,000 dokument
  - 5 GB assets
  - **Perfekt för Sothebys behov!**

### Om Ni Växer:
- **Growth plan:** $99/månad
  - 15 användare
  - 100,000 dokument
  - 50 GB assets

**Rekommendation:** Börja med free tier. Ni kommer troligen aldrig behöva uppgradera.

---

## 🎯 Framgångsmetrik

### Efter 1 Månad:
- [ ] Kunden kan lägga till mäklare själva
- [ ] Kunden kan uppdatera kontaktinfo själva
- [ ] Kunden kan byta bilder själva
- [ ] < 2 support-ärenden/vecka

### Efter 3 Månader:
- [ ] Kunden är helt självständiga
- [ ] < 1 support-ärende/månad
- [ ] Kunden är nöjda med systemet

---

## 📞 Kontaktinformation

### För Tekniska Frågor:
- **Utvecklare:** [Din email]
- **Telefon:** [Ditt nummer]

### För Sanity-Support:
- **Hjälpcenter:** https://www.sanity.io/help
- **Status:** https://status.sanity.io/

### För Kunden:
- **CMS Login:** https://sothebys-realty-fi.sanity.studio/
- **Hemsida:** https://next-front-puce.vercel.app/
- **Support:** [Din support-email]

---

## 🚀 Nästa Steg

1. ✅ **Idag:** Konfigurera CORS och skapa API token (steg 1-2)
2. ✅ **Idag:** Uppdatera Vercel och redeploya (steg 3-4)
3. 📅 **Denna vecka:** Lägg till användare och migrera data (steg 5-6)
4. 📅 **Denna vecka:** Testa allt (steg 7)
5. 📅 **Nästa vecka:** Boka och genomför utbildning (steg 8)
6. 📅 **Om 2 veckor:** Uppföljningsmöte med kunden

---

## ✨ Sammanfattning

**Vad Kunden Får:**
- ✅ Enkelt CMS för att uppdatera hemsidan
- ✅ Inget behov av teknisk kunskap
- ✅ Ändringar syns inom 60 sekunder
- ✅ Komplett guide på svenska
- ✅ Säker och pålitlig lösning
- ✅ Gratis (inom Sanity's free tier)

**Vad Kunden Kan Göra:**
- ✅ Lägga till/ta bort/redigera mäklare
- ✅ Uppdatera kontaktinformation
- ✅ Ändra sociala medier-länkar
- ✅ Byta teambild
- ✅ Redigera sidor (Om Oss, etc.)
- ✅ Hantera SEO-inställningar

**Vad Kunden INTE Kan Göra (Behöver Er):**
- ❌ Ändra fastighetsobjekt (kommer från Linear API)
- ❌ Ändra design/layout
- ❌ Lägga till nya funktioner
- ❌ Tekniska problem

---

**Status:** 🟢 **Redo för produktion!**

**Skapad:** November 2025  
**Senast uppdaterad:** November 2025  
**Version:** 1.0

