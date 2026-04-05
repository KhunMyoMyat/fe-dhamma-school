import { AddLessonForm } from "./AddLessonForm";
import { LessonList } from "./LessonList";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default async function AdminLessonsPage() {
  const res = await fetch(`${API_URL}/lessons`, { cache: "no-store" });
  const lessons = res.ok ? await res.json() : [];

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row md:items-start lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-yellow-600 border-yellow-200 bg-yellow-50"
            >
              Admin Panel
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-maroon tracking-tight">
            Video Management <span className="text-gold">System</span>
          </h1>
          <p className="mt-2 text-gray-500 max-w-md">
            Easily manage your YouTube lessons, categorize them and control
            publication status.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <AddLessonForm />
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Recent Lessons
          </h2>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {lessons.length} Total
          </Badge>
        </div>

        <LessonList lessons={JSON.parse(JSON.stringify(lessons))} />
      </div>
    </div>
  );
}
