#!/bin/bash
# Fix All Property Slugs - Find and fix all 404ing properties

BASE_URL="https://next-front-puce.vercel.app"

echo "🔍 Checking All Properties for 404 Issues"
echo "=========================================="
echo ""

# Fetch homepage to get all property slugs
echo "📥 Fetching homepage properties..."
PROPERTIES=$(curl -s "$BASE_URL/api/homepage" | jq -r '.listings[]? | select(.slug != null) | .slug' | sort -u)

if [ -z "$PROPERTIES" ]; then
  echo "❌ No properties found in homepage API"
  exit 1
fi

TOTAL=$(echo "$PROPERTIES" | wc -l | tr -d ' ')
echo "✓ Found $TOTAL properties"
echo ""

# Test each property
WORKING=0
BROKEN=0
BROKEN_LIST=()

echo "🧪 Testing each property..."
echo ""

while IFS= read -r slug; do
  if [ -z "$slug" ]; then
    continue
  fi
  
  # Test API
  RESULT=$(curl -s "$BASE_URL/api/property/$slug?lang=fi" | jq -r '.success // false')
  
  if [ "$RESULT" = "true" ]; then
    echo "  ✅ $slug"
    ((WORKING++))
  else
    echo "  ❌ $slug"
    ((BROKEN++))
    BROKEN_LIST+=("$slug")
  fi
done <<< "$PROPERTIES"

echo ""
echo "=========================================="
echo "📊 SUMMARY"
echo "=========================================="
echo "Total Properties: $TOTAL"
echo "Working: $WORKING ✅"
echo "Broken: $BROKEN ❌"
echo ""

if [ $BROKEN -gt 0 ]; then
  echo "🔧 BROKEN PROPERTIES (need aliases or cache refresh):"
  echo ""
  for slug in "${BROKEN_LIST[@]}"; do
    echo "  • $slug"
  done
  echo ""
  echo "📝 Next Steps:"
  echo ""
  echo "1. For each broken property, check what slug the homepage is using:"
  echo "   curl \"$BASE_URL/api/homepage\" | jq '.listings[] | select(.slug == \"$slug\")'"
  echo ""
  echo "2. Add aliases to src/config/property-aliases.json"
  echo ""
  echo "3. Or check if property exists in Linear API but not in cache"
else
  echo "🎉 All properties working!"
fi

