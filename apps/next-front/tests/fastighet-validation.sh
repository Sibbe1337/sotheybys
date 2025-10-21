#!/bin/bash
# Fastighet (Egendom/Egnahemshus) Property Validation
# Validates detached house/estate properties per spec pages 4-5
# Usage: BASE=http://localhost:3000 SLUG=remmarholmen ./tests/fastighet-validation.sh

set -e

BASE="${BASE:-http://localhost:3000}"
SLUG="${SLUG:-remmarholmen}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   FASTIGHET PROPERTY VALIDATION - Spec Pages 4-5           ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo "Property: $SLUG"
echo "Base URL: $BASE"
echo ""

FAILED=0
WARNINGS=0

# Fetch API data (using Swedish locale for spec alignment)
echo "📡 Fetching property data (lang=sv)..."
RESPONSE=$(curl -s "${BASE}/api/property/${SLUG}?lang=sv")

# Validate JSON
if ! echo "$RESPONSE" | jq empty 2>/dev/null; then
    echo -e "${RED}✗ Invalid JSON response${NC}"
    exit 1
fi

# Extract all fields
STREET=$(echo "$RESPONSE" | jq -r '.streetAddress // ""')
CITY=$(echo "$RESPONSE" | jq -r '.city // ""')
REGION=$(echo "$RESPONSE" | jq -r '.region // .district // ""')
LIVING_AREA=$(echo "$RESPONSE" | jq -r '.livingArea // ""')
TOTAL_AREA=$(echo "$RESPONSE" | jq -r '.totalArea // ""')
SITE_AREA=$(echo "$RESPONSE" | jq -r '.siteArea // ""')
PRICE=$(echo "$RESPONSE" | jq -r '.price // ""')
DEBT_PART=$(echo "$RESPONSE" | jq -r '.debtPart // ""')
DEBT_FREE=$(echo "$RESPONSE" | jq -r '.debtFreePrice // ""')
WATER_FEE=$(echo "$RESPONSE" | jq -r '.waterFee // ""')
OTHER_FEES=$(echo "$RESPONSE" | jq -r '.otherFees // ""')
PROPERTY_TAX=$(echo "$RESPONSE" | jq -r '.propertyTax // ""')
ENERGY_CLASS=$(echo "$RESPONSE" | jq -r '.energyClass // ""')
ENERGY_CERT=$(echo "$RESPONSE" | jq -r '.energyCertificate // ""')

# Fastighetsinformation fields
SITE_OWNERSHIP=$(echo "$RESPONSE" | jq -r '.siteOwnershipType // ""')
PROPERTY_ID=$(echo "$RESPONSE" | jq -r '.propertyId // ""')
ZONING=$(echo "$RESPONSE" | jq -r '.zoningSituation // ""')
BUILDING_RIGHTS=$(echo "$RESPONSE" | jq -r '.buildingRights // ""')

# Byggfakta fields
YEAR_BUILT=$(echo "$RESPONSE" | jq -r '.yearOfBuilding // .buildYear // ""')
VENTILATION=$(echo "$RESPONSE" | jq -r '.ventilationSystem // ""')
NUM_FLOORS=$(echo "$RESPONSE" | jq -r '.numberOfFloors // ""')
BUILDING_MATERIAL=$(echo "$RESPONSE" | jq -r '.buildingMaterial // ""')
ROOF_TYPE=$(echo "$RESPONSE" | jq -r '.roofType // ""')

# Display results in table format
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  FASTIGHET FIELDS (Spec Pages 4-5)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

printf "%-30s : %s, %s\n" "Adress" "$STREET" "$CITY"
printf "%-30s : %s\n" "Stadsdel (region)" "$REGION"
printf "%-30s : %s m²\n" "Bostadsyta (livingArea)" "$LIVING_AREA"
printf "%-30s : %s m²\n" "Total yta (totalArea)" "$TOTAL_AREA"

# Site area with m²/ha conversion
if [ -n "$SITE_AREA" ] && [ "$SITE_AREA" != "null" ] && [ "$SITE_AREA" != "0" ]; then
    if (( $(echo "$SITE_AREA >= 10000" | bc -l) )); then
        SITE_AREA_HA=$(echo "scale=2; $SITE_AREA / 10000" | bc)
        printf "%-30s : %s ha (%.0f m²)\n" "Tomtstorlek (siteArea)" "$SITE_AREA_HA" "$SITE_AREA"
    else
        printf "%-30s : %s m²\n" "Tomtstorlek (siteArea)" "$SITE_AREA"
    fi
else
    printf "%-30s : (empty)\n" "Tomtstorlek (siteArea)"
fi

echo ""
echo -e "${BLUE}─────────────── PRISUPPGIFTER ───────────────${NC}"
printf "%-30s : %s €\n" "Pris (price)" "$PRICE"
if [ -n "$DEBT_PART" ] && [ "$DEBT_PART" != "null" ] && [ "$DEBT_PART" != "0" ]; then
    printf "%-30s : %s €\n" "Skuld (debtPart)" "$DEBT_PART"
fi
if [ -n "$DEBT_FREE" ] && [ "$DEBT_FREE" != "null" ] && [ "$DEBT_FREE" != "0" ]; then
    printf "%-30s : %s €\n" "Skuldfritt pris (debtFree)" "$DEBT_FREE"
fi

echo ""
echo -e "${BLUE}────────────── AVGIFTER & SKATT ──────────────${NC}"
printf "%-30s : %s €/kk\n" "Vattenavgift (waterFee)" "$WATER_FEE"
printf "%-30s : %s €/kk\n" "Andra avgifter (otherFees)" "$OTHER_FEES"
printf "%-30s : %s €/år\n" "Fastighetsskatt (propertyTax)" "$PROPERTY_TAX"

echo ""
echo -e "${BLUE}───────── FASTIGHETSINFORMATION ──────────${NC}"
printf "%-30s : %s\n" "Ägandet (siteOwnership)" "$SITE_OWNERSHIP"
printf "%-30s : %s\n" "Fastighetsbeteckning (propertyId)" "$PROPERTY_ID"
printf "%-30s : %s\n" "Generalplan (zoning)" "$ZONING"
printf "%-30s : %s\n" "Byggnadsrätt (buildingRights)" "$BUILDING_RIGHTS"

echo ""
echo -e "${BLUE}────────────── BYGGFAKTA ─────────────${NC}"
printf "%-30s : %s\n" "Byggnadsår (yearOfBuilding)" "$YEAR_BUILT"
printf "%-30s : %s\n" "Ventilationssystem" "$VENTILATION"
printf "%-30s : %s\n" "Våningsantal (numberOfFloors)" "$NUM_FLOORS"
printf "%-30s : %s\n" "Byggnadsmaterial" "$BUILDING_MATERIAL"
printf "%-30s : %s\n" "Taktyp (roofType)" "$ROOF_TYPE"

echo ""
echo -e "${BLUE}─────────── ENERGI (Optional) ────────────${NC}"
printf "%-30s : %s\n" "Energiklass" "$ENERGY_CLASS"
printf "%-30s : %s\n" "Energicertifikat" "$ENERGY_CERT"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  VALIDATION CHECKS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Check 1: Site area units (m² vs ha)
if [ -n "$SITE_AREA" ] && [ "$SITE_AREA" != "null" ] && [ "$SITE_AREA" != "0" ]; then
    if (( $(echo "$SITE_AREA >= 10000" | bc -l) )); then
        echo -e "${GREEN}✓ siteArea >= 10,000 m² → should display as hectares (ha)${NC}"
        SITE_AREA_HA=$(echo "scale=2; $SITE_AREA / 10000" | bc)
        echo -e "${GREEN}  Expected UI: ${SITE_AREA_HA} ha${NC}"
    else
        echo -e "${GREEN}✓ siteArea < 10,000 m² → should display as m²${NC}"
        echo -e "${GREEN}  Expected UI: ${SITE_AREA} m²${NC}"
    fi
else
    echo -e "${YELLOW}⚠ siteArea is empty (row should be hidden in UI)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 2: Property tax with €/år suffix
if [ -n "$PROPERTY_TAX" ] && [ "$PROPERTY_TAX" != "null" ] && [ "$PROPERTY_TAX" != "0" ]; then
    if echo "$PROPERTY_TAX" | grep -qE '^[0-9]+(\.[0-9]+)?$'; then
        echo -e "${GREEN}✓ propertyTax is numeric: $PROPERTY_TAX (UI should add €/år)${NC}"
    else
        echo -e "${YELLOW}⚠ propertyTax format: $PROPERTY_TAX (check if /v or /år suffix)${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠ propertyTax is empty (row should be hidden in UI)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 3: Site ownership type validation
if [ -n "$SITE_OWNERSHIP" ] && [ "$SITE_OWNERSHIP" != "null" ]; then
    case "$SITE_OWNERSHIP" in
        Oma|Vuokra|Egen|Hyra|Owned|Rented)
            echo -e "${GREEN}✓ siteOwnershipType valid: $SITE_OWNERSHIP${NC}"
            ;;
        *)
            echo -e "${YELLOW}⚠ siteOwnershipType unexpected value: $SITE_OWNERSHIP${NC}"
            echo -e "${YELLOW}  Expected: Oma/Vuokra (fi) or Egen/Hyra (sv)${NC}"
            WARNINGS=$((WARNINGS + 1))
            ;;
    esac
else
    echo -e "${YELLOW}⚠ siteOwnershipType is empty (row should be hidden in UI)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 4: Building rights - hide if empty
if [ -z "$BUILDING_RIGHTS" ] || [ "$BUILDING_RIGHTS" = "null" ]; then
    echo -e "${GREEN}✓ buildingRights is empty → row should NOT render in UI${NC}"
else
    echo -e "${GREEN}✓ buildingRights present: $BUILDING_RIGHTS → row should render${NC}"
fi

# Check 5: Required fields for Fastighet
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
check_required "price" "$PRICE"

# Living area highly recommended but sometimes missing for plots
if [ -z "$LIVING_AREA" ] || [ "$LIVING_AREA" = "null" ] || [ "$LIVING_AREA" = "0" ]; then
    echo -e "${YELLOW}⚠ livingArea is empty (acceptable for plots, but verify property type)${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓ livingArea present: $LIVING_AREA m²${NC}"
fi

# Check 6: Energy class optional - can be empty
if [ -z "$ENERGY_CLASS" ] || [ "$ENERGY_CLASS" = "null" ]; then
    echo -e "${GREEN}✓ energyClass empty → row should be hidden in UI${NC}"
else
    echo -e "${GREEN}✓ energyClass present: $ENERGY_CLASS → row should render${NC}"
fi

# Check 7: Optional Fastighetsinformation fields
echo ""
echo -e "${BLUE}Optional field presence check:${NC}"
OPTIONAL_FIELDS=(
    "propertyId:$PROPERTY_ID"
    "zoningSituation:$ZONING"
    "buildingRights:$BUILDING_RIGHTS"
)

for field in "${OPTIONAL_FIELDS[@]}"; do
    field_name="${field%%:*}"
    field_value="${field#*:}"
    
    if [ -z "$field_value" ] || [ "$field_value" = "null" ]; then
        echo -e "${YELLOW}  $field_name: empty (should hide row)${NC}"
    else
        echo -e "${GREEN}  $field_name: present${NC}"
    fi
done

# Summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL VALIDATIONS PASSED${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) - check UI rendering${NC}"
    fi
    exit 0
else
    echo -e "${RED}✗ $FAILED VALIDATION(S) FAILED${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s)${NC}"
    fi
    exit 1
fi

