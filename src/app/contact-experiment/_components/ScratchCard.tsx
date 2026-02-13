"use client";

import { useEffect, useRef, useState } from "react";

export default function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
        if (!containerRef.current) return;
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        // Fill with "Scratch Paint"
        ctx.fillStyle = "#e5e5e5"; // Silver color
        ctx.fillRect(0, 0, width, height);
        
        // Add noise/texture
        for(let i=0; i<width*height*0.05; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? "#d4d4d4" : "#f5f5f5";
            ctx.fillRect(Math.random()*width, Math.random()*height, 2, 2);
        }

        // Add Label
        ctx.font = "bold 48px sans-serif";
        ctx.fillStyle = "#a3a3a3";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SCRATCH TO REVEAL", width/2, height/2);
    };

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
        const touch = e.touches[0];
        if (!touch) return;
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();

    // Check completion
    checkReveal();
  };

  const checkReveal = () => {
      const canvas = canvasRef.current;
      if (!canvas || isRevealed) return;
      
      // Look at pixel data only occasionally to save perf
      if (Math.random() > 0.1) return; 

      // Simplified check logic could go here
      // For now we just let them scratch freely
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden select-none">
      {/* Hidden Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white z-0">
        <h2 className="text-4xl font-bold mb-4">You found me! 🎉</h2>
        <p className="text-xl mb-8">Ready to start a project?</p>
        <div className="flex gap-4">
            <a href="mailto:hello@sanzoo.com" className="px-8 py-3 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:scale-105 transition-transform">
                Email Me
            </a>
            <button 
                onClick={() => {
                   const canvas = canvasRef.current;
                   const ctx = canvas?.getContext("2d");
                   if(canvas && ctx) {
                       ctx.globalCompositeOperation = "source-over";
                       ctx.fillStyle = "#e5e5e5";
                       ctx.fillRect(0,0, canvas.width, canvas.height);
                       ctx.font = "bold 48px sans-serif";
                       ctx.fillStyle = "#a3a3a3";
                       ctx.textAlign = "center";
                       ctx.textBaseline = "middle";
                       ctx.fillText("SCRATCH AGAIN", canvas.width/2, canvas.height/2);
                   }
                }}
                className="px-8 py-3 bg-black/20 text-white font-bold rounded-full hover:bg-black/30 transition-colors"
            >
                Reset Card
            </button>
        </div>
      </div>

      {/* Scratch Layer */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-10 touch-none cursor-crosshair"
        onMouseMove={(e) => {
            if(e.buttons === 1) handleScratch(e);
        }}
        onTouchMove={handleScratch}
        onMouseDown={handleScratch}
      />
    </div>
  );
}
