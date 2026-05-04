import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Activity as ActivityIcon, Shield as ShieldIcon, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { useGarage } from '../lib/garageContext';
import { mockGarageData } from '../lib/hudGarageData';

import HudView from '../components/garage/hud/HudView';
import FinancialsView from '../components/garage/hud/FinancialsView';
import ControlDeck from '../components/garage/hud/ControlDeck';
import VitalsTimeline from '../components/garage/hud/VitalsTimeline';
import UpcomingReminders from '../components/garage/hud/UpcomingReminders';
import TGCDashboard from '../components/garage/hud/TGCDashboard';
import EditVehicleModal from '../components/garage/hud/EditVehicleModal';
import TelemetrySheet from '../components/garage/hud/TelemetrySheet';
import VehicleProfileSheet from '../components/garage/hud/VehicleProfileSheet';

// Merge user's garage vehicles (global context) with the engineering HUD roster.
// Roster is the source of truth for stats/blueprints; user data overrides display fields.
function buildHudVehicle(vehicle, index) {
  const fallback = mockGarageData[index % mockGarageData.length];
  const matchById = mockGarageData.find((m) => m.id === vehicle?.id);
  const hud = matchById || fallback;

  return {
    ...hud,
    id: vehicle?.id ?? hud.id,
    nickname: vehicle?.nickname || '',
    name: vehicle?.nickname || vehicle?.model || hud.name,
    model: vehicle?.nickname || vehicle?.model || hud.model,
    plate: vehicle?.plate || hud.plate,
    health: vehicle?.health ?? hud.health,
  };
}

export default function Garage() {
  const { vehicles, activeVehicle, setActiveVehicleId, updateVehicle } = useGarage();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('HUD');
  const [nicknameInput, setNicknameInput] = useState(activeVehicle?.nickname || '');
  const [touchStartX, setTouchStartX] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTelemetrySheet, setShowTelemetrySheet] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showLogBook, setShowLogBook] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedTgcExpense, setSelectedTgcExpense] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    setNicknameInput(activeVehicle?.nickname || '');
  }, [activeVehicle]);

  // If navigated here with ?add=1 (from "Add a Vehicle" sheet), open the modal.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === '1') {
      setShowEditModal(true);
      navigate('/garage', { replace: true });
    }
  }, [location.search, navigate]);

  const activeHudVehicle = useMemo(() => {
    const idx = vehicles?.findIndex((v) => v.id === activeVehicle?.id) ?? 0;
    return buildHudVehicle(activeVehicle, idx >= 0 ? idx : 0);
  }, [activeVehicle, vehicles]);

  const handleTaskComplete = (msg) => {
    setToastMsg(msg);
    updateVehicle(activeVehicle.id, { health: Math.min((activeHudVehicle.health || 0) + 2, 100) });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTouchStart = (e) => setTouchStartX(e.targetTouches[0].clientX);

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const currentIndex = mockGarageData.findIndex((v) => v.id === activeVehicle?.id);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    if (diff > 50) {
      setActiveVehicleId(safeIndex === mockGarageData.length - 1 ? mockGarageData[0].id : mockGarageData[safeIndex + 1].id);
    }
    if (diff < -50) {
      setActiveVehicleId(safeIndex === 0 ? mockGarageData[mockGarageData.length - 1].id : mockGarageData[safeIndex - 1].id);
    }
    setTouchStartX(null);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white overflow-x-hidden pb-32">
      {toastMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[9999] bg-[#121212] border border-[#00E5FF]/50 text-[#00E5FF] px-6 py-2 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(0,229,255,0.2)] flex items-center justify-center min-w-[220px] h-[42px] animate-fade-in-down pointer-events-none tracking-wide">
          <ShieldIcon className="w-4 h-4 mr-2 opacity-70" /> {toastMsg}
        </div>
      )}
      {/* Header — centered 3-way toggle */}
      <div className="flex justify-center w-full mt-4 mb-2 bg-white/5 p-1 rounded-xl w-max mx-auto border border-white/10">
        <button onClick={() => setActiveTab('HUD')} className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 active:scale-[0.98] ${activeTab === 'HUD' ? 'bg-[#00E5FF]/10 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)]' : 'text-white/40 hover:text-white'}`}><ActivityIcon className="w-3 h-3" /> HUD</button>
        <button onClick={() => setActiveTab('Vault')} className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 active:scale-[0.98] ${activeTab === 'Vault' ? 'bg-[#00E5FF]/10 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)]' : 'text-white/40 hover:text-white'}`}><ShieldIcon className="w-3 h-3" /> Vault</button>
        <button onClick={() => setActiveTab('Financials')} className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 active:scale-[0.98] ${activeTab === 'Financials' ? 'bg-[#00E5FF]/10 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)]' : 'text-white/40 hover:text-white'}`}><TrendingUpIcon className="w-3 h-3" /> Financials</button>
      </div>

      {/* CINEMATIC HERO — fixed-height 3-pane system */}
      <div className="relative w-full h-[380px] overflow-hidden flex flex-col justify-center" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${activeTab === 'HUD' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
          <HudView
            vehicle={activeHudVehicle}
            onBlueprintClick={() => setShowProfileSheet(true)}
          />
        </div>

        <div className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${activeTab === 'Vault' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
          <div className="flex flex-col h-full px-6 pt-2 pb-0 w-full max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <span className="text-[9px] text-white/40 uppercase tracking-widest">Nickname</span>
              <input
                type="text"
                placeholder="Nickname"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                onBlur={() => updateVehicle(activeVehicle.id, { nickname: nicknameInput })}
                className="bg-transparent text-right text-sm font-bold text-white uppercase tracking-wide outline-none w-1/2 placeholder:text-white/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mb-4">
              <label className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col items-start gap-1 cursor-pointer active:scale-[0.98] transition-all duration-300">
                <input type="file" className="hidden" onChange={() => handleTaskComplete('RC Uploaded')} accept="image/*,application/pdf" />
                <div className="flex justify-between w-full gap-2">
                  <span className="text-[9px] text-[#00E5FF] uppercase tracking-widest font-bold">RC (Reg)</span>
                  <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded ${activeHudVehicle.vaultData?.rcStatus === 'Expired' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>{activeHudVehicle.vaultData?.rcStatus}</span>
                </div>
                <span className="text-white text-xs font-mono mt-1">{activeHudVehicle.plate}</span>
              </label>
              <label className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col items-start gap-1 cursor-pointer active:scale-[0.98] transition-all duration-300">
                <input type="file" className="hidden" onChange={() => handleTaskComplete('Insurance Updated')} accept="image/*,application/pdf" />
                <div className="flex justify-between w-full gap-2">
                  <span className="text-[9px] text-yellow-400 uppercase tracking-widest font-bold">Insurance</span>
                  <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded ${activeHudVehicle.vaultData?.insStatus === 'Expiring Soon' ? 'bg-yellow-400/20 text-yellow-400' : activeHudVehicle.vaultData?.insStatus === 'Expired' ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white/50'}`}>{activeHudVehicle.vaultData?.insStatus}</span>
                </div>
                <span className="text-white/50 text-[10px] uppercase mt-1">Tap to change</span>
              </label>
              <label className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col items-start gap-1 cursor-pointer active:scale-[0.98] transition-all duration-300">
                <input type="file" className="hidden" onChange={() => handleTaskComplete('PUCC Uploaded')} accept="image/*,application/pdf" />
                <div className="flex justify-between w-full gap-2">
                  <span className="text-[9px] text-white/50 uppercase tracking-widest font-bold">PUCC</span>
                  <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded ${activeHudVehicle.vaultData?.puccStatus === 'Expired' ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white/50'}`}>{activeHudVehicle.vaultData?.puccStatus}</span>
                </div>
                <span className="text-white/50 text-[10px] uppercase mt-1">Tap to change</span>
              </label>
              <button className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col items-start gap-1 active:scale-[0.98] transition-all duration-300" onClick={() => alert('View Logs')}>
                <div className="flex justify-between w-full"><span className="text-[9px] text-white/50 uppercase tracking-widest font-bold">History</span></div>
                <span className="text-white/50 text-[10px] uppercase mt-1">View Logs &rarr;</span>
              </button>
            </div>

            <div className="w-full flex items-center justify-center gap-2 py-3 my-auto opacity-50">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#00E5FF]/50"></div>
              <ShieldIcon className="w-3 h-3 text-[#00E5FF]" />
              <span className="text-[8px] text-[#00E5FF] uppercase tracking-[0.3em] font-bold">256-Bit Encrypted Vault</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#00E5FF]/50"></div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full mt-auto mb-6">
              {[
                { label: 'Chassis', val: activeHudVehicle.vaultData?.chassisNo },
                { label: 'Engine', val: activeHudVehicle.vaultData?.engineNo },
              ].map((item) => (
                <button key={item.label} onClick={() => { navigator.clipboard.writeText(item.val); handleTaskComplete('Copied!'); }} className="flex flex-col items-start justify-center p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/20 active:scale-[0.98] transition-all duration-300 group outline-none">
                  <span className="text-[8px] text-white/40 uppercase tracking-widest mb-1">{item.label}</span>
                  <span className="text-white/90 text-[10px] font-mono w-full text-left group-hover:text-[#00E5FF] transition-colors">{item.val}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 w-full h-full px-4 transition-all duration-500 ease-in-out ${activeTab === 'Financials' ? `opacity-100 ${selectedExpense ? 'z-[60]' : 'z-10'} pointer-events-auto` : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
          <FinancialsView
            vehicle={activeHudVehicle}
            selectedExpense={selectedExpense}
            setSelectedExpense={setSelectedExpense}
            onOpenLog={() => {
              setSelectedExpense(null);
              setSelectedTgcExpense(null);
              setShowLogBook(true);
            }}
          />
        </div>


      </div>

      {/* Control Deck — utility pills */}
      <div className="w-full mt-2">
        <ControlDeck vehicle={activeHudVehicle} />
      </div>

      {/* Vitals Timeline — clickable, opens Upcoming Maintenance sheet */}
      <div className="w-full px-4 mb-2 flex flex-col gap-2">
        <VitalsTimeline vehicle={activeHudVehicle} onOpen={() => setShowTelemetrySheet(true)} />
      </div>

      {/* Upcoming Reminders — Action Required */}
      <UpcomingReminders onTaskComplete={handleTaskComplete} />

      {/* Total Garage Cost Dashboard — always visible */}
      <TGCDashboard
        selectedTgcExpense={selectedTgcExpense}
        setSelectedTgcExpense={setSelectedTgcExpense}
        onOpenLog={() => {
          setSelectedExpense(null);
          setSelectedTgcExpense(null);
          setShowLogBook(true);
        }}
      />

      {(selectedExpense || selectedTgcExpense) && (
        <div className="fixed inset-0 z-40" onClick={() => { setSelectedExpense(null); setSelectedTgcExpense(null); }}></div>
      )}

      {/* Add/Edit modal — root-level via portal */}
      <EditVehicleModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      {/* Upcoming Maintenance — distance-based alerts */}
      <TelemetrySheet
        open={showTelemetrySheet}
        onClose={() => setShowTelemetrySheet(false)}
        onTaskComplete={handleTaskComplete}
      />

      {showLogBook && (
        <div className="fixed inset-0 z-[999] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowLogBook(false)}></div>
          <div className="relative w-full h-[85vh] bg-[#050505] rounded-t-3xl border-t border-white/10 flex flex-col transition-transform duration-300 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-4 mb-4"></div>
            <div className="px-6 pb-4 border-b border-white/5">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Service Logs</h2>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">{activeHudVehicle.name}</p>
            </div>
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[#00E5FF] text-[9px] font-bold uppercase tracking-widest block mb-3">Log New Maintenance</span>
              <div className="flex gap-2 mb-3">
                <input type="text" placeholder="Service Type..." className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#00E5FF]/50 transition-colors" />
                <input type="number" placeholder="Cost (₹)" className="w-24 bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-green-500/50 transition-colors" />
              </div>
              <button onClick={() => { handleTaskComplete('Log Saved'); setShowLogBook(false); }} className="w-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-[#00E5FF]/20 transition-all active:scale-[0.98]">Save Entry</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3 no-scrollbar">
              {[
                { title: 'Scheduled Service', date: 'May 01, 2026', cost: '₹12,000' },
                { title: 'Fuel Fill-up', date: 'Apr 04, 2026', cost: '₹3,500' },
              ].map((log, i) => (
                <div key={i} className="flex justify-between items-center bg-[#121212] border border-white/5 p-4 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-bold">{log.title}</span>
                    <span className="text-white/40 text-[9px] uppercase mt-1">{log.date}</span>
                  </div>
                  <span className="text-green-500 font-mono font-bold text-sm">{log.cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Profile — fullscreen shareable card */}
      <VehicleProfileSheet
        open={showProfileSheet}
        onClose={() => setShowProfileSheet(false)}
        vehicle={activeHudVehicle}
      />
    </div>
  );
}