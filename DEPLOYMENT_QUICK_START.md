# RouteIQ Deployment Quick Start

This guide provides a streamlined deployment process for RouteIQ.

## Prerequisites

- GitHub account
- Railway account (free tier)
- Vercel account (free tier)

## Deployment Steps

### 1. Deploy Backend to Railway

1. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `routeiq` repository
   - Railway will auto-detect the configuration from `nixpacks.toml`

2. **Add PostgreSQL Database**
   - In Railway project, click "New" → "Database" → "PostgreSQL"
   - Railway auto-populates `DATABASE_URL` environment variable

3. **Set Environment Variables**

   Generate JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Add these variables in Railway (Backend service → Variables):
   ```
   JWT_SECRET=<your-generated-secret>
   JWT_EXPIRES_IN=7d
   BCRYPT_ROUNDS=12
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://your-app.vercel.app
   ```

   Note: Update `CORS_ORIGIN` after deploying frontend

4. **Generate Domain**
   - Click "Generate Domain" in Railway
   - Copy the URL (e.g., `https://routeiq-backend-production.up.railway.app`)

5. **Verify Backend**
   - Visit: `https://your-backend.railway.app/health`
   - Should return: `{"status":"ok","timestamp":"...","uptime":...}`

### 2. Deploy Frontend to Vercel

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your `routeiq` repository

2. **Configure Settings**
   - Framework: Next.js (auto-detected)
   - Root Directory: `frontend`
   - Build settings use defaults from `vercel.json`

3. **Add Environment Variable**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   ```
   Replace with your actual Railway backend URL

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Copy your Vercel URL

5. **Update Backend CORS**
   - Go back to Railway → Backend service → Variables
   - Update `CORS_ORIGIN` to your Vercel URL:
     ```
     CORS_ORIGIN=https://your-app.vercel.app
     ```
   - Railway will auto-redeploy

### 3. Test Your Deployment

1. Visit your Vercel URL
2. Register a new account
3. Login and create a workout
4. Verify data persists after page refresh

## Deployment Configuration Files

The following files configure deployment:

- `vercel.json` - Vercel build configuration
- `nixpacks.toml` - Railway build configuration
- `railway.json` - Railway deployment settings (optional)
- `backend/Procfile` - Process configuration

## Automatic Deployments

Both platforms auto-deploy on push to main:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

## Troubleshooting

### Backend Issues

**Database connection failed**
- Check Railway logs: Service → Deployments → View Logs
- Verify `DATABASE_URL` is set
- Ensure PostgreSQL service is running

**CORS errors**
- Verify `CORS_ORIGIN` exactly matches Vercel URL
- No trailing slashes
- Check browser console for specific errors

**Build failures**
- Check Railway logs for errors
- Verify `nixpacks.toml` configuration
- Ensure all dependencies in `package.json`

### Frontend Issues

**API calls failing**
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Must end with `/api`, no trailing slash
- Check Network tab in browser dev tools

**Build errors**
- Check Vercel build logs
- Verify `frontend` is set as root directory
- Check for TypeScript errors locally first

## Environment Variables Summary

### Railway (Backend)
```
DATABASE_URL=<auto-populated-by-railway>
JWT_SECRET=<generate-secure-random-32chars>
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-app.vercel.app
```

### Vercel (Frontend)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

## Monitoring

- **Railway**: Project Dashboard → Backend Service → Metrics
- **Vercel**: Project Dashboard → Analytics
- **Logs**: Available in both platforms' deployment views

## Free Tier Limits

### Railway
- $5 credit/month
- 500 hours usage
- 1GB RAM per service
- 100GB bandwidth

### Vercel
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- 100 GB-hours serverless execution

## Next Steps

1. Set up custom domain (optional)
2. Enable monitoring/alerting
3. Configure database backups
4. Add error tracking (Sentry, etc.)
5. Set up analytics

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Railway Discord: https://discord.gg/railway

---

**Your RouteIQ app should now be live!**
