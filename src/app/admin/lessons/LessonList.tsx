'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { deleteLesson, updateLesson } from "./actions"
import { toast } from "react-hot-toast"
import { Eye, EyeOff, Trash2, Edit2, Play, Calendar, Tag } from "lucide-react"

interface Lesson {
  id: string
  title: string
  description: string | null
  youtubeId: string
  category: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export function LessonList({ lessons: initialLessons }: { lessons: Lesson[] }) {
  const [lessons, setLessons] = useState(initialLessons)
  const [isPending, startTransition] = useTransition()

  const handleTogglePublish = async (lesson: Lesson) => {
    startTransition(async () => {
      const res = await updateLesson(lesson.id, { published: !lesson.published })
      if (res.success && res.lesson) {
        setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, published: !l.published } : l))
        toast.success(`Lesson ${!lesson.published ? 'published' : 'unpublished'}!`)
      } else {
        toast.error(res.error || 'Failed to update lesson')
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    startTransition(async () => {
      const res = await deleteLesson(id)
      if (res.success) {
        setLessons(prev => prev.filter(l => l.id !== id))
        toast.success('Lesson deleted!')
      } else {
        toast.error(res.error || 'Failed to delete lesson')
      }
    })
  }

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
        <YoutubePlaceholder />
        <p className="mt-4 text-gray-500 font-medium font-inter">No lessons found. Start by adding one above.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {lessons.map((lesson) => (
        <Card key={lesson.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-yellow-50 hover:border-yellow-200">
          <CardContent className="p-0 flex flex-col md:flex-row">
            <div className="w-full md:w-64 aspect-video relative overflow-hidden bg-black shrink-0">
              <img 
                src={`https://img.youtube.com/vi/${lesson.youtubeId}/mqdefault.jpg`} 
                alt={lesson.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white">
                  <Play className="fill-current w-6 h-6 ml-1" />
                </div>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 font-medium">
                    <Tag className="w-3 h-3 mr-1" /> {lesson.category}
                  </Badge>
                  {lesson.published ? (
                    <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">
                      <Eye className="w-3 h-3 mr-1" /> Published
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                      <EyeOff className="w-3 h-3 mr-1" /> Draft
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-maroon-800 transition-colors line-clamp-1">{lesson.title}</h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{lesson.description}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center text-xs text-gray-400 gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(lesson.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-mono text-[10px] uppercase">ID: {lesson.youtubeId}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-blue-50 hover:text-blue-600 text-gray-400"
                    onClick={() => handleTogglePublish(lesson)}
                    disabled={isPending}
                  >
                    {lesson.published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-red-50 hover:text-red-600 text-gray-400"
                    onClick={() => handleDelete(lesson.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function YoutubePlaceholder() {
  return (
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
      <div className="w-12 h-12 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
        <Youtube className="text-gray-300 w-8 h-8" />
      </div>
    </div>
  )
}

function Youtube({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  )
}
