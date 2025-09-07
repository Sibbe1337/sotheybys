#!/bin/bash

# Static Export Deployment for Cloudflare Pages
# This approach exports the Next.js app as static HTML

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Building static export for Cloudflare Pages...${NC}"

# Build the static export
echo -e "${YELLOW}📦 Building static site...${NC}"
pnpm build

# Export static HTML
echo -e "${YELLOW}📤 Exporting static files...${NC}"
pnpm next export -o out

# Deploy to Cloudflare Pages
echo -e "${YELLOW}☁️  Deploying to Cloudflare Pages...${NC}"
wrangler pages deploy out --project-name=sothebys-finland-static --branch=preview

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Your static site is available at: https://sothebys-finland-static.pages.dev${NC}"

