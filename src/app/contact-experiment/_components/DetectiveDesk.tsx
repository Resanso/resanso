"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Coffee, Instagram, Linkedin, Github } from "lucide-react";

export default function DetectiveDesk() {
  return (
    <div className="relative w-full h-full bg-[#3e2723] overflow-hidden flex items-center justify-center shadow-inner">
      {/* Wood Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Lamp Light Spot */}
      <div className="absolute top-[-50%] left-[20%] w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-5xl h-full p-10 flex flex-wrap content-center justify-center gap-12 z-10">
        
        {/* Typewriter (Email) */}
        <DeskKeyObject 
            label="COMPOSE EMAIL"
            icon={<Mail size={40} className="text-gray-800" />}
            onClick={() => window.location.href = "mailto:hello@sanzoo.com"}
            className="w-64 h-48 bg-gray-200 rounded-lg shadow-[10px_10px_20px_rgba(0,0,0,0.5)] transform -rotate-3 flex flex-col items-center justify-center gap-4 border-b-8 border-gray-300 relative"
            note="Typewriter"
        />

        {/* Rotary Phone (Call) */}
        <DeskKeyObject 
            label="CALL ME"
            icon={<Phone size={40} className="text-red-900" />}
            onClick={() => window.location.href = "tel:+6281234567890"}
            className="w-48 h-48 bg-red-800 rounded-full shadow-[10px_10px_20px_rgba(0,0,0,0.5)] transform rotate-6 flex flex-col items-center justify-center gap-2 border-b-8 border-red-900/50"
            note="Emergency Line"
        />

        {/* Coffee Cup (Vibes) */}
        <DeskKeyObject 
             label="BREAK TIME"
             icon={<Coffee size={32} className="text-amber-900" />}
             className="w-32 h-32 bg-white rounded-full shadow-[5px_5px_15px_rgba(0,0,0,0.3)] flex items-center justify-center ring-4 ring-gray-100"
             note="Fuel"
        >
             <div className="absolute top-2 w-full h-full flex justify-center opacity-50 animate-pulse pointer-events-none">
                <span className="text-2xl">♨️</span>
             </div>
        </DeskKeyObject>

        {/* Polaroids (Socials) */}
        <div className="relative w-48 h-56">
            <Polaroid rotate={-5} z={10} content={<Github />} label="@Resanso" href="https://github.com/Resanso" />
            <Polaroid rotate={15} z={20} x={20} y={40} content={<Linkedin />} label="Resan So" href="https://www.linkedin.com/in/resan-so-8528102b7/" />
            <Polaroid rotate={-10} z={30} x={-20} y={80} content={<Instagram />} label="@sanzoo.9" href="https://www.instagram.com/sanzoo.9/" />
        </div>

      </div>

      {/* Narrative Text Overlay */}
      <div className="absolute bottom-10 left-10 max-w-md bg-white/90 p-4 rotate-1 shadow-lg font-serif">
         <h3 className="text-xl font-bold mb-2 text-gray-900 border-b border-gray-300 pb-1">CASE FILE: #CONTACT</h3>
         <p className="text-gray-700 italic">
            &quot;The subject tends to respond to urgent telegrams and direct calls. Evidence suggests heavily caffeinated work hours.&quot;
         </p>
      </div>

    </div>
  );
}

interface DeskKeyObjectProps {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    className?: string;
    note?: string;
    children?: React.ReactNode;
}

function DeskKeyObject({ label, icon, onClick, className, note, children }: DeskKeyObjectProps) {
    return (
        <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95, y: 0 }}
            onClick={onClick}
            className={`cursor-pointer group ${className}`}
        >
            {children}
            {icon}
            <span className="font-mono text-xs font-bold text-gray-600 tracking-widest bg-white/50 px-2 py-1 rounded">{label}</span>
            
            {/* Tooltip Note */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-100 text-black px-2 py-1 text-xs font-handwriting rotate-[-2deg] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {note}
            </div>
        </motion.div>
    );
}

interface PolaroidProps {
    rotate: number;
    z: number;
    x?: number;
    y?: number;
    content: React.ReactNode;
    label: string;
    href: string;
}

function Polaroid({ rotate, z, x = 0, y = 0, content, label, href }: PolaroidProps) {
    return (
        <motion.a 
            href={href}
            whileHover={{ scale: 1.1, zIndex: 100, rotate: 0 }}
            style={{ rotate, zIndex: z, x, y }}
            className="absolute w-32 h-40 bg-white p-2 pb-8 shadow-md flex flex-col items-center gap-2 transform transition-all duration-300 cursor-pointer border border-gray-200"
        >
            <div className="w-full h-24 bg-gray-800 flex items-center justify-center text-white">
                {content}
            </div>
            <span className="font-handwriting text-sm text-gray-600 rotate-[-1deg]">{label}</span>
        </motion.a>
    );
}
