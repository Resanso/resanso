"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function RetroTerminal() {
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  const rotateX = useTransform(y, [0, 800], [15, -15]);
  const rotateY = useTransform(x, [0, 800], [-15, 15]);

  const [text, setText] = useState("");
  const fullText = "> INITIATING CONTACT PROTOCOL...\n> CONNECTING TO SERVER [SANZOO-V1]...\n> CONNECTION ESTABLISHED.\n> ENTER MESSAGE BELOW: _";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    x.set(event.clientX);
    y.set(event.clientY);
  }

  return (
    <div 
        onMouseMove={handleMouseMove}
        className="relative w-full h-full bg-zinc-900 flex items-center justify-center overflow-hidden perspective-1000"
        style={{ perspective: 1000 }}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage: "linear-gradient(#0f0 1px, transparent 1px), linear-gradient(90deg, #0f0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            transform: "perspective(500px) rotateX(60deg) translateY(100px) scale(2)",
        }}
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[600px] h-[400px] bg-black border-2 border-green-500 rounded-lg p-8 shadow-[0_0_50px_rgba(0,255,0,0.3)]"
      >
        {/* Screen Effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)] pointer-events-none z-20" />
        <div className="absolute inset-0 bg-green-500/5 pointer-events-none z-10 animate-pulse" />

        {/* Content */}
        <div className="font-mono text-green-500 text-lg whitespace-pre-line leading-relaxed h-full flex flex-col">
            <div className="mb-8 min-h-[100px]">{text}</div>

            <form className="flex-1 flex flex-col gap-4 opacity-0 animate-fadeIn" style={{ animationDelay: "3s", animationFillMode: "forwards" }}>
                <input 
                    type="email" 
                    placeholder="ENTER SENDER EMAIL"
                    className="bg-transparent border-b border-green-800 text-green-400 p-2 focus:outline-none focus:border-green-500 font-mono w-full"
                />
                <textarea 
                    placeholder="INPUT TRANSMISSION DATA..."
                    className="bg-transparent border border-green-800 text-green-400 p-2 focus:outline-none focus:border-green-500 font-mono w-full h-24 resize-none"
                />
                <button className="self-end px-6 py-2 bg-green-900/30 border border-green-600 text-green-400 hover:bg-green-500 hover:text-black transition-colors uppercase font-bold text-sm tracking-wider">
                    [ EXECUTE SEND ]
                </button>
            </form>
        </div>

        {/* Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500 -translate-x-1 -translate-y-1" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500 translate-x-1 -translate-y-1" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500 -translate-x-1 translate-y-1" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500 translate-x-1 translate-y-1" />

      </motion.div>
    </div>
  );
}
