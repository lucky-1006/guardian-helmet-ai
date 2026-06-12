import React, { useEffect, useState } from 'react';
import { CheckCircle, RefreshCw, Cpu, Wifi, Battery, Activity, Zap, AlertTriangle, Terminal } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';

export const Status = () => {
  const [counter, setCounter] = useState(258450);
  const [logLines, setLogLines] = useState<{id: number, text: string}[]>([
    { id: 258447, text: "[INIT] SYSTEM_BOOT_SEQUENCE_STARTED" },
    { id: 258448, text: "[CHECK] MEMORY_INTEGRITY... OK" },
    { id: 258449, text: "[LOAD] SENSOR_MODULES... DONE" }
  ]);

  // Simulate live logs
  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
        "[INFO] HEARTBEAT_ACK (42ms)",
        "[DATA] GYRO_UPDATE: {x:0.01, y:-0.02}",
        "[NET] CLOUD_SYNC_COMPLETE",
        "[PWR] BATTERY_VOLTAGE_STABLE",
        "[SENS] ALCOHOL_READING: 0.00%"
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      
      setCounter(prev => {
        const next = prev + 1;
        setLogLines(prevLogs => {
          const newLogs = [...prevLogs, { id: next, text: randomMsg }];
          return newLogs.slice(-6);
        });
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const systems = [
    { id: 1, name: 'Main Controller (ESP32)', status: 'online', icon: Cpu, detail: 'FW v2.4.1' },
    { id: 2, name: 'Bolt IoT Cloud', status: 'online', icon: Wifi, detail: 'Lat: 42ms' },
    { id: 3, name: 'Gyroscope (MPU6050)', status: 'online', icon: Activity, detail: 'Calibrated' },
    { id: 4, name: 'Alcohol Sensor (MQ-3)', status: 'online', icon: Zap, detail: 'Active' },
    { id: 5, name: 'Helmet Pressure', status: 'warning', icon: CheckCircle, detail: 'Check Fit' },
    { id: 6, name: 'Power Management', status: 'online', icon: Battery, detail: '84% • 4.1V' },
  ];

  return (
    <div className="p-4 space-y-4 pb-24 h-full overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Terminal size={20} className="text-neon-gold" /> System Status
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Run Diagnostics: Full Scan</p>
        </div>
        <Button variant="ghost" className="p-2 h-auto text-cyan-600 dark:text-neon-gold hover:text-cyan-500 dark:hover:text-amber-400">
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* Main Health Card */}
      <GlassCard className="p-6 flex flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-500/50 mb-6 relative overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.15)] group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-3 ring-1 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse-fast">
             <CheckCircle size={40} className="text-neon-green drop-shadow-lg" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">Systems Nominal</h3>
          <p className="text-xs font-mono text-emerald-600 dark:text-emerald-500 mt-1 opacity-80">Ready for engagement</p>
        </div>
        
        {/* HUD Corners */}
        <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-emerald-500/50"></div>
        <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-emerald-500/50"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-emerald-500/50"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-emerald-500/50"></div>
      </GlassCard>

      {/* System List Grid */}
      <div className="grid grid-cols-1 gap-2">
        {systems.map((sys) => (
          <GlassCard key={sys.id} className="p-3 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all border-l-2 border-l-transparent hover:border-l-neon-gold">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                sys.status === 'online' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400'
              }`}>
                <sys.icon size={16} />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-200 uppercase">{sys.name}</div>
                <div className="text-[10px] font-mono text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-neon-gold transition-colors">
                  {sys.detail}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${sys.status === 'online' ? 'bg-emerald-500' : 'bg-orange-500 animate-ping'}`} />
              <span className={`text-[10px] font-bold font-mono ${sys.status === 'online' ? 'text-emerald-600 dark:text-emerald-500' : 'text-orange-600 dark:text-orange-500'}`}>
                {sys.status === 'online' ? 'OK' : 'CHK'}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
      
      {/* Live Terminal Log - Updated Style */}
      <GlassCard className="p-3 mt-4 bg-white dark:bg-black/80 border-slate-200 dark:border-slate-700 h-36 font-mono text-[10px] flex flex-col justify-end relative overflow-hidden shadow-md dark:shadow-none">
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white dark:from-black to-transparent pointer-events-none z-10"></div>
        <div className="flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-white/10 pb-1 opacity-50">
           <AlertTriangle size={10} className="text-slate-400 dark:text-neon-gold" />
           <span className="font-bold uppercase tracking-widest text-slate-400 dark:text-neon-gold">Live Kernel Log</span>
        </div>
        <div className="space-y-1">
          {logLines.map((line) => (
            <p key={line.id} className="truncate animate-in slide-in-from-left-2 duration-300 font-medium">
              <span className={`mr-2 font-bold ${line.id % 2 === 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-500 dark:text-red-400'}`}>
                {line.id} &gt;
              </span>
              <span className="text-slate-800 dark:text-slate-400">
                 {line.text}
              </span>
            </p>
          ))}
          <div className="flex items-center">
             <span className="text-emerald-500 animate-pulse font-bold">_</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};