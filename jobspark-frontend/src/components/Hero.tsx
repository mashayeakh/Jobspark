"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import FloatingTag from "./FloatingTag";

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Extremely tight spring for near-instant, high-performance response
  const springConfig = { damping: 40, stiffness: 800, mass: 0.5, restDelta: 0.001 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = -(clientX - innerWidth / 2) / 8;
      const y = -(clientY - innerHeight / 2) / 8;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const tags = [
    { text: "Web3", x: "15%", y: "15%", delay: 0.1, depth: 1.2 },
    { text: "Hardware", x: "25%", y: "10%", delay: 0.3, depth: 0.8 },
    { text: "Robotics", x: "70%", y: "15%", delay: 0.5, highlight: true, depth: 1.5 },
    { text: "Aerospace", x: "60%", y: "10%", delay: 0.7, depth: 0.9 },
    { text: "Artificial Intelligence", x: "50%", y: "25%", delay: 0.2, depth: 1.1 },
    { text: "E-commerce", x: "65%", y: "35%", delay: 0.8, depth: 0.7 },
    { text: "Node JS Developers", x: "75%", y: "28%", delay: 0.4, depth: 1.3 },
    { text: "Front End", x: "85%", y: "25%", delay: 0.6, subtext: "Developers", depth: 1.0 },
    { text: "React Developers", x: "82%", y: "45%", delay: 0.9, depth: 1.4 },
    { text: "iOS Developers", x: "85%", y: "55%", delay: 1.1, depth: 0.8 },
    { text: "Flutter Developers", x: "70%", y: "65%", delay: 1.3, depth: 1.2 },
    { text: "Full Stack", x: "90%", y: "80%", delay: 1.5, subtext: "Developers", depth: 1.6 },
    { text: "Vue JS Developers", x: "68%", y: "82%", delay: 1.7, depth: 0.9 },
    { text: "Los Angeles", x: "45%", y: "90%", delay: 1.2, depth: 1.1 },
    { text: "Databases", x: "32%", y: "88%", delay: 0.5, depth: 0.7 },
    { text: "Blockchain Developers", x: "45%", y: "72%", delay: 1.4, depth: 1.3 },
    { text: "Austin", x: "48%", y: "62%", delay: 0.8, depth: 1.0 },
    { text: "SaaS", x: "33%", y: "65%", delay: 1.0, depth: 1.5 },
    { text: "Seattle", x: "34%", y: "55%", delay: 0.6, depth: 0.8 },
    { text: "Mental Health", x: "25%", y: "73%", delay: 0.9, depth: 1.2 },
    { text: "Cyber Security", x: "12%", y: "68%", delay: 1.6, depth: 1.4 },
    { text: "Android Developers", x: "10%", y: "82%", delay: 1.8, depth: 0.9 },
    { text: "New York", x: "11%", y: "50%", delay: 0.4, depth: 1.1 },
  ];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-white flex items-center justify-center pt-20">
      {/* Central Content */}
      <motion.div 
        style={{
          x: useTransform(smoothX, (val) => val * 0.15),
          y: useTransform(smoothY, (val) => val * 0.15),
        }}
        className="z-10 flex flex-col items-center"
      >
        <div className="flex items-center gap-8 p-12 dashed-border bg-white/50 backdrop-blur-xl shadow-[0_40px_100px_rgba(231,45,1,0.08)] border-brand/20">
          <div className="relative group">
             <div className="w-24 h-24 bg-brand rounded-2xl flex items-center justify-center transform rotate-[-4deg] group-hover:rotate-0 transition-all duration-500 shadow-2xl shadow-brand/30">
                <span className="text-white text-[64px] font-black leading-none select-none">J</span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full border-4 border-white shadow-lg animate-bounce" />
             </div>
          </div>
          <h1 className="text-[72px] font-black tracking-tight text-black leading-tight ml-4">
            Find what's <span className="text-brand">next.</span>
          </h1>
        </div>
      </motion.div>

      {/* Floating Background Tags */}
      <div className="absolute inset-0 pointer-events-none">
        {tags.map((tag, i) => (
          <div
            key={i}
            className="absolute pointer-events-auto"
            style={{ left: tag.x, top: tag.y }}
          >
            <FloatingTag 
              text={tag.text} 
              highlight={tag.highlight} 
              delay={tag.delay} 
              subtext={tag.subtext}
              mouseX={smoothX}
              mouseY={smoothY}
              depth={tag.depth}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
