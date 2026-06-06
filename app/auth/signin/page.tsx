'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
    <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center px-4">
      {/* Gold radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
          style={{
            background: 'radial-gradient(circle, rgba(201,166,70,0.14) 0%, rgba(230,200,113,0.06) 40%, transparent 65%)',
            animation: 'nc-glow-breathe 5s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#C9A646] flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(201,166,70,0.28)]">
            <span className="font-heading font-black text-[#0A0A0A] text-2xl">N</span>
          </div>
          <h1 className="font-heading font-black text-[#0A0A0A] text-xl tracking-widest uppercase">NOCHILL</h1>
          <p className="text-[#8A8071] text-xs mt-1 font-heading tracking-wide">Content Intelligence System</p>
        </div>

        {/* Form card */}
        <div className="bg-white border border-[#E8E1D0] rounded-2xl p-8 shadow-[0_4px_32px_rgba(10,10,10,0.06)]">
          <h2 className="font-heading font-black text-[#0A0A0A] text-lg mb-1">Welcome back.</h2>
          <p className="text-[#8A8071] text-sm mb-7">Sign in to your command centre.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[#5C5448] text-xs font-heading font-bold uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chiefmuhanelwa@gmail.com"
                required
                disabled={isLoading}
                className="w-full bg-[#FAF7F0] border border-[#E8E1D0] rounded-xl px-4 py-3 text-[#0A0A0A] text-sm placeholder-[#C9C0B0] focus:outline-none focus:border-[#C9A646] focus:ring-1 focus:ring-[#C9A646]/30 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[#5C5448] text-xs font-heading font-bold uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full bg-[#FAF7F0] border border-[#E8E1D0] rounded-xl px-4 py-3 text-[#0A0A0A] text-sm placeholder-[#C9C0B0] focus:outline-none focus:border-[#C9A646] focus:ring-1 focus:ring-[#C9A646]/30 transition-colors disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-heading font-black text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 nc-cta"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Enter the System →'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[#C9C0B0] text-xs mt-6 font-heading">
          NOCHILL PTY LTD · 2016/507839/07
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A646] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
