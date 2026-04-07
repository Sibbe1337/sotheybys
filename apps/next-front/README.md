# Snellman Sotheby's International Realty — Frontend

Next.js 14 (App Router) real estate platform with trilingual support (fi/sv/en), Linear API integration, and Clean Architecture.

**Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, next-intl, Sanity CMS, Google Maps, Vercel.

---

## Architecture

```
src/
├── app/                    # Next.js App Router (pages, API routes, layouts)
├── components/             # React components
├── i18n/                   # Internationalization config (next-intl)
├── lib/
│   ├── domain/             # Business types, validation, rules (no external deps)
│   ├── application/        # Use cases (orchestrate domain + infrastructure)
│   ├── infrastructure/     # External API clients, mappers
│   ├── presentation/       # View models, formatters
│   ├── server/             # Server actions (data fetching with caching)
│   └── config/             # Environment config, company branding
└── messages/               # Translation JSON files (fi.json, sv.json, en.json)
```

Dependencies flow inward: `components → presentation → application → domain ← infrastructure`.

---

## Data Flow

```
Linear API (Azure)
    │
    ▼
LinearAPIClient.fetchListings()      ← infrastructure/linear-api/client.ts
    │  HTTP GET /v2/listings
    ▼
LinearToPropertyMapper.map()         ← infrastructure/linear-api/mapper.ts
    │  Raw JSON → Property domain model
    │  Parses prices, converts units, validates with Zod, generates slugs
    ▼
GetProperties.execute()              ← application/get-properties.usecase.ts
    │  Orchestrates client + mapper
    ▼
fetchSaleProperties(locale)          ← server/fetch-properties.ts
    │  In-memory cache (5 min TTL), filters by status
    ▼
PropertyVM.toCard(property, locale)  ← presentation/property.view-model.ts
    │  Formats currency, area, fees for display
    ▼
<FeaturedPropertyCard {...props} />  ← components/Property/FeaturedPropertyCard.tsx
```

For single property pages, `GetPropertyBySlug` fetches all listings and filters by slug (Linear API has no slug endpoint).

---

## Routes

All pages live under `src/app/[locale]/`. The filesystem uses Finnish paths; `next-intl` maps them to localized URLs via `src/i18n/pathnames.ts`.

| Route | File | Rendering | Revalidation |
|-------|------|-----------|--------------|
| `/fi` | `[locale]/page.tsx` → `HomePageClient.tsx` | ISR | 5 min |
| `/fi/kohteet` | `[locale]/kohteet/page.tsx` | Static + ISR | 5 min |
| `/fi/kohteet/vuokrakohteet` | `[locale]/kohteet/vuokrakohteet/page.tsx` | ISR | 5 min |
| `/fi/kohde/[slug]` | `[locale]/kohde/[slug]/page.tsx` | ISR + `generateStaticParams` | 5 min |
| `/fi/myymassa` | `[locale]/myymassa/page.tsx` | Static | 5 min |
| `/fi/kansainvalisesti` | `[locale]/kansainvalisesti/page.tsx` | Static | 1 hour |
| `/fi/henkilosto` | `[locale]/henkilosto/page.tsx` | ISR (Sanity) | 1 hour |
| `/fi/yhteystiedot` | `[locale]/yhteystiedot/page.tsx` | Static | 5 min |
| `/fi/yritys` | `[locale]/yritys/page.tsx` | Static | 1 hour |
| `/fi/tietosuojaseloste` | `[locale]/tietosuojaseloste/page.tsx` | Static | 1 hour |

**Localized URL examples:**
- `/fi/kohteet` = `/sv/objekt` = `/en/properties`
- `/fi/kohde/mannerheimintie-1` = `/sv/saluobjekt/mannerheimintie-1` = `/en/listing/mannerheimintie-1`

### API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/listings` | GET | Properties as JSON. Params: `lang`, `format` (domain/card/detail) |
| `/api/contact` | POST | Contact form submission. Rate-limited (5/IP/15min), Turnstile CAPTCHA |
| `/api/property-ui/[slug]` | GET | Single property UI data |
| `/api/sync-listings` | GET/POST | Manual sync trigger |
| `/api/image-proxy` | GET | Image optimization proxy |

---

## Domain Layer

`src/lib/domain/` — Business types and rules. Zero external dependencies.

### Property Type (`property.types.ts`)

```typescript
interface Property {
  id: string;
  slug: string;
  address: LocalizedValue;          // { fi: "Mannerheimintie 1", sv: "Mannerheimvägen 1" }
  city: LocalizedValue;
  postalCode: string;

  pricing: {
    sales: number;                  // Myyntihinta (ask price)
    debtFree: number;               // Velaton hinta (debt-free price)
    debt: number;                   // debtFree - sales
    propertyTax?: number;           // Only for properties (not apartments)
    biddingStartPrice?: number;     // Tarjouskauppa
    biddingUrl?: string;
  };

  dimensions: {
    living: number;                 // Bostadsyta (m²)
    total?: number;                 // Total area
    plot?: number;                  // Plot size (m², converted from ha if needed)
    business?: number;              // Commercial premises area
    rooms?: string;                 // "3h+k"
    bedrooms?: number;
    bathrooms?: number;
  };

  fees: { maintenance?, financing?, water?, heating?, electricity?, parking?, sauna? };
  features: { balcony?, terrace?, sauna?, fireplace?, storageRoom?, parkingSpace? };
  meta: { status?, productGroup?, typeCode?, listingTypeLabel, housingCompany, ... };
  media: { images[], coordinates? };
  documents: { floorPlan?, brochure?, brochureIntl?, video?, energyCert? };
  agent?: { name?, phone?, email?, photoUrl?, title? };
  rental?: { monthlyRent, securityDeposit?, contractType?, petsAllowed?, smokingAllowed? };
}
```

### Property Classification (`property-type-helpers.ts`)

Determines which detail sections render:

| productGroup | typeCode | Category | Detail Sections |
|-------------|----------|----------|-----------------|
| APARTMENTS | KERROSTALO | apartment | ApartmentSections |
| APARTMENTS | RIVITALO | apartment | ApartmentSections |
| PROPERTIES | OMAKOTITALO | property | PropertySections |
| PROPERTIES | MÖKKI_TAI_HUVILA | property | PropertySections |
| (any) | (rent > 0) | rental | RentalSections |
| (any) | LIIKEHUONEISTO | commercial | ApartmentSections |

Check order: `productGroup` first (general), then `typeCode` (specific).

### Validation (`property.schema.ts`)

Zod schema validates every property after mapping:
- `sales + debt = debtFree` (price math)
- Areas are positive numbers
- URLs are valid format
- Required fields present

### Other Domain Files

| File | Purpose |
|------|---------|
| `property.value-objects.ts` | `parseEuro()` — parses "450 000 €" to `450000` |
| `slug.ts` | `buildSlug()` — URL-safe slugs with collision prevention |
| `locale-utils.ts` | `lpick()`, `lpickStrict()` — locale-aware string picking with fallback |
| `energy.ts` | Energy class and certificate status normalization |
| `agent-utils.ts` | Agent data cleaning and validation |
| `property-type-filters.ts` | Filter definitions for property search UI |

---

## Infrastructure Layer

`src/lib/infrastructure/linear-api/` — Linear API client and data mapping.

### Client (`client.ts`)

```typescript
class LinearAPIClient {
  constructor(baseUrl: string, apiKey?: string, companyId?: string)
  async fetchListings(): Promise<LinearListing[]>
  async fetchListingBySlug(slug: string): Promise<LinearListing | null>
}
```

- Endpoint: `GET /v2/listings?languages[]=fi&languages[]=sv&languages[]=en`
- Auth: `Authorization: LINEAR-API-KEY <token>`, `x-company-id: <id>`

### Mapper (`mapper.ts`)

```typescript
class LinearToPropertyMapper {
  async map(src: LinearListing, locale: Locale): Promise<Property>
}
```

**Key pattern — Field resolution:** Linear API has inconsistent field names. The `resolve()` helper tries multiple names:

```typescript
resolve(src, nv, locale, ['maintenanceCharge', 'renovationCharge'])
```

1. Check `nonLocalizedValues` (nv) for each field name
2. Check `src[field][locale]` (localized value)
3. Check `src[field]['fi']` (Finnish fallback)
4. Return first non-empty match

**Unit conversion:** Plot areas may come as m², are (×100), or hectare (×10000). `applyUnit()` normalizes everything to m².

### Helper Files

| File | Purpose |
|------|---------|
| `mapper-helpers.ts` | `resolve()`, `lget()`, `lv()`, `toBool()`, `parseNum()`, `applyUnit()` |
| `mapper-coordinates.ts` | GPS extraction with geocoding fallback |
| `mapper-documents.ts` | Brochure, floor plan, video URL extraction from multiple field sources |
| `listing-type-localizer.ts` | Maps type codes to localized labels (KERROSTALO → Höghus) |
| `types.ts` | `LinearListing` and `LinearLocalized` TypeScript types |

---

## Presentation Layer

`src/lib/presentation/` — Formats domain models for UI.

### View Model (`property.view-model.ts`)

```typescript
class PropertyVM {
  static toCard(p: Property, locale: Locale): PropertyCardVM    // For listing grids
  static toDetail(p: Property, locale: Locale): PropertyDetailVM // For detail pages
}
```

Components never format raw numbers directly. The view model handles all locale-aware formatting.

### Formatters (`formatters/`)

| Formatter | Example |
|-----------|---------|
| `fmtCurrency(450000, 'fi-FI')` | `"450 000 €"` |
| `fmtArea(97.5, 'fi-FI')` | `"97,5 m²"` |
| `fmtFee(450, 'fi-FI')` | `"450 €/kk"` |
| `fmtPerSqm(450000, 97.5, 'fi-FI')` | `"4 615 €/m²"` |

---

## Server Actions

`src/lib/server/fetch-properties.ts` — All pages use these:

```typescript
fetchSaleProperties(locale): Promise<Property[]>
fetchRentalProperties(locale): Promise<Property[]>
fetchAllProperties(locale): Promise<Property[]>
invalidateCache(): void
```

In-memory cache with 5-minute TTL. Falls back to stale data if API fails.

---

## Caching

Three layers:

```
Browser ←── HTTP Cache-Control: max-age=300 (5 min)
   │
Vercel ←── ISR: revalidate = 300 (5 min, rebuilds in background)
   │
Server ←── In-memory cache in fetch-properties.ts (TTL 5 min)
   │
Linear API (source of truth)
```

Image cache: 30 days (`next.config.js` → `minimumCacheTTL`).

---

## Internationalization (i18n)

Uses `next-intl` with App Router.

| File | Purpose |
|------|---------|
| `src/i18n/config.ts` | Locales: `fi` (default), `sv`, `en` |
| `src/i18n/pathnames.ts` | Route translations (filesystem is Finnish) |
| `src/i18n/request.ts` | Loads message files per request |
| `src/middleware.ts` | Locale detection, always forces `/fi/`, `/sv/`, `/en/` prefix |
| `messages/*.json` | UI translation strings |

**Usage:**
```tsx
import { useTranslations } from 'next-intl';
const t = useTranslations('homepage');
<h1>{t('title')}</h1>
```

**Property data:** Fetched with all 3 languages from Linear API. Stored as `LocalizedValue` objects. View model picks locale with `lpick(value, locale)`, falls back to Finnish.

---

## Components

### Property Components

| Component | Purpose |
|-----------|---------|
| `FeaturedPropertyCard` | Main property card with carousel, prices, agent info |
| `DetailView` | Single property detail page |
| `PropertySearch` | Search with filters, grid/list/map toggle |
| `PropertyHeroCarousel` | Rotating hero for listing pages |
| `PropertyGridNew` | Grid layout wrapper |
| `MediaTabs` | Image/floor plan/video/brochure tab viewer |
| `SummaryStats` | Key property statistics |
| `ImageCarousel` | Image gallery with navigation |

Detail view renders type-specific sections:
- `sections/ApartmentSections.tsx` — Housing company, fees, energy class
- `sections/PropertySections.tsx` — Plot, property tax, building rights
- `sections/RentalSections.tsx` — Rent, deposit, contract terms

### Homepage Components

`HeroCarousel`, `FeaturedPropertiesSection`, `InfoSection`, `ContactCtaSection`, `NewsletterSection`

### Layout Components

`Header` (scroll-responsive, desktop/mobile variants), `FooterWithTeam`, `CookieConsent`, `ErrorBoundary`, `EmptyState`

---

## External Services

| Service | Purpose | Config |
|---------|---------|--------|
| **Linear API** | Property data | `LINEAR_API_URL`, `LINEAR_API_KEY`, `LINEAR_COMPANY_ID` |
| **Sanity CMS** | Staff, pages | `SANITY_PROJECT_ID`, `SANITY_DATASET` |
| **Google Maps** | Property maps | `GOOGLE_MAPS_API_KEY` |
| **Cloudflare Turnstile** | Contact form CAPTCHA | `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| **Office365 SMTP** | Contact form emails | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` |
| **Vercel** | Hosting, ISR | Auto-configured via GitHub |
| **Cloudways** | Legacy server (brochures) | `legacy.sothebysrealty.fi` |

---

## Environment Variables

```bash
# Required
NEXT_PUBLIC_LINEAR_API_URL=https://linear-external-api.azurewebsites.net
NEXT_PUBLIC_LINEAR_API_KEY=LINEAR-API-KEY <token>
NEXT_PUBLIC_COMPANY_ID=180
NEXT_PUBLIC_SANITY_PROJECT_ID=uy5hhchg
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<key>

# Contact form
CONTACT_EMAIL=info@sothebysrealty.fi
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASS=<password>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<key>
TURNSTILE_SECRET_KEY=<secret>

# Optional
NEXT_PUBLIC_BASE_URL=https://sothebysrealty.fi
```

---

## Development

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server on http://localhost:3001
pnpm build            # Production build (with locale assertion)
pnpm type-check       # TypeScript check
pnpm lint             # ESLint
pnpm test             # Vitest
```

### Data Quality Tools

```bash
pnpm data-quality              # Generate quality report
pnpm data-quality:blueprint    # Blueprint validation
pnpm data-quality:auto-fix     # Auto-fix common issues
pnpm data-quality:auto-apply   # Apply fixes
```

---

## Deployment

Deployed to **Vercel** via GitHub push to `main`. ISR pages rebuild automatically.

The legacy server (`legacy.sothebysrealty.fi`) runs on **Cloudways** (WordPress + Varnish). Brochures, FlowPaper content, and marketing materials are served from there via Next.js rewrites in `next.config.js`.

---

## Key Design Decisions

1. **Clean Architecture** — Domain layer has zero external dependencies. Infrastructure can be swapped without touching business logic.

2. **Server Actions over API routes** — Pages fetch data via server actions, not client-side API calls. API keys never reach the browser.

3. **Finnish-first localization** — Filesystem routes use Finnish. Property data falls back to Finnish when translations are missing.

4. **ISR over SSR** — Pages are statically generated and revalidated every 5 minutes. No cold-start latency.

5. **Single fetch, multiple views** — `fetchAllProperties()` returns everything. Filtering (sale/rental/sold) happens in-memory.

6. **View models as formatting boundary** — Components never format raw numbers. `PropertyVM` handles all locale-aware formatting.
