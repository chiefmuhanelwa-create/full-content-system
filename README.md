# NOCHILL Viral Script Generator

AI-powered viral content creation platform using Claude API and the proven NOCHILL framework.

![NOCHILL](https://img.shields.io/badge/Framework-Next.js_14-black)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC)
![Claude](https://img.shields.io/badge/AI-Claude_Sonnet_4-purple)

## Features

### 8 Powerful Modules

1. **Hook Generator** - Generate viral hooks using R×A×C×U^B formula
2. **Script Writer** - Complete scripts with SEEDS framework
3. **Story Extractor** - Extract powerful proof stories
4. **Pitch Builder** - 5 Pillars pitch creation
5. **Fear Analyzer** - Shadow Fear identification
6. **Content Calendar** - 30-day content planning (4E framework)
7. **Revenue Tracker** - PAIDS revenue optimization
8. **Hook Bank** - Save and organize your best hooks

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **AI**: Claude API (Anthropic)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Vercel Postgres)
- Anthropic API key

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd full-content-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nochill?schema=public"

# Anthropic Claude API
ANTHROPIC_API_KEY="your_anthropic_api_key_here"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_here"  # Generate with: openssl rand -base64 32

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="NOCHILL Viral Script Generator"
```

### 4. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit: NOCHILL app"
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`
   - `ANTHROPIC_API_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel domain)

5. Click "Deploy"

### Step 3: Set Up Vercel Postgres (Optional)

If you don't have a database:

1. In Vercel dashboard, go to "Storage"
2. Create "Postgres Database"
3. Copy the `DATABASE_URL` to your environment variables
4. Run migrations:
   ```bash
   npx prisma db push
   ```

## Project Structure

```
full-content-system/
├── app/
│   ├── api/
│   │   ├── hooks/
│   │   │   └── generate/route.ts      # Hook generation API
│   │   ├── scripts/
│   │   │   └── generate/route.ts      # Script generation API
│   │   └── stories/
│   │       └── extract/route.ts       # Story extraction API
│   ├── dashboard/
│   │   ├── hooks/page.tsx             # Hook Generator UI
│   │   ├── scripts/page.tsx           # Script Writer UI (TODO)
│   │   ├── stories/page.tsx           # Story Extractor UI (TODO)
│   │   ├── layout.tsx                 # Dashboard layout
│   │   └── page.tsx                   # Dashboard home
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Landing page
│   └── globals.css                    # Global styles
├── components/
│   └── ui/                            # Shadcn UI components
├── lib/
│   ├── claude.ts                      # Claude API client
│   ├── db.ts                          # Prisma client
│   ├── prompts.ts                     # AI prompts
│   └── utils.ts                       # Utility functions
├── prisma/
│   └── schema.prisma                  # Database schema
├── .env.example                       # Environment template
├── next.config.js                     # Next.js config
├── tailwind.config.ts                 # Tailwind config
└── package.json                       # Dependencies
```

## API Routes

### Generate Hooks

```http
POST /api/hooks/generate
Content-Type: application/json

{
  "topic": "brand deals for small creators",
  "platform": "instagram",
  "duration": "60s",
  "tone": "educational",
  "hookType": "question",
  "count": 5
}
```

**Response:**
```json
{
  "success": true,
  "hooks": [
    "Your family thinks you're wasting time...",
    "I went from R750 to R8,333 in 90 days..."
  ],
  "metadata": {
    "topic": "brand deals",
    "platform": "instagram",
    "count": 5
  }
}
```

### Generate Script

```http
POST /api/scripts/generate
Content-Type: application/json

{
  "hook": "Your family thinks you're wasting time...",
  "goal": "educate",
  "platform": "instagram",
  "duration": "60s",
  "topic": "brand deals"
}
```

### Extract Stories

```http
POST /api/stories/extract
Content-Type: application/json

{
  "answers": {
    "What achievement surprised you?": "Hit R100k/month in 6 months",
    "What transformation occurred?": "Went from 0 to 50k followers"
  }
}
```

## Database Schema

Key models:

- **User** - User accounts and subscription info
- **Hook** - Generated hooks with performance tracking
- **Script** - Complete scripts with SEEDS breakdown
- **Story** - Proof stories with 4-criteria validation
- **Revenue** - PAIDS revenue tracking
- **CalendarEntry** - Content calendar entries

See `prisma/schema.prisma` for full schema.

## Claude API Integration

The app uses Claude Sonnet 4 for all AI generation:

- **Model**: `claude-sonnet-4-20250514`
- **Max Tokens**: 1024 (hooks), 4096 (scripts)
- **System Prompts**: See `lib/prompts.ts`

### Cost Estimation

- **Hook Generation**: ~500 tokens = $0.0075 per request
- **Script Generation**: ~2000 tokens = $0.03 per request
- **Story Extraction**: ~3000 tokens = $0.045 per request

For 1,000 users generating 10 hooks/month:
- API Cost: ~$75/month
- Revenue (at $29/user): $29,000/month
- Profit Margin: 99.7%

## Customization

### Adding New Prompts

Edit `lib/prompts.ts`:

```typescript
export const YOUR_PROMPT = `Your custom system prompt here...`
```

### Adding New Features

1. Create API route in `app/api/`
2. Create UI component in `app/dashboard/`
3. Update navigation in `app/dashboard/layout.tsx`

### Styling

All styles use Tailwind CSS. Customize in:
- `tailwind.config.ts` - Theme colors, fonts
- `app/globals.css` - Global CSS variables

## Roadmap

### Phase 1 (Current) ✅
- Hook Generator
- Script Writer API
- Story Extractor API
- Dashboard UI

### Phase 2 (Next)
- [ ] User authentication with NextAuth.js
- [ ] Script Writer UI
- [ ] Story Extractor UI with questionnaire
- [ ] Hook Bank (save/organize hooks)

### Phase 3 (Future)
- [ ] Pitch Builder (5 Pillars)
- [ ] Fear Analyzer (Shadow Fears)
- [ ] Content Calendar (30-day planning)
- [ ] Revenue Tracker (PAIDS)
- [ ] PDF export functionality
- [ ] Team collaboration features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/nochill/issues)
- Email: support@nochill.app

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Claude AI](https://anthropic.com/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Inspired by the NOCHILL Viral Scripting Framework

---

Made with ⚡ by NOCHILL Team
