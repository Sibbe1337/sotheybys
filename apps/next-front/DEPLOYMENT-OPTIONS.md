# 🚀 Deployment Options for Sotheby's Finland

## Current Situation

We encountered issues deploying to Cloudflare Pages:
- ❌ SSL error (now fixed)
- ❌ 404 errors due to Next.js incompatibility
- ❌ TypeScript build errors with Cloudflare adapter

## Recommended Solutions

### Option 1: Deploy to Vercel (Recommended) ✅

Vercel is the native platform for Next.js and works without configuration.

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - What's your project name? sothebys-finland
# - In which directory is your code? ./
# - Want to modify settings? No
```

**Pros:**
- Zero configuration needed
- Native Next.js support
- Automatic HTTPS
- Preview deployments for each git branch
- Free tier available

**Your site will be at:** `https://sothebys-finland.vercel.app`

### Option 2: Use Netlify 🔷

Another Next.js-friendly platform:

```bash
# Install Netlify CLI
pnpm add -g netlify-cli

# Deploy
netlify deploy --prod
```

**Your site will be at:** `https://sothebys-finland.netlify.app`

### Option 3: Fix Cloudflare Deployment 🔧

If you must use Cloudflare:

1. **Fix TypeScript errors first:**
   ```bash
   # Fix the Header component error
   # Fix any other type errors
   ```

2. **Use the Cloudflare adapter:**
   ```bash
   pnpm pages:build
   pnpm pages:deploy
   ```

### Option 4: Local Tunnel (Immediate Access) 🚇

For immediate sharing without deployment:

```bash
# Using ngrok
ngrok http 3001

# Or using localtunnel
npx localtunnel --port 3001
```

## Quick Vercel Deployment

Since you need a working dev environment quickly:

```bash
# From apps/next-front directory
npx vercel --yes

# This will:
# 1. Create a new Vercel project
# 2. Deploy your app
# 3. Give you a public URL immediately
```

## Environment Variables

After deployment, add your env variables in the platform's dashboard:
- Vercel: https://vercel.com/dashboard
- Netlify: https://app.netlify.com
- Cloudflare: https://dash.cloudflare.com

Required variables:
- `WORDPRESS_URL`
- `WORDPRESS_GRAPHQL_URL`
- `WORDPRESS_AUTH_TOKEN`
- `LINEAR_API_URL`
- `LINEAR_API_KEY`
- All `NEXT_PUBLIC_*` variables

## Which Should You Choose?

- **Need it working NOW?** → Use Vercel
- **Want Cloudflare's CDN?** → Fix TypeScript errors first
- **Need custom domain?** → Any platform works
- **Budget conscious?** → All have free tiers

The fastest path to a shareable dev environment is Vercel!

