# 🔧 Sanity Setup Fix - Skapa Ditt Eget Project

## Problem
Du ser "You are not a member of this project" eftersom projektet `uy5hhchg` skapades under mitt konto.

## ✅ Lösning (5 minuter)

### Steg 1: Skapa Nytt Project Manuellt

1. **Gå till**: https://www.sanity.io/manage
2. **Klicka**: "Create new project" (blå knapp)
3. **Fyll i**:
   - Project name: `Sothebys Realty Finland`
   - Organization: `Nova Sounds AB` (eller skapa ny)
4. **Klicka**: "Create project"
5. **KOPIERA PROJECT ID** (kommer att vara något som `abc123xyz`)

### Steg 2: Uppdatera Project ID i Koden

Kör detta kommando (ersätt `YOUR_NEW_PROJECT_ID` med det ID du fick):

```bash
cd /Users/emilsoujeh/sothebys

# Uppdatera sanity.config.ts
sed -i '' 's/uy5hhchg/YOUR_NEW_PROJECT_ID/g' apps/studio/sanity.config.ts

# Uppdatera .env.local filer
sed -i '' 's/uy5hhchg/YOUR_NEW_PROJECT_ID/g' apps/studio/.env.local
sed -i '' 's/uy5hhchg/YOUR_NEW_PROJECT_ID/g' apps/next-front/.env.local

# Uppdatera dokumentation
sed -i '' 's/uy5hhchg/YOUR_NEW_PROJECT_ID/g' SANITY-*.md
```

**Eller manuellt ändra i dessa filer:**
- `apps/studio/sanity.config.ts` (rad 11)
- `apps/studio/.env.local` (rad 1)
- `apps/next-front/.env.local` (sista raden)
- `apps/next-front/src/lib/sanity.ts` (rad 5)

### Steg 3: Skapa Dataset

1. **Gå till**: https://www.sanity.io/manage/project/YOUR_NEW_PROJECT_ID
2. **Klicka**: "Datasets" i vänster menyn
3. **Klicka**: "+ Add dataset"
4. **Fyll i**:
   - Name: `production`
   - Visibility: `Public`
5. **Klicka**: "Create"

### Steg 4: Starta Sanity Studio

```bash
cd /Users/emilsoujeh/sothebys/apps/studio
npm run dev
```

Öppna: http://localhost:3333

Du borde nu kunna logga in! 🎉

---

## 🚀 Fortsätt Med Deployment

När du har gjort stegen ovan, fortsätt med `SANITY-QUICK-START.md` från **Steg 2** (Deploy Studio).

---

## 🆘 Fortfarande Problem?

### Alternativ 1: Använd CLI (Rekommenderat)

```bash
cd /Users/emilsoujeh/sothebys/apps/studio

# Skapa projekt via CLI
npx sanity projects create

# Följ prompten:
# - Name: Sothebys Realty Finland
# - Organization: Nova Sounds AB
# - Dataset: production

# Kopiera det nya project ID och uppdatera filerna enligt Steg 2 ovan
```

### Alternativ 2: Bjud In Mig Till Projektet

Om du vill använda det befintliga projektet `uy5hhchg`:

1. Gå till: https://www.sanity.io/manage/project/uy5hhchg
2. Klicka: "Members"
3. Klicka: "+ Add member"
4. Email: `kodaren1338@gmail.com`
5. Role: `Administrator`

Men jag rekommenderar **Alternativ 1** så att projektet är under ditt konto.

---

## ✅ Verifiering

När du har uppdaterat project ID, kör:

```bash
cd /Users/emilsoujeh/sothebys/apps/next-front
export NEXT_PUBLIC_SANITY_PROJECT_ID="YOUR_NEW_PROJECT_ID"
export NEXT_PUBLIC_SANITY_DATASET="production"
./scripts/test-sanity-integration.sh
```

Om testet passerar är allt klart! 🎉

---

**Nästa Steg**: Fortsätt med `SANITY-QUICK-START.md` från Steg 2.

