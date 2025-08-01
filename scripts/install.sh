#!/bin/bash

# MyCLI Installation Script for Ubuntu/Linux
# Usage: curl -fsSL https://raw.githubusercontent.com/yourusername/mycli/main/scripts/install.sh | bash

set -e

REPO_URL="https://github.com/yourusername/mycli.git"
CLI_NAME="mycli"

echo "🚀 Installing MyCLI..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running on Ubuntu/Linux
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo -e "${GREEN}✅ Linux detected${NC}"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${GREEN}✅ macOS detected${NC}"
else
    echo -e "${YELLOW}⚠️  This script is designed for Linux/macOS${NC}"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Installing Node.js..."
    
    # Install Node.js on Ubuntu
    if command -v apt &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    # Install Node.js on other systems
    else
        echo -e "${RED}Please install Node.js manually from https://nodejs.org/${NC}"
        exit 1
    fi
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo -e "${RED}❌ Node.js version 14+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) is installed${NC}"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not available${NC}"
    exit 1
fi

# Install directly from GitHub
echo -e "${BLUE}📦 Installing $CLI_NAME from GitHub...${NC}"

# Method 1: Install directly from GitHub (recommended)
if npm install -g "git+$REPO_URL"; then
    echo -e "${GREEN}✅ $CLI_NAME installed successfully!${NC}"
else
    echo -e "${RED}❌ Installation failed${NC}"
    exit 1
fi

# Verify installation
if command -v $CLI_NAME &> /dev/null; then
    echo -e "${GREEN}🎉 Installation verified!${NC}"
    echo ""
    echo -e "${BLUE}Try these commands:${NC}"
    echo "  $CLI_NAME --help"
    echo "  $CLI_NAME hello --name YourName"
    echo "  $CLI_NAME info"
    echo "  $CLI_NAME list"
    echo ""
    echo -e "${YELLOW}To uninstall: npm uninstall -g $CLI_NAME${NC}"
else
    echo -e "${RED}❌ Installation verification failed${NC}"
    echo "You may need to restart your terminal or add npm global bin to PATH"
fi

echo -e "${GREEN}🚀 Setup complete!${NC}"