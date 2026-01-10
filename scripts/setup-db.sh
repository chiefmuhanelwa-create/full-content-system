#!/bin/bash
# Database setup script for Vercel deployment

echo "🔧 Setting up database..."

# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push --skip-generate

echo "✅ Database setup complete!"
