# Data Quality Report - Sotheby's Property Listings

**Generated:** 2025-10-20  
**Properties Analyzed:** 6  
**Total PDX Fields:** 54  
**Phase:** 2 Complete (UI displays 98% of PDX fields)

---

## 📊 EXECUTIVE SUMMARY

| Metric | Value |
|--------|-------|
| **UI Field Coverage** | **98%** (53/54 fields displayed) |
| **Average Data Coverage** | **59%** (32/54 fields populated) |
| **Best Property** | Heikkiläntie 1 (63%) |
| **Worst Property** | Helsingintie 99 (54%) |
| **Data Gap** | **41%** (22 fields empty across most properties) |

**Key Insight:** The UI is ready to display 98% of PDX-required fields, but the **Linear API data itself is only 59% complete** on average.

---

## 🏆 PROPERTY RANKINGS BY DATA COMPLETENESS

| # | Property | City | Coverage | Populated | Missing |
|---|----------|------|----------|-----------|---------|
| 1 | Heikkiläntie 1 | Helsinki | 63% | 34/54 | 20 |
| 2 | Bernhardinkatu 1 | Helsinki | 61% | 33/54 | 21 |
| 3 | Pengerkatu 25 | Helsinki | 61% | 33/54 | 21 |
| 4 | Kauppiaankatu 8-10 | Helsinki | 59% | 32/54 | 22 |
| 5 | Mailatie 3 | Kittilä | 57% | 31/54 | 23 |
| 6 | Helsingintie 99 | Porvoo | 54% | 29/54 | 25 |

---

## ❌ LEAST POPULATED FIELDS (0% Across All Properties)

These fields exist in the UI but have **no data** in the Linear API:

| Field | UI Label | Expected Usage |
|-------|----------|----------------|
| `region` | Kaupunginosa | Hero section (district name) |
| `paymentMethod` | Maksutapa | Price section |
| `siteOwnershipType` | Tontin omistus | Property info (Oma/Vuokrattu) |
| `zoningSituation` | Kaavoitustilanne | Property info |
| `buildingRights` | Rakennusoikeus | Property info |
| `propertyId` | Kiinteistötunnus | Property info |
| `leaseTerm` | Vuokra-aika | Property info (for rentals) |
| `housingCompanyName` | Yhtiön nimi | Housing company section |
| `businessId` | Y-tunnus | Housing company section |
| `managerName` | Isännöitsijä | Housing company section |

**Impact:** The new **Yhtiötiedot (Housing Company)** section will be empty for all current properties because the Linear API doesn't provide this data.

---

## 📈 WELL-POPULATED FIELDS (100% Coverage)

These fields have data for **all 6 properties**:

- ✅ `streetAddress` (Address)
- ✅ `postalCode` (Postal Code)
- ✅ `city` (City)
- ✅ `salesPrice` (Myyntihinta)
- ✅ `unencumberedSalesPrice` (Velaton hinta)
- ✅ `livingArea` (Living area)
- ✅ `floorLocation` (Floor)
- ✅ `yearOfBuilding` (Construction year)
- ✅ `energyClass` (Energy class)
- ✅ `heatingSystem` (Heating system)
- ✅ `buildingMaterial` (Building material)
- ✅ `roofType` (Roof type)
- ✅ `estateAgentName` (Agent name)
- ✅ `estateAgentPhone` (Agent phone)
- ✅ `estateAgentEmail` (Agent email)
- ✅ `listingOffice` (Office)
- ✅ `photoUrls` (Images)

---

## 🟡 PARTIALLY POPULATED FIELDS (17-83% Coverage)

| Field | Coverage | Notes |
|-------|----------|-------|
| `apartmentType` | 83% (5/6) | Missing for 1 property |
| `maintenanceFee` | 83% (5/6) | Critical for cost calculation |
| `numberOfShares` | 83% (5/6) | Important for Osake |
| `sauna` | 83% (5/6) | Boolean field |
| `balcony` | 83% (5/6) | Boolean field |
| `floorPlanUrl` | 33% (2/6) | Missing for most properties |
| `debtPart` | 17% (1/6) | Should be calculated from other fields |
| `financingFee` | 17% (1/6) | Often zero, but should be shown |
| `totalFee` | 17% (1/6) | Calculated field (maintenance + financing) |

---

## 🎯 RECOMMENDATIONS

### 1. **Data Entry Priorities** (High Impact)
Fill these fields to improve Yhtiötiedot section:
- `housingCompanyName` (Yhtiön nimi)
- `businessId` (Y-tunnus)
- `managerName` + `managerPhone` + `managerEmail` (Isännöitsijä)
- `propertyMaintenance` (Kiinteistönhoito)

### 2. **Automated Calculations** (Quick Win)
Implement server-side calculations for:
- `debtPart` = `unencumberedSalesPrice` - `salesPrice` ✅ (Already implemented!)
- `totalFee` = `maintenanceFee` + `financingFee`

### 3. **Linear API Integration** (Long Term)
Request these fields from Linear API provider:
- Housing company information
- Property/land ownership details
- Zoning and building rights
- Kitchen/bathroom equipment descriptions

### 4. **UI Conditional Display** ✅ (Already Implemented)
Sections only show when data is available:
- Yhtiötiedot: Hidden if all company fields are empty
- Varusteet ja tilat: Hidden if all equipment fields are empty
- Esitteet ja videot: Hidden if no brochure/video URLs

---

## 📸 SAMPLE PROPERTY ANALYSIS: Heikkiläntie 1 (Best: 63%)

### ✅ Strong Data (34 populated fields)
- Complete basic info (address, type, floor, area)
- Complete pricing (sales price, debt-free price, maintenance fee)
- Complete building info (year, material, heating, roof, energy class)
- Complete agent info
- Rich media (37 photos, floorplan)

### ❌ Missing Data (20 fields)
- No housing company info (name, Y-tunnus, manager)
- No equipment details (kitchen, bathroom)
- No zoning/property ID
- No district/region name

---

## 🌍 MULTILINGUAL STATUS

| Language | Status | Next Steps |
|----------|--------|------------|
| 🇫🇮 Finnish | ✅ Complete | All 53 fields labeled |
| 🇸🇪 Swedish | ⏳ Pending | Add translations |
| 🇬🇧 English | ⏳ Pending | Add translations |

---

## 🚀 NEXT ACTIONS

1. ✅ **Phase 1 Complete:** Add missing price fields, Yhtiötiedot, Rakennustiedot
2. ✅ **Phase 2 Complete:** Add Varusteet, Sijainti, Media sections  
3. ⏳ **Phase 3 Pending:** Swedish translations
4. ⏳ **Phase 4 Pending:** English translations
5. 📊 **Phase 5 Future:** Data quality improvement (fill empty fields)

---

**Report Tool:** `node scripts/generate-field-report.js`  
**Last Updated:** 2025-10-20

