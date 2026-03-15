"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Sprout } from "lucide-react";

// Import Home Components
import { Hero } from "@/components/home/Hero";
import { HomeStats } from "@/components/home/HomeStats";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { CallToAction } from "@/components/home/CallToAction";

export default function HomePage() {
  const { data: courses } = useQuery({
    queryKey: ["courses-active"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/courses/active");
        return data;
      } catch (e) {
        return [];
      }
    },
  });

  const { data: events } = useQuery({
    queryKey: ["events-upcoming"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/events/upcoming");
        return data;
      } catch (e) {
        return [];
      }
    },
  });

  return (
    <div className="flex flex-col gap-0 pb-32 bg-cream/20">
      <Hero />
      <HomeStats />
      <FeaturedCourses courses={courses || []} />
      <UpcomingEvents events={events || []} />
      <CallToAction />

    </div>
  );
}

