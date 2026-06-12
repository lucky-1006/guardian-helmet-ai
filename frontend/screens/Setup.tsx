import React, { useState } from 'react';
import { User, Phone, Activity, MapPin, CheckCircle, Users, HardDrive } from 'lucide-react';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { RiderProfile, AppScreen } from '../types';
import { MAPBOX_TOKEN } from '../constants';

interface SetupProps {
  onComplete: (profile: RiderProfile) => void;
  setScreen: (screen: AppScreen) => void;
  currentScreen: AppScreen;
}

export const Setup: React.FC<SetupProps> = ({ onComplete, setScreen, currentScreen }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    emergencyContact: '',
    vehicleNumber: ''
  });

  const [permissionStep, setPermissionStep] = useState<'location' | 'contacts' | 'storage'>('location');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScreen(AppScreen.SETUP_PERMISSIONS);
  };

  const handleLocationGrant = () => {
    setTimeout(() => {
      setPermissionStep('contacts');
    }, 500);
  };

  const handleContactGrant = () => {
    setTimeout(() => {
      setPermissionStep('storage');
    }, 500);
  };

  const handleStorageGrant = () => {
    setTimeout(() => {
      onComplete({
        ...formData,
        isConfigured: true
      });
    }, 800);
  };

  if (currentScreen === AppScreen.SETUP_PROFILE) {
    return (
      <div className="h-full p-6 flex flex-col justify-center bg-slate-50 dark:bg-black transition-colors duration-300">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Rider Profile</h2>
          <p className="text-slate-500 dark:text-slate-400">Personalize your Guardian system.</p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={20} />
              <input 
                name="name"
                required
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-neon-gold focus:ring-1 focus:ring-cyan-500 dark:focus:ring-neon-gold transition-colors"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={20} />
              <input 
                name="phone"
                required
                type="tel"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-neon-gold focus:ring-1 focus:ring-cyan-500 dark:focus:ring-neon-gold transition-colors"
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Emergency Contact</label>
            <div className="relative">
              <Activity className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={20} />
              <input 
                name="emergencyContact"
                required
                type="tel"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-neon-gold focus:ring-1 focus:ring-cyan-500 dark:focus:ring-neon-gold transition-colors"
                placeholder="Mom, Dad, etc."
                value={formData.emergencyContact}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Vehicle Number</label>
            <div className="relative">
              <div className="absolute left-4 top-3.5 font-bold text-slate-400 dark:text-slate-500 text-sm">REG</div>
              <input 
                name="vehicleNumber"
                required
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-neon-gold focus:ring-1 focus:ring-cyan-500 dark:focus:ring-neon-gold transition-colors uppercase tracking-widest"
                placeholder="ABC-1234"
                value={formData.vehicleNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-6">
            <Button type="submit" fullWidth>Continue</Button>
          </div>
        </form>
      </div>
    );
  }

  // Permission UI Logic
  const getPermissionContent = () => {
    switch (permissionStep) {
      case 'contacts':
        return {
          icon: <Users className="text-cyan-400 dark:text-neon-gold" size={40} />,
          title: "Contact Access",
          desc: "We need access to your contacts to quickly connect with your emergency contacts during SOS situations.",
          buttonText: "Allow Contact Access",
          handler: handleContactGrant
        };
      case 'storage':
        return {
          icon: <HardDrive className="text-cyan-400 dark:text-neon-gold" size={40} />,
          title: "Storage Access",
          desc: "Guardian needs storage access to save ride history, offline maps, and crash incident logs on your device.",
          buttonText: "Allow Storage Access",
          handler: handleStorageGrant
        };
      default: // location
        return {
          icon: <MapPin className="text-cyan-400 dark:text-neon-gold" size={40} />,
          title: "Location Access",
          desc: "Guardian uses your location to track your rides and send precise coordinates to emergency services in case of an accident.",
          buttonText: "Allow Location Access",
          handler: handleLocationGrant
        };
    }
  };

  const content = getPermissionContent();

  return (
    <div className="h-full flex flex-col relative bg-slate-900">
      {/* Map Background Simulation - Always dark for this specific dramatic screen */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center transition-all duration-700" 
        style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,2,0/600x800?access_token=${MAPBOX_TOKEN}')` }}
      />
      
      <div key={permissionStep} className="flex-1 flex flex-col items-center justify-center p-8 z-10 animate-in fade-in zoom-in duration-500">
        <div className="relative mb-10">
          <div className="w-24 h-24 bg-cyan-500/20 dark:bg-neon-gold/20 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border border-cyan-500/50 dark:border-neon-gold/50 animate-ping" />
            {content.icon}
          </div>
        </div>

        <GlassCard className="p-6 text-center w-full max-w-sm border-t-4 border-t-cyan-500 dark:border-t-neon-gold !bg-slate-900/80 !border-white/10 !text-white">
          <h2 className="text-2xl font-bold mb-3 text-white">{content.title}</h2>
          <p className="text-slate-300 mb-6 text-sm leading-relaxed">
            {content.desc}
          </p>
          <div className="flex items-center gap-2 justify-center text-xs text-emerald-400 bg-emerald-900/20 py-2 px-3 rounded-lg mb-6">
            <CheckCircle size={14} />
            <span>Encrypted & Private</span>
          </div>

          <Button onClick={content.handler} fullWidth>{content.buttonText}</Button>
          <button 
            onClick={() => content.handler()} 
            className="mt-4 text-sm text-slate-500 hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </GlassCard>
      </div>
    </div>
  );
};