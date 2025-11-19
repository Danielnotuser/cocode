#!/bin/bash

# CoCode Installation and Setup Script
# This script automates the setup of the collaborative code editor

set -e  # Exit on error

echo "=================================================="
echo "  CoCode: Collaborative Code Editor Setup"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check prerequisites
print_info "Checking prerequisites..."

# Check Go
if ! command -v go &> /dev/null; then
    print_error "Go not found. Please install Go 1.24+"
    exit 1
fi
GO_VERSION=$(go version | grep -oP 'go\K[0-9]+\.[0-9]+')
print_success "Go $GO_VERSION found"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js 16+"
    exit 1
fi
NODE_VERSION=$(node --version | cut -d'v' -f2)
print_success "Node.js $NODE_VERSION found"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm not found. Please install npm 7+"
    exit 1
fi
NPM_VERSION=$(npm --version)
print_success "npm $NPM_VERSION found"

# Check SQLite3
if ! command -v sqlite3 &> /dev/null; then
    print_info "SQLite3 client not found (optional, but recommended)"
else
    SQLITE_VERSION=$(sqlite3 --version | cut -d' ' -f1)
    print_success "SQLite3 $SQLITE_VERSION found"
fi

echo ""
print_info "Installing Go dependencies..."

# Go mod download
if ! go mod download 2>/dev/null; then
    print_error "Failed to download Go dependencies"
    print_info "Trying 'go mod tidy'..."
    go mod tidy
fi
print_success "Go dependencies downloaded"

# Go mod tidy
go mod tidy
print_success "Go modules tidied"

echo ""
print_info "Installing frontend dependencies..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in current directory"
    print_info "Make sure you're in the cocode directory"
    exit 1
fi

# npm install
if npm install; then
    print_success "npm packages installed"
else
    print_error "Failed to install npm packages"
    print_info "Try: npm install --force"
    exit 1
fi

echo ""
print_info "Building frontend bundle..."

# Build with esbuild
if npm run build; then
    print_success "Frontend bundle created at static/app.js"
else
    print_error "Failed to build frontend"
    print_info "Try: npm run build"
    exit 1
fi

echo ""
print_info "Verifying setup..."

# Check if key files exist
if [ ! -f "main.go" ]; then
    print_error "main.go not found"
    exit 1
fi
print_success "main.go found"

if [ ! -f "handlers.go" ]; then
    print_error "handlers.go not found"
    exit 1
fi
print_success "handlers.go found"

if [ ! -f "websockets.go" ]; then
    print_error "websockets.go not found"
    exit 1
fi
print_success "websockets.go found"

if [ ! -f "websockets_yjs.go" ]; then
    print_error "websockets_yjs.go not found"
    exit 1
fi
print_success "websockets_yjs.go found"

if [ ! -f "static/app.js" ]; then
    print_error "static/app.js not found (bundle not created?)"
    exit 1
fi
print_success "static/app.js found (bundled)"

echo ""
echo "=================================================="
echo "  Setup Complete! ✓"
echo "=================================================="
echo ""

print_success "All dependencies installed and configured"
echo ""
echo "To start the server, run:"
echo ""
echo "    go run main.go handlers.go websockets.go websockets_yjs.go"
echo ""
echo "Then open: http://localhost:8080"
echo ""

print_info "Optional: Watch for frontend changes during development"
echo "    npm run watch"
echo ""

print_info "For detailed setup instructions, see SETUP.md"
echo "For quick reference, see QUICKSTART.md"
echo ""

print_success "Enjoy collaborative coding!"
