import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Command } from 'lucide-react';
import { Button } from './Button';

export const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isListening) {
      // Simulate listening
      setTranscript("Listening...");
      timer = setTimeout(() => {
        setTranscript("Command: 'System Check'");
        setTimeout(() => setIsListening(false), 1500);
      }, 2000);
    } else {
      setTranscript('');
    }
    return () => clearTimeout(timer);
  }, [isListening]);

  return (
    <div className={`flex items-center gap-2 transition-all duration-300 ${isListening ? 'flex-grow' : ''}`}>
       <button 
         onClick={() => setIsListening(!isListening)}
         className={`relative flex items-center justify-center w-10 h-10 rounded-2xl border transition-all duration-300 ${
           isListening 
             ? 'bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
             : 'bg-white/50 dark:bg-[#1e1e1e] border-slate-200 dark:border-white/10 text-slate-500 dark:text-guardian-muted hover:text-slate-900 dark:hover:text-white'
         }`}
       >
         {isListening ? <Mic size={18} className="animate-pulse" /> : <MicOff size={18} />}
         
         {/* Ripple Effect */}
         {isListening && (
            <span className="absolute inline-flex h-full w-full rounded-2xl bg-red-400 opacity-75 animate-ping"></span>
         )}
       </button>
       
       {isListening && (
         <div className="hidden sm:flex flex-1 bg-white dark:bg-guardian-deep border border-slate-200 dark:border-guardian-sky/20 h-10 rounded-2xl items-center px-3 animate-in slide-in-from-left-4 fade-in whitespace-nowrap">
           <Command size={14} className="text-slate-500 dark:text-guardian-muted mr-2" />
           <span className="text-xs font-mono text-slate-900 dark:text-guardian-cream truncate max-w-[100px]">
             {transcript}
           </span>
         </div>
       )}
    </div>
  );
};