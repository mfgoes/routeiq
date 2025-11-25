# Koyeb + Supabase Quick Start Guide

This is a streamlined guide for deploying RouteIQ backend to Koyeb with Supabase database.

**Time:** 15-20 minutes
**Cost:** $0 (permanent free tiers)

---

## Part 1: Setup Supabase Database (5 minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in with GitHub
2. Click "New Project"
3. Fill in:
   - Project name: `routeiq`
   - Database password: Generate strong password (SAVE THIS!)
   - Region: US East (N. Virginia) or closest to you
   - Plan: Free
4. Click "Create new project" (wait 2-3 minutes)

### Step 2: Get Connection Strings

1. Once ready, go to Project Settings (gear icon) → Database
2. Scroll to "Connection string" section
3. Copy **Transaction Pooling** string:
   ```
   Mode: Transaction
   postgresql://postgres.[ref]:[password]@...pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
4. **Save this connection string** - you'll need it for Koyeb

### Step 3: Initialize Database

Since you're starting fresh, you'll run migrations after deploying to Koyeb. The migrations will create all tables automatically.

---

## Part 2: Deploy Backend to Koyeb (10 minutes)

### Step 1: Create Koyeb Account

1. Go to https://koyeb.com
2. Sign up with GitHub
3. Authorize Koyeb to access your repositories

### Step 2: Create Web Service

1. Click "Create Web Service"
2. Select "GitHub" as deployment method
3. Choose your `routeiq` repository
4. **Important:** Set "Root directory" to `backend`

### Step 3: Configure Build

In the "Builder" section:
- **Build command:** `npm install && npx prisma generate`
- **Run command:** `npm run deploy`
- Keep other settings as default

### Step 4: Configure Environment Variables

Add these environment variables:

```bash
DATABASE_URL=<your-supabase-transaction-pooling-connection-string>
JWT_SECRET=<generate-random-32-char-string>
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=8000
CORS_ORIGIN=https://routeiq-nine.vercel.app
BCRYPT_ROUNDS=12
```

**How to generate JWT_SECRET:**
```bash
# In your terminal:
openssl rand -base64 32
# Or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Configure Instance & Health Check

**Instance settings:**
- Instance type: Nano (512 MB RAM) - Free tier
- Region: Washington (was) - matches Supabase US East

**Health check:**
- Path: `/health`
- Port: `8000`
- Grace period: 30 seconds

### Step 6: Deploy!

1. Click "Deploy"
2. Wait 2-3 minutes for deployment
3. Check logs for "Server is running on port 8000"
4. Your backend URL will be: `https://[your-app-name].koyeb.app`

### Step 7: Verify Deployment

Test the health endpoint:
```bash
curl https://[your-app-name].koyeb.app/health
# Should return: {"status":"ok","timestamp":"2024-XX-XX..."}
```

---

## Part 3: Update Frontend (2 minutes)

### Update Vercel Environment Variable

1. Go to Vercel dashboard: https://vercel.com/dashboard
2. Open your `routeiq` project (currently at https://routeiq-nine.vercel.app)
3. Go to Settings → Environment Variables
4. Find `NEXT_PUBLIC_API_URL`
5. Update value to: `https://[your-koyeb-app-name].koyeb.app`
6. Apply to: Production, Preview, Development
7. Click "Redeploy" to apply changes

### Verify Frontend Works

1. Visit https://routeiq-nine.vercel.app
2. Open browser console (F12)
3. Try signing up or logging in
4. Check Network tab - API calls should go to your Koyeb URL
5. Should see no CORS errors

---

## Part 4: Seed Database (Optional, 1 minute)

If you want the pre-loaded exercises:

1. Clone your repo locally (if not already)
2. Create `backend/.env` file:
   ```bash
   DATABASE_URL="<your-supabase-direct-connection-string-port-5432>"
   ```
   **Note:** Use the DIRECT connection (port 5432, not pooling) for seed script
3. Run seed:
   ```bash
   cd backend
   npm install
   npx prisma db seed
   ```

This adds 22 exercises to your database.

---

## Testing Checklist

Test these features to ensure everything works:

- [ ] **Health check:** `curl https://[app].koyeb.app/health`
- [ ] **Sign up:** Create new account
- [ ] **Login:** Use credentials to login
- [ ] **Dashboard:** View dashboard (should be empty initially)
- [ ] **Create route:** Try creating a route (map may not work yet)
- [ ] **Log activity:** Create a running activity
- [ ] **View activities:** See activities list
- [ ] **Check console:** No errors in browser console

---

## Auto-Deploy Setup

Koyeb automatically redeploys when you push to your main branch:

1. Make any code change
2. Commit and push to GitHub
3. Check Koyeb dashboard - new deployment starts automatically
4. Takes 2-3 minutes to complete

---

## Monitoring & Limits

### Supabase Free Tier
- **Database size:** 500 MB (plenty for personal use)
- **Active connections:** 60 (pooling handles this)
- **Egress:** 2 GB/month

**Check usage:**
- Supabase Dashboard → Usage tab

### Koyeb Free Tier
- **Instances:** 1 web service (512 MB RAM)
- **Build minutes:** 1000/month
- **Bandwidth:** 100 GB/month
- **Auto-scales to 0:** No traffic = no charges

**Check usage:**
- Koyeb Dashboard → Billing → Usage

### Vercel Free Tier (unchanged)
- **Bandwidth:** 100 GB/month
- **Deployments:** Unlimited

---

## Troubleshooting

### "Connection timeout" error in Koyeb logs
- Verify DATABASE_URL is correct
- Ensure you're using the **Transaction Pooling** connection string (port 6543 with `?pgbouncer=true`)

### "Health check failed" in Koyeb
- Check logs for errors during startup
- Verify migrations ran successfully
- Wait 30 seconds and check again (startup takes time)

### "CORS error" in browser console
- Verify `CORS_ORIGIN` in Koyeb matches your Vercel URL exactly
- Check it's `https://routeiq-nine.vercel.app` (no trailing slash)
- Redeploy backend after fixing

### "502 Bad Gateway" when accessing API
- Backend is likely starting up (wait 30 seconds)
- Check Koyeb logs for startup errors
- Verify instance is running in dashboard

### Can't connect to database locally
- Use the **Direct connection** string (port 5432) for local development
- Use the **Transaction Pooling** string (port 6543) for Koyeb deployment
- These are different connection strings!

---

## Environment Variables Reference

### Backend (Koyeb)
```bash
# Required
DATABASE_URL=postgresql://postgres.[ref]:[password]@...6543/postgres?pgbouncer=true
JWT_SECRET=<32-char-random-string>
NODE_ENV=production
PORT=8000
CORS_ORIGIN=https://routeiq-nine.vercel.app

# Recommended
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Optional (Phase 2+)
STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
OPENWEATHER_API_KEY=
```

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://[your-app-name].koyeb.app
```

---

## Next Steps

After successful deployment:

1. **Test thoroughly:** Use the testing checklist above
2. **Monitor for 24 hours:** Check Koyeb and Supabase dashboards
3. **Set up alerts:** Enable email notifications in Supabase
4. **Backup:** Supabase has daily backups (7-day retention on free tier)
5. **Documentation:** Update your README with new deployment info

---

## Cost Comparison

| Platform | What | Cost |
|----------|------|------|
| Supabase | PostgreSQL database (500 MB) | $0/month |
| Koyeb | Backend API (512 MB RAM) | $0/month |
| Vercel | Frontend hosting | $0/month |
| **Total** | | **$0/month** |

All permanent free tiers - no trial limitations! 🎉

---

## Getting Help

- **Supabase Docs:** https://supabase.com/docs
- **Koyeb Docs:** https://www.koyeb.com/docs
- **Koyeb Discord:** https://www.koyeb.com/community

---

**Your URLs:**
- Frontend: https://routeiq-nine.vercel.app
- Backend: https://[your-app-name].koyeb.app (you'll get this after deployment)
- Supabase Dashboard: https://app.supabase.com

Good luck! 🚀
