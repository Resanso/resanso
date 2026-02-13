"use client";

import { useState } from "react";
import Link from "next/link";
import GravityVoid from "./_components/GravityVoid";
import ScratchCard from "./_components/ScratchCard";
import RetroTerminal from "./_components/RetroTerminal";
import DetectiveDesk from "./_components/DetectiveDesk";
import KineticType from "./_components/KineticType";

type ExperimentType = "gravity" | "scratch" | "terminal" | "desk" | "kinetic";

export default function ContactExperimentPage() {
  const [activeExperiment, setActiveExperiment] = useState<ExperimentType>("gravity");

  return (
    <main className="w-full h-screen overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 z-50 flex flex-col items-center bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
        <div className="flex items-center gap-4 w-full max-w-4xl justify-between mb-4">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black">
                ← Back to Home
            </Link>
            <h1 className="text-xl font-bold uppercase tracking-wider">Contact Logic Experiments</h1>
            <div className="w-20" /> {/* Spacer */}
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
            <TabButton 
                active={activeExperiment === "gravity"} 
                onClick={() => setActiveExperiment("gravity")} 
                label="🌌 Gravity Void"
            />
            <TabButton 
                active={activeExperiment === "scratch"} 
                onClick={() => setActiveExperiment("scratch")} 
                label="🎫 Scratch Card"
            />
             <TabButton 
                active={activeExperiment === "terminal"} 
                onClick={() => setActiveExperiment("terminal")} 
                label="📠 Retro Terminal"
            />
            <div className="w-px h-6 bg-gray-300 mx-2" />
             <TabButton 
                active={activeExperiment === "desk"} 
                onClick={() => setActiveExperiment("desk")} 
                label="🕵️ Detective Desk"
            />
             <TabButton 
                active={activeExperiment === "kinetic"} 
                onClick={() => setActiveExperiment("kinetic")} 
                label="🔠 Kinetic Type"
            />
        </div>
      </div>

      <div className="h-full pt-[130px]">
        {activeExperiment === "gravity" && <GravityVoid />}
        {activeExperiment === "scratch" && <ScratchCard />}
        {activeExperiment === "terminal" && <RetroTerminal />}
        {activeExperiment === "desk" && <DetectiveDesk />}
        {activeExperiment === "kinetic" && <KineticType />}
      </div>
    </main>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                active 
                    ? "bg-white text-black shadow-sm scale-100" 
                    : "text-gray-500 hover:text-gray-900 scale-95"
            }`}
        >
            {label}
        </button>
    );
}
