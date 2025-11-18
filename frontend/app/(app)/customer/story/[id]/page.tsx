'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import PageShell from '@/components/layout/PageShell'
import CustomizationPanel, { PersonalizationData } from '@/components/stories/CustomizationPanel'
import { getStory, personalizeStory } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    loadStory()
  }, [params.id])

  const loadStory = async () => {
    try {
      const data = await getStory(params.id)
      setStory(data)
    } catch (error) {
      console.error('Failed to load story:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (data: PersonalizationData) => {
    setGenerating(true)
    setGenerationResult(null)
    
    try {
      const result = await personalizeStory(data)
      setGenerationResult(result)
      
      // Show success message
      alert('Story generated successfully! Check your library to view it.')
      
      // Optionally redirect to library
      setTimeout(() => {
        router.push('/customer/library')
      }, 2000)
    } catch (error: any) {
      console.error('Failed to generate story:', error)
      alert(error.response?.data?.detail || 'Failed to generate story. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <PageShell>
        <SiteHeader />
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-stone-200 rounded-xl w-2/3" />
              <div className="h-6 bg-stone-200 rounded-lg w-1/2" />
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <div className="h-6 bg-stone-200 rounded-lg w-full" />
                  <div className="h-6 bg-stone-200 rounded-lg w-5/6" />
                  <div className="h-6 bg-stone-200 rounded-lg w-4/6" />
                </div>
                <div className="h-96 bg-stone-200 rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </PageShell>
    )
  }

  if (!story) {
    return (
      <PageShell>
        <SiteHeader />
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center py-20">
            <div className="text-6xl mb-4">📖</div>
            <h1 className="text-3xl font-bold text-stone-800 mb-4">Story Not Found</h1>
            <p className="text-stone-600 mb-8">
              We couldn't find the story you're looking for.
            </p>
            <Link href="/customer/catalog">
              <Button className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600">
                Browse All Stories
              </Button>
            </Link>
          </div>
        </div>
        <SiteFooter />
      </PageShell>
    )
  }

  return (
    <PageShell>
      <SiteHeader />
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-stone-500">
            <Link href="/customer/catalog" className="hover:text-orange-600">
              Catalog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-stone-800">{story.title}</span>
          </nav>

          {/* Story Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-stone-800 mb-4">{story.title}</h1>
            <p className="text-xl text-stone-600 font-light mb-6">
              {story.description}
            </p>
            
            {/* Meta Tags */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-stone-200">
                <span className="text-stone-500 text-sm">Age:</span>
                <span className="font-medium text-stone-800">{story.age_range}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-stone-200">
                <span className="text-stone-500 text-sm">Themes:</span>
                <span className="font-medium text-stone-800">{story.themes}</span>
              </div>
              {story.culture && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-stone-200">
                  <span className="text-stone-500 text-sm">Culture:</span>
                  <span className="font-medium text-stone-800">{story.culture}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Story Info */}
            <div className="space-y-8">
              {/* Moral */}
              {story.moral && (
                <div className="p-6 bg-white/80 rounded-2xl border border-stone-200">
                  <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
                    Moral of the Story
                  </h3>
                  <p className="text-stone-700 leading-relaxed italic">
                    "{story.moral}"
                  </p>
                </div>
              )}

              {/* Reading Level */}
              {story.reading_level && (
                <div className="p-6 bg-white/80 rounded-2xl border border-stone-200">
                  <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
                    Reading Level
                  </h3>
                  <p className="text-stone-700">{story.reading_level}</p>
                </div>
              )}

              {/* Story Preview */}
              <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200">
                <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-3">
                  About This Story
                </h3>
                <p className="text-stone-700 leading-relaxed">
                  This story template has been carefully crafted by our team. When you personalize it,
                  your child will become the protagonist, and the story will be tailored to include
                  their name, age, and appearance details you provide.
                </p>
              </div>

              {/* Generation Result */}
              {generationResult && (
                <div className="p-6 bg-green-50 rounded-2xl border border-green-200 animate-fadeIn">
                  <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
                    Success! ✨
                  </h3>
                  <p className="text-green-800 mb-4">
                    Your personalized story has been generated and saved to your library!
                  </p>
                  <Link href="/customer/library">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      View in Library
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column - Customization Panel */}
            <div>
              <CustomizationPanel 
                storyId={story.id} 
                onGenerate={handleGenerate}
              />
              
              {/* Beta Notice */}
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Note:</span> The personalization feature is in beta. 
                  Story generation takes 2-3 minutes and creates a fully illustrated, customized PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </PageShell>
  )
}
