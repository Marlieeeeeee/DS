import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, Navigation, LocateFixed, X, CheckCircle2 } from 'lucide-react';
import { useGarage } from '../../lib/garageContext';
import LocationPickerModal from './LocationPickerModal';

// Mock trip output (per user spec)
const MOCK_TRIP_KM = 18.5;
const MOCK_TRIP_COST = 245;

// Static frosted-glass mock fuel station pins
const MOCK_STATIONS = [
  { id: 'hp', name: 'HP Petrol', petrol: 103.41, diesel: 89.62, x: '22%', y: '38%', cheapest: true },
  { id: 'reliance', name: 'Reliance BP', petrol: 105.22, diesel: 90.10, x: '62%', y: '22%' },
  { id: 'ioc', name: 'IndianOil', petrol: 103.10, diesel: 89.88, x: '50%', y: '68%' },
];

export default function FuelRadarCard() {
  const { activeVehicle } = useGarage();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [roundTrip, setRoundTrip] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [fuelType, setFuelType] = useState('petrol');
  const [locationLabel, setLocationLabel] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Live mock trip cost as soon as both fields have content
  const showMockCost = from.trim().length > 0 && to.trim().length > 0;
  const totalKm = showMockCost ? (roundTrip ? MOCK_TRIP_KM * 2 : MOCK_TRIP_KM) : null;
  const totalCost = showMockCost ? (roundTrip ? MOCK_TRIP_COST * 2 : MOCK_TRIP_COST) : null;
  const vehicleLabel = activeVehicle?.label || `${activeVehicle?.brand || ''} ${activeVehicle?.model || ''}`.trim() || 'your vehicle';

  const handleLocationSelected = (payload) => {
    setLocationLabel(payload?.label || 'Nearby');
    setShowLocationPicker(false);
    setSelectedStation(null);
    setToastVisible(true);
  };

  // Auto-close toast after 3 seconds
  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(() => setToastVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Static dark grid radar */}
      <div className="relative bg-[#060606]" style={{ height: '180px' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowLocationPicker(true);
          }}
          className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
          style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)' }}>
          <LocateFixed className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold text-primary">
            {locationLabel || 'Find Near Me'}
          </span>
        </motion.button>

        {/* Static dark grid */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`grid-${i}`}>
              <div className="absolute w-full h-px bg-white" style={{ top: `${(i + 1) * 9}%` }} />
              <div className="absolute h-full w-px bg-white" style={{ left: `${(i + 1) * 9}%` }} />
            </div>
          ))}
        </div>

        {/* Centred pulse */}
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
          {[80, 55, 30].map((r) => (
            <div key={r} className="absolute rounded-full border border-primary/10"
              style={{ width: r * 2, height: r * 2, left: -r, top: -r }} />
          ))}
          <motion.div className="absolute w-3 h-3 rounded-full bg-primary -translate-x-1.5 -translate-y-1.5"
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ boxShadow: '0 0 12px rgba(0,229,255,0.8)' }} />
        </div>

        {/* Frosted-glass pins */}
        {MOCK_STATIONS.map((s) => (
          <div key={s.id} className="absolute cursor-pointer" style={{ left: s.x, top: s.y }}
            onClick={() => setSelectedStation(selectedStation?.id === s.id ? null : s)}>
            <div className={`rounded-lg px-2 py-1 flex items-center gap-1.5 -translate-x-1/2 -translate-y-full transition-all ${
              selectedStation?.id === s.id
                ? 'bg-primary/20 border border-primary/40'
                : s.cheapest
                  ? 'border border-apex-green/40 bg-apex-green/10'
                  : 'glass'
            }`}>
              <Fuel className={`w-2.5 h-2.5 flex-shrink-0 ${s.cheapest ? 'text-apex-green' : 'text-primary'}`} />
              <div>
                <p className={`text-[9px] font-bold leading-none ${s.cheapest ? 'text-apex-green' : 'text-white'}`}>₹{s[fuelType].toFixed(2)}</p>
                <p className="text-[8px] text-muted-foreground truncate max-w-[60px]">{s.name}</p>
              </div>
            </div>
          </div>
        ))}

        <AnimatePresence>
          {selectedStation && (
            <motion.div className="absolute bottom-2 left-1/2 -translate-x-1/2 glass-strong rounded-xl px-4 py-2.5 flex items-center gap-3"
              style={{ minWidth: '200px' }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{selectedStation.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  P: ₹{selectedStation.petrol} · D: ₹{selectedStation.diesel}
                </p>
              </div>
              <motion.button whileTap={{ scale: 0.9 }}
                onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedStation.name + ' fuel station')}`, '_blank')}
                className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 rounded-lg px-3 py-1.5 flex-shrink-0">
                <Navigation className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary font-bold">Go</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trip Calculator */}
      <div className="p-4 space-y-3 border-t border-white/5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Trip Cost Calculator</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setFuelType(fuelType === 'petrol' ? 'diesel' : 'petrol')}
              className="text-[10px] glass rounded-full px-2.5 py-1 text-primary font-bold">
              {fuelType === 'petrol' ? 'Petrol' : 'Diesel'}
            </button>
            <button onClick={() => setRoundTrip((r) => !r)}
              className={`text-[10px] rounded-full px-2.5 py-1 font-bold transition-all ${roundTrip ? 'bg-primary/20 text-primary border border-primary/30' : 'glass text-white/40'}`}>
              ↩ Round
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From (e.g., Vyttila)"
            className="flex-1 min-w-0 bg-transparent rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 outline-none border border-white/10 focus:border-primary/40"
          />
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To (e.g., Marine Drive)"
            className="flex-1 min-w-0 bg-transparent rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 outline-none border border-white/10 focus:border-primary/40"
          />
        </div>

        {showMockCost && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl px-4 py-3 text-center">
            <p className="text-xs font-space text-white">
              Estimated Trip Cost: <span className="text-primary font-bold text-base">₹{totalCost}</span>
              <span className="text-white/60"> ({totalKm?.toFixed(1)} KMs)</span>
            </p>
            <p className="text-[10px] text-white/40 mt-1">based on {vehicleLabel}</p>
          </motion.div>
        )}
      </div>

      {/* Inline auto-closing toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-[#121212] border border-primary/30 rounded-xl px-4 py-3 shadow-2xl"
          >
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-sm font-space font-semibold text-white">Location updated</p>
            <button
              onClick={() => setToastVisible(false)}
              className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLocationPicker && (
          <LocationPickerModal
            key="location-picker"
            onClose={() => setShowLocationPicker(false)}
            onSelect={handleLocationSelected}
          />
        )}
      </AnimatePresence>
    </div>
  );
}