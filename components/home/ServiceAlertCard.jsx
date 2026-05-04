import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, ChevronRight, X, Phone, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useGarage } from '../../lib/garageContext';

// Service intervals in km by service type
const SERVICE_INTERVALS = {
  'Oil Change':      5000,
  'Routine Service': 10000,
  'Brakes':          20000,
  'Tires':           15000,
  'Battery':         40000,
  'fuel':            5000,   // fuel logs track oil-change cadence as a proxy
};
const DEFAULT_INTERVAL = 10000; // km between services if no specific type

const WORKSHOPS = [
  { name: 'ProAuto Service Centre',    rating: 4.8, dist: '1.2 km', tel: '+919876543210', speciality: 'Multi-brand' },
  { name: 'Honda Authorized Workshop', rating: 4.6, dist: '2.4 km', tel: '+919876543211', speciality: 'Honda · Authorised' },
  { name: 'FastFix Auto Garage',       rating: 4.5, dist: '3.1 km', tel: '+919876543212', speciality: 'Express Service' },
];

// Parse mileage string like "18,420" → 18420
function parseMileage(raw) {
  if (!raw) return 0;
  return parseInt(String(raw).replace(/[^0-9]/g, ''), 10) || 0;
}

// Compute alert for a single vehicle given its logs
function computeAlert(vehicle, logs) {
  const currentKm = parseMileage(vehicle.mileage);
  if (!currentKm) return null;

  // Find the most recent service log
  const serviceLogs = logs
    .filter((l) => l.vehicle_id === String(vehicle.id) && l.log_type === 'service')
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const lastService = serviceLogs[0];
  const lastServiceKm = lastService?.odometer || 0;
  const serviceType = lastService?.service_type || 'Routine Service';
  const interval = SERVICE_INTERVALS[serviceType] || DEFAULT_INTERVAL;

  const nextServiceKm = lastServiceKm + interval;
  const kmRemaining = nextServiceKm - currentKm;
  const ALERT_THRESHOLD = 1000; // trigger 1,000 km before due

  if (kmRemaining > ALERT_THRESHOLD) return null; // no alert needed

  const isOverdue = kmRemaining <= 0;
  const urgency = isOverdue ? 'overdue' : kmRemaining <= 300 ? 'critical' : 'upcoming';

  return {
    vehicle,
    serviceType,
    nextServiceKm,
    kmRemaining: Math.max(0, kmRemaining),
    isOverdue,
    urgency,
    lastServiceKm,
  };
}

// Severity styling
const URGENCY = {
  overdue:  { color: '#FF3366', bg: 'rgba(255,51,102,0.08)',  border: 'rgba(255,51,102,0.25)',  label: 'Overdue',  icon: '🚨' },
  critical: { color: '#FFB300', bg: 'rgba(255,179,0,0.08)',   border: 'rgba(255,179,0,0.25)',   label: 'Critical', icon: '⚠️' },
  upcoming: { color: '#00E5FF', bg: 'rgba(0,229,255,0.06)',   border: 'rgba(0,229,255,0.2)',    label: 'Due Soon', icon: '🔧' },
};

// Book Modal
function BookModal({ alert, onClose }) {
  const u = URGENCY[alert.urgency];
  return (
    <motion.div className="fixed inset-0 z-[130] flex items-end justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-lg rounded-t-3xl overflow-hidden pb-8"
        style={{ background: '#0c0c0c', border: '1px solid rgba(0,229,255,0.15)', borderBottom: 'none' }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}>

        {/* Accent bar */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${u.color}, transparent)` }} />

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
          <div>
            <h3 className="font-space font-bold text-white">Book a Service Slot</h3>
            <p className="text-xs text-white/40 mt-0.5">
              {u.icon} {alert.serviceType} · {alert.vehicle.nickname || alert.vehicle.model}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Alert summary */}
        <div className="mx-5 mt-4 rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ background: u.bg, border: `1px solid ${u.border}` }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: u.color }} />
          <div>
            <p className="text-sm font-semibold text-white">
              {alert.isOverdue
                ? `${alert.serviceType} is overdue`
                : `${alert.serviceType} due in ${alert.kmRemaining.toLocaleString('en-IN')} km`}
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              Next service at {alert.nextServiceKm.toLocaleString('en-IN')} km · Current: {parseMileage(alert.vehicle.mileage).toLocaleString('en-IN')} km
            </p>
          </div>
        </div>

        {/* Verified workshops */}
        <div className="px-5 mt-5 space-y-3">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Verified Workshops Nearby</p>
          {WORKSHOPS.map((w, i) => (
            <motion.a key={w.name} href={`tel:${w.tel}`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 rounded-2xl p-4 block"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)' }}>
                <Wrench className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-space font-semibold text-white text-sm truncate">{w.name}</p>
                <p className="text-[10px] text-white/35 mt-0.5">⭐ {w.rating} · {w.dist} · {w.speciality}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0"
                style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.25)' }}>
                <Phone className="w-3 h-3 text-apex-green" />
                <span className="text-xs text-apex-green font-bold">Book</span>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Single Alert Row
function AlertRow({ alert, onBook }) {
  const u = URGENCY[alert.urgency];
  const currentKm = parseMileage(alert.vehicle.mileage);

  return (
    <motion.div className="rounded-2xl p-4 flex items-center gap-4"
      style={{ background: u.bg, border: `1px solid ${u.border}` }}
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
      {/* Vehicle icon */}
      <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0"
        style={{ border: `1px solid ${u.color}30` }}>
        <img src={alert.vehicle.img} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${u.color}18`, color: u.color, border: `1px solid ${u.color}30` }}>
            {u.icon} {u.label}
          </span>
        </div>
        <p className="font-space font-semibold text-white text-sm truncate">
          {alert.vehicle.nickname || alert.vehicle.model}
        </p>
        <p className="text-xs text-white/40 mt-0.5">
          {alert.serviceType} ·{' '}
          {alert.isOverdue
            ? `${(currentKm - alert.nextServiceKm).toLocaleString('en-IN')} km overdue`
            : `Due in ${alert.kmRemaining.toLocaleString('en-IN')} km`}
        </p>
      </div>

      <motion.button whileTap={{ scale: 0.93 }} onClick={() => onBook(alert)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-all"
        style={{ background: `${u.color}15`, border: `1px solid ${u.color}35`, color: u.color }}>
        Book <ChevronRight className="w-3.5 h-3.5" />
      </motion.button>
    </motion.div>
  );
}

export default function ServiceAlertCard() {
  const { vehicles } = useGarage();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingAlert, setBookingAlert] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ds_dismissed_alerts') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    // 100% local — synthesize one mock service log per vehicle so alerts compute deterministically
    const mockLogs = vehicles.map((v) => ({
      vehicle_id: String(v.id),
      log_type: 'service',
      service_type: 'Routine Service',
      // Place the "last service" so a few vehicles show as due-soon / overdue
      odometer: Math.max(0, parseMileage(v.mileage) - 9200),
      created_date: new Date().toISOString(),
    }));
    const computed = vehicles
      .map((v) => computeAlert(v, mockLogs))
      .filter(Boolean)
      .filter((a) => !dismissed.includes(`${a.vehicle.id}_${a.serviceType}`))
      .sort((a, b) => a.kmRemaining - b.kmRemaining);
    setAlerts(computed);
    setLoading(false);
  }, [vehicles, dismissed]);

  const dismiss = (alert) => {
    const key = `${alert.vehicle.id}_${alert.serviceType}`;
    const next = [...dismissed, key];
    setDismissed(next);
    localStorage.setItem('ds_dismissed_alerts', JSON.stringify(next));
  };

  // No alerts — don't render anything
  if (loading || alerts.length === 0) return null;

  return (
    <>
      <motion.div className="space-y-3"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,179,0,0.15)' }}>
              <Clock className="w-3 h-3 text-amber-warning" />
            </div>
            <p className="font-space font-bold text-xs uppercase tracking-widest" style={{ color: '#A0A0A0' }}>
              Upcoming Service
            </p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(255,179,0,0.15)', color: '#FFB300' }}>
              {alerts.length}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/25">
            <CheckCircle2 className="w-3 h-3" /> AI-analysed
          </div>
        </div>

        {/* Alert rows */}
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={`${alert.vehicle.id}_${alert.serviceType}`} className="relative">
              <AlertRow alert={alert} onBook={setBookingAlert} />
              <button
                onClick={() => dismiss(alert)}
                className="absolute top-3 right-14 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity">
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Book Modal */}
      <AnimatePresence>
        {bookingAlert && (
          <BookModal alert={bookingAlert} onClose={() => setBookingAlert(null)} />
        )}
      </AnimatePresence>
    </>
  );
}