#!/bin/bash

# Colors for console output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

echo -e "${BOLD}${YELLOW}Starting verification...${RESET}\n"

# Run tests
echo -e "${BOLD}Running tests...${RESET}"
if npm test; then
  echo -e "\n${GREEN}✓ Tests passed${RESET}\n"
else
  echo -e "\n${RED}✗ Tests failed${RESET}\n"
  exit 1
fi

# Run ESM build
echo -e "${BOLD}Building ESM module...${RESET}"
if npm run build:esm; then
  echo -e "\n${GREEN}✓ ESM build completed successfully${RESET}\n"
else
  echo -e "\n${RED}✗ ESM build failed${RESET}\n"
  exit 1
fi

# Run UMD build
echo -e "${BOLD}Building UMD module...${RESET}"
if npm run build:umd; then
  echo -e "\n${GREEN}✓ UMD build completed successfully${RESET}\n"
else
  echo -e "\n${RED}✗ UMD build failed${RESET}\n"
  exit 1
fi

# Check build files
echo -e "${BOLD}Checking build artifacts...${RESET}"
DIST_DIR="./dist"
FILES=("index.esm.js" "index.umd.js")

for file in "${FILES[@]}"; do
  FILE_PATH="$DIST_DIR/$file"
  # Use ls to check if file exists and get size
  if ls -la "$FILE_PATH" > /dev/null 2>&1; then
    SIZE=$(du -k "$FILE_PATH" | cut -f1)
    echo -e "${GREEN}✓ $file (${SIZE} KB)${RESET}"
  else
    echo -e "${RED}✗ $file not found${RESET}"
    exit 1
  fi
done

# Check TypeScript declarations
TYPES_DIR="./types"
if [ -f "$TYPES_DIR/index.d.ts" ]; then
  echo -e "${GREEN}✓ TypeScript declarations generated${RESET}"
else
  echo -e "${RED}✗ TypeScript declarations not found${RESET}"
  exit 1
fi

echo -e "\n${BOLD}${GREEN}Verification completed successfully!${RESET}"
echo -e "${YELLOW}You can now use the library:${RESET}"
echo -e "  - ESM: import useOutlineAnalytics from '@useoutline/analytics'"
echo -e "  - CDN: <script src=\"https://cdn.jsdelivr.net/npm/@useoutline/analytics\"></script>" 