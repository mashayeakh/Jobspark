"use client";

import { motion, useTransform, MotionValue, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingTagProps {
  text: string;
  className?: string;
  highlight?: boolean;
  delay?: number;
  subtext?: string;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  depth?: number;
}

const FloatingTag = ({ 
  text, 
  className, 
  highlight, 
  delay = 0, 
  subtext,
  mouseX,
  mouseY,
  depth = 1
}: FloatingTagProps) => {
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);

  // Calculate individual parallax offsets based on depth
  const xOffset = useTransform(mouseX || fallbackX, (val) => val * depth);
  const yOffset = useTransform(mouseY || fallbackY, (val) => val * depth);

  return (
    <motion.div
      style={{
        x: xOffset,
        y: yOffset,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1,
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.5, delay },
      }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className={cn(
        "absolute flex flex-col items-center justify-center px-[18px] py-[10px] rounded-[8px] bg-white border border-border-gray shadow-[0_2px_4px_rgba(0,0,0,0.05)] cursor-default transition-all duration-300",
        highlight && "ring-[1px] ring-brand border-brand bg-[#FFF5F2] shadow-[0_4px_12px_rgba(231,45,1,0.1)]",
        className
      )}
    >
      <motion.div
        animate={{ 
          y: [0, -4, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.3
        }}
        className="flex flex-col items-center"
      >
        {subtext && <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{subtext}</span>}
        <span className={cn(
          "text-sm font-semibold text-gray-700 whitespace-nowrap",
          highlight && "text-brand"
        )}>
          {text}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default FloatingTag;
