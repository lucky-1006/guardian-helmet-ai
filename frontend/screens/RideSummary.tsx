import React from 'react';
import { Share2, Map, Award, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { MAPBOX_TOKEN } from '../constants';

interface RideSummaryProps {
  onClose: () => void;
}

export const RideSummary: React.FC<RideSummaryProps> = ({ onClose }) => {
  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto pb-24 bg-slate-50 dark:bg-black">
      
      {/* Header */}
      <div className="text-center mb-6 mt-4">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:to-neon-gold mb-2">
          Ride Complete
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Today, 10:42 AM • 24 mins</p>
      </div>

      {/* Main Score Card */}
      <GlassCard className="p-8 flex flex-col items-center justify-center mb-6 relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 dark:from-emerald-900/20 dark:to-yellow-900/20">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award size={120} />
        </div>
        
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Safety Score</div>
        <div className="text-7xl font-black text-slate-900 dark:text-white mb-2">94</div>
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/20 px-3 py-1 rounded-full">
            <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Excellent Rider</span>
        </div>
      </GlassCard>

      {/* AI Coach Insights */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">AI Coach Insights</h3>
      <div className="space-y-3 mb-6">
        <GlassCard className="p-4 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={20} />
            </div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Smooth Acceleration</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your throttle control was perfect. This saves fuel and improves stability.</p>
            </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                <AlertCircle size={20} />
            </div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Hard Braking Detected</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Detected 2 incidents of sudden braking near Main St. junction.</p>
            </div>
        </GlassCard>
      </div>

      {/* Map Visualization (Mock) */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Route Heatmap</h3>
      <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800 mb-6 relative overflow-hidden border border-slate-300 dark:border-white/10 group">
         <div 
           className="absolute inset-0 opacity-40 bg-cover bg-center grayscale" 
           style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,2,0/600x300?access_token=${MAPBOX_TOKEN}')` }}
         />
         
         {/* SVG Path Overlay */}
         <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M 20 150 Q 80 50 150 100 T 350 120" stroke="url(#gradient)" strokeWidth="6" fill="none" strokeLinecap="round" className="drop-shadow-lg" />
            <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="60%" stopColor="#10b981" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="80%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
            </defs>
         </svg>
         
         {/* Start/End Markers */}
         <div className="absolute top-[145px] left-[15px] w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-lg"></div>
         <div className="absolute top-[115px] right-[20px] w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg"></div>

         <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
            <Map size={10} />
            Visualize Speed
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
         <Button variant="secondary" onClick={onClose}>Dismiss</Button>
         <Button onClick={onClose}>
            <Share2 size={18} className="mr-2" /> Share
         </Button>
      </div>

    </div>
  );
};