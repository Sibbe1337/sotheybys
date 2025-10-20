# Property Types Usage Guide

## Overview

This guide shows how to use the multilingual property types with the Linear.fi API integration.

## Files Created

1. **`property-types.ts`** - Single-language Finnish property types (original)
2. **`property-types-multilang.ts`** - Multilingual types (Finnish, English, Swedish)
3. **`linear-api-to-property-mapper.ts`** - Mapper from Linear API to property types

## Quick Start

### 1. Basic Usage - Fetch and Convert Linear API Data

```typescript
import { mapLinearAPIToProperty } from '@/lib/linear-api-to-property-mapper';
import { MultilingualPropertyListing } from '@/lib/property-types-multilang';

// Fetch from Linear API
async function getProperty(slug: string, lang: 'fi' | 'en' | 'sv' = 'fi') {
  const response = await fetch(`/api/property/${slug}?lang=${lang}`);
  const linearData = await response.json();
  
  // Convert to our property format
  const property: MultilingualPropertyListing = mapLinearAPIToProperty(linearData);
  
  return property;
}
```

### 2. Display Property in Multiple Languages

```typescript
import { 
  getLocalizedValue, 
  formatPriceLocalized,
  formatAreaLocalized 
} from '@/lib/property-types-multilang';

function PropertyCard({ property, language }) {
  const title = getLocalizedValue(property.heading, language);
  const address = getLocalizedValue(property.streetAddress, language);
  const city = getLocalizedValue(property.city, language);
  const price = formatPriceLocalized(property.salesPrice, language);
  const area = formatAreaLocalized(property.livingArea, language);
  
  return (
    <div className="property-card">
      <h2>{title}</h2>
      <p>{address}, {city}</p>
      <p>{price}</p>
      <p>{area}</p>
    </div>
  );
}
```

### 3. API Route Example with Linear Integration

```typescript
// app/api/property/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mapLinearAPIToProperty } from '@/lib/linear-api-to-property-mapper';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const lang = (searchParams.get('lang') || 'fi') as 'fi' | 'en' | 'sv';
  
  try {
    // Fetch from Linear API
    const linearResponse = await fetch(
      `${process.env.LINEAR_API_URL}/v2/listings?languages[]=${lang}`,
      {
        headers: {
          'Authorization': `LINEAR-API-KEY ${process.env.LINEAR_API_KEY}`,
          'X-Company-Id': process.env.LINEAR_COMPANY_ID,
          'Accept': 'application/json',
        },
      }
    );
    
    const linearListings = await linearResponse.json();
    
    // Find property by slug
    const linearProperty = linearListings.find((listing: any) => {
      const address = listing.address?.[lang]?.value || '';
      const city = listing.city?.[lang]?.value || '';
      const generatedSlug = generateSlug(`${address}-${city}`);
      return generatedSlug === params.slug;
    });
    
    if (!linearProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    // Convert to our property format
    const property = mapLinearAPIToProperty(linearProperty);
    
    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
```

### 4. Listings Page with Language Selection

```typescript
// app/kohteet/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { mapLinearAPIListingsToProperties } from '@/lib/linear-api-to-property-mapper';
import { MultilingualPropertyListing, getLocalizedValue } from '@/lib/property-types-multilang';

export default function ListingsPage() {
  const [language, setLanguage] = useState<'fi' | 'en' | 'sv'>('fi');
  const [properties, setProperties] = useState<MultilingualPropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await fetch(`/api/listings?lang=${language}`);
        const result = await response.json();
        
        if (result.success) {
          const mappedProperties = mapLinearAPIListingsToProperties(result.data);
          setProperties(mappedProperties);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProperties();
  }, [language]);
  
  return (
    <div>
      {/* Language Selector */}
      <div className="language-selector">
        <button onClick={() => setLanguage('fi')}>Suomi</button>
        <button onClick={() => setLanguage('en')}>English</button>
        <button onClick={() => setLanguage('sv')}>Svenska</button>
      </div>
      
      {/* Property Grid */}
      <div className="properties-grid">
        {properties.map(property => (
          <PropertyCard 
            key={property.propertyId} 
            property={property} 
            language={language} 
          />
        ))}
      </div>
    </div>
  );
}
```

### 5. Using Helper Functions

```typescript
import {
  extractPropertyImages,
  extractAgentInfo,
  extractAmenities,
  extractRenovationHistory,
  calculateDebtPortion,
} from '@/lib/linear-api-to-property-mapper';

// Extract optimized images
const { gallery, floorPlans, thumbnails } = extractPropertyImages(linearData);

// Get agent information
const agent = extractAgentInfo(linearData);
console.log(`Agent: ${agent.name} (${agent.company.name})`);

// Get amenities as boolean flags
const amenities = extractAmenities(linearData);
if (amenities.sauna) {
  console.log('Has sauna ✓');
}

// Get renovation history
const renovations = extractRenovationHistory(linearData);
if (renovations.electrical) {
  console.log(`Electrical system renovated: ${renovations.electrical}`);
}

// Calculate debt portion
const debtPortion = calculateDebtPortion(linearData);
console.log(`Debt portion: ${debtPortion} €`);
```

### 6. Property Labels in Multiple Languages

```typescript
import { getPropertyLabel, PROPERTY_LABELS } from '@/lib/property-types-multilang';

function PropertyDetails({ property, language }) {
  return (
    <div>
      <div>
        <label>{getPropertyLabel('apartmentType', language)}:</label>
        <span>{getLocalizedValue(property.apartmentType, language)}</span>
      </div>
      
      <div>
        <label>{getPropertyLabel('livingArea', language)}:</label>
        <span>{property.livingArea} m²</span>
      </div>
      
      <div>
        <label>{getPropertyLabel('salesPrice', language)}:</label>
        <span>{formatPriceLocalized(property.salesPrice, language)}</span>
      </div>
      
      <div>
        <label>{getPropertyLabel('energyClass', language)}:</label>
        <span>{property.energyClass}</span>
      </div>
    </div>
  );
}
```

## Linear API Integration

### Fetching Data from Linear API

```typescript
// Example: Fetch all listings for Snellman Sotheby's
const LINEAR_API_URL = 'https://ca-externalapi-test-weu-001.livelyrock-4a193af6.westeurope.azurecontainerapps.io';
const LINEAR_API_KEY = 'your-api-key';
const COMPANY_ID = 'your-company-id';

async function fetchLinearListings(language: 'fi' | 'en' | 'sv' = 'fi') {
  const response = await fetch(
    `${LINEAR_API_URL}/v2/listings?languages[]=${language}`,
    {
      headers: {
        'Authorization': `LINEAR-API-KEY ${LINEAR_API_KEY}`,
        'X-Company-Id': COMPANY_ID,
        'Accept': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Linear API error: ${response.status}`);
  }
  
  return response.json();
}
```

### Caching Strategy

```typescript
// Use Next.js cache with revalidation
export const revalidate = 600; // Revalidate every 10 minutes

export async function getProperties(lang: 'fi' | 'en' | 'sv') {
  const linearListings = await fetchLinearListings(lang);
  const properties = mapLinearAPIListingsToProperties(linearListings);
  
  return properties;
}
```

## Field Mapping Reference

### Linear API → Property Types

| Linear API Field | Property Type Field | Notes |
|-----------------|---------------------|-------|
| `askPrice` (nonLocalizedValues) | `salesPrice` | Numeric value |
| `debtFreePrice` (nonLocalizedValues) | `unencumberedSalesPrice` | Numeric value |
| `area` (nonLocalizedValues) | `livingArea` | In m² |
| `roomCount` (nonLocalizedValues) | N/A | Number of rooms |
| `sauna` (nonLocalizedValues) | `sauna` | Boolean |
| `hasBalcony` (nonLocalizedValues) | `balcony` | Boolean |
| `completeYear` (nonLocalizedValues) | `yearOfBuilding` | Year |
| `energyClass` (nonLocalizedValues) | `energyClass` | A-G |
| `images[]` | `photoUrls` | Use compressed URLs |
| `realtor` | `estateAgent*` | Agent info |

## Best Practices

### 1. Always Use Compressed Images

```typescript
// ✅ Good: Use compressed images for better performance
const images = linearData.images.map(img => img.compressed || img.url);

// ❌ Bad: Using original full-size images
const images = linearData.images.map(img => img.url);
```

### 2. Use nonLocalizedValues for Numeric Data

```typescript
// ✅ Good: Use nonLocalizedValues for numbers
const price = parseFloat(linearData.nonLocalizedValues.askPrice);

// ❌ Bad: Parsing localized string values
const price = parseFloat(linearData.askPrice.fi.value.replace(/[^0-9]/g, ''));
```

### 3. Handle Missing Data Gracefully

```typescript
// ✅ Good: Provide fallbacks
const city = getLocalizedValue(property.city, language, 'fi') || 'Unknown';

// ❌ Bad: No fallback
const city = property.city[language]; // Could be undefined
```

### 4. Use Slug Generation Consistently

```typescript
import { generatePropertySlugMultilang } from '@/lib/property-types-multilang';

// ✅ Good: Use the provided function
const slug = generatePropertySlugMultilang(
  property.streetAddress,
  property.city,
  language
);

// This handles Finnish characters consistently: ä→a, ö→o, å→a
```

## TypeScript Tips

### Type Guards

```typescript
import { MultilingualPropertyListing } from '@/lib/property-types-multilang';

function isValidProperty(data: unknown): data is MultilingualPropertyListing {
  return (
    typeof data === 'object' &&
    data !== null &&
    'salesPrice' in data &&
    'livingArea' in data
  );
}
```

### Partial Updates

```typescript
import { MultilingualPropertyListing } from '@/lib/property-types-multilang';

type PropertyUpdate = Partial<MultilingualPropertyListing>;

async function updateProperty(id: string, updates: PropertyUpdate) {
  // Update only specified fields
  return await fetch(`/api/properties/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}
```

## Migration from Old Format

If you have existing code using the old property format:

```typescript
// Old format
interface OldProperty {
  address: string;
  city: string;
  price: number;
}

// New format
import { MultilingualPropertyListing } from '@/lib/property-types-multilang';

// Migration helper
function migrateToMultilingual(old: OldProperty): Partial<MultilingualPropertyListing> {
  return {
    streetAddress: { fi: old.address },
    city: { fi: old.city },
    salesPrice: old.price,
  };
}
```

## Troubleshooting

### Issue: Missing Translations

If a translation is missing, the system will fall back to Finnish:

```typescript
const value = getLocalizedValue(property.heading, 'en', 'fi');
// Returns English if available, otherwise Finnish
```

### Issue: Invalid Numeric Values

The mapper handles invalid numeric values gracefully:

```typescript
// Returns 0 if value is invalid
const price = parseNumericValue('invalid');
console.log(price); // 0
```

### Issue: Slug Mismatches

Ensure all slug generation uses the same function:

```typescript
import { generatePropertySlugMultilang } from '@/lib/property-types-multilang';

// Always use this function for consistency
const slug = generatePropertySlugMultilang(address, city, language);
```

## Support

For questions or issues:
- Check Linear API documentation
- Review the type definitions in `property-types-multilang.ts`
- See mapper implementation in `linear-api-to-property-mapper.ts`

