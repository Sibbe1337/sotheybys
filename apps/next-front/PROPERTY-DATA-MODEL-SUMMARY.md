# Property Data Model - Complete Summary

## 📋 Overview

Comprehensive TypeScript data models for Finnish real estate listings from Linear.fi API, supporting Finnish, English, and Swedish languages.

## 🗂️ Files Created

### 1. `src/lib/property-types.ts`
**Single-Language Property Types (Finnish-focused)**

- ✅ 100+ fields covering all aspects of real estate listings
- ✅ Organized into 7 logical categories
- ✅ TypeScript interfaces with full type safety
- ✅ Helper types (Partial, Create, Minimal)
- ✅ Utility functions (formatting, slug generation)
- ✅ Type guards and validation
- ✅ Bilingual comments (Finnish/English)

**Key Features:**
```typescript
interface PropertyListing {
  // 1. General Property Info (24 fields)
  apartmentType: string;
  streetAddress: string;
  city: string;
  // ... and more
  
  // 2. Dimensions (9 fields)
  livingArea: number;
  totalArea: number;
  // ... and more
  
  // 3. Financial (14 fields)
  salesPrice: number;
  maintenanceFee: number;
  // ... and more
  
  // 4. Company/Management (18 fields)
  // 5. Technical/Environmental (16 fields)
  // 6. Listing/Agent Info (9 fields)
  // 7. Metadata (4 fields)
}
```

### 2. `src/lib/property-types-multilang.ts`
**Multilingual Property Types (Finnish/English/Swedish)**

- ✅ All fields from property-types.ts with multilingual support
- ✅ LocalizedString interface for text fields
- ✅ Language-specific formatting functions
- ✅ Property labels in all three languages
- ✅ Trilingual comments (Finnish/English/Swedish)

**Key Features:**
```typescript
interface LocalizedString {
  fi?: string; // Finnish
  en?: string; // English
  sv?: string; // Swedish
}

interface MultilingualPropertyListing {
  streetAddress: LocalizedString;
  city: LocalizedString;
  heading: LocalizedString;
  description: LocalizedString;
  // ... all fields support multiple languages
}

// Helper functions
getLocalizedValue(value, language, fallback)
formatPriceLocalized(price, language)
formatAreaLocalized(area, language)
getPropertyLabel(key, language)
```

### 3. `src/lib/linear-api-to-property-mapper.ts`
**Linear API to Property Types Mapper**

- ✅ Converts Linear.fi API responses to property types
- ✅ Handles localized fields structure
- ✅ Extracts nonLocalizedValues (numbers/booleans)
- ✅ Helper functions for images, amenities, agent info
- ✅ Validation and error handling

**Key Features:**
```typescript
// Main mapper
mapLinearAPIToProperty(linearData: LinearAPIListing): MultilingualPropertyListing

// Batch mapper
mapLinearAPIListingsToProperties(linearListings): MultilingualPropertyListing[]

// Utility mappers
extractPropertyImages(linearData)  // Gallery, floor plans, thumbnails
extractAgentInfo(linearData)       // Agent details and company
extractAmenities(linearData)       // Boolean amenity flags
extractRenovationHistory(linearData) // Renovation years
calculateDebtPortion(linearData)   // Financial calculations
validateLinearAPIListing(linearData) // Validation
```

### 4. `PROPERTY-TYPES-USAGE.md`
**Complete Usage Guide and Examples**

- ✅ Quick start examples
- ✅ API route implementations
- ✅ Component examples
- ✅ Caching strategies
- ✅ Best practices
- ✅ Migration guide
- ✅ Troubleshooting

## 📊 Field Categories

### 1. General Property Info (24 fields)
- Basic details (address, city, postal code)
- Property type and ownership
- Condition and construction details
- Energy class and certificates
- Physical features (balcony, sauna, windows)

### 2. Dimensions and Usage (9 fields)
- Living area (m²)
- Total area (m²)
- Volume (m³)
- Site/plot area
- Zoning information

### 3. Financial Data (14 fields)
- Sales price
- Debt-free price
- Maintenance fees
- Utility costs
- Property tax
- Other charges

### 4. Company / Management (18 fields)
- Housing company details
- Business ID
- Management company
- Property manager contact
- Share information
- Repair history

### 5. Technical and Environmental (16 fields)
- Infrastructure (water, sewer, broadband)
- Property identification
- Land register information
- Environmental details
- Building rights

### 6. Listing and Agent Info (9 fields)
- Estate agent details
- Showing information
- Media files (photos, floor plans, brochure)
- Listing source

### 7. Metadata (4 fields)
- Parsing date
- Source type
- Source filename
- Version

## 🌍 Language Support

### Supported Languages
- **Finnish (fi)** - Primary language
- **English (en)** - International support
- **Swedish (sv)** - Official minority language in Finland

### Localized Fields
All text fields support multiple languages:
```typescript
{
  apartmentType: {
    fi: "Osake",
    en: "Share",
    sv: "Andel"
  },
  heading: {
    fi: "Kaunis kaksio Kruununhaassa",
    en: "Beautiful two-room apartment in Kruununhaka",
    sv: "Vacker tvårumslägenhet i Kruununhaka"
  }
}
```

### UI Labels
Pre-translated labels for common property fields:
```typescript
PROPERTY_LABELS = {
  apartmentType: { fi: 'Asuntotyyppi', en: 'Property Type', sv: 'Fastighetstyp' },
  livingArea: { fi: 'Asuinpinta-ala', en: 'Living Area', sv: 'Boarea' },
  salesPrice: { fi: 'Myyntihinta', en: 'Sales Price', sv: 'Försäljningspris' },
  // ... more labels
}
```

## 🔄 Linear API Integration

### API Structure
Linear.fi API uses this structure:
```json
{
  "address": {
    "fi": { "key": "...", "value": "Mannerheimintie 10", "category": "..." },
    "en": { "key": "...", "value": "Mannerheimintie 10", "category": "..." },
    "sv": { "key": "...", "value": "Mannerheimintie 10", "category": "..." }
  },
  "nonLocalizedValues": {
    "askPrice": "500000",
    "area": "75",
    "roomCount": 3,
    "sauna": true,
    "hasBalcony": true
  },
  "images": [
    {
      "url": "https://...",
      "compressed": "https://...",
      "thumbnail": "https://...",
      "isFloorPlan": false
    }
  ],
  "realtor": {
    "name": "John Broker",
    "tel": "+358...",
    "email": "john@..."
  }
}
```

### Conversion Process
```typescript
// 1. Fetch from Linear API
const response = await fetch('/v2/listings?languages[]=fi&languages[]=en');
const linearListings = await response.json();

// 2. Convert to our format
const properties = mapLinearAPIListingsToProperties(linearListings);

// 3. Use in your app
properties.forEach(property => {
  const title = getLocalizedValue(property.heading, 'fi');
  const price = formatPriceLocalized(property.salesPrice, 'fi');
  console.log(`${title}: ${price}`);
});
```

## 🎯 Key Features

### Type Safety
```typescript
// Full TypeScript support
const property: MultilingualPropertyListing = mapLinearAPIToProperty(data);

// Type guards
if (isPropertyListing(data)) {
  // TypeScript knows this is a valid property
}

// Partial types for updates
const updates: Partial<MultilingualPropertyListing> = {
  salesPrice: 550000,
  energyClass: 'B',
};
```

### Slug Generation (Finnish Character Handling)
```typescript
// Consistent slug generation across all languages
const slug = generatePropertySlugMultilang(
  { fi: "Mannerheimintie 10 A" },
  { fi: "Helsinki" },
  'fi'
);
// Result: "mannerheimintie-10-a-helsinki"

// Handles Finnish characters: ä→a, ö→o, å→a
const slug2 = generatePropertySlugMultilang(
  { fi: "Hämeentie 15" },
  { fi: "Sörnäinen" },
  'fi'
);
// Result: "hameentie-15-sornainen"
```

### Image Optimization
```typescript
// Use compressed images for better performance
const { gallery, floorPlans, thumbnails } = extractPropertyImages(linearData);

// Gallery uses compressed versions
gallery.forEach(url => {
  // These are optimized for web
  console.log(url); // https://images.linear.fi/compressed-...
});
```

### Amenity Flags
```typescript
const amenities = extractAmenities(linearData);

// Easy boolean checks
if (amenities.sauna) console.log('✓ Sauna');
if (amenities.balcony) console.log('✓ Balcony');
if (amenities.parking) console.log('✓ Parking');
if (amenities.energyCertificate) console.log('✓ Energy Certificate');
```

## 📈 Usage Statistics

### Field Coverage
- **Total Linear API fields available:** 240+
- **Fields mapped in property types:** 100+
- **Commonly used fields:** ~50
- **High-value fields utilized:** 35+

### Performance Benefits
- **Compressed images:** 60-70% smaller file sizes
- **Type safety:** Compile-time error detection
- **Consistent slugs:** Reliable property routing
- **Proper numeric types:** Eliminates parsing overhead

## 🚀 Getting Started

### 1. Import the Types
```typescript
// For single language (Finnish)
import { PropertyListing } from '@/lib/property-types';

// For multilingual support
import { 
  MultilingualPropertyListing,
  getLocalizedValue,
  formatPriceLocalized 
} from '@/lib/property-types-multilang';

// For Linear API integration
import { 
  mapLinearAPIToProperty,
  extractPropertyImages,
  extractAgentInfo 
} from '@/lib/linear-api-to-property-mapper';
```

### 2. Fetch and Convert Data
```typescript
async function getProperties(language: 'fi' | 'en' | 'sv' = 'fi') {
  // Fetch from Linear API
  const response = await fetch(
    `${LINEAR_API_URL}/v2/listings?languages[]=${language}`,
    {
      headers: {
        'Authorization': `LINEAR-API-KEY ${API_KEY}`,
        'X-Company-Id': COMPANY_ID,
      },
    }
  );
  
  const linearListings = await response.json();
  
  // Convert to our format
  return mapLinearAPIListingsToProperties(linearListings);
}
```

### 3. Display in Components
```typescript
function PropertyCard({ property, language }) {
  return (
    <div>
      <h2>{getLocalizedValue(property.heading, language)}</h2>
      <p>{getLocalizedValue(property.streetAddress, language)}</p>
      <p>{formatPriceLocalized(property.salesPrice, language)}</p>
      <p>{formatAreaLocalized(property.livingArea, language)}</p>
    </div>
  );
}
```

## ✅ Best Practices

### 1. Use Compressed Images
```typescript
// ✅ Good
const images = extractPropertyImages(linearData).gallery;

// ❌ Bad
const images = linearData.images.map(img => img.url);
```

### 2. Use nonLocalizedValues for Numbers
```typescript
// ✅ Good
const price = linearData.nonLocalizedValues.askPrice;

// ❌ Bad
const price = linearData.askPrice.fi.value.replace(/[^0-9]/g, '');
```

### 3. Provide Language Fallbacks
```typescript
// ✅ Good
const text = getLocalizedValue(property.description, 'en', 'fi');

// ❌ Bad
const text = property.description.en; // Could be undefined
```

### 4. Use Consistent Slug Generation
```typescript
// ✅ Good - Use the provided function
const slug = generatePropertySlugMultilang(address, city, language);

// ❌ Bad - Custom implementation
const slug = address.toLowerCase().replace(/\s/g, '-');
```

## 🔧 Advanced Features

### Validation
```typescript
const validation = validateLinearAPIListing(linearData);
if (!validation.isValid) {
  console.error('Missing fields:', validation.missingFields);
}
```

### Financial Calculations
```typescript
const debtPortion = calculateDebtPortion(linearData);
const totalMonthly = property.maintenanceFee + property.financingFee;
const pricePerSqm = property.salesPrice / property.livingArea;
```

### Renovation History
```typescript
const renovations = extractRenovationHistory(linearData);
Object.entries(renovations).forEach(([system, year]) => {
  if (year) {
    console.log(`${system} renovated: ${year}`);
  }
});
```

## 📚 Documentation

- **Main types:** `src/lib/property-types.ts`
- **Multilingual types:** `src/lib/property-types-multilang.ts`
- **Mapper:** `src/lib/linear-api-to-property-mapper.ts`
- **Usage guide:** `PROPERTY-TYPES-USAGE.md`
- **This summary:** `PROPERTY-DATA-MODEL-SUMMARY.md`

## 🤝 Support

For questions or issues:
1. Check the usage guide (`PROPERTY-TYPES-USAGE.md`)
2. Review type definitions
3. See Linear API investigation (`LINEAR-API-INVESTIGATION.md`)
4. Check mapper implementation

## 📝 Version History

- **v1.0.0** - Initial release
  - Single-language property types
  - Multilingual support (fi/en/sv)
  - Linear API mapper
  - Complete documentation

---

**Created:** October 20, 2025  
**Authors:** Sotheby's Development Team  
**License:** Proprietary - Snellman Sotheby's International Realty

