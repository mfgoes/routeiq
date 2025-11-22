# 🚀 RouteIQ Deployment - Quick Start

**Deploy your app for FREE in under 20 minutes!**

---

## What You'll Get

✅ **Frontend** hosted on Vercel (free forever for personal projects)
✅ **Backend API** hosted on Railway (free $5/month credit)
✅ **PostgreSQL Database** hosted on Railway (included)
✅ **HTTPS** enabled automatically
✅ **Custom subdomain** (e.g., `routeiq.vercel.app`)
✅ **Auto-deploy** on every git push to main

**Total cost: $0** (free tier is generous for personal projects)

---

## Quick Start (3 Steps)

### 1️⃣ Deploy Backend (Railway) - 10 minutes

1. Go to [railway.app](https://railway.app) → Sign in with GitHub
2. "New Project" → "Deploy from GitHub repo" → Select `routeiq`
3. Add PostgreSQL database (click "New" → "Database" → "PostgreSQL")
4. Configure backend service:
   - Root directory: `backend`
   - Add environment variables (see checklist below)
5. Generate domain & save the URL

### 2️⃣ Deploy Frontend (Vercel) - 5 minutes

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. "Add New Project" → Import `routeiq`
3. Configure:
   - Root directory: `frontend`
   - Add environment variable: `NEXT_PUBLIC_API_URL=<your-railway-backend-url>/api`
4. Click "Deploy" & save the URL

### 3️⃣ Connect Them - 2 minutes

1. Go back to Railway → Backend Variables
2. Update `CORS_ORIGIN` to your Vercel URL
3. Test your live app!

---

## Required Environment Variables

### Backend (Railway)
```bash
JWT_SECRET=<generate-with-generate-secrets.js>
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
NODE_ENV=production
PORT=3001
CORS_ORIGIN=<your-vercel-url>
DATABASE_URL=<auto-populated-by-railway>
```

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=<your-railway-url>/api
```

---

## Generate Secrets

Before deploying, run:
```bash
node generate-secrets.js
```

Copy the generated `JWT_SECRET` to Railway.

---

## Complete Guides

📖 **Full deployment guide**: Read [DEPLOYMENT.md](./DEPLOYMENT.md)
✅ **Step-by-step checklist**: Read [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## Files Created for Deployment

- `vercel.json` - Vercel configuration
- `backend/railway.json` - Railway configuration
- `backend/Procfile` - Process and release commands
- `backend/.nixpacks` - Build configuration
- `backend/.env.production.example` - Production env template
- `frontend/.env.production.example` - Production env template
- `generate-secrets.js` - Security secret generator

---

## Support

- 📚 Railway Docs: https://docs.railway.app
- 📚 Vercel Docs: https://vercel.com/docs
- 💬 Railway Discord: https://discord.gg/railway
- 💬 Vercel Discord: https://discord.gg/vercel

---

## What's Next?

After deployment:
1. ✅ Test authentication flow
2. ✅ Create sample workout/route/activity
3. ✅ Share your live URL!
4. 🎨 Add custom domain (optional, ~$10/year)
5. 📊 Monitor usage in Railway & Vercel dashboards

---

**Ready to deploy? Follow the full guide in [DEPLOYMENT.md](./DEPLOYMENT.md)!**
