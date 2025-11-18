'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface StoryCardProps {
  story: {
    id: string
    title: string
    description: string
    age_range: string
    themes: string
    culture?: string
    moral?: string
  }
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <Card className="group relative bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* Story Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center text-4xl border-b border-neutral-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-black to-neutral-800 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
          <span className="text-3xl">📖</span>
        </div>
      </div>
      
      <CardHeader className="relative p-5 space-y-2.5">
        <CardTitle className="text-black text-base font-bold leading-tight group-hover:text-neutral-800 transition-colors">
          {story.title}
        </CardTitle>
        <CardDescription className="text-neutral-600 text-sm leading-relaxed line-clamp-2">
          {story.description}
        </CardDescription>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md font-medium border border-neutral-200">
            {story.age_range}
          </span>
          <span className="text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md font-medium border border-neutral-200">
            {story.themes}
          </span>
          {story.culture && (
            <span className="text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md font-medium border border-neutral-200">
              {story.culture}
            </span>
          )}
        </div>
        
        {story.moral && (
          <p className="text-xs text-neutral-500 italic line-clamp-1 pt-1">
            {story.moral}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="relative px-5 pb-5">
        <Link href={`/customer/story/${story.id}`}>
          <Button className="w-full bg-black hover:bg-neutral-900 text-white h-10 text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
