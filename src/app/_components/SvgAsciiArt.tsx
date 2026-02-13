"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ASCII characters from light to dark density
const ASCII_CHARS = " .,:;i1tfLCG08@";

interface CellData {
  baseCharIndex: number;
  brightness: number;
}

interface SvgAsciiArtProps {
  svgUrl: string;
  /** Number of character columns */
  cols?: number;
  className?: string;
}

export default function SvgAsciiArt({
  svgUrl,
  cols = 80,
  className,
}: SvgAsciiArtProps) {
  const [grid, setGrid] = useState<CellData[][]>([]);
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  // const frameRef = useRef<number>(0);
  const gridRef = useRef<CellData[][]>([]);

  // Generate the base ASCII grid from SVG
  const generateAscii = useCallback(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const charAspect = 0.55;
      const aspectRatio = img.naturalHeight / img.naturalWidth;
      const rows = Math.floor(cols * aspectRatio * charAspect);

      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cols, rows);
      ctx.drawImage(img, 0, 0, cols, rows);

      const imageData = ctx.getImageData(0, 0, cols, rows);
      const pixels = imageData.data;
      const newGrid: CellData[][] = [];

      for (let y = 0; y < rows; y++) {
        const row: CellData[] = [];
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = pixels[i]!;
          const g = pixels[i + 1]!;
          const b = pixels[i + 2]!;
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const charIndex = Math.floor(
            (1 - brightness) * (ASCII_CHARS.length - 1)
          );
          row.push({ baseCharIndex: charIndex, brightness });
        }
        newGrid.push(row);
      }

      gridRef.current = newGrid;
      setGrid(newGrid);
    };
    img.src = svgUrl;
  }, [svgUrl, cols]);

  useEffect(() => {
    generateAscii();
  }, [generateAscii]);

  // Continuous animation loop: wave shimmer + random character flickering
  useEffect(() => {
    if (grid.length === 0) return;

    let animId: number;
    const rows = grid.length;
    const colCount = grid[0]?.length ?? 0;

    const animate = () => {
      const time = performance.now() * 0.001; // seconds
      const lines: string[] = [];

      for (let y = 0; y < rows; y++) {
        let line = "";
        const row = grid[y]!;
        for (let x = 0; x < colCount; x++) {
          const cell = row[x]!;

          // Skip empty/near-empty cells (background)
          if (cell.baseCharIndex <= 0) {
            line += " ";
            continue;
          }

          // Wave shimmer: a sine wave that shifts character brightness over time
          const wave =
            Math.sin(time * 1.5 + y * 0.15 + x * 0.08) * 0.5 + 0.5;

          // Random flicker for non-empty cells (subtle)
          const flicker =
            Math.sin(time * 8 + x * 73.7 + y * 31.3) > 0.92 ? 1 : 0;

          // Combine: base char ± wave offset ± flicker
          let charIdx = cell.baseCharIndex + Math.round((wave - 0.5) * 2);

          // Add occasional flicker jump
          if (flicker) {
            charIdx = Math.min(
              charIdx + Math.floor(Math.random() * 3),
              ASCII_CHARS.length - 1
            );
          }

          // Clamp
          charIdx = Math.max(1, Math.min(charIdx, ASCII_CHARS.length - 1));
          line += ASCII_CHARS[charIdx] ?? " ";
        }
        lines.push(line);
      }

      setDisplayLines(lines);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [grid]);

  if (displayLines.length === 0) return null;

  return (
    <pre
      className={className}
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "clamp(3px, 0.55vw, 7px)",
        lineHeight: 1.1,
        letterSpacing: "0.05em",
        color: "#000000",
        whiteSpace: "pre",
        overflow: "hidden",
        userSelect: "none",
        margin: 0,
        padding: 0,
      }}
      aria-hidden="true"
    >
      {displayLines.join("\n")}
    </pre>
  );
}
