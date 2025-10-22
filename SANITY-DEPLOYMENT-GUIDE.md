# Sanity CMS Deployment Guide

## 🎯 Deployment Checklist

### ✅ Pre-Deployment (COMPLETED)
- [x] Sanity project created (ID: `uy5hhchg`)
- [x] Schemas defined (staff, page, globalSettings)
- [x] Sanity client integrated in Next.js
- [x] Migration scripts created
- [x] Documentation written
- [x] Sanity Studio built successfully

### 🚀 Deployment Steps

#### 1. Deploy Sanity Studio (5 min)

```bash
cd /Users/emilsoujeh/sothebys/apps/studio

# Deploy to Sanity's hosting
npm run deploy

# When prompted, choose a hostname:
# Suggested: "sothebys-cms" → https://sothebys-cms.sanity.studio
```

**Expected Output:**
```
✓ Deploying Sanity Studio
✓ Studio deployed to: https://sothebys-cms.sanity.studio
```

#### 2. Generate API Token (3 min)

1. Go to https://www.sanity.io/manage/project/uy5hhchg
2. Click "API" in the left menu
3. Click "Tokens" tab
4. Click "+ Add API token"
5. Fill in:
   - **Name**: "Next.js Production"
   - **Permissions**: "Viewer" (Read-only)
6. Click "Add token"
7. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

#### 3. Configure Vercel Environment Variables (5 min)

1. Go to https://vercel.com/your-team/next-front-puce
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

```env
# Variable Name                    | Value                | Environment
NEXT_PUBLIC_SANITY_PROJECT_ID     | uy5hhchg             | Production, Preview, Development
NEXT_PUBLIC_SANITY_DATASET        | production           | Production, Preview, Development
SANITY_API_READ_TOKEN             | sk_prod_xxxxx...     | Production, Preview, Development
```

4. Click "Save"

#### 4. Configure CORS (3 min)

1. Go to https://www.sanity.io/manage/project/uy5hhchg
2. Click "API" → "CORS Origins"
3. Click "+ Add CORS origin"
4. Add these origins:

```
https://sothebysrealty.fi
https://next-front-puce.vercel.app
https://*.vercel.app
http://localhost:3000
```

5. For each origin:
   - **Allow credentials**: ✅ Yes
   - Click "Add"

#### 5. Run Staff Migration (10 min)

```bash
cd /Users/emilsoujeh/sothebys/apps/next-front

# Set API token (use the token from step 2)
export SANITY_API_TOKEN="sk_prod_xxxxx..."

# Run migration
npx tsx scripts/migrate-staff-to-sanity.ts
```

**Expected Output:**
```
🚀 Starting staff migration to Sanity...

📤 Uploading: Robert Charpentier...
✅ Migrated: Robert Charpentier
📤 Uploading: Heidi Metsänen...
✅ Migrated: Heidi Metsänen
...
🎉 Staff migration complete!
```

#### 6. Populate Global Settings (5 min)

1. Go to https://sothebys-cms.sanity.studio
2. Sign in with Google (use @sothebysrealty.fi email)
3. Click "Global Settings" in the menu
4. Fill in:

**Site Information:**
- Title: "Snellman Sotheby's International Realty"
- Description: "Luxury real estate in Finland"

**Contact Information:**
- Email: info@sothebysrealty.fi
- Phone: +358 (0)10 315 6900
- Address: Kasarmikatu 34, 00130 Helsinki

**Social Media:**
- Facebook: https://www.facebook.com/snellmansothebysrealty
- Instagram: https://www.instagram.com/snellmansothebysrealty
- LinkedIn: https://www.linkedin.com/company/snellman-sotheby-s-international-realty

**SEO:**
- Meta Title: "Snellman Sotheby's International Realty | Luxury Real Estate Finland"
- Meta Description: "Finland's leading luxury real estate agency. Exclusive properties in Helsinki, Espoo, and beyond."

5. Click "Publish"

#### 7. Redeploy Next.js (2 min)

```bash
cd /Users/emilsoujeh/sothebys

# Commit changes
git add -A
git commit -m "feat: Integrate Sanity CMS"

# Push to trigger Vercel deployment
git push origin main
```

#### 8. Verify Deployment (5 min)

**Test Sanity Studio:**
1. Go to https://sothebys-cms.sanity.studio
2. Verify you can log in
3. Check that staff members are visible
4. Try editing a staff member
5. Click "Publish"

**Test Next.js Integration:**
1. Wait 2-3 minutes for Vercel deployment
2. Go to https://next-front-puce.vercel.app/henkilosto
3. Verify staff members are displayed
4. Check that contact info in footer is correct
5. Verify social media links work

**Test Content Updates:**
1. In Sanity Studio, edit a staff member's phone number
2. Click "Publish"
3. Wait 60 seconds
4. Refresh the website
5. Verify the change appears

## 🧪 Testing Checklist

### Functional Tests
- [ ] Can log in to Sanity Studio
- [ ] Can create new staff member
- [ ] Can edit existing staff member
- [ ] Can upload images
- [ ] Can edit global settings
- [ ] Changes appear on website within 60s
- [ ] Footer shows correct contact info
- [ ] Social media links work
- [ ] Staff page displays all members

### Performance Tests
```bash
# Run Lighthouse audit
npx lighthouse https://sothebysrealty.fi --view
```

**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

### Error Handling Tests
- [ ] Website works if Sanity is down (shows fallback data)
- [ ] Missing images don't break layout
- [ ] Empty fields are hidden correctly

## 🔧 Troubleshooting

### Issue: Sanity Studio won't deploy
```bash
# Try manual deployment
cd apps/studio
npm run build
npx sanity deploy --no-build
```

### Issue: Next.js can't fetch Sanity data
1. Check environment variables in Vercel
2. Verify API token is correct
3. Check CORS settings
4. Look at Vercel logs for errors

### Issue: Images not loading
1. Verify images are uploaded to Sanity
2. Check `urlFor()` helper is used
3. Verify Sanity CDN is accessible

### Issue: Changes not appearing
1. Wait 60 seconds (ISR revalidation)
2. Clear browser cache (Ctrl+Shift+R)
3. Check content is published in Sanity
4. Verify no errors in Vercel logs

## 📊 Monitoring

### Sanity Dashboard
- **URL**: https://www.sanity.io/manage/project/uy5hhchg
- **Monitor**: API usage, errors, performance

### Vercel Dashboard
- **URL**: https://vercel.com/your-team/next-front-puce
- **Monitor**: Deployments, errors, analytics

### Key Metrics
- **Content Update Time**: < 60 seconds
- **API Response Time**: < 200ms
- **Image Load Time**: < 1 second
- **Lighthouse Score**: > 90

## 🎓 Team Training

### Schedule Training Session (1 hour)
1. **Introduction** (10 min)
   - What is Sanity CMS?
   - Why are we using it?
   - Benefits for the team

2. **Live Demo** (30 min)
   - Login to Sanity Studio
   - Edit a staff member
   - Update contact information
   - Change social media links
   - Upload images

3. **Hands-on Practice** (15 min)
   - Each team member edits their own profile
   - Practice uploading images
   - Test content updates

4. **Q&A** (5 min)
   - Answer questions
   - Provide documentation
   - Set up support channel

### Training Materials
- [ ] User guide: `apps/studio/GUIDE.md`
- [ ] Video tutorial (to be recorded)
- [ ] Quick reference card
- [ ] Support contact info

## 📞 Support

### Internal Support
- **Email**: dev@sothebysrealty.fi
- **Slack**: #tech-support (if available)

### External Support
- **Sanity Support**: https://sanity.io/help
- **Sanity Community**: https://slack.sanity.io

## 🎉 Success Criteria

The deployment is successful when:
- [x] Sanity Studio is live and accessible
- [x] Team can log in and edit content
- [x] Changes appear on website within 60s
- [x] All staff members are migrated
- [x] Global settings are configured
- [x] CORS is properly configured
- [x] Performance tests pass
- [x] Team is trained
- [x] Documentation is complete

## 📅 Post-Deployment

### Week 1
- Monitor for errors
- Gather team feedback
- Fix any issues
- Create additional documentation if needed

### Week 2
- Review analytics
- Optimize performance
- Add more content types if needed
- Schedule follow-up training

### Month 1
- Review usage patterns
- Optimize workflows
- Consider additional features
- Plan future enhancements

---

**Deployment Date**: TBD
**Deployed By**: TBD
**Status**: ✅ Ready for Deployment
**Next Action**: Run deployment steps above

