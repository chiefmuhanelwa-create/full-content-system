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
        /* ─── UI Color System ─── */
        blue: {
          DEFAULT: '#2563EB',
          hover:   '#1D4ED8',
          light:   '#EFF6FF',
          dim:     'rgba(37, 99, 235, 0.10)',
          border:  'rgba(37, 99, 235, 0.25)',
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
        'blue-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.6' },
        },
        'live-pulse': {
          '0%':   { boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.50)' },
          '70%':  { boxShadow: '0 0 0 8px rgba(37, 99, 235, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(37, 99, 235, 0)' },
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
        'blue-pulse':      'blue-pulse 2s ease-in-out infinite',
        'live-pulse':      'live-pulse 1.8s ease-out infinite',
        'card-enter':      'card-enter 0.4s ease both',
      },
      backgroundImage: {
        'blue-stripe': 'linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.15), transparent)',
      },
      boxShadow: {
        'sm-soft': '0 1px 4px rgba(0,0,0,0.06)',
        'md-soft': '0 2px 8px rgba(0,0,0,0.08)',
        'lg-soft': '0 4px 16px rgba(0,0,0,0.10)',
        'blue-sm': '0 2px 8px rgba(37, 99, 235, 0.18)',
        'blue':    '0 4px 16px rgba(37, 99, 235, 0.22)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
