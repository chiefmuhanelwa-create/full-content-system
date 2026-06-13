'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setError('Wrong email or password.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 font-display" style={{ background: '#F4F4F8' }}>
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#D4D4D8 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        opacity: 0.45,
      }} />

      <div className="relative w-full max-w-sm">
        {/* Back link */}
        <a href="/"
          className="flex items-center gap-1.5 text-sm font-display mb-6 transition-colors"
          style={{ color: '#A1A1AA' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#71717A')}
          onMouseLeave={e => (e.currentTarget.style.color = '#A1A1AA')}>
          ← Back to home
        </a>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#18181B', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
            <span className="font-display font-black text-white text-xl">N</span>
          </div>
          <h1 className="font-display font-black text-lg tracking-tight" style={{ color: '#18181B' }}>NOCHILL</h1>
          <p className="text-xs mt-1 font-display" style={{ color: '#A1A1AA' }}>Content Intelligence System</p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-8" style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h2 className="font-display font-bold text-xl mb-1" style={{ color: '#18181B' }}>Welcome back.</h2>
          <p className="text-sm font-display mb-7" style={{ color: '#71717A' }}>Sign in to your command centre.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm font-display"
              style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-display font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#71717A' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isLoading}
                className="w-full rounded-xl px-4 py-3 text-sm font-display transition-all disabled:opacity-50 outline-none"
                style={{ background: '#F9FAFB', border: '1px solid #E4E4E7', color: '#18181B' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#C9A84C')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E7')}
              />
            </div>

            <div>
              <label className="block text-[11px] font-display font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#71717A' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm font-display transition-all disabled:opacity-50 outline-none"
                  style={{ background: '#F9FAFB', border: '1px solid #E4E4E7', color: '#18181B' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#C9A84C')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E7')}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#A1A1AA' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#71717A')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#A1A1AA')}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-display font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{ background: '#C9A84C', color: '#0a0a0a', boxShadow: '0 2px 8px rgba(201,168,76,0.28)' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Enter the System
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6 font-display" style={{ color: '#A1A1AA' }}>
          NOCHILL PTY LTD · 2016/507839/07
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F4F8' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#E4E4E7', borderTopColor: '#C9A84C' }} />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
