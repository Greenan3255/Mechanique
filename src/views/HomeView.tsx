import React, { useState, useEffect, useRef } from 'react';
import { History, Zap, Send, ChevronDown, ChevronUp, Folder, FileText, CircleDollarSign } from 'lucide-react';
import type { GameState, MusicStyle } from '../types';
import { NeonButton } from '../components/NeonButton';
import { NeonAccordion } from '../components/NeonAccordion';
import { NeonWindow } from '../components/NeonWindow';

export function HomeView({ gameState, setGameState }: { gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  const [showMechanique, setShowMechanique] = useState(false);
  const [showCurrentInfo, setShowCurrentInfo] = useState(false);
  const [showRecommended, setShowRecommended] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const isAurora = gameState.theme === 'aurora';
  const auBorder = '2px solid #a08040';
  const auBg = 'rgba(18,12,34,0.5)';
  
  const stories = [
    "[系统提示] 断头台同步完成。检测到时间线发生跳跃。",
    "你睁开眼，水星的霓虹灯光透过百叶窗洒在地板上。空气中弥漫着机油和雨水的气味。",
    "梅卡妮可端着一杯机油合成红茶站在床头，蓝色的显示屏眼瞳微微闪烁着。",
    "「早上好，主人。今天是我们被困在这个循环的第1天。」",
    "你摸了摸头，觉得有些痛。昨天晚上关于宇宙崩溃的记忆依然残留在脑海深处。",
    "在这个名为『断头台』的城市，你必须用你的『魔法音乐』找出引发一切的犯人。"
  ];

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGameState(prev => ({ ...prev, musicStyle: e.target.value as MusicStyle }));
  };

  return (
    <div className="flex flex-col h-full gap-2 max-h-full">
      {/* Status Bar */}
      <div className="flex flex-col gap-2 text-sm font-display tracking-wider pb-3 shrink-0 w-full overflow-hidden"
        style={isAurora ? { borderBottom: auBorder, padding: '10px 14px', background: auBg } : { borderBottom: '1px solid var(--bg-card)/0.5' }}
      >
        {/* Row 1: Status items */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none w-full pb-1">
          <div className="text-[var(--neon-cyan)] whitespace-nowrap" style={isAurora ? {} : {textShadow: '0 0 8px var(--neon-cyan-glow)'}}>
            轮回：{gameState.loopNumber}
          </div>
          <div className="w-[1px] h-4 bg-[var(--line-neon)] opacity-50 shrink-0"></div>
          <div className={`${isAurora ? '' : 'text-glow'} text-[var(--color-main)] whitespace-nowrap`}>
            DAY {gameState.day} · {gameState.timeRemaining}
          </div>
          <div className="w-[1px] h-4 bg-[var(--line-neon)] opacity-50 shrink-0"></div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[var(--neon-purple)]" style={isAurora ? {} : {textShadow: '0 0 8px var(--neon-purple-glow)'}}>曲风:</span>
            {gameState.loopNumber === 1 ? (
              <span className="text-[var(--text-dim)]">--</span>
            ) : (
              <select 
                value={gameState.musicStyle}
                onChange={handleStyleChange}
                className="bg-[var(--bg-input)] border border-[var(--color-main)] text-[var(--color-main)] rounded px-1 outline-none font-body hover:bg-white/5 transition-colors cursor-pointer"
              >
                <option value="none">--</option>
                <option value="hardboiled">硬汉</option>
                <option value="lively">活泼</option>
                <option value="light">轻快</option>
              </select>
            )}
          </div>
          <div className="w-[1px] h-4 bg-[var(--line-neon)] opacity-50 shrink-0"></div>
          <div className="flex items-center gap-1 text-[var(--neon-pink)] whitespace-nowrap" style={isAurora ? {} : {textShadow: '0 0 8px var(--neon-pink-glow)'}}>
            <Zap size={14} className="stroke-[var(--neon-pink)] fill-none" />
            <span className={isAurora ? '' : 'glitch-text-heavy'}>{gameState.power}</span>
            <div className="w-16 h-5 ml-1 opacity-80 shrink-0">
              <svg viewBox="0 0 100 20" className="w-full h-full stroke-[var(--neon-pink)] fill-none overflow-visible" style={isAurora ? { strokeWidth: 1.5 } : { strokeWidth: 1.5, filter: 'drop-shadow(0 0 3px var(--neon-pink-glow))' }}>
                <path d="M0,10 L20,10 L25,5 L30,18 L35,2 L40,15 L45,10 L100,10" className="animate-[dash_2s_linear_infinite]" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="150" strokeDashoffset="150" />
              </svg>
            </div>
          </div>
        </div>

        {/* Row 2: Location and Money */}
        <div className="flex items-center gap-2 text-[var(--text-secondary)] font-body w-full pl-1">
          <div className="flex items-center overflow-hidden shrink min-w-0">
            <span className="text-[var(--neon-green)] mr-2 shrink-0 font-display text-xs uppercase tracking-widest" style={isAurora ? {} : {textShadow: '0 0 8px var(--neon-green-glow)'}}>位置：</span>
            <span className="truncate">{gameState.location}</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--neon-amber)] whitespace-nowrap shrink-0 pr-1">
            <CircleDollarSign size={14} className="stroke-[var(--neon-amber)]" />
            {gameState.money}
          </div>
        </div>
      </div>

      {/* Main Text Box */}
      <div
        className="flex-1 relative pr-2 pl-4 py-4 overflow-x-hidden overflow-y-auto flex flex-col min-h-0"
        style={isAurora ? {
          border: auBorder,
          background: auBg,
        } : {
          borderLeft: 'var(--ui-border-width) solid var(--color-main)',
          background: 'var(--bg-card)',
          borderTopRightRadius: 'var(--ui-border-radius)',
          borderBottomRightRadius: 'var(--ui-border-radius)',
          boxShadow: 'inset 10px 0 20px -10px var(--color-main-glow)',
        }}
      >
        <button className="sticky top-0 float-right p-1.5 text-[var(--text-dim)] hover:text-[var(--color-main)] hover:bg-white/5 rounded transition-colors z-10 flex items-center justify-end gap-1 mb-2 bg-[var(--bg-card)]/80 backdrop-blur w-full text-right shadow-md">
          <History size={16} />
          <span className="text-xs font-display tracking-widest uppercase">Recall</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-body text-sm leading-[1.8] text-[var(--text-primary)]">
          {stories.map((text, idx) => (
            <p key={idx} className={text.startsWith('[') ? 'text-[var(--text-secondary)] text-xs font-mono tracking-wide opacity-80' : ''}>
              {text}
            </p>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Interactive Controls (glued together) */}
      <div className="flex flex-col gap-1 shrink-0 mt-auto">
        {/* Quick Action Buttons */}
        <div className="flex gap-2">
          <NeonButton
            className="flex-1 border-[var(--neon-pink)] text-[var(--neon-pink)] hover:bg-[var(--neon-pink-glow)] hover:text-white"
            style={isAurora ? {} : {boxShadow: '0 0 10px var(--neon-pink-glow)'}}
            onClick={() => setShowMechanique(true)}
          >
            梅卡妮可
          </NeonButton>
          <NeonButton className="flex-1 text-[var(--neon-cyan)] border-[var(--neon-cyan)]" variant="ghost" onClick={() => setShowCurrentInfo(true)}>当前情报</NeonButton>
        </div>

        {/* Recommended Options */}
        <div className="rounded flex flex-col overflow-hidden"
          style={isAurora ? { background: auBg, border: auBorder } : { background: 'var(--bg-input)', border: '1px solid var(--bg-card)' }}
        >
          <button 
            onClick={() => setShowRecommended(!showRecommended)}
            className="w-full flex items-center justify-between p-2 text-[var(--text-secondary)] hover:text-[var(--color-main)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <span className="text-xs font-display tracking-widest uppercase">Suggested Actions</span>
            {showRecommended ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showRecommended && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--bg-card)] p-[1px]">
              <button className="bg-[var(--bg-input)] p-2 text-xs text-left hover:text-[var(--color-main)] transition-colors" onClick={() => setCustomInput("向梅卡妮可询问关于『断头台』的事")}>向梅卡妮可询问关于『断头台』的事</button>
              <button className="bg-[var(--bg-input)] p-2 text-xs text-left hover:text-[var(--color-main)] transition-colors" onClick={() => setCustomInput("去城市广场看看")}>去城市广场看看</button>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="输入你想做的事..."
            className="w-full rounded px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all pr-12 font-body"
            style={isAurora ? {
              background: auBg,
              border: auBorder,
            } : {
              background: 'var(--bg-input)',
              border: '1px solid var(--bg-card)',
            }}
          />
          <button className="absolute right-2 p-1.5 text-[var(--color-main)] hover:bg-[var(--color-main-glow)] hover:text-white rounded transition-colors group">
            <Send size={18} className="translate-y-[1px] group-hover:translate-x-[2px] group-hover:-translate-y-[1px] transition-transform" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {showMechanique && (
        <NeonWindow title="MÉCHANIQUE STATUS" onClose={() => setShowMechanique(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <div className="w-16 h-16 rounded-full border-2 border-[var(--neon-pink)] flex items-center justify-center relative overflow-hidden bg-[var(--bg-deep)]">
                <div className="absolute inset-0 bg-[var(--neon-pink)] opacity-10"></div>
                <span className="font-display font-bold text-2xl text-[var(--neon-pink)]">M</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-glow tracking-wider">梅卡妮可</h3>
                <p className="text-xs text-[var(--text-secondary)] font-mono">ID: MCH-NK-001 // 女仆机器人</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">好感度 (Affection)</span>
                <span className="text-[var(--neon-pink)] font-mono">42%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1a1f2e] rounded overflow-hidden">
                <div className="h-full bg-[var(--neon-pink)] shadow-[0_0_8px_var(--neon-pink-glow)] w-[42%]"></div>
              </div>

              <div className="flex justify-between text-xs mt-3">
                <span className="text-[var(--text-secondary)]">忠诚心 (Loyalty)</span>
                <span className="text-[var(--color-main)] font-mono">88%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1a1f2e] rounded overflow-hidden">
                <div className="h-full bg-[var(--color-main)] shadow-[0_0_8px_var(--color-main-glow)] w-[88%]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="bg-[var(--bg-input)] p-2 rounded border border-[var(--bg-card)]">
                <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider">Maid Power</div>
                <div className="font-mono text-lg text-[var(--text-primary)]">120</div>
              </div>
              <div className="bg-[var(--bg-input)] p-2 rounded border border-[var(--bg-card)]">
                <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider">Knowledge</div>
                <div className="font-mono text-lg text-[var(--text-primary)]">85</div>
              </div>
            </div>

            <div className="border border-[var(--bg-card)] p-3 rounded">
              <div className="text-xs text-[var(--text-secondary)] mb-1">当前服装</div>
              <div className="text-sm">经典黑白女仆装</div>
            </div>

            <div className="mt-4 p-3 border-l-2 border-[var(--neon-pink)] bg-[var(--neon-pink-glow)]/10 italic text-sm text-[var(--text-primary)]">
              <span className="text-[var(--neon-pink)] font-bold mr-1">"</span>
              早上好，主人。如果需要补充水分的话，我随时可以为您倒退役机油。
              <span className="text-[var(--neon-pink)] font-bold ml-1">"</span>
            </div>
          </div>
        </NeonWindow>
      )}

      {showCurrentInfo && (
        <NeonWindow title="CURRENT INTEL" onClose={() => setShowCurrentInfo(false)}>
          <div className="space-y-4 pr-2 pl-1 h-full overflow-y-auto w-[min(380px,90vw)]">
            <NeonAccordion title="核心情报 [置顶]" icon={Zap} colorVar="var(--status-danger)" defaultExpanded>
              <div className="py-2 space-y-2">
                <button className="w-full text-left px-3 py-2 bg-[var(--bg-input)] border border-transparent hover:border-[var(--status-danger)] transition-colors text-sm flex gap-2">
                  <span className="text-[var(--status-danger)]">▸</span> WHO DONE IT: <span className="opacity-50">???</span>
                </button>
                <button className="w-full text-left px-3 py-2 bg-[var(--bg-input)] border border-transparent hover:border-[var(--status-danger)] transition-colors text-sm flex gap-2">
                  <span className="text-[var(--status-danger)]">▸</span> HOW DONE IT: <span className="opacity-50">???</span>
                </button>
                <button className="w-full text-left px-3 py-2 bg-[var(--bg-input)] border border-transparent hover:border-[var(--status-danger)] transition-colors text-sm flex gap-2">
                  <span className="text-[var(--status-danger)]">▸</span> WHY DONE IT: <span className="opacity-50">???</span>
                </button>
              </div>
            </NeonAccordion>

            <NeonAccordion title="世界观情报" icon={Folder} colorVar="var(--color-main)">
              <div className="py-2 grid grid-cols-1 gap-2">
                <button className="text-left px-3 py-2 bg-[var(--bg-input)] border border-transparent hover:border-[var(--color-main)] transition-colors text-sm flex items-center gap-2 group">
                  <FileText size={14} className="text-[var(--color-main)] opacity-70 group-hover:opacity-100" />
                  断头台城 (Guillotine)
                </button>
                <button className="text-left px-3 py-2 bg-[var(--bg-input)] border border-transparent hover:border-[var(--color-main)] transition-colors text-sm flex items-center gap-2 group">
                  <FileText size={14} className="text-[var(--color-main)] opacity-70 group-hover:opacity-100" />
                  时间循环原理
                </button>
                <button className="text-left px-3 py-2 bg-[var(--bg-input)] border border-transparent hover:border-[var(--color-main)] transition-colors text-sm flex items-center gap-2 group">
                  <FileText size={14} className="text-[var(--color-main)] opacity-70 group-hover:opacity-100" />
                  魔法音乐的本质
                </button>
              </div>
            </NeonAccordion>
          </div>
        </NeonWindow>
      )}
    </div>
  );
}

