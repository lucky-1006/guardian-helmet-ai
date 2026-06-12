import React, { useState, useEffect, useCallback } from 'react';
import { Home, BarChart2, Settings as SettingsIcon, Cpu, Moon, Sun, ChevronDown, Check, Map as MapIcon, Bluetooth, Wifi, Loader2 } from 'lucide-react';

import { AppScreen, RiderProfile, SensorData, SimulationOverrides, ConnectivityStatus } from './types';
import { generateMockSensorData } from './services/mockIoT';

import { Onboarding } from './screens/Onboarding';
import { Setup } from './screens/Setup';
import { Dashboard } from './screens/Dashboard';
import { Emergency } from './screens/Emergency';
import { Status } from './screens/Status';
import { RideSummary } from './screens/RideSummary';
import { MapScreen } from './screens/MapScreen';
import { Button } from './components/Button';
import { GlassCard } from './components/GlassCard';
import { DevTools } from './components/DevTools';
import { MOCK_RIDE_HISTORY } from './constants';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.ONBOARDING);
  const [riderProfile, setRiderProfile] = useState<RiderProfile | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Settings State
  const [sensitivity, setSensitivity] = useState<'Low' | 'Normal' | 'High'>('Normal');
  const [sosTimer, setSosTimer] = useState<number>(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Connectivity State
  const [connectivity, setConnectivity] = useState<ConnectivityStatus>({
    bluetooth: true,
    wifi: false
  });
  const [isConnecting, setIsConnecting] = useState<{bt: boolean, wifi: boolean}>({ bt: false, wifi: false });

  // Simulation State for Judges
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [simulationOverrides, setSimulationOverrides] = useState<SimulationOverrides>({
    forceCrash: false,
    forceDrunk: false,
    forceHelmetOff: false,
  });

  const [sensorData, setSensorData] = useState<SensorData>({
    helmetWorn: false,
    alcoholLevel: 0,
    speed: 0,
    impactForce: 1,
    timestamp: Date.now()
  });
  
  // Initialize with dummy history so graph isn't empty on load
  const [sensorHistory, setSensorHistory] = useState<{timestamp: number, force: number, speed: number}[]>(
    Array(20).fill(0).map((_, i) => ({
      timestamp: Date.now() - (20 - i) * 500,
      force: 1.0 + (Math.random() * 0.1 - 0.05),
      speed: 0
    }))
  );
  
  const [isEmergency, setIsEmergency] = useState(false);

  // Theme Toggle Effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleDropdown = (key: string) => {
    setActiveDropdown(prev => prev === key ? null : key);
  };

  const toggleConnectivity = (type: 'bluetooth' | 'wifi') => {
    const key = type === 'bluetooth' ? 'bt' : 'wifi';
    if (isConnecting[key]) return;

    // Start loading
    setIsConnecting(prev => ({ ...prev, [key]: true }));

    // Simulate connection delay
    setTimeout(() => {
      setConnectivity(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
      setIsConnecting(prev => ({ ...prev, [key]: false }));
    }, 1500);
  };

  const handleDevTrigger = (key: keyof SimulationOverrides) => {
    setSimulationOverrides(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // IoT Simulation Loop - INCREASED RATE TO 500ms for better responsiveness
  useEffect(() => {
    // If crash is forced by dev tools, trigger emergency immediately
    if (simulationOverrides.forceCrash && !isEmergency) {
      setIsEmergency(true);
    }

    if (currentScreen !== AppScreen.DASHBOARD || isEmergency) return;

    const interval = setInterval(() => {
      setSensorData(prev => {
        const newData = generateMockSensorData(prev, simulationOverrides);
        setSensorHistory(hist => {
          const newHist = [...hist, { timestamp: newData.timestamp, force: newData.impactForce, speed: newData.speed }];
          return newHist.slice(-30); // Keep last 30 points (approx 15 seconds)
        });
        return newData;
      });
    }, 500); // Faster updates

    return () => clearInterval(interval);
  }, [currentScreen, isEmergency, simulationOverrides]);

  const handleManualSOS = useCallback(() => {
    setIsEmergency(true);
  }, []);

  const handleEmergencyCancel = () => {
    setIsEmergency(false);
    // Reset crash simulation if it was active
    if (simulationOverrides.forceCrash) {
      setSimulationOverrides(prev => ({ ...prev, forceCrash: false }));
    }
  };

  const renderContent = () => {
    switch (currentScreen) {
      case AppScreen.ONBOARDING:
        return <Onboarding onComplete={() => setCurrentScreen(AppScreen.SETUP_PROFILE)} />;
      
      case AppScreen.SETUP_PROFILE:
      case AppScreen.SETUP_PERMISSIONS:
        return (
          <Setup 
            currentScreen={currentScreen}
            setScreen={setCurrentScreen}
            onComplete={(profile) => {
              setRiderProfile(profile);
              setCurrentScreen(AppScreen.DASHBOARD);
            }} 
          />
        );

      case AppScreen.DASHBOARD:
        return (
          <Dashboard 
            sensorData={sensorData} 
            sensorHistory={sensorHistory}
            onTriggerSOS={handleManualSOS}
            onEndRide={() => setCurrentScreen(AppScreen.RIDE_SUMMARY)}
            onOpenDevTools={() => setIsDevToolsOpen(true)}
            isDarkMode={theme === 'dark'}
            connectivity={connectivity}
          />
        );

      case AppScreen.MAP:
        return <MapScreen />;

      case AppScreen.RIDE_SUMMARY:
        return <RideSummary onClose={() => setCurrentScreen(AppScreen.DASHBOARD)} />;

      case AppScreen.HISTORY:
        return (
          <div className="p-4 space-y-4 pb-24 overflow-y-auto h-full">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-guardian-cream uppercase tracking-wider">Trip History</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <GlassCard className="p-4 bg-emerald-500/10 border-emerald-500/20">
                <div className="text-3xl font-mono font-bold text-emerald-600 dark:text-safe-green">98</div>
                <div className="text-xs text-slate-500 dark:text-guardian-muted font-bold uppercase">Avg Score</div>
              </GlassCard>
              <GlassCard className="p-4 bg-blue-500/10 border-blue-500/20">
                <div className="text-3xl font-mono font-bold text-blue-600 dark:text-guardian-sky">142<span className="text-lg">km</span></div>
                <div className="text-xs text-slate-500 dark:text-guardian-muted font-bold uppercase">Total Dist</div>
              </GlassCard>
            </div>
            {MOCK_RIDE_HISTORY.map(ride => (
              <GlassCard key={ride.id} className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900 dark:text-guardian-cream">{ride.date}</div>
                  <div className="text-xs text-slate-500 dark:text-guardian-muted font-mono">{ride.distance} • {ride.duration}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    ride.status === 'Safe' ? 'bg-emerald-500/10 text-emerald-600 dark:text-safe-green' : 'bg-orange-500/10 text-orange-600 dark:text-neon-gold'
                  }`}>
                    {ride.status}
                  </span>
                  <span className="text-sm font-mono text-slate-500 dark:text-guardian-pale">Score: {ride.safetyScore}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        );

      case AppScreen.STATUS:
        return <Status />;

      case AppScreen.SETTINGS:
        return (
          <div className="p-4 space-y-4 pb-24 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-guardian-cream uppercase tracking-wider">Settings</h2>
            {riderProfile && (
              <GlassCard className="p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-cyan-500 dark:bg-guardian-sky flex items-center justify-center text-xl font-bold text-white dark:text-black">
                    {riderProfile.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-guardian-cream">{riderProfile.name}</div>
                    <div className="text-xs text-slate-500 dark:text-guardian-muted font-mono">{riderProfile.phone}</div>
                  </div>
                </div>
              </GlassCard>
            )}

            <div className="space-y-3">
               <h3 className="text-xs font-bold text-slate-500 dark:text-guardian-muted uppercase tracking-widest ml-1">Connectivity</h3>
               
               {/* Bluetooth Toggle */}
               <GlassCard className="p-4 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${connectivity.bluetooth ? 'bg-blue-100 dark:bg-guardian-sky/20 text-blue-600 dark:text-guardian-sky' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-guardian-pale'}`}>
                     <Bluetooth size={20} />
                   </div>
                   <div>
                     <div className="font-bold text-sm text-slate-900 dark:text-guardian-cream">Bluetooth</div>
                     <div className="text-[10px] text-slate-500 dark:text-guardian-muted font-mono">
                       {isConnecting.bt ? 'Searching...' : connectivity.bluetooth ? 'Connected: Helmet-X1' : 'Disconnected'}
                     </div>
                   </div>
                 </div>
                 <button 
                   onClick={() => toggleConnectivity('bluetooth')}
                   disabled={isConnecting.bt}
                   className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative ${connectivity.bluetooth ? 'bg-guardian-sky' : 'bg-slate-300 dark:bg-white/10'}`}
                 >
                    {isConnecting.bt ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 size={12} className="animate-spin text-white" />
                      </div>
                    ) : (
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${connectivity.bluetooth ? 'translate-x-5' : 'translate-x-0'}`} />
                    )}
                 </button>
               </GlassCard>

               {/* WiFi Toggle */}
               <GlassCard className="p-4 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${connectivity.wifi ? 'bg-emerald-100 dark:bg-safe-green/20 text-emerald-600 dark:text-safe-green' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-guardian-pale'}`}>
                     <Wifi size={20} />
                   </div>
                   <div>
                     <div className="font-bold text-sm text-slate-900 dark:text-guardian-cream">Wi-Fi</div>
                     <div className="text-[10px] text-slate-500 dark:text-guardian-muted font-mono">
                       {isConnecting.wifi ? 'Scanning...' : connectivity.wifi ? 'Connected: Guardian_Hub' : 'Disconnected'}
                     </div>
                   </div>
                 </div>
                 <button 
                   onClick={() => toggleConnectivity('wifi')}
                   disabled={isConnecting.wifi}
                   className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative ${connectivity.wifi ? 'bg-safe-green' : 'bg-slate-300 dark:bg-white/10'}`}
                 >
                    {isConnecting.wifi ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 size={12} className="animate-spin text-white" />
                      </div>
                    ) : (
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${connectivity.wifi ? 'translate-x-5' : 'translate-x-0'}`} />
                    )}
                 </button>
               </GlassCard>
            </div>
            
            <div className="space-y-3 mt-6">
               <h3 className="text-xs font-bold text-slate-500 dark:text-guardian-muted uppercase tracking-widest ml-1">System</h3>
               
               <GlassCard className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5" onClick={toggleTheme}>
                 <div className="flex items-center gap-3 text-slate-900 dark:text-guardian-cream">
                   {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                   <span className="font-medium">Theme</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${theme === 'dark' ? 'bg-guardian-sky' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                   </div>
                 </div>
               </GlassCard>

               <h3 className="text-xs font-bold text-slate-500 dark:text-guardian-muted uppercase tracking-widest ml-1 mt-4">Safety Calibration</h3>
               
               {/* Sensitivity Dropdown */}
               <GlassCard className="p-0 overflow-hidden transition-all duration-300">
                 <div 
                   className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                   onClick={() => toggleDropdown('sensitivity')}
                 >
                   <span className="text-slate-900 dark:text-guardian-cream font-medium">Sensitivity</span>
                   <div className="flex items-center gap-2">
                     <span className="text-cyan-600 dark:text-guardian-sky font-mono text-sm">{sensitivity}</span>
                     <ChevronDown size={16} className={`text-slate-400 dark:text-guardian-muted transition-transform duration-300 ${activeDropdown === 'sensitivity' ? 'rotate-180' : ''}`} />
                   </div>
                 </div>
                 
                 {activeDropdown === 'sensitivity' && (
                   <div className="bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5 p-2 space-y-1">
                     {['Low', 'Normal', 'High'].map((opt) => (
                       <button
                         key={opt}
                         onClick={() => { setSensitivity(opt as any); setActiveDropdown(null); }}
                         className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center text-sm transition-colors ${
                           sensitivity === opt 
                             ? 'bg-cyan-100/50 dark:bg-guardian-sky/10 text-cyan-700 dark:text-guardian-sky font-bold' 
                             : 'text-slate-600 dark:text-guardian-pale hover:bg-slate-100 dark:hover:bg-white/5'
                         }`}
                       >
                         {opt}
                         {sensitivity === opt && <Check size={16} />}
                       </button>
                     ))}
                   </div>
                 )}
               </GlassCard>

               {/* SOS Timer Dropdown */}
               <GlassCard className="p-0 overflow-hidden transition-all duration-300">
                 <div 
                   className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                   onClick={() => toggleDropdown('timer')}
                 >
                   <span className="text-slate-900 dark:text-guardian-cream font-medium">SOS Timer</span>
                   <div className="flex items-center gap-2">
                     <span className="text-cyan-600 dark:text-guardian-sky font-mono text-sm">{sosTimer}s</span>
                     <ChevronDown size={16} className={`text-slate-400 dark:text-guardian-muted transition-transform duration-300 ${activeDropdown === 'timer' ? 'rotate-180' : ''}`} />
                   </div>
                 </div>
                 
                 {activeDropdown === 'timer' && (
                   <div className="bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5 p-2 space-y-1">
                     {[5, 10, 15, 30, 60].map((time) => (
                       <button
                         key={time}
                         onClick={() => { setSosTimer(time); setActiveDropdown(null); }}
                         className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center text-sm transition-colors ${
                           sosTimer === time 
                             ? 'bg-cyan-100/50 dark:bg-guardian-sky/10 text-cyan-700 dark:text-guardian-sky font-bold' 
                             : 'text-slate-600 dark:text-guardian-pale hover:bg-slate-100 dark:hover:bg-white/5'
                         }`}
                       >
                         {time} seconds
                         {sosTimer === time && <Check size={16} />}
                       </button>
                     ))}
                   </div>
                 )}
               </GlassCard>
            </div>

            <div className="pt-6">
              <Button variant="ghost" fullWidth className="text-red-500 hover:text-red-600 dark:text-alert-red dark:hover:text-red-300">System Log Out</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isSetup = (currentScreen !== AppScreen.ONBOARDING && currentScreen !== AppScreen.SETUP_PROFILE && currentScreen !== AppScreen.SETUP_PERMISSIONS);
  const isNavigable = isSetup && !isEmergency && currentScreen !== AppScreen.RIDE_SUMMARY;

  return (
    <div className="w-full h-screen bg-slate-50 dark:bg-guardian-deep text-slate-900 dark:text-guardian-cream relative overflow-hidden flex flex-col max-w-md mx-auto shadow-2xl transition-colors duration-300 font-sans">
      
      {/* Dev Tools Overlay for Judges */}
      {isSetup && (
        <DevTools 
          isOpen={isDevToolsOpen}
          onClose={() => setIsDevToolsOpen(false)}
          onToggleOverride={handleDevTrigger} 
          activeOverrides={simulationOverrides} 
        />
      )}

      {/* Emergency Overlay */}
      {isEmergency && (
        <Emergency onCancel={handleEmergencyCancel} countdownStart={sosTimer} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {/* Scanline Overlay for Cyberpunk Feel */}
        <div className="absolute inset-0 z-0 scanline-overlay pointer-events-none opacity-20 dark:opacity-20 mix-blend-overlay" />
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      {isNavigable && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-[#121212]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 px-6 py-4 flex justify-between items-center z-40 transition-colors duration-300">
           <button 
             onClick={() => setCurrentScreen(AppScreen.DASHBOARD)}
             className={`flex flex-col items-center gap-1.5 transition-colors ${currentScreen === AppScreen.DASHBOARD ? 'text-cyan-600 dark:text-guardian-sky scale-110' : 'text-slate-400 dark:text-guardian-muted hover:text-slate-500'}`}
           >
             <Home size={20} strokeWidth={2.5} />
             <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
           </button>
           
           <button 
             onClick={() => setCurrentScreen(AppScreen.HISTORY)}
             className={`flex flex-col items-center gap-1.5 transition-colors ${currentScreen === AppScreen.HISTORY ? 'text-cyan-600 dark:text-guardian-sky scale-110' : 'text-slate-400 dark:text-guardian-muted hover:text-slate-500'}`}
           >
             <BarChart2 size={20} strokeWidth={2.5} />
             <span className="text-[10px] font-bold uppercase tracking-wider">Stats</span>
           </button>

           <button 
             onClick={() => setCurrentScreen(AppScreen.MAP)}
             className={`flex flex-col items-center gap-1.5 transition-colors ${currentScreen === AppScreen.MAP ? 'text-cyan-600 dark:text-guardian-sky scale-110' : 'text-slate-400 dark:text-guardian-muted hover:text-slate-500'}`}
           >
             <MapIcon size={20} strokeWidth={2.5} />
             <span className="text-[10px] font-bold uppercase tracking-wider">Map</span>
           </button>

           <button 
             onClick={() => setCurrentScreen(AppScreen.STATUS)}
             className={`flex flex-col items-center gap-1.5 transition-colors ${currentScreen === AppScreen.STATUS ? 'text-cyan-600 dark:text-guardian-sky scale-110' : 'text-slate-400 dark:text-guardian-muted hover:text-slate-500'}`}
           >
             <Cpu size={20} strokeWidth={2.5} />
             <span className="text-[10px] font-bold uppercase tracking-wider">Sys</span>
           </button>
           
           <button 
             onClick={() => setCurrentScreen(AppScreen.SETTINGS)}
             className={`flex flex-col items-center gap-1.5 transition-colors ${currentScreen === AppScreen.SETTINGS ? 'text-cyan-600 dark:text-guardian-sky scale-110' : 'text-slate-400 dark:text-guardian-muted hover:text-slate-500'}`}
           >
             <SettingsIcon size={20} strokeWidth={2.5} />
             <span className="text-[10px] font-bold uppercase tracking-wider">Cfg</span>
           </button>
        </div>
      )}
    </div>
  );
};

export default App;