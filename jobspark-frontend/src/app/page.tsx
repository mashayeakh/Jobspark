import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* Trusted By Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#999999] mb-10">Trusted by the worlds best companies</p>
          <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-10 grayscale opacity-40">
            <span className="text-[28px] font-black italic tracking-tighter">Stripe</span>
            <span className="text-[28px] font-black tracking-tighter uppercase">Airbnb</span>
            <span className="text-[28px] font-bold tracking-tighter">Discord</span>
            <span className="text-[28px] font-extrabold tracking-tighter">Medium</span>
            <span className="text-[28px] font-black tracking-tighter">Slack</span>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 text-center">
            <div className="space-y-4">
              <h3 className="text-[64px] font-black tracking-tighter leading-none">130k+</h3>
              <p className="text-[#666666] font-bold uppercase tracking-[0.1em] text-[11px]">Tech Jobs</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-[64px] font-black tracking-tighter leading-none">6M+</h3>
              <p className="text-[#666666] font-bold uppercase tracking-[0.1em] text-[11px]">Matches Made</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-[64px] font-black tracking-tighter leading-none">27k+</h3>
              <p className="text-[#666666] font-bold uppercase tracking-[0.1em] text-[11px]">Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 bg-[#F9FAFB] border-y border-border-gray">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <h2 className="text-[56px] font-black tracking-tight leading-[1.1] text-black">
                Everything you need to <span className="text-brand">land your next role.</span>
              </h2>
              <p className="text-[20px] text-[#444444] leading-relaxed max-w-xl">
                Apply privately to 130,000+ remote and local jobs—from startups to Fortune 500s. See salary and equity upfront before you apply.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <Button className="px-10 h-16 bg-black text-white text-[15px] font-black rounded-xl hover:bg-gray-900 shadow-xl shadow-black/10">
                  Get Started
                </Button>
                <Button variant="outline" className="px-10 h-16 bg-white text-black text-[15px] font-black rounded-xl border border-border-gray hover:bg-gray-50">
                  Browse Jobs
                </Button>
              </div>
            </div>
            <div className="flex-1 w-full max-w-[580px] aspect-[4/3] bg-white rounded-[24px] shadow-[0_32px_64px_rgba(0,0,0,0.08)] border border-border-gray overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.03] to-transparent" />
              <div className="p-10 space-y-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white rounded-[16px] border border-border-gray shadow-sm group-hover:translate-x-1 transition-transform border-none">
                    <CardContent className="p-6 flex items-center gap-6">
                      <div className="w-14 h-14 bg-gray-50 rounded-[12px] flex items-center justify-center">
                        <div className="w-6 h-6 bg-gray-200 rounded-md animate-pulse" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-100 rounded-full w-[40%]" />
                        <div className="h-4 bg-gray-50 rounded-full w-[70%]" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
