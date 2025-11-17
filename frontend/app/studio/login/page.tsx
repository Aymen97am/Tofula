'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function StudioLoginPage() {
  const router = useRouter()

  const handleContinue = () => {
    router.push('/studio/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,146,60,0.08),transparent_50%)]"></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-rose-200/15 to-amber-200/15 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-2xl">📖</span>
              </div>
              <h1 className="text-4xl font-bold text-stone-800 tracking-tight">
                Tofula Studio
              </h1>
            </div>
          </Link>
          <p className="text-stone-600 text-base font-light">Premium Story Creation Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-stone-200 p-10">
          <h2 className="text-3xl font-bold mb-2 text-stone-800">Welcome</h2>
          <p className="text-stone-600 mb-8 font-light">Access your creative workspace</p>
          
          <Button
            onClick={handleContinue}
            className="w-full h-14 text-base font-semibold rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Continue to Studio
          </Button>

          <div className="mt-8 pt-8 border-t border-stone-200 text-center">
            <p className="text-sm text-stone-600 font-light">
              Looking for stories?{' '}
              <Link href="/customer-app/catalog" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                Browse catalog
              </Link>
            </p>
          </div>
        </div>

        {/* Subtle Footer Note */}
        <p className="text-center text-stone-500 text-xs mt-6 font-light">
          Demo mode • No authentication required
        </p>
      </div>
    </div>
  )
}
