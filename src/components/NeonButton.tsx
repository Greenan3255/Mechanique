import React from 'react';

type NeonButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'main' | 'ghost' | 'pink';
  active?: boolean;
};

export function NeonButton({ children, variant = 'main', active, className = '', ...props }: NeonButtonProps) {
  let baseClass = 'px-4 py-2 font-display text-sm uppercase tracking-wider transition-all duration-300 relative border-[length:var(--ui-border-width)] rounded-[var(--ui-border-radius)] ';
  
  if (variant === 'main') {
    baseClass += 'text-[var(--color-main)] border-[var(--color-main)] hover:bg-[var(--color-main-glow)] hover:text-[var(--bg-deep)] hover:text-shadow-glow ';
    if (active) baseClass += 'bg-[var(--color-main-glow)] text-[var(--bg-deep)] shadow-[0_0_10px_var(--color-main-glow)] ';
  } else if (variant === 'ghost') {
    baseClass += 'text-[var(--text-secondary)] border-[var(--bg-card)] hover:text-[var(--color-main)] hover:border-[var(--color-main)] ';
    if (active) baseClass += 'text-[var(--color-main)] border-[var(--color-main)] ';
  } else if (variant === 'pink') {
    baseClass += 'text-[var(--neon-pink)] border-[var(--neon-pink)] hover:bg-[var(--neon-pink-glow)] hover:text-[var(--bg-deep)] ';
    if (active) baseClass += 'bg-[var(--neon-pink-glow)] text-[var(--bg-deep)] shadow-[0_0_10px_var(--neon-pink-glow)] ';
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
