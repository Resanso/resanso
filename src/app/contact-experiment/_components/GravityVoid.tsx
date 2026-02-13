"use client";

import { motion, useMotionValue, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const gravityStrength = 0.5;
const physicsDamping = 0.98;

interface FloatingElementProps {
  id: number;
  label: string;
  href: string;
  initialX: number;
  initialY: number;
  color: string;
}

const floatingElements: FloatingElementProps[] = [
  { id: 1, label: "Email", href: "mailto:resansaint@gmail.com", initialX: 200, initialY: 300, color: "#f87171" },
  { id: 2, label: "LinkedIn", href: "https://www.linkedin.com/in/resan-so-8528102b7/", initialX: 600, initialY: 200, color: "#60a5fa" },
  { id: 3, label: "GitHub", href: "https://github.com/Resanso", initialX: 400, initialY: 500, color: "#34d399" },
  { id: 4, label: "Twitter", href: "https://x.com/ResanSo87171", initialX: 800, initialY: 400, color: "#818cf8" },
];

export default function GravityVoid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elements] = useState(floatingElements);
  
  // Mouse position as a gravity well
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center cursor-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black z-0 pointer-events-none" />
      
      {/* Stars / Dust */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div 
          key={i}
          className="absolute bg-white rounded-full opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: Math.random() * 2 + 1 + "px",
            height: Math.random() * 2 + 1 + "px",
          }}
        />
      ))}

      {/* Floating Elements */}
      {elements.map((el) => (
        <PhysicsItem 
          key={el.id} 
          {...el} 
          containerRef={containerRef}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}

      {/* Cursor Gravity Indicator */}
      <CustomCursor mouseX={mouseX} mouseY={mouseY} />
    </div>
  );
}

interface PhysicsItemProps extends FloatingElementProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

function PhysicsItem({ label, href, initialX, initialY, color, containerRef, mouseX, mouseY }: PhysicsItemProps) {
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);
  const vx = useRef(Math.random() * 2 - 1);
  const vy = useRef(Math.random() * 2 - 1);

  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      // Calculate distance to mouse (gravity well)
      const dx = mouseX.get() - x.get();
      const dy = mouseY.get() - y.get();
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Apply gravity force towards mouse if close enough
      if (dist < 400 && dist > 10) {
        vx.current += (dx / dist) * gravityStrength;
        vy.current += (dy / dist) * gravityStrength;
      }

      // Apply damping (friction)
      vx.current *= physicsDamping;
      vy.current *= physicsDamping;

      // Update position
      const newX = x.get() + vx.current;
      const newY = y.get() + vy.current;

      // Bounce off walls
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (newX < 50 || newX > width - 50) vx.current *= -1;
        if (newY < 50 || newY > height - 50) vy.current *= -1;
      }

      x.set(newX);
      y.set(newY);

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mouseX, mouseY, containerRef, x, y]);

  return (
    <motion.a
      href={href}
      style={{ x, y }}
      className="absolute p-6 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center group"
      whileHover={{ scale: 1.2, backgroundColor: color }}
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        vx.current = info.velocity.x * 0.05;
        vy.current = info.velocity.y * 0.05;
      }}
    >
      <span className="text-white font-bold tracking-widest group-hover:text-black transition-colors">{label}</span>
    </motion.a>
  );
}

interface CustomCursorProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

function CustomCursor({ mouseX, mouseY }: CustomCursorProps) {
  return (
    <motion.div 
      className="absolute w-8 h-8 rounded-full border border-white/50 pointer-events-none z-50 mix-blend-difference"
      style={{ 
        x: mouseX, 
        y: mouseY,
        translateX: "-50%",
        translateY: "-50%" 
      }}
    >
      <div className="absolute inset-0 bg-white/20 rounded-full blur-md" />
    </motion.div>
  );
}
