"use client";

import { useRef, useEffect, useCallback, useState } from "react";

// Dense → Sparse characters (dark → light areas)
const ASCII_CHARS = " .,:;i1tfLCG08@";

interface AsciiHoverRevealProps {
  radius?: number;
  cellSize?: number;
  color?: string;
  fontFamily?: string;
}

export default function AsciiHoverReveal({
  radius = 90,
  cellSize = 6,
  color = "#1a1a1a",
  fontFamily = "'Courier New', monospace",
}: AsciiHoverRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animFrameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceDataRef = useRef<ImageData | null>(null);
  const svgElementRef = useRef<SVGSVGElement | null>(null);
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 });

  const captureSource = useCallback(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const svg = parent.querySelector("svg");
    if (!svg) return;
    svgElementRef.current = svg;

    const dpr = window.devicePixelRatio || 1;
    const svgRect = svg.getBoundingClientRect();
    const w = svgRect.width;
    const h = svgRect.height;
    dimsRef.current = { w, h, dpr };

    // Clone and serialize the SVG
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("width", String(w * dpr));
    clone.setAttribute("height", String(h * dpr));

    const svgData = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = w * dpr;
      offscreen.height = h * dpr;
      const ctx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      // Draw white background first so transparent areas read as white (bright)
      ctx.fillStyle = "#FFF8E7";
      ctx.fillRect(0, 0, offscreen.width, offscreen.height);
      ctx.drawImage(img, 0, 0, w * dpr, h * dpr);

      sourceCanvasRef.current = offscreen;
      // Cache the full image data for fast sampling
      sourceDataRef.current = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  useEffect(() => {
    if (isHovering) {
      captureSource();
    }
  }, [isHovering, captureSource]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = containerRef.current?.parentElement;
      if (!parent) return;
      const svg = parent.querySelector("svg");
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      dimsRef.current = { w: rect.width, h: rect.height, dpr };
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const svg = svgElementRef.current;
      const { w, h, dpr } = dimsRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const { x: mx, y: my, active } = mouseRef.current;

      if (!active || !sourceDataRef.current) {
        if (svg) {
          svg.style.maskImage = "";
          svg.style.webkitMaskImage = "";
        }
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Mask the SVG: hide pixels inside the radius
      if (svg) {
        const maskGradient = `radial-gradient(circle ${radius}px at ${mx}px ${my}px, transparent 0%, transparent 65%, black 100%)`;
        svg.style.maskImage = maskGradient;
        svg.style.webkitMaskImage = maskGradient;
      }

      const imgData = sourceDataRef.current;
      const imgW = imgData.width;
      const data = imgData.data;

      ctx.font = `${cellSize}px ${fontFamily}`;
      ctx.textBaseline = "top";
      ctx.textAlign = "center";

      const cols = Math.ceil(w / cellSize);
      const rows = Math.ceil(h / cellSize);
      const sampleScale = dpr;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cx = col * cellSize + cellSize / 2;
          const cy = row * cellSize + cellSize / 2;

          // Distance from mouse
          const dx = cx - mx;
          const dy = cy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > radius) continue;

          // Sample average brightness in this cell area
          const sampleX0 = Math.floor(col * cellSize * sampleScale);
          const sampleY0 = Math.floor(row * cellSize * sampleScale);
          const sampleX1 = Math.min(Math.floor((col + 1) * cellSize * sampleScale), imgW);
          const sampleY1 = Math.min(Math.floor((row + 1) * cellSize * sampleScale), imgData.height);

          let totalBrightness = 0;
          let sampleCount = 0;

          // Sample every other pixel for performance
          for (let sy = sampleY0; sy < sampleY1; sy += 2) {
            for (let sx = sampleX0; sx < sampleX1; sx += 2) {
              const idx = (sy * imgW + sx) * 4;
              const r = data[idx]!;
              const g = data[idx + 1]!;
              const b = data[idx + 2]!;
              totalBrightness += (r * 0.299 + g * 0.587 + b * 0.114);
              sampleCount++;
            }
          }

          if (sampleCount === 0) continue;

          const avgBrightness = totalBrightness / sampleCount / 255;
          
          // Map brightness to ASCII character
          // bright (1.0) = space/light chars, dark (0.0) = dense chars
          const charIdx = Math.floor((1 - avgBrightness) * (ASCII_CHARS.length - 1));
          const char = ASCII_CHARS[charIdx];

          // Skip spaces (fully bright areas far from the SVG strokes)
          if (!char || char === " ") continue;

          // Fade at edges of radius
          const edgeFade = 1 - Math.max(0, (dist - radius * 0.5)) / (radius * 0.5);
          const opacity = Math.max(0.15, edgeFade);

          ctx.fillStyle = color;
          ctx.globalAlpha = opacity;
          ctx.fillText(char, cx, cy - cellSize / 2);
        }
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      if (svgElementRef.current) {
        svgElementRef.current.style.maskImage = "";
        svgElementRef.current.style.webkitMaskImage = "";
      }
    };
  }, [cellSize, color, fontFamily, radius]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const svg = svgElementRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    mouseRef.current.active = true;
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    setIsHovering(false);
    if (svgElementRef.current) {
      svgElementRef.current.style.maskImage = "";
      svgElementRef.current.style.webkitMaskImage = "";
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "crosshair" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}
