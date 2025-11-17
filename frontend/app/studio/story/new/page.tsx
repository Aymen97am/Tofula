'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewStoryPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    themes: '',
    age_range: '4-6',
    culture: 'universal',
    moral: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/v1/studio/stories/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to generate story')
      }

      const data = await response.json()
      
      // Redirect to the generated story
      if (data.template_id) {
        router.push(`/studio/story/${data.template_id}`)
      } else {
        router.push('/studio/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/studio/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-stone-100 text-stone-600 rounded-xl">← Back to Dashboard</Button>
            </Link>
            <h1 className="text-2xl font-bold text-stone-800">Create New Story</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-3xl">
        <Card className="bg-white/80 border-stone-200 shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="text-stone-800 text-2xl">Story Details</CardTitle>
            <CardDescription className="text-stone-600 font-light">
              Fill in the details below to generate a new story template using AI.
              This may take a minute or two.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-semibold text-stone-700">
                  Story Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g., The Brave Little Explorer"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-stone-800 placeholder:text-stone-400 transition-all duration-300"
                />
              </div>

              {/* Themes */}
              <div className="space-y-2">
                <label htmlFor="themes" className="text-sm font-semibold text-stone-700">
                  Themes *
                </label>
                <input
                  id="themes"
                  name="themes"
                  type="text"
                  required
                  placeholder="e.g., adventure, courage, friendship"
                  value={formData.themes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-stone-800 placeholder:text-stone-400 transition-all duration-300"
                />
                <p className="text-xs text-stone-500 font-light">
                  Comma-separated themes for the story
                </p>
              </div>

              {/* Age Range */}
              <div className="space-y-2">
                <label htmlFor="age_range" className="text-sm font-semibold text-stone-700">
                  Age Range *
                </label>
                <select
                  id="age_range"
                  name="age_range"
                  required
                  value={formData.age_range}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-stone-800 transition-all duration-300"
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
                <label htmlFor="culture" className="text-sm font-semibold text-stone-700">
                  Cultural Context
                </label>
                <input
                  id="culture"
                  name="culture"
                  type="text"
                  placeholder="e.g., universal, japanese, mexican"
                  value={formData.culture}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-stone-800 placeholder:text-stone-400 transition-all duration-300"
                />
                <p className="text-xs text-stone-500 font-light">
                  Cultural or regional context for the story (optional)
                </p>
              </div>

              {/* Moral */}
              <div className="space-y-2">
                <label htmlFor="moral" className="text-sm font-semibold text-stone-700">
                  Moral/Lesson
                </label>
                <textarea
                  id="moral"
                  name="moral"
                  rows={3}
                  placeholder="e.g., Believe in yourself and help others in need"
                  value={formData.moral}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-stone-800 placeholder:text-stone-400 transition-all duration-300"
                />
                <p className="text-xs text-stone-500 font-light">
                  The key lesson or moral of the story (optional)
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4">
                <Link href="/studio/dashboard">
                  <Button type="button" variant="outline" className="border-2 border-stone-300 hover:border-orange-300 hover:bg-orange-50 text-stone-700 rounded-2xl">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={isGenerating}
                  className="min-w-[200px] bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-2xl"
                >
                  {isGenerating ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Generating Story...
                    </>
                  ) : (
                    'Generate Story'
                  )}
                </Button>
              </div>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-5 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl">
              <h4 className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-2">
                <span>ℹ️</span>
                <span>How Story Generation Works</span>
              </h4>
              <ul className="text-sm text-stone-600 space-y-2 font-light">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>AI generates an outline with characters, setting, and plot</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>The story is written with proper pacing and narrative structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Content is moderated for age-appropriateness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Illustration prompts are created for each page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Generation typically takes 1-2 minutes</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
