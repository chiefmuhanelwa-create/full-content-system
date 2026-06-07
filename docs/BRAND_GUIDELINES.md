# NOCHILL BRAND GUIDELINES
### The Definitive Brand Identity System
**NOCHILL PTY LTD (2016/507839/07) · Version 1.0 · June 2026**

---

## BRAND FOUNDATIONS

| Field | Value |
|---|---|
| **Company** | NOCHILL PTY LTD (2016/507839/07) |
| **Founder** | Ndivhuwo Muhanelwa |
| **Mission** | Turn struggling African content creators into contentpreneurs through proven, receipt-backed systems |
| **Positioning** | The most honest South African creator business education platform |
| **Store** | contentcreatorhub.online |
| **Platform** | CHKPLT — Christ's Kingdom Platform (full product + LMS platform) |
| **Origin brand** | No Chill in Mzansi (Facebook, 1M+ followers) |
| **Short link** | chkplt.com |
| **Email** | info@nochill.co.za |
| **Proof statement** | From sleeping in university bathrooms → R600,000+ annual income · 50+ brand deals · 23 agencies · 9 awards · SAMA31 judge · Meta speaker |

---

## BRAND ARCHITECTURE

```
NOCHILL PTY LTD  ─────────────────────── The company
│
├── Creator's Hub ────────────────────── The store (contentcreatorhub.online)
│   └── Shopify digital products, R0–R1,997
│
├── CHKPLT ───────────────────────────── The premium platform
│   └── Called Expert audience · High-ticket · LMS + Paystack + Supabase
│
└── NoChill Content System ───────────── The internal command centre
    └── AI content tools, only for Ndivhuwo
```

**Naming rules:**
- The company is always "NOCHILL PTY LTD" (all caps, with PTY LTD)
- The brand is "NOCHILL" or "NoChill" in copy
- Never "No Chill" as two separate words in formal contexts
- CHKPLT is the platform codename (internal + developer use) — public name is being confirmed

---

## COLOR SYSTEM

The NOCHILL brand operates in **two modes** — the design context determines which to use.

### DARK MODE — Tools, Dashboard, Internal Systems
*Used in: NoChill Content System, emails (top bar), brand deal scripts*

| Name | Hex | HSL | Use |
|---|---|---|---|
| **Tool Black** | `#111111` | 0° 0% 7% | Primary background (tools/dashboard) |
| **Charcoal** | `#1C1C1C` | 0° 0% 11% | Card backgrounds |
| **Border Dark** | `#2A2A2A` | 0° 0% 16% | Card borders, dividers |
| **Surface Dark** | `#141414` | 0° 0% 8% | Input backgrounds |
| **Muted 1** | `#444444` | 0° 0% 27% | Disabled text, deep labels |
| **Muted 2** | `#888888` | 0° 0% 53% | Secondary text on dark |
| **Text** | `#E0E0E0` | 0° 0% 88% | Body text on dark |
| **Headline** | `#F8F8F8` | 0° 0% 97% | Headlines on dark |

### LIGHT MODE — Marketing, PDFs, Shopify, CHKPLT
*Used in: CHKPLT platform, product pages, PDFs, public marketing materials*

| Name | Hex | RGB | Use |
|---|---|---|---|
| **Cream White** | `#FAF7F0` | 250/247/240 | CHKPLT/marketing page background |
| **Pure White** | `#FFFFFF` | 255/255/255 | Card surfaces, content areas |
| **Elevated Cream** | `#F4EFE3` | 244/239/227 | Raised panels, callout sections |
| **Paper White** | `#F8F8F8` | 248/248/248 | PDF interior pages |
| **Worksheet Cream** | `#F1E7C3` | 241/231/195 | Founder example boxes |
| **Tip Yellow** | `#FFFCE9` | 255/252/233 | Tip boxes (workbooks) |
| **Powder Blue** | `#DCEBF6` | 220/235/246 | "Your Turn" worksheet boxes |
| **Ink** | `#1F1B16` | 31/27/22 | Body text on cream |
| **Near Black** | `#0A0A0A` | 10/10/10 | Headlines on cream/white |
| **Body Warm** | `#5C5448` | 92/84/72 | Secondary text on cream |
| **Subtle Warm** | `#8A8071` | 138/128/113 | Tertiary text on cream |

### GOLD SPECTRUM — The Core Brand Accent
*Applied in BOTH modes. Gold is the primary brand colour.*

```
DEEPEST ←────────────────────────────────────────────────────────→ BRIGHTEST
  #8C6F1F    #C9A646    #D4A82F    #D4B65C    #D9BC45    #E6C871    #F5C842
  Deep Gold  Antique    Heritage   Mid Gold   Mustard    Bright     Email
  (on cream) (CHKPLT)  (primary)  (hover)    (fill)     (accent)   (banner)
```

| Name | Hex | Primary Use |
|---|---|---|
| **Deep Gold** | `#8C6F1F` | Text on cream, dark gold emphasis, gradient end |
| **Antique Gold** | `#C9A646` | Primary gold — CHKPLT platform |
| **Heritage Gold** | `#D4A82F` | Primary gold — tools/PDFs/print |
| **Mid Gold** | `#D4B65C` | Hover states, gradient mid |
| **Mustard Fill** | `#D9BC45` | Solid-fill callout bars |
| **Bright Gold** | `#E6C871` | Gradient highlight, gradient start |
| **Email Gold** | `#F5C842` | Email banner bars, high-contrast CTAs |

**Gold gradient (CTAs, highlight bars):**
```css
background: linear-gradient(135deg, #E6C871 0%, #C9A646 60%, #8C6F1F 100%);
```

**Gold glow (on dark backgrounds):**
```css
box-shadow: 0 0 20px rgba(201, 166, 70, 0.28), 0 0 60px rgba(201, 166, 70, 0.14);
```

### ACCENT COLORS — Functional

| Name | Hex | Use |
|---|---|---|
| **Burnt Orange** | `#D4541F` | Live/active states, urgency, "LIVE" badges, active form steps |
| **Orange Bright** | `#F2701E` | CTA hover on burnt orange, fire states |
| **Orange Deep** | `#9A3A12` | Text on orange backgrounds |
| **Action Blue** | `#2F80ED` | "YOUR TURN" headers (workbooks only) |
| **Success Green** | `#34A853` | ✅ correct path, confirmations |
| **Alert Red** | `#E04B4B` | ❌ wrong path, red flags, errors |
| **Warning Amber** | `#D4A82F` | ⚠️ critical checkpoints |

---

## TYPOGRAPHY

### Primary System (Tools + PDFs)

| Role | Font | Weight | Spec |
|---|---|---|---|
| **Display / Cover** | Montserrat | ExtraBold (800) / Black (900) | ALL CAPS · letter-spacing: 0.04em · Gold |
| **Heading** | Montserrat | Bold (700) | ALL CAPS for labels, +tracking |
| **Sub-heading** | Montserrat | SemiBold (600) | Sentence case |
| **Body** | Lato | Regular (400) / Bold (700) | 13–16px · line-height: 1.7 · Ink/#E0E0E0 |
| **Script accent** | Caveat | Regular | ONE warm line per product max |

**Fallbacks:** Poppins → Montserrat · Open Sans → Lato

### Secondary System (CHKPLT Platform)

| Role | Font | Weight | Spec |
|---|---|---|---|
| **All text** | Inter | 400–800 | heading: letter-spacing -0.035em · line-height 1.05 |
| **Body** | Inter | 400 | 16px · line-height 1.7 |
| **Labels** | Inter | 600 | 12px · letter-spacing 0.18em · uppercase |
| **Metric** | Inter | 500 | 13px · subtle text color |

### Scale

| Level | Size | Use |
|---|---|---|
| Hero | clamp(32px, 6vw, 72px) | Page hero title |
| H1 | clamp(28px, 4.5vw, 56px) | Section title |
| H2 | clamp(24px, 4.2vw, 48px) | Sub-section |
| H3 | 20–24px | Card title |
| Body | 15–16px | Content |
| Small | 13px | Labels, meta |
| Micro | 11px | Badges, caps |

---

## LOGO SYSTEM

### Primary Wordmark
- Text: **NOCHILL**
- Font: Montserrat Black
- Style: ALL CAPS · tracking-widest
- Colors: Gold (#D4A82F) on dark · Near-black (#0A0A0A) on cream · White on very dark

### "N" Monogram (app icon / favicon)
```
[Gold rounded square]
    black "N"
    Montserrat Black
```
- Container: 28×28px (nav) / 56×56px (login) / 112×112px (hero)
- Border-radius: 25–30% of width
- Background: Heritage Gold #D4A82F
- Letter: #111111 / #0A0A0A

### CHKPLT Wordmark
- Text: **CHKPLT**
- Font: Inter Bold (or Montserrat Bold)
- Style: ALL CAPS · tracking: 0.22em
- Color: Gold (#C9A646 / #D4A82F)

### Creator's Hub
- Text: **CREATOR'S HUB**
- Font: Montserrat Bold
- Style: Store context only

### "No Chill in Mzansi Co." Stamp
- Circular stamp, white, used on PDF covers
- Subtitle: the origin brand reference

---

## VISUAL LANGUAGE

### Cards (Dark Mode)
```css
background: #1C1C1C;
border: 1px solid #2A2A2A;
border-radius: 12px;
/* Hover: */
border-color: rgba(212, 168, 47, 0.35);
box-shadow: 0 4px 24px rgba(212, 168, 47, 0.07);
transform: translateY(-2px);
```

### Cards (Light Mode)
```css
background: #FFFFFF;
border: 1px solid rgba(10, 10, 10, 0.10);
border-radius: 16px;
/* Hover: */
border-color: rgba(201, 166, 70, 0.55);
box-shadow: 0 0 30px rgba(201, 166, 70, 0.18), 0 12px 32px -8px rgba(10, 10, 10, 0.10);
transform: translateY(-4px);
```

### CTA Buttons
```css
background: linear-gradient(135deg, #D4B65C, #C9A646 60%, #8C6F1F);
color: #0A0A0A;
font-weight: 700;
border-radius: 10px;
border: 1px solid rgba(140, 111, 31, 0.45);
box-shadow: 0 0 20px rgba(201, 166, 70, 0.30), 0 4px 16px rgba(10, 10, 10, 0.12);
/* Hover: */
transform: translateY(-3px);
box-shadow: 0 0 35px rgba(201, 166, 70, 0.55), 0 10px 28px rgba(10, 10, 10, 0.20);
```

### "LIVE" / Active Badge
```css
color: #9A3A12;
background: rgba(242, 112, 30, 0.10);
border: 1px solid rgba(212, 84, 31, 0.30);
border-radius: 999px;
/* Dot animation: */
background: #D4541F;
box-shadow: 0 0 0 0 rgba(212, 84, 31, 0.55);
animation: live-pulse 1.8s ease-out infinite;
```

### Hero Glow Orb (CHKPLT pages)
```css
background: radial-gradient(circle,
  rgba(201, 166, 70, 0.22) 0%,
  rgba(230, 200, 113, 0.10) 35%,
  transparent 65%
);
width: 600px; height: 600px;
animation: glow-breathe 5s ease-in-out infinite;
```

### Principles
- **Never mid-gray backgrounds** — always near-black (#111111) or cream (#FAF7F0) or white (#FFFFFF)
- **Gold glows, never solid gold fills on large areas** — gold is accent, not background
- **Rounded corners always** — 10–16px on cards, 8–10px on buttons, 6–8px on tags
- **Generous white space** — minimum 64px margins in PDFs, 32px in web tools
- **Lift on hover** — cards always lift 2–4px + border glow on hover
- **Duotone photos** — images in PDFs use charcoal+grey duotone treatment

---

## PHOTOGRAPHY

### Author Images
| File | Use | Style |
|---|---|---|
| `ndivhuwo-cover.jpg` | PDF covers | Smiling, warm, book in hand |
| `ndivhuwo-headshot.jpg` | About pages | Arms crossed, professional |
| `ndivhuwo-event.jpg` | Event/stage shots | Speaking or award context |
| `ndivhuwo-profile.png` | Emails (CDN) | Circle crop, gold border |

### Cover Photo Frame Rule
```css
width: 300px; height: 300px;
border-radius: 28px;           /* rounded square — never circular */
border: 2px solid #D4A82F;
overflow: hidden;
```
NEVER a small circle or avatar on a PDF cover. Always a large rounded square.

---

## VOICE AND TONE

### Brand Character
- **Tough-love mentor** — direct, blunt, no fluff
- **Receipt-backed** — every claim has a number (R285K SARS bill, R207K saved, R600K earned)
- **Africa-first** — Rands not dollars, SARS not IRS, Mr Price not Target, Mzansi not "the market"
- **Faith-infused, never preachy** — "Your gift will make room for you." Light amen. Never sermon.
- **Struggle-to-outcome** — every story goes FROM embarrassment TO empire

### The 5 Voice Laws
1. **Grade-7 reading level** — if a 10-year-old can't follow it, simplify
2. **One idea per sentence** — short sentences, white space as a feature
3. **Always quantify** — "R23,000 single campaign" not "significant income"
4. **Speak to ONE person** — "you" not "people" or "creators"
5. **End with a gut-punch** — last line of every section should land hard

### Tone by Context

| Context | Tone | Avoid |
|---|---|---|
| Product cover / title | Direct, challenging | Corporate, vague promises |
| Email subject | Personal, intimate | "Newsletter" energy |
| Product content | Teaching-warm, step-by-step | Long unbroken paragraphs |
| Sales page | Urgency + empathy | Fake scarcity, pushy |
| Social caption | Voice-note style | Formal grammar |
| Testimonials | Exact verbatim words | Cleaning up "bad grammar" |

### Signature Phrases
- **"NoChill"** — brand + life philosophy: no chill with mediocrity
- **"If you're ready"** — soft invitation, never pressure
- **"You don't need more followers. You need a system."**
- **"I don't teach theory. I teach what I did."**
- **"Build in Africa. For Africa. About Africa."**
- **"Most people give up just before it works."**
- **"The problem isn't that you don't know what to do. The problem is you're waiting for permission."**
- **"Africa has 36 million content creators. Most earn nothing. That's the opportunity."**

---

## PDF / PRINT STANDARDS

### Cover Spec
- Background: Charcoal Black `#1C1C1C`
- Title: Heritage Gold `#D4A82F`, Montserrat ExtraBold, ALL CAPS, letter-spacing 0.04em
- Subtitle: White/muted — **MUST contain a number + timeframe** ("in 90 minutes, not 9 months")
- Byline: "By Ndivhuwo Muhanelwa" below subtitle
- Script tagline: Caveat font, one warm line
- Author photo: 300×300px rounded-square frame, gold border
- Logo stamp: "No Chill in Mzansi Co." white circular stamp
- **Never print price inside the PDF** — covers must be evergreen

### Interior Page Furniture
- Running header: section name, Montserrat Bold CAPS, +tracking
- Gold rule: full-width `#D4A82F` rule directly under header
- Page number: bottom outer corner, Montserrat Bold, Ink `#2B2B2B`
- Margins: min 64px, generous white space
- Max 1 photo + 1 illustration per page (photos duotone)

### Box Colour System (Workbooks)
| Box | Hex | Meaning |
|---|---|---|
| Cream `#F1E7C3` | Founder example — "HOW I ANSWERED THIS" |
| Powder Blue `#DCEBF6` | Reader's turn — "YOUR TURN:" |
| Pale Yellow `#FFFCE9` | 💡 Tip — always bottom of page |
| Charcoal `#1C1C1C` | Pull-quote / callout block (with gold number) |

**Rule: NEVER mix cream and powder blue boxes.** Cream = my example. Blue = your turn.

---

## PRODUCT NAMING FORMULA

**Main title:** "Stop [PAIN]" — transformation frame, 3–6 words  
**Subtitle:** "[N] [mechanism] to [outcome] in [timeframe] — without [feared cost]"  
**Example:** "Stop Posting Random Content — Find the one niche people will pay you for, in 90 minutes, not 9 months"

Title must pass the **2-second test**: a stranger reads it and immediately knows their problem is solved.

---

## EMAIL BRAND STANDARDS

### Layout Structure
1. **Top bar:** `#111111` background · white micro-text · "NOCHILL PTY LTD · contentcreatorhub.online"
2. **Label stripe:** `#F5C842` background · `#111111` bold caps text · announcement or personal note
3. **Author block:** Profile photo circle (gold border `3px solid #F5C842`) · Name + title
4. **Body:** `#FFFFFF` background · `#444444` body text · Arial 16px · line-height 1.8
5. **Callout blocks:** `#111111` bg · gold label stripe · white body text · gold highlight text
6. **Footer:** `#EEEEEE` bg · `#888888` fine print · company + unsubscribe

### Email Color Tokens
| Element | Hex |
|---|---|
| Body background | `#f0f0f0` |
| Card background | `#FFFFFF` |
| Top bar | `#111111` |
| Gold stripe | `#F5C842` |
| Callout block | `#111111` |
| Body text | `#444444` |
| Muted text | `#888888` |
| Headline text | `#111111` |
| Photo border | `#F5C842` |
| HR divider | `#F5C842` |

---

## SOCIAL HANDLES

| Platform | Handle |
|---|---|
| Instagram | @nochill_god |
| Facebook | @nochillinmzansi |
| TikTok | @nochillgod |
| YouTube | @NoChill God |
| X / Twitter | @nochill_god |

---

## LEGAL FOOTER (All Materials)

```
NOCHILL PTY LTD · 2016/507839/07
contentcreatorhub.online · info@nochill.co.za
```

---

## CSS QUICK REFERENCE

```css
/* ─── Dark Mode (Tools / Dashboard) ─── */
--bg-primary:      #111111;
--bg-card:         #1C1C1C;
--bg-surface:      #141414;
--border:          #2A2A2A;
--text-headline:   #F8F8F8;
--text-body:       #E0E0E0;
--text-muted:      #888888;
--text-subtle:     #444444;

/* ─── Light Mode (CHKPLT / Marketing) ─── */
--bg-cream:        #FAF7F0;
--bg-white:        #FFFFFF;
--bg-elevated:     #F4EFE3;
--text-headline:   #0A0A0A;
--text-body:       #1F1B16;
--text-muted:      #5C5448;
--text-subtle:     #8A8071;

/* ─── Gold (Both Modes) ─── */
--gold-deep:       #8C6F1F;
--gold-antique:    #C9A646;
--gold-heritage:   #D4A82F;
--gold-mid:        #D4B65C;
--gold-mustard:    #D9BC45;
--gold-bright:     #E6C871;
--gold-email:      #F5C842;
--gold-gradient:   linear-gradient(135deg, #E6C871 0%, #C9A646 60%, #8C6F1F 100%);
--gold-glow:       0 0 20px rgba(201, 166, 70, 0.28), 0 0 60px rgba(201, 166, 70, 0.14);

/* ─── Accents ─── */
--orange-live:     #D4541F;
--orange-bright:   #F2701E;
--orange-deep:     #9A3A12;
--blue-action:     #2F80ED;   /* workbooks only */
--green-success:   #34A853;
--red-alert:       #E04B4B;
```

---

*Brand system maintained by Ndivhuwo Muhanelwa · NOCHILL PTY LTD · Last updated June 2026*
