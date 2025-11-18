'use client'

import StudioGuard from '@/components/studio/StudioGuard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewStoryPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    themes: '',
    age_range: '4-6',
    culture: 'universal',
    moral: '',
    child_name: 'Hero',
    age: 6
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)

    try {
      // Get studio password from localStorage for API call
      const studioPassword = 'Tofula@2025'
      
      const response = await fetch('http://localhost:8000/api/v1/studio/stories/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Studio-Password': studioPassword,
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to generate story')
      }

      const data = await response.json()
      
      alert('Story generated successfully! Redirecting to dashboard...')
      router.push('/studio/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      alert(error || 'Failed to generate story')
    } finally {
      setIsGenerating(false)
    }
  }

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
            <Link href="/studio/dashboard" className="flex items-center space-x-3 group">
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
              <div className="px-4 py-3 rounded-2xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 font-medium transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📚</span>
                  <span>Stories</span>
                </div>
              </div>
            </Link>
            
            <Link href="/studio/story/new">
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold shadow-md">
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
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Link 
                href="/studio/dashboard"
                className="text-sm text-stone-500 hover:text-orange-600 transition-colors mb-4 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h2 className="text-4xl font-bold mb-2 text-stone-800">
                Create New Story
              </h2>
              <p className="text-stone-600 text-lg font-light">
                Generate a new story template using AI
              </p>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm border-stone-200 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl text-stone-800">
                  Story Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Themes */}
                  <div className="space-y-2">
                    <Label htmlFor="themes" className="text-sm font-medium text-stone-700">
                      Themes *
                    </Label>
                    <Input
                      id="themes"
                      type="text"
                      required
                      value={formData.themes}
                      onChange={(e) => setFormData({ ...formData, themes: e.target.value })}
                      placeholder="e.g., friendship, courage, adventure"
                      className="rounded-xl border-stone-300 focus:border-orange-400"
                    />
                    <p className="text-xs text-stone-500">
                      Enter one or more themes for the story
                    </p>
                  </div>

                  {/* Age Range */}
                  <div className="space-y-2">
                    <Label htmlFor="age_range" className="text-sm font-medium text-stone-700">
                      Age Range *
                    </Label>
                    <select
                      id="age_range"
                      value={formData.age_range}
                      onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
                      className="w-full rounded-xl border border-stone-300 focus:border-orange-400 focus:ring-orange-400 px-3 py-2"
                    >
                      <option value="3-5">3-5 years</option>
                      <option value="4-6">4-6 years</option>
                      <option value="6-8">6-8 years</option>
                      <option value="8-10">8-10 years</option>
                      <option value="10-12">10-12 years</option>
                    </select>
                  </div>

                  {/* Culture */}
                  <div className="space-y-2">
                    <Label htmlFor="culture" className="text-sm font-medium text-stone-700">
                      Culture
                    </Label>
                    <Input
                      id="culture"
                      type="text"
                      value={formData.culture}
                      onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
                      placeholder="e.g., universal, multicultural"
                      className="rounded-xl border-stone-300 focus:border-orange-400"
                    />
                  </div>

                  {/* Moral */}
                  <div className="space-y-2">
                    <Label htmlFor="moral" className="text-sm font-medium text-stone-700">
                      Moral / Learning Objective
                    </Label>
                    <Input
                      id="moral"
                      type="text"
                      value={formData.moral}
                      onChange={(e) => setFormData({ ...formData, moral: e.target.value })}
                      placeholder="e.g., the importance of honesty"
                      className="rounded-xl border-stone-300 focus:border-orange-400"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full h-14 text-base font-semibold rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <span className="mr-2">⏳</span>
                          Generating Story (2-3 minutes)...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">✨</span>
                          Generate Story Template
                        </>
                      )}
                    </Button>
                    
                    <p className="text-xs text-center text-stone-500 mt-4">
                      This will use the Tofula AI pipeline to create a complete story with illustrations
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </StudioGuard>
  )
}
