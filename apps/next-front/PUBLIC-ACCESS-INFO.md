# Public Access Information for Sotheby's App

## Current Public URLs

### 🚀 Vercel (PERMANENT - Works 24/7)
**Main URL:** https://next-front-puce.vercel.app
**Alternative:** https://next-front-kodaren1338-gmailcoms-projects.vercel.app

✅ No need to keep your computer on!
✅ Available 24/7 from anywhere in the world
✅ Professional hosting with global CDN

### Cloudflare Tunnel (Temporary - Requires your computer ON)
**https://plasma-fifty-postcards-discussions.trycloudflare.com**

### ngrok URL (Previously used - Requires your computer ON)
**https://35f008efdfc0.ngrok-free.app**

## Local Access
- Local: http://localhost:3001
- Network: http://192.168.1.93:3001

## ngrok Dashboard
- http://localhost:4040 (view connections and requests)

## PM2 Commands
```bash
pm2 status              # Check app status
pm2 logs sothebys-next-front  # View logs
pm2 restart sothebys-next-front  # Restart app
```

## To Get a New Public URL

### For Cloudflare Tunnel:
```bash
# Start Cloudflare tunnel:
cloudflared tunnel --url http://localhost:3001

# Stop Cloudflare tunnel:
pkill cloudflared
```

### For ngrok:
```bash
# Start ngrok:
ngrok http 3001

# Stop ngrok:
pkill ngrok
```

## Managing Your Vercel Deployment

### To Update the Site:
```bash
cd /Users/emilsoujeh/sothebys/apps/next-front
git add .
git commit -m "Your changes"
git push origin feat/legacy-assets
npx vercel --prod
```

### To Add Environment Variables:
1. Visit: https://vercel.com/kodaren1338-gmailcoms-projects/next-front/settings/environment-variables
2. Add these variables:
   - `LINEAR_API_KEY` - Your Linear API key
   - `LINEAR_COMPANY_ID` - Your Linear company ID
   - `NEXT_PUBLIC_BASE_URL` - https://next-front-puce.vercel.app

### To Check Deployment Status:
```bash
npx vercel ls
```

## Notes

### Vercel (Recommended):
- ✅ Works 24/7 without your computer
- ✅ Free hosting with generous limits
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN for fast loading
- ✅ Easy updates via git push

### Cloudflare Tunnel:
- ✅ No visitor warning page (direct access)
- ✅ No connection limits
- ✅ Generally more stable than ngrok
- ⚠️ URL changes each time you restart
- ⚠️ Still requires your computer to be ON

### ngrok:
- ⚠️ Shows warning page to first-time visitors
- ⚠️ Free tier: max 40 connections per minute
- ⚠️ URL changes each time you restart
- ⚠️ Requires your computer to be ON
