#!/bin/bash

# ====================================================================
# GOOGLE MAPS API SETUP SCRIPT
# ====================================================================
# 
# This script helps you:
# 1. Check if you have Google Cloud CLI installed
# 2. Create or retrieve a Google Maps API key
# 3. Add it to your .env.local file
#
# Requirements:
# - Google Cloud CLI (gcloud) installed
# - Active Google Cloud project
# - Billing enabled on the project
#
# Usage:
#   ./scripts/setup-google-maps.sh
# ====================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "========================================="
echo "   GOOGLE MAPS API SETUP"
echo "========================================="
echo -e "${NC}"

# Step 1: Check if gcloud is installed
echo -e "${YELLOW}[1/6] Checking Google Cloud CLI...${NC}"
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI not found!${NC}"
    echo ""
    echo "Please install it first:"
    echo "  macOS:   brew install --cask google-cloud-sdk"
    echo "  Linux:   https://cloud.google.com/sdk/docs/install"
    echo "  Windows: https://cloud.google.com/sdk/docs/install"
    echo ""
    exit 1
fi
echo -e "${GREEN}✅ Google Cloud CLI found${NC}"

# Step 2: Check if user is logged in
echo -e "${YELLOW}[2/6] Checking authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Google Cloud${NC}"
    echo "Running: gcloud auth login"
    gcloud auth login
fi
ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1)
echo -e "${GREEN}✅ Logged in as: ${ACCOUNT}${NC}"

# Step 3: Get or set project
echo -e "${YELLOW}[3/6] Checking Google Cloud project...${NC}"
PROJECT_ID=$(gcloud config get-value project 2>/dev/null || echo "")

if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠️  No project set${NC}"
    echo "Available projects:"
    gcloud projects list --format="table(projectId,name,projectNumber)"
    echo ""
    read -p "Enter project ID: " PROJECT_ID
    gcloud config set project "$PROJECT_ID"
fi

echo -e "${GREEN}✅ Using project: ${PROJECT_ID}${NC}"

# Step 4: Enable required APIs
echo -e "${YELLOW}[4/6] Enabling required APIs...${NC}"

echo "  • Maps JavaScript API..."
gcloud services enable maps-backend.googleapis.com --project="$PROJECT_ID" 2>/dev/null || true

echo "  • Geocoding API..."
gcloud services enable geocoding-backend.googleapis.com --project="$PROJECT_ID" 2>/dev/null || true

echo "  • Places API..."
gcloud services enable places-backend.googleapis.com --project="$PROJECT_ID" 2>/dev/null || true

echo -e "${GREEN}✅ APIs enabled${NC}"

# Step 5: Get or create API key
echo -e "${YELLOW}[5/6] Getting API key...${NC}"

# Check if API key already exists
API_KEY_NAME="sothebys-maps-key"
EXISTING_KEY=""

# Try to list API keys (requires additional permissions)
echo "Checking for existing API keys..."

# Try to get key using gcloud (may require additional setup)
# Note: gcloud doesn't have a direct command for API keys, so we'll create one if needed
if gcloud services api-keys list --project="$PROJECT_ID" &> /dev/null; then
    EXISTING_KEY=$(gcloud services api-keys list --project="$PROJECT_ID" --filter="displayName:$API_KEY_NAME" --format="value(name)" 2>/dev/null | head -n 1)
fi

if [ -n "$EXISTING_KEY" ]; then
    echo -e "${GREEN}✅ Found existing API key: ${API_KEY_NAME}${NC}"
    API_KEY=$(gcloud services api-keys get-key-string "$EXISTING_KEY" --project="$PROJECT_ID" 2>/dev/null || echo "")
    
    if [ -z "$API_KEY" ]; then
        echo -e "${RED}❌ Could not retrieve key string${NC}"
        echo ""
        echo "Please get your API key manually from:"
        echo "https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  No existing key found, creating new one...${NC}"
    
    # Create new API key
    if gcloud services api-keys create "$API_KEY_NAME" --project="$PROJECT_ID" &> /dev/null; then
        echo -e "${GREEN}✅ Created new API key: ${API_KEY_NAME}${NC}"
        
        # Get the key
        KEY_ID=$(gcloud services api-keys list --project="$PROJECT_ID" --filter="displayName:$API_KEY_NAME" --format="value(name)" 2>/dev/null | head -n 1)
        API_KEY=$(gcloud services api-keys get-key-string "$KEY_ID" --project="$PROJECT_ID" 2>/dev/null || echo "")
    else
        echo -e "${RED}❌ Could not create API key via CLI${NC}"
        echo ""
        echo "Please create an API key manually:"
        echo "1. Go to: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
        echo "2. Click 'CREATE CREDENTIALS' → 'API key'"
        echo "3. Copy the key and paste it below"
        echo ""
        read -p "Enter your API key: " API_KEY
    fi
fi

if [ -z "$API_KEY" ]; then
    echo -e "${RED}❌ No API key available${NC}"
    exit 1
fi

echo -e "${GREEN}✅ API Key obtained${NC}"

# Step 6: Add to .env.local
echo -e "${YELLOW}[6/6] Updating .env.local...${NC}"

ENV_FILE="apps/next-front/.env.local"

# Create .env.local if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
fi

# Check if key already exists in file
if grep -q "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" "$ENV_FILE"; then
    # Update existing key
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=.*/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$API_KEY/" "$ENV_FILE"
    else
        # Linux
        sed -i "s/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=.*/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$API_KEY/" "$ENV_FILE"
    fi
    echo -e "${GREEN}✅ Updated API key in $ENV_FILE${NC}"
else
    # Add new key
    echo "" >> "$ENV_FILE"
    echo "# Google Maps API (auto-generated by setup-google-maps.sh)" >> "$ENV_FILE"
    echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$API_KEY" >> "$ENV_FILE"
    echo -e "${GREEN}✅ Added API key to $ENV_FILE${NC}"
fi

# Final summary
echo ""
echo -e "${GREEN}"
echo "========================================="
echo "   ✅ SETUP COMPLETE!"
echo "========================================="
echo -e "${NC}"
echo ""
echo "Your Google Maps API key has been configured!"
echo ""
echo "Project:  $PROJECT_ID"
echo "Key name: $API_KEY_NAME"
echo "Key:      ${API_KEY:0:20}...${API_KEY: -4}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT SECURITY STEPS:${NC}"
echo ""
echo "1. Restrict your API key to prevent unauthorized use:"
echo "   https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo ""
echo "2. Add application restrictions:"
echo "   • HTTP referrers: https://your-domain.com/*"
echo "   • Or IP addresses for your Vercel deployment"
echo ""
echo "3. Add API restrictions:"
echo "   • Maps JavaScript API"
echo "   • Geocoding API"
echo "   • Places API"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Restart your Next.js dev server"
echo "  2. Test the map functionality"
echo "  3. Deploy to Vercel with the new key"
echo ""
echo "Done! 🎉"

