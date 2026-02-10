#!/bin/bash

# NOCHILL Database Fix Script
# This script helps diagnose and fix database connection issues

echo "🔧 NOCHILL Database Fix Script"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found"
    echo "   Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local - please add your DATABASE_URL"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env.local | xargs)

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL is not set in .env.local"
    echo ""
    echo "To fix this:"
    echo "1. Get a free PostgreSQL database from Neon: https://neon.tech"
    echo "2. Add the connection string to .env.local"
    echo "3. Run this script again"
    exit 1
fi

# Check if DATABASE_URL starts with correct protocol
if [[ ! "$DATABASE_URL" =~ ^postgresql:// ]] && [[ ! "$DATABASE_URL" =~ ^postgres:// ]]; then
    echo "❌ Error: DATABASE_URL must start with 'postgresql://' or 'postgres://'"
    echo "   Current value: $DATABASE_URL"
    exit 1
fi

echo "✅ DATABASE_URL is set correctly"
echo ""

# Test database connection
echo "🔌 Testing database connection..."
npx prisma db execute --stdin --schema=prisma/schema.prisma <<EOF
SELECT 1;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
    echo ""

    # Generate Prisma client
    echo "📦 Generating Prisma client..."
    npx prisma generate

    if [ $? -eq 0 ]; then
        echo "✅ Prisma client generated successfully"
        echo ""

        # Push database schema
        echo "🗄️  Pushing database schema..."
        npx prisma db push

        if [ $? -eq 0 ]; then
            echo "✅ Database schema pushed successfully"
            echo ""
            echo "🎉 All done! Your database is ready."
            echo ""
            echo "Next steps:"
            echo "1. Stop your development server if it's running (Ctrl+C)"
            echo "2. Restart it with: npm run dev"
            echo "3. Your new features should now work!"
        else
            echo "⚠️  Warning: Failed to push database schema"
            echo "   This might mean your database is suspended or unreachable"
            echo ""
            echo "To fix:"
            echo "1. Go to https://console.neon.tech"
            echo "2. Check if your database is suspended"
            echo "3. If suspended, it will automatically wake up on the next connection"
            echo "4. Run this script again"
        fi
    else
        echo "❌ Failed to generate Prisma client"
        exit 1
    fi
else
    echo "❌ Database connection failed"
    echo ""
    echo "Common issues:"
    echo "1. Neon database is suspended (free tier)"
    echo "   - Go to https://console.neon.tech"
    echo "   - Your database will wake up when you access it"
    echo ""
    echo "2. Invalid credentials"
    echo "   - Get a fresh connection string from Neon"
    echo "   - Update .env.local with the new string"
    echo ""
    echo "3. Network issues"
    echo "   - Check your internet connection"
    echo "   - Try again in a few moments"
fi
