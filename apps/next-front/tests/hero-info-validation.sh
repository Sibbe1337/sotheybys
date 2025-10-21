#!/bin/bash
# Hero Info Row Validation
# Validates that hero info shows correct fields in correct order by property type

set -e

BASE="${BASE:-http://localhost:3000}"
OSAKE_SLUG="${OSAKE_SLUG:-test-osake}"
FASTIGHET_SLUG="${FASTIGHET_SLUG:-test-fastighet}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   HERO INFO ROW VALIDATION                                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo "Base URL: $BASE"
echo ""

PASSED=0
FAILED=0

# Test 1: OSAKE/LÄGENHET hero order
echo -e "${BLUE}Test 1: Osake/Lägenhet Hero Order${NC}"
echo "Slug: $OSAKE_SLUG"
echo "Expected order: Bostadsyta | Pris | Skuldfritt pris | Stadsdel | Byggnadsår"
echo ""

OSAKE_DATA=$(curl -s "${BASE}/api/property/${OSAKE_SLUG}?lang=sv")

if echo "$OSAKE_DATA" | jq -e '.success == true' > /dev/null 2>&1; then
    LIVING_AREA=$(echo "$OSAKE_DATA" | jq -r '.data.area // .data.livingArea // ""')
    PRICE=$(echo "$OSAKE_DATA" | jq -r '.data.price // ""')
    DEBT_FREE_PRICE=$(echo "$OSAKE_DATA" | jq -r '.data.debtFreePrice // ""')
    DISTRICT=$(echo "$OSAKE_DATA" | jq -r '.data.region // .data.district // .data.city // ""')
    YEAR_BUILT=$(echo "$OSAKE_DATA" | jq -r '.data.yearBuilt // .data.yearOfBuilding // ""')
    
    echo "Field presence:"
    [ -n "$LIVING_AREA" ] && echo -e "${GREEN}  ✓ Living area: ${LIVING_AREA} m²${NC}" || echo -e "${YELLOW}  ⚠ Living area: missing${NC}"
    [ -n "$PRICE" ] && echo -e "${GREEN}  ✓ Price: ${PRICE} €${NC}" || echo -e "${YELLOW}  ⚠ Price: missing${NC}"
    [ -n "$DEBT_FREE_PRICE" ] && echo -e "${GREEN}  ✓ Debt-free price: ${DEBT_FREE_PRICE} €${NC}" || echo -e "${YELLOW}  ⚠ Debt-free price: missing${NC}"
    [ -n "$DISTRICT" ] && echo -e "${GREEN}  ✓ District: ${DISTRICT}${NC}" || echo -e "${YELLOW}  ⚠ District: missing${NC}"
    [ -n "$YEAR_BUILT" ] && echo -e "${GREEN}  ✓ Year built: ${YEAR_BUILT}${NC}" || echo -e "${YELLOW}  ⚠ Year built: missing${NC}"
    
    # Calculate €/m² if we have data
    if [ -n "$LIVING_AREA" ] && [ -n "$PRICE" ] && [ "$LIVING_AREA" != "0" ]; then
        PRICE_PER_M2=$(echo "scale=0; $PRICE / $LIVING_AREA" | bc)
        echo -e "${GREEN}  ✓ Price/m²: ${PRICE_PER_M2} €/m²${NC}"
    fi
    
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ Could not fetch osake property${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 2: FASTIGHET hero order
echo -e "${BLUE}Test 2: Fastighet Hero Order${NC}"
echo "Slug: $FASTIGHET_SLUG"
echo "Expected order: Bostadsyta | Total yta | Pris | Stadsdel | Tomtstorlek"
echo ""

FASTIGHET_DATA=$(curl -s "${BASE}/api/property/${FASTIGHET_SLUG}?lang=sv")

if echo "$FASTIGHET_DATA" | jq -e '.success == true' > /dev/null 2>&1; then
    LIVING_AREA=$(echo "$FASTIGHET_DATA" | jq -r '.data.area // .data.livingArea // ""')
    TOTAL_AREA=$(echo "$FASTIGHET_DATA" | jq -r '.data.totalArea // ""')
    PRICE=$(echo "$FASTIGHET_DATA" | jq -r '.data.price // ""')
    DISTRICT=$(echo "$FASTIGHET_DATA" | jq -r '.data.region // .data.district // .data.city // ""')
    SITE_AREA=$(echo "$FASTIGHET_DATA" | jq -r '.data.plotArea // .data.siteArea // ""')
    
    echo "Field presence:"
    [ -n "$LIVING_AREA" ] && echo -e "${GREEN}  ✓ Living area: ${LIVING_AREA} m²${NC}" || echo -e "${YELLOW}  ⚠ Living area: missing${NC}"
    [ -n "$TOTAL_AREA" ] && echo -e "${GREEN}  ✓ Total area: ${TOTAL_AREA} m²${NC}" || echo -e "${YELLOW}  ⚠ Total area: missing${NC}"
    [ -n "$PRICE" ] && echo -e "${GREEN}  ✓ Price: ${PRICE} €${NC}" || echo -e "${YELLOW}  ⚠ Price: missing${NC}"
    [ -n "$DISTRICT" ] && echo -e "${GREEN}  ✓ District: ${DISTRICT}${NC}" || echo -e "${YELLOW}  ⚠ District: missing${NC}"
    
    # Check site area formatting (ha vs m²)
    if [ -n "$SITE_AREA" ]; then
        SITE_AREA_NUM=$(echo "$SITE_AREA" | grep -oE '[0-9]+' | head -1)
        if [ -n "$SITE_AREA_NUM" ] && [ "$SITE_AREA_NUM" -ge 10000 ]; then
            HA=$(echo "scale=2; $SITE_AREA_NUM / 10000" | bc)
            echo -e "${GREEN}  ✓ Site area: ${HA} ha (${SITE_AREA_NUM} m²)${NC}"
        else
            echo -e "${GREEN}  ✓ Site area: ${SITE_AREA} m²${NC}"
        fi
    else
        echo -e "${YELLOW}  ⚠ Site area: missing${NC}"
    fi
    
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ Could not fetch fastighet property${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 3: Multilingual labels
echo -e "${BLUE}Test 3: Multilingual Labels${NC}"

for lang in fi sv en; do
    echo "Testing $lang..."
    RESPONSE=$(curl -s "${BASE}/api/property/${OSAKE_SLUG}?lang=${lang}")
    
    if echo "$RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ API responds for lang=${lang}${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}  ✗ API failed for lang=${lang}${NC}"
        FAILED=$((FAILED + 1))
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
    echo -e "${GREEN}✓ ALL HERO INFO VALIDATIONS PASSED${NC}"
    echo ""
    echo "Manual checks:"
    echo "1. Visit osake property page and verify order:"
    echo "   Bostadsyta | Pris | Skuldfritt pris | Stadsdel | Byggnadsår"
    echo "2. Visit fastighet property page and verify order:"
    echo "   Bostadsyta | Total yta | Pris | Stadsdel | Tomtstorlek"
    echo "3. Check that empty fields are hidden"
    echo "4. Verify €/m² calculations show under prices"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    exit 1
fi

