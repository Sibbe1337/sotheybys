# Empty Data Issue - Floor Plan, Map & Brochure

## 🔍 Root Cause

The Linear API is returning **0 listings** with error `API_KEY_WRONG_FORMAT` (401), which means:
- All property data is empty
- Floor plans, maps, and brochures have no data to display
- The homepage shows sample properties instead of real ones

## 🛠️ What Was Fixed

### 1. `listings-cache.ts` BaseUrl Issue
- **Problem:** Was falling back to `localhost:3000` on Vercel
- **Fix:** Removed the `NEXT_PUBLIC_APP_URL` fallback that caused `ECONNREFUSED` errors
- **File:** `src/lib/listings-cache.ts` lines 86-102

### 2. Added Debug Endpoints

Created two diagnostic endpoints to help identify the issue:

#### `/api/debug/env` - Check Environment Variables
- Shows which env vars are set
- Reveals API key format (preview only, not full key)
- Lists missing variables

#### `/api/debug/linear-test` - Test Linear API Connection
- Actually calls the Linear API
- Shows exact error responses
- Displays sample data if successful

## ✅ Deployment Steps

### Step 1: Commit and Push Changes
```bash
cd /Users/emilsoujeh/sothebys
git add -A
git commit -m "fix: listings-cache baseUrl and add debug endpoints for Linear API"
git push origin main
```

### Step 2: Verify Vercel Environment Variables

Go to your Vercel project settings and ensure these are set:

**Required Environment Variables:**
- `COMPANY_ID` or `LINEAR_COMPANY_ID` - Your company ID
- `LINEAR_API_KEY` - Your API key (WITHOUT the `LINEAR-API-KEY` prefix - the code adds it automatically)
- `LINEAR_EXTERNAL_BASE` - Set to `https://linear-external-api.azurewebsites.net`

**Important:** After updating env vars, you MUST:
1. Click "Save"
2. Trigger a new deployment (or it will use old cached values)

### Step 3: Test the Debug Endpoints

After deployment, visit:

```bash
# 1. Check environment variables
curl https://your-vercel-url.vercel.app/api/debug/env | jq '.'

# 2. Test Linear API connection
curl https://your-vercel-url.vercel.app/api/debug/linear-test | jq '.'
```

### Step 4: Interpret Results

#### If `api/debug/env` shows:
- `❌ NOT SET` for COMPANY_ID or API_KEY → **Set these in Vercel**
- `hasPrefix: false` → **Normal** (code auto-adds prefix)

#### If `api/debug/linear-test` shows:
- `status: 401` with `API_KEY_WRONG_FORMAT` → **Check API key format in Vercel**
- `status: 401` with `MISSING_COMPANY_ID` → **Set COMPANY_ID in Vercel**
- `status: 200` with `listingsCount: 6` → **✅ SUCCESS!**

## 📋 Expected Behavior After Fix

Once the Linear API returns data successfully, you should see:

1. **Homepage**
   - Real property listings (not sample data)
   - Correct addresses and prices
   - Property images

2. **Property Detail Pages**
   - Floor plan section (if Linear API provides `floorPlanUrl` or `floorPlanUrls`)
   - Map section (if Linear API provides `coordinates` or `latitude`/`longitude`)
   - Brochure viewer (if Linear API provides `brochureUrl`)

## 🔐 Security Note

**⚠️ IMPORTANT:** The debug endpoints reveal environment variable configuration. After verifying everything works:

1. Delete or comment out the debug endpoints:
   - `/api/debug/env/route.ts`
   - `/api/debug/linear-test/route.ts`

2. Or add authentication to protect them

## 📊 Verification Commands

After deployment, verify the fix:

```bash
# Check if proxy is working
curl "https://your-vercel-url.vercel.app/api/proxy/listings?lang=fi" | jq '. | length'
# Should return: 6 (or number of active listings)

# Check if property detail API works
curl "https://your-vercel-url.vercel.app/api/property/kauppiaankatu-8-10?lang=fi" | jq '{
  success,
  address: .data.streetAddress,
  hasFloorPlan: (.data.floorPlanUrl != null),
  hasBrochure: (.data.brochureUrl != null),
  hasCoords: (.data.coordinates != null or .data.latitude != null)
}'
```

## 🐛 If Still Not Working

1. Check Vercel deployment logs for:
   - `[ListingsCache] Environment:` log - should show `hasVercelUrl: true`
   - `❌ External API error: 401` - indicates auth issue
   - `TypeError: fetch failed` - indicates network issue

2. Verify the API key format:
   - Linear API expects: `LINEAR-API-KEY <your-actual-key>`
   - Store in Vercel as: `<your-actual-key>` (without prefix)
   - Code automatically adds the prefix

3. Test locally with correct env vars:
   ```bash
   export COMPANY_ID="your-company-id"
   export LINEAR_API_KEY="your-api-key-without-prefix"
   npm run dev
   # Visit http://localhost:3000/api/debug/linear-test
   ```

## 📞 Next Steps

Once you've:
1. ✅ Set environment variables in Vercel
2. ✅ Redeployed (or triggered new build)
3. ✅ Verified `/api/debug/linear-test` returns `status: 200`

Then the floor plan, map, and brochure sections will automatically populate with data from the Linear API (if that data exists in the API response).

---

**Current Status:** ⚠️ Awaiting Vercel environment variable configuration

