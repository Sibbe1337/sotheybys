#!/bin/bash

# PM2 Setup Script for Sotheby's Next.js App
echo "🚀 Setting up PM2 for Sotheby's Next.js App..."

# Create logs directory
mkdir -p logs

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 PM2 not found. Installing PM2 globally..."
    npm install -g pm2
fi

# Stop any existing PM2 process for this app
echo "🛑 Stopping any existing instances..."
pm2 stop sothebys-next-front 2>/dev/null || true
pm2 delete sothebys-next-front 2>/dev/null || true

# Build the Next.js app
echo "🔨 Building Next.js app..."
pnpm build

# Start the app with PM2
echo "▶️  Starting app with PM2..."
pm2 start ecosystem.config.js

# Save PM2 process list
echo "💾 Saving PM2 process list..."
pm2 save

# Optional: Set up PM2 to start on system boot
echo ""
echo "📋 To make PM2 start on system boot, run:"
echo "   pm2 startup"
echo "   Then copy and run the command it outputs"
echo ""

# Show app status
echo "✅ Setup complete! Here's your app status:"
pm2 list
echo ""
echo "🔗 Your app is running at: http://localhost:3001"
echo ""
echo "📝 Useful PM2 commands:"
echo "   pm2 logs                  # View logs"
echo "   pm2 monit                 # Monitor in real-time"
echo "   pm2 restart all           # Restart app"
echo "   pm2 stop all              # Stop app"
echo "   pm2 info sothebys-next-front  # Detailed info"
echo ""
echo "📊 View logs:"
echo "   tail -f logs/pm2-out.log  # Output logs"
echo "   tail -f logs/pm2-error.log # Error logs"
