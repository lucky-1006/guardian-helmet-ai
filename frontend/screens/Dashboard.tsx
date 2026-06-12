import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, Beer, Share2, StopCircle, Terminal, Activity, Zap, Bluetooth, Wifi } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { SensorData, ConnectivityStatus } from '../types';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface DashboardProps {
  sensorData: SensorData;
  sensorHistory: {timestamp: number, force: number, speed: number}[];
  onTriggerSOS: () => void;
  onEndRide: () => void;
  onOpenDevTools: () => void;
  isDarkMode?: boolean;
  connectivity?: ConnectivityStatus;
}

export const Dashboard: React.FC<DashboardProps> = ({ sensorData, sensorHistory, onTriggerSOS, onEndRide, onOpenDevTools, connectivity = { bluetooth: false, wifi: false } }) => {
  const [shadowModeActive, setShadowModeActive] = useState(false);
  const toggleShadowMode = () => setShadowModeActive(!shadowModeActive);
  
  // Custom Card Style for Void Theme (Material Dark Surface)
  const cardStyle = "bg-white/80 dark:bg-[#121212] border border-white/10 dark:border-white/10 rounded-3xl p-4 relative overflow-hidden transition-all duration-300 hover:border-white/30";

  // Helper to determine alcohol color status
  const getAlcoholColorClass = (level: number) => {
    if (level < 10) return 'text-emerald-500 dark:text-safe-green';
    if (level < 30) return 'text-amber-500 dark:text-neon-gold';
    return 'text-red-500 dark:text-alert-red';
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-5 font-sans text-slate-900 dark:text-guardian-cream overflow-y-auto no-scrollbar pb-32">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h1 className="text-3xl font-black tracking-wider text-slate-900 dark:text-white">GUARDIAN</h1>
             <span className="bg-[#0f1f15] text-safe-green text-[10px] font-bold px-2 py-1 rounded border border-safe-green/20 tracking-wider">LIVE</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-guardian-muted font-mono font-medium tracking-wider uppercase">
             <span className={`w-1.5 h-1.5 rounded-full ${connectivity.bluetooth || connectivity.wifi ? 'bg-safe-green animate-pulse' : 'bg-alert-red'}`}></span>
             {connectivity.bluetooth ? 'System Online' : 'Offline'}
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
           <VoiceAssistant />
           <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-guardian-muted hover:text-slate-900 dark:hover:text-white transition-colors" onClick={toggleShadowMode}>
             <Share2 size={18} />
           </button>
           <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-guardian-muted hover:text-slate-900 dark:hover:text-white transition-colors" onClick={onOpenDevTools}>
             <Terminal size={18} />
           </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-2 gap-3 min-h-0">
         
         {/* 1. Velocity Card (Compacted with Graph) */}
         <div className={`${cardStyle} flex flex-col justify-between h-40`}>
             <div className="flex items-center gap-2 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-guardian-sky shadow-[0_0_8px_rgba(138,180,248,0.5)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-guardian-muted">Speed</span>
             </div>
             
             <div className="relative z-10 flex-1 flex flex-col justify-center">
               <div className="text-5xl font-black font-mono tracking-tighter text-slate-900 dark:text-white leading-none">{sensorData.speed}</div>
               <div className="text-[10px] font-bold text-slate-500 dark:text-guardian-muted uppercase mt-1 ml-1">KM/H</div>
             </div>

             {/* Graph Area */}
             <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sensorHistory}>
                      <defs>
                        <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8AB4F8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8AB4F8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="speed" stroke="#8AB4F8" strokeWidth={2} fillOpacity={1} fill="url(#speedGradient)" />
                    </AreaChart>
                 </ResponsiveContainer>
             </div>
         </div>

         {/* 2. Connectivity Card (Compact, Top Row) */}
         <div className={`${cardStyle} h-40 flex flex-col`}>
             <div className="flex justify-between items-start mb-4">
                 <div className="flex gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${connectivity.bluetooth ? 'bg-blue-500/10 text-blue-600 dark:bg-guardian-sky/10 dark:text-guardian-sky' : 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-guardian-pale'}`}>
                        <Bluetooth size={16} />
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${connectivity.wifi ? 'bg-emerald-500/10 text-emerald-600 dark:bg-safe-green/10 dark:text-safe-green' : 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-guardian-pale'}`}>
                        <Wifi size={16} />
                    </div>
                 </div>
                 <div className={`w-2 h-2 rounded-full ${connectivity.bluetooth && connectivity.wifi ? 'bg-safe-green shadow-[0_0_8px_#81C995]' : 'bg-neon-gold'}`}></div>
             </div>
             
             <div className="mt-auto">
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-guardian-muted mb-1">Link Status</div>
                <div className={`text-base font-bold leading-tight ${connectivity.bluetooth ? 'text-blue-600 dark:text-guardian-sky' : 'text-red-500 dark:text-alert-red'}`}>
                  {connectivity.bluetooth ? 'Helmet Linked' : 'Searching...'}
                </div>
             </div>
         </div>

         {/* 3. G-Force (Square) */}
         <div className={`${cardStyle} aspect-square flex items-center justify-center`}>
             {/* Grid UI */}
             <div className="absolute inset-0 border border-slate-200 dark:border-white/5 m-4 rounded-xl"></div>
             <div className="absolute w-[1px] h-full bg-slate-200 dark:bg-white/5"></div>
             <div className="absolute h-[1px] w-full bg-slate-200 dark:bg-white/5"></div>
             <div className="absolute w-20 h-20 rounded-full border border-slate-200 dark:border-white/10"></div>
             
             {/* Dot */}
             <div 
               className="absolute w-3 h-3 bg-neon-gold rounded-full shadow-[0_0_15px_rgba(253,214,99,0.8)] transition-transform duration-300 z-10"
               style={{
                  transform: `translate(${(Math.random() - 0.5) * sensorData.impactForce * 40}px, ${(Math.random() - 0.5) * sensorData.impactForce * 40}px)`
               }}
             />

             {/* Labels */}
             <div className="absolute top-4 left-0 w-full text-center">
                <span className="text-[10px] font-mono text-slate-500 dark:text-guardian-muted">{sensorData.impactForce.toFixed(2)}G</span>
             </div>
             <div className="absolute bottom-4 left-0 w-full text-center leading-none">
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 dark:text-guardian-muted">G-Force</span>
             </div>
         </div>

         {/* 4. Right Column (Status) */}
         <div className="flex flex-col gap-3 h-full">
            
            {/* Helmet Card */}
            <div className={`${cardStyle} flex-1 flex items-center relative`}>
                <ShieldCheck 
                  size={48} 
                  className={`transition-colors duration-300 ${sensorData.helmetWorn ? 'text-emerald-500 dark:text-safe-green' : 'text-red-500 dark:text-alert-red'} opacity-90`} 
                  strokeWidth={1.5}
                />
                
                <div className="flex flex-col items-end ml-auto z-10">
                   <div className="flex justify-end mb-2">
                      <div className={`w-2 h-2 rounded-full ${sensorData.helmetWorn ? 'bg-safe-green shadow-[0_0_8px_#81C995]' : 'bg-alert-red animate-pulse'}`}></div>
                   </div>
                   <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-guardian-muted mb-0.5">Helmet</div>
                   <div className={`text-xl font-black uppercase tracking-wide transition-colors duration-300 ${sensorData.helmetWorn ? 'text-emerald-500 dark:text-safe-green' : 'text-red-500 dark:text-alert-red'}`}>
                       {sensorData.helmetWorn ? 'Locked' : 'Unsafe'}
                   </div>
                </div>
            </div>

            {/* Alcohol Card */}
            <div className={`${cardStyle} flex-1 flex items-center relative`}>
                <Beer 
                  size={48} 
                  className={`transition-colors duration-300 ${getAlcoholColorClass(sensorData.alcoholLevel)} opacity-90`} 
                  strokeWidth={1.5}
                />
                
                <div className="flex flex-col items-end ml-auto z-10">
                   <div className="flex justify-end mb-2">
                      <div className={`w-2 h-2 rounded-full ${sensorData.alcoholLevel < 30 ? 'bg-safe-green shadow-[0_0_8px_#81C995]' : 'bg-alert-red animate-pulse'}`}></div>
                   </div>
                   <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-guardian-muted mb-0.5">Alcohol</div>
                   <div className={`text-xl font-black font-mono tracking-wide transition-colors duration-300 ${getAlcoholColorClass(sensorData.alcoholLevel)}`}>
                       {sensorData.alcoholLevel.toFixed(2)}%
                   </div>
                </div>
            </div>
         </div>

         {/* 5. Footer Action Bar (Full Width) */}
         <div className="col-span-2 grid grid-cols-4 gap-3 h-20 shrink-0 mt-2">
            <button 
               onClick={onTriggerSOS}
               className="col-span-3 bg-alert-red hover:bg-[#e07b73] rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-red-900/20 active:scale-[0.98] text-black"
            >
               <AlertTriangle size={24} className="text-black/80" />
               <span className="font-black text-black tracking-widest uppercase text-base">SOS</span>
            </button>
            
            <button 
               onClick={onEndRide}
               className="col-span-1 bg-white/50 dark:bg-[#1e1e1e] hover:bg-white dark:hover:bg-[#2c2c2c] border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors active:scale-[0.98]"
            >
               <StopCircle size={20} className="text-slate-400 dark:text-guardian-muted" />
               <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-guardian-muted">End</span>
            </button>
         </div>

      </div>
    </div>
  );
}