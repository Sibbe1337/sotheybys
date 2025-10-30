# 📊 DATA QUALITY ACTION PLAN

**Current Score:** 66.2% (53/80 required fields filled)
**Target:** 100%
**Date:** October 30, 2025

---

## 🎯 PRIORITY ACTIONS

### Most Impactful Fields to Fill

These fields are missing most frequently across properties:

| Field | Missing in | Impact |
|-------|-----------|--------|
| `fundingCharge` (Rahoitusvastike) | 6/8 properties | 🔴 HIGH |
| `housingTenure` (Hallintamuoto) | 7/8 properties | 🔴 HIGH |
| `housingCooperativeMortgage` (Yhtiölainat) | 5/8 properties | 🟡 MEDIUM |
| `energyClass` (Energialuokka) | 4/8 properties | 🟡 MEDIUM |
| `hasBalcony` (Parveke) | 4/8 properties | 🟢 LOW |

---

## 📝 PROPERTY-BY-PROPERTY CHECKLIST

### ✅ BEST PERFORMERS (>80% Complete)

#### 1. **Heikkiläntie 1, Helsinki** — 88.2% (15/17)
**Linear ID:** `d06327be-38a0-4600-8081-a6f2f3e1d07e`

Missing:
- [ ] `fundingCharge` → Enter financing charge (e.g., "0 €" or actual value)
- [ ] `housingTenure` → Enter ownership type (e.g., "Asunto-osakeyhtiö")

---

#### 2. **Kauppiaankatu 8-10, Helsinki** — 88.2% (15/17)
**Linear ID:** `68223bb9-6fec-4705-818c-bafd3273c5e0`

Missing:
- [ ] `fundingCharge` → Enter financing charge
- [ ] `housingTenure` → Enter ownership type

---

#### 3. **Albertinkatu 19, Helsinki** — 82.4% (14/17)
**Linear ID:** `76a09582-e427-4fa8-9b69-4bce9c75ee52`

Missing:
- [ ] `housingCooperativeMortgage` → Enter company loans (e.g., "0 €" if none)
- [ ] `housingTenure` → Enter ownership type
- [ ] `hasBalcony` → Enter "Kyllä" or "Ei"

---

### 🟡 MEDIUM PERFORMERS (50-80% Complete)

#### 4. **Bernhardinkatu 1, Helsinki** — 76.5% (13/17)
**Linear ID:** `829e5b81-b354-4693-8daa-3aa9944208cc`

Missing:
- [ ] `fundingCharge` → Enter financing charge
- [ ] `housingCooperativeMortgage` → Enter company loans
- [ ] `housingTenure` → Enter ownership type
- [ ] `hasBalcony` → Enter "Kyllä" or "Ei"

---

#### 5. **Helsingintie 99, Porvoo** — 58.8% (10/17)
**Linear ID:** `95cfc327-a42d-4558-90af-2aecb9a033e1`

Missing:
- [ ] `maintenanceCharge` → Enter maintenance charge
- [ ] `fundingCharge` → Enter financing charge
- [ ] `waterCharge` → Enter water charge
- [ ] `energyClass` → Enter energy class (e.g., "E2018")
- [ ] `housingCooperativeName` → Enter housing company name
- [ ] `housingCooperativeMortgage` → Enter company loans
- [ ] `housingTenure` → Enter ownership type

---

#### 6. **Mailatie 3, Kittilä** — 58.8% (10/17)
**Linear ID:** `6f07db23-5e7a-4606-a98e-10931e2dd278`

Missing:
- [ ] `maintenanceCharge` → Enter maintenance charge
- [ ] `fundingCharge` → Enter financing charge
- [ ] `waterCharge` → Enter water charge
- [ ] `energyClass` → Enter energy class
- [ ] `housingCooperativeName` → Enter housing company name
- [ ] `housingCooperativeMortgage` → Enter company loans
- [ ] `housingTenure` → Enter ownership type

---

### 🔴 NEEDS ATTENTION (<50% Complete)

#### 7. **Keselmäjärventie 5, Salla** — 41.2% (7/17)
**Linear ID:** `2e5cd8a6-e5b5-4889-bf9a-f223c7b6e327`

Missing:
- [ ] `maintenanceCharge` → Enter maintenance charge
- [ ] `fundingCharge` → Enter financing charge
- [ ] `waterCharge` → Enter water charge
- [ ] `energyClass` → Enter energy class
- [ ] `housingCooperativeName` → Enter housing company name
- [ ] `housingCooperativeMortgage` → Enter company loans
- [ ] `housingTenure` → Enter ownership type
- [ ] `hasBalcony` → Enter "Kyllä" or "Ei"
- [ ] `sauna` → Enter "Kyllä" or "Ei"
- [ ] `housingCooperativeElevator` → Enter "Kyllä" or "Ei"

---

#### 8. **Korkeavuorenkatu 41, Helsinki** — 35.3% (6/17) ⚠️ RENTAL
**Linear ID:** `9dc673a6-3d58-4a8e-aabc-b9b6bd2c1386`

**NOTE:** This is a RENTAL property, so many apartment fields may not apply.

Missing:
- [ ] `debtFreePrice` → N/A for rental (consider removing from schema)
- [ ] `askPrice` → N/A for rental
- [ ] `maintenanceCharge` → N/A for rental
- [ ] `fundingCharge` → N/A for rental
- [ ] `energyClass` → Enter energy class
- [ ] `housingCooperativeMortgage` → Enter company loans
- [ ] `lotOwnership` → Enter ownership type
- [ ] `housingTenure` → Enter ownership type
- [ ] `zoningStatus` → Enter zoning status
- [ ] `hasBalcony` → Enter "Kyllä" or "Ei"
- [ ] `sauna` → Enter "Kyllä" or "Ei"

---

## 🚀 QUICK WIN STRATEGY

### Step 1: Fill Common Fields (Impact: +21.3%)

Fill these fields for **ALL properties** where missing:

1. **`housingTenure`** (7 properties)
   - Default: `"Asunto-osakeyhtiö"` (for most apartments)
   
2. **`fundingCharge`** (6 properties)
   - Default: `"0 € / kk"` (if no financing charge)

**Expected Score After Step 1:** ~87.5%

---

### Step 2: Fill Energy Class (Impact: +5%)

For properties missing `energyClass`:
- Keselmäjärventie 5, Salla
- Helsingintie 99, Porvoo
- Mailatie 3, Kittilä
- Korkeavuorenkatu 41, Helsinki

**Recommended:** Check physical documents or estimate based on year built.

**Expected Score After Step 2:** ~92.5%

---

### Step 3: Fill Remaining Fields (Impact: +7.5%)

Focus on:
- `housingCooperativeMortgage` (5 properties)
- `hasBalcony` (4 properties)
- `maintenanceCharge`, `waterCharge` (for rural properties)

**Expected Score After Step 3:** 100%

---

## 🔧 HOW TO FILL DATA IN LINEAR

1. **Log in to Linear Admin:**
   ```
   https://linear.fi/admin
   ```

2. **Search by Linear ID:**
   - Copy the UUID from this document (e.g., `d06327be-38a0-4600-8081-a6f2f3e1d07e`)
   - Paste into Linear search bar

3. **Fill Missing Fields:**
   - Use Finnish language (`fi.value`)
   - Follow existing format/style
   - Use defaults for common fields (see recommendations above)

4. **Verify Changes:**
   ```bash
   npm run data-quality:blueprint
   ```

---

## 📈 EXPECTED TIMELINE

| Phase | Time | Score | Status |
|-------|------|-------|--------|
| Current | - | 66.2% | ✅ Complete |
| Quick Wins (Step 1) | 15 min | 87.5% | ⏳ Pending |
| Energy Class (Step 2) | 20 min | 92.5% | ⏳ Pending |
| Final Fields (Step 3) | 25 min | 100% | ⏳ Pending |
| **Total** | **~60 min** | **100%** | 🎯 Target |

---

## 🎯 SUCCESS CRITERIA

- [x] Blueprint validation running successfully
- [x] Schema aligned with Linear API
- [x] Mapper extracting all available data
- [ ] All 8 properties at 100% completeness
- [ ] Zero "Uppgift saknas" on frontend
- [ ] Data Quality Score: 100%

---

## 📞 NEED HELP?

If you encounter any issues:

1. **Field not in Linear Admin UI?**
   - Check field name mapping in `data-quality-schema-raw.json`
   - May need to contact Linear support

2. **Unsure what value to enter?**
   - Check similar properties for patterns
   - Use defaults (e.g., "Ei ilmoitettu")

3. **Score not improving?**
   - Run diagnostic: `npm run diagnose-api`
   - Check mapper: `apps/next-front/src/lib/infrastructure/linear-api/mapper.ts`

---

**Last Updated:** October 30, 2025  
**Next Review:** After filling Quick Win fields

