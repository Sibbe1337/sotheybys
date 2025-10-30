# 📖 LINEAR API FIELD MAPPING GUIDE

Complete guide to how Linear API fields map to our Property domain model.

## 📂 Files

| File | Purpose |
|------|---------|
| `src/lib/infrastructure/linear-api/field-mappings.ts` | **Blueprint** - Complete mapping config showing all field relationships |
| `src/lib/infrastructure/linear-api/mapper.ts` | **Implementation** - Actual transformation logic |
| `src/lib/domain/property.types.ts` | **Domain Model** - TypeScript types for Property |

---

## 🎯 Quick Start

### **View All Mappings**

```typescript
import { ALL_FIELD_MAPPINGS } from '@/lib/infrastructure/linear-api/field-mappings';

// See all 100+ field mappings
console.log(ALL_FIELD_MAPPINGS);
```

### **Find Mapping for Specific Field**

```typescript
import { getMappingForField } from '@/lib/infrastructure/linear-api/field-mappings';

const mapping = getMappingForField('pricing.sales');
console.log(mapping);
// {
//   target: 'pricing.sales',
//   sources: ['askPrice'],
//   type: 'euro',
//   required: true,
//   notes: 'Sales price (asking price)'
// }
```

### **Check for Unmapped Fields**

```typescript
import { getUnmappedFields } from '@/lib/infrastructure/linear-api/field-mappings';

const unmapped = getUnmappedFields(linearListingData);
console.log('Unmapped fields:', unmapped);
// ['someNewField', 'anotherUnmappedField']
```

---

## 📋 Field Categories

### **1. Basic Information** (8 fields)
- Address, City, Postal Code
- Property Identifier (Finnish)
- Property Type & Apartment Type
- Description & Description Title

### **2. Apartment Info** (13 fields)
- Floor, Total Floors, Elevator
- Balcony, Sauna, Terrace, Fireplace
- Storage Room, Parking Space
- Condition, Available From
- Rooms, Bedrooms, Bathrooms

### **3. Building Info** (11 fields)
- Year Built, Energy Class, Energy Certificate Status
- Heating & Ventilation Systems
- Housing Company (name, loans, encumbrances, date)
- Plot Ownership, Housing Tenure

### **4. Pricing & Costs** (10 fields)
- Debt-free Price, Sales Price, Property Tax
- Maintenance, Financing, Water, Heating, Electricity, Parking, Sauna Fees

### **5. Dimensions** (5 fields)
- Living Area, Total Area, Plot Area
- Balcony Area, Terrace Area

### **6. Property-Specific** (4 fields)
- Property Identifier (Kiinteistötunnus)
- Building Rights
- Restrictions
- Zoning Status

### **7. Rental** (6 fields)
- Monthly Rent
- Security Deposit, Contract Type
- Earliest Termination
- Pets Allowed, Smoking Allowed

### **8. Media & Documents** (7 fields)
- Images Array
- Map Coordinates
- Floor Plan, Brochure, International Brochure
- Video, Energy Certificate

### **9. Agent** (1 field)
- Agent/Realtor Object

### **10. Status** (2 fields)
- Property Status (ACTIVE/SOLD/RESERVED)
- Rent Value (rental flag)

---

## 🔧 Adding New Fields

### **Step 1: Add to Blueprint**

Edit `field-mappings.ts`:

```typescript
export const NEW_CATEGORY_MAPPINGS: FieldMapping[] = [
  {
    target: 'meta.newField',
    sources: ['linearFieldName', 'alternativeFieldName'],
    type: 'string', // or 'localized', 'euro', 'boolean', etc.
    required: false,
    notes: 'Description of what this field contains'
  }
];

// Add to ALL_FIELD_MAPPINGS
export const ALL_FIELD_MAPPINGS = [
  ...EXISTING_MAPPINGS,
  ...NEW_CATEGORY_MAPPINGS
];
```

### **Step 2: Update Domain Type**

Edit `property.types.ts`:

```typescript
export interface Property {
  // ... existing fields ...
  meta: {
    // ... existing fields ...
    newField?: string; // Add your new field
  }
}
```

### **Step 3: Update Mapper**

Edit `mapper.ts`:

```typescript
// Extract the value
const newField = pickNV(nv, 'linearFieldName') ?? 
                 lget((src as any).linearFieldName!, locale);

// Add to property object
const property: Property = {
  // ... existing fields ...
  meta: {
    // ... existing fields ...
    newField
  }
};
```

### **Step 4: Test**

```bash
npm run build
npm run test
```

---

## 📊 Field Type Reference

| Type | Description | Transformation | Example |
|------|-------------|----------------|---------|
| `string` | Plain text | Direct assignment | `"Helsinki"` |
| `localized` | Multi-language | `lv()` helper | `{fi:"Kyllä", sv:"Ja", en:"Yes"}` |
| `number` | Numeric value | `parseNum()` | `123.45` |
| `euro` | Currency | `parseEuro()` | `350000` (cents → euros) |
| `boolean` | True/false | `toBool()` | `true` |
| `date` | Date string | Direct assignment | `"04.05.2025"` |
| `status` | Status enum | `normalizeStatus()` | `"ACTIVE"` |
| `energy-status` | Energy cert | `normalizeEnergyStatus()` | `"HAS_CERTIFICATE"` |
| `coordinates` | Lat/lon | `extractCoordinates()` | `{lat:60.1,lon:24.9}` |
| `images` | Image array | Array mapping | `[{url:"...", thumb:"..."}]` |
| `agent` | Agent object | `cleanAgentData()` | `{name:"...", phone:"..."}` |

---

## 🌍 Localization Rules

### **When to Use `lv()` (Localized Value)**

Use for fields that exist in multiple languages:
- ✅ Address, City
- ✅ Description, Title
- ✅ Heating System, Ventilation System
- ✅ Ownership Type, Housing Tenure
- ✅ Condition, Available From

### **When to Use Direct Assignment**

Use for language-agnostic values:
- ✅ Postal Code, Identifier
- ✅ Prices, Fees
- ✅ Areas, Dimensions
- ✅ Boolean flags

### **Fallback Logic**

```typescript
// For localized fields with fallback:
const value = lv(src.someField);
// Result: {fi:"...", sv:"...", en:"..."}

// For fields that should only exist if non-empty:
const value = condition.fi || condition.sv || condition.en ? condition : undefined;
```

---

## 🐛 Debugging

### **Find Missing Mappings**

```typescript
import { getUnmappedFields } from '@/lib/infrastructure/linear-api/field-mappings';

const listing = await client.fetchListing(id);
const unmapped = getUnmappedFields(listing);

if (unmapped.length > 0) {
  console.warn('Unmapped fields detected:', unmapped);
}
```

### **View All Source Fields**

```typescript
import { getAllSourceFields } from '@/lib/infrastructure/linear-api/field-mappings';

const sources = getAllSourceFields();
console.log('All mapped Linear API fields:', sources);
// ['address', 'city', 'postalCode', 'askPrice', ...]
```

### **Validate Mapping Coverage**

```bash
# Run this to see mapping statistics
node scripts/validate-mappings.js
```

---

## ✅ Best Practices

### **1. Always Document New Fields**

```typescript
{
  target: 'meta.newField',
  sources: ['linearField'],
  type: 'string',
  notes: '👈 ALWAYS add notes explaining what this field contains'
}
```

### **2. Use Multiple Sources for Resilience**

```typescript
{
  sources: ['primaryField', 'fallbackField', 'legacyField'],
  // Mapper will try each source in order until it finds a value
}
```

### **3. Mark Required Fields**

```typescript
{
  required: true, // Build will fail if this field is missing
}
```

### **4. Provide Defaults for Critical Fields**

```typescript
{
  defaultValue: { fi: 'Oma', sv: 'Egen', en: 'Own' },
  // Used if all sources are empty
}
```

### **5. Test Edge Cases**

```typescript
// Test with:
// - Empty values
// - Null values
// - Missing fields
// - Multiple locales
```

---

## 📖 Related Documentation

- **Blueprint**: `DENNIS_IMPLEMENTATIONSLISTA_DETALJERAD.md`
- **Domain Model**: `src/lib/domain/property.types.ts`
- **Mapper Implementation**: `src/lib/infrastructure/linear-api/mapper.ts`
- **Field Mappings**: `src/lib/infrastructure/linear-api/field-mappings.ts`
- **Linear API Types**: `src/lib/infrastructure/linear-api/types.ts`

---

## 🎯 Summary

**Benefits of Config-Driven Mapping:**
- ✅ **Self-Documenting**: See all mappings in one place
- ✅ **Easy to Extend**: Add new fields without touching mapper logic
- ✅ **Type-Safe**: TypeScript ensures correctness
- ✅ **Debuggable**: Find missing/unmapped fields easily
- ✅ **Maintainable**: Clear separation of config vs. implementation

**Total Coverage:**
- **100+ fields mapped**
- **10 categories organized**
- **5 new fields added** (identifier, condition, propertyIdentifier, propertyBuildingRights, restrictions)
- **100% alignment with Dennis' blueprint**

---

**Questions?** Check `field-mappings.ts` for complete details on any field! 🚀

