import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Camera, Search, Filter, Check } from 'lucide-react';
import { useGarage } from '../lib/garageContext';
import { mockMarketListings } from '../lib/garageData';

// ─── Vehicle generation map (brand → generations) ───────────────────────────
const vehicleGenerations = {
  MERCEDES: ['W176 (A-Class)', 'W205 (C-Class)', 'W210 (E-Class)', 'W222 (S-Class)', 'X156 (GLA)', 'W167 (GLE)'],
  HONDA: ['RE4 (CR-V)', 'GE8 (Jazz)', 'FB2 (City)', 'RK1 (Amaze)'],
  PIAGGIO: ['M791 (Vespa VX)', 'M45 (Vespa SXL)', 'M69 (Aprilia SR)'],
  OTHER: ['Universal Fit'],
};

// ─── Filter drawer options ────────────────────────────────────────────────────
const filterOptions = {
  Condition: ['New', 'Like New', 'Good', 'Fair'],
  Category: ['Accessories', 'Performance', 'Vehicles', 'Tools'],
  'Price Range': ['Under ₹1K', '₹1K–5K', '₹5K–25K', '₹25K+'],
  Compatibility: ['OEM', 'Aftermarket', 'Universal Fit', 'Generation Specific'],
};

// ─── Tall layout alternation ─────────────────────────────────────────────────
const withLayout = (items) => items.map((it, i) => ({ ...it, tall: it.tall ?? (i % 2 === 0) }));

// ─── MASTER MOCK DATABASE (15 items) ─────────────────────────────────────────
const marketItems = [
  { id: 1, title: 'Mercedes A-Class OEM Pads', price: '₹8,500', cat: 'OEM Parts', cond: 'New', fit: true, img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80' },
  { id: 2, title: 'BBS LM 19" Silver Wheels', price: '₹92,000', cat: 'Performance', cond: 'Like New', fit: false, img: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: 'K&N Cold Air Intake Kit', price: '₹14,200', cat: 'Performance', cond: 'New', fit: true, img: 'https://images.unsplash.com/photo-1620063236081-3091df8811cf?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: '2015 VW Polo GT TSI', price: '₹5,20,000', cat: 'Vehicles', cond: 'Used', fit: false, img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80' },
  { id: 5, title: 'Garrett G-Series Turbo', price: '₹1,45,000', cat: 'Performance', cond: 'New', fit: false, img: 'https://images.unsplash.com/photo-1536640306354-f58c7014ea8b?auto=format&fit=crop&w=600&q=80' },
  { id: 6, title: 'Snap-On Digital Wrench', price: '₹32,000', cat: 'Gear & Tools', cond: 'Good', fit: false, img: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?auto=format&fit=crop&w=600&q=80' },
  { id: 7, title: 'Mercedes Genuine Floor Mats', price: '₹4,500', cat: 'Accessories', cond: 'New', fit: true, img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80' },
  { id: 8, title: 'Akrapovič Carbon Slip-On', price: '₹42,000', cat: 'Performance', cond: 'Like New', fit: true, img: 'https://images.unsplash.com/photo-1596769974241-79ba0a6e0e64?auto=format&fit=crop&w=600&q=80' },
  { id: 9, title: 'Recaro Pole Position Seat', price: '₹1,15,000', cat: 'Interior', cond: 'New', fit: false, img: 'https://images.unsplash.com/photo-1589148939768-3e4b78759d64?auto=format&fit=crop&w=600&q=80' },
  { id: 10, title: 'Ohlins Road & Track Coilovers', price: '₹1,85,000', cat: 'Performance', cond: 'New', fit: true, img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80' },
  { id: 11, title: 'Harley-Davidson Fat Boy', price: '₹16,50,000', cat: 'Vehicles', cond: 'Used', fit: false, img: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&w=600&q=80' },
  { id: 12, title: 'Brembo Red Calipers (Set)', price: '₹55,000', cat: 'Performance', cond: 'Refurbished', fit: true, img: 'https://images.unsplash.com/photo-1600662283204-7a91176b5cfa?auto=format&fit=crop&w=600&q=80' },
  { id: 13, title: 'Mercedes W176 Front Lip', price: '₹18,000', cat: 'Accessories', cond: 'New', fit: true, img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80' },
  { id: 14, title: 'Castrol Edge 5W-40 (5L)', price: '₹4,200', cat: 'OEM Parts', cond: 'New', fit: true, img: 'https://images.unsplash.com/photo-1620063236081-3091df8811cf?auto=format&fit=crop&w=600&q=80' },
  { id: 15, title: 'OBD-II Wireless Scanner', price: '₹1,500', cat: 'Gear & Tools', cond: 'New', fit: true, img: 'https://images.unsplash.com/photo-1517030330234-94c4fa948ebc?auto=format&fit=crop&w=600&q=80' },
];

// ─── AD DETAIL MODAL ──────────────────────────────────────────────────────────
function AdDetailModal({ item, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-[120] flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-lg glass-strong rounded-t-3xl overflow-hidden"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <div className="h-56 relative">
          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </motion.button>
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`glass text-[10px] font-bold px-2.5 py-1 rounded-full ${item.badge === 'Hot Deal' ? 'text-brake-red' : 'text-apex-green'}`}>{item.badge}</span>
            {item.compatible && (
              <span className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> PERFECT FIT
              </span>
            )}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-space font-bold text-white text-lg leading-tight">{item.name}</h3>
              {item.km && <p className="text-xs text-muted-foreground mt-0.5">{item.km}</p>}
            </div>
            <p className="font-space font-bold text-primary text-xl">{item.price}</p>
          </div>
          <p className="text-sm text-white/60 font-inter leading-relaxed mb-4">{item.desc}</p>
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{item.seller?.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{item.seller}</p>
              <p className="text-xs text-muted-foreground">{item.location}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.96 }} onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl glass font-space font-bold text-sm text-white/60">Save</motion.button>
            <motion.button whileTap={{ scale: 0.96 }}
              className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-space font-bold text-sm glow-cyan">
              Contact Seller
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── CREATE AD MODAL ──────────────────────────────────────────────────────────
function CreateAdModal({ onClose, onSubmit, activeVehicle }) {
  const [form, setForm] = useState({ title: '', price: '', condition: '', desc: '', category: '', generation: '' });
  const [photo, setPhoto] = useState(null);
  const fileRef = useRef(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const generations = vehicleGenerations[activeVehicle?.brand] || vehicleGenerations.OTHER;

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <motion.div className="fixed inset-0 z-[120] flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-lg glass-strong rounded-t-3xl overflow-hidden pb-8"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
          <h3 className="font-space font-bold text-white text-base">Post a Listing</h3>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </div>
        <div className="px-5 pt-4 space-y-4 max-h-[70vh] overflow-y-auto pb-4">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
            style={{ height: photo ? 'auto' : '100px' }}>
            {photo ? (
              <img src={photo} alt="upload" className="w-full h-40 object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Camera className="w-6 h-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Add Photo</p>
              </div>
            )}
          </motion.button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

          <div>
            <label className="text-[9px] text-[#00E5FF] uppercase tracking-[0.2em] mb-1.5 block font-bold">Vehicle Generation (for compatibility)</label>
            <div className="grid grid-cols-2 gap-2">
              {generations.map((gen) => (
                <button key={gen} onClick={() => set('generation', gen)}
                  className={`py-2.5 px-3 rounded-xl text-[9px] font-bold uppercase tracking-wider border transition-all duration-300 active:scale-[0.98] text-left ${form.generation === gen ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50 text-[#00E5FF]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                  {gen}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-1.5 block font-bold">Title</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder='e.g. BBS 18" Alloy Wheels — Set of 4'
              className="w-full glass rounded-xl px-4 py-3 text-white text-sm bg-transparent outline-none border border-white/5 focus:border-[#00E5FF]/40 transition-colors" />
          </div>

          <div>
            <label className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-1.5 block font-bold">Description</label>
            <textarea value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Describe the item..." rows={3}
              className="w-full glass rounded-xl px-4 py-3 text-white text-sm bg-transparent outline-none border border-white/5 focus:border-[#00E5FF]/40 transition-colors resize-none" />
          </div>

          <div>
            <label className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-1.5 block font-bold">Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}
              className="w-full glass rounded-xl px-4 py-3 text-white text-sm bg-[#121212] outline-none border border-white/5">
              <option value="" className="bg-[#111]">Select Category</option>
              {['Vehicles', 'Accessories', 'Performance'].map((c) => (
                <option key={c} value={c} className="bg-[#111]">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-1.5 block font-bold">Price (₹)</label>
            <input value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="e.g. 58000" type="number"
              className="w-full glass rounded-xl px-4 py-3 text-white text-sm bg-transparent outline-none border border-white/5 focus:border-[#00E5FF]/40 transition-colors" />
          </div>

          <div>
            <label className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-1.5 block font-bold">Condition</label>
            <div className="grid grid-cols-2 gap-2">
              {['New', 'Like New', 'Good', 'Fair'].map((c) => (
                <button key={c} onClick={() => set('condition', c)}
                  className={`py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider border transition-all duration-300 active:scale-[0.98] ${form.condition === c ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50 text-[#00E5FF]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <motion.button whileTap={{ scale: 0.96 }} disabled={!form.title || !form.price || !form.condition || !form.category}
            onClick={() => { onSubmit({ ...form, photo }); onClose(); }}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-space font-bold text-base glow-cyan disabled:opacity-40">
            Publish Listing
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── FILTER DRAWER ────────────────────────────────────────────────────────────
function FilterDrawer({ onClose }) {
  const [selected, setSelected] = useState({});
  const toggle = (section, val) => setSelected((s) => ({ ...s, [section]: s[section] === val ? null : val }));
  const clearAll = () => setSelected({});

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative w-[85%] inset-y-0 right-0 h-full bg-[#0a0a0a] border-l border-white/10 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
          <span className="text-white font-black uppercase tracking-widest text-xs">Refine Search</span>
          <div className="flex items-center gap-4">
            <button onClick={clearAll} className="text-[#00E5FF] text-[9px] font-bold uppercase tracking-widest hover:brightness-125 transition-all">Clear All</button>
            <button onClick={onClose} className="text-white/40 text-xl">&times;</button>
          </div>
        </div>

        {/* Filter sections */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 flex flex-col gap-7 pb-28">
          {Object.entries(filterOptions).map(([section, opts]) => (
            <div key={section} className="flex flex-col gap-3">
              <span className="text-[9px] text-[#00E5FF] font-bold uppercase tracking-[0.25em]">{section}</span>
              <div className="grid grid-cols-2 gap-2">
                {opts.map((opt) => (
                  <button key={opt} onClick={() => toggle(section, opt)}
                    className={`py-2.5 px-3 rounded-xl border text-[9px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] text-left ${selected[section] === opt ? 'bg-[#00E5FF]/10 border-[#00E5FF]/40 text-[#00E5FF]' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="absolute bottom-0 left-0 w-full px-6 py-6 bg-[#0a0a0a] border-t border-white/5">
          <button onClick={onClose}
            className="w-full bg-[#00E5FF] text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-[0_10px_20px_rgba(0,229,255,0.2)] hover:brightness-110 transition-all duration-300 active:scale-[0.98]">
            Apply Refinements
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── LISTING CARD ─────────────────────────────────────────────────────────────
function ListingCard({ item, onClick }) {
  return (
    <motion.div
      className="relative aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 bg-[#121212]"
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }} onClick={onClick}>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none" />
      <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
        <p className="text-white font-medium text-xs leading-tight">{item.name}</p>
        <p className="font-space font-bold text-base text-primary mt-0.5">{item.price}</p>
      </div>
    </motion.div>
  );
}

// ─── MAIN MARKET PAGE ─────────────────────────────────────────────────────────
export default function Market() {
  const { activeVehicle } = useGarage();
  const vehicleName = activeVehicle?.nickname || activeVehicle?.model || 'YOUR VEHICLE';

  const [marketView, setMarketView] = useState('compatible');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Fitment');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAd, setSelectedAd] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [extraAds, setExtraAds] = useState([]);

  const marketCategories = marketView === 'compatible'
    ? ['All Fitment', 'OEM Parts', 'Performance', 'Accessories']
    : ['Vehicles', 'Parts & Mods', 'Gear & Tools'];

  const getListings = () => {
    // Step 4: filter by compatible toggle first
    let base = marketItems.filter((it) => marketView === 'compatible' ? it.fit : true);

    // Category filter (skip for "All Fitment" / first item in each view)
    const firstCat = marketCategories[0];
    if (activeCategory !== firstCat) {
      base = base.filter((it) => it.cat === activeCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter((it) => it.title?.toLowerCase().includes(q));
    }

    // Normalize shape for ListingCard + extraAds
    const normalized = base.map((it, i) => ({
      id: it.id,
      name: it.title,
      price: it.price,
      img: it.img,
      condition: it.cond,
      category: it.cat,
      compatible: it.fit,
      badge: it.cond,
      tall: i % 2 === 0,
      seller: 'Verified Seller',
      location: 'India',
      desc: it.title,
    }));

    return [...extraAds, ...normalized];
  };

  const listings = getListings();
  const leftCol = listings.filter((_, i) => i % 2 === 0);
  const rightCol = listings.filter((_, i) => i % 2 === 1);

  return (
    <div className="min-h-screen bg-background pb-32">

      {/* ── INTELLIGENT FEED HEADER ── */}
      <div className="flex flex-col px-4 pt-4 shrink-0 z-20">
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col">
            <span className="text-[#00E5FF] font-black text-[9px] uppercase tracking-[0.4em] mb-1">Marketplace</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              {marketView === 'compatible' ? `FOR YOUR ${activeVehicle?.nickname || activeVehicle?.name || 'VEHICLE'}` : 'GLOBAL MARKET'}
            </h2>
          </div>
          <div className="flex bg-[#121212] border border-white/10 rounded-full p-1 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
            <button onClick={() => { setMarketView('compatible'); setActiveCategory('All Fitment'); }}
              className={`px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.98] ${marketView === 'compatible' ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'text-white/40 hover:text-white/80'}`}>
              For Your Vehicle
            </button>
            <button onClick={() => { setMarketView('global'); setActiveCategory('Vehicles'); }}
              className={`px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.98] ${marketView === 'global' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/80'}`}>
              Global
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#00E5FF]/50 transition-all duration-300">
            <Search className="w-4 h-4 text-white/20 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parts, builds, tools..."
              className="bg-transparent text-white text-xs outline-none w-full uppercase tracking-wider font-bold placeholder:text-white/20"
            />
          </div>
          <button onClick={() => setShowFilterDrawer(true)}
            className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-95 text-[#00E5FF] shadow-[inset_0_0_10px_rgba(0,229,255,0.05)]">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills — contextual per marketView */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 snap-x pb-1">
          {marketCategories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full border text-[9px] font-bold uppercase tracking-widest transition-all duration-300 snap-start outline-none active:scale-[0.98] ${activeCategory === cat ? 'bg-white/5 border-[#00E5FF] text-[#00E5FF] shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]' : 'bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── MASONRY GRID ── */}
      <AnimatePresence mode="wait">
        <motion.div key={marketView + activeCategory + searchQuery} className="px-4 flex gap-3"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {[leftCol, rightCol].map((col, colIdx) => (
            <div key={colIdx} className="flex-1 flex flex-col gap-3">
              {col.map((item) => (
                <ListingCard key={item.id} item={item} onClick={() => setSelectedAd(item)} />
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── FAB ── */}
      <motion.button onClick={() => setCreateOpen(true)} whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-primary flex items-center justify-center glow-cyan z-40"
        style={{ boxShadow: '0 0 30px rgba(0,229,255,0.4)' }}>
        <Plus className="w-6 h-6 text-black" />
      </motion.button>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {selectedAd && <AdDetailModal item={selectedAd} onClose={() => setSelectedAd(null)} />}
        {createOpen && (
          <CreateAdModal
            activeVehicle={activeVehicle}
            onClose={() => setCreateOpen(false)}
            onSubmit={(form) => {
              setExtraAds((prev) => [{
                id: `local_${Date.now()}`,
                name: form.title,
                price: `₹${parseInt(form.price || 0).toLocaleString('en-IN')}`,
                badge: 'Your Listing',
                img: form.photo || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=420&fit=crop',
                tall: true,
                seller: 'You',
                location: 'Your City',
                km: null,
                desc: form.desc,
                category: form.category,
                compatible: form.generation?.includes(activeVehicle?.vaultData?.modelNo),
              }, ...prev]);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── FILTER DRAWER ── */}
      <AnimatePresence>
        {showFilterDrawer && <FilterDrawer onClose={() => setShowFilterDrawer(false)} />}
      </AnimatePresence>
    </div>
  );
}