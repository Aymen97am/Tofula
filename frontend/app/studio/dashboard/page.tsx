'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getStudioStories } from '@/lib/api'

export default function StudioDashboard() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | undefined>()

  useEffect(() => {
    loadStories()
  }, [filter])

  const loadStories = async () => {
    try {
      const data = await getStudioStories(filter)
      setStories(data as any[])
    } catch (error) {
      console.error('Failed to load stories:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-stone-200 shadow-sm">
        <div className="p-6 border-b border-stone-200">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-xl">📖</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-800">
              Tofula Studio
            </h1>
          </Link>
        </div>
        <nav className="space-y-2 p-4">
          <Link href="/studio/dashboard">
            <div className="group px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <span className="text-lg">📚</span>
                <span>Stories</span>
              </div>
            </div>
          </Link>
          <Link href="/studio/story/new">
            <div className="group px-4 py-3 rounded-2xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 font-medium transition-all duration-300">
              <div className="flex items-center space-x-3">
                <span className="text-lg">✨</span>
                <span>Create New</span>
              </div>
            </div>
          </Link>
          <Link href="/">
            <div className="group px-4 py-3 rounded-2xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 font-medium transition-all duration-300">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🏠</span>
                <span>Home</span>
              </div>
            </div>
          </Link>
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

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          <Button
            variant={filter === undefined ? 'default' : 'outline'}
            onClick={() => setFilter(undefined)}
            className={filter === undefined 
              ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold shadow-md rounded-2xl" 
              : "border-2 border-stone-300 hover:border-orange-300 hover:bg-orange-50 text-stone-700 rounded-2xl"
            }
          >
            All Stories
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilter('draft')}
            className={filter === 'draft' 
              ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold shadow-md rounded-2xl" 
              : "border-2 border-stone-300 hover:border-orange-300 hover:bg-orange-50 text-stone-700 rounded-2xl"
            }
          >
            📝 Drafts
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
            className={filter === 'approved' 
              ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold shadow-md rounded-2xl" 
              : "border-2 border-stone-300 hover:border-orange-300 hover:bg-orange-50 text-stone-700 rounded-2xl"
            }
          >
            ✅ Approved
          </Button>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-stone-200 shadow-sm">
                <div className="h-6 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl w-3/4 mb-3" />
                <div className="h-4 bg-stone-200 rounded-lg w-full mb-2" />
                <div className="h-4 bg-stone-200 rounded-lg w-2/3" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-stone-800 mb-2">No stories yet</h3>
            <p className="text-stone-600 mb-6 font-light">Create your first premium story template</p>
            <Link href="/studio/story/new">
              <Button className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl">
                <span className="mr-2">✨</span>
                Create Your First Story
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story: any) => (
              <div 
                key={story.id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-stone-800 group-hover:text-orange-600 transition-colors">
                    {story.title}
                  </h3>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                      story.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {story.status === 'approved' ? '✅ Approved' : '📝 Draft'}
                  </span>
                </div>
                <p className="text-stone-600 text-sm mb-4 line-clamp-2 font-light">{story.description || 'No description'}</p>
                <div className="flex items-center justify-between text-sm text-stone-500 mb-4">
                  <span className="flex items-center gap-1">
                    <span>👶</span> {story.age_range}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📄</span> {story.pages?.length || 0} pages
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/studio/story/${story.id}/edit`} className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-stone-300 hover:border-orange-300 hover:bg-orange-50 text-stone-700 rounded-2xl"
                    >
                      Edit
                    </Button>
                  </Link>
                  {story.status === 'draft' && (
                    <Button className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-2xl">
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
