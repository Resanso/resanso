"use client";

import { AnimatePresence, motion, useMotionValue, animate, useTransform, useDragControls } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { useHandGesture } from "../_context/HandGestureContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import DetectiveLamp from "./DetectiveLamp";

// Work type definition
import { works, type Work } from "~/data/works";

// Define string connections between works (detective board style - connected network)
const stringConnections = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 0, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 2, to: 5 },
  { from: 5, to: 6 }, // Connecting to new node
  { from: 3, to: 6 },
  { from: 4, to: 7 },
  { from: 6, to: 8 }, // Connecting to last node
  { from: 7, to: 8 },
  { from: 5, to: 8 },
];

// Pin component with forwardRef to get its DOM position
import { forwardRef } from "react";

const Pin = forwardRef<HTMLDivElement, { color?: string }>(({ color = "#dc2626" }, ref) => {
  return (
    <div ref={ref} className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
      <div 
        className="w-5 h-5 rounded-full shadow-lg"
        style={{ 
          backgroundColor: color,
          boxShadow: `0 2px 8px ${color}80, inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)` 
        }}
      />
      <div 
        className="absolute left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gradient-to-b from-gray-400 to-gray-600"
        style={{ top: "14px" }}
      />
    </div>
  );
});
Pin.displayName = "Pin";

// Work Detail Modal
function WorkModal({ 
  work, 
  isOpen, 
  // isPinchHeld,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}: { 
  work: Work | null; 
  isOpen: boolean;
  isPinchHeld: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}) {
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasNext, hasPrev, onNext, onPrev, onClose]);

  if (!work) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop - Click to Close */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
             <button 
               onClick={onClose}
               className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition-colors"
             >
               <X className="w-5 h-5" />
             </button>


            {/* Image */}
            <div className="relative h-64 md:h-80 w-full pointer-events-none">
              <Image
                src={work.image}
                alt={work.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Category badge */}
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  {work.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {work.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {work.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {work.technologies.map((tech) => (
                  <span 
                    key={tech}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Release indicator */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <X className="w-4 h-4" />
                <span>Click outside or release pinch to close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// SVG String connection component
function StringConnection({ 
  x1, y1, x2, y2, delay = 0 
}: { 
  x1: number; y1: number; x2: number; y2: number; delay?: number 
}) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const sag = Math.min(distance * 0.15, 40);
  const controlY = midY + sag;
  const pathD = `M ${x1} ${y1} Q ${midX} ${controlY} ${x2} ${y2}`;
  
  return (
    <motion.path
      d={pathD}
      stroke="#b91c1c"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.7 }}
      transition={{ duration: 1.5, delay, ease: "easeInOut" }}
      style={{
        filter: "drop-shadow(0 1px 2px rgba(185, 28, 28, 0.3))",
      }}
    />
  );
}

export default function Works() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Hand Gesture Integration with two-hand zoom
  const { cursorPosition, isPinching, isReady, isTwoHandPinch, zoomDelta, toggleGesture, isActive } = useHandGesture();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Draggable lamp state
  const dragControls = useDragControls();
  const lampX = useMotionValue(0);
  const lampY = useMotionValue(150); // Initial wire length (lowered)
  const [lampXPercent, setLampXPercent] = useState(50);
  const [lampYPercent, setLampYPercent] = useState(30);

  // Calculate wire transformations based on lamp position
  const wireAngle = useTransform([lampX, lampY], ([x, y]) => {
     // atan2(x, y) gives angle from Y-axis (vertical down)
     return Math.atan2(x as number, y as number) * (180 / Math.PI) * -1;
  });
  const wireHeight = useTransform([lampX, lampY], ([x, y]) => {
     return Math.sqrt((x as number) ** 2 + (y as number) ** 2);
  });

  useEffect(() => {
    const unsubscribeX = lampX.on("change", (latest) => {
      // Convert pixel offset to percentage (0-100)
      const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
      const percent = 50 + (latest / viewportWidth) * 100;
      setLampXPercent(Math.max(10, Math.min(90, percent)));
    });
    
    const unsubscribeY = lampY.on("change", (latest) => {
      const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 900;
      // Map lampY (approx 60-300px) to screen percentage for shadow
      // Base shadow at ~30%, plus offset
      const percent = 30 + ((latest - 60) / viewportHeight) * 100;
      setLampYPercent(Math.max(10, Math.min(90, percent)));
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [lampX, lampY]);
  const prevCursorRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const wasPinchingRef = useRef(false);
  const lastTimeRef = useRef(0);
  
  // Modal state
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  
  // Zoom state for two-hand pinch
  const [zoomLevel, setZoomLevel] = useState(1);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 2.5;
  
  // Navigation state
  const [currentWorkIndex, setCurrentWorkIndex] = useState<number | null>(null);

  // Pin positions for string connections (relative to canvas)
  const [pinPositions, setPinPositions] = useState<{ x: number; y: number }[]>([]);

  // Interaction states for styling
  const [isCanvasDragging, setIsCanvasDragging] = useState(false);
  
  // Calculate if any interaction is happening (Hand or Mouse Drag)
  // Hand drag is active when pinching but not over a specific card
  const isHandDragging = isPinching && hoveredCardIndex === null;
  const isInteracting = isCanvasDragging || isHandDragging;
  
  // Update pin positions after layout
  // No need for refs to calculate positions, use math for stability during zoom
  // Calculate pin positions based on window size and card percentages
  useLayoutEffect(() => {
    const updatePinPositions = () => {
      // Create canvas dimensions based on 200vw/200vh
      const canvasWidth = window.innerWidth * 2;
      const canvasHeight = window.innerHeight * 2;
      
      // Determine card width based on screen size (md breakpoint is 768px)
      // w-56 (224px) for mobile, w-64 (256px) for desktop (md)
      const isMd = window.innerWidth >= 768;
      const cardWidth = isMd ? 256 : 224;
      
      const positions = works.map((work) => {
        const xPercent = parseFloat(work.x);
        const yPercent = parseFloat(work.y);
        
        // Calculate card top-left position
        const cardLeft = (xPercent / 100) * canvasWidth;
        const cardTop = (yPercent / 100) * canvasHeight;
        
        // Pin is at horizontal center of card
        // Pin wrapper is -top-3 (12px). Pin dot is h-5 (20px).
        // Center of pin dot is at -12px + 10px = -2px relative to card top
        return {
          x: cardLeft + cardWidth / 2,
          y: cardTop - 2, 
        };
      });
      setPinPositions(positions);
    };
    
    // Update on mount and resize
    updatePinPositions();
    window.addEventListener("resize", updatePinPositions);
    return () => window.removeEventListener("resize", updatePinPositions);
  }, []); // Only run on mount/resize, independent of zoom level

  // Check if cursor is over a specific card
  const checkCursorOverCard = useCallback(() => {
    if (!isReady) return null;
    
    for (let i = 0; i < cardRefs.current.length; i++) {
      const card = cardRefs.current[i];
      if (card) {
        const rect = card.getBoundingClientRect();
        if (
          cursorPosition.x >= rect.left &&
          cursorPosition.x <= rect.right &&
          cursorPosition.y >= rect.top &&
          cursorPosition.y <= rect.bottom
        ) {
          return i;
        }
      }
    }
    return null;
  }, [cursorPosition, isReady]);

  // Handle two-hand pinch zoom
  useEffect(() => {
    if (!isReady) return;
    
    if (isTwoHandPinch && zoomDelta !== 0) {
      setZoomLevel((prev) => {
        const newZoom = prev + zoomDelta * 0.5; // Adjust sensitivity
        return Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
      });
    }
  }, [isTwoHandPinch, zoomDelta, isReady]);

  // Handle pinch gesture for modal (only if not two-hand pinching)
  useEffect(() => {
    if (!isReady || isTwoHandPinch) return;

    const cardIndex = checkCursorOverCard();
    setHoveredCardIndex(cardIndex);

    // Open modal when pinch starts over a card
    if (isPinching && !wasPinchingRef.current && cardIndex !== null) {
      const work = works[cardIndex];
      if (work) {
        setSelectedWork(work);
        setCurrentWorkIndex(cardIndex);
        setIsModalOpen(true);
      }
    }
    
    // Close modal when pinch is released
    if (!isPinching && wasPinchingRef.current && isModalOpen) {
      setIsModalOpen(false);
      // Small delay before clearing selected work for exit animation
      setTimeout(() => setSelectedWork(null), 300);
    }
  }, [isPinching, isReady, checkCursorOverCard, isModalOpen, isTwoHandPinch]);

  // Canvas drag gesture handling (disabled during two-hand zoom)
  useEffect(() => {
    if (!isReady || !containerRef.current || isModalOpen || isTwoHandPinch) return;

    const rect = containerRef.current.getBoundingClientRect();
    const isOverContainer = 
      cursorPosition.x >= rect.left && 
      cursorPosition.x <= rect.right &&
      cursorPosition.y >= rect.top && 
      cursorPosition.y <= rect.bottom;

    const currentTime = performance.now();
    const dt = currentTime - lastTimeRef.current;

    // Only drag if not over a card (to allow card pinch to open modal)
    const isOverCard = hoveredCardIndex !== null;

    if (isPinching && !isOverCard) {
      if (!wasPinchingRef.current) {
        x.stop();
        y.stop();
      }

      if (isOverContainer) {
        const dx = cursorPosition.x - prevCursorRef.current.x;
        const dy = cursorPosition.y - prevCursorRef.current.y;

        if (Math.abs(dx) > 100 || Math.abs(dy) > 100) {
          velocityRef.current = { x: 0, y: 0 };
          prevCursorRef.current = cursorPosition;
          lastTimeRef.current = currentTime;
          wasPinchingRef.current = isPinching;
          return;
        }
        
        x.set(x.get() + dx * 1.5);
        y.set(y.get() + dy * 1.5);

        if (dt > 0 && dt < 100) {
          let vx = (dx * 1.5) / (dt / 1000);
          let vy = (dy * 1.5) / (dt / 1000);

          const MAX_VELOCITY = 3000;
          vx = Math.min(Math.max(vx, -MAX_VELOCITY), MAX_VELOCITY);
          vy = Math.min(Math.max(vy, -MAX_VELOCITY), MAX_VELOCITY);

          velocityRef.current = { x: vx, y: vy };
        }
      }
    } else if (!isPinching) {
      if (wasPinchingRef.current && !isOverCard) {
        const power = 0.8;
        const bounceStiffness = 200;
        const bounceDamping = 40;

        animate(x, x.get() + velocityRef.current.x * power, {
          type: "inertia",
          velocity: velocityRef.current.x,
          power: power,
          timeConstant: 300,
          bounceStiffness,
          bounceDamping,
          min: -1000,
          max: 1000,
        });
        
        animate(y, y.get() + velocityRef.current.y * power, {
          type: "inertia",
          velocity: velocityRef.current.y,
          power: power,
          timeConstant: 300,
          bounceStiffness,
          bounceDamping,
          min: -1000,
          max: 1000,
        });
      }
    }
    
    prevCursorRef.current = cursorPosition;
    wasPinchingRef.current = isPinching;
    lastTimeRef.current = currentTime;

  }, [cursorPosition, isPinching, isReady, x, y, isModalOpen, hoveredCardIndex, isTwoHandPinch]);

  // Pin colors for variety
  const pinColors = ["#dc2626", "#ea580c", "#d97706", "#65a30d", "#0891b2", "#7c3aed", "#db2777", "#dc2626"];

  // Reset zoom with double pinch (optional helper)
  // const resetZoom = () => setZoomLevel(1);

  // Header text state
  const [headerText, setHeaderText] = useState("Tap here to back");

  // Revert header text to title after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeaderText("Selected Works");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Navigation Logic
  const scrollToWork = (index: number) => {
    const position = pinPositions[index];
    if (!position || !canvasRef.current) return;

    // Calculate canvas dimensions
    const canvasWidth = window.innerWidth * 2;
    const canvasHeight = window.innerHeight * 2;
    
    // Target position to center the work
    // We want the work position (position.x, position.y) to be at the center of the viewport
    // Canvas center is at (canvasWidth/2, canvasHeight/2)
    // To move point P to center, we need to translate by (Center - P)
    // But since our reference frame is the canvas center (due to origin-center), 
    // and x/y translate the canvas...
    // Let's assume x=0, y=0 centers the canvas.
    // If we want pin at (Px, Py) to be effectively at (CW/2, CH/2)...
    // We need to shift canvas by (CW/2 - Px, CH/2 - Py).
    
    const targetX = (canvasWidth / 2) - position.x;
    const targetY = (canvasHeight / 2) - position.y + 100; // +100 to push it down a bit (visual balance)

    animate(x, targetX, { type: "spring", stiffness: 200, damping: 25 });
    animate(y, targetY, { type: "spring", stiffness: 200, damping: 25 });
    // Also reset zoom for better view
    // setZoomLevel(1); 
  };

  const handleNext = () => {
    let nextIndex = 0;
    if (currentWorkIndex !== null) {
      nextIndex = (currentWorkIndex + 1) % works.length;
    }
    setCurrentWorkIndex(nextIndex);
    
    // If modal is open, switch content
    if (isModalOpen) {
       const nextWork = works[nextIndex];
       if (nextWork) setSelectedWork(nextWork);
    } else {
       // If modal closed, just scroll to it
       scrollToWork(nextIndex);
    }
  };

  const handlePrev = () => {
    let prevIndex = works.length - 1;
    if (currentWorkIndex !== null) {
      prevIndex = (currentWorkIndex - 1 + works.length) % works.length;
    }
    setCurrentWorkIndex(prevIndex);

    if (isModalOpen) {
       const prevWork = works[prevIndex];
       if (prevWork) setSelectedWork(prevWork);
    } else {
       scrollToWork(prevIndex);
    }
  };

  return (
    <>
      {/* ... WorkModal ... */}
      <WorkModal 
        work={selectedWork} 
        isOpen={isModalOpen} 
        isPinchHeld={isPinching && isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={true}
        hasPrev={true}
      />

      <section className="relative h-screen w-full bg-[#FFF8E7] overflow-hidden">
        
        {/* ... Cork board ... */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Detective Hanging Lamp System */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 z-[5] pointer-events-none">
          {/* Fixed Ceiling Mount */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-800 rounded-b-md z-10 shadow-lg" />

          {/* Dynamic Wire */}
          <motion.div
            className="absolute top-0 left-1/2 w-[4px] bg-gradient-to-b from-gray-700 to-gray-900 origin-top shadow-sm -translate-x-1/2"
            style={{
              height: wireHeight,
              rotate: wireAngle,
            }}
          />

          {/* Draggable Lamp Head */}
          <motion.div 
            className="absolute top-0 flex flex-col items-center pointer-events-none"
            style={{ 
              x: lampX,
              y: lampY,
              // translateX: "-50%", // Removed, handled by parent center
              rotate: wireAngle,
              transformOrigin: "top center",
              // left: "50%", // Removed, parent is already centered
              translateX: "-50%", // Keep this to center the head itself? Yes if width > 0.
            }}
            drag
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ left: -300, right: 300, top: 60, bottom: 400 }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragEnd={() => {
              animate(lampX, 0, { type: "spring", stiffness: 40, damping: 10, mass: 1.5 });
              animate(lampY, 150, { type: "spring", stiffness: 60, damping: 15, mass: 1 });
            }}
          >
            {/* Lamp Head - Handle for dragging */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="cursor-grab active:cursor-grabbing touch-none pointer-events-auto"
            >
              <DetectiveLamp shadeWidth={130} />
            </div>

            {/* Light cone — expands downward */}
            <div
              className="w-[600px] md:w-[800px] -mt-10 pointer-events-none"
              style={{
                height: "85vh",
                background: "linear-gradient(180deg, rgba(255,200,100,0.15) 0%, rgba(255,200,100,0.06) 30%, rgba(255,200,100,0.02) 60%, transparent 100%)",
                clipPath: "polygon(42% 0%, 58% 0%, 90% 100%, 10% 100%)",
              }}
            />
          </motion.div>
        </div>

        {/* Dynamic shadow — clears where lamp light falls */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: `radial-gradient(ellipse 50% 80% at ${lampXPercent}% ${lampYPercent}%, transparent 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.65) 100%)`,
          }}
        />
        {/* Top shadow (under ceiling) */}
        <div
          className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[1]"
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)`,
          }}
        />

        {/* Header text overlay (Dynamic Island Style) */}
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <motion.div 
            className="bg-black text-white px-12 pt-32 pb-6 -mt-28 rounded-b-[2.5rem] shadow-2xl flex items-center justify-center pointer-events-auto min-w-[300px] cursor-pointer hover:bg-neutral-900 transition-colors"
            initial={{ y: -100 }}
            animate={{ y: isInteracting ? -300 : 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/")}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.h2 
              key={headerText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl font-bold tracking-widest uppercase"
            >
              {headerText}
            </motion.h2>
          </motion.div>
        </div>


        {/* Draggable Canvas Window */}
        <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden z-0">
          <motion.div
            ref={canvasRef}
            drag={!isModalOpen && !isTwoHandPinch}
            dragConstraints={{ left: -800 * zoomLevel, right: 800 * zoomLevel, top: -800 * zoomLevel, bottom: 800 * zoomLevel }}
            onDragStart={() => setIsCanvasDragging(true)}
            onDragEnd={() => setIsCanvasDragging(false)}
            className="relative w-[200vw] h-[200vh] -ml-[50vw] -mt-[50vh] origin-center"
            style={{ x, y, scale: zoomLevel }}
            animate={{ scale: zoomLevel }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* SVG layer for strings */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {stringConnections.map((connection, index) => {
                const from = pinPositions[connection.from];
                const to = pinPositions[connection.to];
                
                // Only render if positions are available
                if (!from || !to) return null;
                
                return (
                  <StringConnection
                    key={index}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    delay={index * 0.1}
                  />
                );
              })}
            </svg>

            {/* Work cards */}
            {works.map((work, index) => (
              <motion.div
                key={work.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className={`absolute group w-56 md:w-64 bg-white p-2 rounded-lg shadow-lg transition-shadow duration-300 ${
                  hoveredCardIndex === index ? "ring-2 ring-blue-400 shadow-2xl" : "hover:shadow-2xl"
                }`}
                style={{
                  left: work.x,
                  top: work.y,
                  rotate: work.rotate,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: hoveredCardIndex === index ? 1.05 : 1,
                  zIndex: hoveredCardIndex === index ? 50 : 1,
                }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                   setSelectedWork(work);
                   setCurrentWorkIndex(index);
                   setIsModalOpen(true);
                }}
                whileHover={{ 
                  scale: 1.05, 
                  zIndex: 50,
                  rotate: 0,
                  cursor: "pointer"
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Pin with ref for connection alignment */}
                <Pin 
                  ref={(el) => { 
                    pinRefs.current[index] = el; 
                    // Set color based on index
                  }}
                  color={pinColors[index % pinColors.length]} 
                />
                
                {/* Pinch indicator - Updated to include Click */}
                {hoveredCardIndex === index && (
                  <motion.div 
                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-30"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Click or Pinch to view
                  </motion.div>
                )}
                
                {/* Card content */}
                <div className="relative h-32 md:h-40 w-full mb-2 overflow-hidden rounded-md pointer-events-none">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight select-none">{work.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm select-none">{work.category}</p>
                
                {/* Tape effect on corners */}
                <div className="absolute -top-1 -left-1 w-8 h-4 bg-yellow-200/70 rotate-[-15deg] shadow-sm pointer-events-none" />
                <div className="absolute -top-1 -right-1 w-8 h-4 bg-yellow-200/70 rotate-[15deg] shadow-sm pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CONTROL DOCK (Mobile & Mouse Friendly) */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-wrap items-center justify-center gap-2 md:gap-4 max-w-[95vw]">
           {/* Hand Gesture Toggle */}
           <button 
             onClick={toggleGesture}
             className={`h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ${
                isActive 
                  ? "bg-blue-500 text-white shadow-blue-500/30" 
                  : "bg-white text-gray-400 hover:text-gray-900"
             }`}
             title={isActive ? "Disable Hand Gestures" : "Enable Hand Gestures"}
           >
              {isActive ? (
                <div className="relative">
                   <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border border-blue-500" />
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
                </div>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
              )}
           </button>

           {/* Navigation Buttons */}
           <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-xl border border-gray-200">
             <button 
               onClick={handlePrev}
               className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-700"
               aria-label="Previous work"
             >
                <ChevronLeft className="w-5 h-5" />
             </button>
             <button 
               onClick={handleNext}
               className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-700"
               aria-label="Next work"
             >
                <ChevronRight className="w-5 h-5" />
             </button>
           </div>

            {/* Zoom Controls */}
           <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-xl border border-gray-200">
              <button 
                onClick={() => setZoomLevel(z => Math.max(z - 0.2, MIN_ZOOM))}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-700"
                aria-label="Zoom Out"
              >
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
              <span className="w-12 text-center text-xs font-mono font-medium text-gray-500 select-none">
                 {Math.round(zoomLevel * 100)}%
              </span>
              <button 
                onClick={() => setZoomLevel(z => Math.min(z + 0.2, MAX_ZOOM))}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-700"
                 aria-label="Zoom In"
              >
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
           </div>

            {/* Reset View Button */}
           <button 
             onClick={() => {
                setZoomLevel(1);
                x.set(0);
                y.set(0);
             }}
             className="h-10 md:h-12 px-4 md:px-6 flex items-center gap-2 bg-neutral-900 text-white rounded-full shadow-xl hover:bg-neutral-800 active:scale-95 transition-all font-medium text-xs md:text-sm"
           >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              <span>Reset</span>
           </button>
        </div>

      </section>
    </>
  );
}
