# 🧭 BLUEPRINT VALIDATION GUIDE

**Validates property data quality against Dennis Implementation Blueprint**

---

## 🎯 WHAT IS THIS?

Blueprint Validation is an **advanced mode** of the Data Quality Tool that validates every property against the **Dennis Implementation Blueprint** - a detailed specification of required fields for each property type (apartment, property, rental).

Unlike the **Summary Mode** (which checks general data quality), Blueprint Mode validates:
- ✅ **Type-specific required fields** (apartments need different fields than houses)
- ✅ **Localized placeholder detection** ("Ej angivet", "Uppgift saknas", etc.)
- ✅ **Nested field validation** (`pricing.debtFree`, `meta.housingCompany.loans`)
- ✅ **Compliance scoring** (0-100% per property and overall)
- ✅ **JSON export** for tracking improvements over time

---

## 🚀 QUICK START

### **Command 1: Summary Mode (original)**
```bash
npm run data-quality
# or
node scripts/data-quality-report.js
```
**What it does:** General missing field analysis (original behavior)

### **Command 2: Blueprint Mode** ⭐
```bash
npm run data-quality:blueprint
# or
node scripts/data-quality-report.js --mode=blueprint
```
**What it does:** Validates against Dennis Implementation Blueprint schema

### **Command 3: Full Mode**
```bash
npm run data-quality:full
# or
node scripts/data-quality-report.js --mode=full
```
**What it does:** Runs both Summary AND Blueprint validation

---

## 📊 EXAMPLE OUTPUT

### **Blueprint Mode Output:**

```
🔍 DATA QUALITY ANALYSIS
🔧 Mode: BLUEPRINT
════════════════════════════════════════════════════════════════════════════════
📡 Fetching data from Linear API...
✅ Fetched 47 properties

🧭 BLUEPRINT VALIDATION MODE
════════════════════════════════════════════════════════════════════════════════
Validating against Dennis Implementation Blueprint schema...

📊 BLUEPRINT COMPLIANCE SUMMARY

Overall Average: 86.2%
Total Properties: 47

By Property Type:
  🏢 APARTMENT: 88.5% (35 properties)
  🏡 PROPERTY: 79.3% (8 properties)
  🏠 RENTAL: 91.2% (4 properties)

🔴 TOP 7 PROPERTIES NEEDING ATTENTION (<80% complete)

1. Bernhardinkatu 1 (Helsinki)
   Type: apartment
   Score: 72.2% (13/18 fields)
   Missing: meta.yearBuilt, meta.energyClass, meta.heatingSystem, meta.housingCompany.loans... +1 more

2. Mailatie 3 (Kittilä)
   Type: property
   Score: 70.0% (7/10 fields)
   Missing: meta.propertyIdentifier, fees.propertyTax, meta.ventilationSystem

3. Heikkiläntie 1 (Helsinki)
   Type: apartment
   Score: 77.8% (14/18 fields)
   Missing: meta.energyClass, meta.housingCompany.encumbrances, meta.zoning, features.sauna

════════════════════════════════════════════════════════════════════════════════

📁 Detailed report saved to: reports/data-quality-blueprint.json
✅ BLUEPRINT VALIDATION COMPLETE!
```

---

## 📋 BLUEPRINT SCHEMA

The validation is based on `scripts/data-quality-schema.json`:

### **Apartment (Kerrostalo) - 18 required fields:**
```
✅ Pricing: debtFree, sales
✅ Fees: maintenance, financing, water
✅ Building: yearBuilt, heatingSystem, energyClass
✅ Company: housingCompany.name, loans, encumbrances
✅ Ownership: plotOwnership, housingTenure
✅ Other: availableFrom, zoning
✅ Features: balcony, sauna, elevator
```

### **Property (Omakotitalo/Kiinteistö) - 10 required fields:**
```
✅ Identification: propertyIdentifier
✅ Dimensions: plot
✅ Building: yearBuilt, heatingSystem, ventilationSystem, energyClass
✅ Pricing: debtFree
✅ Fees: propertyTax
✅ Other: zoning, availableFrom
```

### **Rental (Vuokrakohde) - 10 required fields:**
```
✅ Rental: monthlyRent, securityDeposit, contractType, earliestTermination, availableFrom
✅ Building: yearBuilt, heatingSystem, energyClass
✅ Fees: water, electricity
```

---

## 📁 JSON EXPORT

Blueprint mode creates: `reports/data-quality-blueprint.json`

### **Structure:**
```json
{
  "generatedAt": "2025-10-30T14:30:00.000Z",
  "mode": "blueprint",
  "summary": {
    "totalProperties": 47,
    "averageScore": "86.2",
    "byType": {
      "apartment": {
        "count": 35,
        "avgScore": "88.5"
      },
      "property": {
        "count": 8,
        "avgScore": "79.3"
      },
      "rental": {
        "count": 4,
        "avgScore": "91.2"
      }
    }
  },
  "properties": [
    {
      "id": "abc123",
      "address": "Bernhardinkatu 1",
      "city": "Helsinki",
      "type": "apartment",
      "requiredFields": 18,
      "filledFields": 13,
      "missingFields": [
        "meta.yearBuilt",
        "meta.energyClass",
        "meta.heatingSystem",
        "meta.housingCompany.loans",
        "meta.housingCompany.encumbrances"
      ],
      "fieldStatus": {
        "pricing.debtFree": { "value": 1570000, "status": "present" },
        "meta.yearBuilt": { "value": null, "status": "missing" },
        ...
      },
      "completeness": "72.2%",
      "score": 72.2
    },
    ...
  ]
}
```

---

## 🎯 WORKFLOW: How to Use Blueprint Validation

### **STEP 1: Run Initial Blueprint Check (2 min)**
```bash
npm run data-quality:blueprint
```

**What you get:**
- Overall compliance score (target: >90%)
- Score per property type
- Top 10 worst properties prioritized
- JSON export for tracking

### **STEP 2: Identify Patterns (5 min)**

**Analyze the output:**
```
🏢 APARTMENT: 88.5% (good, but can improve)
🏡 PROPERTY: 79.3% (needs attention!)
🏠 RENTAL: 91.2% (excellent!)
```

**Ask yourself:**
- Which property type needs most work?
- Are specific fields consistently missing? (e.g., energyClass across all apartments)
- Which individual properties need urgent fixes?

### **STEP 3: Fix Top 3 Properties (30 min)**

From the output:
```
1. Bernhardinkatu 1 → Missing 5 fields
2. Mailatie 3 → Missing 3 fields
3. Heikkiläntie 1 → Missing 4 fields
```

**For each property:**
1. Open https://linear.fi/admin
2. Search by property ID or address
3. Fill in missing fields from the "Missing" list
4. Save

### **STEP 4: Bulk Fix Common Issues (optional, 30 min)**

If many properties miss the same field:
```bash
# Example: 20 apartments missing energyClass

1. Export all properties from Linear to CSV
2. Filter for apartments with empty energyClass
3. Set default "D" for all
4. Import back to Linear
```

### **STEP 5: Verify Improvement (2 min)**
```bash
npm run data-quality:blueprint

# Compare:
Before: Overall Average: 86.2%
After:  Overall Average: 92.7% (+6.5%) ✅
```

---

## 📊 SCORING EXPLAINED

### **Compliance Score Formula:**
```
Score = (Filled Fields / Required Fields) × 100%

Example: Bernhardinkatu 1
- Required: 18 fields (apartment type)
- Filled: 13 fields
- Score: 13/18 × 100% = 72.2%
```

### **Quality Rating:**
| Score | Rating | Action |
|-------|--------|--------|
| 90-100% | 🟢 EXCELLENT | Maintenance only |
| 80-89% | 🟡 GOOD | Minor improvements |
| 70-79% | 🟠 NEEDS ATTENTION | Focus fixes here |
| <70% | 🔴 POOR | Urgent action needed |

### **Overall vs. Per-Property:**
- **Overall Average:** Average of all property scores
- **By Type Average:** Average within each property type
- **Individual Score:** Score for a single property

---

## 🔍 PLACEHOLDER DETECTION

Blueprint mode detects these as "missing":

| Language | Placeholders |
|----------|--------------|
| Finnish | "Ei ilmoitettu" |
| Swedish | "Ej angivet", "Uppgift saknas" |
| English | "Not specified", "Information missing" |
| Generic | "-", "–", "—", "" (empty) |

**Example:**
```javascript
meta.energyClass = "Ej angivet" → Detected as MISSING ✅
meta.energyClass = "D"          → Detected as PRESENT ✅
meta.energyClass = null         → Detected as MISSING ✅
```

---

## 🆚 SUMMARY vs BLUEPRINT MODE

| Feature | Summary Mode | Blueprint Mode |
|---------|--------------|----------------|
| **Purpose** | General missing field check | Type-specific validation |
| **Fields Checked** | Fixed list (5 categories) | Dennis Implementation Blueprint |
| **Type-Aware** | Partial (apartment-only fields) | Full (apartment/property/rental) |
| **Placeholder Detection** | Basic (null/empty) | Advanced (localized) |
| **JSON Export** | No | Yes (`reports/data-quality-blueprint.json`) |
| **Use Case** | Quick overview | Detailed compliance tracking |

**Recommendation:** Use **both**!
1. Run **Summary** for quick overview
2. Run **Blueprint** for detailed compliance
3. Or run **Full** mode for everything at once

---

## 🎯 30-DAY IMPROVEMENT PLAN

### **Week 1: Identify & Quick Wins (2h)**
```bash
# Day 1:
npm run data-quality:blueprint

# Day 2-7:
Fix top 3 worst properties
Target: 85%+ overall score
```

### **Week 2: Type-Specific Focus (3h)**
```bash
# Focus on worst-performing type
# If PROPERTY is at 79.3%:
- Fix all properties <80%
- Bulk edit common missing fields
Target: All types >85%
```

### **Week 3: Polish (2h)**
```bash
# Fix remaining <90% properties
# Verify all placeholders removed
Target: 90%+ overall score
```

### **Week 4: Maintenance & Monitoring (1h)**
```bash
# Weekly check:
npm run data-quality:blueprint > reports/weekly-check.txt

# For new properties:
- Use schema as checklist
- Verify before publishing
Target: Maintain 90%+ score
```

**Total:** 8 hours → +20-30% improvement! 🎯

---

## 🐛 TROUBLESHOOTING

### **Problem: "Failed to load schema"**
**Solution:**
```bash
# Verify file exists:
ls scripts/data-quality-schema.json

# If missing, re-download or recreate it
```

### **Problem: Property type detection wrong**
**Example:** House detected as apartment

**Solution:** Check `listingType` in Linear API
```javascript
// In Linear:
listingType should be: "OMAKOTITALO" or "DETACHEDHOUSE"
not: "KERROSTALO"
```

### **Problem: Field shows as "present" but displays "Ej angivet" on website**
**Solution:** The field has a placeholder value. Blueprint mode detects this! Fix in Linear.

### **Problem: Score doesn't improve after fixes**
**Solution:**
1. Wait 5 minutes (cache revalidation)
2. Re-run: `npm run data-quality:blueprint`
3. Check JSON export to verify changes

---

## 📈 TRACKING IMPROVEMENTS

### **Weekly Tracking:**
```bash
# Save weekly reports:
mkdir -p reports/weekly
npm run data-quality:blueprint > reports/weekly/2025-W44.txt

# Compare week-over-week:
diff reports/weekly/2025-W43.txt reports/weekly/2025-W44.txt
```

### **Git Tracking:**
```bash
# Commit JSON exports:
git add reports/data-quality-blueprint.json
git commit -m "📊 Data Quality: Week 44 - 92.7% (+6.5%)"
```

### **Metrics to Track:**
- Overall average score
- Score by property type
- Number of properties <80%
- Most common missing fields

---

## 💡 BEST PRACTICES

### **1. Use Blueprint as Checklist**
When adding new properties to Linear:
- Open `scripts/data-quality-schema.json`
- Use the required fields list as a checklist
- Verify all fields before publishing

### **2. Type-Specific Validation**
Different property types need different fields:
- **Apartment:** Company info required
- **Property:** Property tax required
- **Rental:** Contract terms required

### **3. Localized Placeholders**
Always remove placeholders like "Ej angivet":
- Don't leave empty if unknown
- Use sensible defaults (e.g., energyClass: "D")
- Or omit field entirely (Blueprint will flag it)

### **4. Regular Validation**
Run blueprint validation:
- Before every deployment
- Weekly for maintenance
- After bulk imports
- When adding new property types

---

## 🎉 SUCCESS METRICS

### **Current State (example from screenshot):**
```
❌ Overall: 86.2%
❌ Apartments: 88.5% (5 properties <80%)
❌ Properties: 79.3% (3 properties <70%)
```

### **After Week 1:**
```
✅ Overall: 92.7% (+6.5%)
✅ Apartments: 94.2% (1 property <80%)
✅ Properties: 88.1% (0 properties <70%)
```

### **After Week 4 (target):**
```
🎉 Overall: 95.8% (+9.6%)
🎉 Apartments: 96.5% (0 properties <80%)
🎉 Properties: 93.2% (0 properties <80%)
🎉 All properties >80% complete!
```

---

## 🔗 RELATED RESOURCES

- `DATA-QUALITY-GUIDE.md` - General data quality guide
- `FIELD-MAPPING-BLUEPRINT.md` - Field mapping reference
- `DENNIS-FEEDBACK-TRACKER.md` - Feedback tracking
- `scripts/data-quality-schema.json` - Blueprint schema definition

---

## 📞 SUPPORT

**Script Issues?**
- Check that Node.js is installed: `node --version`
- Verify env vars are set (see DATA-QUALITY-GUIDE.md)

**Schema Issues?**
- Validate JSON: `node -e "console.log(JSON.parse(require('fs').readFileSync('scripts/data-quality-schema.json')))"`

**Linear API Issues?**
- Check API key is valid
- Verify company ID is correct
- Test endpoint: https://linear-external-api.azurewebsites.net/v2/listings

---

**🎯 Start improving your data quality today!**

```bash
npm run data-quality:blueprint
```

**From 86% to 95%+ in just 4 weeks! 🚀**

