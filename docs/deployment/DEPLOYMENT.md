# RouteIQ Deployment Guide

Complete guide to deploy RouteIQ for FREE using Vercel (frontend) and Railway (backend + database).

---

## Overview

- **Frontend**: Next.js → Vercel (Free)
- **Backend**: Express API → Railway (Free)
- **Database**: PostgreSQL → Railway (Free)
- **Cost**: $0/month to start

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Login with GitHub"
3. Authorize Railway to access your repositories

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `routeiq` repository
4. Railway will detect your backend automatically

### Step 3: Add PostgreSQL Database
1. In your Railway project dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a database and auto-populate the `DATABASE_URL`

### Step 4: Configure Environment Variables
1. Click on your backend service in Railway
2. Go to "Variables" tab
3. Add the following variables (Railway auto-adds `DATABASE_URL`):

```bash
# Generate a secure JWT secret first!
# Run this locally: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

JWT_SECRET=your_generated_secret_here_min_32_chars
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-will-go-here.vercel.app
```

**Important**: Don't set `CORS_ORIGIN` yet - you'll update this after deploying the frontend!

### Step 5: Configure Service Settings
1. In Railway, click on your backend service
2. Go to "Settings" tab
3. Set **Root Directory**: `backend`
4. Set **Start Command**: `node src/index.js`
5. Set **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`

### Step 6: Deploy
1. Railway will automatically deploy
2. Once deployed, click "Generate Domain" to get your public URL
3. Copy this URL (e.g., `https://routeiq-backend.railway.app`)

### Step 7: Verify Backend
Visit `https://your-backend.railway.app/health` - you should see:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 123
}
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel

### Step 2: Import Project
1. Click "Add New" → "Project"
2. Import your `routeiq` repository
3. Vercel will auto-detect Next.js

### Step 3: Configure Build Settings
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### Step 4: Add Environment Variables
Before deploying, click "Environment Variables" and add:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

Replace `your-backend.railway.app` with your actual Railway backend URL from Part 1, Step 6.

### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Vercel will give you a URL like `https://routeiq.vercel.app`

### Step 6: Update Backend CORS
Now that you have your frontend URL, go back to Railway:
1. Go to your backend service → "Variables"
2. Update `CORS_ORIGIN` to your Vercel URL:
   ```bash
   CORS_ORIGIN=https://your-app.vercel.app
   ```
3. Railway will automatically redeploy with the new CORS settings

---

## Part 3: Test Your Deployment

### 1. Test Backend API
Visit your Railway backend URL + `/health`:
```
https://your-backend.railway.app/health
```

### 2. Test Frontend
Visit your Vercel URL:
```
https://your-app.vercel.app
```

### 3. Test Full Flow
1. Try registering a new account
2. Login
3. Create a workout or activity
4. Verify data is persisted (refresh the page)

---

## Troubleshooting

### Backend Issues

**Error: Database connection failed**
- Check that `DATABASE_URL` is set in Railway
- Verify PostgreSQL service is running
- Check Railway logs for details

**Error: CORS issues**
- Verify `CORS_ORIGIN` matches your exact Vercel URL
- No trailing slash in CORS_ORIGIN
- Check browser console for specific CORS errors

**Error: 500 Internal Server Error**
- Check Railway logs: Service → "Deployments" → Click latest → "View Logs"
- Common issues: missing environment variables, database migration errors

**Database migrations not running**
- In Railway, go to backend service → "Settings"
- Update Build Command to: `npm install && npx prisma generate && npx prisma migrate deploy`
- Redeploy

### Frontend Issues

**Error: API calls failing**
- Verify `NEXT_PUBLIC_API_URL` is correct in Vercel
- Check that it ends with `/api`
- No trailing slash after `/api`

**Error: Environment variable not found**
- Environment variables in Next.js MUST start with `NEXT_PUBLIC_` to be accessible in browser
- Redeploy after adding variables

**Build fails**
- Check Vercel build logs
- Verify `frontend` is set as root directory
- Check for TypeScript errors

---

## Viewing Logs

### Railway Logs
1. Go to your project dashboard
2. Click on backend service
3. Click "Deployments"
4. Click latest deployment
5. View real-time logs

### Vercel Logs
1. Go to your project dashboard
2. Click "Deployments"
3. Click on latest deployment
4. Click "Function Logs" or "Build Logs"

---

## Updating Your App

### Deploy Changes to Backend
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Railway automatically redeploys on push to main!

### Deploy Changes to Frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel automatically redeploys on push to main!

---

## Free Tier Limits

### Railway Free Tier
- $5 credit per month (enough for small projects)
- 500 hours of usage
- 1GB RAM per service
- 100GB bandwidth

### Vercel Free Tier
- 100GB bandwidth per month
- Unlimited deployments
- Automatic HTTPS
- 100 GB-hours serverless function execution

**For personal projects and development, these limits are generous!**

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Buy domain from Namecheap, Google Domains, etc. (~$10-15/year)
2. In Vercel: Project → "Settings" → "Domains"
3. Add your domain and follow DNS setup instructions

### Add Custom Domain to Railway
1. In Railway: Service → "Settings" → "Domains"
2. Click "Add Custom Domain"
3. Add your domain and configure DNS

---

## Environment Management

### Development
- Use `.env` files locally
- Never commit `.env` files to git

### Production
- Use Railway dashboard for backend env vars
- Use Vercel dashboard for frontend env vars
- Keep production secrets secure and different from dev

---

## Security Checklist

Before going live:
- [ ] Change `JWT_SECRET` to a secure random string (32+ characters)
- [ ] Set `BCRYPT_ROUNDS` to 12 or higher in production
- [ ] Update `CORS_ORIGIN` to your exact Vercel domain
- [ ] Never commit `.env` files to GitHub
- [ ] Review and remove any test/seed data from production database
- [ ] Enable 2FA on Railway and Vercel accounts
- [ ] Set up database backups in Railway (Settings → Backups)

---

## Database Management

### Access Production Database
Railway provides a PostgreSQL client:
1. Go to PostgreSQL service in Railway
2. Click "Data" tab to view/query database
3. Or click "Connect" to get connection string for local tools

### Run Migrations
Migrations run automatically on deploy, but you can manually run:
1. Go to backend service in Railway
2. Click "Deploy" → "Redeploy"
3. Or use Railway CLI locally

### Backup Database
Railway Pro ($5/month) includes automated backups. For free tier:
1. Use Railway's "Data" export feature
2. Or run `pg_dump` locally with production DATABASE_URL

---

## Next Steps

1. Monitor your Railway and Vercel dashboards for usage
2. Set up monitoring/alerting (Railway has built-in metrics)
3. Consider adding Redis for caching (Railway has Redis add-on)
4. Set up error tracking (Sentry, LogRocket, etc.)
5. Configure analytics (Vercel Analytics, Google Analytics)

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://discord.gg/vercel

---

## Quick Reference URLs

After deployment, save these URLs:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app/api`
- **Backend Health**: `https://your-backend.railway.app/health`
- **Railway Dashboard**: `https://railway.app/project/[your-project-id]`
- **Vercel Dashboard**: `https://vercel.com/[your-username]/routeiq`

---

**You're all set! Your app is now live and accessible to anyone with the URL.**
