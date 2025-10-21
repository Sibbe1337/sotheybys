#!/bin/bash
# Osake (Aktielägenhet) Property Validation
# Validates apartment properties per spec pages 1-3
# Usage: BASE=http://localhost:3000 SLUG=bernhardinkatu-1 ./tests/osake-validation.sh

set -e

BASE="${BASE:-http://localhost:3000}"
SLUG="${SLUG:-bernhardinkatu-1}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   OSAKE PROPERTY VALIDATION - Spec Pages 1-3              ║${NC}"
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

# Extract all fields
STREET=$(echo "$RESPONSE" | jq -r '.streetAddress // ""')
POSTAL=$(echo "$RESPONSE" | jq -r '.postalCode // ""')
CITY=$(echo "$RESPONSE" | jq -r '.city // ""')
REGION=$(echo "$RESPONSE" | jq -r '.region // .district // ""')
PROPERTY_TYPE=$(echo "$RESPONSE" | jq -r '.propertyType // ""')
APARTMENT_TYPE=$(echo "$RESPONSE" | jq -r '.apartmentType // ""')
DESCRIPTION=$(echo "$RESPONSE" | jq -r '.description // ""')
LIVING_AREA=$(echo "$RESPONSE" | jq -r '.livingArea // .area // ""')
PRICE=$(echo "$RESPONSE" | jq -r '.price // ""')
DEBT_PART=$(echo "$RESPONSE" | jq -r '.debtPart // ""')
DEBT_FREE=$(echo "$RESPONSE" | jq -r '.debtFreePrice // ""')
YEAR_BUILT=$(echo "$RESPONSE" | jq -r '.yearOfBuilding // .buildYear // ""')
FLOOR=$(echo "$RESPONSE" | jq -r '.floorLocation // .floor // ""')
NUM_FLOORS=$(echo "$RESPONSE" | jq -r '.numberOfFloors // ""')
MAINT_FEE=$(echo "$RESPONSE" | jq -r '.maintenanceFee // ""')
FIN_FEE=$(echo "$RESPONSE" | jq -r '.financingFee // ""')
OTHER_FEES=$(echo "$RESPONSE" | jq -r '.otherFees // ""')
TOTAL_FEE=$(echo "$RESPONSE" | jq -r '.totalFee // ""')
WATER_FEE=$(echo "$RESPONSE" | jq -r '.waterFee // ""')
NUM_SHARES=$(echo "$RESPONSE" | jq -r '.numberOfShares // ""')
BALCONY=$(echo "$RESPONSE" | jq -r '.balcony // ""')
SAUNA=$(echo "$RESPONSE" | jq -r '.sauna // ""')
ENERGY_CLASS=$(echo "$RESPONSE" | jq -r '.energyClass // ""')

# Display results in table format
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  OSAKE PROPERTY FIELDS (Spec Validation)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

printf "%-30s : %s\n" "Fullständig adress" "$STREET, $POSTAL $CITY"
printf "%-30s : %s\n" "Stadsdel (region)" "$REGION"
printf "%-30s : %s\n" "Typ av hus" "$PROPERTY_TYPE"
printf "%-30s : %s\n" "Lägenhettyp" "$APARTMENT_TYPE"
printf "%-30s : %s\n" "Beskrivning" "${DESCRIPTION:0:50}..."
printf "%-30s : %s m²\n" "Boyta (livingArea)" "$LIVING_AREA"
printf "%-30s : %s\n" "Byggnadsår" "$YEAR_BUILT"
printf "%-30s : %s / %s\n" "Våningsplan" "$FLOOR" "$NUM_FLOORS"
printf "%-30s : %s\n" "Balkong" "$BALCONY"
printf "%-30s : %s\n" "Bastu" "$SAUNA"
printf "%-30s : %s\n" "Energiklass" "$ENERGY_CLASS"
printf "%-30s : %s\n" "Aktie numror" "$NUM_SHARES"

echo ""
echo -e "${BLUE}─────────────── PRIS (Price) ───────────────${NC}"
printf "%-30s : %s €\n" "Myyntihinta (price)" "$PRICE"
printf "%-30s : %s €\n" "Velkaosuus (debtPart)" "$DEBT_PART"
printf "%-30s : %s €\n" "Velaton hinta (debtFree)" "$DEBT_FREE"

# Compute €/m² if livingArea > 0
if [ -n "$LIVING_AREA" ] && [ "$LIVING_AREA" != "null" ] && [ "$LIVING_AREA" != "0" ]; then
    if [ -n "$PRICE" ] && [ "$PRICE" != "null" ] && [ "$PRICE" != "0" ]; then
        PRICE_PER_M2=$(echo "scale=2; $PRICE / $LIVING_AREA" | bc)
        printf "%-30s : %s €/m²\n" "Myyntihinta per m²" "$PRICE_PER_M2"
    else
        echo -e "${RED}✗ Cannot compute price/m² - price is missing${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    if [ -n "$DEBT_FREE" ] && [ "$DEBT_FREE" != "null" ] && [ "$DEBT_FREE" != "0" ]; then
        DEBT_FREE_PER_M2=$(echo "scale=2; $DEBT_FREE / $LIVING_AREA" | bc)
        printf "%-30s : %s €/m²\n" "Velaton hinta per m²" "$DEBT_FREE_PER_M2"
    else
        echo -e "${YELLOW}⚠ Cannot compute debt-free/m² - debt-free price is missing${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

echo ""
echo -e "${BLUE}─────────── VEDERLAG (Monthly Fees) ────────${NC}"
printf "%-30s : %s €/kk\n" "Yhtiövastike (maintenance)" "$MAINT_FEE"
printf "%-30s : %s €/kk\n" "Rahoitusvastike (financing)" "$FIN_FEE"
printf "%-30s : %s €/kk\n" "Muut maksut (other)" "$OTHER_FEES"
printf "%-30s : %s €/kk\n" "Kokonaisvastike (total)" "$TOTAL_FEE"
printf "%-30s : %s €/kk\n" "Vesimaksu (water)" "$WATER_FEE"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  VALIDATION CHECKS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Check 1: Required fields must be non-empty
check_required() {
    local field_name=$1
    local field_value=$2
    
    if [ -z "$field_value" ] || [ "$field_value" = "null" ]; then
        echo -e "${RED}✗ Required field missing: $field_name${NC}"
        FAILED=$((FAILED + 1))
        return 1
    else
        echo -e "${GREEN}✓ $field_name: present${NC}"
        return 0
    fi
}

check_required "streetAddress" "$STREET"
check_required "city" "$CITY"
check_required "livingArea" "$LIVING_AREA"
check_required "price" "$PRICE"

# Check 2: Price math invariant: price + debtPart ≈ debtFreePrice (±1 EUR)
if [ -n "$PRICE" ] && [ "$PRICE" != "null" ] && [ -n "$DEBT_PART" ] && [ "$DEBT_PART" != "null" ] && [ -n "$DEBT_FREE" ] && [ "$DEBT_FREE" != "null" ]; then
    COMPUTED_DEBT_FREE=$(echo "$PRICE + $DEBT_PART" | bc)
    DIFF=$(echo "$COMPUTED_DEBT_FREE - $DEBT_FREE" | bc | tr -d '-')
    
    if (( $(echo "$DIFF <= 1" | bc -l) )); then
        echo -e "${GREEN}✓ Price invariant valid: $PRICE + $DEBT_PART ≈ $DEBT_FREE (diff: $DIFF €)${NC}"
    else
        echo -e "${RED}✗ Price invariant FAILED: $PRICE + $DEBT_PART = $COMPUTED_DEBT_FREE, but debtFree = $DEBT_FREE (diff: $DIFF €)${NC}"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${YELLOW}⚠ Cannot validate price invariant - missing price components${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 3: LivingArea must be > 0 for €/m² computation
if [ -n "$LIVING_AREA" ] && [ "$LIVING_AREA" != "null" ]; then
    if (( $(echo "$LIVING_AREA > 0" | bc -l) )); then
        echo -e "${GREEN}✓ Living area valid: $LIVING_AREA m²${NC}"
    else
        echo -e "${RED}✗ Living area must be > 0 for €/m² calculation${NC}"
        FAILED=$((FAILED + 1))
    fi
fi

# Check 4: Total fee computation (if not provided, should = maintenance + financing)
if [ -z "$TOTAL_FEE" ] || [ "$TOTAL_FEE" = "null" ] || [ "$TOTAL_FEE" = "0" ]; then
    if [ -n "$MAINT_FEE" ] && [ "$MAINT_FEE" != "null" ] && [ -n "$FIN_FEE" ] && [ "$FIN_FEE" != "null" ]; then
        EXPECTED_TOTAL=$(echo "$MAINT_FEE + $FIN_FEE" | bc)
        echo -e "${YELLOW}⚠ Total fee not set. Expected fallback: $EXPECTED_TOTAL €/kk (maintenance + financing)${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${GREEN}✓ Total fee provided: $TOTAL_FEE €/kk${NC}"
fi

# Check 5: Boolean fields should be true/false/Kyllä/Ei
check_boolean() {
    local field_name=$1
    local field_value=$2
    
    if [ -n "$field_value" ] && [ "$field_value" != "null" ]; then
        case "$field_value" in
            true|false|Kyllä|Ei|Ja|Nej|Yes|No)
                echo -e "${GREEN}✓ $field_name: valid boolean ($field_value)${NC}"
                ;;
            *)
                echo -e "${YELLOW}⚠ $field_name: unexpected value ($field_value)${NC}"
                WARNINGS=$((WARNINGS + 1))
                ;;
        esac
    fi
}

check_boolean "balcony" "$BALCONY"
check_boolean "sauna" "$SAUNA"

# Check 6: Energy class should be hidden if empty
if [ -z "$ENERGY_CLASS" ] || [ "$ENERGY_CLASS" = "null" ]; then
    echo -e "${GREEN}✓ Energy class empty - should be hidden in UI${NC}"
else
    echo -e "${GREEN}✓ Energy class present: $ENERGY_CLASS${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL VALIDATIONS PASSED${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s)${NC}"
    fi
    exit 0
else
    echo -e "${RED}✗ $FAILED VALIDATION(S) FAILED${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s)${NC}"
    fi
    exit 1
fi

