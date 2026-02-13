"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { works } from "~/data/works";
import MagnifyingGlass from "./MagnifyingGlass";

// Red string SVG connections between card indices
const strings: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 4],
  [0, 3],
  [3, 5],
  [4, 5],
];

// Board card positions (percentage-based) — a curated subset of works
const boardCards = [
  { workIdx: 0, x: 8, y: 10, rotate: -4 },
  { workIdx: 1, x: 38, y: 6, rotate: 3 },
  { workIdx: 2, x: 68, y: 12, rotate: -2 },
  { workIdx: 3, x: 12, y: 52, rotate: 5 },
  { workIdx: 4, x: 45, y: 48, rotate: -3 },
  { workIdx: 5, x: 72, y: 55, rotate: 4 },
];

// Post-it note decorations
const stickyNotes = [
  { text: "TOP SECRET", x: 55, y: 2, rotate: 8, color: "#fde047" },
  { text: "SUSPECT?", x: 2, y: 38, rotate: -12, color: "#fb923c" },
  { text: "CONNECTED!", x: 82, y: 40, rotate: 6, color: "#86efac" },
];

// Pin center positions for string SVG (relative to card positions)
function getPinCenter(card: (typeof boardCards)[number]) {
  // Pin is at top-center of card. Card is ~22% wide, ~28% tall at most.
  // Pin center ≈ card.x + cardWidth/2, card.y - tiny offset
  return { x: card.x + 11, y: card.y + 2 };
}

export default function ProjectCTA() {
  const router = useRouter();

  return (
    <section className="relative w-full bg-[#FFF8E7] py-16 md:py-28 overflow-hidden flex flex-col items-center justify-center">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 md:mb-14 px-4"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 mb-4">
          The Investigation Board
        </h2>
        <p className="text-lg text-gray-500 max-w-lg mx-auto">
          Every project tells a story. Step inside and connect the dots.
        </p>
      </motion.div>

      {/* Cork Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-[90vw] max-w-4xl mx-auto cursor-pointer group"
        onClick={() => router.push("/works")}
      >
        {/* Wooden Frame */}
        <div
          className="absolute -inset-3 md:-inset-5 rounded-xl z-0"
          style={{
            background:
              "linear-gradient(135deg, #8B6914 0%, #A0782C 15%, #6B4F0A 30%, #9E7A2E 50%, #7A5C12 70%, #B08C3A 85%, #8B6914 100%)",
            boxShadow:
              "inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.3)",
          }}
        />

        {/* Cork Surface */}
        <div
          className="relative rounded-lg overflow-hidden z-10"
          style={{
            backgroundColor: "#c4956a",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundBlendMode: "multiply",
            aspectRatio: "16 / 10",
          }}
        >
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 shadow-[inset_0_4px_12px_rgba(0,0,0,0.3)] rounded-lg pointer-events-none z-50" />

          {/* SVG Strings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {strings.map(([fromIdx, toIdx], i) => {
              const from = boardCards[fromIdx];
              const to = boardCards[toIdx];
              if (!from || !to) return null;
              const p1 = getPinCenter(from);
              const p2 = getPinCenter(to);
              // Sag effect
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              const dist = Math.sqrt(
                (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2
              );
              const sag = Math.min(dist * 0.15, 8);
              const d = `M ${p1.x}% ${p1.y}% Q ${midX}% ${midY + sag}% ${p2.x}% ${p2.y}%`;

              return (
                <motion.path
                  key={i}
                  d={d}
                  stroke="#b91c1c"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.7 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.2,
                    delay: 0.5 + i * 0.15,
                    ease: "easeInOut",
                  }}
                  style={{
                    filter:
                      "drop-shadow(0 1px 2px rgba(185, 28, 28, 0.3))",
                  }}
                />
              );
            })}
          </svg>

          {/* Project Cards */}
          {boardCards.map((card, i) => {
            const work = works[card.workIdx];
            if (!work) return null;

            return (
              <motion.div
                key={work.id}
                className="absolute w-[22%] z-10"
                style={{
                  left: `${card.x}%`,
                  top: `${card.y}%`,
                }}
                initial={{ opacity: 0, y: 20, rotate: 0 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: card.rotate,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + i * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {/* Pin */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30">
                  <div
                    className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full shadow-md"
                    style={{
                      backgroundColor: ["#dc2626", "#ea580c", "#d97706", "#0891b2", "#7c3aed", "#db2777"][i % 6],
                      boxShadow: `0 2px 6px rgba(0,0,0,0.4), inset 0 -1px 3px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)`,
                    }}
                  />
                  <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-2 bg-gradient-to-b from-gray-400 to-gray-600" style={{ top: "10px" }} />
                </div>

                {/* Tape strips */}
                <div className="absolute -top-0.5 -left-0.5 w-6 h-3 bg-yellow-200/60 rotate-[-15deg] shadow-sm pointer-events-none z-20" />
                <div className="absolute -top-0.5 -right-0.5 w-6 h-3 bg-yellow-200/60 rotate-[15deg] shadow-sm pointer-events-none z-20" />

                {/* Photo card */}
                <div className="bg-white p-1.5 md:p-2 rounded shadow-lg group-hover:shadow-xl transition-shadow">
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 20vw, 15vw"
                    />
                  </div>
                  <div className="mt-1 md:mt-1.5">
                    <p className="text-[6px] md:text-[8px] font-bold text-gray-800 leading-tight truncate">
                      {work.title}
                    </p>
                    <p className="text-[5px] md:text-[7px] text-gray-500 truncate">
                      {work.category}
                    </p>
                  </div>
                </div>

                {/* Case label */}
                <div
                  className="absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded shadow-sm z-20 whitespace-nowrap"
                  style={{
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  <span className="text-[5px] md:text-[7px] font-bold text-red-700 uppercase">
                    Case #{i + 1}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Sticky Notes */}
          {stickyNotes.map((note, i) => (
            <motion.div
              key={i}
              className="absolute z-30 hidden md:block"
              style={{
                left: `${note.x}%`,
                top: `${note.y}%`,
                rotate: note.rotate,
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 + i * 0.2, type: "spring" }}
            >
              <div
                className="px-2.5 py-1.5 shadow-md"
                style={{ backgroundColor: note.color }}
              >
                <span
                  className="text-[7px] md:text-[9px] font-bold text-gray-800 uppercase"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  {note.text}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Extra decoration: scribbled circles on the board */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-15 opacity-40">
            <circle cx="30%" cy="35%" r="8%" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="60%" cy="65%" r="6%" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" />
          </svg>

          {/* Animated Magnifying Glass */}
          <motion.div
            className="absolute z-30 pointer-events-none hidden md:block"
            animate={{
              left: ["15%", "55%", "70%", "35%", "15%"],
              top: ["20%", "15%", "50%", "60%", "20%"],
              rotate: [15, -10, 20, -15, 15],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <MagnifyingGlass size={90} />
          </motion.div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 z-40 flex items-center justify-center">
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur-sm text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-base flex items-center gap-2 shadow-2xl"
            >
              Enter Investigation Room
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom label */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5 }}
        className="mt-8 text-xs text-gray-400 font-mono tracking-widest uppercase"
      >
        {works.length} Active Cases • Click to Investigate
      </motion.p>
    </section>
  );
}
