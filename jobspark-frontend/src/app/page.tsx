import { HeroSection } from "@/components/ui/modules/Home/Hero/page";
import CompanyMarquee from "@/components/ui/modules/Home/CompanyMarquee/page";
import Features from "@/components/ui/modules/Home/Features/page";
import Stats from "@/components/ui/modules/Home/Stats/page";
import Categories from "@/components/ui/modules/Home/Categories/page";
import Testimonials from "@/components/ui/modules/Home/Testimonials/page";
import FAQ from "@/components/ui/modules/Home/FAQ/page";
import Newsletter from "@/components/ui/modules/Home/Newsletter/page";
import FinalCTA from "@/components/ui/modules/Home/FinalCTA/page";
import Footer from "@/components/ui/modules/Home/Footer/page";
import Image from "next/image";
import ApiTest from '@/components/ui/api-test';
import JobTest from '@/components/ui/job-test';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <HeroSection />

      {/* Company Marquee */}
      <CompanyMarquee />

      {/* Features */}
      <Features />

      {/* Stats */}
      <Stats />

      {/* Categories */}
      <Categories />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* Newsletter */}
      <Newsletter />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />

      <ApiTest />
      <JobTest />
    </div>
  );
}