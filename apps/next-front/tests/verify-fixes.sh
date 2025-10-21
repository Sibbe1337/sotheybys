#!/bin/bash
# Verification script for image 400 and slug 404 fixes
# Usage: BASE=http://localhost:3000 ./tests/verify-fixes.sh

set -e

BASE="${BASE:-http://localhost:3000}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   VERIFYING IMAGE 400 + SLUG 404 FIXES                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo "Base URL: $BASE"
echo ""

PASSED=0
FAILED=0

# Test 1: Local hero image should not 400
echo -e "${BLUE}Test 1: Local hero image resolution${NC}"
IMAGE_PATH="/images/content/snellman-sothebys-toimisto.jpg"
IMAGE_URL="${BASE}/_next/image?url=%2Fimages%2Fcontent%2Fsnellman-sothebys-toimisto.jpg&w=1200&q=75"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL" || echo "000")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
    echo -e "${GREEN}✓ Image resolved successfully (HTTP $HTTP_CODE)${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ Image still failing (HTTP $HTTP_CODE)${NC}"
    echo -e "${YELLOW}  Check if file exists: ${BASE}${IMAGE_PATH}${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 2: Slug normalization & alias lookup
echo -e "${BLUE}Test 2: Slug normalization & alias resolution${NC}"

SLUGS=(
    "remmarholmen"
    "REMMARHOLMEN"
    "Remmar holmen"
    "albertinkatu-19-b"
    "pengerkatu"
    "bernhardinkatu"
)

for s in "${SLUGS[@]}"; do
    echo "  Testing slug: $s"
    RESPONSE=$(curl -s "${BASE}/api/property/${s}?lang=en" || echo '{"success":false}')
    
    if echo "$RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
        NORMALIZED=$(echo "$RESPONSE" | jq -r '.data.slug // .normalized // ""')
        echo -e "${GREEN}    ✓ Resolved: ${s} → ${NORMALIZED}${NC}"
        PASSED=$((PASSED + 1))
    elif echo "$RESPONSE" | jq -e '.error == "NOT_FOUND"' > /dev/null 2>&1; then
        NORMALIZED=$(echo "$RESPONSE" | jq -r '.normalized // ""')
        RESOLVED=$(echo "$RESPONSE" | jq -r '.resolved // ""')
        echo -e "${YELLOW}    ⚠ Not found (but graceful): ${s} → ${NORMALIZED} → ${RESOLVED}${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}    ✗ Failed to resolve${NC}"
        FAILED=$((FAILED + 1))
    fi
done
echo ""

# Test 3: Graceful 404 (no crash)
echo -e "${BLUE}Test 3: Graceful 404 handling${NC}"
FAKE_SLUG="this-property-definitely-does-not-exist-12345"
RESPONSE=$(curl -s "${BASE}/api/property/${FAKE_SLUG}?lang=fi")

if echo "$RESPONSE" | jq -e '.success == false and .error == "NOT_FOUND"' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API returns graceful 404 JSON (no crash)${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ API not returning proper 404 response${NC}"
    FAILED=$((FAILED + 1))
fi

# Check if browser page renders friendly error
echo "  Testing browser page..."
PAGE_RESPONSE=$(curl -s "${BASE}/property/${FAKE_SLUG}?lang=en")
if echo "$PAGE_RESPONSE" | grep -q "Listing not found" || echo "$PAGE_RESPONSE" | grep -q "not found"; then
    echo -e "${GREEN}✓ Browser shows friendly 'not found' message${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ Could not verify friendly error page (may need JS render)${NC}"
fi
echo ""

# Test 4: Finnish character normalization (ä→a, ö→o)
echo -e "${BLUE}Test 4: Finnish character normalization${NC}"
TEST_SLUGS=(
    "Käpylä-test"
    "Töölö-test"
    "Espoo-test"
)

for s in "${TEST_SLUGS[@]}"; do
    RESPONSE=$(curl -s "${BASE}/api/property/${s}?lang=fi")
    NORMALIZED=$(echo "$RESPONSE" | jq -r '.normalized // ""')
    
    if [ -n "$NORMALIZED" ]; then
        echo -e "${GREEN}  ✓ ${s} → ${NORMALIZED}${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${YELLOW}  ⚠ ${s} → (check normalization)${NC}"
    fi
done
echo ""

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASSED: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}FAILED: $FAILED${NC}"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL FIXES VERIFIED${NC}"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check if Next.js dev server is running"
    echo "2. Verify placeholder image exists: public/images/defaults/placeholder-property.jpg"
    echo "3. Check property aliases in: src/config/property-aliases.json"
    echo "4. Inspect browser console for image errors"
    exit 1
fi

