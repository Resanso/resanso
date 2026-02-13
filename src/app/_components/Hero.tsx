"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import SanzooSvg from "./SanzooSvg";
import AsciiHoverReveal from "./AsciiHoverReveal";
import { GithubIcon } from "~/components/ui/github";
import { LinkedinIcon } from "~/components/ui/linkedin";
import { InstagramIcon } from "~/components/ui/instagram";
import { TwitterIcon } from "~/components/ui/twitter";

// Social media links - ganti dengan URL asli kamu
const socialLinks = [
  { name: "GitHub", icon: GithubIcon, url: "https://github.com/Resanso" },
  { name: "LinkedIn", icon: LinkedinIcon, url: "https://www.linkedin.com/in/resan-so-8528102b7/" },
  { name: "Instagram", icon: InstagramIcon, url: "https://www.instagram.com/sanzoo.9/" },
  { name: "Twitter", icon: TwitterIcon, url: "https://x.com/ResanSo87171" },
];

// Hook untuk detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export default function Hero() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const isMobile = useIsMobile();
  
  // Delay untuk SVG bergerak (setelah animasi SVG selesai)
  const svgMoveDelay = 4;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, svgMoveDelay * 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#FFF8E7] overflow-hidden px-6 lg:px-24">
      
      {/* Text Content */}
      <motion.div
        className={`
          absolute z-10
          ${isMobile 
            ? "left-6 right-6 top-[55%] text-center" 
            : "left-24 top-0 bottom-0 w-1/2 flex items-center text-left"
          }
        `}
        style={!isMobile ? { display: "flex", alignItems: "center" } : {}}
        initial={{ opacity: 0, x: isMobile ? 0 : -100, y: isMobile ? 50 : 0 }}
        animate={{ 
          opacity: animationComplete ? 1 : 0, 
          x: animationComplete ? 0 : (isMobile ? 0 : -100),
          y: animationComplete ? 0 : (isMobile ? 50 : 0)
        }}
        transition={{ 
          duration: 0.8, 
          ease: [0.42, 0, 0.58, 1] 
        }}
      >
        <div className="max-w-xl w-full">
          {/* Greeting */}
          <motion.p 
            className="text-base lg:text-lg text-gray-600 mb-2 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: animationComplete ? 1 : 0, 
              y: animationComplete ? 0 : 20 
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Hello! 👋 I&apos;m
          </motion.p>
          
          {/* Name */}
          <motion.h1 
            className="text-4xl lg:text-6xl font-bold text-gray-900 mb-3 lg:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: animationComplete ? 1 : 0, 
              y: animationComplete ? 0 : 20 
            }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Resan So
          </motion.h1>
          
          {/* Summary */}
          <motion.p 
            className="text-sm lg:text-lg text-gray-600 mb-6 lg:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: animationComplete ? 1 : 0, 
              y: animationComplete ? 0 : 20 
            }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            An Informatics Undergraduate and <span className="font-semibold text-gray-800">Frontend Developer at ADACAREER</span>. 
            Winner of the <span className="font-semibold text-gray-800">Ericsson Hackathon 2025</span> (5G & AI). 
            Passionate about building digital twins and crafting impactful web experiences.
          </motion.p>
          
          {/* Social Media Links */}
          <motion.div 
            className={`flex gap-4 ${isMobile ? "justify-center" : "justify-start"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: animationComplete ? 1 : 0, 
              y: animationComplete ? 0 : 20 
            }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: animationComplete ? 1 : 0, 
                  scale: animationComplete ? 1 : 0.5 
                }}
                transition={{ 
                  duration: 0.4, 
                  delay: 1 + (index * 0.1),
                  ease: "backOut"
                }}
                title={social.name}
              >
                <social.icon size={24} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>
      
      {/* SVG Illustration - tengah lalu bergerak ke kanan (desktop) atau atas (mobile) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ 
          x: animationComplete ? (isMobile ? "0%" : "25%") : "0%",
          y: animationComplete ? (isMobile ? "-15%" : "0%") : "0%"
        }}
        transition={{ 
          duration: 1.2,
          ease: [0.42, 0, 0.58, 1]
        }}
      >
        <div className="relative">
          <SanzooSvg />
          {animationComplete && !isMobile && <AsciiHoverReveal radius={90} cellSize={7} />}
        </div>
      </motion.div>
      
    </section>
  );
}
