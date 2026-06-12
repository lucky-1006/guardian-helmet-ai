import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, Zap, Shield, AlertTriangle, Hospital, Fuel, CheckCircle, Clock, ArrowRight, CornerUpRight, Layers, CloudRain, Sun, Star, Plus, Trash2, X, ChevronDown } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { MAPBOX_TOKEN } from '../constants';

type MapMode = 'idle' | 'routing' | 'navigating';

export const MapScreen = () => {
  const [mode, setMode] = useState<MapMode>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<'safe' | 'fast'>('safe');
  const [showHospitals, setShowHospitals] = useState(false);
  const [showFuel, setShowFuel] = useState(false);
  const [mapView, setMapView] = useState<'satellite' | 'roadmap'>('roadmap');
  
  // Saved Locations State
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [savedLocations, setSavedLocations] = useState([
    { id: '1', name: 'Home', time: '15 min', distance: '4.2 km' },
    { id: '2', name: 'Work', time: '45 min', distance: '12.5 km' },
    { id: '3', name: 'Gym', time: '10 min', distance: '2.1 km' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLocName, setNewLocName] = useState('');

  // Simulation states
  const [eta, setEta] = useState(15);
  const [distance, setDistance] = useState(5.2);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  
  // Traffic Logic
  const [trafficData, setTrafficData] = useState<{fastEst: number, safeEst: number, congestion: boolean}>({
    fastEst: 14,
    safeEst: 18,
    congestion: false
  });

  // Mock POI Data for Visuals
  const hospitals = [{ x: 100, y: 180 }, { x: 320, y: 300 }];
  const fuelStations = [{ x: 60, y: 320 }, { x: 280, y: 150 }];

  // Simulate Google Maps Traffic API Fetch
  useEffect(() => {
    if (mode === 'routing') {
        // Reset to initial
        setTrafficData({ fastEst: 14, safeEst: 18, congestion: false });
        
        // Simulate API latency and data return
        const timer = setTimeout(() => {
            setTrafficData({
                fastEst: 22, // Increased due to traffic
                safeEst: 19,
                congestion: true
            });
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [mode]);

  // Simulate navigation movement
  useEffect(() => {
    if (mode === 'navigating') {
      const interval = setInterval(() => {
        setEta(prev => Math.max(0, prev - 0.1));
        setDistance(prev => Math.max(0, prev - 0.05));
        setCurrentSpeed(Math.floor(40 + Math.random() * 10)); // Fluctuating speed
      }, 1000);
      return () => clearInterval(interval);
    } else {
        setCurrentSpeed(0);
    }
  }, [mode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) setMode('routing');
  };

  const startNavigation = () => {
    setMode('navigating');
  };

  const exitNavigation = () => {
    setMode('idle');
    setSearchQuery('');
    setSelectedRoute('safe');
  };

  const handleAddLocation = () => {
    if (newLocName.trim()) {
        setSavedLocations([...savedLocations, {
            id: Date.now().toString(),
            name: newLocName,
            time: 'Calculating...',
            distance: '-- km'
        }]);
        setNewLocName('');
        setIsAdding(false);
    }
  };

  const handleDeleteLocation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedLocations(prev => prev.filter(l => l.id !== id));
  };

  // Allow dismissing the route sheet by clicking outside
  const handleBackgroundClick = () => {
    if (mode === 'routing') {
      setMode('idle');
    }
  };

  return (
    <div className="h-full w-full relative bg-slate-50 dark:bg-black overflow-hidden pb-20 font-sans transition-colors duration-500">
      
      {/* ================= MAP LAYERS ================= */}
      
      {/* 1. Live Google Map Embed */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${mode === 'idle' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
      >
         <iframe 
           width="100%" 
           height="100%" 
           frameBorder="0" 
           scrolling="no" 
           marginHeight={0} 
           marginWidth={0} 
           title="Google Map"
           src="https://maps.google.com/maps?q=San+Francisco&t=m&z=14&output=embed&iwloc=near"
           className="w-full h-full pointer-events-auto transition-all duration-500 grayscale opacity-90 dark:opacity-60 dark:invert dark:contrast-[1.2] dark:brightness-[0.4] dark:hue-rotate-180"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/90 dark:from-black/90 dark:via-transparent dark:to-black/90 pointer-events-none" />
      </div>

      {/* 2. Schematic Neural Map */}
      <div 
        className={`absolute inset-0 transition-all duration-700 ${mode !== 'idle' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
      >
          {/* Clickable background for dismissal in routing mode */}
          {mode === 'routing' && (
            <div className="absolute inset-0 z-20 cursor-pointer" onClick={handleBackgroundClick} />
          )}

          <div 
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 invert dark:invert-0 ${mode === 'navigating' ? 'brightness-90 contrast-125 dark:brightness-50 dark:contrast-125' : 'brightness-100 dark:brightness-60'}`}
            style={{ 
                backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/77.5946,12.9716,13,0/600x1000?access_token=${MAPBOX_TOKEN}')`,
            }} 
          />

          {/* HTML POI Markers Layer - Placed above background but below SVG lines */}
          <div className="absolute inset-0 z-10 pointer-events-none">
             {showHospitals && hospitals.map((pos, i) => (
                <div 
                  key={`h-marker-${i}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 animate-in zoom-in duration-300"
                  style={{ left: pos.x, top: pos.y }}
                >
                    <div className="p-2 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-bounce relative">
                        <Hospital size={16} className="text-white relative z-10" />
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <div className="bg-black/70 backdrop-blur text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-white/20">
                        2.4km
                    </div>
                </div>
             ))}

             {showFuel && fuelStations.map((pos, i) => (
                <div 
                  key={`f-marker-${i}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 animate-in zoom-in duration-300"
                  style={{ left: pos.x, top: pos.y }}
                >
                    <div className="p-2 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-bounce relative" style={{ animationDelay: '0.5s' }}>
                        <Fuel size={16} className="text-white relative z-10" />
                        <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <div className="bg-black/70 backdrop-blur text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-white/20">
                        $1.20
                    </div>
                </div>
             ))}
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Traffic Gradient: Safe Route (Mostly Green) */}
                <linearGradient id="trafficSafe" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="60%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>

                {/* Traffic Gradient: Fast Route (Congestion) */}
                <linearGradient id="trafficFast" x1="0" y1="1" x2="0.5" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="35%" stopColor="#ef4444" /> {/* Heavy Traffic Start */}
                  <stop offset="75%" stopColor="#ef4444" /> {/* Heavy Traffic End */}
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>

            {(mode === 'routing' || mode === 'navigating') && (
                <>
                    {/* Route A (Safe) - Uses Traffic Gradient if Active */}
                    <path 
                        d="M 190 400 Q 250 350 280 250 T 250 100" 
                        fill="none" 
                        stroke={selectedRoute === 'safe' && trafficData.congestion ? "url(#trafficSafe)" : "currentColor"}
                        className={`transition-all duration-300 ${mode === 'routing' && selectedRoute === 'fast' ? 'text-slate-400 dark:text-slate-700' : 'text-orange-500 dark:text-[#ffaa00]'} ${selectedRoute === 'safe' ? 'drop-shadow-[0_0_15px_rgba(249,115,22,0.6)] dark:drop-shadow-[0_0_15px_rgba(255,170,0,0.8)]' : 'opacity-40'}`}
                        strokeWidth={selectedRoute === 'safe' ? "6" : "4"}
                        strokeLinecap="round"
                        strokeDasharray={mode === 'navigating' ? "0" : "10,2"}
                    >
                         {mode === 'navigating' && (
                             <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                         )}
                    </path>
                    
                    {/* Route B (Fast) - Uses Traffic Gradient if Active */}
                    {mode === 'routing' && (
                        <path 
                            d="M 190 400 Q 100 300 120 200 T 250 100" 
                            fill="none" 
                            stroke={selectedRoute === 'fast' && trafficData.congestion ? "url(#trafficFast)" : "currentColor"}
                            className={`transition-all duration-300 ${selectedRoute === 'fast' ? 'text-blue-600 dark:text-[#0ea5e9] drop-shadow-[0_0_15px_rgba(37,99,235,0.6)] dark:drop-shadow-[0_0_15px_rgba(14,165,233,0.8)]' : 'text-slate-400 dark:text-slate-700 opacity-40'}`}
                            strokeWidth={selectedRoute === 'fast' ? "6" : "4"}
                            strokeLinecap="round"
                        />
                    )}

                    {/* Start Marker */}
                    <g transform="translate(190, 400)">
                        <circle r="12" fill="#10b981" fillOpacity="0.3" className="animate-ping-slow" />
                        <circle r="6" fill="#10b981" stroke="white" strokeWidth="2" className="drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    </g>
                    
                    {/* Destination Marker with Bounce */}
                    <g transform="translate(250, 100)">
                        <circle r="15" fill="#ef4444" fillOpacity="0.2" className="animate-ping-slow" style={{ animationDelay: '1s' }} />
                        <circle r="4" fill="#ef4444" className="drop-shadow-lg" />
                        <path 
                          d="M -8 -25 Q 0 -35 8 -25 L 0 0 Z" 
                          fill="#ef4444" 
                          stroke="white" 
                          strokeWidth="2" 
                          className="animate-bounce"
                          filter="url(#glow)"
                        />
                    </g>
                    
                    {/* Rider Puck (Navigating) */}
                    {mode === 'navigating' && (
                        <g transform="translate(190, 400)">
                            <circle r="12" className="fill-orange-500 dark:fill-[#ffaa00]" fillOpacity="0.3" style={{ animationName: 'ping', animationDuration: '1s', animationIterationCount: 'infinite' }} />
                            <circle r="6" className="fill-orange-500 dark:fill-[#ffaa00]" style={{ filter: 'drop-shadow(0 0 10px rgba(255,170,0,1))' }} />
                        </g>
                    )}
                </>
            )}
          </svg>
      </div>

      {/* ================= UI LAYERS ================= */}

      {/* TOP BAR */}
      <div className={`absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 pb-12 transition-all duration-500 ${mode === 'navigating' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        {mode === 'idle' ? (
             <div className="relative z-50">
                <form onSubmit={handleSearch} className="relative z-50">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search Destination..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-xl py-3 pl-12 pr-4 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-white focus:ring-1 focus:ring-cyan-500 dark:focus:ring-white transition-all shadow-xl font-mono text-sm"
                    />
                </form>

                {/* Saved Locations Widget */}
                <div className="absolute top-full left-0 mt-3 z-40">
                    {/* Toggle Button */}
                    <button 
                        onClick={() => setIsSavedOpen(!isSavedOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border transition-all shadow-lg active:scale-95 ${isSavedOpen ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-white/90 dark:bg-black/80 text-slate-700 dark:text-white border-slate-200 dark:border-white/20'}`}
                    >
                         <Star size={16} className={isSavedOpen ? "fill-white text-white" : "text-orange-400"} />
                         <span className="text-xs font-bold uppercase tracking-wider">Saved Places</span>
                         <ChevronDown size={14} className={`transition-transform duration-300 ${isSavedOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Expandable List */}
                    {isSavedOpen && (
                        <div className="mt-2 w-64 animate-in slide-in-from-top-2 fade-in duration-300">
                            <GlassCard className="!p-0 overflow-hidden shadow-2xl !bg-white/95 dark:!bg-black/95 border-slate-200 dark:border-white/10">
                                 <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                     {savedLocations.length === 0 && (
                                         <div className="p-4 text-center text-xs text-slate-500">No saved places yet.</div>
                                     )}
                                     {savedLocations.map((place, i) => (
                                        <div 
                                            key={place.id}
                                            onClick={() => {setSearchQuery(place.name); setMode('routing');}}
                                            className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-white/10 cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-0 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`p-1.5 rounded-lg shrink-0 ${i % 2 === 0 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
                                                    <MapPin size={14} />
                                                </div>
                                                <div className="truncate">
                                                    <div className="font-bold text-slate-800 dark:text-white text-xs truncate">{place.name}</div>
                                                    <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono truncate">{place.time} • {place.distance}</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={(e) => handleDeleteLocation(place.id, e)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                 </div>
                                 
                                 {/* Add Section */}
                                 <div className="p-2 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                                    {isAdding ? (
                                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1">
                                            <input 
                                                autoFocus
                                                value={newLocName}
                                                onChange={(e) => setNewLocName(e.target.value)}
                                                placeholder="Location Name..."
                                                className="flex-1 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/20 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-white"
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
                                            />
                                            <button onClick={handleAddLocation} className="p-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white shadow-sm"><CheckCircle size={14} /></button>
                                            <button onClick={() => setIsAdding(false)} className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"><X size={14} /></button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setIsAdding(true)}
                                            className="w-full py-1.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-white/5 rounded-lg border border-dashed border-slate-300 dark:border-white/20 transition-all"
                                        >
                                            <Plus size={14} /> Add Place
                                        </button>
                                    )}
                                 </div>
                            </GlassCard>
                        </div>
                    )}
               </div>
            </div>
        ) : (
            <div className="flex justify-between items-center bg-white/80 dark:bg-black/60 p-2 rounded-xl backdrop-blur-md shadow-sm dark:shadow-none">
                <Button variant="ghost" onClick={() => setMode('idle')} className="!p-2 text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg"><ArrowRight className="rotate-180" /></Button>
                <span className="text-slate-800 dark:text-white font-bold uppercase tracking-widest text-sm">Route Planning</span>
                <div className="w-10" />
            </div>
        )}
      </div>

      {/* RIGHT FLOATING BUTTONS */}
      <div className={`absolute top-24 right-4 z-20 flex flex-col gap-3 transition-transform duration-500 ${mode === 'navigating' ? 'translate-x-20' : 'translate-x-0'}`}>
        <button 
            onClick={() => setShowHospitals(!showHospitals)}
            className={`p-3 rounded-xl shadow-lg backdrop-blur-md transition-all active:scale-95 border ${showHospitals ? 'bg-red-500 border-red-400 text-white' : 'bg-white/90 dark:bg-black/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:border-white/30'}`}
        >
            <Hospital size={20} />
        </button>
        <button 
            onClick={() => setShowFuel(!showFuel)}
            className={`p-3 rounded-xl shadow-lg backdrop-blur-md transition-all active:scale-95 border ${showFuel ? 'bg-amber-500 border-amber-400 text-white' : 'bg-white/90 dark:bg-black/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:border-white/30'}`}
        >
            <Fuel size={20} />
        </button>
        <button 
            onClick={() => setMapView(mapView === 'roadmap' ? 'satellite' : 'roadmap')}
            className="p-3 rounded-xl shadow-lg backdrop-blur-md bg-white/90 dark:bg-black/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 active:scale-95 hover:bg-slate-50 dark:hover:border-white/30"
        >
            <Layers size={20} />
        </button>
      </div>

      {/* ================= SLIDING ROUTE SHEET ================= */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-30 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${mode === 'routing' ? 'translate-y-0' : 'translate-y-[110%]'}`}
      >
        <div className="bg-white/95 dark:bg-[#121212]/95 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] max-h-[70vh] overflow-y-auto no-scrollbar">
            {/* Handle */}
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-6" />
            
            {/* Sheet Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-lg flex items-center gap-2">
                    <Zap className="text-orange-500 dark:text-neon-gold fill-orange-500 dark:fill-neon-gold" size={18} />
                    AI Optimized Routes
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Safety algorithms applied</p>
                </div>
                <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
                  2 FOUND
                </div>
            </div>

            {/* Route Cards */}
            <div className="space-y-4 mb-6">
                {/* Safe Route Card */}
                <div 
                   onClick={() => setSelectedRoute('safe')}
                   className={`relative p-4 rounded-2xl border transition-all cursor-pointer group overflow-hidden ${
                       selectedRoute === 'safe' 
                       ? 'bg-orange-50 border-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.15)] dark:bg-neon-gold/5 dark:border-neon-gold/50 dark:shadow-[0_0_20px_rgba(255,170,0,0.1)] scale-[1.02]' 
                       : 'bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 scale-100'
                   }`}
                >
                    {selectedRoute === 'safe' && <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 dark:bg-neon-gold" />}
                    
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${selectedRoute === 'safe' ? 'bg-orange-100 text-orange-700 dark:bg-neon-gold dark:text-black' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                              <Shield size={20} />
                            </div>
                            <div>
                              <div className={`font-bold uppercase tracking-wider text-sm ${selectedRoute === 'safe' ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-300"}`}>Safe Route</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">VIA LAKE RD (LOW TRAFFIC)</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/20 font-mono mb-1">
                                <CheckCircle size={10} /> 98% SCORE
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1"><Sun size={10} /> Clear</div>
                        </div>
                    </div>
                    
                    {/* Data Grid */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-t border-dashed border-slate-200 dark:border-white/10">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Time</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">{trafficData.safeEst}<span className="text-xs font-normal text-slate-500 ml-0.5">m</span></div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Dist</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">5.2<span className="text-xs font-normal text-slate-500 ml-0.5">km</span></div>
                        </div>
                        <div className="flex flex-col justify-center h-full">
                          {selectedRoute === 'safe' ? (
                               <button 
                                  onClick={(e) => { e.stopPropagation(); startNavigation(); }}
                                  className="w-full bg-slate-900 dark:bg-neon-gold text-white dark:text-black py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                              >
                                  <Navigation size={12} fill="currentColor" /> START
                              </button>
                          ) : (
                              <div>
                                 <div className="text-[10px] text-slate-500 uppercase font-bold">Traffic</div>
                                 <div className="flex gap-0.5 mt-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-300 dark:bg-emerald-500/30"></div>
                                 </div>
                              </div>
                          )}
                        </div>
                    </div>
                </div>

                {/* Fastest Route Card */}
                <div 
                   onClick={() => setSelectedRoute('fast')}
                   className={`relative p-4 rounded-2xl border transition-all cursor-pointer group overflow-hidden ${
                       selectedRoute === 'fast' 
                       ? 'bg-blue-50 border-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:bg-blue-500/10 dark:border-blue-500/50 scale-[1.02]' 
                       : 'bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 scale-100'
                   }`}
                >
                     {selectedRoute === 'fast' && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />}

                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${selectedRoute === 'fast' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                              <Clock size={20} />
                            </div>
                            <div>
                              <div className={`font-bold uppercase tracking-wider text-sm ${selectedRoute === 'fast' ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-300"}`}>Fastest</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">VIA HIGHWAY (HEAVY TRAFFIC)</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-500/10 px-2 py-0.5 rounded text-orange-600 dark:text-orange-400 text-[10px] font-bold border border-orange-200 dark:border-orange-500/20 font-mono mb-1">
                                <AlertTriangle size={10} /> 72% SCORE
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1"><CloudRain size={10} /> Drizzle</div>
                        </div>
                    </div>

                    {/* Data Grid */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-t border-dashed border-slate-200 dark:border-white/10">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Time</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">{trafficData.fastEst}<span className="text-xs font-normal text-slate-500 ml-0.5">m</span></div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Dist</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">4.8<span className="text-xs font-normal text-slate-500 ml-0.5">km</span></div>
                        </div>
                        <div className="flex flex-col justify-center h-full">
                          {selectedRoute === 'fast' ? (
                               <button 
                                  onClick={(e) => { e.stopPropagation(); startNavigation(); }}
                                  className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                              >
                                  <Navigation size={12} fill="currentColor" /> START
                              </button>
                          ) : (
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Traffic</div>
                                <div className="flex gap-0.5 mt-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                </div>
                              </div>
                          )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <Button variant="secondary" onClick={() => setMode('idle')} className="flex-1 border-slate-300 dark:border-slate-700 text-sm">
                Cancel
              </Button>
              <Button variant="primary" onClick={startNavigation} className="flex-[2] shadow-lg shadow-emerald-500/20 text-sm font-bold tracking-widest uppercase">
                 <Navigation size={18} className="mr-2" /> Start Guidance
              </Button>
            </div>
        </div>
      </div>

      {/* ================= NAVIGATION HUD (TOP) ================= */}
      {mode === 'navigating' && (
           <div className="absolute top-4 left-4 right-4 z-40 animate-in slide-in-from-top-10">
              <GlassCard className="!bg-white/95 dark:!bg-black/90 border-slate-200 dark:!border-white/10 flex justify-between items-center p-4 shadow-2xl relative overflow-hidden ring-1 ring-slate-100 dark:ring-white/20">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 dark:bg-neon-green"></div>
                  <div className="flex items-center gap-4 pl-2">
                      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 relative shadow-inner">
                           <div className="absolute inset-0 border border-slate-300 dark:border-white/5 m-1 rounded-lg"></div>
                          <CornerUpRight size={32} className="text-emerald-600 dark:text-neon-green drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] dark:drop-shadow-[0_0_8px_rgba(10,255,0,0.6)]" />
                      </div>
                      <div>
                          <div className="text-4xl font-black text-slate-900 dark:text-white font-mono leading-none tracking-tighter">200<span className="text-sm font-bold text-slate-500 ml-1">m</span></div>
                          <div className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest mt-1">Turn Right • MG Road</div>
                      </div>
                  </div>
                  <Button variant="ghost" className="!p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-500/20" onClick={exitNavigation}>EXIT</Button>
              </GlassCard>
           </div>
      )}

      {/* ================= NAVIGATION HUD (BOTTOM) ================= */}
      {mode === 'navigating' && (
          <>
             {/* Speed Limit */}
             <div className="absolute top-52 left-4 z-10 flex flex-col gap-2 animate-in fade-in duration-700">
                 <div className="w-16 h-16 rounded-xl bg-white border-4 border-red-600 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                     <div className="text-[8px] font-black text-black leading-none mt-1 uppercase">MAX</div>
                     <div className="text-3xl font-black text-black leading-none font-mono">60</div>
                     <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] pointer-events-none"></div>
                 </div>
                 {currentSpeed > 60 && (
                     <div className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg animate-pulse text-center shadow-lg border border-red-400 uppercase tracking-widest">
                         SLOW DOWN
                     </div>
                 )}
             </div>

             {/* Bottom Stats */}
             <div className="absolute bottom-24 left-4 right-4 z-20 animate-in slide-in-from-bottom-10">
                 <GlassCard className="flex justify-between items-center p-4 !bg-white/95 dark:!bg-black/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10">
                     <div className="text-center">
                         <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">ETA</div>
                         <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{Math.floor(eta)}<span className="text-[10px] font-normal text-slate-500 ml-0.5">m</span></div>
                     </div>
                     <div className="w-px h-8 bg-slate-300 dark:bg-white/10" />
                     <div className="text-center">
                         <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">DIST</div>
                         <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{distance.toFixed(1)}<span className="text-[10px] font-normal text-slate-500 ml-0.5">km</span></div>
                     </div>
                     <div className="w-px h-8 bg-slate-300 dark:bg-white/10" />
                     <div className="text-center">
                         <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">SPD</div>
                         <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{currentSpeed}<span className="text-[10px] font-normal text-slate-500 ml-0.5">kmh</span></div>
                     </div>
                 </GlassCard>
             </div>
          </>
      )}

    </div>
  );
};