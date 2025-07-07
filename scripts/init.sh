#!/bin/bash

# SothebysRealty.fi Rebuild - Initialization Script
# This script sets up the project after cloning

set -e

echo "🚀 Initializing SothebysRealty.fi Rebuild Project..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Set up Husky hooks
echo "🪝 Setting up Git hooks..."
pnpm prepare

# Create environment files from examples (if they exist)
if [ ! -f "apps/web/.env.local" ]; then
    echo "🔧 Creating environment files..."
    echo "Please set up your environment variables:"
    echo "  - apps/web/.env.local"
    echo "  - apps/studio/.env.local"
    echo ""
    echo "See TODO.md for required environment variables."
fi

# Initialize Cursor AI index (if .vscode/settings.json exists)
echo "🧠 To initialize Cursor AI index, run:"
echo "  ⌘⇧P → Cursor: Init Index"

# Git setup
echo "📝 Setting up Git..."
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "feat: initial project setup

- Add Next.js 14 web app with TypeScript and Tailwind
- Add Sanity Studio v3 with EU dataset configuration
- Add Linear client package with caching
- Configure dev container for consistent development
- Set up ESLint, Prettier, and Husky pre-commit hooks
- Add comprehensive README and TODO documentation"
fi

echo ""
echo "✅ Project initialization complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables (see TODO.md)"
echo "2. Configure Linear API access"
echo "3. Create Sanity project and dataset"
echo "4. Run 'pnpm dev' to start development servers"
echo ""
echo "📚 Documentation:"
echo "  - README.md - Project overview and setup"
echo "  - TODO.md - Detailed next steps"
echo "  - prd.md - Product requirements document"
echo ""
echo "🛠 Development commands:"
echo "  pnpm dev        - Start all apps"
echo "  pnpm dev:web    - Start Next.js only"
echo "  pnpm dev:studio - Start Sanity Studio only"
echo "  pnpm build      - Build all apps"
echo "  pnpm lint       - Run linting"
echo "" 