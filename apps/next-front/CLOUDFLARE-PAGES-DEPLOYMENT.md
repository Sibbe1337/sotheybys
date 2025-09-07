# 🚀 Cloudflare Pages Deployment Guide

This guide will help you deploy the Sotheby's Finland Next.js app to Cloudflare Pages for a shareable development environment.

## Prerequisites

1. **Cloudflare Account**: Sign up at https://dash.cloudflare.com/sign-up
2. **Wrangler CLI**: Install globally with npm or pnpm

## Step 1: Install Wrangler CLI

```bash
# Using npm
npm install -g wrangler

# Or using pnpm (recommended)
pnpm add -g wrangler
```

## Step 2: Login to Cloudflare

```bash
# From the apps/next-front directory
cd apps/next-front

# Login to Cloudflare
pnpm wrangler:login
# or
wrangler login
```

This will open your browser to authenticate with Cloudflare.

## Step 3: Create Environment File

Create a `.env.production` file for Cloudflare Pages:

```bash
cp env.example .env.production
```

Edit `.env.production` with your production values:

```env
# WordPress Configuration
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_GRAPHQL_URL=https://your-wordpress-site.com/graphql
WORDPRESS_AUTH_TOKEN=your-jwt-token-here

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=https://sothebys-finland.pages.dev
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://your-wordpress-site.com/graphql
NEXT_PUBLIC_WORDPRESS_SITE_URL=https://your-wordpress-site.com

# Linear.fi API Configuration
LINEAR_API_URL=https://api.linear.fi/v1
LINEAR_API_KEY=your-linear-api-key-here

# JWT Configuration
WORDPRESS_JWT_AUTH_SECRET_KEY=your-secret-key
WORDPRESS_JWT_USERNAME=api_user
WORDPRESS_JWT_PASSWORD=your-password
```

## Step 4: Build the Project

First, we need to use the Cloudflare-specific Next.js configuration:

```bash
# Temporarily use the Cloudflare config
cp next.config.cloudflare.js next.config.js

# Build the project
pnpm build

# Restore original config
git checkout next.config.js
```

## Step 5: Deploy to Cloudflare Pages

### First-time deployment (creates the project):

```bash
# Deploy to preview environment
pnpm deploy:preview

# Or deploy to production
pnpm deploy:production
```

### Subsequent deployments:

```bash
# Build and deploy in one command
pnpm build && pnpm deploy:preview
```

## Step 6: Configure Environment Variables in Cloudflare Dashboard

1. Go to https://dash.cloudflare.com/
2. Navigate to Pages → your project → Settings → Environment variables
3. Add all environment variables from your `.env.production` file
4. Set variables for both Production and Preview environments

### Required Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `WORDPRESS_URL` | WordPress site URL | `https://your-site.com` |
| `WORDPRESS_GRAPHQL_URL` | GraphQL endpoint | `https://your-site.com/graphql` |
| `WORDPRESS_AUTH_TOKEN` | JWT authentication token | `eyJ0eXAiOiJKV1...` |
| `NEXT_PUBLIC_SITE_URL` | Your Cloudflare Pages URL | `https://sothebys-finland.pages.dev` |
| `NEXT_PUBLIC_WORDPRESS_URL` | WordPress URL (public) | `https://your-site.com` |
| `LINEAR_API_URL` | Linear.fi API endpoint | `https://api.linear.fi/v1` |
| `LINEAR_API_KEY` | Linear.fi API key | `your-api-key` |

## Step 7: Custom Domain (Optional)

To add a custom domain:

1. Go to Pages → your project → Custom domains
2. Add your domain (e.g., `dev.sothebys-finland.com`)
3. Update DNS records as instructed

## Deployment URLs

After deployment, your app will be available at:

- **Production**: `https://sothebys-finland.pages.dev`
- **Preview**: `https://preview.sothebys-finland.pages.dev`
- **Branch deploys**: `https://[branch-name].sothebys-finland.pages.dev`

## Automated Deployments

### GitHub Integration

1. Connect your GitHub repository in Cloudflare Pages dashboard
2. Set build configuration:
   - Build command: `pnpm build`
   - Build output directory: `.next`
   - Root directory: `apps/next-front`

### Build Settings

```yaml
Production branch: main
Preview branches: All non-production branches
Build command: pnpm build
Build output directory: .next
Root directory: apps/next-front
Environment variables: (set in dashboard)
```

## Troubleshooting

### Common Issues

1. **Build fails with "Module not found"**
   - Ensure all dependencies are installed: `pnpm install`
   - Check that `node_modules` is not in `.gitignore` for Pages

2. **Environment variables not working**
   - Redeploy after adding variables in dashboard
   - Check variable names match exactly

3. **Images not loading**
   - Cloudflare Pages doesn't support Next.js Image Optimization
   - We've set `unoptimized: true` in the config

4. **API routes not working**
   - Cloudflare Pages has limited support for Next.js API routes
   - Consider using Cloudflare Workers for complex API logic

### Logs and Debugging

View deployment logs:
```bash
wrangler pages deployment list --project-name=sothebys-finland
wrangler pages deployment tail --project-name=sothebys-finland
```

## Quick Deploy Script

Create a `deploy.sh` script for easy deployment:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying to Cloudflare Pages..."

# Use Cloudflare config
cp next.config.cloudflare.js next.config.js

# Build
echo "📦 Building project..."
pnpm build

# Deploy
echo "☁️  Deploying to preview..."
pnpm deploy:preview

# Restore original config
git checkout next.config.js

echo "✅ Deployment complete!"
echo "🌐 Visit: https://sothebys-finland.pages.dev"
```

Make it executable:
```bash
chmod +x deploy.sh
```

## Alternative: Using @cloudflare/next-on-pages

For better Next.js compatibility on Cloudflare Pages:

```bash
# Install the adapter
pnpm add -D @cloudflare/next-on-pages

# Build with the adapter
npx @cloudflare/next-on-pages

# Deploy the output
wrangler pages deploy .vercel/output/static --project-name=sothebys-finland
```

## Share Development Environment

Once deployed, share these URLs with your team:

- **Preview URL**: `https://preview.sothebys-finland.pages.dev`
- **Production URL**: `https://sothebys-finland.pages.dev`

The preview environment automatically updates with each push to non-main branches.

## Next Steps

1. Set up continuous deployment with GitHub
2. Configure custom domain if needed
3. Set up Cloudflare Analytics
4. Consider Cloudflare Workers for API endpoints
5. Enable Cloudflare caching for better performance

---

**Note**: Remember to keep your environment variables secure and never commit them to version control!
