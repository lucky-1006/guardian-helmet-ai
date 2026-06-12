import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white/90 dark:bg-guardian-surface backdrop-blur-md border border-black/5 dark:border-white/10 rounded-3xl shadow-sm text-slate-900 dark:text-guardian-cream transition-all duration-300 hover:border-black/20 dark:hover:border-white/20 ${className}`}
    >
      {children}
    </div>
  );
};