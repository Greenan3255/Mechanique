import React from 'react';
import { X } from 'lucide-react';

interface NeonWindowProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function NeonWindow({ title, onClose, children, className = '' }: NeonWindowProps) {
  const isAurora = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'aurora';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isAurora ? 'bg-black/50' : 'bg-black/60 backdrop-blur-sm'}`}>
      <div className={`relative flex flex-col w-full max-w-md overflow-hidden ${className}`}
        style={isAurora ? {
          background: 'rgba(22,14,48,0.95)',
          border: '3px solid #a08040',
        } : {
          background: 'var(--bg-card)',
          border: 'var(--ui-border-width) solid var(--ui-border-color)',
          boxShadow: 'var(--ui-shadow-glow)',
          borderRadius: 'var(--ui-border-radius)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2"
          style={isAurora ? {
            background: 'rgba(16,10,32,0.7)',
            borderBottom: '2px solid #a08040',
          } : {
            background: 'var(--bg-base)',
            borderBottom: 'var(--ui-border-width) solid var(--color-main)',
            boxShadow: 'var(--ui-shadow-glow)',
          }}
        >
          <div className="text-sm font-semibold"
            style={isAurora ? {
              fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif",
              color: '#dfc890',
              letterSpacing: '0.1em',
            } : {
              fontFamily: 'var(--font-body)',
              color: 'var(--text-primary)',
              textShadow: '0 0 8px var(--color-main-glow)',
            }}
          >{title || 'SYSTEM INTERFACE'}</div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 transition-colors rounded"
            style={{ color: isAurora ? '#c9a045' : 'var(--color-main)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
