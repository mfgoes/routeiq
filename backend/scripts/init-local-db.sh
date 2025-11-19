#!/bin/bash
# Initialize local PostgreSQL database for RouteIQ development

set -e  # Exit on error

DB_NAME="routeiq_dev"
DB_USER="routeiq"
DB_PASSWORD="password"

echo "🚀 Initializing RouteIQ local database..."
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or not in PATH"
    echo ""
    echo "Install PostgreSQL:"
    echo "  macOS:   brew install postgresql@14"
    echo "  Ubuntu:  sudo apt-get install postgresql-14"
    echo "  Windows: choco install postgresql14"
    echo ""
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready &> /dev/null; then
    echo "⚠️  PostgreSQL service is not running"
    echo ""
    echo "Start PostgreSQL:"
    echo "  macOS:   brew services start postgresql@14"
    echo "  Ubuntu:  sudo systemctl start postgresql"
    echo "  Windows: Start-Service postgresql-x64-14"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL is installed and running"
echo ""

# Drop database if it exists (for reset)
if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "⚠️  Database '$DB_NAME' already exists"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        dropdb $DB_NAME
    else
        echo "ℹ️  Keeping existing database"
        exit 0
    fi
fi

# Create database
echo "📦 Creating database '$DB_NAME'..."
createdb $DB_NAME

echo ""
echo "✅ Database initialized successfully!"
echo ""
echo "Next steps:"
echo "  1. Copy .env.example to .env:     cp .env.example .env"
echo "  2. Run Prisma migrations:         pnpm prisma migrate dev"
echo "  3. Seed the database:             pnpm prisma db seed"
echo "  4. Start the server:              pnpm dev"
echo ""
echo "Optional: View database in GUI:    pnpm prisma studio"
echo ""
