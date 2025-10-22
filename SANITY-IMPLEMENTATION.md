# Sanity CMS Implementation - Sotheby's Realty Finland

## 📋 Overview

This document describes the Sanity CMS integration for the Sotheby's Realty Finland website. Sanity provides a modern, flexible content management system that allows non-technical team members to easily update website content.

## 🎯 What Has Been Implemented

### ✅ Phase 1: Setup & Configuration (COMPLETED)
- ✅ Sanity Studio installed and configured
- ✅ Project ID: `uy5hhchg`
- ✅ Dataset: `production`
- ✅ Environment variables configured

### ✅ Phase 2: Schema Design (COMPLETED)
- ✅ **Staff Schema**: Manage team members with multilingual support (fi/sv/en)
- ✅ **Page Schema**: Create and edit static pages with SEO fields
- ✅ **Global Settings Schema**: Site-wide settings (contact, social media, colors, analytics)

### ✅ Phase 3: Next.js Integration (COMPLETED)
- ✅ Sanity client installed (`@sanity/client`, `@sanity/image-url`, `@portabletext/react`)
- ✅ GROQ queries created for fetching data
- ✅ Helper functions for data fetching
- ✅ TypeScript interfaces defined

### 🚧 Phase 4: Content Migration (IN PROGRESS)
- ✅ Migration script created (`scripts/migrate-staff-to-sanity.ts`)
- ⏳ Awaiting API token to run migration
- ⏳ Staff data to be uploaded to Sanity

### 🚧 Phase 5: Component Updates (IN PROGRESS)
- ✅ Footer component updated to accept Sanity data
- ⏳ Staff page to be updated
- ⏳ Other pages to be updated

### ⏳ Phase 6: Deployment (PENDING)
- Deploy Sanity Studio to `sothebys-cms.sanity.studio`
- Configure Vercel environment variables
- Set up CORS for production domain

### ⏳ Phase 7: Testing (PENDING)
- Functional testing
- Performance testing
- Error handling validation

### ⏳ Phase 8: Documentation & Training (PENDING)
- ✅ User guide created (`apps/studio/GUIDE.md`)
- ⏳ Video tutorials to be recorded
- ⏳ Team training session to be scheduled

## 🏗️ Architecture

### Data Flow
```
Sanity Studio (CMS)
    ↓
Sanity API (GROQ queries)
    ↓
Next.js Server Components
    ↓
React Client Components
    ↓
User's Browser
```

### File Structure
```
apps/
├── studio/                          # Sanity Studio
│   ├── schemas/
│   │   ├── documents/
│   │   │   ├── staff.ts            # Staff member schema
│   │   │   ├── page.ts             # Page schema
│   │   │   └── listingOverride.ts  # Featured listings
│   │   └── singletons/
│   │       └── globalSettings.ts   # Global settings
│   ├── sanity.config.ts            # Sanity configuration
│   ├── GUIDE.md                    # User guide
│   └── .env.local                  # Environment variables
│
└── next-front/                      # Next.js Frontend
    ├── src/
    │   ├── lib/
    │   │   ├── sanity.ts           # Sanity client & queries
    │   │   └── sanity-queries.ts   # Data fetching functions
    │   └── components/
    │       └── Footer/
    │           ├── FooterWithTeam.tsx        # Client component
    │           └── FooterWithTeamSanity.tsx  # Server wrapper
    ├── scripts/
    │   └── migrate-staff-to-sanity.ts  # Migration script
    └── .env.local                      # Environment variables
```

## 🔑 Environment Variables

### Sanity Studio (`apps/studio/.env.local`)
```env
SANITY_STUDIO_PROJECT_ID="uy5hhchg"
SANITY_STUDIO_DATASET="production"
SANITY_STUDIO_API_VERSION="2024-01-01"
```

### Next.js (`apps/next-front/.env.local`)
```env
NEXT_PUBLIC_SANITY_PROJECT_ID="uy5hhchg"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_READ_TOKEN=""  # To be added
```

### Vercel (Production)
```env
NEXT_PUBLIC_SANITY_PROJECT_ID="uy5hhchg"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_READ_TOKEN="sk_prod_..."  # To be added
```

## 📝 Schemas

### Staff Member
```typescript
{
  name: string;
  slug: slug;
  role: {
    fi: string;
    sv: string;
    en: string;
  };
  email: email;
  phone: string;
  photo: image;
  bio: {
    fi: block[];
    sv: block[];
    en: block[];
  };
  specialization: string[];
  order: number;
  active: boolean;
}
```

### Page
```typescript
{
  title: string;
  slug: slug;
  description: text;
  content: block[];
  seo: {
    metaTitle: string;
    metaDescription: text;
    ogImage: image;
  };
  publishedAt: datetime;
}
```

### Global Settings
```typescript
{
  title: string;
  description: text;
  colors: {
    primary: color;
    secondary: color;
    background: color;
    text: color;
  };
  logo: image;
  contact: {
    email: email;
    phone: string;
    address: text;
  };
  social: {
    facebook: url;
    instagram: url;
    linkedin: url;
    twitter: url;
  };
  seo: {
    metaTitle: string;
    metaDescription: text;
    ogImage: image;
    favicon: image;
  };
  analytics: {
    googleAnalyticsId: string;
    googleTagManagerId: string;
  };
}
```

## 🚀 Next Steps

### Immediate Actions Required:

1. **Generate Sanity API Token**
   ```bash
   cd apps/studio
   npx sanity manage
   # Navigate to API → Tokens → Add API token
   # Name: "Next.js Production"
   # Permissions: "Read"
   # Copy token and add to .env.local
   ```

2. **Run Staff Migration**
   ```bash
   cd apps/next-front
   export SANITY_API_TOKEN="your_token_here"
   npx tsx scripts/migrate-staff-to-sanity.ts
   ```

3. **Update Staff Page Component**
   - Replace hardcoded data with Sanity queries
   - Test locally

4. **Deploy Sanity Studio**
   ```bash
   cd apps/studio
   npm run build
   npm run deploy
   ```

5. **Configure Vercel**
   - Add environment variables
   - Redeploy Next.js app

6. **Configure CORS**
   - Go to https://sanity.io/manage
   - Add production domains

7. **Test Everything**
   - Verify Sanity Studio access
   - Test content updates
   - Verify changes appear on website

8. **Train Team**
   - Schedule training session
   - Record video tutorials
   - Provide documentation

## 📚 Resources

- **Sanity Studio**: https://sothebys-cms.sanity.studio (after deployment)
- **Sanity Dashboard**: https://www.sanity.io/manage/project/uy5hhchg
- **User Guide**: `apps/studio/GUIDE.md`
- **Sanity Documentation**: https://www.sanity.io/docs
- **GROQ Documentation**: https://www.sanity.io/docs/groq

## 🆘 Troubleshooting

### Sanity Studio won't start
```bash
cd apps/studio
rm -rf node_modules
npm install
npm run dev
```

### Next.js can't fetch Sanity data
1. Check environment variables are set
2. Verify Sanity project ID is correct
3. Check CORS settings in Sanity dashboard
4. Verify API token has correct permissions

### Images not loading
1. Verify images are uploaded to Sanity
2. Check `urlFor()` helper is used correctly
3. Verify image URLs are valid

### Changes not appearing on website
1. Wait 60 seconds (ISR revalidation)
2. Clear browser cache
3. Verify content is published in Sanity
4. Check Next.js logs for errors

## 📞 Support

- **Technical Issues**: dev@sothebysrealty.fi
- **Sanity Support**: https://sanity.io/help
- **Emergency**: Contact IT team

---

**Last Updated**: 2025-10-22
**Version**: 1.0
**Status**: 🚧 In Progress (Phase 4/8)

