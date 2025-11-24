# Migration Guide: Railway → Supabase + Koyeb

This guide walks you through migrating from Railway to Supabase (database) + Koyeb (backend) while keeping your frontend on Vercel.

**Estimated Time:** 30-45 minutes
**Difficulty:** Easy
**Downtime:** None (can run both environments in parallel during migration)

---

## Prerequisites

- [ ] PostgreSQL client tools installed (`psql`, `pg_dump`)
  - macOS: `brew install postgresql`
  - Ubuntu/Debian: `sudo apt-get install postgresql-client`
- [ ] Access to Railway dashboard (to get DATABASE_URL)
- [ ] Supabase account (free): https://supabase.com
- [ ] Koyeb account (free): https://koyeb.com
- [ ] GitHub repository access

---

## Phase 1: Database Migration to Supabase

### Step 1: Export Railway Database

1. **Get your Railway DATABASE_URL:**
   - Go to Railway dashboard: https://railway.app/dashboard
   - Open your project
   - Click on your PostgreSQL service
   - Go to "Variables" tab
   - Copy the `DATABASE_URL` value

2. **Export the database:**
   ```bash
   # Replace YOUR_RAILWAY_DATABASE_URL with your actual URL
   pg_dump "YOUR_RAILWAY_DATABASE_URL" > railway-backup-$(date +%Y%m%d-%H%M%S).sql
   ```

3. **Verify the export:**
   ```bash
   ls -lh railway-backup*.sql
   # Should show a file with reasonable size (not 0 bytes)

   head -n 20 railway-backup*.sql
   # Should show SQL commands
   ```

### Step 2: Create Supabase Project

1. **Sign up/Login to Supabase:**
   - Go to https://supabase.com
   - Sign in with GitHub

2. **Create new project:**
   - Click "New Project"
   - Choose organization (or create one)
   - Project name: `routeiq` (or your preference)
   - Database password: Generate a strong password (SAVE THIS!)
   - Region: Choose closest to your users
   - Pricing plan: Free
   - Click "Create new project"
   - Wait 2-3 minutes for provisioning

3. **Get connection strings:**
   - Once project is ready, go to "Project Settings" (gear icon)
   - Click "Database" in the left sidebar
   - You'll see two important connection strings:
     - **Connection string** (Direct connection)
     - **Connection pooling** (Supavisor)
   - Copy both and save them securely

   **Example formats:**
   ```
   Direct: postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres

   Pooling: postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Step 3: Import Data to Supabase

1. **Import the database:**
   ```bash
   # Use the DIRECT connection string (port 5432, not pooling)
   psql "YOUR_SUPABASE_DIRECT_CONNECTION_STRING" < railway-backup-YYYYMMDD-HHMMSS.sql
   ```

2. **Verify the import:**
   ```bash
   # Connect to Supabase database
   psql "YOUR_SUPABASE_DIRECT_CONNECTION_STRING"

   # Check tables exist
   \dt

   # Check record counts
   SELECT 'users' as table_name, COUNT(*) FROM users
   UNION ALL
   SELECT 'exercises', COUNT(*) FROM exercises
   UNION ALL
   SELECT 'routes', COUNT(*) FROM routes;

   # Exit
   \q
   ```

3. **Alternative: Use Supabase SQL Editor:**
   - In Supabase dashboard, go to "SQL Editor"
   - Open your backup SQL file in a text editor
   - Copy and paste the contents into the SQL Editor
   - Run the query
   - Check "Table Editor" to verify data

---

## Phase 2: Update Backend Configuration

### Step 4: Update Environment Variables

1. **Update `.env.example` files:**

   The following files have been updated to include Supabase connection strings:
   - `backend/.env.example`
   - `backend/.env.production.example`

   **Note:** Use the **Transaction Pooling** connection string for production deployment on Koyeb.

2. **Test locally with Supabase:**
   ```bash
   cd backend

   # Create .env file with Supabase connection
   cp .env.example .env

   # Edit .env and add your Supabase DIRECT connection string
   # DATABASE_URL="postgresql://postgres.[project-ref]:[password]@...pooler.supabase.com:5432/postgres"

   # Run migrations (should show "already up to date")
   npx prisma migrate deploy

   # Generate Prisma client
   npx prisma generate

   # Test the connection
   npm run dev
   ```

3. **Verify backend works:**
   ```bash
   # In another terminal
   curl http://localhost:3001/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

### Step 5: Remove Railway-Specific Files

The following Railway-specific files have been removed:
- ✓ `railway.json` (root)
- ✓ `backend/railway.json`
- ✓ `nixpacks.toml` (root)
- ✓ `backend/nixpacks.toml`
- ✓ `backend/Procfile`

---

## Phase 3: Deploy to Koyeb

### Step 6: Create Koyeb Configuration

A `koyeb.yaml` file has been created in the backend directory with the following configuration:
- Build: npm install && npx prisma generate
- Start: npm run deploy (runs migrations + starts server)
- Port: 3001
- Health check: /health endpoint
- Region: Washington, DC (US East)

### Step 7: Deploy Backend to Koyeb

1. **Sign up/Login to Koyeb:**
   - Go to https://koyeb.com
   - Sign up with GitHub

2. **Create new Web Service:**
   - Click "Create Web Service"
   - Choose "GitHub" as source
   - Authorize Koyeb to access your repository
   - Select your `routeiq` repository
   - **Important:** Set "Root directory" to `backend`

3. **Configure build:**
   - Build method: Dockerfile (if you have one) or Buildpack
   - Build command: `npm install && npx prisma generate`
   - Run command: `npm run deploy`

4. **Configure environment variables:**
   Add the following environment variables in Koyeb:

   ```
   DATABASE_URL=postgresql://postgres.[project-ref]:[password]@...pooler.supabase.com:6543/postgres?pgbouncer=true
   JWT_SECRET=your-jwt-secret-here-use-a-long-random-string
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=8000
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   BCRYPT_ROUNDS=10
   ```

   **Important Notes:**
   - Use the **Transaction Pooling** connection string (port 6543 with `?pgbouncer=true`)
   - Generate a new secure JWT_SECRET: `openssl rand -base64 32`
   - Update CORS_ORIGIN with your actual Vercel frontend URL
   - Koyeb uses PORT=8000 by default (configured in koyeb.yaml)

5. **Configure health check:**
   - Health check path: `/health`
   - Health check port: 8000
   - Initial delay: 30 seconds

6. **Configure regions:**
   - Select: Washington, DC (US East) - closest to Supabase US East region
   - Or choose region closest to your users

7. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Check logs for any errors

8. **Verify deployment:**
   - Copy your Koyeb service URL (e.g., `https://your-app-name.koyeb.app`)
   - Test health endpoint:
     ```bash
     curl https://your-app-name.koyeb.app/health
     ```
   - Should return: `{"status":"ok","timestamp":"..."}`

### Step 8: Configure Auto-Deploy

Koyeb automatically redeploys when you push to your main branch:
- Go to Service Settings → Deployment
- Verify "Automatic deployment" is enabled
- Choose branch: `main`

---

## Phase 4: Update Frontend

### Step 9: Update Vercel Environment Variables

1. **Go to Vercel dashboard:**
   - Open your frontend project
   - Go to "Settings" → "Environment Variables"

2. **Update `NEXT_PUBLIC_API_URL`:**
   - Find the existing `NEXT_PUBLIC_API_URL` variable
   - Update value to your Koyeb URL: `https://your-app-name.koyeb.app`
   - Apply to: Production, Preview, Development

3. **Redeploy frontend:**
   - Go to "Deployments"
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Or push a new commit to trigger deployment

4. **Verify frontend works:**
   - Visit your Vercel URL
   - Try logging in / signing up
   - Check browser console for errors
   - Verify API calls are going to Koyeb URL

---

## Phase 5: Testing & Verification

### Step 10: End-to-End Testing

Test all major features:

1. **Authentication:**
   - [ ] Sign up new user
   - [ ] Log in with credentials
   - [ ] Token persistence
   - [ ] Protected routes

2. **Routes:**
   - [ ] Create new route
   - [ ] View routes list
   - [ ] Edit route
   - [ ] Delete route

3. **Activities:**
   - [ ] Log new activity
   - [ ] View activities list
   - [ ] View activity details
   - [ ] Activity statistics

4. **Workouts:**
   - [ ] Create workout
   - [ ] View workouts
   - [ ] Complete workout
   - [ ] View exercises

### Step 11: Monitor Performance

1. **Check Koyeb metrics:**
   - Go to your service in Koyeb dashboard
   - Monitor CPU, Memory, Network usage
   - Check logs for errors

2. **Check Supabase metrics:**
   - Go to Supabase dashboard
   - Check "Database" → "Database Health"
   - Monitor active connections
   - Verify connection pooling is working

3. **Set up alerts (optional):**
   - Koyeb: Configure uptime monitoring
   - Supabase: Enable email alerts for database issues

---

## Phase 6: Cleanup (Optional)

### Step 12: Decommission Railway

**Only do this after verifying everything works for 24-48 hours!**

1. **Backup Railway database one final time:**
   ```bash
   pg_dump "YOUR_RAILWAY_DATABASE_URL" > railway-final-backup-$(date +%Y%m%d).sql
   ```

2. **Delete Railway services:**
   - Go to Railway dashboard
   - Delete PostgreSQL service
   - Delete backend service
   - Delete project (if nothing else is using it)

3. **Archive backup:**
   ```bash
   # Move backups to safe location
   mkdir -p ~/Backups/routeiq-migration
   mv railway-backup*.sql ~/Backups/routeiq-migration/
   ```

---

## Troubleshooting

### Database Connection Issues

**Error: "Connection timeout"**
- Verify you're using the correct connection string format
- For local development: Use DIRECT connection (port 5432)
- For Koyeb: Use POOLING connection (port 6543 with `?pgbouncer=true`)

**Error: "Too many connections"**
- Switch to transaction pooling connection string
- Check Supabase dashboard for connection limits
- Verify `?pgbouncer=true` is in connection string

### Koyeb Deployment Issues

**Error: "Build failed"**
- Check build logs in Koyeb dashboard
- Verify `npm install` completes successfully
- Ensure `npx prisma generate` runs

**Error: "Health check failed"**
- Verify `/health` endpoint exists and responds
- Check if migrations completed successfully
- Review application logs for startup errors

**Error: "Migration failed"**
- Database URL might be incorrect
- Schema might already be migrated (this is OK)
- Check if Supabase database is accessible

### Frontend Connection Issues

**Error: "Network Error" or CORS issues**
- Verify `CORS_ORIGIN` in Koyeb includes your Vercel URL
- Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify Koyeb service is running (check health endpoint)

**Error: "API returned 502/503"**
- Koyeb service might be starting up (wait 30 seconds)
- Check Koyeb logs for backend errors
- Verify database connection is working

---

## Rollback Plan

If you need to rollback to Railway:

1. **Frontend:**
   - Change `NEXT_PUBLIC_API_URL` back to Railway URL in Vercel
   - Redeploy

2. **Backend:**
   - Railway service should still be running
   - No changes needed

3. **Database:**
   - Railway PostgreSQL should still have data
   - Your exports are safe locally

---

## Free Tier Limits

### Supabase Free Tier
- Database size: 500 MB
- Bandwidth: Unlimited
- Projects: 2 active
- Database egress: 2 GB/month
- Connection pooling: Included

**Monitoring:**
- Dashboard → "Usage" shows current usage
- Email alerts available

### Koyeb Free Tier
- Web Services: 1 free
- Build time: 1000 minutes/month
- Compute: 1 instance, 512 MB RAM
- Bandwidth: 100 GB/month
- Regions: All available

**Monitoring:**
- Dashboard → "Usage" shows current usage
- Auto-scales to 0 if no traffic

### Vercel Free Tier (unchanged)
- Bandwidth: 100 GB/month
- Serverless executions: 100 GB-hours
- Deployments: Unlimited

---

## Cost Comparison

| Service | Railway | Supabase + Koyeb |
|---------|---------|------------------|
| Database | $5/mo credit | Free (500MB) |
| Backend | $5/mo credit | Free (512MB RAM) |
| Frontend | N/A | N/A (Vercel) |
| **Total** | $0 (until credit runs out) | **$0 (permanent)** |

---

## Next Steps

After successful migration:

1. **Update documentation:**
   - Update README.md with new deployment instructions
   - Share new API URL with team members

2. **Set up CI/CD:**
   - Configure GitHub Actions for automated testing
   - Koyeb auto-deploys on git push (already enabled)

3. **Enable monitoring:**
   - Set up error tracking (Sentry, LogRocket)
   - Configure uptime monitoring (UptimeRobot, Better Uptime)

4. **Security:**
   - Review and rotate JWT_SECRET regularly
   - Enable Supabase Row Level Security (RLS) if needed
   - Review CORS_ORIGIN settings

---

## Support

- **Supabase Docs:** https://supabase.com/docs
- **Koyeb Docs:** https://www.koyeb.com/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

## Migration Checklist

Use this checklist to track your progress:

- [ ] Export Railway database
- [ ] Create Supabase project
- [ ] Import data to Supabase
- [ ] Verify data in Supabase
- [ ] Test backend locally with Supabase
- [ ] Create Koyeb account
- [ ] Deploy backend to Koyeb
- [ ] Configure environment variables in Koyeb
- [ ] Verify backend health endpoint
- [ ] Update Vercel environment variables
- [ ] Redeploy frontend
- [ ] Test authentication
- [ ] Test all CRUD operations
- [ ] Monitor for 24-48 hours
- [ ] Backup Railway database (final)
- [ ] Delete Railway services

**Migration Date:** _______________
**Completed By:** _______________
**Status:** ✓ Success / ⚠ Issues / ✗ Rollback

---

Good luck with your migration! 🚀
