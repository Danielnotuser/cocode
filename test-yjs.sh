#!/bin/bash
# Quick start script for Yjs integration testing

set -e

echo "🚀 CoCode Yjs Integration - Quick Start"
echo "======================================="
echo ""

# 1. Build JavaScript bundle
echo "📦 Building JavaScript bundle..."
npm run build
echo "✅ Bundle built: static/app.js ($(du -h static/app.js | cut -f1))"
echo ""

# 2. Verify Go compilation
echo "🔨 Building Go server..."
go build -o /tmp/cocode-server main.go handlers.go websockets.go
echo "✅ Server built: /tmp/cocode-server"
echo ""

# 3. Start server
echo "🌐 Starting server on http://localhost:8080"
echo ""
echo "TESTING INSTRUCTIONS:"
echo "===================="
echo ""
echo "1. Open Browser 1: http://localhost:8080"
echo "   - Register as 'alice' / password 'test123'"
echo "   - Create a new session (JavaScript)"
echo "   - Note: Status should show '✓ Connected' (green)"
echo ""
echo "2. Open Browser 2: http://localhost:8080"
echo "   - Register as 'bob' / password 'test123'"
echo "   - Wait for collaboration invitation from alice"
echo "   - Join the session"
echo ""
echo "3. Test Real-Time Sync:"
echo "   - Type in Browser 1 → Should appear in Browser 2"
echo "   - Type in Browser 2 → Should appear in Browser 1"
echo "   - Edit simultaneously → No conflicts!"
echo ""
echo "4. Check Console (F12 → Console tab):"
echo "   - Should see '[Yjs] Editor initialized...'"
echo "   - Should see '[Yjs] Connection status: connected'"
echo ""
echo "Press Ctrl+C to stop server"
echo ""

# Start the server
go run main.go handlers.go websockets.go
