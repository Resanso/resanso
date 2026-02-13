"use client";

interface DetectiveLampHeadProps {
  /** Width of the lamp shade in pixels */
  shadeWidth?: number;
  className?: string;
}

/**
 * The head (socket + shade + bulb) of the detective lamp.
 * Wire and mount are handled externally to allow for dynamic separation.
 */
export default function DetectiveLampHead({
  shadeWidth = 120,
  className = "",
}: DetectiveLampHeadProps) {
  const shadeHeight = shadeWidth * 0.4;
  const bulbWidth = shadeWidth * 0.16;
  const bulbHeight = bulbWidth * 1.4;
  const socketWidth = shadeWidth * 0.1;
  const socketHeight = shadeWidth * 0.08;
  const totalWidth = shadeWidth + 20;
  // Calculate total height based on components (socket + shade + bulb sticking out)
  // Bulb sticks out: wireLength + socketHeight + shadeHeight + bulbHeight * 0.45 (center) + radius...
  // Let's approximate the visible height.
  // Original totalHeight was wireLength + ...
  // New height: socketHeight + shadeHeight + bulbHeight + padding
  const totalHeight = socketHeight + shadeHeight + bulbHeight + 10;
  const cx = totalWidth / 2;

  return (
    <div className={`relative ${className}`} style={{ width: totalWidth, height: totalHeight }}>
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }} // Allow glow to spill out
      >
        <defs>
          {/* Shade metallic gradient */}
          <linearGradient id="shadeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="30%" stopColor="#2a2a2a" />
            <stop offset="70%" stopColor="#1f1f1f" />
            <stop offset="100%" stopColor="#151515" />
          </linearGradient>

          {/* Inner shade gradient (reflecting warm light) */}
          <linearGradient id="shadeInnerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3a20" />
            <stop offset="100%" stopColor="#8a6a30" />
          </linearGradient>

          {/* Bulb glow gradient */}
          <radialGradient id="bulbGlow" cx="0.5" cy="0.4" r="0.5">
            <stop offset="0%" stopColor="#fff5d0" />
            <stop offset="40%" stopColor="#ffe4a0" />
            <stop offset="100%" stopColor="#ffc850" />
          </radialGradient>

          {/* Filament glow */}
          <radialGradient id="filamentGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,220,130,0.9)" />
            <stop offset="100%" stopColor="rgba(255,200,80,0)" />
          </radialGradient>

          {/* Shadow filter for the shade */}
          <filter id="lampShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.4)" />
          </filter>

          {/* Bulb outer glow filter */}
          <filter id="bulbOuterGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bulb (rendered first so shade draws on top) */}
        <g filter="url(#bulbOuterGlow)">
          {/* Bulb base (screw part) */}
          <rect
            x={cx - bulbWidth * 0.35}
            y={socketHeight + shadeHeight - 4}
            width={bulbWidth * 0.7}
            height={bulbHeight * 0.25}
            rx={1}
            fill="#c0a060"
            stroke="#8a7040"
            strokeWidth={0.5}
          />

          {/* Bulb glass */}
          <ellipse
            cx={cx}
            cy={socketHeight + shadeHeight + bulbHeight * 0.45}
            rx={bulbWidth / 2}
            ry={bulbHeight * 0.45}
            fill="url(#bulbGlow)"
            opacity={0.95}
          />

          {/* Filament glow */}
          <ellipse
            cx={cx}
            cy={socketHeight + shadeHeight + bulbHeight * 0.35}
            rx={bulbWidth * 0.2}
            ry={bulbHeight * 0.15}
            fill="url(#filamentGlow)"
          />

          {/* Bulb glass highlight */}
          <ellipse
            cx={cx - bulbWidth * 0.15}
            cy={socketHeight + shadeHeight + bulbHeight * 0.25}
            rx={bulbWidth * 0.1}
            ry={bulbHeight * 0.12}
            fill="rgba(255,255,255,0.4)"
            transform={`rotate(-15, ${cx - bulbWidth * 0.15}, ${socketHeight + shadeHeight + bulbHeight * 0.25})`}
          />
        </g>

        {/* Shade + Socket */}
        <g filter="url(#lampShadow)">
          {/* Socket */}
          <rect
            x={cx - socketWidth / 2}
            y={0}
            width={socketWidth}
            height={socketHeight}
            rx={2}
            fill="#2a2a2a"
            stroke="#444"
            strokeWidth={0.5}
          />

          {/* Shade — outer surface */}
          <path
            d={`M ${cx - shadeWidth * 0.15} ${socketHeight - 2}
                L ${cx - shadeWidth / 2} ${socketHeight + shadeHeight - 2}
                Q ${cx - shadeWidth / 2} ${socketHeight + shadeHeight + 3}
                  ${cx - shadeWidth / 2 + 5} ${socketHeight + shadeHeight + 3}
                L ${cx + shadeWidth / 2 - 5} ${socketHeight + shadeHeight + 3}
                Q ${cx + shadeWidth / 2} ${socketHeight + shadeHeight + 3}
                  ${cx + shadeWidth / 2} ${socketHeight + shadeHeight - 2}
                L ${cx + shadeWidth * 0.15} ${socketHeight - 2}
                Z`}
            fill="url(#shadeGrad)"
            stroke="#4a4a4a"
            strokeWidth={0.5}
          />

          {/* Shade — inner rim */}
          <path
            d={`M ${cx - shadeWidth / 2 + 3} ${socketHeight + shadeHeight}
                L ${cx - shadeWidth * 0.13} ${socketHeight + 2}
                L ${cx + shadeWidth * 0.13} ${socketHeight + 2}
                L ${cx + shadeWidth / 2 - 3} ${socketHeight + shadeHeight}
                Z`}
            fill="url(#shadeInnerGrad)"
            opacity={0.4}
          />

          {/* Shade highlight edge */}
          <line
            x1={cx - shadeWidth * 0.14}
            y1={socketHeight - 1}
            x2={cx - shadeWidth / 2 + 4}
            y2={socketHeight + shadeHeight}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
          />
        </g>
      </svg>

      {/* CSS glow halo */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: bulbWidth * 4,
          height: bulbWidth * 4,
          left: cx - bulbWidth * 2,
          top: socketHeight + shadeHeight + bulbHeight * 0.2 - bulbWidth * 2,
          background: "radial-gradient(circle, rgba(255,200,100,0.3) 0%, rgba(255,180,80,0.1) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
