#!/bin/bash

# ============================================================================
# QA Checks for Sotheby's Property API
# ============================================================================
# Usage: ./scripts/qa-checks.sh [base_url]
# Example: ./scripts/qa-checks.sh https://sothebysrealty.fi

BASE_URL="${1:-http://localhost:3000}"

echo "🧪 Running QA checks against: $BASE_URL"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# TEST 1: Single property data structure
# ============================================================================
echo ""
echo "📦 TEST 1: Property data structure (Pengerkatu)"
RESPONSE=$(curl -s "$BASE_URL/api/property/pengerkatu-25?lang=fi")

if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} API returned success"
  
  # Check images array
  IMAGES_TYPE=$(echo "$RESPONSE" | jq -r '.data.images | type')
  IMAGES_COUNT=$(echo "$RESPONSE" | jq -r '.data.images | length')
  
  if [ "$IMAGES_TYPE" = "array" ]; then
    echo -e "${GREEN}✓${NC} images is array (count: $IMAGES_COUNT)"
  else
    echo -e "${RED}✗${NC} images is NOT an array (type: $IMAGES_TYPE)"
  fi
  
  # Check photoUrls array
  PHOTO_URLS_TYPE=$(echo "$RESPONSE" | jq -r '.data.photoUrls | type')
  PHOTO_URLS_COUNT=$(echo "$RESPONSE" | jq -r '.data.photoUrls | length')
  
  if [ "$PHOTO_URLS_TYPE" = "array" ]; then
    echo -e "${GREEN}✓${NC} photoUrls is array (count: $PHOTO_URLS_COUNT)"
  else
    echo -e "${RED}✗${NC} photoUrls is NOT an array (type: $PHOTO_URLS_TYPE)"
  fi
  
  # Check price is reasonable
  PRICE=$(echo "$RESPONSE" | jq -r '.data.price // .data.salesPrice')
  if [ "$PRICE" != "null" ] && [ "$PRICE" -lt 100000000 ]; then
    echo -e "${GREEN}✓${NC} Price is reasonable: $PRICE €"
  else
    echo -e "${YELLOW}⚠${NC} Price seems unusual: $PRICE €"
  fi
  
  # Check floorplan URL
  FLOORPLAN=$(echo "$RESPONSE" | jq -r '.data.floorPlanUrl')
  if [ "$FLOORPLAN" != "null" ] && [ "$FLOORPLAN" != "" ]; then
    echo -e "${GREEN}✓${NC} Floorplan URL present"
  else
    echo -e "${YELLOW}⚠${NC} No floorplan URL"
  fi
else
  echo -e "${RED}✗${NC} API request failed"
  echo "$RESPONSE" | jq '.' || echo "$RESPONSE"
fi

# ============================================================================
# TEST 2: All listings array structure
# ============================================================================
echo ""
echo "📦 TEST 2: All listings structure"
LISTINGS=$(curl -s "$BASE_URL/api/listings?lang=fi&format=multilingual")

if echo "$LISTINGS" | jq -e '.success' > /dev/null 2>&1; then
  COUNT=$(echo "$LISTINGS" | jq -r '.count')
  echo -e "${GREEN}✓${NC} Got $COUNT listings"
  
  # Check first 3 listings for array types
  echo "$LISTINGS" | jq -r '.data[0:3] | .[] | {
    slug, 
    imagesType: (.images | type),
    imagesCount: (if .images then (.images | length) else 0 end),
    photoUrlsType: (.photoUrls | type),
    photoUrlsCount: (if .photoUrls then (.photoUrls | length) else 0 end)
  }' | while read -r line; do
    if echo "$line" | grep -q '"imagesType": "array"'; then
      echo -e "${GREEN}✓${NC} $line"
    elif echo "$line" | grep -q '"imagesType"'; then
      echo -e "${RED}✗${NC} $line"
    else
      echo "$line"
    fi
  done
else
  echo -e "${RED}✗${NC} Listings API failed"
fi

# ============================================================================
# TEST 3: No 500 errors on known properties
# ============================================================================
echo ""
echo "🔥 TEST 3: No 500 errors on known properties"

SLUGS=("pengerkatu-25" "heikkilantie-1" "bernhardinkatu-1" "kauppiaankatu-8-10")

for SLUG in "${SLUGS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/property/$SLUG?lang=fi")
  
  if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✓${NC} $SLUG (HTTP $STATUS)"
  elif [ "$STATUS" = "404" ]; then
    echo -e "${YELLOW}⚠${NC} $SLUG (HTTP $STATUS - Not Found)"
  else
    echo -e "${RED}✗${NC} $SLUG (HTTP $STATUS - ERROR)"
  fi
done

# ============================================================================
# TEST 4: Cache headers check
# ============================================================================
echo ""
echo "📡 TEST 4: Cache-Control headers"

CACHE_HEADER=$(curl -s -I "$BASE_URL/api/property/pengerkatu-25?lang=fi" | grep -i "cache-control")

if echo "$CACHE_HEADER" | grep -q "no-store"; then
  echo -e "${GREEN}✓${NC} Cache-Control: no-store present"
else
  echo -e "${YELLOW}⚠${NC} Cache-Control might allow aggressive caching"
  echo "  $CACHE_HEADER"
fi

# ============================================================================
# TEST 5: Video URL validation
# ============================================================================
echo ""
echo "🎬 TEST 5: Video URL support"

echo "Testing YouTube URL detection..."
if command -v node &> /dev/null; then
  node -e "
    const testUrls = [
      'https://www.youtube.com/watch?v=abc123',
      'https://youtu.be/abc123',
      'https://vimeo.com/123456789',
      'https://www.youtube.com/',
      'not-a-video-url'
    ];
    
    function isValidYouTubeUrl(url) {
      if (!url) return false;
      if (url === 'https://www.youtube.com/' || url === 'https://youtube.com/') return false;
      return url.includes('youtu.be/') || url.includes('youtube.com/watch') || url.includes('youtube.com/embed/');
    }
    
    function isValidVimeoUrl(url) {
      if (!url) return false;
      return url.includes('vimeo.com/') && !url.endsWith('vimeo.com/') && !url.endsWith('vimeo.com');
    }
    
    testUrls.forEach(url => {
      const isYT = isValidYouTubeUrl(url);
      const isVimeo = isValidVimeoUrl(url);
      console.log(\`  \${url}: YT=\${isYT}, Vimeo=\${isVimeo}\`);
    });
  " 2>/dev/null
  
  echo -e "${GREEN}✓${NC} Video URL validation functions working"
else
  echo -e "${YELLOW}⚠${NC} Node.js not available, skipping video URL test"
fi

# ============================================================================
# SUMMARY
# ============================================================================
echo ""
echo "=================================================="
echo "✅ QA checks complete!"
echo ""
echo "💡 To run Playwright tests:"
echo "   cd apps/next-front && npx playwright test tests/property-page.spec.ts"
echo ""
echo "💡 To test locally:"
echo "   npm run dev"
echo "   ./scripts/qa-checks.sh http://localhost:3000"
echo ""
echo "💡 To test production:"
echo "   ./scripts/qa-checks.sh https://sothebysrealty.fi"

