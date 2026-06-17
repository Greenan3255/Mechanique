import React, { useState } from 'react';
import { ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react';

type NeonAccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  icon?: LucideIcon;
  colorVar?: string; // e.g., 'var(--neon-pink)'
  defaultExpanded?: boolean;
  children: React.ReactNode;
};

export function NeonAccordion({ title, icon: Icon, colorVar = 'var(--color-main)', defaultExpanded = false, children }: NeonAccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-4">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center py-2 px-2 transition-colors hover:bg-white/5"
        style={{ color: colorVar }}
      >
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {Icon && <Icon size={16} className="ml-2 mr-2" />}
        <span className="font-display tracking-wider text-sm ml-2" style={{}}>{title}</span>
      </button>
      <div
        style={{ borderBottom: '2px solid', borderColor: colorVar, opacity: 0.4 }}
      />
      {expanded && (
        <div className="p-2 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}
