'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, ArrowRight } from 'lucide-react'

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
    <div className="min-h-screen bg-[#F4F4F8] flex items-center justify-center px-4 font-display">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#D4D4D8 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          opacity: 0.45,
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#18181B] flex items-center justify-center mb-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
            <span className="font-display font-black text-white text-xl">N</span>
          </div>
          <h1 className="font-display font-black text-[#18181B] text-lg tracking-tight">NOCHILL</h1>
          <p className="text-[#A1A1AA] text-xs mt-1 font-display">Content Intelligence System</p>
        </div>

        {/* Form card */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="font-display font-bold text-[#18181B] text-xl mb-1">Welcome back.</h2>
          <p className="text-[#71717A] text-sm font-display mb-7">Sign in to your command centre.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-display">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[#71717A] text-[11px] font-display font-semibold uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chiefmuhanelwa@gmail.com"
                required
                disabled={isLoading}
                className="w-full bg-[#F9FAFB] border border-[#E4E4E7] rounded-xl px-4 py-3 text-[#18181B] text-sm font-display placeholder-[#A1A1AA] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[#71717A] text-[11px] font-display font-semibold uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full bg-[#F9FAFB] border border-[#E4E4E7] rounded-xl px-4 py-3 text-[#18181B] text-sm font-display placeholder-[#A1A1AA] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-display font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-[0_2px_8px_rgba(37,99,235,0.28)]"
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

        <p className="text-center text-[#A1A1AA] text-xs mt-6 font-display">
          NOCHILL PTY LTD · 2016/507839/07
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F4F8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
