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
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4A82F] opacity-[0.04] rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#D4A82F] flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(212,168,47,0.25)]">
            <span className="font-heading font-black text-[#111111] text-2xl">N</span>
          </div>
          <h1 className="font-heading font-black text-white text-xl tracking-widest uppercase">NOCHILL</h1>
          <p className="text-[#444] text-xs mt-1 font-heading tracking-wide">Content Intelligence System</p>
        </div>

        {/* Form card */}
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-8">
          <h2 className="font-heading font-black text-white text-lg mb-1">Welcome back.</h2>
          <p className="text-[#555] text-sm mb-7">Sign in to your command centre.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[#888] text-xs font-heading font-bold uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chiefmuhanelwa@gmail.com"
                required
                disabled={isLoading}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#D4A82F] focus:ring-1 focus:ring-[#D4A82F]/30 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[#888] text-xs font-heading font-bold uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#D4A82F] focus:ring-1 focus:ring-[#D4A82F]/30 transition-colors disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#D4A82F] text-[#111111] font-heading font-black text-sm tracking-wide hover:bg-[#D9BC45] transition-all hover:shadow-[0_4px_20px_rgba(212,168,47,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
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

        <p className="text-center text-[#333] text-xs mt-6 font-heading">
          NOCHILL PTY LTD · 2016/507839/07
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A82F] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
