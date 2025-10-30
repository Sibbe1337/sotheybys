# 📊 DATA QUALITY IMPROVEMENT GUIDE

Extremt bra och enkel guide för att förbättra data quality i Linear API!

---

## 🎯 SNABBSTART (5 minuter)

### **Steg 1: Kör Data Quality Report**

```bash
cd apps/next-front
node scripts/data-quality-report.js
```

**Output:**
```
🔍 DATA QUALITY ANALYSIS
════════════════════════════════════════════════════════════════════════════════
📡 Fetching data from Linear API...
✅ Fetched 47 properties

📊 RESULTAT PER KATEGORI

📁 Grundinfo (Basic Info)
   ⚠️  2/47 objekt saknar data (4.3%)
   🔴 Exempel:
      • Testikatu 1
        Saknar: postalCode

📁 Byggnadsinformation (Building Info)
   ⚠️  23/47 objekt saknar data (48.9%)
   🔴 Exempel:
      • Bernhardinkatu 1
        Saknar: yearBuilt, energyClass, heatingSystem

🔴 TOP 10 OBJEKT MED MEST SAKNAD DATA

1. Bernhardinkatu 1 (Helsinki)
   Typ: KERROSTALO
   📊 Saknar 8 kritiska fält (weight: 64)
   🔍 Linear ID: abc123
   Kategorier med problem:
      • Byggnadsinformation: yearBuilt, energyClass, heatingSystem, ventilationSystem
      • Bolagsinformation: housingCooperativeName, companyLoans

📈 ÖVERGRIPANDE KVALITET

   Totalt antal objekt: 47
   Objekt med komplett data: 24
   Objekt med saknad data: 23
   Data completeness score: 68.5%

   Betyg: 🟠 NEEDS IMPROVEMENT

💡 REKOMMENDATIONER
...
```

---

## 🔧 SETUP

### **Alternativ 1: Använd befintlig .env.local**

Om du redan har `.env.local` med Linear API credentials, fungerar scriptet direkt!

```bash
node scripts/data-quality-report.js
```

### **Alternativ 2: Export i terminal**

Om du inte har `.env.local`:

```bash
# Sätt environment variables
export LINEAR_API_KEY="din-api-nyckel-här"
export COMPANY_ID="ditt-company-id-här"

# Kör script
node scripts/data-quality-report.js
```

### **Alternativ 3: Inline**

```bash
LINEAR_API_KEY="xxx" COMPANY_ID="yyy" node scripts/data-quality-report.js
```

---

## 📋 3-STEGS PROCESS

### **STEG 1: IDENTIFIERA (5 min)**

Kör scriptet och få en rapport över saknad data:

```bash
node scripts/data-quality-report.js
```

**Vad du får:**
- ✅ Lista över alla objekt med saknad data
- ✅ Top 10 värsta objekt (prioriterad lista)
- ✅ Exakt vilka fält som saknas per objekt
- ✅ Overall quality score (%)

---

### **STEG 2: ÅTGÄRDA (30-60 min)**

#### **A) Fixa Top 5 värsta objekten manuellt**

1. **Logga in i Linear.fi admin:**
   - URL: https://linear.fi/admin
   - Använd dina credentials

2. **Sök objekt med ID:**
   ```
   Från rapporten: "Linear ID: abc123"
   → Klistra in i Linear sökfält
   ```

3. **Fyll i saknad data:**
   
   | Fält | Hur du hittar det | Tips |
   |------|-------------------|------|
   | **Byggnadsår** | Google: "Adress + byggnadsår" | Eller från fastighetsregistret |
   | **Energiklass** | Energicertifikat | Default: "D" (medel för Finland) |
   | **Värmesystem** | Ofta "Kaukolämpö" för lägenheter | Fråga mäklaren |
   | **Ventilation** | Ofta "Koneellinen" (mekanisk) | För moderna byggnader |
   | **Bolagsnamn** | Bostadsrättsförening-registret | prh.fi |

#### **B) Bulk Edit för vanliga problem**

Om många objekt saknar samma fält (t.ex. 30 objekt saknar energiklass):

1. **Exportera från Linear:**
   - Gå till Linear admin → Export → CSV

2. **Fyll i Excel/Google Sheets:**
   - Öppna CSV
   - Filtrera på tomma energiklass-fält
   - Sätt default "D" för alla
   - Spara

3. **Importera tillbaka:**
   - Linear admin → Import → CSV
   - Verifiera ändringarna

#### **C) Smart Defaults**

För vissa fält kan du sätta intelligenta defaults:

```javascript
// I mapper.ts (om API-data saknas):

const heatingSystem = raw.heatingSystem || {
  fi: 'Kaukolämpö',  // Most common in Finland
  sv: 'Fjärrvärme',
  en: 'District heating'
};

const energyClass = raw.energyClass || 'D'; // Average

const elevator = raw.elevator !== undefined 
  ? raw.elevator 
  : property.floor > 2; // If floor >2, assume elevator
```

---

### **STEG 3: VERIFIERA (2 min)**

Efter att du fixat data i Linear:

```bash
# Kör scriptet igen
node scripts/data-quality-report.js

# Jämför resultat:
# Before: Data completeness score: 68.5%
# After:  Data completeness score: 92.3% ✅
```

---

## 📊 FÖRSTÅ RAPPORTEN

### **Quality Score:**

| Score | Betyg | Action Required |
|-------|-------|-----------------|
| 90-100% | 🟢 EXCELLENT | Maintenance mode |
| 75-89% | 🟡 GOOD | Minor improvements |
| 60-74% | 🟠 NEEDS IMPROVEMENT | Focus on top 10 |
| <60% | 🔴 POOR | Immediate action needed |

### **Field Weight:**

Fält har olika "vikt" baserat på hur viktiga de är:

| Weight | Importance | Exempel |
|--------|------------|---------|
| 10 | Kritisk | Address, Price, Agent info |
| 9 | Mycket viktig | Living area, Room count |
| 8 | Viktig | Year built, Energy class |
| 7 | Bör finnas | Company info (för lägenheter) |

**→ Prioritera fält med högre vikt först!**

---

## 🎯 WORKFLOW

### **Vecka 1: Quick Wins (2 timmar)**

1. ✅ Kör script första gången
2. ✅ Identifiera top 5 värsta objekt
3. ✅ Fixa dessa 5 manuellt i Linear
4. ✅ Kör script igen → se improvement!

**Förväntad förbättring:** +15-20% quality score

### **Vecka 2: Systematisk Fix (3-4 timmar)**

1. ✅ Fixa alla objekt med >5 saknade fält
2. ✅ Bulk edit för vanliga problem (energiklass, värmesystem)
3. ✅ Dokumentera standard-värden för framtida objekt

**Förväntad förbättring:** +20-30% quality score

### **Vecka 3: Polish (2 timmar)**

1. ✅ Fixa alla återstående objekt
2. ✅ Verifiera all data är korrekt
3. ✅ Sätt upp rutiner för nya objekt

**Förväntad förbättring:** +10-15% quality score

**→ Total improvement: 45-65% quality score boost! 🎉**

---

## 🔄 LÖPANDE MAINTENANCE

### **Automatiserad Check (varannan vecka)**

Lägg till i `package.json`:

```json
{
  "scripts": {
    "data-quality": "node scripts/data-quality-report.js"
  }
}
```

Kör:
```bash
npm run data-quality
```

### **Pre-Deployment Check**

Innan deployment, kör:
```bash
npm run data-quality

# Om score < 85%:
# → Fixa top 3 värsta objekt
# → Deploy
```

---

## 🐛 TROUBLESHOOTING

### **Problem: "Linear API key is not set!"**

**Lösning:**
```bash
# Kolla att .env.local innehåller:
cat apps/next-front/.env.local | grep LINEAR

# Ska visa:
# LINEAR_API_KEY=din-nyckel-här
# COMPANY_ID=ditt-id-här
```

### **Problem: "HTTP 401: Unauthorized"**

**Lösning:**
1. API-nyckeln är felaktig
2. Verifiera i Linear admin → Settings → API Keys
3. Generera ny nyckel om nödvändigt

### **Problem: "HTTP 403: Forbidden"**

**Lösning:**
1. Company ID är felaktig
2. API-nyckeln har inte access till det company ID
3. Kontakta Linear support

### **Problem: "No properties found"**

**Lösning:**
1. Company ID har inga listings
2. Verifiera Company ID är korrekt
3. Kolla att du har objekt i Linear admin

---

## 📈 MÄTBARA MÅL

### **30-dagars roadmap:**

| Vecka | Mål | Action | Expected Score |
|-------|-----|--------|----------------|
| 1 | Quick wins | Fix top 5 | 70% → 85% |
| 2 | Systematic | Bulk edit + fix all >5 missing | 85% → 92% |
| 3 | Polish | Fix remaining | 92% → 95% |
| 4 | Maintenance | Routines + monitoring | 95%+ (sustain) |

---

## 💡 BEST PRACTICES

### **För nya objekt:**

1. **Använd checklist i Linear:**
   - [ ] Address (fi/sv/en)
   - [ ] Price
   - [ ] Living area
   - [ ] Room count
   - [ ] Year built
   - [ ] Energy class
   - [ ] Heating system
   - [ ] Agent info

2. **Sätt defaults för vanliga värden:**
   - Energiklass: D (om okänd)
   - Värmesystem: Kaukolämpö (lägenheter)
   - Ventilation: Koneellinen (moderna byggnader)

3. **Verifiera innan publicering:**
   ```bash
   # Kör quick check på senaste objektet:
   node scripts/data-quality-report.js | grep "senaste-objektets-adress"
   ```

---

## 🎉 SUCCESS METRICS

### **Före Data Quality Improvement:**
- ❌ 23/47 objekt saknar data (48.9%)
- ❌ 10+ "Uppgift saknas" per detail-sida
- ❌ Score: 68.5% (🟠 NEEDS IMPROVEMENT)

### **Efter Data Quality Improvement:**
- ✅ 2/47 objekt saknar data (4.3%)
- ✅ 0-2 "Uppgift saknas" per detail-sida
- ✅ Score: 95.7% (🟢 EXCELLENT)

**→ 27% förbättring i data quality! 🚀**

---

## 📞 SUPPORT

**Problem med scriptet?**
- Kontakta utvecklare
- Eller öppna issue i GitHub repo

**Problem med Linear API?**
- Linear support: support@linear.fi
- API docs: https://linear.fi/docs/api

---

## 🔗 RELATERADE RESURSER

- `FIELD-MAPPING-BLUEPRINT.md` - Field mapping reference
- `DENNIS-FEEDBACK-TRACKER.md` - All feedback status
- `ARCHITECTURE.md` - System architecture
- `LINEAR-API-GUIDE.md` - Linear API documentation

---

**🎯 Lycka till med data quality improvement!**

Kom ihåg: **Börja smått, fokusera på top 5, bygg momentum!** 🚀

