# Linear.fi API Integration Guide

This guide explains how to use the Linear.fi API integration for real estate data in the Sotheby's application.

## 🚀 Quick Setup

### 1. Environment Variables

Add your Linear.fi API credentials to `.env.local`:

```bash
# Linear.fi API Configuration
LINEAR_API_URL=https://api.linear.fi/v1
LINEAR_API_KEY=your_actual_api_key_here
```

### 2. Test the Connection

Run the test script to verify your API connection:

```bash
# From the next-front directory
node test-linear.js

# Or make it executable and run directly
./test-linear.js
```

## 📚 API Client Usage

### Basic Import

```typescript
import linearApi from '@/lib/linear-api';
import { LinearProperty, LinearAgent, LinearSearchParams } from '@/lib/linear-api';
```

### Get Properties

```typescript
// Get all properties
const properties = await linearApi.getProperties();

// Get properties with filters
const filtered = await linearApi.getProperties({
  city: 'Helsinki',
  propertyType: 'kerrostalo',
  minPrice: 200000,
  maxPrice: 500000,
  minRooms: 2,
  limit: 20
});

// Get featured properties
const featured = await linearApi.getFeaturedProperties(10);
```

### Search Properties

```typescript
// Search with query and filters
const searchResults = await linearApi.searchProperties('Helsinki', {
  propertyType: 'omakotitalo',
  minLivingArea: 100,
  maxPrice: 800000
});

// Search cities and property types
const cities = await linearApi.getCities();
const types = await linearApi.getPropertyTypes();
```

### Get Single Property

```typescript
// Get detailed property information
const property = await linearApi.getProperty('property-id-123');

// Get property images
const images = await linearApi.getPropertyImages('property-id-123');
```

### Agent Information

```typescript
// Get all agents
const agents = await linearApi.getAgents();

// Get specific agent
const agent = await linearApi.getAgent('agent-id-123');

// Get properties by agent
const agentProperties = await linearApi.getPropertiesByAgent('agent-id-123');
```

### Lead Management

```typescript
// Create a new lead
const newLead = await linearApi.createLead({
  propertyId: 'property-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+358 40 123 4567',
  message: 'I am interested in this property',
  leadType: 'inquiry',
  status: 'new',
  source: 'website'
});

// Get leads
const leads = await linearApi.getLeads();
const propertyLeads = await linearApi.getLeads('property-123');

// Update lead status
const updated = await linearApi.updateLead('lead-123', {
  status: 'contacted'
});
```

## 🎣 React Hooks

### useLinearProperties Hook

```typescript
import { useLinearProperties } from '@/lib/linear-api';

function PropertyList() {
  const { properties, loading, error } = useLinearProperties({
    city: 'Helsinki',
    propertyType: 'kerrostalo',
    limit: 10
  });

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

## 🏠 Property Types

Linear.fi supports these Finnish property types:

- `kerrostalo` - Apartment building
- `rivitalo` - Townhouse  
- `omakotitalo` - Detached house
- `tontti` - Plot/Land
- `liiketila` - Commercial space

## 📊 Property Status

- `myynnissa` - For sale
- `varattu` - Reserved
- `myyty` - Sold
- `poistettu` - Removed

## 🔧 Utility Functions

```typescript
import { 
  formatPrice, 
  formatArea, 
  getPropertyTypeLabel, 
  getStatusLabel 
} from '@/lib/linear-api';

// Format price in Finnish locale
const priceText = formatPrice(350000); // "350 000 €"

// Format area
const areaText = formatArea(85); // "85 m²"

// Get Finnish labels
const typeLabel = getPropertyTypeLabel('kerrostalo'); // "Kerrostalo"
const statusLabel = getStatusLabel('myynnissa'); // "Myynnissä"
```

## 🧪 Testing

### Run All Tests

```bash
node test-linear.js
```

### Quick Development Tests

```typescript
import { quickTest } from '@/lib/test-linear-api';

// Test connection only
const connected = await quickTest.connection();

// Test getting properties
const properties = await quickTest.properties();

// Test search
const helsinkiProperties = await quickTest.search('Helsinki');
```

## 🔍 Error Handling

The API client includes comprehensive error handling:

```typescript
try {
  const properties = await linearApi.getProperties();
  // Handle success
} catch (error) {
  if (error.message.includes('Linear API error: 401')) {
    // Handle authentication error
    console.error('Invalid API key');
  } else if (error.message.includes('Linear API error: 429')) {
    // Handle rate limiting
    console.error('Rate limit exceeded');
  } else {
    // Handle other errors
    console.error('API error:', error.message);
  }
}
```

## 🌐 API Endpoints

The client automatically constructs URLs based on your `LINEAR_API_URL` environment variable:

- **Properties**: `/kohteet`
- **Agents**: `/agentit` 
- **Leads**: `/liidit`
- **Search**: `/kohteet/search`
- **Health Check**: `/health`

## 📱 Component Integration

### Property Card Example

```typescript
import { LinearProperty, formatPrice, formatArea } from '@/lib/linear-api';

interface PropertyCardProps {
  property: LinearProperty;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="property-card">
      <h3>{property.title}</h3>
      <p>{property.address}, {property.city}</p>
      <p>{formatPrice(property.price)}</p>
      <p>{property.rooms} rooms, {formatArea(property.livingArea)}</p>
      {property.images.length > 0 && (
        <img 
          src={property.images[0].thumbnailUrl} 
          alt={property.title}
        />
      )}
    </div>
  );
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Missing API Key**: Ensure `LINEAR_API_KEY` is set in `.env.local`
2. **Wrong API URL**: Verify `LINEAR_API_URL` points to correct Linear.fi endpoint
3. **Network Issues**: Check if Linear.fi API is accessible
4. **Rate Limiting**: Implement request throttling if needed

### Debug Mode

Enable debug logging by setting:

```bash
NODE_ENV=development
```

## 📞 Support

For Linear.fi API specific issues:
- Check Linear.fi documentation
- Contact Linear.fi support
- Review API response messages for specific error codes

For integration issues:
- Check this documentation
- Run the test script to diagnose problems
- Review console errors for detailed messages 