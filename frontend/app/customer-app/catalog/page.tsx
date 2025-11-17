'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCatalog } from '@/lib/api'

export default function CatalogPage() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      const data = await getCatalog()
      setStories(data as any[])
    } catch (error) {
      console.error('Failed to load catalog:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-xl">📖</span>
              </div>
              <span className="text-2xl font-bold text-stone-800">
                Tofula
              </span>
            </Link>
            <Link href="/app/library">
              <Button variant="outline" className="border-2 border-stone-300 hover:border-orange-300 hover:bg-orange-50 text-stone-700 rounded-2xl">
                My Library
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2 text-stone-800">Story Catalog</h1>
          <p className="text-stone-600 text-lg font-light">
            Choose a story to personalize for your child
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse bg-white/60 border-stone-200 rounded-3xl overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 rounded-t-3xl" />
                <CardHeader>
                  <div className="h-6 bg-stone-200 rounded-xl w-3/4" />
                  <div className="h-4 bg-stone-200 rounded-lg w-full mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {stories.map((story: any) => (
              <Card key={story.id} className="bg-white/80 border-stone-200 hover:border-orange-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 rounded-t-3xl flex items-center justify-center text-6xl border-b border-stone-200">
                  📖
                </div>
                <CardHeader>
                  <CardTitle className="text-stone-800">{story.title}</CardTitle>
                  <CardDescription className="text-stone-600 font-light">{story.description}</CardDescription>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full font-medium">
                      {story.age_range}
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium">
                      {story.themes}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={`/app/story/${story.id}/customize`}>
                    <Button className="w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl">
                      Customize Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && stories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📚</span>
            </div>
            <p className="text-stone-600 text-lg font-light">
              No stories available yet. Check back soon!
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
