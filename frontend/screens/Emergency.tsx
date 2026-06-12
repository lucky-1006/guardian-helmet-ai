import React, { useEffect, useState } from 'react';
import { X, PhoneCall, Send } from 'lucide-react';
import { Button } from '../components/Button';

interface EmergencyProps {
  onCancel: () => void;
  countdownStart?: number;
}

export const Emergency: React.FC<EmergencyProps> = ({ onCancel, countdownStart = 10 }) => {
  const [count, setCount] = useState(countdownStart);
  const [alertSent, setAlertSent] = useState(false);

  useEffect(() => {
    if (count > 0 && !alertSent) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 0 && !alertSent) {
      setAlertSent(true);
      // Logic to trigger backend API (Twilio/Email) would go here
    }
  }, [count, alertSent]);

  if (alertSent) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
          <Send size={40} className="text-white ml-1" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Help is on the way</h1>
        <p className="text-slate-400 mb-8">
          Alerts sent to Emergency Contacts & EMS with your GPS coordinates.
        </p>
        
        <div className="bg-slate-900 w-full p-4 rounded-xl border border-slate-800 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">Coordinates</span>
            <span className="text-cyan-400 font-mono">12.9716° N, 77.5946° E</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Status</span>
            <span className="text-emerald-400">Message Delivered</span>
          </div>
        </div>

        <Button onClick={onCancel} variant="secondary" fullWidth>
          Close & Return to Safe Mode
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-red-600 flex flex-col items-center justify-between p-8 text-center animate-pulse-fast">
      <div className="mt-12">
        <div className="inline-block p-4 rounded-full bg-red-800/50 mb-6">
           <PhoneCall size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-2">Accident Detected</h1>
        <p className="text-red-100 text-lg font-medium">Sending SOS alert in...</p>
      </div>

      <div className="relative">
        <div className="text-[120px] font-black text-white leading-none">
          {count}
        </div>
      </div>

      <div className="w-full mb-8">
        <p className="text-red-200 mb-6 text-sm">
          If you are okay, cancel immediately.
        </p>
        <button 
          onClick={onCancel}
          className="w-full bg-white text-red-600 font-bold text-xl py-5 rounded-xl shadow-xl active:scale-95 transition-transform"
        >
          I AM OKAY - CANCEL
        </button>
      </div>
    </div>
  );
};