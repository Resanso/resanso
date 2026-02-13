"use client";

import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { journeyData } from "./data";

// Single rolling digit column - slot machine style
function RollingDigit({ 
  targetDigit, 
  isActive, 
  delay = 0,
  animationKey,
}: { 
  targetDigit: number; 
  isActive: boolean; 
  delay?: number;
  animationKey: number;
}) {
  // Create array of all digits 0-9
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Calculate the Y position to show the target digit
  // Each digit takes 1.15em height
  const yOffset = targetDigit * -1.15; // in em units
  
  return (
    <span className="relative inline-block h-[1.15em] w-[0.65em] overflow-hidden align-top">
      <motion.span
        key={animationKey} // Force remount to restart animation
        className="absolute left-0 top-0 flex flex-col items-center"
        initial={{ y: 0 }} // Always start from 0
        animate={{ 
          y: `${yOffset}em`,
          opacity: isActive ? 1 : 0.3,
        }}
        transition={{
          y: {
            type: "spring",
            stiffness: 80,
            damping: 15,
            delay: delay,
          },
          opacity: { duration: 0.3 }
        }}
      >
        {digits.map((d) => (
          <span key={d} className="flex h-[1.15em] items-center justify-center leading-none">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

// Counting year component with rolling animation
// displayValue: what to show/animate to (can be previous section's value when inactive)
function CountingYear({ 
  // year not used
  displayValue, 
  isActive, 
  sectionIndex 
}: { 
  year: string; 
  displayValue: string; 
  isActive: boolean; 
  sectionIndex: number 
}) {
  // Use displayValue for the animation target
  const digits = displayValue.split("").map(d => parseInt(d, 10));
  
  return (
    <span className="inline-flex">
      {digits.map((digit, i) => (
        <RollingDigit 
          key={i}
          targetDigit={digit}
          isActive={isActive}
          delay={i * 0.08} // Stagger each digit
          animationKey={sectionIndex} // Restart animation when section changes
        />
      ))}
    </span>
  );
}

// Personal photos for each journey period - ganti dengan foto asli Anda
const personalPhotos = [
  "https://picsum.photos/seed/sanzoo2021/600/800", // 2021
  "https://picsum.photos/seed/sanzoo2022/600/800", // 2022
  "https://picsum.photos/seed/sanzoo2023/600/800", // 2023
  "https://picsum.photos/seed/sanzoo2024/600/800", // 2024
];

// Personal photo component with slide animation
function PersonalPhotoDisplay({ currentIndex, isVisible }: { currentIndex: number; isVisible: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Photo frame */}
            <div className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-white bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
              <Image
                src={personalPhotos[currentIndex] ?? personalPhotos[0] ?? ""}
                alt={`Personal photo ${journeyData[currentIndex]?.year}`}
                fill
                className="object-cover"
                sizes="400px"
              />
              
              {/* Caption at bottom */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                  {journeyData[currentIndex]?.year} • Me
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JourneyLabPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for photo visibility and active index
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPhotoVisible, setIsPhotoVisible] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smoother spring animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Each section takes 25% of scroll (4 sections = 100%)
  const sectionSize = 1 / journeyData.length; // 0.25

  // Transform vertical scroll to horizontal movement
  const x = useTransform(smoothProgress, [0, 1], ["0%", `-${(journeyData.length - 1) * 100}%`]);

  // Update active index and photo visibility based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Determine which section we're in
      const sectionIndex = Math.floor(latest / sectionSize);
      const clampedIndex = Math.min(Math.max(sectionIndex, 0), journeyData.length - 1);
      
      // Calculate position within the current section (0 to 1)
      const positionInSection = (latest - clampedIndex * sectionSize) / sectionSize;
      
      // Sweet spot calculation with special handling for first and last sections
      let isInSweetSpot = false;
      if (clampedIndex === 0) {
        // First section: show from start to 85%
        isInSweetSpot = positionInSection <= 0.85;
      } else if (clampedIndex === journeyData.length - 1) {
        // Last section: show from 15% to end
        isInSweetSpot = positionInSection >= 0.15;
      } else {
        // Middle sections: show from 15% to 85%
        isInSweetSpot = positionInSection >= 0.15 && positionInSection <= 0.85;
      }
      
      setActiveIndex(clampedIndex);
      setIsPhotoVisible(isInSweetSpot);
    });
    return unsubscribe;
  }, [scrollYProgress, sectionSize]);

  return (
    <main className="bg-[#FFF8E7]">
      {/* Header */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 text-center">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #d1d5db 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mx-auto mb-8 h-px w-20 bg-gradient-to-r from-transparent via-gray-400 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          <h1 className="mb-6 text-6xl font-bold tracking-tight text-gray-900 md:text-8xl">
            My Journey
          </h1>
          
          <p className="mx-auto max-w-xl text-lg text-gray-600 md:text-xl">
            Scroll down to explore my story through the years
          </p>

          <motion.div
            className="mx-auto mt-8 h-px w-20 bg-gradient-to-r from-transparent via-gray-400 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-gray-500"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <motion.div className="h-12 w-6 rounded-full border border-gray-400 p-1">
              <motion.div
                className="h-2 w-full rounded-full bg-gray-900"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Horizontal Scroll Cinema Section - Extended height for safe scroll */}
      <div ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Horizontal scrolling content */}
          <motion.div
            style={{ x }}
            className="flex h-full"
          >
            {journeyData.map((item, index) => (
              <div
                key={item.id}
                className="relative h-full w-screen flex-shrink-0"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={item.photos[0] ?? ""}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={index === 0}
                  />
                  
                  {/* Cream overlays for readability */}
                  <div className="absolute inset-0 bg-[#FFF8E7]/90" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8E7] via-[#FFF8E7]/80 to-[#FFF8E7]/60" />
                </div>

                {/* Main Content Container */}
                <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-8 md:px-16">
                  <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
                    
                    {/* Left Column - Text */}
                    <div className="flex flex-col justify-center overflow-hidden">
                      {/* Large Year with Date - Animated */}
                      <div className="mb-6 flex items-center gap-6">
                        {/* Year with counting animation */}
                        <div className="text-7xl font-bold text-gray-900 md:text-9xl">
                          <CountingYear 
                            year={item.year}
                            displayValue={activeIndex === index ? item.year : (journeyData[activeIndex]?.year ?? item.year)}
                            isActive={activeIndex === index}
                            sectionIndex={activeIndex}
                          />
                        </div>
                        
                        {/* Month & Day - Column layout on right */}
                        <motion.div 
                          className="flex flex-col items-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: activeIndex === index ? 1 : 0.3,
                            x: activeIndex === index ? 0 : -20,
                          }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                        >
                          <span className="text-sm font-medium uppercase tracking-wider text-gray-500">
                            {activeIndex === index ? item.month : (journeyData[activeIndex]?.month ?? item.month)}
                          </span>
                          <span className="text-3xl font-bold text-gray-800 md:text-4xl">
                            <CountingYear 
                              year={item.day}
                              displayValue={activeIndex === index ? item.day : (journeyData[activeIndex]?.day ?? item.day)}
                              isActive={activeIndex === index}
                              sectionIndex={activeIndex}
                            />
                          </span>
                        </motion.div>
                      </div>

                      {/* Title */}
                      <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
                        {item.title}
                      </h2>

                      {/* Description */}
                      <p className="max-w-md text-base leading-relaxed text-gray-600 md:text-lg">
                        {item.description}
                      </p>
                    </div>

                    {/* Right Column - Photo (only render for active section) */}
                    <div className="flex items-center justify-center">
                      <div className="h-[50vh] w-full max-w-sm overflow-hidden md:h-[60vh] md:max-w-md">
                        {activeIndex === index && (
                          <PersonalPhotoDisplay currentIndex={activeIndex} isVisible={isPhotoVisible} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Progress bar */}
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
            {journeyData.map((item, index) => (
              <div key={index} className="group relative">
                <motion.div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: activeIndex === index ? 48 : 24,
                    backgroundColor: activeIndex === index ? "#1f2937" : "rgba(156,163,175,0.4)",
                  }}
                />
                {/* Tooltip */}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.year}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* End Section */}
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mx-auto mb-6 h-px w-20 bg-gradient-to-r from-transparent via-gray-400 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
          />
          
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-6xl">
            The Journey Continues...
          </h2>
          
          <p className="mx-auto max-w-xl text-lg text-gray-600">
            Every day is a new chapter. Stay tuned for more adventures.
          </p>

          <motion.div
            className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-gray-400 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          />
        </motion.div>
      </section>
    </main>
  );
}
