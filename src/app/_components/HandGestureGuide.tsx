"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HandGestureGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

// Cross-fade animation between open hand and pinch hand
function PinchCrossfade() {
  return (
    <div className="relative w-16 h-16">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.4, 0.8, 0.9] }}
      >
        <Image
          src="/images/gestures/hand-prepinch.png"
          alt="Hand pre-pinch"
          width={64}
          height={64}
          className="object-contain"
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.4, 0.8, 0.9] }}
      >
        <Image
          src="/images/gestures/hand-pinch.png"
          alt="Hand pinch"
          width={64}
          height={64}
          className="object-contain"
        />
      </motion.div>
    </div>
  );
}

// Zoom gesture: two pinch hands moving together and apart
function ZoomGesture() {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Left hand (mirrored pinch) */}
      <motion.div
        className="absolute"
        animate={{ x: [-20, -12, -20] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/images/gestures/hand-pinch.png"
          alt="Left hand pinch"
          width={40}
          height={40}
          className="object-contain scale-x-[-1]"
        />
      </motion.div>
      {/* Right hand (original pinch) */}
      <motion.div
        className="absolute"
        animate={{ x: [20, 12, 20] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/images/gestures/hand-pinch.png"
          alt="Right hand pinch"
          width={40}
          height={40}
          className="object-contain"
        />
      </motion.div>
    </div>
  );
}

const gestures = [
  {
    title: "Move Cursor",
    description: "Show your open hand and move it around to control the cursor on screen",
    image: "/images/gestures/hand-open.png",
    animation: {
      x: [0, 8, -5, 0],
      y: [0, -6, 4, 0],
    },
    duration: 3,
    custom: false,
  },
  {
    title: "Pinch to Select",
    description: "Touch your thumb and index finger together over a card to open it",
    image: "",
    animation: {},
    duration: 2.5,
    custom: true,
    customComponent: <PinchCrossfade />,
  },
  {
    title: "Drag Board",
    description: "Pinch on empty space and move your hand to pan the investigation board",
    image: "/images/gestures/hand-pinch.png",
    animation: {
      x: [0, 12, 0],
    },
    duration: 2.5,
    custom: false,
  },
  {
    title: "Zoom",
    description: "Pinch with both hands and move them together to zoom out, apart to zoom in",
    image: "",
    animation: {},
    duration: 2,
    custom: true,
    customComponent: <ZoomGesture />,
  },
];

export default function HandGestureGuide({ isOpen, onClose }: HandGestureGuideProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-white/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-2 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Gesture Controls</h3>
              <p className="text-xs text-gray-500">Enable camera access to interact</p>
            </div>

            {/* Gesture Grid */}
            <div className="px-6 py-4 grid grid-cols-2 gap-3">
              {gestures.map((gesture, i) => (
                <motion.div
                  key={gesture.title}
                  className="flex flex-col items-center text-center p-4 rounded-xl border border-gray-100 bg-gray-50/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {/* Animated hand image */}
                  <div className="w-16 h-16 flex items-center justify-center mb-3">
                    {gesture.custom && gesture.customComponent ? (
                      gesture.customComponent
                    ) : (
                      <motion.div
                        animate={gesture.animation}
                        transition={{
                          duration: gesture.duration,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Image
                          src={gesture.image}
                          alt={gesture.title}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Text */}
                  <div className="w-full">
                    <h4 className="text-xs font-semibold text-gray-900 mb-1">{gesture.title}</h4>
                    <p className="text-[10px] text-gray-500 leading-tight">{gesture.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 bg-black text-white rounded-lg font-medium text-xs hover:bg-gray-800 transition-colors"
              >
                Start Exploring
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
