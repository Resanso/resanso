"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function KineticType() {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#f0f0f0] flex items-center justify-center overflow-hidden">
      
      {/* SVG Filter Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
            <filter id="distortion">
                <feTurbulence type="fractalNoise" baseFrequency={isHovered ? "0.01 0.005" : "0"} numOctaves="1" result="warp" />
                <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale={isHovered ? 60 : 0} in="SourceGraphic" in2="warp" />
            </filter>
        </defs>
      </svg>

      <div className="relative z-10 text-center">
        {!isExpanded ? (
            <motion.div
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => setIsExpanded(true)}
                className="cursor-pointer select-none"
            >
                <motion.h1 
                    className="text-[15vw] font-black leading-none tracking-tighter text-black mix-blend-multiply"
                    style={{ filter: "url(#distortion)" }}
                >
                    LET&apos;S
                </motion.h1>
                <motion.h1 
                    className="text-[15vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                    style={{ filter: "url(#distortion)" }}
                >
                    TALK
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm pointer-events-none"
                >
                    Click to Open
                </motion.p>
            </motion.div>
        ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white p-12 shadow-2xl rounded-sm border-l-8 border-black text-left"
            >
                <div className="flex justify-between items-center mb-12">
                     <h2 className="text-6xl font-black uppercase tracking-tighter">Usage<br/>Request</h2>
                     <button 
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                        className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                     >
                        ✕
                     </button>
                </div>
               
                <form className="space-y-8">
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black">Identity</label>
                        <input type="text" placeholder="Who acts?" className="w-full text-3xl font-bold border-b-2 border-gray-200 focus:border-black outline-none py-2 placeholder:text-gray-200 transition-colors" />
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black">Transmission</label>
                        <input type="email" placeholder="Return Address" className="w-full text-3xl font-bold border-b-2 border-gray-200 focus:border-black outline-none py-2 placeholder:text-gray-200 transition-colors" />
                    </div>
                    <button className="w-full py-6 bg-black text-white font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors mt-8">
                        Initiate Protocol
                    </button>
                </form>
            </motion.div>
        )}
      </div>

    </div>
  );
}
