#!/bin/bash

# Cloudflare Pages Deployment Script for Sotheby's Finland
# Usage: ./deploy-cloudflare.sh [preview|production]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default to preview if no argument provided
ENVIRONMENT=${1:-preview}

echo -e "${YELLOW}🚀 Starting Cloudflare Pages deployment...${NC}"
echo -e "Environment: ${GREEN}$ENVIRONMENT${NC}"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found!${NC}"
    echo "Please install it with: pnpm add -g wrangler"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Not in the apps/next-front directory!${NC}"
    exit 1
fi

# Backup original next.config.js
echo -e "${YELLOW}📋 Backing up original config...${NC}"
cp next.config.js next.config.js.backup

# Use Cloudflare-specific config
echo -e "${YELLOW}🔧 Switching to Cloudflare config...${NC}"
cp next.config.cloudflare.js next.config.js

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    pnpm install
fi

# Build the project
echo -e "${YELLOW}🔨 Building project...${NC}"
pnpm build

# Deploy based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}☁️  Deploying to production...${NC}"
    wrangler pages deploy .next --project-name=sothebys-finland --branch=main
    DEPLOY_URL="https://sothebys-finland.pages.dev"
else
    echo -e "${YELLOW}☁️  Deploying to preview...${NC}"
    wrangler pages deploy .next --project-name=sothebys-finland --branch=preview
    DEPLOY_URL="https://preview.sothebys-finland.pages.dev"
fi

# Restore original config
echo -e "${YELLOW}♻️  Restoring original config...${NC}"
mv next.config.js.backup next.config.js

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Your app is available at: $DEPLOY_URL${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Set environment variables in Cloudflare dashboard"
echo "2. Visit: https://dash.cloudflare.com/pages"
echo "3. Navigate to your project → Settings → Environment variables"
echo ""
echo -e "${YELLOW}🔑 Required environment variables:${NC}"
echo "- WORDPRESS_URL"
echo "- WORDPRESS_GRAPHQL_URL"
echo "- WORDPRESS_AUTH_TOKEN"
echo "- LINEAR_API_URL"
echo "- LINEAR_API_KEY"
echo "- All NEXT_PUBLIC_* variables from .env.example"
