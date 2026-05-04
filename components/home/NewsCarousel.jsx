import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const news = [
  { id: 1, title: 'Tata Nexon EV Max: 500km Range Now Confirmed for 2025', img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=400&fit=crop', tag: 'EV News' },
  { id: 2, title: 'Maruti Suzuki Launches New Swift Hybrid in India at ₹8.5L', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=400&fit=crop', tag: 'Launch' },
  { id: 3, title: 'Best Monsoon Tyre Upgrades Under ₹15,000', img: 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=800&h=400&fit=crop', tag: 'Tips' },
];

export default function NewsCarousel() {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  const prev = (e) => { e.stopPropagation(); setIdx((i) => (i - 1 + news.length) % news.length); };
  const next = (e) => { e.stopPropagation(); setIdx((i) => (i + 1) % news.length); };

  return (
    <div>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-3">Top News</p>
      <div
        className="relative h-44 rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => navigate('/hub')}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={news[idx].id}
            src={news[idx].img}
            alt={news[idx].title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="glass text-[10px] font-semibold text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
            {news[idx].tag}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-space font-semibold text-white text-sm leading-snug">{news[idx].title}</p>
        </div>
        {/* Arrows */}
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
        {/* Dots */}
        <div className="absolute bottom-2 right-4 flex gap-1">
          {news.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === idx ? 'w-4 bg-primary' : 'w-1 bg-white/30'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}