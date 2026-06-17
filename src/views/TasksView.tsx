import React, { useState } from 'react';
import { NeonAccordion } from '../components/NeonAccordion';
import { NeonWindow } from '../components/NeonWindow';
import { NeonButton } from '../components/NeonButton';
import { HelpCircle, Target, Users } from 'lucide-react';

export function TasksView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [inputs, setInputs] = useState(['', '', '', '']);

  const coreTasks = [
    { id: 't1', title: 'Why done it', type: 'intel', status: 'locked', category: '主要任务', color: 'var(--neon-amber)', desc: '？？？', target: '真相' },
    { id: 't2', title: 'Who done it', type: 'intel', status: 'locked', category: '主要任务', color: 'var(--neon-blue)', desc: '？？？', target: '犯人' },
    { id: 't3', title: 'How done it', type: 'intel', status: 'locked', category: '主要任务', color: 'var(--neon-pink)', desc: '？？？', target: '手法' }
  ];

  const specialTasks = [
    { id: 'st1', title: '演奏：迷失者的方向标', type: 'play', target: '迷途旅者', color: 'var(--color-main)', desc: '那个旅客在街角瑟瑟发抖。他似乎需要一首特定的曲子来获得勇气。' }
  ];

  const normalTasks = [
    { id: 'nt1', title: '交货：危险饮品', type: 'item', target: '洛夫古德', color: 'var(--text-secondary)', desc: '洛夫古德需要他的特制机油红茶。' }
  ];

  const handleInput = (index: number, val: string) => {
    if (!/^[1-4]?$/.test(val)) return;
    const newInputs = [...inputs];
    newInputs[index] = val;
    setInputs(newInputs);
  };
  
  const fillNextEmpty = (val: string) => {
    const nextIdx = inputs.findIndex(i => i === '');
    if (nextIdx !== -1) {
      handleInput(nextIdx, val);
    } else {
      setInputs([val, '', '', '']);
    }
  };
  
  const clearLast = () => {
    for (let i = inputs.length - 1; i >= 0; i--) {
      if (inputs[i] !== '') {
        handleInput(i, '');
        break;
      }
    }
  };

  const cost = inputs.reduce((acc, curr) => acc + (curr ? parseInt(curr) : 0), 0);
  const isMatch = cost === 10 && inputs.every(i => i !== '');

  if (isPlaying) {
    return (
      <div className="flex flex-col h-full items-center justify-center relative">
        <div className="absolute inset-0 bg-[var(--bg-deep)] z-0"></div>
        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>

        <div className="z-10 w-full max-w-sm space-y-8 p-6 bg-[var(--bg-base)] border-neon rounded hologram-container shadow-2xl">
          <div className="hologram-sweep"></div>
          
          <div className="text-center h-8">
            {isMatch ? (
              <h2 className="font-display text-2xl text-shadow-glow tracking-widest text-[var(--color-main)] glitch-text">暖阳之下</h2>
            ) : (
              <h2 className="font-display text-2xl text-[var(--text-dim)] tracking-widest uppercase">WAITING FOR INPUT...</h2>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {inputs.map((val, idx) => (
              <div
                key={idx}
                className="w-16 h-20 bg-[var(--bg-input)] border-2 border-[var(--bg-card)] rounded-lg flex items-center justify-center font-display text-3xl text-white transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                style={val ? { borderColor: 'var(--color-main)', boxShadow: '0 0 10px var(--color-main-glow)' } : {}}
              >
                {val}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => fillNextEmpty(num.toString())}
                className="h-12 bg-white/5 hover:bg-[var(--color-main-glow)] border border-[var(--bg-card)] hover:border-[var(--color-main)] rounded font-display text-xl text-[var(--text-primary)] hover:text-white transition-colors"
              >
                {num}
              </button>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button onClick={clearLast} className="text-xs text-[var(--text-dim)] hover:text-[var(--status-danger)] hover:underline uppercase font-mono">BACKSPACE</button>
          </div>

          <div className="text-center font-mono text-sm text-[var(--text-secondary)]">
            TOTAL COST: <span className={cost > 0 ? 'text-[var(--neon-pink)] font-bold text-lg' : ''}>{cost}</span>
          </div>

          <div className={`p-4 border border-[var(--bg-card)] rounded transition-opacity ${isMatch ? 'opacity-100' : 'opacity-0'}`}>
             <div className="text-xs text-[var(--color-main)] uppercase tracking-wider mb-2">曲风: 轻快</div>
             <div className="text-sm">能让人联想到水星表面并不存在的温暖阳光。适合让迷失的旅客放松下来。</div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-[var(--bg-card)]">
            <NeonButton variant="ghost" className="flex-1" onClick={() => setIsPlaying(false)}>取消</NeonButton>
            <NeonButton className="flex-2" disabled={!isMatch}>开始演奏 {isMatch ? '♪' : ''}</NeonButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="font-display text-2xl text-[var(--neon-blue)] tracking-widest uppercase border-b border-[var(--bg-card)] pb-2 flex items-center gap-3">
        <div className="w-2 h-6 bg-[var(--neon-blue)] shadow-[0_0_8px_var(--neon-blue-glow)]"></div>
        任务
      </div>

      <div className="space-y-4">
        {/* Core Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coreTasks.map(task => (
            <button 
              key={task.id} 
              onClick={() => setSelectedTask(task)}
              className="p-4 bg-[var(--bg-input)] border rounded relative overflow-hidden text-left hover:bg-white/5 transition-colors group" 
              style={{ borderColor: task.color }}
            >
              <div className="absolute top-0 right-0 w-8 h-8 opacity-10 flex items-center justify-center">
                <HelpCircle size={40} color={task.color} />
              </div>
              <h3 className="font-display font-bold text-sm tracking-widest mb-1 group-hover:text-glow transition-all" style={{ color: task.color }}>{task.title}</h3>
              <p className="text-xs text-[var(--text-dim)] font-mono mb-3">STATUS: L<span className="opacity-50">O</span>CKED</p>
              <div className="text-xl text-[var(--text-secondary)] tracking-widest">
                {task.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Resident Tasks */}
        <NeonAccordion title="特殊任务" icon={Users} colorVar="var(--neon-pink)" defaultExpanded>
          <div className="space-y-3">
            {specialTasks.map(task => (
              <button 
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="w-full text-left p-3 bg-[var(--bg-input)] border border-transparent hover:border-[var(--neon-pink)] group transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm text-[var(--text-primary)] flex items-center gap-2">
                    <span className="text-[var(--neon-pink)] group-hover:text-shadow-glow">▸</span> 
                    {task.title}
                  </div>
                  <div className="text-[10px] px-1.5 py-0.5 border border-[var(--color-main)] text-[var(--color-main)] rounded">
                     道具/情报
                  </div>
                </div>
                <div className="text-xs text-[var(--text-dim)] ml-4">对象: {task.target}</div>
              </button>
            ))}
          </div>
        </NeonAccordion>

        <NeonAccordion title="日常任务" icon={Target} colorVar="var(--color-main)">
          <div className="space-y-3">
            {normalTasks.map(task => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="w-full text-left p-3 bg-[var(--bg-input)] border border-transparent hover:border-[var(--color-main)] group transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm text-[var(--text-primary)] flex items-center gap-2">
                    <span className="text-[var(--color-main)] group-hover:text-shadow-glow">▸</span> 
                    {task.title}
                  </div>
                  <div className="text-[10px] px-1.5 py-0.5 border border-[var(--text-secondary)] text-[var(--text-secondary)] rounded">
                     物品交付
                  </div>
                </div>
                <div className="text-xs text-[var(--text-dim)] ml-4">对象: {task.target}</div>
              </button>
            ))}
          </div>
        </NeonAccordion>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <NeonWindow title="TASK DETAILS" onClose={() => setSelectedTask(null)} className="!max-w-md">
          <div className="space-y-4">
            <h3 className="font-display text-xl mb-4" style={{ color: selectedTask.color || 'var(--text-primary)' }}>
              {selectedTask.title}
            </h3>
            <div className="bg-[var(--bg-input)] p-3 rounded text-sm text-[var(--text-secondary)] border border-[var(--bg-card)]">
              {selectedTask.desc}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 border border-[var(--bg-card)]">
                <span className="text-[var(--text-dim)] block mb-1">TARGET</span>
                <span className="text-[var(--text-primary)]">{selectedTask.target}</span>
              </div>
              <div className="p-2 border border-[var(--bg-card)]">
                <span className="text-[var(--text-dim)] block mb-1">TYPE</span>
                <span className="text-[var(--text-primary)] uppercase">{selectedTask.type}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--bg-card)]">
              {selectedTask.type === 'play' && (
                <NeonButton 
                  className="w-full" 
                  onClick={() => { setSelectedTask(null); setIsPlaying(true); }}
                >
                  开始演奏
                </NeonButton>
              )}
              {selectedTask.type === 'item' && (
                <NeonButton className="w-full">交付物品</NeonButton>
              )}
              {selectedTask.type === 'intel' && (
                <NeonButton className="w-full">交付情报</NeonButton>
              )}
            </div>
          </div>
        </NeonWindow>
      )}
    </div>
  );
}

