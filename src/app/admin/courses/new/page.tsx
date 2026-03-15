"use client";

import { CourseForm } from "@/components/admin/CourseForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
  return (
    <div className="p-8 md:p-12 space-y-10">
      <div>
        <Link 
          href="/admin/courses" 
          className="inline-flex items-center text-navy/40 hover:text-maroon font-bold text-sm mb-6 transition-colors group"
        >
          <ChevronLeft className="size-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Courses
        </Link>
        <h1 className="text-4xl font-black text-maroon tracking-tight uppercase">
          Create New <span className="text-gold">Course</span>
        </h1>
        <p className="text-navy/50 font-myanmar font-medium">
          သင်တန်းအသစ်တစ်ခုကို စနစ်ထဲသို့ စတင်ထည့်သွင်းခြင်း...
        </p>
      </div>

      <CourseForm />
    </div>
  );
}
