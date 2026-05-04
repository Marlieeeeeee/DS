import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Fuel, X, Share2, ExternalLink } from 'lucide-react';

const stations = [
  { name: 'HP Petrol', price: '₹103.41', x: '22%', y: '38%', grade: 'Petrol' },
  { name: 'Reliance', price: '₹105.22', x: '62%', y: '22%', grade: 'Premium' },
  { name: 'BPCL', price: '₹102.89', x: '58%', y: '62%', grade: 'Petrol' },
  { name: 'IOC', price: '₹103.10', x: '28%', y: '68%', grade: 'Diesel' },
];

const newsItems = [
  { id: 1, title: 'Tata Nexon EV Max: 500km Range Now Confirmed for 2025 Model Year', source: 'AutoCarIndia', time: '1h ago', img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=300&fit=crop', body: 'Tata Motors has officially confirmed that the Nexon EV Max will feature a new battery pack capable of delivering a certified range of 500km on a single charge, making it one of the most practical EVs in the Indian market.' },
  { id: 2, title: 'Maruti Suzuki Launches New Swift Hybrid in India Starting at ₹8.5L', source: 'CarAndBike', time: '2h ago', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=300&fit=crop', body: 'Maruti Suzuki India has launched the all-new Swift with a mild-hybrid system priced from ₹8.5 lakh ex-showroom. The new generation offers improved fuel economy of 25.75 kmpl.' },
  { id: 3, title: 'Top 5 Monsoon Car Care Tips Every Indian Driver Should Know', source: 'The Drive India', time: '3h ago', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=300&fit=crop', body: 'With monsoon season in full swing, here are the top 5 maintenance checks you should perform to keep your car running smoothly and safely.' },
  { id: 4, title: 'Hyundai Creta N Line: Is It Worth the Premium Over Standard Creta?', source: 'MotorOctane', time: '4h ago', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=300&fit=crop', body: 'We drive the Creta N Line back to back with the standard model to find out if the sporty upgrades justify the price premium.' },
  { id: 5, title: 'Royal Enfield Guerrilla 450 First Ride Review: Bantam Bruiser', source: 'BikeWale', time: '5h ago', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=300&fit=crop', body: 'We take the new Guerrilla 450 for a first ride and find a punchy, accessible middleweight that punches well above its price point.' },
  { id: 6, title: 'Petrol Prices in India Likely to Be Cut by ₹5/Litre Before Elections', source: 'EconomicTimes Auto', time: '6h ago', img: 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=600&h=300&fit=crop', body: 'Industry insiders suggest that a reduction in petrol and diesel prices by up to ₹5 per litre could be announced ahead of the upcoming state elections.' },
  { id: 7, title: 'MG Windsor EV Sales Cross 5,000 Units — Here\'s Why It\'s Flying', source: 'AutoLive', time: '7h ago', img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=300&fit=crop', body: 'MG Motor India reports 5,000 units of the Windsor EV have been delivered, citing the battery-as-a-service model as the primary reason for its success.' },
  { id: 8, title: 'India\'s EV Charging Infrastructure: 2024 State-by-State Report', source: 'EVReporter', time: '8h ago', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=300&fit=crop', body: 'A new government report reveals Maharashtra and Karnataka lead the country in EV charging infrastructure, while several eastern states lag behind significantly.' },
  { id: 9, title: 'Best Used Cars Under ₹5 Lakh in 2024: Our Expert Picks', source: 'CarDekho', time: '9h ago', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=300&fit=crop', body: 'Looking for a reliable used car without breaking the bank? Our experts round up the best options available in the under ₹5 lakh segment for 2024.' },
  { id: 10, title: 'Honda Elevate vs Creta vs Seltos: Which Compact SUV Should You Buy?', source: 'ZigWheels', time: '10h ago', img: 'https://images.unsplash.com/photo-1638386568026-98a2432da2cd?w=600&h=300&fit=crop', body: 'Three of the most popular compact SUVs go head to head in our comprehensive comparison test covering performance, features, and value for money.' },
];

export default function Hub() {
  const [litres, setLitres] = useState('');
  const [locating, setLocating] = useState(false);
  const [expandedArticle, setExpandedArticle] = useState(null);

  const totalCost = litres ? (parseFloat(litres) * 103.41).toFixed(2) : null;

  const handleLocate = () => {
    setLocating(true);
    setTimeout(() => setLocating(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-32">
      {/* Map + Radar */}
      <motion.div className="mx-4 mb-5 glass rounded-2xl overflow-hidden relative" style={{ height: '300px' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Dark map bg */}
        <div className="absolute inset-0 bg-[#080808]">
          <div className="absolute inset-0 opacity-[0.07]">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={`h${i}`} className="absolute w-full h-px bg-white" style={{ top: `${(i + 1) * 7}%` }} />
            ))}
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={`v${i}`} className="absolute h-full w-px bg-white" style={{ left: `${(i + 1) * 7}%` }} />
            ))}
          </div>
          {/* Radar rings */}
          <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2">
            {[130, 88, 50].map((r) => (
              <div key={r} className="absolute rounded-full border border-primary/12"
                style={{ width: r * 2, height: r * 2, left: -r, top: -r }} />
            ))}
            <motion.div
              className="absolute w-4 h-4 rounded-full bg-primary -translate-x-2 -translate-y-2"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ boxShadow: '0 0 12px rgba(0,229,255,0.6)' }}
            />
          </div>
          {/* Stations */}
          {stations.map((s) => (
            <div key={s.name} className="absolute" style={{ left: s.x, top: s.y }}>
              <div className="glass rounded-lg px-2 py-1 flex items-center gap-1.5 -translate-x-1/2 -translate-y-full mb-1">
                <Fuel className="w-3 h-3 text-primary flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-white leading-none">{s.price}</p>
                  <p className="text-[8px] text-muted-foreground">{s.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Locate Me */}
        <motion.button
          onClick={handleLocate}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full glass-strong flex items-center justify-center"
        >
          <motion.div animate={locating ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.8 }}>
            <MapPin className={`w-4 h-4 ${locating ? 'text-primary' : 'text-white/60'}`} />
          </motion.div>
        </motion.button>

        {/* Fuel Calculator */}
        <div className="absolute bottom-3 left-3 glass-strong rounded-xl px-3 py-2.5 flex items-center gap-2">
          <Fuel className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <input
            value={litres}
            onChange={(e) => setLitres(e.target.value)}
            placeholder="Litres"
            type="number"
            className="w-16 bg-transparent text-xs text-white outline-none placeholder-white/30"
          />
          {totalCost && (
            <span className="font-space font-bold text-xs text-primary">= ₹{totalCost}</span>
          )}
        </div>
      </motion.div>

      {/* News Feed */}
      <div className="px-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Latest News</p>
        <div className="space-y-4">
          {newsItems.map((article, i) => (
            <motion.div
              key={article.id}
              className="glass rounded-2xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setExpandedArticle(article)}
            >
              <div className="h-32 relative">
                <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-space font-semibold text-white text-sm leading-snug line-clamp-2">{article.title}</p>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary font-semibold">{article.source}</span>
                  <span className="text-xs text-muted-foreground">• {article.time}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {expandedArticle && (
          <motion.div className="fixed inset-0 z-[110] flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setExpandedArticle(null)} />
            <motion.div className="relative w-full max-w-lg glass-strong rounded-t-3xl overflow-hidden"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className="h-48 relative">
                <img src={expandedArticle.img} alt={expandedArticle.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-white" />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setExpandedArticle(null)} className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                    <X className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-primary font-semibold">{expandedArticle.source}</span>
                  <span className="text-xs text-muted-foreground">• {expandedArticle.time}</span>
                </div>
                <h2 className="font-space font-bold text-white text-base leading-snug mb-3">{expandedArticle.title}</h2>
                <p className="text-sm text-white/60 font-inter leading-relaxed">{expandedArticle.body}</p>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => setExpandedArticle(null)}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-space font-bold text-sm mt-5 glow-cyan">
                  Read Full Article
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}