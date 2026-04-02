import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AttorneySection from "@/components/sections/AttorneySection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import LatestPostsSection from "@/components/sections/LatestPostsSection";
import LocationSection from "@/components/sections/LocationSection";
import ContactSection from "@/components/sections/ContactSection";
import ScrollSnapManager from "@/components/ScrollSnapManager";

export default function Home() {
  return (
    <main className="relative">
      <ScrollSnapManager />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <AttorneySection />
      <WhyUsSection />
      <TestimonialsSection />
      <LatestPostsSection />
      <LocationSection />
      <ContactSection />
    </main>
  );
}
