import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useGarage } from '../../lib/garageContext';

function BrandLogo({ logoUrl, brand, size = 28 }) {
  if (logoUrl) {
    return <img src={logoUrl} alt={brand} style={{ width: size, height: size, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />;
  }
  return (
    <div style={{ width: size, height: size }} className="rounded-full bg-white/10 flex items-center justify-center">
      <span className="font-rajdhani font-bold text-white text-xs">{(brand || '?').charAt(0)}</span>
    </div>
  );
}

function CompletionRing({ pct, size = 52 }) {
  const stroke = 3.5;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 90 ? '#00E5FF' : '#444444';
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ filter: pct >= 90 ? 'drop-shadow(0 0 4px #00E5FF80)' : 'none' }} />
      </svg>
      {/* Brand logo centered — no percentage text inside */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <BrandLogo logoUrl={undefined} brand="" size={0} />
      </div>
    </div>
  );
}

export default function GarageSummaryCard() {
  const navigate = useNavigate();
  const { vehicles } = useGarage();

  return (
    <motion.div whileTap={{ scale: 0.98 }} onClick={() => navigate('/garage')}
      className="glass rounded-2xl p-5 cursor-pointer">
      <div className="flex items-center justify-between mb-5">
        <p className="font-space font-bold text-white text-sm">My Garage</p>
        <div className="flex items-center gap-1 text-xs text-primary">
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="space-y-4">
        {vehicles.map((v) => {
          const isComplete = v.status === 'Complete' || v.completion >= 100;
          const color = isComplete ? '#00E5FF' : v.completion >= 90 ? '#00E5FF' : '#888';
          const stroke = 3.5;
          const size = 52;
          const r = (size - stroke * 2) / 2;
          const circ = 2 * Math.PI * r;
          const offset = isComplete ? 0 : circ - (v.completion / 100) * circ;
          return (
            <div key={v.id} className="flex items-center gap-4">
              {/* Ring with brand logo inside — NO text inside ring */}
              <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90 absolute inset-0">
                  <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
                  <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                   strokeLinecap={isComplete ? 'butt' : 'round'}
                   strokeDasharray={circ}
                   strokeDashoffset={offset}
                   style={{ filter: isComplete || v.completion >= 90 ? 'drop-shadow(0 0 4px #00E5FF80)' : 'none' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BrandLogo logoUrl={v.logoUrl} brand={v.brand} size={22} />
                </div>
              </div>

              {/* Info — completion % text is HERE, outside the ring */}
              <div className="flex-1 min-w-0">
                <p className="font-space font-semibold text-white text-sm truncate">{v.nickname || v.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-space font-bold text-xs" style={{ color }}>
                    {isComplete ? '✓ Complete' : `${v.completion}% Complete`}
                  </span>
                  {!isComplete && v.completion < 90 && (
                    <span className="text-[10px] text-amber-warning font-medium">— Action needed</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{v.marketValue} est. value</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}