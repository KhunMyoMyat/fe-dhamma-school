import { Badge } from "@/components/ui/badge"
import { Play, Calendar, Share2, Youtube } from "lucide-react"
import { LessonCard } from "./LessonCard"

export const dynamic = 'force-dynamic'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export default async function LessonsPage() {
  const res = await fetch(`${API_URL}/lessons?published=true`, { cache: 'no-store' })
  const lessons = res.ok ? await res.json() : []

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="bg-maroon text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10 blur-3xl rounded-full bg-gold-light -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10 blur-3xl rounded-full bg-gold translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-4 text-gold-light border-gold-dark bg-gold/10 backdrop-blur-sm px-4 py-1.5 uppercase tracking-widest text-xs font-semibold">
            Buddhist Teachings
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            Dhamma <span className="text-gold">Video</span> Gallery
          </h1>
          <p className="max-w-2xl mx-auto text-yellow-100/70 text-lg md:text-xl font-light font-inter">
            Explore our collection of profound Dhamma lessons, sermons, and meditations 
            brought to you by venerable monks and teachers.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Stats icon={<Youtube className="w-5 h-5 text-red-500" />} label="Free Access" />
            <Stats icon={<Play className="w-5 h-5 text-emerald-500" />} label="Video Lessons" />
            <Stats icon={<Calendar className="w-5 h-5 text-blue-500" />} label="Updated Weekly" />
          </div>
        </div>
      </div>

      {/* Main Gallery */}
      <div className="container mx-auto py-20 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 border-b border-yellow-100 pb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest Uploads</h2>
            <div className="w-20 h-1 bg-yellow-600 mt-2 rounded-full" />
          </div>
          
          <div className="flex gap-2 text-sm">
            <button className="px-4 py-2 rounded-full bg-maroon-800 text-white font-medium shadow-md">All Categories</button>
            <button className="px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-yellow-50 border border-yellow-100 transition-colors">Abhidhamma</button>
            <button className="px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-yellow-50 border border-yellow-100 transition-colors">Sutta</button>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-yellow-50 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-400">Our video library is currently being prepared.</h3>
            <p className="text-gray-400 mt-2">Please come back later for new Dhamma lessons.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {lessons.map((lesson: any) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



function Stats({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all group cursor-default">
      {icon}
      <span className="text-sm font-medium tracking-wide text-yellow-100/90">{label}</span>
    </div>
  )
}
