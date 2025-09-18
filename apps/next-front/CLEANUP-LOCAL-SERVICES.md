# Cleanup Local Services

Since your app is now deployed to Vercel, you can stop all local services:

## Stop All Local Services
```bash
# Stop PM2 (if running)
pm2 stop all
pm2 delete all

# Stop ngrok (if running)
pkill ngrok

# Stop Cloudflare tunnel (if running)
pkill cloudflared

# Stop any Next.js dev servers
pkill -f "next dev"
pkill -f "next start"
pkill -f "pnpm dev"
pkill -f "npm run dev"
```

## Your App is Now on Vercel!
- URL: https://next-front-puce.vercel.app
- Works 24/7 without your computer
- No need to run any local services

## If You Need to Work Locally Again
```bash
cd /Users/emilsoujeh/sothebys/apps/next-front
pnpm dev
# Then visit http://localhost:3001
```
