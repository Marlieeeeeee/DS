import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  { id: 1, name: 'BBS LM 18" Forged Alloys — Set of 4', price: '₹1,20,000', badge: '🔥 Hot Deal', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&h=560&fit=crop' },
  { id: 2, name: 'Akrapovic Slip-On Titanium Exhaust', price: '₹42,000', badge: '🟢 Fair Price', img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=560&fit=crop' },
  { id: 3, name: '2020 Honda CR-V AWD — 32,000 KMs', price: '₹28,50,000', badge: '🔥 Hot Deal', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=560&fit=crop' },
  { id: 4, name: 'KW Variant 3 Coilovers', price: '₹1,10,000', badge: '🟢 Fair Price', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=560&fit=crop' },
];

export default function FeaturedMarketCard() {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const startX = useRef(null);

  const next = () => setIdx((i) => (i + 1) % items.length);
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
    startX.current = null;
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{ height: '220px' }}
      onClick={() => navigate('/market')}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.img key={items[idx].id} src={items[idx].img} alt={items[idx].name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }} draggable={false} />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/20 to-transparent" />

      <div className="absolute top-3 left-3">
        <span className="glass text-[11px] font-bold px-3 py-1.5 rounded-full text-white">{items[idx].badge}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-space font-semibold text-white text-sm leading-snug">{items[idx].name}</p>
        <p className="font-space font-bold text-primary text-xl mt-0.5">{items[idx].price}</p>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {items.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-5 bg-primary' : 'w-1.5 bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
}