#!/bin/bash

# Sanity Integration Test Suite
# Tests the connection between Next.js and Sanity CMS

set -e

echo "🧪 Sanity Integration Test Suite"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check environment variables
echo "1️⃣  Checking environment variables..."
if [ -z "$NEXT_PUBLIC_SANITY_PROJECT_ID" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_SANITY_PROJECT_ID not set${NC}"
    exit 1
fi
if [ -z "$NEXT_PUBLIC_SANITY_DATASET" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_SANITY_DATASET not set${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Environment variables OK${NC}"
echo ""

# Test Sanity API connection
echo "2️⃣  Testing Sanity API connection..."
SANITY_API_URL="https://${NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${NEXT_PUBLIC_SANITY_DATASET}?query=*%5B_type%20%3D%3D%20%22staff%22%5D%5B0%5D"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SANITY_API_URL")
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Sanity API is reachable${NC}"
else
    echo -e "${RED}❌ Sanity API returned HTTP $HTTP_CODE${NC}"
    exit 1
fi
echo ""

# Test staff query
echo "3️⃣  Testing staff query..."
STAFF_COUNT=$(curl -s "$SANITY_API_URL" | grep -o '"_id"' | wc -l | tr -d ' ')
if [ "$STAFF_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Found $STAFF_COUNT staff member(s)${NC}"
else
    echo -e "${YELLOW}⚠️  No staff members found (migration not run yet?)${NC}"
fi
echo ""

# Test global settings query
echo "4️⃣  Testing global settings query..."
SETTINGS_URL="https://${NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${NEXT_PUBLIC_SANITY_DATASET}?query=*%5B_type%20%3D%3D%20%22globalSettings%22%5D%5B0%5D"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SETTINGS_URL")
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Global settings query OK${NC}"
else
    echo -e "${YELLOW}⚠️  Global settings not configured yet${NC}"
fi
echo ""

# Test Sanity Studio (if deployed)
echo "5️⃣  Testing Sanity Studio..."
STUDIO_URL="https://sothebys-cms.sanity.studio"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$STUDIO_URL")
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Sanity Studio is live at $STUDIO_URL${NC}"
else
    echo -e "${YELLOW}⚠️  Sanity Studio not deployed yet (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test image CDN
echo "6️⃣  Testing Sanity image CDN..."
CDN_URL="https://cdn.sanity.io/images/${NEXT_PUBLIC_SANITY_PROJECT_ID}/${NEXT_PUBLIC_SANITY_DATASET}/test.jpg"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$CDN_URL")
if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 404 ]; then
    echo -e "${GREEN}✅ Sanity CDN is reachable${NC}"
else
    echo -e "${RED}❌ Sanity CDN returned HTTP $HTTP_CODE${NC}"
    exit 1
fi
echo ""

# Summary
echo "================================"
echo "📊 Test Summary"
echo "================================"
echo -e "${GREEN}✅ Sanity integration is working!${NC}"
echo ""
echo "Next steps:"
echo "1. Run staff migration: npx tsx scripts/migrate-staff-to-sanity.ts"
echo "2. Configure global settings in Sanity Studio"
echo "3. Deploy Sanity Studio: cd apps/studio && npm run deploy"
echo "4. Update Next.js components to use Sanity data"
echo ""

