"use client";

import { useState } from "react";
import { LessonCard } from "./LessonCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function LessonGallery({ initialLessons }: { initialLessons: any[] }) {
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust as needed

  // Ensure initialLessons is an array even if it comes from a paginated response object
  const lessons = Array.isArray(initialLessons) ? initialLessons : ((initialLessons as any)?.data || []);

  const filteredLessons = lessons.filter((lesson: any) => {
    if (category === "All") return true;
    return lesson.category?.toLowerCase() === category.toLowerCase();
  });

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage) || 1;

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setCurrentPage(1);
  };

  const paginatedLessons = filteredLessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ["All", "Abhidhamma", "Sutta", "Dhamma"];

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 border-b border-yellow-100 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Latest Uploads</h2>
          <div className="w-20 h-1 bg-yellow-600 mt-2 rounded-full" />
        </div>

        <div className="flex flex-wrap gap-2 text-sm justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-colors shadow-sm
                ${
                  category === cat
                    ? "bg-maroon-800 text-gold shadow-md"
                    : "bg-white text-gray-600 hover:bg-yellow-50 border border-yellow-100"
                }`}
            >
              {cat === "All" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-3xl border border-yellow-50 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-400">
            {lessons.length === 0
              ? "Our video library is currently being prepared."
              : "No lessons found for this category."}
          </h3>
          <p className="text-gray-400 mt-2">
            Please come back later for new Dhamma lessons.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedLessons.map((lesson: any) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-16">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-white border border-yellow-100 text-maroon hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`size-10 rounded-full font-medium transition-colors shadow-sm flex items-center justify-center
                      ${
                        currentPage === i + 1
                          ? "bg-maroon-800 border border-maroon text-gold shadow-md"
                          : "bg-white text-gray-600 hover:bg-yellow-50 border border-yellow-100"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-white border border-yellow-100 text-maroon hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
