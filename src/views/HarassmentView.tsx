import React, { useState } from 'react';
import { NeonWindow } from '../components/NeonWindow';
import { NeonButton } from '../components/NeonButton';

const skills = [
  { id: 's1', name: '轻拍头部', cost: '忠诚心 -5', powerBoost: '+10', desc: '带有安抚性质的轻拍，但可能会被认为是职场性骚扰。' },
  { id: 's2', name: '赞美服装', cost: '好感度 +2', powerBoost: '+5', desc: '单纯的赞美，如果语气不对会被当成变态。' }
];

export function HarassmentView() {
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [selectedTarget, setSelectedTarget] = useState<string>('');

  const targets = [
    { id: 'mechanique', name: '梅卡妮可', available: true },
    { id: 'kelpie', name: '凯尔菲', available: false },
    { id: 'suzuki', name: '铃木', available: false },
    { id: 'lovegood', name: '洛夫古德', available: false }
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="font-display text-2xl text-[var(--neon-pink)] tracking-widest uppercase border-b border-[var(--bg-card)] pb-2 flex items-center gap-3">
        <div className="w-2 h-6 bg-[var(--neon-pink)] shadow-[0_0_8px_var(--neon-pink-glow)]"></div>
        性骚扰
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-sm font-display text-[var(--text-secondary)] mb-3">技巧 // SKILLS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map(skill => (
              <button 
                key={skill.id}
                onClick={() => { setSelectedSkill(skill); setSelectedTarget(''); }}
                className={`p-3 border text-left transition-colors flex justify-between items-center
                  ${selectedSkill?.id === skill.id 
                    ? 'border-[var(--neon-pink)] bg-[var(--neon-pink-glow)] text-white shadow-[0_0_8px_var(--neon-pink-glow)]' 
                    : 'border-[var(--bg-card)] bg-[var(--bg-input)] hover:border-[var(--neon-pink)] text-[var(--text-primary)]'}
                `}
              >
                <span>{skill.name}</span>
                <span className="text-xs text-[var(--text-dim)] font-mono">{skill.id.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedSkill && (
        <NeonWindow title="SKILL DETAILS" onClose={() => setSelectedSkill(null)}>
          <div className="space-y-4">
            <h3 className="text-xl font-display text-glow" style={{ color: 'var(--neon-pink)' }}>{selectedSkill.name}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed border-l-2 border-[var(--neon-pink)] pl-3">
              {selectedSkill.desc}
            </p>
            
            <div className="grid grid-cols-2 gap-3 pb-4 border-b border-[var(--bg-card)]">
              <div className="bg-[var(--bg-input)] p-2 rounded">
                <span className="block text-[10px] text-[var(--text-dim)]">消耗</span>
                <span className="text-sm text-[var(--status-danger)]">{selectedSkill.cost}</span>
              </div>
              <div className="bg-[var(--bg-input)] p-2 rounded">
                <span className="block text-[10px] text-[var(--text-dim)]">回复 Power</span>
                <span className="text-sm text-[var(--status-active)]">{selectedSkill.powerBoost}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--bg-card)]">
              <h4 className="text-xs text-[var(--text-secondary)]">目标对象选择</h4>
              <div className="grid grid-cols-2 gap-2">
                {targets.map((target, idx) => {
                  const targetColors = ['var(--neon-pink)', 'var(--neon-blue)', 'var(--neon-purple)', 'var(--neon-amber)'];
                  const tColor = targetColors[idx % 4];
                  return (
                    <button
                      key={target.id}
                      disabled={!target.available}
                      onClick={() => setSelectedTarget(target.id)}
                      className={`text-sm py-2 px-3 border border-transparent rounded transition-colors text-left
                        ${!target.available ? 'opacity-30 cursor-not-allowed text-[var(--text-dim)] grayscale' : 
                        selectedTarget === target.id ? 'bg-white/10' : 'hover:bg-white/5 bg-[var(--bg-input)]'}
                      `}
                      style={target.available ? { color: tColor, borderColor: selectedTarget === target.id ? tColor : 'var(--bg-card)' } : {}}
                    >
                      {target.name}
                    </button>
                  );
                })}
              </div>

              {selectedTarget && (
                <div className="mt-4 flex justify-center">
                  <NeonButton variant="pink" className="w-full h-10 text-sm">开始</NeonButton>
                </div>
              )}
            </div>
          </div>
        </NeonWindow>
      )}
    </div>
  );
}

