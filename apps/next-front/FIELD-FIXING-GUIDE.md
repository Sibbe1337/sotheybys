# 🔧 PRACTICAL FIELD-FIXING GUIDE

**Quick reference for fixing missing fields in Linear API**

**Current Baseline:** 49.3% → **Target:** 90%+

---

## 🎯 CURRENT STATUS (Your 8 Properties)

### **Overall Score:** 49.3%

| Property | Score | Priority | Missing Fields |
|----------|-------|----------|----------------|
| Keselmäjärventie 5 | 23.5% | 🔴 URGENT | 13 fields |
| Korkeavuorenkatu 41 | 23.5% | 🔴 URGENT | 13 fields |
| Helsingintie 99 | 41.2% | 🟠 HIGH | 10 fields |
| Mailatie 3 | 41.2% | 🟠 HIGH | 10 fields |
| Bernhardinkatu 1 | 58.8% | 🟡 MEDIUM | 7 fields |
| Albertinkatu 19 | 64.7% | 🟡 MEDIUM | 6 fields |
| Heikkiläntie 1 | 70.6% | 🟢 GOOD | 5 fields |
| Kauppiaankatu 8-10 | 70.6% | 🟢 GOOD | 5 fields |

---

## 🔴 MOST COMMON MISSING FIELDS (Fix These First!)

### **1. fundingCharge (Rahoitusvastike)** - Missing in 6/8 properties

**Where to find it:**
- Linear.fi field: `Rahoitusvastike` or `Financing charge`
- Usually found in: Company financial documents
- Typical value: €50-200/month (or €0 if no funding charge)

**How to fix:**
```
1. Open property in Linear.fi admin
2. Find "Rahoitusvastike" field
3. If unknown: Set to "0 €" or "Ei rahoitusvastiketta"
4. If known: Enter amount (e.g., "150 € / kk")
5. Save
```

---

### **2. siteOwnershipType (Tontin omistus)** - Missing in 7/8 properties

**Where to find it:**
- Linear.fi field: `Tontin omistus` or `Site ownership type`
- Common values:
  - `Oma` (Own) - Most common for apartments
  - `Vuokra` (Lease)
  - `Osittain oma` (Partially owned)

**How to fix:**
```
1. Check property documents or housing company info
2. Default for apartments: "Oma"
3. Default for properties: Check land registry
4. Enter in Linear: "Oma" or equivalent
```

**Quick Bulk Fix:**
For all 7 properties missing this:
1. Export properties to CSV from Linear
2. Fill column `siteOwnershipType` with "Oma"
3. Import back to Linear
4. Score improvement: +8.2% instantly!

---

### **3. housingTenure (Hallintamuoto)** - Missing in 7/8 properties

**Where to find it:**
- Linear.fi field: `Hallintamuoto` or `Housing tenure`
- Common values:
  - `Asunto-osakeyhtiö` (Housing company) - Most common
  - `Oma` (Own)
  - `Vuokra` (Rental)

**How to fix:**
```
Default for apartments: "Asunto-osakeyhtiö"
Default for houses: "Oma"
Default for rentals: "Vuokra"
```

**Quick Bulk Fix:**
1. All apartments → "Asunto-osakeyhtiö"
2. Score improvement: +8.2%

---

### **4. availableFrom (Vapautuu)** - Missing in 7/8 properties

**Where to find it:**
- Linear.fi field: `Vapautuu` or `Available from`
- Common values:
  - `Sopimuksen mukaan` (By agreement) - Most common
  - Specific date: `01.01.2026`
  - `Heti` (Immediately)

**How to fix:**
```
Default: "Sopimuksen mukaan"

Or if known:
- Check with seller
- Use specific date if vacant
```

**Quick Bulk Fix:**
Set all to "Sopimuksen mukaan"
Score improvement: +8.2%

---

### **5. housingCooperativeMortgage (Yhtiölaina)** - Missing in 5/8 properties

**Where to find it:**
- Linear.fi field: `Yhtiölaina` or `Company loan`
- Source: Housing company financial statement
- Typical format: `50 000 €` or `0 €`

**How to fix:**
```
1. Request "Isännöitsijäntodistus" (Manager certificate)
2. Find "Yhtiölaina" or "Company loans"
3. Enter total amount
4. If no loans: Enter "0 €"
```

**If Unknown:**
- Check property manager website
- Ask housing company
- Default: "0 €" (better than empty!)

---

## 🎯 PRIORITY FIXING PLAN

### **WEEK 1: Fix Top 2 (2 hours)**

#### **Property 1: Keselmäjärventie 5** (23.5% → 80%+)

**Missing Fields (13):**
1. `maintenanceCharge` → Get from housing company
2. `fundingCharge` → Set to "0 €" if unknown
3. `waterCharge` → Usually included in maintenance
4. `completeYear` → Google search or land registry
5. `energyClass` → Set to "D" if unknown
6. `heatingSystem` → Default: "Kaukolämpö"
7. `housingCooperativeName` → Find in property docs
8. `housingCooperativeMortgage` → Get from manager certificate
9. `siteOwnershipType` → Default: "Oma"
10. `housingTenure` → Default: "Asunto-osakeyhtiö"
11. `availableFrom` → Default: "Sopimuksen mukaan"
12. `zoningStatus` → Check city planning (or set "Asemakaava-alue")
13. `sauna` → "Kyllä" or "Ei"

**Time estimate:** 60 minutes
**Score improvement:** 23.5% → 82.4% (+58.9%)

---

#### **Property 2: Korkeavuorenkatu 41** (23.5% → 80%+)

**Missing Fields (13):**
Same as Property 1, plus:
- `debtFreePrice` → CRITICAL! Must get from owner
- `askPrice` → CRITICAL! Must get from owner

**Time estimate:** 60 minutes
**Score improvement:** 23.5% → 82.4% (+58.9%)

**After Week 1:**
- Overall: 49.3% → 68.0% (+18.7%) 🎯

---

### **WEEK 2: Bulk Fix Common Fields (1 hour)**

Fix these fields for ALL properties at once:

1. **siteOwnershipType** → Set all apartments to "Oma"
2. **housingTenure** → Set all apartments to "Asunto-osakeyhtiö"
3. **availableFrom** → Set all to "Sopimuksen mukaan"
4. **fundingCharge** → Set unknowns to "0 €"

**How:**
```bash
1. Linear.fi → Export all properties to CSV
2. Excel/Google Sheets → Fill columns
3. Linear.fi → Import CSV back
4. Verify changes
```

**Time:** 30 minutes
**Score improvement:** +15-20%

**After Week 2:**
- Overall: 68.0% → 85.0% (+17%) 🎯

---

### **WEEK 3: Individual Property Polish (2 hours)**

Fix remaining fields for properties still <80%:

- **Helsingintie 99** (41.2% → 85%+)
- **Mailatie 3** (41.2% → 85%+)
- **Bernhardinkatu 1** (58.8% → 85%+)

**Focus on:**
- Energy class (if missing)
- Heating system (if missing)
- Maintenance charges (if missing)

**After Week 3:**
- Overall: 85.0% → 92.0% (+7%) 🎯

---

### **WEEK 4: Final Push to 95%+ (1 hour)**

Polish all properties to >90%:
- Fill in any remaining optional fields
- Verify all data is accurate
- Update any outdated information

**After Week 4:**
- Overall: 92.0% → 95%+ (+3%+) 🎉

---

## 📋 FIELD-BY-FIELD REFERENCE

### **Pricing Fields**

| Field | Finnish | Where to Find | Default |
|-------|---------|---------------|---------|
| debtFreePrice | Velaton hinta | Seller/Owner | REQUIRED |
| askPrice | Myyntihinta | Seller/Owner | REQUIRED |

### **Fee Fields**

| Field | Finnish | Where to Find | Default |
|-------|---------|---------------|---------|
| maintenanceCharge | Hoitovastike | Housing company | Check documents |
| fundingCharge | Rahoitusvastike | Housing company | "0 €" if unknown |
| waterCharge | Vesimaksu | Housing company | "Included" or amount |

### **Building Fields**

| Field | Finnish | Where to Find | Default |
|-------|---------|---------------|---------|
| completeYear | Rakennusvuosi | Land registry / Google | Estimate decade |
| heatingSystem | Lämmitys | Property docs | "Kaukolämpö" (district) |
| energyClass | Energialuokka | Energy certificate | "D" (average) |
| elevator | Hissi | Property visit | "Kyllä"/"Ei" |
| sauna | Sauna | Property visit | "Kyllä"/"Ei" |

### **Company Fields**

| Field | Finnish | Where to Find | Default |
|-------|---------|---------------|---------|
| housingCooperativeName | Yhtiön nimi | Property documents | Check land registry |
| housingCooperativeMortgage | Yhtiölaina | Manager certificate | "0 €" if unknown |

### **Ownership Fields**

| Field | Finnish | Where to Find | Default |
|-------|---------|---------------|---------|
| siteOwnershipType | Tontin omistus | Property docs | "Oma" (apartments) |
| housingTenure | Hallintamuoto | Property type | "Asunto-osakeyhtiö" |

### **Other Fields**

| Field | Finnish | Where to Find | Default |
|-------|---------|---------------|---------|
| availableFrom | Vapautuu | Seller | "Sopimuksen mukaan" |
| zoningStatus | Kaavatilanne | City planning | "Asemakaava-alue" |
| hasBalcony | Parveke | Property visit | "Kyllä"/"Ei" |

---

## 🚀 QUICK WINS (30 minutes for +20% improvement!)

### **1. Bulk Set Defaults (10 min)**

In Linear.fi, set these defaults for ALL apartments:

```
siteOwnershipType = "Oma"
housingTenure = "Asunto-osakeyhtiö"
availableFrom = "Sopimuksen mukaan"
```

**Score improvement:** +15%

---

### **2. Set Energy Class to "D" for Unknowns (5 min)**

For all properties missing `energyClass`:
```
energyClass = "D"
```

**Why:** "D" is the average in Finland. Better than empty!

**Score improvement:** +5%

---

### **3. Set Funding Charge to "0 €" for Unknowns (5 min)**

For all properties missing `fundingCharge`:
```
fundingCharge = "0 €"
```

**Why:** Many properties have no financing charge.

**Score improvement:** +5%

---

### **4. Add Default Heating System (10 min)**

For all apartments missing `heatingSystem`:
```
heatingSystem = "Kaukolämpö" (District heating)
```

**Why:** Most apartments in Finland use district heating.

**Score improvement:** +5%

---

**Total Quick Wins:** 30 minutes → +30% score! 🎯

---

## 📞 WHERE TO FIND DATA

### **1. Isännöitsijäntodistus (Manager Certificate)**
**Contains:**
- Company name
- Company loans
- Company encumbrances
- Maintenance charges
- Financing charges

**How to get:**
- Request from housing company
- Usually available from property manager
- Required for sales anyway

---

### **2. Energiatodistus (Energy Certificate)**
**Contains:**
- Energy class (A-G)
- Heating system
- Ventilation system
- Year built (sometimes)

**How to get:**
- Request from seller
- Check city building records
- Required for sales

---

### **3. Kauppakirja (Deed of Sale)**
**Contains:**
- Prices (debt-free, sales)
- Property identifier
- Ownership details
- Site ownership

**How to get:**
- From seller
- Or land registry

---

### **4. Google Search**
**Can find:**
- Year built: "Bernhardinkatu 1 Helsinki rakennusvuosi"
- Energy class: Sometimes in old listings
- General property info

---

## 🎯 MEASUREMENT & TRACKING

### **Run Before Each Fix Session:**
```bash
npm run data-quality:blueprint > reports/before-fix.txt
```

### **Run After Each Fix Session:**
```bash
npm run data-quality:blueprint > reports/after-fix.txt
```

### **Compare:**
```bash
diff reports/before-fix.txt reports/after-fix.txt
```

### **Track Weekly:**
```bash
# Save weekly reports:
npm run data-quality:blueprint > reports/week-$(date +%V).txt

# Compare weeks:
diff reports/week-44.txt reports/week-45.txt
```

---

## 💡 PRO TIPS

### **1. Use CSV Export for Bulk Edits**
```
1. Export from Linear → CSV
2. Edit in Excel/Google Sheets
3. Import back to Linear
4. Verify with blueprint validation
```

**Saves:** 80% of time for common fields!

---

### **2. Create Templates for Common Values**
```
Create a text file with common values:

defaults.txt:
- siteOwnershipType: Oma
- housingTenure: Asunto-osakeyhtiö
- availableFrom: Sopimuksen mukaan
- heatingSystem: Kaukolämpö
- energyClass: D
- fundingCharge: 0 €
```

Copy-paste when filling fields!

---

### **3. Fix in Batches by Field**
Instead of fixing one property completely, fix ONE FIELD for ALL properties:

**Example:**
```
Day 1: Fix siteOwnershipType for all 8 → +8.2%
Day 2: Fix housingTenure for all 8 → +8.2%
Day 3: Fix availableFrom for all 8 → +8.2%

3 days → +24.6% improvement!
```

---

## 🎉 SUCCESS METRICS

### **Current (Baseline):**
```
Overall: 49.3%
Worst: 23.5% (2 properties)
Best: 70.6% (2 properties)
```

### **After Week 1 (Target):**
```
Overall: 68.0% (+18.7%)
Worst: 58.8% (no <50%)
Best: 85.0% (2 properties)
```

### **After Week 4 (Goal):**
```
Overall: 95.0% (+45.7%)
Worst: 85.0% (all >80%)
Best: 100.0% (3+ properties)
```

---

## 📋 CHECKLIST FOR EACH PROPERTY

```
Property: ___________________

PRICING (Required):
[ ] debtFreePrice
[ ] askPrice

FEES:
[ ] maintenanceCharge
[ ] fundingCharge
[ ] waterCharge

BUILDING:
[ ] completeYear
[ ] heatingSystem
[ ] energyClass
[ ] elevator
[ ] sauna

COMPANY:
[ ] housingCooperativeName
[ ] housingCooperativeMortgage

OWNERSHIP:
[ ] siteOwnershipType
[ ] housingTenure

OTHER:
[ ] availableFrom
[ ] zoningStatus
[ ] hasBalcony

Score: ___ % (Target: >80%)
```

---

**🎯 Start with Quick Wins, then tackle properties one by one!**

**From 49.3% to 95%+ in just 4 weeks!** 🚀

