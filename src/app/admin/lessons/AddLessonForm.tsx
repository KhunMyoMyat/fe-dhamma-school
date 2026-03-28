'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getYoutubeMetadata, createLesson } from "./actions"
import { toast } from "react-hot-toast"
import { Youtube, Loader2, Plus } from "lucide-react"

export function AddLessonForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [metadata, setMetadata] = useState<{
    title: string
    description: string
    thumbnail: string
    videoId: string
  } | null>(null)
  const [category, setCategory] = useState('Dhamma')

  const handleFetchMetadata = async () => {
    if (!url) return
    setLoading(true)
    const res = await getYoutubeMetadata(url)
    setLoading(false)
    if (res.success && res.metadata && res.videoId) {
      setMetadata({
        ...res.metadata,
        videoId: res.videoId
      })
      toast.success('Video metadata fetched!')
    } else {
      toast.error(res.error || 'Failed to fetch video')
    }
  }

  const handleSave = async () => {
    if (!metadata) return
    setLoading(true)
    const res = await createLesson({
      title: metadata.title,
      description: metadata.description,
      youtubeId: metadata.videoId,
      category: category,
      published: false
    })
    setLoading(false)
    if (res.success) {
      toast.success('Lesson created successfully!')
      setIsOpen(false)
      setUrl('')
      setMetadata(null)
    } else {
      toast.error(res.error || 'Failed to save lesson')
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="bg-maroon hover:bg-maroon-light text-white gap-2">
        <Plus className="w-4 h-4" /> Add New Video Lesson
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-gold-light/20">
        <CardHeader className="bg-cream">
          <CardTitle className="text-2xl text-maroon flex items-center gap-2">
            <Youtube className="text-red-600" /> Import from YouTube
          </CardTitle>
          <CardDescription>
            Paste a YouTube video link to automatically import lessons.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex gap-2">
            <Input 
              placeholder="https://www.youtube.com/watch?v=..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleFetchMetadata} disabled={loading || !url} variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-50">
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Fetch'}
            </Button>
          </div>

          {metadata && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                  <img src={metadata.thumbnail} alt="Thumbnail" className="object-cover w-full h-full" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <Input 
                    value={metadata.title} 
                    onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                    placeholder="Lesson Title"
                    className="font-semibold"
                  />
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Category:</span>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Dhamma">Dhamma</option>
                      <option value="Abhidhamma">Abhidhamma</option>
                      <option value="Sutta">Sutta</option>
                      <option value="Pali">Pali</option>
                      <option value="Meditation">Meditation</option>
                    </select>
                  </div>
                </div>
              </div>
              <Textarea 
                value={metadata.description}
                onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                placeholder="Description"
                className="h-32"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-100 pt-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            disabled={!metadata || loading} 
            onClick={handleSave}
            className="bg-maroon hover:bg-maroon-light text-white min-w-[100px]"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Save Lesson'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
