# 🗺️ GOOGLE MAPS API SETUP GUIDE

## 📋 Overview

This project uses Google Maps for:
- Property location maps
- Geocoding addresses to coordinates
- Interactive map view in property search

---

## 🚀 OPTION 1: Automated Setup (Recommended)

### Prerequisites:
1. **Google Cloud CLI** installed
2. **Google Cloud Project** with billing enabled
3. **Logged in** to gcloud

### Install Google Cloud CLI:

**macOS:**
```bash
brew install --cask google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
Download from: https://cloud.google.com/sdk/docs/install

### Run Setup Script:

```bash
# Full setup (creates key if needed, enables APIs, updates .env.local)
./scripts/setup-google-maps.sh

# Or just retrieve existing key
./scripts/get-google-maps-key.sh
```

The script will:
1. ✅ Check if gcloud CLI is installed
2. ✅ Verify you're logged in
3. ✅ Enable required Google Maps APIs
4. ✅ Create or retrieve API key
5. ✅ Add key to `.env.local`

---

## 🔧 OPTION 2: Manual Setup

### Step 1: Create API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project (or create one)
3. Click **"CREATE CREDENTIALS"** → **"API key"**
4. Copy the generated key

### Step 2: Enable Required APIs

Enable these APIs in your project:
- [Maps JavaScript API](https://console.cloud.google.com/apis/library/maps-backend.googleapis.com)
- [Geocoding API](https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com)
- [Places API](https://console.cloud.google.com/apis/library/places-backend.googleapis.com)

### Step 3: Add to Environment

Create or update `apps/next-front/.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

---

## 🔒 SECURITY: Restrict Your API Key

**⚠️ IMPORTANT:** Unrestricted API keys can be abused and cost money!

### Application Restrictions:

**For Production:**
```
HTTP referrers (web sites):
- https://yourdomain.com/*
- https://*.vercel.app/*
```

**For Development:**
```
HTTP referrers (web sites):
- http://localhost:3000/*
- http://localhost:*/*
```

### API Restrictions:

Only enable these APIs:
- ✅ Maps JavaScript API
- ✅ Geocoding API
- ✅ Places API

**How to set restrictions:**
1. Go to [API Credentials](https://console.cloud.google.com/apis/credentials)
2. Click your API key
3. Under "Application restrictions" → Select "HTTP referrers"
4. Add your domains
5. Under "API restrictions" → Select "Restrict key"
6. Choose the 3 APIs above
7. **Save**

---

## 🆓 OPTION 3: Free Fallback (No API Key)

**Don't want to use Google Maps?** No problem!

The geocoding utility automatically falls back to **OpenStreetMap Nominatim** (FREE) if no Google API key is found.

**Pros:**
- ✅ Completely free
- ✅ No API key needed
- ✅ No billing required

**Cons:**
- ⚠️ Slower than Google
- ⚠️ Less accurate for some addresses
- ⚠️ Rate limited (1 request/second)

**How it works:**
```typescript
// 1. Try Google Maps (if key exists)
const result = await geocodeWithGoogle(address);

// 2. Fallback to OpenStreetMap (if Google fails or no key)
if (!result) {
  result = await geocodeWithNominatim(address);
}
```

No configuration needed - just works! 🎉

---

## 📊 Pricing

### Google Maps Platform:

**Monthly Credits:** $200 free
- Geocoding: $5 per 1000 requests
- Maps JavaScript API: $7 per 1000 loads

**Your usage estimate:**
- ~14 properties × 1 geocode each = $0.07/month
- Map views: ~1000/month = $7/month
- **Total: ~$7/month** (well within free tier!)

**Free tier covers:** ~28,000 map loads/month

### OpenStreetMap Nominatim:

**Cost:** $0 (FREE!)
**Limits:** 1 request/second
**Perfect for:** Low-traffic sites or development

---

## 🧪 Testing

### Test Geocoding:

```bash
# In browser console (on any page)
const { geocodeAddress } = await import('/lib/utils/geocoding');
const result = await geocodeAddress('Hiiralankaari 24, 00330 Helsinki, Finland');
console.log(result);
// Output: { lat: 60.159324, lon: 24.795143, source: 'google' }
```

### Test Map Display:

1. Go to any property page
2. Click "Objekt på kartan" tab
3. Should show Google Map with property location

If it shows "GPS-koordinater saknas":
- Check if address is filled in Linear CMS
- Check console for geocoding errors
- Verify API key is set correctly

---

## 🐛 Troubleshooting

### "Karttadata ej tillgänglig"

**Problem:** No coordinates and geocoding failed

**Solutions:**
1. Check if address exists in Linear CMS
2. Check console for errors
3. Verify API key: `echo $NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
4. Test API key: https://maps.googleapis.com/maps/api/geocode/json?address=Helsinki&key=YOUR_KEY

### "This page can't load Google Maps correctly"

**Problem:** API key restrictions or billing not enabled

**Solutions:**
1. Check API key restrictions match your domain
2. Enable billing in Google Cloud
3. Enable required APIs
4. Check browser console for specific error

### "RefererNotAllowedMapError"

**Problem:** Domain not in allowed referrers

**Solution:** Add domain to API key restrictions

### Rate Limit Errors (OpenStreetMap)

**Problem:** Too many requests to Nominatim

**Solution:** 
1. Use Google Maps API instead
2. Or add delay between requests (already implemented: 200ms)

---

## 🔄 Deployment to Vercel

### Add Environment Variable:

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add:
   ```
   Key: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   Value: your_api_key_here
   ```
4. Select: Production, Preview, Development
5. **Save**
6. **Redeploy** your app

Or use Vercel CLI:
```bash
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# Paste your key when prompted
```

---

## 📚 Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Geocoding API Guide](https://developers.google.com/maps/documentation/geocoding)
- [OpenStreetMap Nominatim](https://nominatim.org/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ Checklist

Before going to production:

- [ ] Google Cloud Project created
- [ ] Billing enabled
- [ ] API key created
- [ ] Required APIs enabled (Maps JS, Geocoding, Places)
- [ ] API key restricted (HTTP referrers + API restrictions)
- [ ] Key added to `.env.local`
- [ ] Key added to Vercel
- [ ] Tested on localhost
- [ ] Tested on production domain
- [ ] Monitoring set up (optional)

---

**Questions?** Check the code in `apps/next-front/src/lib/utils/geocoding.ts`

