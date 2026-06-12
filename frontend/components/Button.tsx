import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-cyan-600 dark:to-neon-gold text-white shadow-lg shadow-cyan-500/30 dark:shadow-neon-gold/30 hover:shadow-cyan-500/50 dark:hover:shadow-neon-gold/50",
    secondary: "bg-slate-200 dark:bg-white/10 backdrop-blur-md border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 animate-pulse",
    ghost: "bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
  };

  const sizes = "py-4 px-6 text-lg";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
};