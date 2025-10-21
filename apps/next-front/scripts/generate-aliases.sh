#!/bin/bash
# Generate comprehensive property aliases from live site

set -e

BASE_URL="${1:-https://next-front-puce.vercel.app}"

echo "🔍 Generating Property Aliases"
echo "================================"
echo "Base URL: $BASE_URL"
echo ""

# Create temp file for aliases
TEMP_FILE=$(mktemp)
echo '{' > "$TEMP_FILE"
echo '  "comment": "Auto-generated property aliases",' >> "$TEMP_FILE"
echo '  "aliases": {' >> "$TEMP_FILE"

# Test a few known properties to find patterns
KNOWN_SLUGS=(
  "heikkilantie-1"
  "heikkilantie-11" 
  "aleksanteri-1"
  "aleksanteri-11"
  "remmarholmen"
  "remmarholmen-1"
  "albertinkatu-19-b"
  "albertinkatu-19-b-3"
  "tehtaankatu-19-g"
  "tehtaankatu-19-g-15"
  "pengerkatu-25"
  "bernhardinkatu-1"
  "nuikontie-140"
  "nuijontie-140"
)

FOUND_COUNT=0
ALIAS_ENTRIES=()

echo "Testing known slug variations..."
echo ""

for slug in "${KNOWN_SLUGS[@]}"; do
  RESULT=$(curl -s "$BASE_URL/api/property/$slug?lang=fi" | jq -r '.success // false')
  
  if [ "$RESULT" = "true" ]; then
    echo "  ✅ $slug (exists)"
    ((FOUND_COUNT++))
  else
    # Try to find what it should map to
    BASE=$(echo "$slug" | sed -E 's/-[0-9]+$//')
    if [ "$BASE" != "$slug" ]; then
      # This has a number suffix, try without it
      TEST_RESULT=$(curl -s "$BASE_URL/api/property/$BASE?lang=fi" | jq -r '.success // false')
      if [ "$TEST_RESULT" = "true" ]; then
        echo "  🔄 $slug → $BASE"
        ALIAS_ENTRIES+=("    \"$slug\": \"$BASE\"")
      else
        echo "  ❌ $slug (not found, no mapping)"
      fi
    else
      echo "  ❌ $slug (not found)"
    fi
  fi
done

echo ""
echo "================================"
echo "Found $FOUND_COUNT working slugs"
echo "Generated ${#ALIAS_ENTRIES[@]} aliases"
echo ""

# Write aliases to temp file
for i in "${!ALIAS_ENTRIES[@]}"; do
  if [ $i -lt $((${#ALIAS_ENTRIES[@]} - 1)) ]; then
    echo "${ALIAS_ENTRIES[$i]}," >> "$TEMP_FILE"
  else
    echo "${ALIAS_ENTRIES[$i]}" >> "$TEMP_FILE"
  fi
done

echo '  }' >> "$TEMP_FILE"
echo '}' >> "$TEMP_FILE"

cat "$TEMP_FILE"
rm "$TEMP_FILE"

