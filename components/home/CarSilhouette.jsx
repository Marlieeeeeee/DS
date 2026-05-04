import React from 'react';

export default function CarSilhouette() {
  return (
    <div className="relative w-56 h-28 mx-auto">
      {/* Glow underneath */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-4 bg-primary/20 rounded-full blur-xl" />
      {/* Simplified car shape using CSS */}
      <svg viewBox="0 0 240 100" className="w-full h-full" fill="none">
        {/* Car body */}
        <path
          d="M20 70 Q20 55 40 50 L70 50 Q80 25 110 20 L160 20 Q190 22 200 50 L220 55 Q225 70 220 75 L20 75 Q15 70 20 70Z"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(0,229,255,0.3)"
          strokeWidth="1"
        />
        {/* Windows */}
        <path
          d="M85 48 Q90 30 112 24 L155 24 Q175 26 182 48Z"
          fill="rgba(0,229,255,0.08)"
          stroke="rgba(0,229,255,0.15)"
          strokeWidth="0.5"
        />
        {/* Window divider */}
        <line x1="140" y1="24" x2="138" y2="48" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" />
        {/* Front wheel */}
        <circle cx="65" cy="75" r="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <circle cx="65" cy="75" r="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        {/* Rear wheel */}
        <circle cx="185" cy="75" r="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <circle cx="185" cy="75" r="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        {/* Headlight */}
        <ellipse cx="30" cy="62" rx="6" ry="4" fill="rgba(0,229,255,0.3)" />
        {/* Taillight */}
        <ellipse cx="218" cy="62" rx="4" ry="4" fill="rgba(255,51,102,0.4)" />
      </svg>
    </div>
  );
}