'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PageShell from '@/components/layout/PageShell'

const STUDIO_PASSWORD = 'Tofula@2025'

export default function StudioLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple password check
    if (password === STUDIO_PASSWORD) {
      // Set auth flag in localStorage
      localStorage.setItem('tofula_studio_auth', '1')
      
      // Redirect to dashboard
      router.push('/studio/dashboard')
    } else {
      setError('Incorrect password')
      setLoading(false)
      setPassword('')
    }
  }

  return (
    <PageShell>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center space-x-3 mb-3 group">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-2xl">🎨</span>
                </div>
                <h1 className="text-4xl font-bold text-stone-800 tracking-tight">
                  Tofula Studio
                </h1>
              </div>
            </Link>
            <p className="text-stone-600 text-base font-light">
              Story Creation Platform
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-stone-200 p-10">
            <h2 className="text-3xl font-bold mb-2 text-stone-800">Studio Access</h2>
            <p className="text-stone-600 mb-8 font-light">
              Enter the studio password to continue
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-stone-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter studio password"
                  className="rounded-xl border-stone-300 focus:border-orange-400 focus:ring-orange-400 h-12"
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-600 mt-2">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full h-14 text-base font-semibold rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Access Studio'}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-stone-200 text-center">
              <p className="text-sm text-stone-600 font-light">
                Looking for stories?{' '}
                <Link href="/customer/catalog" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                  Browse catalog
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link 
              href="/" 
              className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
