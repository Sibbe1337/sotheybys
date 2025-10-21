#!/bin/bash

# Quick verification script for all 6 properties after deployment
# Run this after Vercel finishes deploying

echo "🔍 Verifying all 6 properties..."
echo ""

BASE="https://next-front-lbsox6pn2-kodaren1338-gmailcoms-projects.vercel.app"

# All 6 properties from the listings
SLUGS=(
  "bernhardinkatu-1"
  "heikkilantie-1"
  "kauppiaankatu-8-10"
  "helsingintie-99"
  "mailatie-3"
  "pengerkatu-25"
)

SUCCESS=0
FAILED=0

for slug in "${SLUGS[@]}"; do
  echo "Testing: $slug"
  
  RESPONSE=$(curl -s "$BASE/api/property/$slug?lang=fi")
  STATUS=$(echo "$RESPONSE" | jq -r '.success // false')
  ADDRESS=$(echo "$RESPONSE" | jq -r '.data.streetAddress // .data.address // "N/A"')
  ERROR=$(echo "$RESPONSE" | jq -r '.error // "none"')
  FALLBACK=$(echo "$RESPONSE" | jq -r '.fallback // false')
  
  if [ "$STATUS" = "true" ]; then
    echo "  ✅ SUCCESS - $ADDRESS"
    if [ "$FALLBACK" = "true" ]; then
      echo "     ℹ️  Using fallback data (detail endpoint unavailable)"
    fi
    ((SUCCESS++))
  else
    echo "  ❌ FAILED - Error: $ERROR"
    ((FAILED++))
  fi
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Results: $SUCCESS/$((SUCCESS + FAILED)) working"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 All properties working!"
  exit 0
else
  echo "⚠️  $FAILED properties still failing"
  exit 1
fi

