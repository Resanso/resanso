"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

interface HandData {
  position: { x: number; y: number };
  isPinching: boolean;
}

interface HandGestureContextProps {
  cursorPosition: { x: number; y: number };
  isPinching: boolean;
  isReady: boolean;
  error: string | null;
  isActive: boolean;
  toggleGesture: () => void;
  // Two-hand zoom support
  hands: HandData[];
  isTwoHandPinch: boolean;
  twoHandDistance: number;
  zoomDelta: number;
}

const HandGestureContext = createContext<HandGestureContextProps | undefined>(undefined);

export function HandGestureProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Two-hand tracking
  const [hands, setHands] = useState<HandData[]>([]);
  const [isTwoHandPinch, setIsTwoHandPinch] = useState(false);
  const [twoHandDistance, setTwoHandDistance] = useState(0);
  const [zoomDelta, setZoomDelta] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);

  // Smoothing variables
  const lastCursorRef = useRef({ x: 0, y: 0 });
  const isPinchingRef = useRef(false);
  const lastTwoHandDistRef = useRef(0);
  const wasTwoHandPinchRef = useRef(false);
  
  const toggleGesture = () => {
    setIsActive((prev) => !prev);
  }

  useEffect(() => {
    async function init() {
      try {
        if (!handLandmarkerRef.current) {
           const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
           );
           
           // Enable 2 hands detection
           handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
             baseOptions: {
               modelAssetPath: "/models/hand_landmarker.task",
               delegate: "GPU",
             },
             runningMode: "VIDEO",
             numHands: 2, // Changed from 1 to 2
           });
        }

        if (isActive && (!videoRef.current?.srcObject)) {
           const stream = await navigator.mediaDevices.getUserMedia({ video: true });
           if (videoRef.current) {
             videoRef.current.srcObject = stream;
           }
        }
        
        setIsReady(true);
      } catch (err: unknown) {
        console.error("Failed to init MediaPipe:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage || "Failed to initialize camera or model");
      }
    }

    if (isActive) {
      document.body.classList.add("camera-active");
      void init();
    } else {
        document.body.classList.remove("camera-active");
        
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }

        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
    
    return () => {
         if (requestRef.current) {
             cancelAnimationFrame(requestRef.current);
         }
         // Copy ref to variable for cleanup
         const videoElement = videoRef.current;
         if (videoElement?.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
         }
    };
  }, [isActive]);



  const predictWebcam = useCallback(() => {
    if (!isActive || !handLandmarkerRef.current || !videoRef.current) {
         return; 
    }
    
    const startTimeMs = performance.now();
    const result = handLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

    const detectedHands: HandData[] = [];
    
    if (result.landmarks && result.landmarks.length > 0) {
      // Process each detected hand
      for (const landmarks of result.landmarks) {
        if (!landmarks) continue;

        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        const palmCenter = landmarks[9] ?? landmarks[0];
        
        if (indexTip && thumbTip && middleTip && ringTip && pinkyTip && palmCenter) {
          // Calculate pinch
          const dx = indexTip.x - thumbTip.x;
          const dy = indexTip.y - thumbTip.y;
          const pinchDist = Math.sqrt(dx * dx + dy * dy);
          const isPinchingDetected = pinchDist < 0.05;
          
          // Calculate position
          const posX = (1 - palmCenter.x) * window.innerWidth;
          const posY = palmCenter.y * window.innerHeight;
          
          detectedHands.push({
            position: { x: posX, y: posY },
            isPinching: isPinchingDetected,
          });
        }
      }
      
      // Update hands state
      setHands(detectedHands);
      
      // Check for two-hand pinch zoom
      if (detectedHands.length === 2 && detectedHands[0]?.isPinching && detectedHands[1]?.isPinching) {
        const hand1 = detectedHands[0];
        const hand2 = detectedHands[1];
        
        // Calculate distance between two hands
        const distX = hand1.position.x - hand2.position.x;
        const distY = hand1.position.y - hand2.position.y;
        const currentDist = Math.sqrt(distX * distX + distY * distY);
        
        setTwoHandDistance(currentDist);
        setIsTwoHandPinch(true);
        
        // Calculate zoom delta (positive = zoom in, negative = zoom out)
        if (wasTwoHandPinchRef.current && lastTwoHandDistRef.current > 0) {
          const delta = currentDist - lastTwoHandDistRef.current;
          // Normalize delta and add some smoothing
          const normalizedDelta = delta / 100; // Scale down for reasonable zoom speed
          setZoomDelta(normalizedDelta);
        }
        
        lastTwoHandDistRef.current = currentDist;
        wasTwoHandPinchRef.current = true;
        
        // Don't process single-hand gestures when doing two-hand zoom
        return requestRef.current = requestAnimationFrame(predictWebcam);
      } else {
        // Reset two-hand state
        if (wasTwoHandPinchRef.current) {
          setIsTwoHandPinch(false);
          setZoomDelta(0);
          lastTwoHandDistRef.current = 0;
          wasTwoHandPinchRef.current = false;
        }
      }
      
      // Process primary hand (first detected) for single-hand gestures
      const primaryLandmarks = result.landmarks[0]; 
      if (primaryLandmarks) {
        const indexTip = primaryLandmarks[8];
        const thumbTip = primaryLandmarks[4];
        const middleTip = primaryLandmarks[12];
        const ringTip = primaryLandmarks[16];
        const pinkyTip = primaryLandmarks[20];
        
        if (indexTip && thumbTip && middleTip && ringTip && pinkyTip) {
            const indexPip = primaryLandmarks[6];
            const middlePip = primaryLandmarks[10];
            const ringPip = primaryLandmarks[14];
            const pinkyPip = primaryLandmarks[18];

            let isTwoFingers = false;

            if (indexPip && middlePip && ringPip && pinkyPip) {
                const isIndexExt = indexTip.y < indexPip.y; 
                const isMiddleExt = middleTip.y < middlePip.y;
                const isRingFolded = ringTip.y > ringPip.y;
                const isPinkyFolded = pinkyTip.y > pinkyPip.y;
                
                isTwoFingers = isIndexExt && isMiddleExt && isRingFolded && isPinkyFolded;
            }
            
            const dx = indexTip.x - thumbTip.x;
            const dy = indexTip.y - thumbTip.y;
            const pinchDist = Math.sqrt(dx * dx + dy * dy);

            const palmCenter = primaryLandmarks[9] ?? primaryLandmarks[0];
            if (!palmCenter) return requestRef.current = requestAnimationFrame(predictWebcam);

            let rawX = (1 - palmCenter.x) * window.innerWidth;
            let rawY = palmCenter.y * window.innerHeight;

            let deltaX = rawX - lastCursorRef.current.x;
            let deltaY = rawY - lastCursorRef.current.y;
            let movementDist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const MAX_FRAME_MOVE = 80;

            if (movementDist > MAX_FRAME_MOVE) {
                const ratio = MAX_FRAME_MOVE / movementDist;
                rawX = lastCursorRef.current.x + deltaX * ratio;
                rawY = lastCursorRef.current.y + deltaY * ratio;
                deltaX = rawX - lastCursorRef.current.x;
                deltaY = rawY - lastCursorRef.current.y;
                movementDist = MAX_FRAME_MOVE; 
            }

            let lerpFactor = 0.05;

            if (movementDist < 3) {
                lerpFactor = 0.02; 
            } else if (movementDist < 10) {
                 lerpFactor = 0.08;
            } else {
                 const speedRatio = (movementDist - 10) / 150;
                 lerpFactor = 0.15 + (speedRatio * 0.6);
                 lerpFactor = Math.min(lerpFactor, 0.7);
            }

            const smoothX = lastCursorRef.current.x + (rawX - lastCursorRef.current.x) * lerpFactor;
            const smoothY = lastCursorRef.current.y + (rawY - lastCursorRef.current.y) * lerpFactor;
            
            lastCursorRef.current = { x: smoothX, y: smoothY };
            setCursorPosition({ x: smoothX, y: smoothY });

            if (isTwoFingers) {
                if (isPinchingRef.current) {
                    isPinchingRef.current = false;
                    setIsPinching(false);
                }
                
                if (Math.abs(deltaY) > 2) {
                    window.scrollBy({ top: deltaY * 2.5, behavior: "auto" });
                }
            } else {
                const currentPinch = isPinchingRef.current;
                let shouldPinch = currentPinch;

                if (currentPinch) {
                    if (pinchDist > 0.07) {
                        shouldPinch = false;
                    }
                } else {
                    if (pinchDist < 0.04) {
                        shouldPinch = true;
                    }
                }

                if (shouldPinch !== currentPinch) {
                    isPinchingRef.current = shouldPinch;
                    setIsPinching(shouldPinch);
                }
            }
        }
      }
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  }, [isActive]);

  useEffect(() => {
     if (isActive && isReady && videoRef.current && videoRef.current.readyState >= 2) {
         predictWebcam();
     }
  }, [isActive, isReady, predictWebcam]);

  return (
    <HandGestureContext.Provider value={{ 
      cursorPosition, 
      isPinching, 
      isReady, 
      error, 
      isActive, 
      toggleGesture,
      hands,
      isTwoHandPinch,
      twoHandDistance,
      zoomDelta,
    }}>
      {children}
      <video 
        ref={videoRef} 
        style={{ 
            position: "fixed", 
            inset: 0, 
            width: "100vw", 
            height: "100vh", 
            objectFit: "cover",
            zIndex: -1, 
            opacity: isActive ? 0.15 : 0, 
            pointerEvents: "none",
            filter: "grayscale(100%) blur(4px) sepia(50%)",
            transform: "scaleX(-1)",
            transition: "opacity 1s ease-in-out"
        }} 
        autoPlay 
        playsInline
        onLoadedData={() => {
            if (isActive) predictWebcam();
        }}
      />
    </HandGestureContext.Provider>
  );
}

export const useHandGesture = () => {
  const context = useContext(HandGestureContext);
  if (!context) {
    throw new Error("useHandGesture must be used within a HandGestureProvider");
  }
  return context;
};
