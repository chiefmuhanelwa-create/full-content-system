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
    <div className="relative min-h-screen flex items-center justify-center px-4 font-display" style={{ background: '#0a0a0a' }}>
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(rgba(201,168,76,0.07) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }} />
      {/* Gold glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at top, rgba(201,168,76,0.06) 0%, transparent 70%)',
      }} />

      <div className="relative w-full max-w-sm">
        {/* Back link */}
        <a href="/" className="flex items-center gap-1.5 text-sm font-display mb-6 transition-colors"
          style={{ color: '#3a3a4a' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#5a5a6a')}
          onMouseLeave={e => (e.currentTarget.style.color = '#3a3a4a')}>
          ← Back to home
        </a>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#C9A84C', boxShadow: '0 4px 24px rgba(201,168,76,0.25)' }}>
            <span className="font-display font-black text-xl" style={{ color: '#0a0a0a' }}>N</span>
          </div>
          <h1 className="font-display font-black text-lg tracking-tight" style={{ color: '#FAF7F0' }}>NOCHILL</h1>
          <p className="text-xs mt-1 font-display" style={{ color: '#5a5a6a' }}>Content Intelligence System</p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-8" style={{ background: '#141414', border: '1px solid #2b2b2b', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          <h2 className="font-display font-bold text-xl mb-1" style={{ color: '#FAF7F0' }}>Welcome back.</h2>
          <p className="text-sm font-display mb-7" style={{ color: '#5a5a6a' }}>Sign in to your command centre.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm font-display" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-display font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a5a6a' }}>
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
                style={{
                  background: '#0f0f0f',
                  border: '1px solid #2b2b2b',
                  color: '#FAF7F0',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2b2b2b')}
              />
            </div>

            <div>
              <label className="block text-[11px] font-display font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5a5a6a' }}>
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
                  style={{
                    background: '#0f0f0f',
                    border: '1px solid #2b2b2b',
                    color: '#FAF7F0',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#2b2b2b')}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#3a3a4a' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#5a5a6a')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3a3a4a')}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-display font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{ background: '#C9A84C', color: '#0a0a0a', boxShadow: '0 4px 20px rgba(201,168,76,0.25)' }}
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

        <p className="text-center text-xs mt-6 font-display" style={{ color: '#2b2b2b' }}>
          NOCHILL PTY LTD · 2016/507839/07
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid #2b2b2b', borderTopColor: '#C9A84C' }} />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
