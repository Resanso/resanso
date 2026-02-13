"use client";

import { Check, Copy, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
// import { cn } from "~/lib/utils";
import dynamic from "next/dynamic";

const SvgAsciiArt = dynamic(() => import("./SvgAsciiArt"), {
  ssr: false,
  loading: () => null,
});

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyToClipboard = () => {
    void navigator.clipboard.writeText("resansaint@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Parallax background elements
  // Parallax background elements
  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: ["start end", "end start"]
  // });

  // const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  // const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section 
      ref={containerRef} 
      className="relative py-32 bg-[#FFF8E7] overflow-hidden" 
      id="contact"
    >
      {/* ASCII Art Decorative Element */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute left-[-5%] bottom-[-10%] opacity-[0.12] pointer-events-none select-none hidden lg:block"
      >
        <div style={{ transform: "scaleX(-1)" }}>
          <SvgAsciiArt svgUrl="/sanzoo.svg" cols={200} />
        </div>
      </motion.div>
      <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-gray-900 mb-8 leading-[0.9]">
                Let&apos;s start a <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900">
                  conversation.
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Interested in working together? I&apos;m always open to discussing product design, collaboration opportunities, or just having a chat.
              </p>
            </motion.div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-2xl">
               {/* Email Column */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="flex flex-col items-center p-8 rounded-3xl transition-colors"
               >
                  <div className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Email Me</div>
                  <div className="flex items-center gap-3 mb-2">
                    <a href="mailto:resansaint@gmail.com" className="text-2xl font-bold text-gray-900 hover:text-gray-600 transition-colors">
                      resansaint@gmail.com
                    </a>
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 rounded-full hover:bg-gray-200/50 transition-colors text-gray-400 hover:text-gray-900"
                      title="Copy Email"
                    >
                       {copiedEmail ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
               </motion.div>

               {/* Socials Column */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: 0.3 }}
                 className="flex flex-col items-center p-8 rounded-3xl transition-colors"
               >
                  <div className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Connect</div>
                  <div className="flex flex-col gap-3 items-center">
                      <a href="https://www.linkedin.com/in/resan-so-8528102b7/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors group">
                         LinkedIn <ArrowUpRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </a>
                      <a href="https://github.com/Resanso" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors group">
                         GitHub <ArrowUpRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </a>
                      <a href="https://www.instagram.com/sanzoo.9/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors group">
                         Instagram <ArrowUpRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </a>
                      <a href="https://x.com/ResanSo87171" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors group">
                         X <ArrowUpRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </a>
                  </div>
               </motion.div>
            </div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.4 }}
               className="mt-16 text-gray-500 font-medium"
            >
               Based in Bandung, ID <span className="mx-2">•</span> {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', timeZone: 'Asia/Jakarta'})}
            </motion.div>

        </div>
      </div>
    </section>
  );
}
