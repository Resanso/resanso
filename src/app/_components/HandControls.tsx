"use client";

import { motion } from "framer-motion";
import { useHandGesture } from "../_context/HandGestureContext";
import { Hand, Power } from "lucide-react";
import { usePathname } from "next/navigation";

export default function HandControls() {
  const { isActive, toggleGesture, isReady } = useHandGesture();
  const pathname = usePathname();

  if (pathname !== "/works") return null;

  return (
    <motion.button
      onClick={toggleGesture}
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border transition-all duration-300 backdrop-blur-sm ${
        isActive 
          ? "bg-blue-500/80 text-white border-blue-400" 
          : "bg-transparent text-gray-700 border-gray-200 hover:bg-gray-50"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {isActive ? (
        <>
          <Hand className="w-5 h-5" />
          <span className="text-sm font-medium">Hand Control: ON</span>
        </>
      ) : (
        <>
          <Power className="w-5 h-5" />
          <span className="text-sm font-medium">Start Hand Control</span>
        </>
      )}
      
      {/* Loading Indicator */}
      {isActive && !isReady && (
         <span className="flex h-3 w-3 relative ml-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
         </span>
      )}
    </motion.button>
  );
}
