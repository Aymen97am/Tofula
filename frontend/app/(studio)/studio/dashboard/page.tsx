'use client'

import StudioGuard from '@/components/studio/StudioGuard'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Note: getStudioStories would need to be implemented with studio auth header
// For now, we'll show a basic dashboard structure

export default function StudioDashboardPage() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('tofula_studio_auth')
    window.location.href = '/studio/login'
  }

  return (
    <StudioGuard>
      <div className="flex min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
        {/* Sidebar */}
        <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-stone-200 shadow-sm">
          <div className="p-6 border-b border-stone-200">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-xl">🎨</span>
              </div>
              <h1 className="text-2xl font-bold text-stone-800">
                Tofula Studio
              </h1>
            </Link>
          </div>
          
          <nav className="space-y-2 p-4">
            <Link href="/studio/dashboard">
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold shadow-md">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📚</span>
                  <span>Stories</span>
                </div>
              </div>
            </Link>
            
            <Link href="/studio/story/new">
              <div className="px-4 py-3 rounded-2xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 font-medium transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">✨</span>
                  <span>Create New</span>
                </div>
              </div>
            </Link>
            
            <div className="pt-4 mt-4 border-t border-stone-200">
              <Link href="/">
                <div className="px-4 py-3 rounded-2xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 font-medium transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🏠</span>
                    <span>Home</span>
                  </div>
                </div>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-2xl hover:bg-red-50 text-stone-600 hover:text-red-600 font-medium transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🚪</span>
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-stone-800">
                Story Templates
              </h2>
              <p className="text-stone-600 text-lg font-light">
                Manage and create premium story experiences
              </p>
            </div>
            <Link href="/studio/story/new">
              <Button 
                size="lg" 
                className="px-8 py-6 text-base rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="mr-2">✨</span>
                Create New Story
              </Button>
            </Link>
          </div>

          {/* Welcome Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg rounded-3xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-stone-800">
                Welcome to Tofula Studio
              </CardTitle>
              <CardDescription className="text-stone-600">
                Your creative workspace for crafting personalized children's stories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 mb-4">
                Use this platform to create new story templates, manage existing ones, 
                and generate personalized storybooks for your customers.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="text-3xl mb-2">🎨</div>
                  <h3 className="font-semibold text-stone-800 mb-1">Create Stories</h3>
                  <p className="text-sm text-stone-600">
                    Generate new story templates using AI
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="text-3xl mb-2">📝</div>
                  <h3 className="font-semibold text-stone-800 mb-1">Edit Templates</h3>
                  <p className="text-sm text-stone-600">
                    Review and refine story content
                  </p>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                  <div className="text-3xl mb-2">✅</div>
                  <h3 className="font-semibold text-stone-800 mb-1">Publish</h3>
                  <p className="text-sm text-stone-600">
                    Approve stories for the public catalog
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/studio/story/new">
              <Card className="bg-white/80 backdrop-blur-sm border-stone-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-3xl cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                    <CardTitle className="text-xl text-stone-800">Create New Story</CardTitle>
                  </div>
                  <CardDescription>
                    Generate a new story template using the AI pipeline
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/customer/catalog">
              <Card className="bg-white/80 backdrop-blur-sm border-stone-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-3xl cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📖</span>
                    </div>
                    <CardTitle className="text-xl text-stone-800">View Catalog</CardTitle>
                  </div>
                  <CardDescription>
                    Browse published stories in the customer catalog
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </main>
      </div>
    </StudioGuard>
  )
}
