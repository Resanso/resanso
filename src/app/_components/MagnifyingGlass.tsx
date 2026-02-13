"use client";

// import { motion } from "framer-motion";

interface MagnifyingGlassProps {
  /** Size of the lens diameter in pixels */
  size?: number;
  /** Additional className */
  className?: string;
}

/**
 * A realistic magnifying glass drawn with SVG.
 * The lens area is transparent so content behind shows through.
 */
export default function MagnifyingGlass({ size = 100, className = "" }: MagnifyingGlassProps) {
  // Handle length relative to lens
  const handleLength = size * 0.55;
  const handleWidth = size * 0.12;
  const rimWidth = size * 0.06;
  const center = size / 2;
  const lensRadius = center - rimWidth;

  return (
    <div className={`relative ${className}`} style={{ width: size + handleLength * 0.5, height: size + handleLength * 0.5 }}>
      <svg
        width={size + handleLength * 0.5}
        height={size + handleLength * 0.5}
        viewBox={`0 0 ${size + handleLength * 0.5} ${size + handleLength * 0.5}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic rim gradient */}
          <linearGradient id="rimGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B8860B" />
            <stop offset="25%" stopColor="#DAA520" />
            <stop offset="50%" stopColor="#CD853F" />
            <stop offset="75%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#8B6914" />
          </linearGradient>

          {/* Handle wood gradient */}
          <linearGradient id="handleGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5C3310" />
            <stop offset="20%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="80%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#5C3310" />
          </linearGradient>

          {/* Glass reflection gradient */}
          <radialGradient id="glassGradient" cx="0.35" cy="0.35" r="0.6">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="40%" stopColor="rgba(200,220,255,0.12)" />
            <stop offset="100%" stopColor="rgba(180,200,240,0.05)" />
          </radialGradient>

          {/* Shadow filter */}
          <filter id="glassShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.25)" />
          </filter>

          {/* Clip for glass content area */}
          <clipPath id="lensClip">
            <circle cx={center} cy={center} r={lensRadius - 1} />
          </clipPath>
        </defs>

        <g filter="url(#glassShadow)">
          {/* Handle */}
          <rect
            x={center + lensRadius * 0.95}
            y={center - handleWidth / 2}
            width={handleLength}
            height={handleWidth}
            rx={handleWidth / 2}
            fill="url(#handleGradient)"
            transform={`rotate(50, ${center}, ${center})`}
          />

          {/* Handle ring (connects handle to rim) */}
          <circle
            cx={center}
            cy={center}
            r={lensRadius + rimWidth * 0.3}
            fill="none"
            stroke="url(#rimGradient)"
            strokeWidth={rimWidth * 0.4}
          />

          {/* Metallic rim */}
          <circle
            cx={center}
            cy={center}
            r={lensRadius}
            fill="none"
            stroke="url(#rimGradient)"
            strokeWidth={rimWidth}
          />

          {/* Glass background — slightly tinted */}
          <circle
            cx={center}
            cy={center}
            r={lensRadius - rimWidth / 2}
            fill="rgba(220, 235, 255, 0.12)"
          />

          {/* Glass reflection shine */}
          <circle
            cx={center}
            cy={center}
            r={lensRadius - rimWidth / 2}
            fill="url(#glassGradient)"
          />

          {/* Small shine highlight */}
          <ellipse
            cx={center - lensRadius * 0.25}
            cy={center - lensRadius * 0.3}
            rx={lensRadius * 0.2}
            ry={lensRadius * 0.1}
            fill="rgba(255,255,255,0.45)"
            transform={`rotate(-25, ${center - lensRadius * 0.25}, ${center - lensRadius * 0.3})`}
          />

          {/* Decorative rivets on the rim */}
          {[0, 90, 180, 270].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const rx = center + (lensRadius + rimWidth * 0.05) * Math.cos(rad);
            const ry = center + (lensRadius + rimWidth * 0.05) * Math.sin(rad);
            return (
              <circle
                key={angle}
                cx={rx}
                cy={ry}
                r={rimWidth * 0.2}
                fill="#DAA520"
                stroke="#8B6914"
                strokeWidth={0.5}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
