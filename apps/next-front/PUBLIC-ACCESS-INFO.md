# Public Access Information for Sotheby's App

## Current Public URLs

### Cloudflare Tunnel (Running)
**https://plasma-fifty-postcards-discussions.trycloudflare.com**

### ngrok URL (Previously used)
**https://35f008efdfc0.ngrok-free.app**

Both URLs are accessible from anywhere in the world.

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

## Notes

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
