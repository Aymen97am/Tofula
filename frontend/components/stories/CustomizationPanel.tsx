'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CustomizationPanelProps {
  storyId: string
  onGenerate: (data: PersonalizationData) => Promise<void>
}

export interface PersonalizationData {
  story_template_id: string
  child_name: string
  age: number
  gender?: string
  skin_tone?: string
  hair_color?: string
  hair_style?: string
}

export default function CustomizationPanel({ storyId, onGenerate }: CustomizationPanelProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PersonalizationData>({
    story_template_id: storyId,
    child_name: '',
    age: 5,
    gender: '',
    skin_tone: '',
    hair_color: '',
    hair_style: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onGenerate(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="sticky top-24 bg-white/90 backdrop-blur-sm border-orange-200 shadow-lg rounded-3xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-2xl text-stone-800">Customize Story</CardTitle>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
            Beta
          </span>
        </div>
        <CardDescription className="text-stone-600">
          Personalize this story for your child
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Child Name */}
          <div className="space-y-2">
            <Label htmlFor="child_name" className="text-sm font-medium text-stone-700">
              Child's Name *
            </Label>
            <Input
              id="child_name"
              type="text"
              required
              value={formData.child_name}
              onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
              placeholder="Enter child's name"
              className="rounded-xl border-stone-300 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-stone-700">
              Age *
            </Label>
            <Input
              id="age"
              type="number"
              required
              min={3}
              max={12}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
              className="rounded-xl border-stone-300 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>

          {/* Gender (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium text-stone-700">
              Gender (optional)
            </Label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full rounded-xl border border-stone-300 focus:border-orange-400 focus:ring-orange-400 px-3 py-2 text-sm"
            >
              <option value="">Select gender</option>
              <option value="boy">Boy</option>
              <option value="girl">Girl</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Appearance Options */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-sm font-medium text-stone-700 mb-3">
              Appearance (optional)
            </h4>
            
            <div className="space-y-4">
              {/* Skin Tone */}
              <div className="space-y-2">
                <Label htmlFor="skin_tone" className="text-xs text-stone-600">
                  Skin Tone
                </Label>
                <Input
                  id="skin_tone"
                  type="text"
                  value={formData.skin_tone}
                  onChange={(e) => setFormData({ ...formData, skin_tone: e.target.value })}
                  placeholder="e.g., light, medium, dark"
                  className="rounded-xl border-stone-300 text-sm"
                />
              </div>

              {/* Hair Color */}
              <div className="space-y-2">
                <Label htmlFor="hair_color" className="text-xs text-stone-600">
                  Hair Color
                </Label>
                <Input
                  id="hair_color"
                  type="text"
                  value={formData.hair_color}
                  onChange={(e) => setFormData({ ...formData, hair_color: e.target.value })}
                  placeholder="e.g., brown, blonde, black"
                  className="rounded-xl border-stone-300 text-sm"
                />
              </div>

              {/* Hair Style */}
              <div className="space-y-2">
                <Label htmlFor="hair_style" className="text-xs text-stone-600">
                  Hair Style
                </Label>
                <Input
                  id="hair_style"
                  type="text"
                  value={formData.hair_style}
                  onChange={(e) => setFormData({ ...formData, hair_style: e.target.value })}
                  placeholder="e.g., curly, straight, short"
                  className="rounded-xl border-stone-300 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl py-6"
          >
            {loading ? (
              <>
                <span className="mr-2">⏳</span>
                Generating Story...
              </>
            ) : (
              <>
                <span className="mr-2">✨</span>
                Generate Personalized Story
              </>
            )}
          </Button>

          <p className="text-xs text-center text-stone-500 italic">
            Story generation typically takes 2-3 minutes
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
