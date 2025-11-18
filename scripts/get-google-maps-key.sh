#!/bin/bash

# ====================================================================
# GET GOOGLE MAPS API KEY (Quick version)
# ====================================================================
# 
# Quick script to just retrieve an existing API key
# For full setup, use setup-google-maps.sh
#
# Usage:
#   ./scripts/get-google-maps-key.sh [key-name]
# ====================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get key name from argument or use default
KEY_NAME="${1:-sothebys-maps-key}"

# Check gcloud
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI not found${NC}"
    exit 1
fi

# Get project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No Google Cloud project set${NC}"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "🔍 Looking for API key: $KEY_NAME in project: $PROJECT_ID"

# Try to find the key
KEY_ID=$(gcloud services api-keys list --project="$PROJECT_ID" --filter="displayName:$KEY_NAME" --format="value(name)" 2>/dev/null | head -n 1)

if [ -z "$KEY_ID" ]; then
    echo -e "${YELLOW}⚠️  Key not found. Available keys:${NC}"
    gcloud services api-keys list --project="$PROJECT_ID" 2>/dev/null || echo "  (none or permission denied)"
    echo ""
    echo "To create a new key, run: ./scripts/setup-google-maps.sh"
    exit 1
fi

# Get the actual key string
API_KEY=$(gcloud services api-keys get-key-string "$KEY_ID" --project="$PROJECT_ID" 2>/dev/null)

if [ -z "$API_KEY" ]; then
    echo -e "${RED}❌ Could not retrieve key string${NC}"
    echo "Get it manually from: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}✅ Found API key!${NC}"
echo ""
echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$API_KEY"
echo ""
echo "Copy the line above to your .env.local file"

