import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { LocateFixed, MapPin, X, Search } from 'lucide-react';

export default function LocationPickerModal({ onClose, onSelect }) {
  const [mode, setMode] = useState(null); // 'search' once user opens search
  const [searchVal, setSearchVal] = useState('');

  const handleLive = () => {
    onSelect({ label: 'My Location' });
  };

  const handleSearchSubmit = () => {
    const val = searchVal.trim();
    if (!val) return;
    onSelect({ label: val });
  };

  // Render OUTSIDE the card's stacking context via a portal so the fixed
  // backdrop covers the whole viewport instead of getting trapped inside the
  // radar card's `overflow-hidden` ancestor.
  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Frosted backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      />

      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-sm bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <p className="font-space font-bold text-white text-sm">Find Fuel Stations Near</p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Live location */}
        <button
          onClick={handleLive}
          className="w-full flex items-center gap-4 bg-white/[0.04] hover:bg-white/[0.08] rounded-2xl p-4 transition-colors text-left"
          style={{ border: '1px solid rgba(0,229,255,0.25)' }}
        >
          <LocateFixed className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="font-space font-semibold text-white text-sm">Use My Live Location</p>
            <p className="text-[10px] text-white/60 mt-0.5">Detect nearby pumps automatically</p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] text-white/40">or search</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Search */}
        {mode !== 'search' ? (
          <button
            onClick={() => setMode('search')}
            className="w-full flex items-center gap-4 bg-white/[0.04] hover:bg-white/[0.08] rounded-2xl p-4 transition-colors text-left"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <MapPin className="w-5 h-5 text-white/70 flex-shrink-0" />
            <p className="font-space font-semibold text-white text-sm">Search a Location</p>
          </button>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
              placeholder="e.g. Vyttila, Kochi"
              autoFocus
              className="w-full bg-white/[0.05] rounded-xl pl-4 pr-20 py-3 text-sm text-white placeholder-white/40 outline-none border border-primary/30 focus:border-primary/60"
            />
            <button
              onClick={handleSearchSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary/20 hover:bg-primary/30 rounded-lg px-3 py-1.5 flex items-center gap-1.5"
            >
              <Search className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-bold">Go</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}