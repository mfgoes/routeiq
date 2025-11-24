#!/bin/bash

# Railway Database Export Script
# This script exports your Railway PostgreSQL database to a SQL file

echo "=== Railway Database Export ==="
echo ""
echo "To export your database, you'll need your Railway DATABASE_URL"
echo "You can find this in your Railway project dashboard under Variables"
echo ""
echo "Run the following command with your DATABASE_URL:"
echo ""
echo "pg_dump \"YOUR_RAILWAY_DATABASE_URL\" > railway-backup-$(date +%Y%m%d-%H%M%S).sql"
echo ""
echo "Example:"
echo "pg_dump \"postgresql://postgres:PASSWORD@containers-us-west-xxx.railway.app:5432/railway\" > railway-backup.sql"
echo ""
echo "After export completes, verify the file exists and has content:"
echo "ls -lh railway-backup*.sql"
echo ""
