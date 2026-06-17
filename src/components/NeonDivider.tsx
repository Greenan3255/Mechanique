import React from 'react';

export function NeonDivider({ animated = false, className = '' }: { animated?: boolean, className?: string }) {
  return (
    <div className={`w-full ${animated ? 'neon-divider-animated' : 'neon-divider'} ${className}`} />
  );
}
