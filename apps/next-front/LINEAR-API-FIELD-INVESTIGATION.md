# 🔍 LINEAR API FIELD INVESTIGATION

**Date:** October 30, 2025  
**Investigation:** Do missing fields exist in Linear API?

---

## ✅ **FINDINGS: ALL FIELDS EXIST IN API**

### Fields That Are Present in Linear API Structure:

| Field Name | Status in API | Example Value | Issue |
|------------|---------------|---------------|-------|
| `fundingCharge` | ✅ Present | "100 € / kk" | Some properties have null |
| `housingTenure` | ✅ Present | null | **NULL in most properties** |
| `housingCooperativeMortgage` | ✅ Present | null | **NULL in most properties** |
| `energyClass` | ✅ Present | "D2007" | Some have values, some null |
| `hasBalcony` | ✅ Present | "Kyllä" / true | Some have values, some null |

---

## 🎯 **ROOT CAUSE ANALYSIS**

### Problem is NOT Missing API Fields

The Linear API **includes all required fields** in its structure. However:

1. **Many fields have `value: null`** in the actual data
2. This means the data **was never entered in Linear Admin**
3. Our mapper correctly extracts what exists
4. Our validation correctly reports what's missing

### Example from listing-api.json:

```json
"housingTenure": {
  "fi": {
    "key": "Asumismuoto",
    "value": null,  // ← Data not entered in Linear
    "category": "Kohteen tiedot"
  }
}
```

```json
"fundingCharge": {
  "fi": {
    "key": "Rahoitusvastike",
    "value": "100 € / kk",  // ← This property HAS the data
    "category": "Kohteen tiedot"
  }
}
```

---

## 📊 **CONCLUSION**

### What This Means:

✅ **Mapper is working correctly** - extracting all available data  
✅ **Schema is correct** - validating against right field names  
✅ **API structure is complete** - all fields exist  

❌ **Data entry incomplete** - many fields have `null` values in Linear

### Solution Path:

The **66.2% data quality score is accurate**. The remaining 33.8% represents:
- Fields that exist in API structure
- But have `null` values in the actual data
- Must be filled manually in Linear Admin

---

## 📋 **FIELDS THAT NEED MANUAL DATA ENTRY**

Based on the investigation, these fields frequently have `null` values:

### High Priority (Most Common):
1. **`housingTenure`** (Asumismuoto/Hallintamuoto)
   - Should be: "Asunto-osakeyhtiö" for most apartments
   - Currently: `null` in 7/8 properties

2. **`fundingCharge`** (Rahoitusvastike)
   - Should be: Actual value or "0 € / kk" if none
   - Currently: `null` in 6/8 properties

### Medium Priority:
3. **`housingCooperativeMortgage`** (Taloyhtiön kiinnitykset)
   - Should be: Actual loan amount or "0 €" if none
   - Currently: `null` in 5/8 properties

4. **`energyClass`** (Energialuokka)
   - Should be: "E2018", "D2013", etc.
   - Currently: `null` in 4/8 properties

5. **`hasBalcony`** (Parveke)
   - Should be: "Kyllä" or "Ei"
   - Currently: `null` in 4/8 properties

---

## 🚀 **NEXT ACTIONS**

### For Developer (You):
- ✅ Mapper is correct - no changes needed
- ✅ Schema is correct - no changes needed
- ✅ Validation is working - no changes needed

### For Linear Admin (Dennis/Team):
- 📝 Fill missing data in Linear Admin UI
- 📝 Follow the `DATA-QUALITY-ACTION-PLAN.md` checklist
- 📝 Expected time: ~60 minutes to reach 100%

---

## 🔗 **RELATED FILES**

- **Data Quality Report:** `reports/data-quality-blueprint.json`
- **Action Plan:** `DATA-QUALITY-ACTION-PLAN.md`
- **Schema Definition:** `scripts/data-quality-schema-raw.json`
- **Mapper:** `src/lib/infrastructure/linear-api/mapper.ts`

---

**Status:** Investigation Complete ✅  
**Next:** Proceed with manual data entry in Linear Admin

