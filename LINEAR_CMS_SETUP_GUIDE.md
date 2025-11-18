# 📋 LINEAR CMS FIELD SETUP GUIDE

## 🚨 REQUIRED FIELDS FOR FULL FUNCTIONALITY

This guide shows **exactly** what fields need to be filled in Linear CMS for all features to work on the website.

---

## 🗺️ **1. MAPS (Objekt på kartan)**

### Required Fields:
```
latitude (Localized field, Finnish)
  Example: 60.169856

longitude (Localized field, Finnish)  
  Example: 24.938379
```

**OR** use combined field:
```
mapCoordinates (Localized field, Finnish)
  Example: 60.169856,24.938379
```

### How to get coordinates:
1. Go to Google Maps
2. Right-click on property location
3. Click "Copy coordinates"
4. Paste into Linear: `60.169856, 24.938379`

### Which objects need this:
- **ALL OBJECTS** for map view to work

### What happens if missing:
- Map tab shows: "GPS-koordinater saknas för denna fastighet"
- Property won't appear in list map view

---

## 📄 **2. FLOOR PLANS (Planritning)**

### Required Fields:
```
floorPlanUrl (Localized field)
  Example: https://images.linear.fi/abc123-floorplan.pdf
```

**OR** upload as image with flag:
```
images[] 
  url: https://images.linear.fi/abc123-floorplan.jpg
  isFloorPlan: true
```

### Which objects need this:
- All apartments
- All houses with floor plans

### What happens if missing:
- Floor plan tab shows: "Planlösning ej tillgänglig"

---

## 📑 **3. BROCHURES (Broschyr)**

### Required Fields:
```
brochureUrl (Localized field)
  Example: https://images.linear.fi/abc123-brochure.pdf

propertyBrochureUrl (Alternative field name)
  Example: https://images.linear.fi/abc123-brochure.pdf
```

### Which objects need this:
- Premium properties
- Properties with detailed brochures

### What happens if missing:
- Brochure tab shows: "Ingen broschyr tillgänglig"

---

## 🌍 **4. GLOBAL LISTING (SIR International)**

### ⚠️ **FIELD MISSING IN LINEAR API**

### Required Fields (NEED TO ADD):
```
internationalUrl (New field)
  Example: https://www.sothebysrealty.com/eng/sales/detail/...

OR

sothebysGlobalUrl (Alternative name)
  Example: https://www.sothebysrealty.com/eng/sales/detail/...
```

### Action Required:
1. **Add field to Linear CMS schema**: `internationalUrl` (string)
2. **Update API to expose this field**
3. Fill in for internationally marketed properties

### What happens when added:
- Gold button appears: "VIEW GLOBAL LISTING"

---

## ⚡ **5. ENERGY CLASS (Energiklass)**

### Required Fields:
```
energyClass (Localized field OR nonLocalizedValues)
  Example FI: "C2018"
  Example SV: "C2018"
  Example EN: "C2018"
```

### Common Issues:
1. **Field exists but empty** → Shows "—"
2. **Wrong field name** → Check: `energyClass`, `energyRating`, `energyCertificate`
3. **Only in one language** → Code has fallback: locale → fi → nv

### Which objects need this:
- **ALL OBJECTS** (required by Finnish law)

### Specific Problem Objects (from Johan feedback):
- Mailatie 3
- Keselmäjärventie

**Action**: Check these in Linear CMS and ensure `energyClass` is filled!

---

## 🏗️ **6. CONSTRUCTION YEAR (Rakennusvuosi)**

### Required Fields (Multiple fallbacks):
```
yearBuilt (nonLocalizedValues OR localized)
  Example: 1985

completeYear (Alternative field)
  Example: 1985

Byggnadsår (startade) (Swedish field)
  Example: 1985

driftsättningsår (Finnish field)  
  Example: 1985
```

### Code Already Handles:
```typescript
yearBuilt: (() => {
  const year = Number(
    nv.yearBuilt ?? 
    nv.completeYear ?? 
    src.yearBuilt ?? 
    src.completeYear ?? 
    lget(src.completeYear, 'fi')
  );
  return (!isNaN(year) && year > 0) ? year : undefined;
})()
```

### Specific Problem Object (from Johan feedback):
- **Linnunpääntie**: Has "Byggnadsår (startade)" and "driftsättningsår" filled, but not `yearBuilt`

**Action**: Ensure `yearBuilt` or `completeYear` is filled in nonLocalizedValues!

---

## 🖼️ **7. IMAGES (Already Working!)**

### ✅ FIXED - Images work via proxy!

**No action needed** - Cloudflare issue resolved, and we have backup proxy in place.

---

## 📊 **FIELD PRIORITY MATRIX**

| Field | Priority | Objects Affected | Status |
|-------|----------|------------------|--------|
| `latitude/longitude` | 🔴 HIGH | ALL | Missing for most |
| `energyClass` | 🔴 HIGH | ALL | Partially missing |
| `yearBuilt` | 🟡 MEDIUM | ALL | Mostly OK, some use wrong field |
| `floorPlanUrl` | 🟡 MEDIUM | Apartments/Houses | Missing for some |
| `brochureUrl` | 🟢 LOW | Premium props | Missing for most |
| `internationalUrl` | ⚫ BLOCKED | International | **Field doesn't exist in API** |

---

## 🔧 **HOW TO FIX**

### Step 1: Add Missing API Field
```
Field: internationalUrl
Type: String
Location: LinearListing interface
```

### Step 2: Bulk Update Coordinates
For each property in Linear:
1. Find address on Google Maps
2. Right-click → Copy coordinates
3. Paste into `latitude` and `longitude` fields

### Step 3: Check Problem Objects
Run this query in Linear:
```graphql
{
  listings {
    address
    energyClass  # Check if empty
    yearBuilt    # Check if empty
    latitude     # Check if empty
    longitude    # Check if empty
  }
}
```

### Step 4: Fill Missing Energy Class
For Mailatie & Keselmäjärventie specifically:
- Check physical energy certificate
- Add to Linear: `energyClass: "C2018"` (or correct value)

---

## 🎯 **QUICK CHECKLIST FOR NEW PROPERTIES**

When adding a new property to Linear, ensure:

- [ ] `latitude` + `longitude` filled (for maps)
- [ ] `energyClass` filled (required by law)
- [ ] `yearBuilt` or `completeYear` filled
- [ ] `floorPlanUrl` added (if available)
- [ ] `brochureUrl` added (if available)
- [ ] Images uploaded with correct flags

---

## 📞 **NEXT STEPS**

1. ✅ **Code is ready** - No code changes needed
2. ⚠️ **Add `internationalUrl` field to Linear API**
3. ⚠️ **Bulk-fill coordinates for all properties**
4. ⚠️ **Fix Mailatie & Keselmäjärventie energy class**
5. ✅ **Test everything works**

---

**Questions? The code is waiting for data - once filled, everything will work automatically! 🚀**

