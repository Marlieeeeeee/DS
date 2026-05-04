import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, ChevronRight, Zap } from 'lucide-react';

export default function AskMechanicCard({ onOpen }) {
  return (
    <motion.button
      onClick={onOpen}
      whileTap={{ scale: 0.97 }}
      className="w-full relative overflow-hidden rounded-2xl p-5 text-left"
      style={{
        background: 'linear-gradient(135deg, rgba(0,229,255,0.12) 0%, rgba(0,229,255,0.04) 100%)',
        border: '1px solid rgba(0,229,255,0.25)',
        boxShadow: '0 0 40px rgba(0,229,255,0.08), inset 0 1px 0 rgba(0,229,255,0.15)',
      }}
    >
      {/* Glow blob */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-primary/15 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-primary/10 blur-xl pointer-events-none" />

      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(0,229,255,0.15)', border: '1px solid rgba(0,229,255,0.2)' }}>
          <Wrench className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-space font-bold text-white text-base">Ask Our Mechanic</span>
            <Zap className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-xs text-white/50 font-inter leading-relaxed">AI-powered diagnostics for your 2018 Civic. Tap to start.</p>
        </div>
        <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
      </div>
    </motion.button>
  );
}