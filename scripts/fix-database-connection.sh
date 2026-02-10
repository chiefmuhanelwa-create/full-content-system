#!/bin/bash

echo "🔧 NOCHILL Database Connection Fix Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Regenerating Prisma Client...${NC}"
npx prisma generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma client regenerated successfully${NC}"
else
    echo -e "${RED}❌ Failed to regenerate Prisma client${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Checking environment variables...${NC}"

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL is not set${NC}"
    echo "Please set DATABASE_URL in your .env file"
    exit 1
else
    echo -e "${GREEN}✅ DATABASE_URL is set${NC}"
fi

if [ -z "$DIRECT_URL" ]; then
    echo -e "${YELLOW}⚠️  DIRECT_URL is not set (optional but recommended)${NC}"
else
    echo -e "${GREEN}✅ DIRECT_URL is set${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Database configuration updated!${NC}"
echo ""
echo "Next steps:"
echo "1. Stop your development server (Ctrl+C)"
echo "2. Restart it with: npm run dev"
echo "3. Try your action again"
echo ""
echo "If you still get connection errors:"
echo "• Check your internet connection"
echo "• Verify Supabase project is active (not paused)"
echo "• Check if DATABASE_URL is correct in .env"
echo "• See TROUBLESHOOTING-DATABASE.md for more help"
