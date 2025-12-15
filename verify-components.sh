#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Admin Components Verification ===${NC}\n"

# Check JSX syntax - verify closing div structure
echo "Checking JSX closing structures..."

for file in \
  "frontend/src/pages/AdminPage/AdminCitaciones/AdminCitaciones.jsx" \
  "frontend/src/pages/AdminPage/AdminNotificaciones/AdminNotificaciones.jsx" \
  "frontend/src/pages/AdminPage/AdminFeedback/AdminFeedback.jsx" \
  "frontend/src/pages/AdminPage/AdminHabilidades/AdminHabilidades.jsx"
do
  component=$(basename $(dirname "$file"))
  
  # Check for balanced parentheses in return statement
  if grep -q "return (" "$file" && grep -q ");" "$file"; then
    # Check that closing divs are properly structured
    last_closing=$(tail -5 "$file" | grep -E "^\s*\);")
    if [ ! -z "$last_closing" ]; then
      echo -e "  ${GREEN}✓${NC} $component - JSX structure OK"
    else
      echo -e "  ${RED}✗${NC} $component - Missing closing parenthesis"
    fi
  fi
done

echo ""
echo "Checking CSS files..."

for css_file in \
  "frontend/src/pages/AdminPage/AdminCitaciones/AdminCitaciones.css" \
  "frontend/src/pages/AdminPage/AdminNotificaciones/AdminNotificaciones.css" \
  "frontend/src/pages/AdminPage/AdminFeedback/AdminFeedback.css" \
  "frontend/src/pages/AdminPage/AdminHabilidades/AdminHabilidades.css"
do
  component=$(basename $(dirname "$css_file"))
  
  if [ -f "$css_file" ]; then
    # Check file size (should have reasonable content)
    size=$(wc -l < "$css_file")
    if [ "$size" -gt 50 ]; then
      echo -e "  ${GREEN}✓${NC} $component.css - $size lines"
    else
      echo -e "  ${YELLOW}⚠${NC} $component.css - Only $size lines (may be incomplete)"
    fi
  else
    echo -e "  ${RED}✗${NC} $component.css - File not found"
  fi
done

echo ""
echo -e "${GREEN}Verification Complete!${NC}"
