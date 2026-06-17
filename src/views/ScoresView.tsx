import React, { useState } from 'react';
import { NeonWindow } from '../components/NeonWindow';
import { Music, PlayCircle } from 'lucide-react';

const scores = [
  { id: 's1', name: '暖阳之下', style: '轻快', cost: 10, color: 'var(--neon-green)', desc: '能让人联想到水星表面并不存在的温暖阳光。适合让迷失的旅客放松下来。' },
  { id: 's2', name: '午夜枪击', style: '硬汉', cost: 14, color: 'var(--neon-blue)', desc: '节奏凌厉的电子乐，充满街头的肃杀气息。可能会吸引危险分子。' },
  { id: 's3', name: '兔子舞曲', style: '活泼', cost: 8, color: 'var(--neon-purple)', desc: '非常欢快的合成器律动。' }
];

export function ScoresView() {
  const [selectedScore, setSelectedScore] = useState<any>(null);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="font-display text-2xl text-[var(--color-main)] tracking-widest uppercase border-b border-[var(--bg-card)] pb-2 flex items-center gap-3">
        <div className="w-2 h-6 bg-[var(--color-main)] shadow-[0_0_8px_var(--color-main-glow)]"></div>
        乐谱
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {scores.map(score => (
          <button
            key={score.id}
            onClick={() => setSelectedScore(score)}
            className="w-full p-4 bg-[var(--bg-input)] border hover:bg-white/5 transition-all text-left flex items-center justify-between group"
            style={{ borderColor: 'var(--bg-card)' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = score.color}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--bg-card)'}
          >
            <div className="flex items-center gap-3">
              <Music size={18} className="text-[var(--text-dim)] group-hover:text-white transition-colors" />
              <span className="text-[var(--text-primary)] group-hover:text-shadow-glow font-bold" style={{ '--tw-shadow-color': score.color } as React.CSSProperties}>{score.name}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs px-2 py-0.5 rounded border opacity-80" style={{ borderColor: score.color, color: score.color }}>
                {score.style}
              </span>
              <span className="font-mono text-lg text-[var(--neon-pink)] w-8 text-right font-bold w-10">
                {score.cost}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedScore && (
        <NeonWindow title="SCORE DATA" onClose={() => setSelectedScore(null)}>
          <div className="flex flex-col items-center">
            {/* Huge Cost Number */}
            <div className="py-8 relative w-full flex justify-center border-b border-[var(--bg-card)] mb-4">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-[40px] opacity-20" style={{ backgroundColor: selectedScore.color }}></div>
              <span className="font-display text-8xl font-bold tracking-tighter" style={{ color: selectedScore.color, textShadow: `0 0 20px ${selectedScore.color}` }}>
                {selectedScore.cost}
              </span>
            </div>

            <div className="w-full space-y-4 text-left">
              <div>
                <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-1">Track Name</div>
                <div className="text-xl font-bold text-[var(--text-primary)]">{selectedScore.name}</div>
              </div>
              
              <div>
                <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-1">Genre / Style</div>
                <div className="text-sm" style={{ color: selectedScore.color }}>{selectedScore.style}</div>
              </div>

              <div>
                <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-1">Description</div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-input)] p-3 rounded border border-[var(--bg-card)]">
                  {selectedScore.desc}
                </p>
              </div>
            </div>
          </div>
        </NeonWindow>
      )}
    </div>
  );
}

