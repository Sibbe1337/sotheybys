# Linear API → Property Types Field Mapping

Quick reference for mapping Linear.fi API fields to our property data model.

## 📋 Quick Reference

### General Property Info

| Linear API Field | Property Field | Type | Source |
|-----------------|----------------|------|--------|
| `propertyType` | `apartmentType` | LocalizedString | Localized |
| `address` | `streetAddress` | LocalizedString | Localized |
| `postalCode` | `postalCode` | string | Localized (fi) |
| `city` | `city` | LocalizedString | Localized |
| `region` | `region` | LocalizedString | Localized |
| `heading` | `heading` | LocalizedString | Localized |
| `description` | `description` | LocalizedString | Localized |
| `releaseDate` | `releaseDate` | Date | Localized |
| `availableFrom` | `availableFrom` | LocalizedString/Date | Localized |
| `ownershipType` | `ownershipType` | LocalizedString | Localized |
| `floor` | `floorLocation` | LocalizedString | Localized |
| `totalFloors` | `numberOfFloors` | string | nonLocalizedValues |
| `windowDirection` | `windowDirection` | LocalizedString | Localized |
| `nonLocalizedValues.hasBalcony` | `balcony` | boolean | nonLocalizedValues |
| `nonLocalizedValues.sauna` | `sauna` | boolean | nonLocalizedValues |
| `condition` / `nonLocalizedValues.condition` | `condition` | LocalizedString | Both |
| `completeYear` / `nonLocalizedValues.completeYear` | `yearOfBuilding` | number | Both |
| `roofType` | `roofType` | LocalizedString | Localized |
| `heatingType` | `heatingSystem` | LocalizedString | Localized |
| `ventilationType` | `ventilationSystem` | LocalizedString | Localized |
| `constructionMaterial` | `buildingMaterial` | LocalizedString | Localized |
| `energyClass` / `nonLocalizedValues.energyClass` | `energyClass` | string | Both |
| `nonLocalizedValues.listingHasEnergyCertificate` | `energyCertificate` | boolean | nonLocalizedValues |

### Dimensions and Usage

| Linear API Field | Property Field | Type | Source |
|-----------------|----------------|------|--------|
| `nonLocalizedValues.area` | `livingArea` | number | nonLocalizedValues |
| `nonLocalizedValues.totalArea` | `totalArea` | number | nonLocalizedValues |
| `nonLocalizedValues.volume` | `volume` | number | nonLocalizedValues |
| `nonLocalizedValues.plotArea` | `siteArea` | number | nonLocalizedValues |
| `plotOwnership` | `siteOwnershipType` | LocalizedString | Localized |
| `zoningSituation` | `zoningSituation` | LocalizedString | Localized |

### Financial Data

| Linear API Field | Property Field | Type | Source |
|-----------------|----------------|------|--------|
| `nonLocalizedValues.askPrice` | `salesPrice` | number | nonLocalizedValues |
| `nonLocalizedValues.debtFreePrice` | `unencumberedSalesPrice` | number | nonLocalizedValues |
| *Calculated* | `debtPart` | number | askPrice - debtFreePrice |
| `nonLocalizedValues.renovationCharge` | `maintenanceFee` | number | nonLocalizedValues |
| `nonLocalizedValues.fundingCharge` | `financingFee` | number | nonLocalizedValues |
| *Calculated* | `totalFee` | number | renovationCharge + fundingCharge |
| `nonLocalizedValues.electricHeatingCharge` | `electricityCost` | number | nonLocalizedValues |
| `nonLocalizedValues.averageTotalHeatingCharge` | `heatingCost` | number | nonLocalizedValues |
| `nonLocalizedValues.propertyTax` | `propertyTax` | number | nonLocalizedValues |
| `nonLocalizedValues.parkingCharge` | N/A (in otherFees) | number | nonLocalizedValues |
| `nonLocalizedValues.saunaCharge` | N/A (in otherFees) | number | nonLocalizedValues |
| `nonLocalizedValues.broadbandCharge` | N/A (in otherFees) | number | nonLocalizedValues |

### Company / Management

| Linear API Field | Property Field | Type | Source |
|-----------------|----------------|------|--------|
| `housingCompanyName` | `housingCompanyName` | string | Localized (fi) |
| `businessId` | `businessId` | string | Localized (fi) |
| `managementCompany` | `managementCompany` | string | Localized (fi) |
| `shareNumbers` | `numberOfShares` | string | Localized (fi) |
| `nonLocalizedValues.completeYear` | `constructionYear` | number | nonLocalizedValues |

### Technical and Environmental

| Linear API Field | Property Field | Type | Source |
|-----------------|----------------|------|--------|
| `sewerSystem` | `sewerSystem` | LocalizedString | Localized |
| `waterSystem` | `waterConnection` | LocalizedString | Localized |
| `nonLocalizedValues.hasCableTv` | `broadband` | boolean | nonLocalizedValues |
| `antennaSystem` | `antennaSystem` | LocalizedString | Localized |
| `propertyId` | `propertyId` | string | Localized (fi) |
| `municipality` | `municipality` | LocalizedString | Localized |

### Listing and Agent Info

| Linear API Field | Property Field | Type | Source |
|-----------------|----------------|------|--------|
| `realtor.name` | `estateAgentName` | string | realtor object |
| `realtor.tel` | `estateAgentPhone` | string | realtor object |
| `realtor.email` | `estateAgentEmail` | string | realtor object |
| `showingDate` | `showingDate` | Date | Localized |
| `showingTime` | `showingTime` | string | Localized (fi) |
| `realtor.primaryCompany.name` | `listingOffice` | string | realtor object |
| `images[].compressed` | `photoUrls[]` | string[] | images array |
| `images[].url` (isFloorPlan=true) | `floorPlanUrl` | string | images array |
| `brochureUrl` | `brochureUrl` | string | Direct |

## 🎯 Data Source Priority

### 1. Numeric Values
**Priority:** nonLocalizedValues → Localized field → Default

```typescript
// ✅ Best: Use nonLocalizedValues
const price = parseFloat(linearData.nonLocalizedValues.askPrice);

// ⚠️ Fallback: Parse localized value
const price = parseFloat(linearData.askPrice.fi.value.replace(/[^0-9]/g, ''));

// ❌ Last resort: Default
const price = 0;
```

### 2. Boolean Values
**Priority:** nonLocalizedValues only

```typescript
// ✅ Correct
const hasSauna = linearData.nonLocalizedValues.sauna ?? false;

// ❌ Wrong - booleans are not in localized fields
const hasSauna = linearData.sauna?.fi?.value === 'true';
```

### 3. Text Values
**Priority:** Localized fields by language

```typescript
// ✅ Correct
const heading = {
  fi: linearData.heading.fi?.value,
  en: linearData.heading.en?.value,
  sv: linearData.heading.sv?.value,
};

// ⚠️ Fallback to Finnish if translation missing
const text = heading.en || heading.fi || '';
```

## 📊 Complete Amenity Flags

All boolean amenities from `nonLocalizedValues`:

```typescript
interface Amenities {
  // Available from Linear API
  sauna: boolean;
  hasBalcony: boolean;
  hasParkingSpace: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  newlyConstructed: boolean;
  hasHighCeilings: boolean;
  hasCableTv: boolean;
  hasSatelliteAntenna: boolean;
  listingHasEnergyCertificate: boolean;
  
  // Not currently used
  // hasElevator: boolean;
  // hasFireplace: boolean;
  // hasAirConditioning: boolean;
}
```

## 🏗️ Renovation Fields

All renovation year fields from `nonLocalizedValues`:

```typescript
interface RenovationHistory {
  electricalSystemRenovationYear?: number;
  sewerSystemRenovationYear?: number;
  waterPipeRenovationYear?: number;
  roofRenovationYear?: number;
  facadeRenovationYear?: number;
  // More available in API...
}
```

## 🖼️ Image Fields

```typescript
interface LinearAPIImage {
  url: string;              // Original full-size image
  thumbnail: string;        // Small thumbnail
  compressed?: string;      // Web-optimized (USE THIS!)
  isFloorPlan?: boolean;    // Is this a floor plan?
  description?: string;     // Image description
  order?: number;           // Display order
}

// Usage
const galleryImages = images
  .filter(img => !img.isFloorPlan)
  .sort((a, b) => (a.order || 0) - (b.order || 0))
  .map(img => img.compressed || img.url);

const floorPlans = images
  .filter(img => img.isFloorPlan)
  .map(img => img.compressed || img.url);
```

## 👤 Agent/Realtor Fields

```typescript
interface LinearAPIRealtor {
  id: number;
  name: string;
  tel: string;
  email: string;
  avatar?: string;
  primaryCompany?: {
    name: string;
    logo?: string;
    businessId?: string;
    privacyProtectionLink?: string;
  };
}
```

## 🔢 Numeric Value Parsing

Helper function for consistent parsing:

```typescript
function parseNumericValue(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  
  // Remove spaces and convert to number
  const cleaned = value.replace(/\s/g, '');
  return parseFloat(cleaned) || 0;
}

// Examples
parseNumericValue('500 000')     // → 500000
parseNumericValue('75.5')        // → 75.5
parseNumericValue('invalid')     // → 0
parseNumericValue(undefined)     // → 0
```

## 🏷️ Condition Enum Mapping

```typescript
const conditionMap = {
  'GOOD': {
    fi: 'Hyvä',
    en: 'Good',
    sv: 'Bra'
  },
  'EXCELLENT': {
    fi: 'Erinomainen',
    en: 'Excellent',
    sv: 'Utmärkt'
  },
  'SATISFACTORY': {
    fi: 'Tyydyttävä',
    en: 'Satisfactory',
    sv: 'Tillfredsställande'
  },
  'NEEDS_RENOVATION': {
    fi: 'Remontoitava',
    en: 'Needs Renovation',
    sv: 'Kräver renovering'
  }
};
```

## ⚠️ Fields Not Available in Linear API

These fields are in the property schema but not available from Linear API:

- `numberOfApartments` - Total apartments in building
- `businessSpaces` - Business space description
- `zoningDetails` - Detailed zoning information
- `loanPayable` - Whether loan is payable
- `rentIncome` - Rental income
- `waterFee` - Separate water fee
- `cleaningCost` - Cleaning costs
- `propertyMaintenance` - Maintenance company
- `managerName` - Property manager name
- `managerPhone` - Property manager phone
- `managerEmail` - Property manager email
- `redemptionClauseFlats` - Redemption clause for flats
- `redemptionClauseParking` - Redemption clause for parking
- `companyLoans` - Company loan total
- `companyIncome` - Company income
- `totalApartments` - Total apartments
- `totalBusinessSpaces` - Total business spaces
- `sharedSpaces` - Shared space description
- `asbestosSurvey` - Asbestos survey status
- `repairHistory` - Repair history text
- `upcomingRepairs` - Upcoming repairs text
- `propertyRestrictions` - Property restrictions
- `terrainDescription` - Terrain description
- `soilAndVegetation` - Soil and vegetation
- `buildingRights` - Building rights
- `easementsAndRights` - Easements and rights
- `landRegisterNumber` - Land register number
- `blockNumber` - Block number
- `leaseTerm` - Lease term
- `annualLease` - Annual lease amount
- `listingSourceUrl` - Original listing URL

**Note:** These fields default to empty values or zero. They can be populated from other sources if needed.

## 🚀 Usage Example

```typescript
import { mapLinearAPIToProperty } from '@/lib/linear-api-to-property-mapper';

// Get data from Linear API
const response = await fetch('/v2/listings?languages[]=fi&languages[]=en&languages[]=sv');
const linearListings = await response.json();

// Convert to our property format
const properties = linearListings.map(mapLinearAPIToProperty);

// Use the data
properties.forEach(property => {
  console.log('Address:', property.streetAddress);
  console.log('Price:', property.salesPrice);
  console.log('Area:', property.livingArea, 'm²');
  console.log('Sauna:', property.sauna ? 'Yes' : 'No');
  console.log('Energy Class:', property.energyClass);
});
```

## 📝 Notes

1. **Always use compressed images** - They're 60-70% smaller
2. **Prefer nonLocalizedValues** - For numeric and boolean data
3. **Provide fallbacks** - For missing translations
4. **Use helper functions** - For consistent parsing and formatting
5. **Validate data** - Check for required fields before using

---

**Last Updated:** October 20, 2025  
**Linear API Version:** v2  
**Property Types Version:** 1.0.0

