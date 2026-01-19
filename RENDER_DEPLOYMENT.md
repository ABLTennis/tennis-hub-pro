# Render Deployment Guide

## Fixed Issues

### 1. ✅ Added `start` Script
The deployment was failing because there was no `start` script. I've added:
```json
"start": "vite preview --host 0.0.0.0 --port ${PORT:-3000}"
```

### 2. ✅ Fixed CSS Import Order
Fixed the CSS import warning by moving the Google Fonts import before Tailwind directives.

### 3. ✅ Created render.yaml (Optional)
Created a Render configuration file for easier deployment.

---

## Render Configuration

### Environment Variables
Make sure these are set in Render Dashboard → Environment:

```
VITE_SUPABASE_URL=https://scqbhwnhiiztbdtzasrz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
NODE_ENV=production
```

### Build Settings
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`
- **Node Version:** 22.22.0 (or latest)
- **Plan:** Free (or upgrade for better performance)

---

## Deployment Steps

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Add start script for Render deployment"
   git push origin main
   ```

2. **In Render Dashboard:**
   - Go to your service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Or wait for automatic deployment from GitHub

3. **Set Environment Variables:**
   - Go to Environment tab
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Click "Save Changes"

4. **Deploy:**
   - Render will automatically redeploy when you save environment variables
   - Check the logs to ensure deployment succeeds

---

## Troubleshooting

### Issue: "Missing script: start"
✅ **Fixed:** Added `start` script to package.json

### Issue: CSS import warning
✅ **Fixed:** Moved @import before @tailwind directives

### Issue: Build succeeds but app doesn't work
- Check environment variables are set correctly
- Verify Supabase URL and key are correct
- Check Render logs for runtime errors

### Issue: 50+ second delays (Free Plan)
- This is normal for Render free plan (spins down with inactivity)
- Consider upgrading to paid plan for better performance
- First request after inactivity will be slow (cold start)

---

## Production Checklist

- [x] `start` script added
- [x] CSS import order fixed
- [ ] Environment variables set in Render
- [ ] Database migration run in Supabase
- [ ] Google OAuth configured
- [ ] Test deployment

---

**Next Steps:**
1. Push the changes to GitHub
2. Set environment variables in Render
3. Deploy!
