# 🚀 Quick Deploy to Cloudflare Pages

Follow these steps to deploy your Sotheby's Finland app to a public development environment.

## Step 1: Login to Cloudflare

```bash
wrangler login
```

This will open your browser. Log in or create a free Cloudflare account.

## Step 2: Deploy Your App

Run the deployment script:

```bash
# Deploy to preview environment (recommended for testing)
./deploy-cloudflare.sh preview

# Or deploy to production
./deploy-cloudflare.sh production
```

## Step 3: First-time Setup

On your first deployment, Cloudflare will:
1. Create a new Pages project called `sothebys-finland`
2. Upload your built Next.js app
3. Provide you with URLs to access your app

## Step 4: Configure Environment Variables

After first deployment:

1. Visit https://dash.cloudflare.com
2. Go to **Workers & Pages** → **sothebys-finland** → **Settings** → **Environment variables**
3. Add these required variables:

### Production Environment Variables:
- `WORDPRESS_URL` - Your WordPress site URL
- `WORDPRESS_GRAPHQL_URL` - GraphQL endpoint (usually `your-site.com/graphql`)
- `WORDPRESS_AUTH_TOKEN` - JWT token for authentication
- `LINEAR_API_URL` - https://api.linear.fi/v1
- `LINEAR_API_KEY` - Your Linear.fi API key
- All `NEXT_PUBLIC_*` variables from env.example

### Preview Environment Variables:
Same as production, but you can use different values for testing.

## Step 5: Access Your App

Your app will be available at:
- **Preview**: https://preview.sothebys-finland.pages.dev
- **Production**: https://sothebys-finland.pages.dev

## Troubleshooting

### "Project not found" error
This is normal on first deployment. Wrangler will create the project automatically.

### Build errors
- Make sure all dependencies are installed: `pnpm install`
- Check that you're in the `apps/next-front` directory

### Environment variables not working
- After adding variables in dashboard, redeploy: `./deploy-cloudflare.sh`
- Variables must be added for each environment (production/preview)

## Quick Commands

```bash
# Check deployment status
wrangler pages deployment list --project-name=sothebys-finland

# View deployment logs
wrangler pages deployment tail --project-name=sothebys-finland

# Deploy directly without script
pnpm build && wrangler pages deploy .next --project-name=sothebys-finland --branch=preview
```

## Share with Team

Once deployed, share these URLs:
- Preview: https://preview.sothebys-finland.pages.dev
- Production: https://sothebys-finland.pages.dev

The site will update automatically when you redeploy!
