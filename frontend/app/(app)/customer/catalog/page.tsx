'use client'

import { useState, useEffect } from 'react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import PageShell from '@/components/layout/PageShell'
import StoryCard from '@/components/stories/StoryCard'
import { getCatalog } from '@/lib/api'

export default function CatalogPage() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ageFilter, setAgeFilter] = useState<string>('all')

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

  const filteredStories = ageFilter === 'all' 
    ? stories 
    : stories.filter(story => story.age_range === ageFilter)

  const uniqueAgeRanges = ['all', ...Array.from(new Set(stories.map(s => s.age_range)))]

  return (
    <PageShell>
      <SiteHeader />
      
      <main className="container mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-br from-black via-neutral-800 to-neutral-600 bg-clip-text text-transparent tracking-tight">
            Story Catalog
          </h1>
          <p className="text-neutral-600 text-base max-w-2xl leading-relaxed">
            Choose a story template to personalize for your child. Each tale can be customized with their unique details to make them the hero.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-semibold text-neutral-900 mr-2">Age Range:</span>
          {uniqueAgeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setAgeFilter(range)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                ageFilter === range
                  ? 'bg-black text-white shadow-lg scale-105'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:shadow-md'
              }`}
            >
              {range === 'all' ? 'All Ages' : range}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                <div className="h-48 bg-gradient-to-br from-neutral-100 to-neutral-50" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-neutral-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-full" />
                  <div className="h-4 bg-neutral-200 rounded w-5/6" />
                  <div className="flex gap-1.5 pt-2">
                    <div className="h-7 bg-neutral-200 rounded-md w-16" />
                    <div className="h-7 bg-neutral-200 rounded-md w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-lg text-neutral-600 mb-4">No stories found for this age range</p>
            <button
              onClick={() => setAgeFilter('all')}
              className="text-neutral-900 hover:text-neutral-700 font-medium text-sm transition-colors"
            >
              View all stories
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {filteredStories.map((story: any) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredStories.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-500 font-medium">
              Showing {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </PageShell>
  )
}
