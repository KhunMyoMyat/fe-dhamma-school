"use client";

import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Share2, Youtube } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export function LessonCard({ lesson }: { lesson: any }) {
  const videoUrl = `https://youtube.com/watch?v=${lesson.youtubeId}`;

  const handleCardClick = () => {
    window.open(videoUrl, "_blank");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: lesson.title,
      text:
        lesson.description ||
        "Tune in to this enlightening Dhamma lesson and find peace in the Buddha's teachings.",
      url: videoUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator
        .share(shareData)
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(videoUrl);
      toast.success("Link copied to clipboard!", {
        icon: "📋",
        style: {
          borderRadius: "1rem",
          background: "#333",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gold/20 flex flex-col h-full transform hover:-translate-y-2 cursor-pointer"
    >
      <div className="aspect-video relative overflow-hidden bg-black shrink-0">
        <img
          src={`https://img.youtube.com/vi/${lesson.youtubeId}/maxresdefault.jpg`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://img.youtube.com/vi/${lesson.youtubeId}/mqdefault.jpg`;
          }}
          alt={lesson.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-500 border border-white/30">
            <Play className="fill-current w-6 h-6 ml-1 text-white shadow-2xl" />
          </div>
        </div>

        <Badge className="absolute bottom-1 right-1 bg-maroon text-white border-maroon-light/50 shadow-lg px-3 py-1 text-[10px] uppercase font-bold tracking-widest backdrop-blur-sm font-sans">
          {lesson.category}
        </Badge>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-maroon-700 transition-colors line-clamp-2 md:h-14 leading-relaxed font-padauk-bold mb-3">
          {lesson.title}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-3 mb-6 font-inter font-light">
          {lesson.description ||
            "Tune in to this enlightening Dhamma lesson and find peace in the Buddha's teachings."}
        </p>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium tracking-tight">
            <span className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </span>
            {new Date(lesson.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <div className="flex gap-1">
            <button
              onClick={handleShare}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-yellow-50 hover:text-yellow-700 transition-all border border-transparent hover:border-yellow-200"
              title="Share lesson"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <Link
              href={videoUrl}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-maroon-900 text-xs font-bold rounded-full transition-all flex items-center gap-1 shadow-sm hover:shadow-md"
            >
              Watch Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

