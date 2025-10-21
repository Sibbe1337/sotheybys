#!/bin/bash
# Rental Property Validation (Lägenhet/Radhus/Hus Uthyres)
# Validates rental properties have all required fields
# Usage: BASE=http://localhost:3000 SLUG=test-rental ./tests/rental-validation.sh

set -e

BASE="${BASE:-http://localhost:3000}"
SLUG="${SLUG:-test-rental}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   RENTAL PROPERTY VALIDATION (STUB)                        ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo "Property: $SLUG"
echo "Base URL: $BASE"
echo ""

FAILED=0
WARNINGS=0

# Fetch API data
echo "📡 Fetching property data..."
RESPONSE=$(curl -s "${BASE}/api/property/${SLUG}?lang=fi")

# Validate JSON
if ! echo "$RESPONSE" | jq empty 2>/dev/null; then
    echo -e "${RED}✗ Invalid JSON response${NC}"
    exit 1
fi

# Check if this is a rental property
LISTING_TYPE=$(echo "$RESPONSE" | jq -r '.listingType // .saleType // ""')
IS_RENTAL=false

if [ "$LISTING_TYPE" = "rental" ] || [ "$LISTING_TYPE" = "RENTAL" ] || [ "$LISTING_TYPE" = "rent" ]; then
    IS_RENTAL=true
fi

if [ "$IS_RENTAL" = false ]; then
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║   NOT A RENTAL PROPERTY - TESTS SKIPPED                    ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Current listing type: $LISTING_TYPE"
    echo ""
    echo "TO ENABLE RENTAL TESTS:"
    echo "1. Add a rental property with listingType: 'rental'"
    echo "2. Run: SLUG=your-rental-slug ./tests/rental-validation.sh"
    echo ""
    echo "Required rental fields:"
    echo "  - streetAddress, city"
    echo "  - propertyType (apartment/house/row house)"
    echo "  - livingArea"
    echo "  - rooms (room count)"
    echo "  - monthlyRent"
    echo "  - includedInRent[] (what's included: water, heating, etc)"
    echo "  - extraCosts[] (separate costs)"
    echo "  - availabilityDate"
    echo "  - contractType (fixed-term/indefinite)"
    echo "  - landlordContact (name, phone, email)"
    exit 0
fi

echo -e "${GREEN}✓ Rental property detected${NC}"
echo ""

# Extract rental-specific fields
STREET=$(echo "$RESPONSE" | jq -r '.streetAddress // ""')
CITY=$(echo "$RESPONSE" | jq -r '.city // ""')
PROPERTY_TYPE=$(echo "$RESPONSE" | jq -r '.propertyType // ""')
LIVING_AREA=$(echo "$RESPONSE" | jq -r '.livingArea // ""')
ROOMS=$(echo "$RESPONSE" | jq -r '.rooms // .roomCount // ""')
MONTHLY_RENT=$(echo "$RESPONSE" | jq -r '.monthlyRent // .rent // ""')
INCLUDED_IN_RENT=$(echo "$RESPONSE" | jq -r '.includedInRent // [] | join(", ")')
EXTRA_COSTS=$(echo "$RESPONSE" | jq -r '.extraCosts // [] | join(", ")')
AVAILABILITY_DATE=$(echo "$RESPONSE" | jq -r '.availabilityDate // .availableFrom // ""')
CONTRACT_TYPE=$(echo "$RESPONSE" | jq -r '.contractType // .leaseType // ""')
LANDLORD_NAME=$(echo "$RESPONSE" | jq -r '.landlordContact.name // .landlord.name // ""')
LANDLORD_PHONE=$(echo "$RESPONSE" | jq -r '.landlordContact.phone // .landlord.phone // ""')
LANDLORD_EMAIL=$(echo "$RESPONSE" | jq -r '.landlordContact.email // .landlord.email // ""')

# Display rental information
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  RENTAL PROPERTY FIELDS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

printf "%-30s : %s\n" "Adress (streetAddress)" "$STREET"
printf "%-30s : %s\n" "Stad (city)" "$CITY"
printf "%-30s : %s\n" "Fastighetstyp (propertyType)" "$PROPERTY_TYPE"
printf "%-30s : %s m²\n" "Boyta (livingArea)" "$LIVING_AREA"
printf "%-30s : %s\n" "Rum (rooms)" "$ROOMS"
printf "%-30s : %s €/mån\n" "Månadshyra (monthlyRent)" "$MONTHLY_RENT"
printf "%-30s : %s\n" "Ingår i hyran (includedInRent)" "$INCLUDED_IN_RENT"
printf "%-30s : %s\n" "Extra kostnader (extraCosts)" "$EXTRA_COSTS"
printf "%-30s : %s\n" "Tillgänglig från (availabilityDate)" "$AVAILABILITY_DATE"
printf "%-30s : %s\n" "Kontraktstyp (contractType)" "$CONTRACT_TYPE"

echo ""
echo -e "${BLUE}────────── HYRESVÄRD KONTAKT ──────────${NC}"
printf "%-30s : %s\n" "Namn (landlord.name)" "$LANDLORD_NAME"
printf "%-30s : %s\n" "Telefon (landlord.phone)" "$LANDLORD_PHONE"
printf "%-30s : %s\n" "E-post (landlord.email)" "$LANDLORD_EMAIL"

# Validation checks
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  VALIDATION CHECKS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Check required fields
check_required() {
    local field_name=$1
    local field_value=$2
    
    if [ -z "$field_value" ] || [ "$field_value" = "null" ]; then
        echo -e "${RED}✗ REQUIRED RENTAL FIELD MISSING: $field_name${NC}"
        FAILED=$((FAILED + 1))
        return 1
    else
        echo -e "${GREEN}✓ $field_name: present${NC}"
        return 0
    fi
}

# Core rental requirements
check_required "streetAddress" "$STREET"
check_required "city" "$CITY"
check_required "propertyType" "$PROPERTY_TYPE"
check_required "livingArea" "$LIVING_AREA"
check_required "rooms" "$ROOMS"
check_required "monthlyRent" "$MONTHLY_RENT"
check_required "availabilityDate" "$AVAILABILITY_DATE"
check_required "contractType" "$CONTRACT_TYPE"

# Landlord contact (at least name + one contact method)
if [ -z "$LANDLORD_NAME" ] || [ "$LANDLORD_NAME" = "null" ]; then
    echo -e "${RED}✗ REQUIRED: landlordContact.name${NC}"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ landlordContact.name: present${NC}"
fi

if [ -z "$LANDLORD_PHONE" ] && [ -z "$LANDLORD_EMAIL" ]; then
    echo -e "${RED}✗ REQUIRED: landlordContact must have phone OR email${NC}"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ landlordContact: has phone or email${NC}"
fi

# Check arrays (should not be empty)
if [ -z "$INCLUDED_IN_RENT" ] || [ "$INCLUDED_IN_RENT" = "null" ]; then
    echo -e "${YELLOW}⚠ includedInRent[] is empty - should list what's included in rent${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓ includedInRent[]: $INCLUDED_IN_RENT${NC}"
fi

if [ -z "$EXTRA_COSTS" ] || [ "$EXTRA_COSTS" = "null" ]; then
    echo -e "${YELLOW}⚠ extraCosts[] is empty - acceptable if no extra costs${NC}"
else
    echo -e "${GREEN}✓ extraCosts[]: $EXTRA_COSTS${NC}"
fi

# Validate monthlyRent is numeric
if [ -n "$MONTHLY_RENT" ] && [ "$MONTHLY_RENT" != "null" ]; then
    if echo "$MONTHLY_RENT" | grep -qE '^[0-9]+(\.[0-9]+)?$'; then
        echo -e "${GREEN}✓ monthlyRent is numeric${NC}"
    else
        echo -e "${RED}✗ monthlyRent must be numeric: $MONTHLY_RENT${NC}"
        FAILED=$((FAILED + 1))
    fi
fi

# Validate contractType is valid enum
if [ -n "$CONTRACT_TYPE" ] && [ "$CONTRACT_TYPE" != "null" ]; then
    case "$CONTRACT_TYPE" in
        fixed-term|indefinite|määräaikainen|toistaiseksi|tidsbegränsad|tillsvidare)
            echo -e "${GREEN}✓ contractType valid: $CONTRACT_TYPE${NC}"
            ;;
        *)
            echo -e "${YELLOW}⚠ contractType unexpected value: $CONTRACT_TYPE${NC}"
            echo -e "${YELLOW}  Expected: fixed-term/indefinite (en), määräaikainen/toistaiseksi (fi)${NC}"
            WARNINGS=$((WARNINGS + 1))
            ;;
    esac
fi

# Summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL RENTAL VALIDATIONS PASSED${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s)${NC}"
    fi
    exit 0
else
    echo -e "${RED}✗ $FAILED RENTAL FIELD(S) MISSING OR INVALID${NC}"
    echo -e "${RED}Rental properties MUST have all required fields${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s)${NC}"
    fi
    exit 1
fi

