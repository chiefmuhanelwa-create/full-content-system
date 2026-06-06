import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        /* ─── NOCHILL Brand Color System (CHKPLT-aligned) ─── */
        gold: {
          DEFAULT:  '#C9A646',    /* Antique Gold — CHKPLT primary */
          heritage: '#D4A82F',    /* Heritage Gold — PDFs / print */
          mid:      '#D4B65C',    /* Mid Gold — hover states */
          mustard:  '#D9BC45',    /* Mustard Fill — callout bars */
          bright:   '#E6C871',    /* Bright Gold — gradient highlight */
          email:    '#F5C842',    /* Email Gold — banner bars */
          deep:     '#8C6F1F',    /* Deep Gold — text on cream */
          muted:    'rgba(201, 166, 70, 0.15)',
        },
        charcoal: {
          DEFAULT: '#1C1C1C',     /* Card background */
          light:   '#2A2A2A',     /* Border */
          dark:    '#111111',     /* Page background */
          surface: '#141414',     /* Input / nested surface */
          deeper:  '#0A0A0A',     /* CHKPLT Obsidian (headline on cream) */
        },
        /* Burnt Orange — live/fire states only */
        orange: {
          live:   '#D4541F',
          bright: '#F2701E',
          deep:   '#9A3A12',
        },
        /* Cream palette — marketing / PDFs */
        cream: {
          DEFAULT: '#FAF7F0',     /* CHKPLT page background */
          white:   '#FFFFFF',
          hi:      '#F4EFE3',     /* Elevated cream */
          paper:   '#F8F8F8',     /* PDF interior */
          warm:    '#F1E7C3',     /* Founder example boxes */
          tip:     '#FFFCE9',     /* Tip boxes */
          blue:    '#DCEBF6',     /* Your Turn boxes (workbooks) */
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Montserrat', 'sans-serif'],
        body:    ['var(--font-body)',    'Lato',        'sans-serif'],
        sans:    ['var(--font-body)',    'Lato', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', '-apple-system', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg:  'var(--radius)',
        md:  'calc(var(--radius) - 2px)',
        sm:  'calc(var(--radius) - 4px)',
        xl:  'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'gold-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.6' },
        },
        'glow-breathe': {
          '0%, 100%': { opacity: '0.8', transform: 'translateX(-50%) scale(1)' },
          '50%':       { opacity: '1',   transform: 'translateX(-50%) scale(1.06)' },
        },
        'live-pulse': {
          '0%':   { boxShadow: '0 0 0 0 rgba(212, 84, 31, 0.55)' },
          '70%':  { boxShadow: '0 0 0 8px rgba(212, 84, 31, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(212, 84, 31, 0)' },
        },
        'card-enter': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down':  'accordion-down 0.2s ease-out',
        'accordion-up':    'accordion-up 0.2s ease-out',
        'fade-in':         'fade-in 0.25s ease-out',
        'gold-pulse':      'gold-pulse 2s ease-in-out infinite',
        'glow-breathe':    'glow-breathe 5s ease-in-out infinite',
        'live-pulse':      'live-pulse 1.8s ease-out infinite',
        'card-enter':      'card-enter 0.4s ease both',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E6C871 0%, #C9A646 60%, #8C6F1F 100%)',
        'gold-btn':      'linear-gradient(135deg, #D4B65C 0%, #C9A646 60%, #8C6F1F 100%)',
        'gold-stripe':   'linear-gradient(90deg, transparent, rgba(201, 166, 70, 0.30), transparent)',
      },
      boxShadow: {
        'gold-sm':  '0 2px 12px rgba(201, 166, 70, 0.10)',
        'gold':     '0 4px 24px rgba(201, 166, 70, 0.14)',
        'gold-lg':  '0 8px 40px rgba(201, 166, 70, 0.20)',
        'gold-glow':'0 0 20px rgba(201, 166, 70, 0.28), 0 0 60px rgba(201, 166, 70, 0.14)',
        'orange-sm':'0 0 12px rgba(212, 84, 31, 0.35)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
