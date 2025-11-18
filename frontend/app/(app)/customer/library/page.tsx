'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import PageShell from '@/components/layout/PageShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUserLibrary } from '@/lib/api'

export default function LibraryPage() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLibrary()
  }, [])

  const loadLibrary = async () => {
    try {
      const data = await getUserLibrary()
      setStories(data as any[])
    } catch (error) {
      console.error('Failed to load library:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <SiteHeader />
      
      <main className="container mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 text-stone-800">My Library</h1>
          <p className="text-stone-600 text-lg font-light">
            Your personalized storybooks, ready to read and share
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white/60 border border-stone-200 rounded-3xl p-6">
                <div className="h-6 bg-stone-200 rounded-xl w-3/4 mb-3" />
                <div className="h-4 bg-stone-200 rounded-lg w-full mb-2" />
                <div className="h-4 bg-stone-200 rounded-lg w-2/3 mb-4" />
                <div className="h-10 bg-stone-200 rounded-2xl w-full" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-3">
              Your library is empty
            </h2>
            <p className="text-stone-600 mb-6 max-w-md mx-auto">
              Start creating personalized stories for your child! Browse our catalog 
              and customize a story to get started.
            </p>
            <Link href="/customer/catalog">
              <Button className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Browse Stories
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story: any) => (
              <Card 
                key={story.id} 
                className="group bg-white/80 backdrop-blur-sm border-stone-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-3xl"
              >
                <CardHeader>
                  <CardTitle className="text-stone-800 group-hover:text-orange-600 transition-colors">
                    {story.title || 'Untitled Story'}
                  </CardTitle>
                  <CardDescription className="text-stone-600">
                    {story.child_name && `For ${story.child_name}`}
                  </CardDescription>
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {story.age && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                        Age {story.age}
                      </span>
                    )}
                    {story.status && (
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        story.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : story.status === 'generating'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {story.status}
                      </span>
                    )}
                  </div>
                  
                  {story.created_at && (
                    <p className="text-xs text-stone-500 mt-2">
                      Created {new Date(story.created_at).toLocaleDateString()}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-2">
                  {story.pdf_url ? (
                    <>
                      <a 
                        href={story.pdf_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button className="w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                          <span className="mr-2">📖</span>
                          View Story
                        </Button>
                      </a>
                      <a 
                        href={story.pdf_url} 
                        download
                        className="block"
                      >
                        <Button 
                          variant="outline" 
                          className="w-full border-2 border-stone-300 hover:border-orange-300 hover:bg-orange-50 text-stone-700 rounded-2xl"
                        >
                          <span className="mr-2">⬇️</span>
                          Download PDF
                        </Button>
                      </a>
                    </>
                  ) : (
                    <Button 
                      disabled 
                      variant="outline" 
                      className="w-full rounded-2xl"
                    >
                      Story not available
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && stories.length > 0 && (
          <div className="mt-8 text-center text-sm text-stone-500">
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} in your library
          </div>
        )}
      </main>

      <SiteFooter />
    </PageShell>
  )
}
