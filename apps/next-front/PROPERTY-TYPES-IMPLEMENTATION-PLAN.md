# Property Types System - Robust Implementation Plan

## 📋 Current Status

✅ **Completed:**
- Comprehensive property types (100+ fields)
- Multilingual support (fi/en/sv)
- Linear API mapper
- Demo page
- Documentation

⚠️ **Needs Implementation:**
- Integration with existing codebase
- Error handling & validation
- Caching strategy
- Testing
- Production configuration

---

## 🎯 Phase 1: Critical Integration (High Priority)

### 1.1 Replace Existing Property Routes ⚡ CRITICAL

**Current State:**
- `src/app/api/property/[slug]/route.ts` - Uses old format
- `src/app/property/[slug]/page.tsx` - Expects old format

**What to Do:**
```typescript
// apps/next-front/src/app/api/property/[slug]/route.ts
import { mapLinearAPIToProperty } from '@/lib/linear-api-to-property-mapper';
import { MultilingualPropertyListing } from '@/lib/property-types-multilang';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(request.url);
  const language = (searchParams.get('lang') || 'fi') as 'fi' | 'en' | 'sv';
  
  // Get from cache
  await ensureCacheInitialized();
  const linearListing = listingsCache.getListingBySlug(slug);
  
  if (!linearListing) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }
  
  // Convert to multilingual format
  const property: MultilingualPropertyListing = mapLinearAPIToProperty(linearListing);
  
  return NextResponse.json({ success: true, data: property });
}
```

**Files to Update:**
- [ ] `src/app/api/property/[slug]/route.ts`
- [ ] `src/app/api/listings/route.ts`
- [ ] `src/app/property/[slug]/page.tsx`

**Estimated Time:** 2-3 hours

---

### 1.2 Update Listings Cache to Use New Types ⚡ CRITICAL

**Current State:**
- `listings-cache.ts` uses old `CompleteLinearAPIListing`
- Converter uses old format

**What to Do:**
```typescript
// apps/next-front/src/lib/listings-cache.ts
import { 
  LinearAPIListing,
  mapLinearAPIToProperty,
  MultilingualPropertyListing 
} from './linear-api-to-property-mapper';

class ListingsCache {
  private cache: {
    listings: LinearAPIListing[];           // Raw from API
    converted: MultilingualPropertyListing[]; // Converted format
    lastSyncTime: Date;
  };
  
  getConvertedListing(slug: string): MultilingualPropertyListing | null {
    return this.cache.converted.find(p => 
      generatePropertySlugMultilang(p.streetAddress, p.city, 'fi') === slug
    ) || null;
  }
}
```

**Files to Update:**
- [ ] `src/lib/listings-cache.ts`
- [ ] Remove old converters: `linear-api-complete-converter.ts`
- [ ] Update imports across codebase

**Estimated Time:** 2-4 hours

---

### 1.3 Environment Variables Configuration 🔧

**What to Do:**

Create `.env.example`:
```bash
# Linear API Configuration
LINEAR_API_URL=https://ca-externalapi-test-weu-001.livelyrock-4a193af6.westeurope.azurecontainerapps.io
LINEAR_API_KEY=your-api-key-here
LINEAR_COMPANY_ID=your-company-id-here

# Cache Configuration
CACHE_TTL=600  # 10 minutes
SYNC_INTERVAL=600000  # 10 minutes in milliseconds

# Feature Flags
ENABLE_MULTILANG=true
DEFAULT_LANGUAGE=fi
SUPPORTED_LANGUAGES=fi,en,sv
```

Add to Vercel:
```bash
vercel env add LINEAR_API_KEY
vercel env add LINEAR_COMPANY_ID
vercel env add LINEAR_API_URL
```

**Files to Create:**
- [ ] `.env.example`
- [ ] `.env.local` (for local dev)
- [ ] Update Vercel environment variables

**Estimated Time:** 30 minutes

---

## 🛡️ Phase 2: Error Handling & Validation (High Priority)

### 2.1 Request Validation Middleware

**What to Do:**
```typescript
// apps/next-front/src/lib/validation.ts
import { z } from 'zod';
import { validateLinearAPIListing } from './linear-api-to-property-mapper';

export const LanguageSchema = z.enum(['fi', 'en', 'sv']);

export const PropertyRequestSchema = z.object({
  slug: z.string().min(1).max(200),
  lang: LanguageSchema.optional(),
});

export function validatePropertyRequest(data: unknown) {
  return PropertyRequestSchema.parse(data);
}

export function validateLinearData(data: unknown) {
  const validation = validateLinearAPIListing(data as any);
  if (!validation.isValid) {
    throw new Error(`Invalid Linear API data: ${validation.missingFields.join(', ')}`);
  }
  return data;
}
```

**Files to Create:**
- [ ] `src/lib/validation.ts`
- [ ] `src/lib/errors.ts` (custom error classes)

**Estimated Time:** 2 hours

---

### 2.2 Error Boundaries and Fallbacks

**What to Do:**
```typescript
// apps/next-front/src/components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class PropertyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Property error:', error, errorInfo);
    // Log to monitoring service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Kiinteistötietojen lataus epäonnistui</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Yritä uudelleen
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Files to Update:**
- [ ] `src/components/ErrorBoundary.tsx`
- [ ] Wrap property pages with error boundary

**Estimated Time:** 1-2 hours

---

### 2.3 API Error Handling

**What to Do:**
```typescript
// apps/next-front/src/lib/api-client.ts
export class LinearAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any
  ) {
    super(message);
    this.name = 'LinearAPIError';
  }
}

export async function fetchLinearAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${process.env.LINEAR_API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `LINEAR-API-KEY ${process.env.LINEAR_API_KEY}`,
        'X-Company-Id': process.env.LINEAR_COMPANY_ID || '',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new LinearAPIError(
        `Linear API error: ${response.statusText}`,
        response.status,
        await response.json().catch(() => null)
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof LinearAPIError) throw error;
    
    throw new LinearAPIError(
      'Network error connecting to Linear API',
      500,
      { originalError: error }
    );
  }
}
```

**Files to Create:**
- [ ] `src/lib/api-client.ts`
- [ ] Update all API calls to use this client

**Estimated Time:** 2 hours

---

## 💾 Phase 3: Caching & Performance (Medium Priority)

### 3.1 Enhanced Caching Strategy

**Current Issues:**
- No Redis/persistent cache
- Memory-only cache (lost on restart)
- No cache invalidation strategy

**What to Do:**
```typescript
// apps/next-front/src/lib/cache-manager.ts
import { Redis } from '@upstash/redis';
import { MultilingualPropertyListing } from './property-types-multilang';

class CacheManager {
  private redis?: Redis;
  private memoryCache = new Map<string, any>();
  
  constructor() {
    if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
      this.redis = new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
      });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    // Try Redis first
    if (this.redis) {
      try {
        const data = await this.redis.get<T>(key);
        if (data) return data;
      } catch (error) {
        console.warn('Redis get error:', error);
      }
    }
    
    // Fallback to memory cache
    return this.memoryCache.get(key) || null;
  }

  async set<T>(key: string, value: T, ttl: number = 600): Promise<void> {
    // Set in Redis
    if (this.redis) {
      try {
        await this.redis.setex(key, ttl, value);
      } catch (error) {
        console.warn('Redis set error:', error);
      }
    }
    
    // Always set in memory as fallback
    this.memoryCache.set(key, value);
    
    // Auto-expire memory cache
    setTimeout(() => this.memoryCache.delete(key), ttl * 1000);
  }

  async invalidate(pattern: string): Promise<void> {
    if (this.redis) {
      try {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } catch (error) {
        console.warn('Redis invalidate error:', error);
      }
    }
    
    // Clear memory cache matching pattern
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();
```

**Environment Variables Needed:**
```bash
REDIS_URL=https://your-upstash-redis.upstash.io
REDIS_TOKEN=your-redis-token
```

**Files to Create:**
- [ ] `src/lib/cache-manager.ts`
- [ ] Update `listings-cache.ts` to use CacheManager

**Estimated Time:** 3-4 hours

---

### 3.2 Image Optimization

**What to Do:**
```typescript
// apps/next-front/src/lib/image-optimizer.ts
export function getOptimizedImageUrl(
  originalUrl: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg';
  } = {}
): string {
  const { width = 1200, quality = 80, format = 'webp' } = options;
  
  // If already compressed, use it
  if (originalUrl.includes('compressed-')) {
    return originalUrl;
  }
  
  // Use Next.js Image Optimization API
  const params = new URLSearchParams({
    url: originalUrl,
    w: width.toString(),
    q: quality.toString(),
  });
  
  return `/api/image-proxy?${params}`;
}

// Usage in components
<Image
  src={getOptimizedImageUrl(property.photoUrls[0], { width: 800 })}
  alt={getLocalizedValue(property.heading, language)}
  width={800}
  height={600}
  loading="lazy"
/>
```

**Files to Create:**
- [ ] `src/lib/image-optimizer.ts`
- [ ] `src/app/api/image-proxy/route.ts`

**Estimated Time:** 2 hours

---

## ✅ Phase 4: Testing (Medium Priority)

### 4.1 Unit Tests

**What to Do:**
```typescript
// apps/next-front/src/lib/__tests__/property-mapper.test.ts
import { describe, it, expect } from 'vitest';
import { mapLinearAPIToProperty } from '../linear-api-to-property-mapper';
import { mockLinearListing } from './fixtures/linear-listing';

describe('mapLinearAPIToProperty', () => {
  it('should map basic fields correctly', () => {
    const result = mapLinearAPIToProperty(mockLinearListing);
    
    expect(result.streetAddress.fi).toBe('Mannerheimintie 10');
    expect(result.city.fi).toBe('Helsinki');
    expect(result.salesPrice).toBe(500000);
  });

  it('should handle missing optional fields', () => {
    const listing = { ...mockLinearListing, sauna: undefined };
    const result = mapLinearAPIToProperty(listing);
    
    expect(result.sauna).toBe(false);
  });

  it('should extract compressed images', () => {
    const result = mapLinearAPIToProperty(mockLinearListing);
    
    expect(result.photoUrls[0]).toContain('compressed');
  });
});
```

**Setup Testing:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Files to Create:**
- [ ] `src/lib/__tests__/property-mapper.test.ts`
- [ ] `src/lib/__tests__/property-types.test.ts`
- [ ] `src/lib/__tests__/fixtures/` (test data)
- [ ] `vitest.config.ts`

**Estimated Time:** 4-6 hours

---

### 4.2 Integration Tests

**What to Do:**
```typescript
// apps/next-front/src/app/api/__tests__/property.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { GET } from '../property/[slug]/route';

describe('Property API', () => {
  it('should return property by slug', async () => {
    const request = new Request('http://localhost:3000/api/property/test-slug?lang=fi');
    const response = await GET(request, { params: { slug: 'test-slug' } });
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('streetAddress');
  });

  it('should return 404 for non-existent property', async () => {
    const request = new Request('http://localhost:3000/api/property/nonexistent');
    const response = await GET(request, { params: { slug: 'nonexistent' } });
    
    expect(response.status).toBe(404);
  });
});
```

**Files to Create:**
- [ ] API route tests
- [ ] E2E tests with Playwright

**Estimated Time:** 4-6 hours

---

## 🔍 Phase 5: Monitoring & Observability (Low Priority)

### 5.1 Logging

**What to Do:**
```typescript
// apps/next-front/src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

// Usage
logger.info({ slug, language }, 'Fetching property');
logger.error({ error, slug }, 'Failed to fetch property');
```

**Files to Create:**
- [ ] `src/lib/logger.ts`
- [ ] Replace all `console.log` with logger

**Estimated Time:** 2 hours

---

### 5.2 Performance Monitoring

**What to Do:**
```typescript
// apps/next-front/src/lib/performance.ts
export function trackAPIPerformance(operation: string) {
  const start = Date.now();
  
  return {
    end: () => {
      const duration = Date.now() - start;
      
      // Log to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'api_performance', {
          operation,
          duration,
        });
      }
      
      // Log slow operations
      if (duration > 1000) {
        logger.warn({ operation, duration }, 'Slow API operation');
      }
    },
  };
}

// Usage
const perf = trackAPIPerformance('fetch_property');
const property = await fetchProperty(slug);
perf.end();
```

**Files to Create:**
- [ ] `src/lib/performance.ts`
- [ ] Add to critical paths

**Estimated Time:** 2-3 hours

---

## 📝 Phase 6: Documentation & Developer Experience (Low Priority)

### 6.1 TypeScript Strict Mode

**What to Do:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Files to Update:**
- [ ] Fix all TypeScript errors in strict mode
- [ ] Add proper type guards

**Estimated Time:** 3-4 hours

---

### 6.2 API Documentation

**What to Do:**
- [ ] Add OpenAPI/Swagger documentation
- [ ] Create Postman collection
- [ ] Add JSDoc comments

**Estimated Time:** 2-3 hours

---

## 🎯 Priority Summary

### 🔴 **CRITICAL (Do First)** - Estimated: 1-2 days
1. ✅ Replace existing property routes with new types
2. ✅ Update listings cache
3. ✅ Environment variables setup
4. ✅ Basic error handling

### 🟡 **HIGH PRIORITY** - Estimated: 2-3 days
5. ✅ Validation middleware
6. ✅ Enhanced caching with Redis
7. ✅ API error handling
8. ✅ Image optimization

### 🟢 **MEDIUM PRIORITY** - Estimated: 3-4 days
9. ✅ Unit tests
10. ✅ Integration tests
11. ✅ Error boundaries
12. ✅ Performance monitoring

### 🔵 **LOW PRIORITY** - Estimated: 1-2 days
13. ✅ Logging infrastructure
14. ✅ TypeScript strict mode
15. ✅ API documentation
16. ✅ Analytics integration

---

## 📊 Total Estimated Time

- **Critical:** 1-2 days
- **High Priority:** 2-3 days
- **Medium Priority:** 3-4 days
- **Low Priority:** 1-2 days

**Total: 7-11 days** for complete robust implementation

---

## 🚀 Quick Start (Next Steps)

To implement this robustly, start here:

```bash
# 1. Set up environment variables
cp .env.example .env.local
# Add your Linear API credentials

# 2. Update property route
# Edit: src/app/api/property/[slug]/route.ts
# Use the new mapLinearAPIToProperty function

# 3. Update listings cache
# Edit: src/lib/listings-cache.ts
# Replace old converter with new mapper

# 4. Test locally
npm run dev
# Visit: http://localhost:3000/property-types-demo

# 5. Deploy
git add .
git commit -m "feat: Integrate multilingual property types"
git push
```

---

## 📞 Questions to Answer

Before proceeding, clarify:

1. **Redis/Caching:** Do you have Upstash Redis or another cache solution?
2. **Monitoring:** Do you use Sentry, LogRocket, or another monitoring tool?
3. **Testing:** What's your preferred testing setup? (Jest/Vitest/Cypress)
4. **CI/CD:** Do you have GitHub Actions or other CI/CD pipelines?
5. **Analytics:** Google Analytics, Posthog, or other analytics?

---

**Last Updated:** October 20, 2025  
**Status:** Implementation Plan - Ready for Execution

