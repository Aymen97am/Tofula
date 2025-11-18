'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-modern border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-6 lg:px-8 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-black to-neutral-800 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
              <span className="text-lg">✨</span>
              <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </div>
            <h1 className="text-xl font-bold text-black tracking-tight">
              Tofula
            </h1>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Link href="#how-it-works">
              <Button 
                variant="ghost" 
                className="text-neutral-600 hover:text-black hover:bg-neutral-100 h-10 px-5 text-sm font-medium rounded-lg transition-all duration-200"
              >
                How it Works
              </Button>
            </Link>
            <Link href="/customer/catalog">
              <Button 
                className="bg-black hover:bg-neutral-900 text-white h-10 px-5 text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Browse Stories
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
