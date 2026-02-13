"use client";

import { motion } from "framer-motion";
import { useHandGesture } from "../_context/HandGestureContext";
import { useEffect, useRef } from "react";

export default function HandCursor() {
  const { cursorPosition, isPinching, isReady, isActive } = useHandGesture();
  const lastYRef = useRef(cursorPosition.y);

  // Click Logic (Quick Pinch)
  const pinchStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPinching) {
      pinchStartTimeRef.current = Date.now();
    } else {
      // Pinch released
      if (pinchStartTimeRef.current) {
        const duration = Date.now() - pinchStartTimeRef.current;
        if (duration < 300) { // Click threshold
          const element = document.elementFromPoint(cursorPosition.x, cursorPosition.y);
          if (element instanceof HTMLElement) {
            element.click();
            
            // Visual feedback (optional ripple/color change)
            // For now, rely on target element's active state or add animation to cursor
          }
        }
        pinchStartTimeRef.current = null;
      }
    }
  }, [isPinching, cursorPosition]);

  // Global Scroll Logic (hold pinch)
  useEffect(() => {
    if (isPinching) {
      // If pinching for longer than click threshold, treat as scroll/drag
      // But purely checking duration might delay scroll start.
      // Instead, we can check movement threshold.
      
      const deltaY = cursorPosition.y - lastYRef.current;
      const sensitivity = 2.5; 
      
      if (Math.abs(deltaY) > 1) {
        window.scrollBy({ top: deltaY * sensitivity, behavior: "auto" });
      }
    }
    lastYRef.current = cursorPosition.y;
  }, [cursorPosition.y, isPinching]);

  if (!isReady || !isActive) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
      animate={{
        x: cursorPosition.x,
        y: cursorPosition.y,
        scale: isPinching ? 0.8 : 1,
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
        mass: 0.5,
      }}
    >
      {/* Dynamic Cursor Shape */}
      <div 
        className={`w-6 h-6 rounded-full border-2 transition-colors duration-200 ${
          isPinching 
            ? "bg-blue-500 border-white" 
            : "bg-transparent border-blue-500"
        }`}
      />
      {/* Dot in center */}
      <div className="absolute w-1 h-1 bg-blue-500 rounded-full" />
    </motion.div>
  );
}
