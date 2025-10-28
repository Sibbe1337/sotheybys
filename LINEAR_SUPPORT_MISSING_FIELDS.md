# Linear External API - Missing Fields Report

**Date:** 2025-10-28
**Reported by:** Sotheby's International Realty Development Team
**Priority:** High - Affects production data display

---

## Problem Summary

Multiple fields that are populated in Linear UI are returning `undefined`, `null`, or empty values via the Linear External API. This affects our ability to display complete property information to end users.

---

## Test Property

**Property:** Mailatie 3
**Property ID:** 80455627
**UUID:** 6f07db23-5e7a-4606-a98e-10931e2dd278
**API Endpoint:** `/v2/listings?languages[]=fi`

---

## Missing/Null Fields

### 1. ❌ Ilmanvaihto (Ventilation System)

**Linear UI Status:** ✅ Filled
**Value in UI:** "Koneellinen ilmanvaihto" (Mechanical ventilation)

**API Response:** ❌ All ventilation fields return undefined/empty

```json
{
  "ventilationType": undefined,
  "ventilationSystem": undefined,
  "ilmanvaihto": undefined,
  "ventilation": undefined,
  "ventilationMethod": undefined,
  "airConditioning": undefined,
  "nv_ventilationType": undefined,
  "nv_ventilationSystem": undefined
}
```

**Diagnosis:** No fields with "ventil" in key name exist in API response.

**Impact:** Critical - Ventilation information is mandatory for property listings but shows as "Not reported" on website.

---

### 2. ❌ Taloyhtiön lainat (Housing Company Loans)

**Linear UI Status:** ✅ Filled (confirmed by user Dennis)
**Value in UI:** 1,462,587.91 €

**API Response:** ❌ All loan fields return undefined

```json
{
  "companyLoans": undefined,
  "housingCooperativeLoans": undefined,
  "housingCompanyLoans": undefined,
  "taloyhtionLainat": undefined,
  "taloyhtiönLainat": undefined,
  "nv_companyLoans": undefined,
  "nv_housingCooperativeLoans": undefined
}
```

**Impact:** High - Financial information missing from property details.

---

### 3. ❌ Taloyhtiön lainan päivämäärä (Company Loans Date)

**Linear UI Status:** ✅ Filled (confirmed by user Dennis)
**Value in UI:** 04.05.2025

**API Response:** ❌ All loan date fields return undefined

```json
{
  "companyLoansDate": undefined,
  "housingCooperativeLoansDate": undefined,
  "housingCompanyLoansDate": undefined,
  "taloyhtionLainanPaivamaara": undefined
}
```

**Impact:** Medium - Date context missing for loan information.

---

### 4. ⚠️ Taloyhtiön kiinnitykset (Housing Company Mortgages)

**Linear UI Status:** ✅ Filled (confirmed by user Dennis)
**Value in UI:** 1,625,002.18 €

**API Response:** ⚠️ Field exists but returns null value

```json
{
  "housingCooperativeMortgage": {
    "fi": {
      "key": "Taloyhtiön kiinnitykset",
      "value": null,  // ❌ Should be 1,625,002.18 €
      "category": "Kohteen tiedot"
    }
  },
  "companyMortgages": undefined,
  "housingCompanyMortgages": undefined
}
```

**Impact:** High - Critical financial information shows null despite being filled.

---

## Working Fields (For Comparison)

These fields work correctly and return expected values:

```json
{
  "heatingSystem": {
    "fi": {
      "key": "Lämmitysjärjestelmä",
      "value": "Maalämpö ja lattialämmitys",  // ✅ Works
      "category": "Kohteen tiedot"
    }
  },
  "buildingMaterial": {
    "fi": {
      "key": "Rakennusmateriaali",
      "value": "Hirsi",  // ✅ Works
      "category": "Kohteen tiedot"
    }
  },
  "roofType": {
    "fi": {
      "key": "Kattotyyppi",
      "value": "Harjakatto",  // ✅ Works
      "category": "Kohteen tiedot"
    }
  }
}
```

---

## Diagnostic Evidence

Full API diagnostic log for Mailatie 3:

```
🌬️ VENTILATION DIAGNOSTIC (all ventilation/ilmanvaihto fields): {
  ventilationType: undefined,
  ventilationSystem: undefined,
  ilmanvaihto: undefined,
  ventilation: undefined,
  ventilationMethod: undefined,
  airConditioning: undefined,
  nv_ventilationType: undefined,
  nv_ventilationSystem: undefined,
  fieldsWithVentil: []  // ❌ No ventilation fields found
}

💰 LOAN/MORTGAGE DIAGNOSTIC (all company/loan/mortgage fields): {
  companyLoans: undefined,
  housingCooperativeLoans: undefined,
  housingCompanyLoans: undefined,
  taloyhtionLainat: undefined,
  taloyhtiönLainat: undefined,
  companyLoansDate: undefined,
  housingCooperativeLoansDate: undefined,
  housingCompanyLoansDate: undefined,
  taloyhtionLainanPaivamaara: undefined,
  companyMortgages: undefined,
  housingCooperativeMortgage: {
    fi: { key: 'Taloyhtiön kiinnitykset', value: null, category: 'Kohteen tiedot' }
  },
  housingCompanyMortgages: undefined,
  housingCompanyMortgageDate: undefined,
  taloyhtionKiinnitykset: undefined,
  nv_companyLoans: undefined,
  nv_housingCooperativeLoans: undefined,
  nv_companyMortgages: undefined
}
```

---

## Request for Action

**Option 1 (Preferred):** Add these fields to the External API export
- Ensure ventilation fields are included in API response
- Ensure company loans/mortgages fields return actual values (not null/undefined)
- Include date field for company loans

**Option 2:** Provide correct field names
- If these fields exist under different names in the API, please provide the correct field name mapping

**Option 3:** Explanation
- If these fields are intentionally not exported, please explain why and suggest alternative approaches

---

## Technical Details

**API Base URL:** `https://linear-external-api.azurewebsites.net`
**Endpoint:** `/v2/listings?languages[]=fi`
**Headers:**
- `accept: application/json`
- `x-company-id: [COMPANY_ID]`
- `authorization: LINEAR-API-KEY [KEY]`

**Field Search Method:**
- Checked all possible Finnish/English variations
- Checked both direct fields and `nonLocalizedValues`
- Searched for partial matches (e.g., "ventil", "loan", "mortgage")

---

## Impact Assessment

**User Impact:** High
- Properties display "Not reported" for ventilation (mandatory field)
- Financial information missing or incorrect
- Affects user trust and property presentation quality

**Business Impact:** High
- Cannot display complete property information
- May affect sales process
- Legal requirement to show accurate financial data

---

## Workaround Status

**Current Workaround:**
- Removed loan/mortgage fields from UI entirely (user Dennis requested removal)
- Ventilation still shows "Ei ilmoitettu" (Not reported) - no workaround available

**Long-term Solution Needed:**
- Fix API to return actual values from Linear UI
- Ensure all filled fields are exported via External API

---

## Contact Information

**Development Team:** Sotheby's International Realty
**Contact:** [Your contact email]
**Urgency:** High - Affects production environment

---

## Additional Notes

This issue was discovered through systematic diagnostic logging implementation. We have confirmed:
1. Fields ARE filled in Linear UI (screenshot evidence available)
2. Fields DO NOT appear or return null in API response
3. Pattern matching and multiple field name variations attempted
4. Other similar fields (heating, building material) work correctly

Please investigate and provide resolution or guidance.

Thank you for your assistance!
