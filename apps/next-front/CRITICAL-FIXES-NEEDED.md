# CRITICAL FIXES NEEDED - Dennis Feedback

## Problems Found in Current Code:

### 1. ApartmentSections.tsx
- Line 116: `const totalFees = totalFeesNum > 0 ? \`${totalFeesNum.toLocaleString(localeStr)} €/kk\` : undefined;`
  - **WRONG**: Uses hardcoded `€/kk`
  - **SHOULD BE**: `const totalFees = totalFeesNum > 0 ? fmtFee(totalFeesNum, localeStr) : undefined;`

- Line 169: `sub={fmtPerM2(debtFreePriceNum, livingAreaNum, localeStr)}`
  - **WRONG**: Shows €/m² for Vh (debtFreePrice)
  - **SHOULD BE**: Remove `sub` prop entirely

- Line 175: `sub={fmtPerM2(salesPriceNum, livingAreaNum, localeStr)}`
  - **WRONG**: Shows €/m² for Mh (salesPrice)
  - **SHOULD BE**: Remove `sub` prop entirely

- Line 203: `sub={fmtPerM2(totalFeesNum, livingAreaNum, localeStr)}`
  - **WRONG**: Shows €/m² for totalFees
  - **SHOULD BE**: Remove `sub` prop entirely

### 2. PropertySections.tsx
- Line 154: `sub={fmtPerM2(salesPriceNum, livingAreaNum, localeStr)}`
  - **WRONG**: Shows €/m² for salesPrice
  - **SHOULD BE**: Remove `sub` prop entirely

## Dennis Says:
"jag ser ännu €/m2 i objektens prisuppgifter, både för lägenheter och fastigheter"

He's RIGHT - these sub-texts are still showing!
