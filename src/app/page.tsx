"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// Import Home Components
import { Hero } from "@/components/home/Hero";
import { HomeStats } from "@/components/home/HomeStats";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { CallToAction } from "@/components/home/CallToAction";

export default function HomePage() {
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
      <UpcomingEvents events={events?.slice(0, 3) || []} />
      <CallToAction />
    </div>
  );
}

