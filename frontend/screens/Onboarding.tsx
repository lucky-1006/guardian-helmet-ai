import React, { useState } from 'react';
import { Shield, Zap, Cpu, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { ONBOARDING_STEPS } from '../constants';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const CurrentIcon = () => {
    const iconName = ONBOARDING_STEPS[step].icon;
    const props = { size: 64, className: "text-slate-900 dark:text-white mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" };
    if (iconName === 'Shield') return <Shield {...props} />;
    if (iconName === 'Cpu') return <Cpu {...props} />;
    return <Zap {...props} />;
  };

  return (
    <div className="h-full flex flex-col justify-between p-8 relative overflow-hidden bg-slate-50 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-neutral-900 dark:via-black dark:to-black transition-colors duration-500">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      
      <div className="flex-1 flex flex-col justify-center items-center text-center z-10 mt-12">
        <div className="mb-8 p-8 bg-white dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-sm transition-all duration-500 transform hover:scale-105">
          <CurrentIcon />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-200 dark:to-neon-gold">
          {ONBOARDING_STEPS[step].title}
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-xs">
          {ONBOARDING_STEPS[step].desc}
        </p>
      </div>

      <div className="z-10 w-full mb-8">
        <div className="flex justify-center mb-8 gap-2">
          {ONBOARDING_STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-cyan-500 dark:bg-neon-gold' : 'w-2 bg-slate-300 dark:bg-slate-700'}`} 
            />
          ))}
        </div>
        
        <Button onClick={nextStep} fullWidth>
          {step === ONBOARDING_STEPS.length - 1 ? "Start Safe Riding" : "Next"}
          {step !== ONBOARDING_STEPS.length - 1 && <ChevronRight size={20} />}
        </Button>
      </div>
    </div>
  );
};