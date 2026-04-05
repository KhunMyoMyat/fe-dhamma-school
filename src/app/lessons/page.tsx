import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Share2, Youtube } from "lucide-react";
import { LessonGallery } from "./LessonGallery";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default async function LessonsPage() {
  const res = await fetch(`${API_URL}/lessons?published=true`, {
    cache: "no-store",
  });
  const lessons = res.ok ? await res.json() : [];

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="bg-maroon text-white py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10 blur-3xl rounded-full bg-gold-light -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10 blur-3xl rounded-full bg-gold translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge
            variant="outline"
            className="mb-4 text-gold-light border-gold-dark bg-gold/10 backdrop-blur-sm px-4 py-1.5 uppercase tracking-widest text-xs font-semibold"
          >
            Buddhist Teachings
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            Dhamma <span className="text-gold">Video</span> Gallery
          </h1>
          <p className="max-w-2xl mx-auto text-yellow-100/70 text-lg md:text-xl font-light font-inter">
            Explore our collection of profound Dhamma lessons, sermons, and
            meditations brought to you by venerable monks and teachers.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Stats
              icon={<Play className="w-5 h-5 text-emerald-500" />}
              label="Video Lessons"
            />
          </div>
        </div>
      </div>

      {/* Main Gallery */}
      <LessonGallery initialLessons={lessons} />
    </div>
  );
}

function Stats({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all group cursor-default">
      {icon}
      <span className="text-sm font-medium tracking-wide text-yellow-100/90">
        {label}
      </span>
    </div>
  );
}
