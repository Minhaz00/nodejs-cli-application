#!/bin/bash

# MyCLI Build Script
# This script builds the CLI application for distribution

set -e

echo "🔨 Building MyCLI..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Get package info
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")

echo -e "${BLUE}📦 Building $PACKAGE_NAME v$PACKAGE_VERSION${NC}"

# Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
rm -f *.tgz

# Install dependencies if not present
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing dependencies...${NC}"
    npm install
fi

# Run tests if they exist
if npm run test --silent > /dev/null 2>&1; then
    echo -e "${YELLOW}🧪 Running tests...${NC}"
    npm test
else
    echo -e "${YELLOW}⚠️  No tests found, skipping...${NC}"
fi

# Make CLI script executable
echo -e "${YELLOW}🔧 Making CLI script executable...${NC}"
chmod +x bin/mycli.js

# Create package
echo -e "${YELLOW}📦 Creating package...${NC}"
npm pack

# Check if package was created
PACKAGE_FILE="${PACKAGE_NAME}-${PACKAGE_VERSION}.tgz"
if [ -f "$PACKAGE_FILE" ]; then
    echo -e "${GREEN}✅ Package created successfully: $PACKAGE_FILE${NC}"
    
    # Show package size
    PACKAGE_SIZE=$(du -h "$PACKAGE_FILE" | cut -f1)
    echo -e "${BLUE}📏 Package size: $PACKAGE_SIZE${NC}"
    
    echo ""
    echo -e "${GREEN}🎉 Build complete!${NC}"
    echo ""
    echo -e "${BLUE}To test the package locally:${NC}"
    echo "  npm install -g ./$PACKAGE_FILE"
    echo ""
    echo -e "${BLUE}To distribute:${NC}"
    echo "  1. Upload $PACKAGE_FILE to GitHub releases"
    echo "  2. Share with users for: npm install -g $PACKAGE_FILE"
    echo "  3. Or push to npm registry with: npm publish"
    
else
    echo -e "${RED}❌ Package creation failed${NC}"
    exit 1
fi

echo -e "${GREEN}🚀 Ready for distribution!${NC}"