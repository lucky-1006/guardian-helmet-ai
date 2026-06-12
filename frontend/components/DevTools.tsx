import React from 'react';
import { Terminal, X, AlertTriangle, Beer, ShieldOff, Zap } from 'lucide-react';
import { SimulationOverrides } from '../types';
import { GlassCard } from './GlassCard';

interface DevToolsProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleOverride: (key: keyof SimulationOverrides) => void;
  activeOverrides: SimulationOverrides;
}

export const DevTools: React.FC<DevToolsProps> = ({ isOpen, onClose, onToggleOverride, activeOverrides }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in">
      <GlassCard className="w-full max-w-sm p-4 overflow-hidden !bg-white/95 dark:!bg-slate-900/95">
        <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-cyan-600 dark:text-neon-gold" />
            <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white">JUDGE_CONTROL_PANEL</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onToggleOverride('forceCrash')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              activeOverrides.forceCrash 
                ? 'bg-red-500/20 border-red-500 text-red-600 dark:text-red-400' 
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <AlertTriangle size={24} />
            <span className="text-xs font-bold">SIM_CRASH</span>
          </button>

          <button 
            onClick={() => onToggleOverride('forceDrunk')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              activeOverrides.forceDrunk 
                ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400' 
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Beer size={24} />
            <span className="text-xs font-bold">SIM_ALCOHOL</span>
          </button>

          <button 
            onClick={() => onToggleOverride('forceHelmetOff')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              activeOverrides.forceHelmetOff 
                ? 'bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-400' 
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <ShieldOff size={24} />
            <span className="text-xs font-bold">NO_HELMET</span>
          </button>

          <button 
            onClick={() => {
               // Reset all
               if(activeOverrides.forceCrash) onToggleOverride('forceCrash');
               if(activeOverrides.forceDrunk) onToggleOverride('forceDrunk');
               if(activeOverrides.forceHelmetOff) onToggleOverride('forceHelmetOff');
            }}
            className="p-3 rounded-xl border bg-emerald-100/50 dark:bg-emerald-900/30 border-emerald-500/30 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50 flex flex-col items-center gap-2 transition-all"
          >
            <Zap size={24} />
            <span className="text-xs font-bold">SYSTEM_NORMAL</span>
          </button>
        </div>
        
        <div className="mt-4 p-2 bg-slate-100 dark:bg-black/50 rounded-lg text-[10px] font-mono text-slate-500 text-center">
          Injects mock data directly into IoT stream for presentation purposes.
        </div>
      </GlassCard>
    </div>
  );
};