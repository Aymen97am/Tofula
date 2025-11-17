'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getStudioStories } from '@/lib/api'

export default function StudioDashboard() {
  const [stories, setStories] = useState([])
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-purple-100 shadow-lg">
        <div className="p-6 border-b border-purple-100">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-xl">🎨</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tofula Studio
            </h1>
          </Link>
        </div>
        <nav className="space-y-2 p-4">
          <Link href="/studio/dashboard">
            <div className="group px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3">
                <span className="text-lg">📚</span>
                <span>Stories</span>
              </div>
            </div>
          </Link>
          <Link href="/studio/story/new">
            <div className="group px-4 py-3 rounded-xl hover:bg-purple-50 text-slate-700 font-medium transition-all duration-300 hover:translate-x-1">
              <div className="flex items-center space-x-3">
                <span className="text-lg">✨</span>
                <span>Create New</span>
              </div>
            </div>
          </Link>
          <Link href="/">
            <div className="group px-4 py-3 rounded-xl hover:bg-purple-50 text-slate-700 font-medium transition-all duration-300 hover:translate-x-1">
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
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
              Story Templates
            </h2>
            <p className="text-slate-600 text-lg">
              Manage and create magical stories for children
            </p>
          </div>
          <Link href="/studio/story/new">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
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
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md" 
              : "border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
            }
          >
            All Stories
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilter('draft')}
            className={filter === 'draft' 
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md" 
              : "border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
            }
          >
            📝 Drafts
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
            className={filter === 'approved' 
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md" 
              : "border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
            }
          >
            ✅ Approved
          </Button>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-md">
                <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg w-3/4 mb-3" />
                <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No stories yet</h3>
            <p className="text-slate-600 mb-6">Create your first magical story template</p>
            <Link href="/studio/story/new">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {story.title}
                  </h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      story.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {story.status === 'approved' ? '✅ Approved' : '📝 Draft'}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{story.description || 'No description'}</p>
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
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
                      className="w-full border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                    >
                      Edit
                    </Button>
                  </Link>
                  {story.status === 'draft' && (
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
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
