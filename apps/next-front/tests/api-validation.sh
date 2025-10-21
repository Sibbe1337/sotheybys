#!/bin/bash
# API Validation Test
# Tests API endpoints for required fields and data types
# Usage: BASE=http://localhost:3000 ./tests/api-validation.sh

set -e

BASE="${BASE:-http://localhost:3000}"
SLUG="${TEST_SLUG:-pengerkatu-25}"

echo "🧪 Testing API endpoints for property: $SLUG"
echo "Base URL: $BASE"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

# Test function
test_api() {
    local lang=$1
    echo "📋 Testing language: $lang"
    
    # Fetch API response
    RESPONSE=$(curl -s "${BASE}/api/property/${SLUG}?lang=${lang}")
    
    # Check if response is valid JSON
    if ! echo "$RESPONSE" | jq empty 2>/dev/null; then
        echo -e "${RED}✗ Invalid JSON response${NC}"
        FAILED=$((FAILED + 1))
        return
    fi
    
    # Extract values
    STREET=$(echo "$RESPONSE" | jq -r '.streetAddress // empty')
    CITY=$(echo "$RESPONSE" | jq -r '.city // empty')
    DESCRIPTION=$(echo "$RESPONSE" | jq -r '.description // empty')
    PRICE=$(echo "$RESPONSE" | jq -r '.price // empty')
    DEBT_PART=$(echo "$RESPONSE" | jq -r '.debtPart // empty')
    DEBT_FREE=$(echo "$RESPONSE" | jq -r '.debtFreePrice // empty')
    
    # Test 1: streetAddress must be non-empty
    if [ -z "$STREET" ]; then
        echo -e "${RED}✗ streetAddress is empty${NC}"
        FAILED=$((FAILED + 1))
    else
        echo -e "${GREEN}✓ streetAddress: $STREET${NC}"
    fi
    
    # Test 2: city must be non-empty
    if [ -z "$CITY" ]; then
        echo -e "${RED}✗ city is empty${NC}"
        FAILED=$((FAILED + 1))
    else
        echo -e "${GREEN}✓ city: $CITY${NC}"
    fi
    
    # Test 3: description may be empty (will check UI hiding in Playwright)
    if [ -z "$DESCRIPTION" ]; then
        echo -e "${YELLOW}⚠ description is empty (UI should hide this section)${NC}"
    else
        DESC_LENGTH=${#DESCRIPTION}
        echo -e "${GREEN}✓ description length: $DESC_LENGTH chars${NC}"
    fi
    
    # Test 4: price must be a number when present
    if [ -n "$PRICE" ] && [ "$PRICE" != "null" ]; then
        if echo "$PRICE" | grep -qE '^[0-9]+(\.[0-9]+)?$'; then
            echo -e "${GREEN}✓ price is numeric: $PRICE${NC}"
        else
            echo -e "${RED}✗ price is not numeric: $PRICE${NC}"
            FAILED=$((FAILED + 1))
        fi
    fi
    
    # Test 5: debtPart must be a number when present
    if [ -n "$DEBT_PART" ] && [ "$DEBT_PART" != "null" ]; then
        if echo "$DEBT_PART" | grep -qE '^[0-9]+(\.[0-9]+)?$'; then
            echo -e "${GREEN}✓ debtPart is numeric: $DEBT_PART${NC}"
        else
            echo -e "${RED}✗ debtPart is not numeric: $DEBT_PART${NC}"
            FAILED=$((FAILED + 1))
        fi
    fi
    
    # Test 6: debtFreePrice must be a number when present
    if [ -n "$DEBT_FREE" ] && [ "$DEBT_FREE" != "null" ]; then
        if echo "$DEBT_FREE" | grep -qE '^[0-9]+(\.[0-9]+)?$'; then
            echo -e "${GREEN}✓ debtFreePrice is numeric: $DEBT_FREE${NC}"
        else
            echo -e "${RED}✗ debtFreePrice is not numeric: $DEBT_FREE${NC}"
            FAILED=$((FAILED + 1))
        fi
    fi
    
    echo ""
}

# Test all languages
test_api "fi"
test_api "sv"
test_api "en"

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All API tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ $FAILED test(s) failed${NC}"
    exit 1
fi

