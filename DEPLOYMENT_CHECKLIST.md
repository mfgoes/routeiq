# Pre-Deployment Checklist

Use this checklist before deploying to production.

## 1. Generate Secure Secrets

```bash
node generate-secrets.js
```

Save the generated `JWT_SECRET` - you'll need it for Railway.

---

## 2. Backend Deployment (Railway)

### Account Setup
- [ ] Create Railway account at [railway.app](https://railway.app)
- [ ] Connect GitHub account

### Project Setup
- [ ] Create new project from GitHub repo
- [ ] Add PostgreSQL database
- [ ] Configure root directory: `backend`

### Environment Variables
Copy these to Railway → Backend Service → Variables:

```bash
JWT_SECRET=<paste-generated-secret-here>
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-app.vercel.app  # Update after frontend deploy
```

Railway auto-adds:
- [x] `DATABASE_URL` (from PostgreSQL service)

### Service Configuration
- [ ] Root Directory: `backend`
- [ ] Start Command: `node src/index.js`
- [ ] Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`

### Deploy & Verify
- [ ] Click "Deploy"
- [ ] Generate domain (e.g., `routeiq-production.railway.app`)
- [ ] Test health endpoint: `https://your-backend.railway.app/health`
- [ ] Save backend URL: `_______________________________________`

---

## 3. Frontend Deployment (Vercel)

### Account Setup
- [ ] Create Vercel account at [vercel.com](https://vercel.com)
- [ ] Connect GitHub account

### Project Setup
- [ ] Import `routeiq` repository
- [ ] Framework preset: Next.js (auto-detected)
- [ ] Root directory: `frontend`

### Environment Variables
Add to Vercel → Project Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

Replace `your-backend.railway.app` with your actual Railway URL from step 2.

### Deploy & Verify
- [ ] Click "Deploy"
- [ ] Wait for build to complete (~2-3 minutes)
- [ ] Test frontend: `https://your-app.vercel.app`
- [ ] Save frontend URL: `_______________________________________`

---

## 4. Update Backend CORS

Now that you have the frontend URL:
- [ ] Go back to Railway → Backend Service → Variables
- [ ] Update `CORS_ORIGIN` to your Vercel URL (exact match, no trailing slash)
- [ ] Wait for automatic redeploy (~1-2 minutes)

---

## 5. End-to-End Testing

Test the following flows:

### Authentication
- [ ] Register new account
- [ ] Login with new account
- [ ] Verify JWT token works
- [ ] Logout

### Core Features
- [ ] Create a route
- [ ] View routes list
- [ ] Create an activity
- [ ] View activities list
- [ ] Create a workout
- [ ] View workouts list

### Data Persistence
- [ ] Refresh page - data should persist
- [ ] Close browser and reopen - should stay logged in (until token expires)

---

## 6. Security Verification

- [ ] Verify `JWT_SECRET` is NOT the example value
- [ ] Verify `CORS_ORIGIN` matches exact frontend URL
- [ ] Verify no `.env` files committed to git: `git log --all --full-history -- "*.env"`
- [ ] Verify production database has no test/seed data (or reseed if needed)
- [ ] Enable 2FA on Railway account
- [ ] Enable 2FA on Vercel account

---

## 7. Monitoring Setup

### Railway
- [ ] Check "Metrics" tab for CPU/Memory usage
- [ ] Review deployment logs for errors
- [ ] Set up usage alerts (optional)

### Vercel
- [ ] Check "Analytics" tab for traffic
- [ ] Review function logs
- [ ] Monitor build times

---

## 8. Documentation

Update your project README with:
- [ ] Live demo URL
- [ ] API documentation URL (if applicable)
- [ ] Deployment status badges (optional)

---

## 9. Post-Deployment

### Save Important URLs
- Frontend: `_______________________________________`
- Backend API: `_______________________________________`
- Railway Dashboard: `_______________________________________`
- Vercel Dashboard: `_______________________________________`

### Set Up Backups (Recommended)
- [ ] Export database schema for backup
- [ ] Document database restoration process
- [ ] Consider Railway Pro ($5/mo) for automated backups

### Ongoing Maintenance
- [ ] Monitor free tier usage on Railway and Vercel
- [ ] Set calendar reminder to check logs weekly
- [ ] Plan for scaling if traffic increases

---

## Common Issues

**Frontend can't connect to backend**
→ Check CORS_ORIGIN matches exactly, including https://

**Database errors on Railway**
→ Check migrations ran: View logs for "prisma migrate deploy"

**Environment variables not working**
→ Vercel: Must start with NEXT_PUBLIC_ for client-side
→ Railway: Redeploy after changing variables

**Build fails**
→ Check build logs in dashboard
→ Verify root directory is set correctly

---

## Need Help?

- Read full guide: `DEPLOYMENT.md`
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://discord.gg/vercel

---

✅ **Once all items are checked, your app is live and secure!**
