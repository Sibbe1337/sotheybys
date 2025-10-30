# Sotheby's Realty Finland - Next.js Frontend

This is the new React/Next.js frontend that replaces the WordPress The7 theme, using WordPress as a headless CMS.

## Architecture

- **Framework**: Next.js 14 with App Router and React Server Components
- **Styling**: Tailwind CSS + custom components
- **Data Fetching**: Apollo Client with GraphQL (WPGraphQL)
- **Authentication**: WPGraphQL JWT Authentication
- **Deployment**: Vercel-ready with ISR (Incremental Static Regeneration)

## Getting Started

### Prerequisites

1. **WordPress Setup**: Install and configure:
   - WPGraphQL plugin
   - WPGraphQL JWT Authentication
   - ACF to GraphQL (if using Advanced Custom Fields)

2. **Environment Variables**: Copy `env.example` to `.env.local` and configure:
   ```bash
   cp env.example .env.local
   ```

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3001`

## 📊 Data Quality Tools

This project includes comprehensive data quality tools for validating Linear API data:

### **Quick Start:**
```bash
# Run data quality validation:
npm run data-quality:blueprint

# See detailed guides:
cat BLUEPRINT-VALIDATION-GUIDE.md
cat FIELD-FIXING-GUIDE.md
```

### **Documentation:**
- [Blueprint Validation Guide](./BLUEPRINT-VALIDATION-GUIDE.md) - How to use the validation tool
- [Field Fixing Guide](./FIELD-FIXING-GUIDE.md) - Practical guide to fix missing fields
- [Data Quality Guide](./DATA-QUALITY-GUIDE.md) - General data quality improvement
- [Tracking Template](./DATA-QUALITY-TRACKER-TEMPLATE.md) - Track weekly progress

**Current Baseline:** 49.3% → **Target:** 95%+

### WordPress Integration

This app fetches content from WordPress via GraphQL:

- **Pages**: WordPress pages → Dynamic routes `/[slug]`
- **Posts**: WordPress posts → Dynamic routes `/[slug]` with blog metadata
- **Menus**: WordPress menus → React navigation components
- **Settings**: Site settings, logo, etc.

### Component Mapping

| WordPress PHP Template | React Component | Description |
|------------------------|----------------|-------------|
| `template-parts/header/branding.php` | `<HeaderBranding />` | Logo and site title |
| `template-parts/header/primary-menu.php` | `<MainMenu />` | Primary navigation menu |
| `template-parts/footer/bottom-bar.php` | `<FooterBottomBar />` | Footer with copyright and social links |
| `template-blog-list.php` | `<BlogList />` | Blog listing with pagination |
| `single.php` | `/[slug]/page.tsx` | Single post/page template |

### Development

```bash
# Development
pnpm dev

# Type checking
pnpm type-check

# Build for production
pnpm build

# Start production server
pnpm start
```

### GraphQL Code Generation

Generate TypeScript types from your WordPress GraphQL schema:

```bash
# Update the schema URL in codegen.yml
# Then run:
pnpm graphql-codegen
```

### ISR (Incremental Static Regeneration)

Pages are statically generated and revalidated every 60 seconds:

```typescript
export const revalidate = 60; // seconds
```

## Environment Variables

```bash
# WordPress Configuration
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_GRAPHQL_URL=https://your-wordpress-site.com/graphql
WORDPRESS_AUTH_TOKEN=your-jwt-token-here

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com

# Preview Mode
WORDPRESS_PREVIEW_SECRET=your-preview-secret-here
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms

The app can be deployed to any platform that supports Node.js:

- **Netlify**: Use `@netlify/plugin-nextjs`
- **Railway**: Direct deployment
- **DigitalOcean App Platform**: Node.js buildpack

## Migration Strategy

1. ✅ **Phase 1**: Basic structure and WordPress integration
2. 🔄 **Phase 2**: Migrate header, footer, and basic pages
3. 📋 **Phase 3**: Blog functionality and dynamic routing
4. 🎨 **Phase 4**: Advanced components and custom post types
5. 🚀 **Phase 5**: Performance optimization and go-live

## Features

- [x] Server-side rendering (SSR) and Static Site Generation (SSG)
- [x] GraphQL integration with WordPress
- [x] Responsive design with Tailwind CSS
- [x] TypeScript support
- [x] SEO optimization
- [ ] Preview mode for draft content
- [ ] Image optimization
- [ ] Sitemap generation
- [ ] Multi-language support (if needed)

## Support

For questions about this implementation, refer to the main project documentation or contact the development team. 