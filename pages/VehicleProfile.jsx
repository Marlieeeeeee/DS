import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Share2, Settings, X, FileText, Shield, Wind, ChevronRight, Tag, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useGarage } from '../lib/garageContext';
import DocOCRModal from '../components/garage/DocOCRModal';

const priceHistory = [
  { year: '2020', value: 3800000 }, { year: '2021', value: 3500000 },
  { year: '2022', value: 3200000 }, { year: '2023', value: 2900000 }, { year: '2024', value: 2850000 },
];

const paintColors = [
  { name: 'Midnight Black', hex: '#111111' },
  { name: 'Pearl White', hex: '#F5F5F5' },
  { name: 'Gunmetal', hex: '#4A5568' },
  { name: 'Ruby Red', hex: '#C0392B' },
];

const docs = [
  { icon: FileText, label: 'RC', sublabel: 'Registration Certificate' },
  { icon: Shield, label: 'Insurance', sublabel: 'Policy Document' },
  { icon: Wind, label: 'PUC', sublabel: 'Pollution Certificate' },
];

function LicensePlate({ plate }) {
  return (
    <div className="inline-flex items-center gap-0 rounded-md overflow-hidden border-2 border-black/20 shadow-lg">
      <div className="bg-[#1a3faa] h-full px-1.5 py-1 flex items-center justify-center">
        <p className="text-white font-bold" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontSize: '7px', letterSpacing: '0.15em' }}>IND</p>
      </div>
      <div className="bg-white px-4 py-1.5">
        <p className="font-bold text-black text-base tracking-widest font-mono">{plate}</p>
      </div>
    </div>
  );
}

function EditableStat({ label, value: init, unit, color }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(init);
  const [temp, setTemp] = useState(init);
  return (
    <motion.div className="glass rounded-2xl p-4 flex-1 text-center cursor-pointer" whileTap={{ scale: 0.95 }}
      onClick={() => { setEditing(true); setTemp(value); }}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      {editing ? (
        <input autoFocus value={temp} onChange={(e) => setTemp(e.target.value)}
          onBlur={() => { setValue(temp); setEditing(false); }}
          onKeyDown={(e) => e.key === 'Enter' && (setValue(temp), setEditing(false))}
          className="w-full bg-transparent text-center font-space font-bold text-xl outline-none border-b border-primary/50"
          style={{ color }} />
      ) : (
        <p className="font-space font-bold text-xl" style={{ color }}>{value}</p>
      )}
      <p className="text-[10px] text-muted-foreground mt-1">{unit}</p>
    </motion.div>
  );
}

export default function VehicleProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { vehicles, updateVehicle, removeVehicle } = useGarage();
  const vehicle = vehicles.find((v) => v.id === parseInt(id)) || vehicles[0];

  const [priceModal, setPriceModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [settingsSheet, setSettingsSheet] = useState(false);
  const [uploadDoc, setUploadDoc] = useState(null);
  const [nickModal, setNickModal] = useState(false);
  const [paintModal, setPaintModal] = useState(false);
  const [nickname, setNickname] = useState(vehicle.nickname || '');
  const [listModal, setListModal] = useState(false);
  const [listStep, setListStep] = useState(1);
  const [listForm, setListForm] = useState({ price: '', condition: '', description: '' });
  const [listSubmitting, setListSubmitting] = useState(false);
  const [listSuccess, setListSuccess] = useState(false);
  const [healthSheet, setHealthSheet] = useState(false);
  const [docMeta, setDocMeta] = useState({}); // { RC: {...}, Insurance: {...}, PUC: {...} }

  const handleOCRExtracted = (docType, data) => {
    setDocMeta((prev) => ({ ...prev, [docType]: data }));
    // Auto-update vehicle from RC scan
    if (docType === 'RC' && data) {
      const updates = {};
      if (data.reg_number) updates.plate = data.reg_number;
      if (data.make) updates.brand = data.make;
      if (data.model) updates.model = data.model;
      if (data.year) updates.year = data.year;
      if (Object.keys(updates).length) updateVehicle(vehicle.id, updates);
    }
  };

  // Compute health score
  const healthScore = parseInt(vehicle.health) || 75;
  const healthColor = healthScore >= 85 ? '#39FF14' : healthScore >= 60 ? '#FFB300' : '#FF3366';
  const healthItems = [
    { ok: true, label: 'Insurance Active', pts: '+15 pts' },
    { ok: healthScore >= 85, label: healthScore >= 85 ? 'PUCC Valid' : 'PUCC Expiring Soon', pts: healthScore >= 85 ? '+10 pts' : '-5 pts' },
    { ok: true, label: 'No Unpaid Challans', pts: '+5 pts' },
    { ok: healthScore >= 75, label: healthScore >= 75 ? 'Mileage in Range' : 'High Mileage vs Age', pts: healthScore >= 75 ? '+10 pts' : '-10 pts' },
    { ok: healthScore >= 70, label: healthScore >= 70 ? 'Service Log Up-to-date' : 'Overdue for Service', pts: healthScore >= 70 ? '+20 pts' : '-20 pts' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header — back left, actions right, no center title (Smart Pill handles it) */}
      <div className="flex items-center justify-between px-4 pt-16 pb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/garage')}
          className="w-9 h-9 rounded-full glass flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShareModal(true)}
            className="w-9 h-9 rounded-full glass flex items-center justify-center">
            <Share2 className="w-4 h-4 text-primary" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSettingsSheet(true)}
            className="w-9 h-9 rounded-full glass flex items-center justify-center">
            <Settings className="w-4 h-4 text-white/70" />
          </motion.button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Hero */}
        <motion.div className="glass rounded-3xl overflow-hidden" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-center pt-5 pb-3">
            <LicensePlate plate={vehicle.plate} />
          </div>
          <div className="relative h-48">
            <img src={vehicle.img} alt={vehicle.model} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
          </div>
          {/* Specs Bar */}
          <div className="px-5 py-4 border-t border-white/5">
            <div className="grid grid-cols-3 gap-0 divide-x divide-white/5">
              {[
                { label: 'POWER', value: vehicle.power || '141.6 bhp' },
                { label: 'TOP SPEED', value: vehicle.topSpeed || '200 kmph' },
                { label: 'ENGINE', value: vehicle.engine || '1799 cc' },
              ].map((spec) => (
                <div key={spec.label} className="text-center px-2">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">{spec.label}</p>
                  <p className="font-space font-bold text-white text-sm">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Live Market Value */}
        <motion.div className="glass rounded-2xl p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Live Market Value</p>
          <div className="flex items-center justify-between">
            <span className="font-space font-bold text-3xl text-white">{vehicle.marketValue}</span>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setPriceModal(true)}
              className="text-xs text-primary glass px-3 py-1.5 rounded-full">View 5Y Trend →</motion.button>
          </div>
        </motion.div>

        {/* Sell Button */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setListStep(1); setListModal(true); }}
          className="w-full py-4 rounded-2xl font-space font-bold text-base text-primary-foreground"
          style={{ background: 'linear-gradient(135deg, #00E5FF, #00b8cc)' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          🏷️ List on DownShift Market
        </motion.button>

        {/* Stat Grid */}
        <motion.div className="flex gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <motion.div className="glass rounded-2xl p-4 flex-1 text-center cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => setHealthSheet(true)}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Health</p>
            <p className="font-space font-bold text-xl" style={{ color: healthColor }}>{healthScore}</p>
            <p className="text-[10px] text-primary mt-1">Tap for breakdown</p>
          </motion.div>
          <EditableStat label="Mileage" value={vehicle.mileage} unit="KMs" color="#39FF14" />
          <EditableStat label="Fuel Eff." value={vehicle.fuelEff} unit="km/l" color="#FFB300" />
        </motion.div>

        {/* Document Vault */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="font-space font-bold text-xs uppercase tracking-widest mb-3" style={{ color: '#A0A0A0' }}>Document Vault</p>
          <div className="grid grid-cols-3 gap-3">
            {docs.map((doc) => {
              const meta = docMeta[doc.label];
              const isDone = !!meta;
              return (
                <motion.button key={doc.label} whileTap={{ scale: 0.94 }} onClick={() => setUploadDoc(doc.label)}
                  className="glass rounded-2xl p-4 flex flex-col items-center gap-2 relative"
                  style={{ border: isDone ? '1px solid rgba(57,255,20,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
                  {isDone && <CheckCircle2 className="absolute top-2 right-2 w-3.5 h-3.5 text-apex-green" />}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: isDone ? 'rgba(57,255,20,0.1)' : 'rgba(0,229,255,0.1)' }}>
                    <doc.icon className="w-5 h-5" style={{ color: isDone ? '#39FF14' : '#00E5FF' }} />
                  </div>
                  <span className="text-[11px] font-semibold text-white/70">{doc.label}</span>
                  {isDone && meta.expiry_date ? (
                    <span className="text-[9px] text-apex-green font-semibold text-center leading-tight">
                      Exp: {meta.expiry_date}
                    </span>
                  ) : (
                    <span className="text-[9px] text-muted-foreground text-center leading-tight">
                      {isDone ? 'Scanned ✓' : 'Tap to scan'}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Price Chart Modal */}
      <AnimatePresence>
        {priceModal && (
          <motion.div className="fixed inset-0 z-[110] flex items-center justify-center p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPriceModal(false)} />
            <motion.div className="relative w-full max-w-sm glass-strong rounded-3xl p-6"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-space font-bold text-white">5-Year Price Trend</h3>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPriceModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                    <Tooltip contentStyle={{ background: 'rgba(12,12,12,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }} labelStyle={{ color: 'rgba(255,255,255,0.4)' }} itemStyle={{ color: '#00E5FF' }} formatter={(v) => [`₹${(v / 100000).toFixed(2)} L`, 'Value']} />
                    <Line type="monotone" dataKey="value" stroke="#00E5FF" strokeWidth={2.5} dot={{ r: 3, fill: '#00E5FF', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#00E5FF', stroke: '#000', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal — Flex Card */}
      <AnimatePresence>
        {shareModal && (
          <motion.div className="fixed inset-0 z-[110] flex items-center justify-center p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShareModal(false)} />
            <motion.div className="relative w-full max-w-sm glass-strong rounded-3xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
              <div className="px-5 pt-4 flex justify-end">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShareModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              {/* The shareable flex card */}
              <div className="mx-5 mb-2 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg, #0d0d0d 0%, #111 100%)', border: '1px solid rgba(0,229,255,0.22)' }}>
                {/* Card header: brand logo + vehicle name */}
                <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-white/5">
                  {vehicle.logoUrl
                    ? <img src={vehicle.logoUrl} alt={vehicle.brand} style={{ width: 28, height: 28, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                    : <span className="font-rajdhani font-bold text-white text-lg">{vehicle.brand?.charAt(0)}</span>
                  }
                  <div>
                    <p className="font-space font-bold text-white text-sm leading-tight">{vehicle.nickname || vehicle.model}</p>
                    <p className="text-[10px] text-muted-foreground">{vehicle.year} · {vehicle.engine}</p>
                  </div>
                </div>
                {/* Hero image */}
                <img src={vehicle.heroImage || vehicle.img} alt="" className="w-full h-32 object-cover" />
                {/* Flex stats: Power + Top Speed */}
                <div className="flex divide-x divide-white/5">
                  <div className="flex-1 px-4 py-4 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Power</p>
                    <p className="font-space font-bold text-white text-xl mt-1">{vehicle.power || '—'}</p>
                  </div>
                  <div className="flex-1 px-4 py-4 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Top Speed</p>
                    <p className="font-space font-bold text-white text-xl mt-1">{vehicle.topSpeed || '—'}</p>
                  </div>
                  <div className="flex-1 px-4 py-4 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Engine</p>
                    <p className="font-space font-bold text-primary text-sm mt-1">{vehicle.engine || '—'}</p>
                  </div>
                </div>
                {/* DS branding footer */}
                <div className="flex items-center justify-center gap-2 py-3 border-t border-white/5">
                  <img src="https://media.base44.com/images/public/69f1a9f43003ef2e33d154e7/04eec8872_LOGO-copy.png" alt="DownShift" className="h-5 object-contain" style={{ filter: 'brightness(0) invert(0.6)' }} />
                  <span className="text-[10px] text-muted-foreground font-space">DownShift · downshift.app</span>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3">
                <motion.button whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    const shareText = `Check out my ${vehicle.nickname || vehicle.model}! ${vehicle.power} · ${vehicle.topSpeed} top speed. #DownShift #CarLife`;
                    if (navigator.share) navigator.share({ title: vehicle.nickname || vehicle.model, text: shareText, url: 'https://downshift.app' });
                    setShareModal(false);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-space font-bold text-sm glow-cyan">
                  Share This Card
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OCR Document Modal */}
      <AnimatePresence>
        {uploadDoc && (
          <DocOCRModal
            docType={uploadDoc}
            onClose={() => setUploadDoc(null)}
            onExtracted={handleOCRExtracted}
          />
        )}
      </AnimatePresence>

      {/* Settings Bottom Sheet */}
      <AnimatePresence>
        {settingsSheet && (
          <motion.div className="fixed inset-0 z-[110] flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSettingsSheet(false)} />
            <motion.div className="relative w-full max-w-lg rounded-t-3xl overflow-hidden pb-8"
              style={{ background: '#1a1a1a' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
                <h3 className="font-space font-bold text-white text-base">Actions on your Garage</h3>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSettingsSheet(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              <div className="px-4 pt-3 space-y-1">
                {[
                  { label: 'Set Nickname', action: () => { setSettingsSheet(false); setNickModal(true); } },
                  { label: 'Edit Car Appearance', action: () => { setSettingsSheet(false); setPaintModal(true); } },
                  { label: 'Update Specs & Mileage', action: () => setSettingsSheet(false) },
                ].map((item) => (
                  <motion.button key={item.label} whileTap={{ scale: 0.98 }} onClick={item.action}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-white/5 transition-colors">
                    <span className="text-white font-inter text-sm font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                ))}
                <motion.button whileTap={{ scale: 0.98 }}
                  onClick={() => { removeVehicle(vehicle.id); navigate('/garage'); }}
                  className="w-full flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-brake-red/5 transition-colors">
                  <span className="text-brake-red font-inter text-sm font-medium">Remove Vehicle</span>
                  <ChevronRight className="w-4 h-4 text-brake-red/50" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nickname Modal */}
      <AnimatePresence>
        {nickModal && (
          <motion.div className="fixed inset-0 z-[120] flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNickModal(false)} />
            <motion.div className="relative w-full max-w-sm glass-strong rounded-3xl p-6"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
              <h3 className="font-space font-bold text-white mb-4">Set Nickname</h3>
              <div className="glass rounded-2xl px-4 py-3 mb-4">
                <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Black Panther"
                  className="w-full bg-transparent text-white text-sm outline-none placeholder-white/30 font-inter" />
              </div>
              <motion.button whileTap={{ scale: 0.96 }}
                onClick={() => { updateVehicle(vehicle.id, { nickname }); setNickModal(false); }}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-space font-bold text-sm glow-cyan">
                Save Nickname
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List on Market Modal */}
      <AnimatePresence>
        {listModal && (
          <motion.div className="fixed inset-0 z-[120] flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setListModal(false)} />
            <motion.div className="relative w-full max-w-lg glass-strong rounded-t-3xl overflow-hidden pb-8"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
                <h3 className="font-space font-bold text-white">List on Market</h3>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setListModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {listStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 py-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Tag className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-space font-bold text-white text-lg mb-2">Ready to sell your {vehicle.nickname || vehicle.model}?</h4>
                    <p className="text-sm text-white/50 mb-6">We'll auto-fill the details from your Garage profile. Just set your price and you're done.</p>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => setListStep(2)}
                      className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-space font-bold text-base">
                      Agree & Continue
                    </motion.button>
                  </motion.div>
                )}
                {listStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-6 py-4 space-y-4">
                    {/* Pre-filled from garage */}
                    <div className="glass rounded-2xl p-4 space-y-2">
                      <p className="text-xs text-primary uppercase tracking-wider font-semibold mb-2">Auto-filled from your Garage</p>
                      {[
                        { label: 'Brand', val: vehicle.brand },
                        { label: 'Model', val: vehicle.model },
                        { label: 'Year', val: vehicle.year },
                        { label: 'Engine', val: vehicle.engine },
                        { label: 'Mileage', val: `${vehicle.mileage} km` },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between">
                          <span className="text-xs text-white/40">{row.label}</span>
                          <span className="text-xs font-semibold text-white">{row.val || '—'}</span>
                        </div>
                      ))}
                    </div>
                    {/* User inputs */}
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Asking Price (₹) *</label>
                      <div className="glass rounded-xl px-4 py-3">
                        <input type="number" value={listForm.price} onChange={(e) => setListForm((f) => ({ ...f, price: e.target.value }))}
                          placeholder="e.g. 2800000"
                          className="w-full bg-transparent text-xl font-space font-bold text-white placeholder-white/20 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Condition *</label>
                      <select value={listForm.condition} onChange={(e) => setListForm((f) => ({ ...f, condition: e.target.value }))}
                        className="w-full glass rounded-xl px-4 py-3 text-white text-sm bg-transparent outline-none">
                        <option value="" className="bg-[#111]">Select condition</option>
                        {['Like New', 'Good', 'Fair'].map((c) => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Description</label>
                      <textarea value={listForm.description} onChange={(e) => setListForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Describe the car, any modifications, reason for selling..."
                        className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 bg-transparent outline-none resize-none border border-white/5" rows={3} />
                    </div>
                    <motion.button whileTap={{ scale: 0.96 }}
                      disabled={!listForm.price || !listForm.condition || listSubmitting}
                      onClick={() => {
                        setListSubmitting(true);
                        // Mock listing publication — no DB call
                        setTimeout(() => {
                          setListSubmitting(false);
                          setListSuccess(true);
                          setTimeout(() => { setListModal(false); setListSuccess(false); setListStep(1); }, 2000);
                        }, 900);
                      }}
                      className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-space font-bold text-base disabled:opacity-40">
                      {listSubmitting ? 'Publishing...' : listSuccess ? '✅ Submitted!' : 'Publish Ad'}
                    </motion.button>
                    {listSuccess && <p className="text-xs text-center text-white/40">Pending admin approval. Will be live soon.</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health Report Bottom Sheet */}
      <AnimatePresence>
        {healthSheet && (
          <motion.div className="fixed inset-0 z-[120] flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setHealthSheet(false)} />
            <motion.div className="relative w-full max-w-lg glass-strong rounded-t-3xl overflow-hidden pb-8"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
                <h3 className="font-space font-bold text-white">Vehicle Health Report</h3>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setHealthSheet(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              {/* Hero score */}
              <div className="flex flex-col items-center py-6">
                <p className="font-space font-bold text-7xl" style={{ color: healthColor }}>{healthScore}</p>
                <p className="text-sm text-white/40 mt-1 font-inter">out of 100</p>
                <div className="mt-3 px-4 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: `${healthColor}18`, color: healthColor }}>
                  {healthScore >= 85 ? '✅ Excellent' : healthScore >= 60 ? '⚠️ Needs Attention' : '🔴 Action Required'}
                </div>
              </div>
              {/* Breakdown */}
              <div className="px-5 space-y-2 mb-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Score Breakdown</p>
                {healthItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between glass rounded-xl px-4 py-3">
                    <span className="text-sm text-white/80">{item.ok ? '✅' : '❌'} {item.label}</span>
                    <span className="text-xs font-bold font-space" style={{ color: item.ok ? '#39FF14' : '#FF3366' }}>{item.pts}</span>
                  </div>
                ))}
              </div>
              {/* Boost tip */}
              {healthScore < 85 && (
                <div className="px-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Boost Your Score</p>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setHealthSheet(false)}
                    className="w-full py-3.5 rounded-2xl text-sm font-space font-bold text-black"
                    style={{ background: '#00E5FF' }}>
                    Log Maintenance to gain +15 pts
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paint Modal */}
      <AnimatePresence>
        {paintModal && (
          <motion.div className="fixed inset-0 z-[120] flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPaintModal(false)} />
            <motion.div className="relative w-full max-w-sm glass-strong rounded-3xl p-6"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-space font-bold text-white">Edit Car Appearance</h3>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPaintModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {paintColors.map((c) => (
                  <motion.button key={c.name} whileTap={{ scale: 0.95 }}
                    onClick={() => { updateVehicle(vehicle.id, { color: c.name }); setPaintModal(false); }}
                    className="glass rounded-2xl p-4 flex items-center gap-3 text-left"
                    style={{ border: vehicle.color === c.name ? '1.5px solid #00E5FF' : '1.5px solid rgba(255,255,255,0.05)' }}>
                    <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: c.hex, border: '2px solid rgba(255,255,255,0.15)' }} />
                    <span className="text-xs text-white/80 font-inter">{c.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}