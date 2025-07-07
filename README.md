# SothebysRealty.fi Rebuild

Modern Next.js + Sanity CMS solution for SothebysRealty.fi with Linear API integration.

## Project Structure

```
sothebys-rebuild/
├── apps/
│   ├── web/              # Next.js 14 frontend (App Router, TypeScript, Tailwind)
│   └── studio/           # Sanity Studio v3 (CMS)
├── packages/
│   └── linear-client/    # Type-safe Linear API client with caching
├── .devcontainer/        # VS Code dev container configuration
└── ...                   # Root configuration files
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker (for dev container)

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd sothebys-rebuild
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/studio/.env.example apps/studio/.env.local
   ```

3. **Start development servers:**
   ```bash
   # All apps in parallel
   pnpm dev

   # Individual apps
   pnpm dev:web     # Next.js at http://localhost:3000
   pnpm dev:studio  # Sanity Studio at http://localhost:3333
   ```

### Development Container

This project includes a dev container for consistent development environment:

1. Open in VS Code
2. Install "Remote - Containers" extension
3. Press `F1` → "Remote-Containers: Reopen in Container"

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm dev:web` | Start Next.js frontend only |
| `pnpm dev:studio` | Start Sanity Studio only |
| `pnpm build` | Build all apps |
| `pnpm lint` | Run ESLint on all packages |
| `pnpm lint:fix` | Fix ESLint issues automatically |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm test` | Run all tests |
| `pnpm clean` | Clean build artifacts |

## Apps

### Web (`apps/web`)

Next.js 14 frontend with:
- App Router
- TypeScript
- Tailwind CSS
- Linear API integration
- Sanity CMS integration
- SEO optimization with JSON-LD

### Studio (`apps/studio`)

Sanity Studio v3 with:
- EU dataset
- Custom schemas for listings and pages
- Drag-and-drop listing management
- Color customization tools

## Packages

### Linear Client (`packages/linear-client`)

Type-safe wrapper around `@linear/sdk` with:
- Redis caching
- Rate limiting
- Error handling
- TypeScript types

## Infrastructure

### Development
- **Dev Container**: Docker-based development environment
- **Linting**: ESLint + Prettier with pre-commit hooks
- **Type Safety**: TypeScript across all packages

### Production
- **Frontend**: Vercel deployment with Edge Functions
- **CMS**: Sanity Studio (EU region)
- **Cache**: Upstash Redis
- **Monitoring**: Sentry error tracking
- **Analytics**: Vercel Analytics

## Environment Variables

### Required for `apps/web`
```env
LINEAR_API_KEY=
LINEAR_WEBHOOK_SECRET=
SANITY_PROJECT_ID=
SANITY_DATASET=prod
SANITY_API_TOKEN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SITE_URL=https://sothebysrealty.fi
SENTRY_DSN=
```

### Required for `apps/studio`
```env
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=prod
SANITY_STUDIO_API_TOKEN=
```

## Git Workflow

- `main` - Production branch (protected)
- `develop` - Staging branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

Pre-commit hooks run linting and formatting automatically.

## Performance Targets

- **LCP**: ≤ 1.8s (Mobile 4G)
- **Core Web Vitals**: ≥ 90/100
- **TTFB**: ≤ 150ms
- **CMS Changes**: Live within 60s

## Support

For development questions or issues, please refer to the [PRD documentation](./prd.md) or contact the development team. 