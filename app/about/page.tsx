import { Metadata } from "next";
import {
  HeroSection,
  StatsSection,
  StorySection,
  ValuesSection,
  MissionSection,
  ContactCTASection,
} from "@/components/about";

import { stats, values, features } from "@/lib/utils/about/about-data";

export const metadata: Metadata = {
  title: "About Us - DecoStore | Premium Home Decoration & Furniture",
  description:
    "Learn about DecoStore's journey in transforming homes with premium carpets, artificial plants, mirrors, lamps and unique decoration items. Discover our story, values, and commitment to quality.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <HeroSection />
      <StatsSection stats={stats} />
      <StorySection features={features} />
      <ValuesSection values={values} />
      <MissionSection />
      <ContactCTASection />
    </div>
  );
}
