# RouteIQ Deployment Summary

## Current Infrastructure

### Frontend
- **Platform**: Vercel
- **URL**: https://routeiq-nine.vercel.app
- **Framework**: Next.js 14
- **Build**: Automatic deployment from `main` branch
- **Root Directory**: `/frontend`

### Backend
- **Platform**: Vercel (Serverless Functions)
- **URL**: https://routeiq-backend.vercel.app
- **Framework**: Express.js on Node.js
- **Build**: Automatic deployment from `main` branch
- **Root Directory**: `/backend`
- **Function Timeout**: 10 seconds (free tier)
- **Memory**: 1024 MB

### Database
- **Platform**: Supabase
- **Type**: PostgreSQL
- **Region**: EU West 3 (Paris)
- **Connection Pooling**: Enabled (PgBouncer)

## Environment Variables

### Backend (Vercel Project: routeiq-backend)

Required environment variables in Vercel Dashboard:

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres.vkptmbsrtkjprbhptdku:[PASSWORD]@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.vkptmbsrtkjprbhptdku:[PASSWORD]@aws-1-eu-west-3.pooler.supabase.com:5432/postgres
JWT_SECRET=[64-char-hex-secret]
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://routeiq-nine.vercel.app
```

### Frontend (Vercel Project: routeiq-nine)

```
NEXT_PUBLIC_API_URL=https://routeiq-backend.vercel.app/api
```

## Deployment Process

### Backend Deployment

1. **Automatic**: Push to `main` branch triggers Vercel deployment
2. **Build Command**: `npm run vercel-build` (generates Prisma Client)
3. **Health Check**: `https://routeiq-backend.vercel.app/health`

### Frontend Deployment

1. **Automatic**: Push to `main` branch triggers Vercel deployment
2. **Build Command**: `npm run build` (Next.js build)
3. **Live URL**: `https://routeiq-nine.vercel.app`

## Database Migrations

Database migrations are run manually (not during Vercel deployment):

```bash
# From local machine or CI/CD
cd backend
npx prisma migrate deploy
```

**Important**: Never run migrations from Vercel serverless functions to avoid race conditions.

## Monitoring & Logs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Frontend Logs**: Vercel → routeiq-nine → Deployments → Functions
- **Backend Logs**: Vercel → routeiq-backend → Deployments → Functions
- **Database Logs**: Supabase Dashboard → Logs

## Rollback Strategy

If deployment issues occur:

1. **Instant Rollback**: Vercel Dashboard → Deployments → Select previous deployment → Promote to Production
2. **Environment Variable Issues**: Verify all variables are set correctly in Vercel Dashboard
3. **Database Issues**: Check Supabase connection status and verify connection strings

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Backend

```bash
cd backend
npm install
npx prisma generate
npm run dev
# Runs on http://localhost:3001
```

## Cost

- **Vercel Frontend**: Free tier
- **Vercel Backend**: Free tier
- **Supabase Database**: Free tier
- **Total**: $0/month

### Free Tier Limits

- Vercel: 100 GB bandwidth/month, 100 GB-hours compute
- Supabase: 500 MB database, 2 GB bandwidth/month

## Architecture Notes

- Backend runs as Vercel serverless function (not traditional server)
- Cold starts may occur after periods of inactivity (2-5 seconds)
- Database connection pooling (PgBouncer) handles serverless connection limits
- CORS configured to allow frontend domain only

## Migration History

- **2025-11**: Migrated backend from Koyeb to Vercel for unified platform management
- **2025-11**: Migrated from Railway to Koyeb + Supabase
- **Initial**: Railway (all-in-one platform)
