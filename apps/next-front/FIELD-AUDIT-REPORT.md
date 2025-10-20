# Property Page Field Audit Report

**Generated:** 2025-10-20  
**Based on:** PDX-Osake and PDX-Kiinteistö PDFs  
**Current Implementation:** `/src/app/property/[slug]/page.tsx`

---

## ✅ CURRENTLY DISPLAYED

### 1. Hero Section (Top of Page)
- ✅ Price (Myyntihinta)
- ✅ Address
- ✅ Postal Code + City
- ✅ Area (living area)

### 2. Hintatiedot (Price Information) - Collapsible Section
- ✅ Myyntihinta (`price`)
- ✅ Velkaosuus (`debtPart`)
- ✅ Velaton hinta (`debtFreePrice`)
- ✅ Kiinteistövero (`propertyTax`)

### 3. Energialuokitus (Energy Rating) - Collapsible Section
- ✅ Energialuokka (`energyClass`)

### 4. Kiinteistötiedot (Property Info) - Collapsible Section
- ✅ Kiinteistön tunnus (`propertyId`)
- ✅ Tontin pinta-ala (`plotArea`)
- ✅ Tontin omistus (`plotOwnership`)

### 5. Rakennustiedot (Building Info) - Collapsible Section
- ✅ Rakennusvuosi (`yearBuilt`)
- ✅ Rakennusaine (`buildingMaterial`)
- ✅ Lämmitys (`heating`)

### 6. Muut tiedot (Other Info) - Collapsible Section
- ✅ Vapautuu (`availability`)

### 7. Media
- ✅ Gallery images
- ✅ Floor plan

### 8. Description
- ✅ Property description (Kuvaus)

---

## ❌ MISSING CRITICAL FIELDS

### Perustiedot (Basic Info)
- ❌ **Kaupunginosa** (`region`) - Should show in hero
- ❌ **Asunnon tyyppi** (`apartmentType`) - e.g., "2h+k", "Kerrostaloasunto"
- ❌ **Omistusmuoto** (`ownershipType`) - "Oma" / "Vuokra"
- ❌ **Kerros / Kerroksia** (`floorLocation`, `numberOfFloors`) - e.g., "13 / 21"
- ❌ **Ikkunoiden suunta** (`windowDirection`) - e.g., "Etelä"

### Hintatiedot (Price Information)
- ❌ **Yhtiövastike** (`maintenanceFee`) - e.g., "894,99 €/kk"
- ❌ **Rahoitusvastike** (`financingFee`) - e.g., "344,44 €/kk"
- ❌ **Kokonaisvastike** (`totalFee`) - sum of above
- ❌ **Vesimaksu** (`waterFee`) - e.g., "20 €/hlö/kk"
- ❌ **Maksutapa** (`paymentMethod`) - e.g., "Käteinen"

### Energialuokitus (Energy)
- ❌ **Energiatodistus** (`energyCertificate`) - Kyllä/Ei
- ❌ **Lämmitysjärjestelmä** (`heatingSystem`) - More specific than just "Lämmitys"

### Rakennustiedot (Building)
- ❌ **Kattotyyppi** (`roofType`) - e.g., "Harjakatto"
- ❌ **Kunto** (`condition`) - e.g., "Hyvä", "Erinomainen"
- ❌ **Sauna** (`sauna`) - Kyllä/Ei
- ❌ **Parveke** (`balcony`) - Kyllä/Ei
- ❌ **Hissi** (`elevator`) - Kyllä/Ei

### Kiinteistötiedot (Property/Site)
- ❌ **Kaavoitustilanne** (`zoningSituation`) - e.g., "Yleiskaava"
- ❌ **Rakennusoikeus** (`buildingRights`)
- ❌ **Vuokra-aika** (`leaseTerm`) - For Kiinteistö only
- ❌ **Vuokra/vuosi** (`annualLease`) - For Kiinteistö only

### Yhtiötiedot (Housing Company Info) - ENTIRE SECTION MISSING
- ❌ **Yhtiön nimi** (`housingCompanyName`)
- ❌ **Y-tunnus** (`businessId`)
- ❌ **Isännöitsijä** (`managerName`, `managerPhone`, `managerEmail`)
- ❌ **Kiinteistönhoito** (`propertyMaintenance`)
- ❌ **Lunastuspykälä** (`redemptionClauseFlats`)
- ❌ **Osakkeiden numerot** (`numberOfShares`)

### Varusteet ja tilat (Equipment & Spaces) - ENTIRE SECTION MISSING
- ❌ **Keittiö** (`kitchenEquipment`)
- ❌ **Kph/WC** (`bathroomEquipment`)
- ❌ **Lattiamateriaalit** (`floorMaterial`)
- ❌ **Säilytystilat** (`storageSpace`)

### Sijainti ja ympäristö (Location & Environment) - ENTIRE SECTION MISSING
- ❌ **Näkymä / suunta** (`windowDirection`)
- ❌ **Palvelut** (`services`)
- ❌ **Ranta / rannan omistus** (`beachRights`)

### Media
- ❌ **Brochure PDF** (`brochureUrl`)
- ❌ **Video / Virtual Tour** (`videoUrl`)

### Välittäjätiedot (Agent Info) - PARTIAL
- ✅ Agent name, phone, email (shown but not in dedicated section)
- ❌ **Toimipiste** (`listingOffice`) - Office name

---

## 📊 COVERAGE SUMMARY

| Category | Fields Available | Fields Displayed | Missing | Coverage |
|----------|------------------|------------------|---------|----------|
| Perustiedot | 8 | 3 | 5 | 38% |
| Hintatiedot | 9 | 4 | 5 | 44% |
| Energialuokitus | 3 | 1 | 2 | 33% |
| Rakennustiedot | 6 | 3 | 3 | 50% |
| Kiinteistötiedot | 7 | 3 | 4 | 43% |
| Yhtiötiedot | 6 | 0 | 6 | 0% |
| Varusteet ja tilat | 4 | 0 | 4 | 0% |
| Sijainti ja ympäristö | 3 | 0 | 3 | 0% |
| Media | 4 | 2 | 2 | 50% |
| Välittäjätiedot | 4 | 3 | 1 | 75% |
| **TOTAL** | **54** | **19** | **35** | **35%** |

---

## 🎯 PRIORITY FIXES

### HIGH PRIORITY (Always Show)
1. ✅ **Myyntihinta, Velkaosuus, Velaton hinta** - FIXED
2. **Yhtiövastike + Rahoitusvastike** - Critical for cost calculation
3. **Asunnon tyyppi** (apartmentType) - Should show in hero (e.g., "2h+k")
4. **Kerros / Kerroksia** - Important for apartments
5. **Yhtiötiedot section** - Essential for Osake properties

### MEDIUM PRIORITY (Show if Available)
6. **Kunto** (condition) - Important quality indicator
7. **Sauna, Parveke, Hissi** - Common search criteria
8. **Lämmitysjärjestelmä** - Important for running costs
9. **Varusteet section** - Helps with property evaluation

### LOW PRIORITY (Nice to Have)
10. **Sijainti section** - Location benefits
11. **Video/Brochure** - Marketing materials
12. **Kaavoitustilanne** - Planning info

---

## 🔧 RECOMMENDED ACTIONS

1. **Add Yhtiötiedot section** (0% coverage → critical gap)
2. **Expand Hintatiedot** to include maintenance fees (44% → 100%)
3. **Add Varusteet ja tilat section** (0% → new section)
4. **Enhance Rakennustiedot** with sauna/balcony/elevator (50% → 100%)
5. **Add apartmentType to hero** (improve first impression)
6. **Add Sijainti section** for location benefits

---

## 📝 NOTES

- Current implementation shows ~35% of PDX-required fields
- 3 entire sections are missing (Yhtiötiedot, Varusteet, Sijainti)
- Hero section should be enhanced with apartmentType and region
- Price section is good but missing recurring fees (vastike)
- All fields from `PROPERTY-FIELDS-MAP.json` should be mapped

---

**Next Step:** Update `property/[slug]/page.tsx` to add missing sections and fields based on `PROPERTY-FIELDS-MAP.json`.

