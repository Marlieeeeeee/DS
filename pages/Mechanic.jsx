import React, { useState, useRef } from 'react';
import { AlertTriangle, Droplet, Activity, Thermometer, Zap, Settings, ShieldAlert, CircleDashed, BatteryWarning, Wind, Disc, Wrench, Target as TargetIcon, Camera as CameraIcon, Check as CheckIcon } from 'lucide-react';
import { useGarage } from '../lib/garageContext';
import { getBlueprintUrl, mockGarageData } from '../lib/hudGarageData';

export default function Mechanic() {
  const { activeVehicle, setActiveVehicleId } = useGarage();
  const [touchStartX, setTouchStartX] = useState(null);
  const [mechanicPhase, setMechanicPhase] = useState('scanner'); // 'scanner' | 'submenu' | 'terminal' | 'resolution'
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const manualInputRef = useRef(null);

  const vehicleName = activeVehicle?.nickname || activeVehicle?.model || activeVehicle?.name || 'Vehicle';
  const vehicleClass = activeVehicle?.class || 'sedan';
  const isBike = activeVehicle?.class === 'bike' || activeVehicle?.class === 'scooter';
  const diagData = {
    left: isBike ? [
    { label: 'Engine / FI', risk: 'critical', icon: Activity }, { label: 'Battery', risk: 'high', icon: Zap }, { label: 'Fork Seals', risk: 'mod', icon: Droplet }, { label: 'Drive Belt/Chain', risk: 'high', icon: Settings }] :
    [
    { label: 'Engine Misfire', risk: 'critical', icon: Activity }, { label: 'Battery / Alt', risk: 'high', icon: Zap }, { label: 'Coolant Leak', risk: 'high', icon: Droplet }, { label: 'Transmission', risk: 'high', icon: Settings }, { label: 'Suspension', risk: 'mod', icon: CircleDashed }],

    right: isBike ? [
    { label: 'Brake Pads', risk: 'critical', icon: Disc }, { label: 'Tire Pressure', risk: 'high', icon: CircleDashed }, { label: 'Electrical', risk: 'mod', icon: Zap }, { label: 'Clutch', risk: 'high', icon: Wrench }] :
    [
    { label: 'Check Engine', risk: 'critical', icon: AlertTriangle }, { label: 'Brake Wear', risk: 'critical', icon: Disc }, { label: 'Emissions', risk: 'mod', icon: Wind }, { label: 'Electrical', risk: 'high', icon: Zap }, { label: 'A/C System', risk: 'mod', icon: Thermometer }],

    submenus: {
      'Dash Light': isBike ? [
      { label: 'FI Indicator', icon: AlertTriangle },
      { label: 'ABS Warning', icon: ShieldAlert },
      { label: 'Oil Temp High', icon: Thermometer },
      { label: 'Battery Low', icon: BatteryWarning }] :
      [
      { label: 'Check Engine', icon: AlertTriangle },
      { label: 'Oil Pressure Low', icon: Droplet },
      { label: 'ABS / ESP Fault', icon: ShieldAlert },
      { label: 'Battery / Alternator', icon: BatteryWarning }],

      'Dashboard Warning': isBike ? [
      { label: 'FI Indicator', icon: AlertTriangle },
      { label: 'ABS Warning', icon: ShieldAlert },
      { label: 'Oil Temp High', icon: Thermometer },
      { label: 'Battery Low', icon: BatteryWarning }] :
      [
      { label: 'Check Engine', icon: AlertTriangle },
      { label: 'Oil Pressure Low', icon: Droplet },
      { label: 'ABS / ESP Fault', icon: ShieldAlert },
      { label: 'Battery / Alternator', icon: BatteryWarning }],

      'Fluid Leak': [
      { label: 'Oil (Amber/Black)', icon: Droplet },
      { label: 'Coolant (Green/Pink)', icon: Thermometer },
      { label: 'Trans Fluid (Red)', icon: Settings },
      { label: 'Brake Fluid (Clear)', icon: ShieldAlert }],

      'Odd Noise': [
      { label: 'Grinding (Brakes)', icon: Disc },
      { label: 'Squealing (Belts)', icon: Activity },
      { label: 'Knocking (Engine)', icon: AlertTriangle },
      { label: 'Hissing (Vacuum)', icon: Wind }],

      'Strange Noise': [
      { label: 'Grinding (Brakes)', icon: Disc },
      { label: 'Squealing (Belts)', icon: Activity },
      { label: 'Knocking (Engine)', icon: AlertTriangle },
      { label: 'Hissing (Vacuum)', icon: Wind }],

      'Climate': [
      { label: 'Weak Cooling', icon: Thermometer },
      { label: 'Blower Noise', icon: Wind },
      { label: 'Compressor Load', icon: Settings },
      { label: 'Electrical Fault', icon: Zap }],

      'Engine Misfire': [
      { label: 'Spark Plugs', icon: Zap },
      { label: 'Ignition Coils', icon: Activity },
      { label: 'Fuel Injectors', icon: Droplet },
      { label: 'Vacuum Leak', icon: Wind }]

    }
  };
  const getRiskColor = (risk) => risk === 'critical' ? 'text-red-500 border-red-500/50 bg-red-500/10' : risk === 'high' ? 'text-orange-500 border-orange-500/50 bg-orange-500/10' : 'text-[#00E5FF] border-[#00E5FF]/50 bg-[#00E5FF]/10';
  const getRiskLine = (risk) => risk === 'critical' ? 'border-red-500/50' : risk === 'high' ? 'border-orange-500/50' : 'border-[#00E5FF]/50';

  const simulateAI = (topic) => {
    setChatLog([{ role: 'user', text: `Initiating diagnostic for: ${topic}` }]);
    setIsTyping(true);
    setTimeout(() => {
      setChatLog((prev) => [
      ...prev,
      {
        role: 'ai',
        text: `Telemetry linked. I am analyzing the ${topic} on your ${vehicleName}. Can you describe the specific symptom? (e.g., Grinding noise, sweet smell, red puddle)`
      }]
      );
      setIsTyping(false);
    }, 1500);
  };

  const getPulseCoords = (hotspot) => {
    const lower = hotspot?.toLowerCase() || '';
    if (lower.includes('engine') || lower.includes('coolant') || lower.includes('battery')) return { top: '30%', left: '50%' };
    if (lower.includes('transmission') || lower.includes('a/c') || lower.includes('electrical')) return { top: '50%', left: '50%' };
    return { top: '75%', left: '50%' };
  };

  return (
    <>
      <div className="flex flex-col h-full w-full bg-black relative overflow-hidden pb-[90px]">
      {/* PHASE: SCANNER + SUBMENU (single locked layout) */}
      {(mechanicPhase === 'scanner' || mechanicPhase === 'submenu') &&
        <>
          {/* Premium Header Card */}
          <div className="px-4 pt-4 shrink-0 z-20">
            <div className="h-[38px] flex items-center gap-2.5 bg-white/[0.03] border border-white/10 px-4 rounded-2xl backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse shrink-0" />
              <span className="text-white/80 font-black tracking-[0.2em] uppercase text-[10px]">Master Mechanic</span>
              <span className="text-white/20 text-[8px]">·</span>
              <span className="text-[#00E5FF]/50 text-[8px] uppercase tracking-widest truncate">Online for {vehicleName}</span>
            </div>
          </div>

          {/* HUD Wireframe — matched to Garage tab */}
          <div
            className={`relative w-full h-[380px] shrink-0 flex items-center justify-center z-10 mt-2 transition-all duration-700 ease-in-out ${mechanicPhase !== 'scanner' ? 'scale-125 translate-y-4' : 'scale-100'}`}
            onTouchStart={(e) => setTouchStartX(e.targetTouches[0].clientX)}
            onTouchEnd={(e) => {
              if (!touchStartX) return;
              const diff = touchStartX - e.changedTouches[0].clientX;
              const currentIndex = mockGarageData.findIndex((v) => v.id === activeVehicle?.id);
              const safeIndex = currentIndex >= 0 ? currentIndex : 0;
              if (diff > 50) setActiveVehicleId(safeIndex === mockGarageData.length - 1 ? mockGarageData[0].id : mockGarageData[safeIndex + 1].id);
              if (diff < -50) setActiveVehicleId(safeIndex === 0 ? mockGarageData[mockGarageData.length - 1].id : mockGarageData[safeIndex - 1].id);
              setTouchStartX(null);
            }}
          >
            {/* Central Telemetry Spine (Lines connect to this) */}
            
            {/* The Vehicle Projection */}
            <img
              src={getBlueprintUrl(activeVehicle?.class || vehicleClass)}
              className="absolute inset-0 w-[75%] h-[95%] object-contain opacity-80 mx-auto pointer-events-none z-20 drop-shadow-[0_0_20px_rgba(0,229,255,0.2)]"
              style={{ mixBlendMode: 'screen', filter: 'brightness(1.2)' }}
              alt="Scanner" />
            
            {mechanicPhase !== 'scanner' && selectedHotspot &&
            <div className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center transition-all duration-700 delay-300" style={getPulseCoords(selectedHotspot)}>
                <div className="absolute top-1/2 w-[50vw] h-px border-t border-dashed border-red-500/50 -z-10" style={{ left: diagData.left.some((d) => d.label === selectedHotspot) ? '-50vw' : '100%', right: diagData.right.some((d) => d.label === selectedHotspot) ? '-50vw' : 'auto' }}></div>
                <div className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_20px_red]"></div>
                <div className="absolute w-full h-full border border-red-500/60 rounded-full animate-ping"></div>
                <div className="absolute w-[200%] h-[200%] border border-red-500/20 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              </div>
            }

            {/* LEFT FLANK */}
            <div className="absolute left-4 top-[10%] bottom-[10%] flex flex-col justify-between z-30 w-[28%] items-start text-left">
              {diagData.left.map((issue, i) => {const Icon = issue.icon;return (
                  <button key={i} onClick={() => {setSelectedHotspot(issue.label);setMechanicPhase('submenu');}} className={`relative flex flex-col items-start w-full active:scale-95 transition-all outline-none group ${mechanicPhase !== 'scanner' ? 'opacity-0 pointer-events-none' : 'opacity-100 duration-500'}`}>
                  <div className={`flex items-center gap-1.5 mb-0.5 ${getRiskColor(issue.risk).replace(/bg-.|border-./g, '')} drop-shadow-[0_0_8px_currentColor]`}>
                    <Icon className="w-3 h-3" />
                    <span className="text-[7px] font-black uppercase tracking-widest opacity-80">{issue.risk}</span>
                  </div>
                  <span className="text-[9px] text-white/90 font-bold uppercase tracking-widest leading-tight group-hover:text-white transition-colors">{issue.label}</span>
                </button>);
              })}
            </div>

            {/* RIGHT FLANK */}
            <div className="absolute right-4 top-[10%] bottom-[10%] flex flex-col justify-between z-30 w-[28%] items-end text-right">
              {diagData.right.map((issue, i) => {const Icon = issue.icon;return (
                  <button key={i} onClick={() => {setSelectedHotspot(issue.label);setMechanicPhase('submenu');}} className={`relative flex flex-col items-end w-full active:scale-95 transition-all outline-none group ${mechanicPhase !== 'scanner' ? 'opacity-0 pointer-events-none' : 'opacity-100 duration-500'}`}>
                  <div className={`flex items-center gap-1.5 mb-0.5 ${getRiskColor(issue.risk).replace(/bg-.|border-./g, '')} drop-shadow-[0_0_8px_currentColor]`}>
                    <span className="text-[7px] font-black uppercase tracking-widest opacity-80">{issue.risk}</span>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] text-white/90 font-bold uppercase tracking-widest leading-tight group-hover:text-white transition-colors">{issue.label}</span>
                </button>);
              })}
            </div>

            {/* ABSOLUTE BOTTOM CLUSTER */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-40 w-full">
              <span className="text-[#00E5FF] font-mono tracking-widest text-xs mb-0.5">{mockGarageData.find(v => v.id === activeVehicle?.id)?.plate || activeVehicle?.plate}</span>
              <span className="text-[#00E5FF] opacity-70 text-[7px] uppercase tracking-[0.4em] mb-2 font-bold">Telemetry Linked</span>
              <div className="flex justify-center gap-1.5">
                {mockGarageData.map((v) => (
                  <button key={v.id} onClick={() => setActiveVehicleId(v.id)} className={`h-1 rounded-full transition-all duration-300 outline-none active:scale-95 ${activeVehicle?.id === v.id ? 'w-4 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]' : 'w-1 bg-white/20 hover:bg-white/40'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Drill-down */}
          <div className="flex-1 w-full px-6 flex flex-col relative z-20 pb-4">
            {mechanicPhase === 'scanner' &&
            <div className="mt-auto animate-fade-in-up">
                <div className="w-full flex justify-center mt-2 mb-4 z-30">
                  <button onClick={() => alert('Search External Database')} className="text-white/30 hover:text-white transition-colors duration-300 text-[7px] uppercase tracking-[0.2em] font-black border border-white/5 bg-white/[0.02] px-4 py-2 rounded-full outline-none backdrop-blur-md active:scale-95">Diagnose Another Vehicle &rarr;</button>
                </div>
                <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-3 block text-center">Global Systems</span>
                <div className="grid grid-cols-4 gap-2 px-4 pb-2 mt-4 mb-2">
                  {[
                { label: 'Dash Light', icon: AlertTriangle, c: 'text-[#00E5FF]' },
                { label: 'Fluid Leak', icon: Droplet, c: 'text-orange-500' },
                { label: 'Odd Noise', icon: Activity, c: 'text-yellow-400' },
                { label: 'Climate', icon: Wind, c: 'text-white/80' }].
                map((sym) => {const Icon = sym.icon;return (
                    <button key={sym.label} onClick={() => {setSelectedHotspot(sym.label);setMechanicPhase('submenu');}} className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all active:scale-95 outline-none group">
                      <Icon className={`w-5 h-5 ${sym.c} group-hover:scale-110 transition-transform`} />
                      <span className="text-[7px] text-white/60 font-bold uppercase tracking-widest text-center leading-tight">{sym.label}</span>
                    </button>);
                })}
                </div>
              </div>
            }

          </div>

          {/* SUBMENU PANEL — fixed bottom sheet, above tab bar */}
          {mechanicPhase === 'submenu' && (
            <>
              <div className="fixed inset-0 z-[90]" onClick={() => setMechanicPhase('scanner')} />
              <div className="fixed bottom-[72px] left-0 right-0 z-[100] animate-slide-up">
                <div className="mx-0 bg-black/85 backdrop-blur-3xl border-t border-[#00E5FF]/20 px-4 pt-4 pb-5 shadow-[0_-20px_40px_rgba(0,0,0,0.8)]">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <TargetIcon className="w-3 h-3 text-[#00E5FF]" />
                      <span className="text-[#00E5FF] font-black text-[9px] uppercase tracking-[0.25em]">{selectedHotspot}</span>
                    </div>
                    <button onClick={() => setMechanicPhase('scanner')} className="text-white/30 text-[9px] uppercase tracking-widest font-bold hover:text-white transition-colors duration-300 active:scale-95">&times; close</button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
                    {(diagData.submenus[selectedHotspot] || [{ label: 'Component Wear', icon: Settings }, { label: 'Sensor Fault', icon: Activity }, { label: 'Connection Issue', icon: Zap }, { label: 'Unknown', icon: AlertTriangle }]).map((issue, idx) => {
                      const SubIcon = issue.icon || Settings;
                      return (
                        <button key={idx} onClick={() => { setMechanicPhase('terminal'); simulateAI(`${selectedHotspot}: ${issue.label}`); }} className="shrink-0 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] text-white/70 transition-all duration-300 active:scale-95 outline-none group">
                          <SubIcon className="w-3 h-3 group-hover:text-[#00E5FF] text-white/40 transition-colors shrink-0" />
                          <span className="text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">{issue.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => { setMechanicPhase('terminal'); simulateAI(`${selectedHotspot} - General`); }} className="w-full py-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-[#00E5FF]/20 rounded-xl transition-all duration-300 active:scale-95">Manual Entry &rarr;</button>
                </div>
              </div>
            </>
          )}

          <div className="px-4 w-full mb-4 shrink-0 z-30 mt-auto -translate-y-5">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-1.5 pl-4 backdrop-blur-md focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all duration-300">
              <Activity className="w-4 h-4 text-[#00E5FF] animate-pulse shrink-0" />
              <input ref={manualInputRef} type="text" placeholder="Describe manual anomaly..." className="flex-1 bg-transparent text-white font-mono text-[10px] uppercase tracking-widest outline-none placeholder:text-white/20" onKeyDown={(e) => {if (e.key === 'Enter' && e.target.value.trim()) {setMechanicPhase('terminal');simulateAI(e.target.value);}}} />
              <button onClick={() => setShowCameraModal(true)} className="bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] p-2 rounded-xl hover:bg-[#00E5FF]/20 transition-all duration-300 active:scale-95 outline-none shrink-0"><CameraIcon className="w-4 h-4" /></button>
              <button onClick={() => { const val = manualInputRef.current?.value?.trim(); if (val) { setMechanicPhase('terminal'); simulateAI(val); } }} className="bg-[#00E5FF]/10 text-[#00E5FF] p-2.5 rounded-xl hover:bg-[#00E5FF]/20 transition-colors duration-300 active:scale-95 outline-none"><Zap className="w-4 h-4" /></button>
            </div>
          </div>
        </>
        }

      {/* PHASE: TERMINAL */}
      {mechanicPhase === 'terminal' &&
        <div className="fixed inset-0 bg-black flex flex-col z-50" style={{ paddingBottom: '72px' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0a] shrink-0">
            <button onClick={() => setMechanicPhase('scanner')} className="text-white/50 text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-[#00E5FF] transition-colors duration-300">
              <span className="text-lg leading-none">&larr;</span> Abort
            </button>
            <span className="text-[#00E5FF] font-mono text-[10px] uppercase tracking-widest animate-pulse">Diagnostic in Progress...</span>
          </div>

          {/* Messages — fills remaining space, scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5 no-scrollbar">
            {chatLog.map((msg, i) =>
              <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                <span className={`text-[8px] uppercase tracking-widest mb-1 ${msg.role === 'user' ? 'text-white/30' : 'text-[#00E5FF]'}`}>
                  {msg.role === 'user' ? 'Owner' : 'Master Mechanic'}
                </span>
                <div className={`p-3 rounded-xl text-sm font-mono leading-relaxed ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF]'}`}>
                  {msg.text}
                </div>
              </div>
            )}
            {isTyping && <div className="self-start text-[#00E5FF] font-mono text-xs animate-pulse">Analyzing ECU data...</div>}
          </div>

          {/* Input — pinned at bottom above tab bar */}
          <div className="shrink-0 px-4 py-3 bg-[#0a0a0a] border-t border-white/10">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5 pl-4 focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all duration-300">
              <input
                type="text"
                placeholder="Describe the issue..."
                className="flex-1 bg-transparent text-white font-mono text-xs outline-none placeholder:text-white/20"
                onKeyDown={(e) => { if (e.key === 'Enter') setMechanicPhase('resolution'); }}
              />
              <button onClick={() => setShowCameraModal(true)} className="bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] p-2 rounded-xl hover:bg-[#00E5FF]/20 transition-all duration-300 active:scale-95 outline-none shrink-0"><CameraIcon className="w-4 h-4" /></button>
              <button onClick={() => setMechanicPhase('resolution')} className="bg-[#00E5FF]/10 text-[#00E5FF] p-2.5 rounded-xl hover:bg-[#00E5FF]/20 transition-colors duration-300 active:scale-95 outline-none shrink-0"><Zap className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        }

      {/* PHASE: RESOLUTION */}
      {mechanicPhase === 'resolution' &&
        <div className="flex flex-col h-full w-full p-6 pt-4 overflow-y-auto no-scrollbar">
          <button
            onClick={() => setMechanicPhase('scanner')}
            className="text-white/50 text-[10px] uppercase tracking-widest mb-6 hover:text-white transition-colors duration-300 self-start">
            
            &larr; Back to Scanner
          </button>

          <div className="w-full bg-[#121212] border border-[#00E5FF]/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.05)]">
            <div className="bg-[#00E5FF]/10 p-4 border-b border-[#00E5FF]/20 flex justify-between items-center">
              <span className="text-[#00E5FF] font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <CheckIcon className="w-4 h-4" /> Diagnosis Complete
              </span>
              <span className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-[8px] uppercase font-bold tracking-widest px-2 py-1 rounded">
                Moderate Severity
              </span>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-white/40 text-[9px] uppercase tracking-[0.2em] mb-1">Identified Issue</h3>
                <p className="text-white font-bold text-lg">Worn Brake Pads (Front Axle)</p>
              </div>
              <div>
                <h3 className="text-white/40 text-[9px] uppercase tracking-[0.2em] mb-1">Technical Assessment</h3>
                <p className="text-white/80 text-xs leading-relaxed font-mono">
                  Telemetry and symptom analysis indicates a 92% probability of front brake pad depletion. The grinding noise suggests the wear indicator is making contact with the rotor.
                </p>
              </div>
            </div>

            <div className="p-4 flex gap-3 border-t border-white/5 bg-black">
              <button className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl flex flex-col items-center justify-center hover:bg-white/10 transition-all duration-300 active:scale-[0.98] outline-none">
                <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest mb-1">DIY Fix (Easy)</span>
                <span className="text-white/50 text-[9px]">View Instructions</span>
              </button>
              <button className="flex-1 bg-[#00E5FF] text-black py-3 rounded-xl flex flex-col items-center justify-center hover:brightness-110 transition-all duration-300 active:scale-[0.98] shadow-[0_0_15px_rgba(0,229,255,0.4)] outline-none">
                <span className="font-black text-[10px] uppercase tracking-widest mb-1">Dispatch Pro</span>
                <span className="text-black/60 text-[9px] font-bold">Book Local Mechanic</span>
              </button>
            </div>
          </div>
        </div>
        }
      </div>

      {showCameraModal && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-8 pb-4 shrink-0">
            <div className="flex flex-col">
              <span className="text-[#00E5FF] font-black uppercase tracking-[0.25em] text-[10px]">Visual Diagnostic</span>
              <span className="text-white/30 text-[8px] uppercase tracking-widest mt-0.5">Scan the anomaly</span>
            </div>
            <button onClick={() => setShowCameraModal(false)} className="text-white/40 hover:text-white transition-colors duration-300 active:scale-95 text-xl leading-none outline-none">&times;</button>
          </div>

          {/* Scan viewport */}
          <div className="flex-1 flex items-center justify-center px-8">
            <div className="relative w-full aspect-square max-w-[320px]">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00E5FF] rounded-tl-sm" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00E5FF] rounded-tr-sm" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00E5FF] rounded-bl-sm" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00E5FF] rounded-br-sm" />
              {/* Scan line animation */}
              <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/80 to-transparent animate-[scan-line_2s_ease-in-out_infinite]" style={{ top: '50%', boxShadow: '0 0 12px rgba(0,229,255,0.6)' }} />
              {/* Inner dim area */}
              <div className="absolute inset-4 bg-white/[0.02] rounded-lg flex flex-col items-center justify-center gap-3 border border-white/5">
                <CameraIcon className="w-10 h-10 text-white/10" />
                <span className="text-white/20 text-[8px] uppercase tracking-[0.3em] text-center">Position anomaly<br/>within frame</span>
              </div>
              {/* Crosshair center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center">
                <div className="absolute w-px h-3 bg-[#00E5FF]/40" />
                <div className="absolute h-px w-3 bg-[#00E5FF]/40" />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-6 pb-10 pt-4 flex flex-col gap-3 shrink-0">
            <label className="w-full py-4 bg-[#00E5FF] text-black text-[10px] uppercase tracking-[0.25em] font-black rounded-2xl hover:brightness-110 transition-all duration-300 active:scale-[0.98] shadow-[0_0_25px_rgba(0,229,255,0.35)] cursor-pointer flex items-center justify-center gap-2">
              <input type="file" className="hidden" onChange={() => { setShowCameraModal(false); setMechanicPhase('terminal'); simulateAI('Visual Scan Uploaded'); }} accept="image/*" />
              <CameraIcon className="w-4 h-4" /> Upload from Gallery
            </label>
            <button onClick={() => setShowCameraModal(false)} className="w-full py-3 bg-white/5 border border-white/10 text-white/40 text-[9px] uppercase tracking-widest font-bold rounded-2xl hover:text-white transition-all duration-300 active:scale-95">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>);

}