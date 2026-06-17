import React, { useState } from 'react';
import type { GameState } from '../types';
import { NeonAccordion } from '../components/NeonAccordion';
import { NeonWindow } from '../components/NeonWindow';
import { NeonButton } from '../components/NeonButton';
import { Star, ShieldAlert, Cpu } from 'lucide-react';

const mockResidents = {
  special: [
    { id: 'r1', name: '凯尔菲', note: '暴力天才少女', full: '凯尔菲 (Kelpie) // 街头黑客', taskProgress: '2/4', affection: 20 },
    { id: 'r2', name: '铃木', note: '神秘调酒师', full: '铃木 (Suzuki) // "VA-11"酒保', taskProgress: '1/3', affection: 15 },
    { id: 'r3', name: '洛夫古德', note: '古怪商人', full: '洛夫古德 // 走私商人', taskProgress: '0/5', affection: 5 }
  ],
  hardboiled: [
    { id: 'r4', name: '醉汉', note: '整天买醉的人', full: '无名醉汉', taskProgress: '-', affection: 0 },
    { id: 'r5', name: '黑帮猫', note: '喵？', full: '瓦尔特 // 机器猫黑帮头目', taskProgress: '1/1', affection: 50 },
  ],
  lively: [
    { id: 'r6', name: '菜刀兔', note: '有点危险', full: '狂暴兔', taskProgress: '-', affection: 0 },
  ],
  light: [
    { id: 'r7', name: '旅客', note: '迷路的异乡人', full: '迷途旅者', taskProgress: '-', affection: 0 },
  ],
  enemy: [
    { id: 'e1', name: '阴灵黑兔', note: '？？？', full: '未知实体 // 极度危险', taskProgress: '0/1', affection: 0, isEnemy: true }
  ],
  cooperator: [
    { id: 'c1', name: '废道响', note: '情报贩子', full: '废道响 (Haido Hibiki) // 万事屋', taskProgress: 'MAX', affection: 100, isHibiki: true }
  ]
};

export function ResidentsView({ gameState, setGameState }: { gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [showHibikiDialog, setShowHibikiDialog] = useState(false);
  const [showShopDialog, setShowShopDialog] = useState(false);
  const [hibikiTarget, setHibikiTarget] = useState('');
  const [hibikiResult, setHibikiResult] = useState('');
  const [shopItem, setShopItem] = useState<any>(null);

  const runHibikiQuery = () => {
    if (hibikiTarget === '洛夫古德') setHibikiResult('洛夫古德需要 [特制机油红茶]');
    else if (hibikiTarget === '醉汉') setHibikiResult('广场上的醉汉似乎丢了 [破旧的怀表]');
    else setHibikiResult('目前没有关于该对象的情报。');
  };

  const shopItems = [
    { id: 'item1', name: '特制机油红茶', price: 50, desc: '加了点料的红茶，洛夫古德的最爱。' },
    { id: 'item2', name: '便宜的合成酒精', price: 20, desc: '只能用来麻醉大脑的劣质饮品。' }
  ];

  const handleBuy = () => {
    if (shopItem && gameState.money >= shopItem.price) {
      setGameState(s => ({ ...s, money: s.money - shopItem.price }));
      alert('购买成功！');
      setShowShopDialog(false);
      setShopItem(null);
    } else { alert('yeN不足！'); }
  };

  const hibikiDialogue = hibikiResult ? '「就是这样，情报费下次再算。」' : '「想要打听谁的情报？我这里很贵哦。」';

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="font-display text-2xl text-[var(--neon-purple)] tracking-widest uppercase border-b border-[var(--bg-card)] pb-2 flex items-center gap-3">
        <div className="w-2 h-6 bg-[var(--neon-purple)] shadow-[0_0_8px_var(--neon-purple-glow)]"></div>
        居民
      </div>
      <div className="flex-1 overflow-auto pr-2 space-y-2">
        <NeonAccordion title="特殊 (SPECIAL)" colorVar="var(--neon-pink)" defaultExpanded>
          <ResidentGrid residents={mockResidents.special} color="var(--neon-pink)" activeStyle={gameState.musicStyle} styleReq="none" onSelect={setSelectedResident} />
        </NeonAccordion>
        <NeonAccordion title="协力者 (CO-OP)" colorVar="var(--neon-amber)">
          <ResidentGrid residents={mockResidents.cooperator} color="var(--neon-amber)" activeStyle={gameState.musicStyle} styleReq="none" onSelect={setSelectedResident} />
        </NeonAccordion>
        <NeonAccordion title="硬汉 (HARDBOILED)" colorVar="var(--neon-blue)">
          <ResidentGrid residents={mockResidents.hardboiled} color="var(--neon-blue)" activeStyle={gameState.musicStyle} styleReq="hardboiled" onSelect={setSelectedResident} />
        </NeonAccordion>
        <NeonAccordion title="活泼 (LIVELY)" colorVar="var(--neon-purple)">
          <ResidentGrid residents={mockResidents.lively} color="var(--neon-purple)" activeStyle={gameState.musicStyle} styleReq="lively" onSelect={setSelectedResident} />
        </NeonAccordion>
        <NeonAccordion title="轻快 (LIGHT)" colorVar="var(--neon-green)">
          <ResidentGrid residents={mockResidents.light} color="var(--neon-green)" activeStyle={gameState.musicStyle} styleReq="light" onSelect={setSelectedResident} />
        </NeonAccordion>
        <NeonAccordion title="敌人 (ENEMY)" colorVar="var(--status-danger)">
          <ResidentGrid residents={mockResidents.enemy} color="var(--status-danger)" activeStyle={gameState.musicStyle} styleReq="none" onSelect={setSelectedResident} />
        </NeonAccordion>
      </div>

      {selectedResident && (
        <NeonWindow title="RESIDENT DOSSIER" onClose={() => setSelectedResident(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded border-2 flex items-center justify-center font-display text-2xl"
                style={{ borderColor: selectedResident.color, color: selectedResident.color, backgroundColor: `${selectedResident.color}20` }}>
                {selectedResident.isEnemy && !gameState.coreTasksSolved ? '?' : selectedResident.name[0]}
              </div>
              <div>
                <h3 className="font-display font-bold text-xl" style={{ color: selectedResident.color, textShadow: `0 0 8px ${selectedResident.color}80` }}>
                  {selectedResident.isEnemy && !gameState.coreTasksSolved ? '未知实体 (???)' : selectedResident.full}
                </h3>
                {selectedResident.isEnemy && <span className="text-xs bg-[var(--status-danger)] text-white px-1.5 py-0.5 rounded font-mono uppercase">WARNING: HOSTILE</span>}
              </div>
            </div>
            <div className="bg-[var(--bg-input)] p-3 rounded space-y-3 border border-[var(--bg-card)]">
              <div><div className="flex justify-between text-xs mb-1"><span className="text-[var(--text-secondary)]">好感度 (Affection)</span><span className="font-mono">{selectedResident.affection}%</span></div>
                <div className="h-1.5 w-full bg-[var(--bg-deep)] rounded overflow-hidden"><div className="h-full transition-all" style={{ width: `${selectedResident.affection}%`, backgroundColor: selectedResident.color }}></div></div></div>
              <div className="flex justify-between items-center pt-2 border-t border-[var(--bg-deep)]"><span className="text-xs text-[var(--text-secondary)]">任务进度:</span><span className="font-mono text-sm">{selectedResident.taskProgress}</span></div>
            </div>
            <div className="text-sm text-[var(--text-primary)] leading-relaxed italic border-l-2 pl-3" style={{ borderColor: selectedResident.color }}>"{selectedResident.isEnemy && !gameState.coreTasksSolved ? '???' : selectedResident.note}"</div>
            <div className="pt-4 border-t border-[var(--bg-card)] flex flex-wrap gap-3">
              <NeonButton className="flex-1" style={{ borderColor: selectedResident.color, color: selectedResident.color }}>前往所在区域</NeonButton>
              {selectedResident.id === 'r1' && <NeonButton variant="ghost" style={{ borderColor: 'var(--neon-green)', color: 'var(--neon-green)' }} onClick={() => setShowShopDialog(true)}>商店</NeonButton>}
              {selectedResident.isHibiki && <NeonButton variant="pink" onClick={() => setShowHibikiDialog(true)}>请求攻略情报</NeonButton>}
            </div>
          </div>
        </NeonWindow>
      )}

      {showShopDialog && (
        <NeonWindow title="KELPIE'S BLACK MARKET" onClose={() => { setShowShopDialog(false); setShopItem(null); }} className="!max-w-3xl !w-[min(720px,92vw)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 bg-[var(--bg-input)] p-4 rounded-lg border border-[var(--neon-green)] relative">
              <div className="w-12 h-12 rounded-full border border-[var(--neon-green)] flex items-center justify-center font-display text-xl text-[var(--neon-green)] shrink-0 bg-[var(--bg-deep)]">K</div>
              <div className="flex-1 mt-1"><div className="font-bold text-[var(--neon-green)] mb-1">凯尔菲</div><div className="text-sm text-[var(--text-primary)]">{shopItem ? shopItem.desc : "你看什么看？要买东西就快点，别妨碍我干活。"}</div></div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 h-[300px]">
              <div className="flex-1 border border-[var(--bg-card)] bg-[var(--bg-input)] overflow-y-auto w-full">
                {shopItems.map(item => <button key={item.id} onClick={() => setShopItem(item)} className={`w-full text-left p-3 border-b border-[var(--bg-card)] hover:bg-white/5 transition-colors flex justify-between ${shopItem?.id === item.id ? 'bg-[var(--neon-green)]/10 text-[var(--neon-green)]' : 'text-[var(--text-primary)]'}`}><span>{item.name}</span><span className="font-mono">{item.price} yeN</span></button>)}
              </div>
              <div className="flex-1 border border-[var(--bg-card)] bg-[var(--bg-input)] p-4 flex flex-col w-full">
                {shopItem ? (<><h3 className="font-display text-xl mb-4 text-[var(--neon-green)]">{shopItem.name}</h3><div className="text-sm text-[var(--text-secondary)] mb-auto">{shopItem.desc}</div>
                  <div className="border-t border-[var(--bg-card)] pt-4 mt-auto"><div className="flex justify-between items-center mb-4"><span className="text-[var(--text-dim)] text-xs uppercase tracking-wider">Cost</span><span className="font-mono text-xl text-[var(--neon-pink)]">{shopItem.price} yeN</span></div>
                    <NeonButton className="w-full" style={{ borderColor: 'var(--neon-green)', color: 'var(--neon-green)' }} onClick={handleBuy}>购 买</NeonButton></div></>) : (<div className="h-full flex items-center justify-center text-[var(--text-dim)] font-display uppercase tracking-widest text-sm">Select an item</div>)}
              </div>
            </div>
          </div>
        </NeonWindow>
      )}

      {/* ═══════ Haido Hibiki Contrast Panels ═══════ */}
      {showHibikiDialog && (<>
        {gameState.theme === 'aurora' ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowHibikiDialog(false); setHibikiResult(''); setHibikiTarget(''); }}></div>
            <div className="relative w-full max-w-lg overflow-hidden" style={{ background: 'linear-gradient(180deg, #1c1814 0%, #141210 30%, #181512 100%)', boxShadow: '0 0 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(100,80,60,0.15)', border: '1px solid rgba(80,60,40,0.15)' }}>
              <div className="relative px-8 py-5 text-center border-b" style={{ borderColor: 'rgba(120,100,70,0.1)' }}>
                <h3 className="text-[#c4b898] text-lg tracking-[0.5em] font-normal" style={{ fontFamily: `"Noto Serif SC", "STKaiti", "KaiTi", serif` }}>情 报 阁</h3>
                <div className="mt-1.5 text-[10px] text-[#8a7a60] tracking-[0.5em]" style={{ fontFamily: "'Noto Serif SC', serif" }}>—— 废 道 响 ——</div>
              </div>
              <div className="px-8 py-6 space-y-5">
                <div className="relative p-5 border" style={{ background: 'linear-gradient(180deg, #1f1b16 0%, #1c1814 100%)', borderColor: 'rgba(120,100,70,0.12)' }}>
                  <p className="text-sm leading-[2.2] text-[#c4b898]" style={{ fontFamily: `"Noto Serif SC", "STKaiti", "KaiTi", serif` }}><span className="font-bold tracking-[0.2em] text-[#d4c8a8]">响：</span>{hibikiDialogue}</p>
                </div>
                {hibikiResult ? (
                  <div className="p-5 border" style={{ background: 'linear-gradient(180deg, #1f1b16 0%, #1c1814 100%)', borderColor: 'rgba(120,100,70,0.12)' }}>
                    <div className="text-xs text-[#8a7a60] tracking-[0.3em] mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>—— 查 询 结 果 ——</div>
                    <p className="text-sm text-[#c4b898] leading-relaxed" dangerouslySetInnerHTML={{ __html: hibikiResult.replace(/\[(.*?)\]/g, '<strong class="text-[#c08050]">[$1]</strong>') }} style={{ fontFamily: "'Noto Serif SC', serif" }} />
                  </div>
                ) : (
                  <div className="space-y-3"><div className="text-xs text-[#8a7a60] tracking-[0.3em]" style={{ fontFamily: "'Noto Serif SC', serif" }}>—— 查 询 对 象 ——</div>
                    <select className="w-full p-2.5 text-sm focus:outline-none" style={{ fontFamily: "'Noto Serif SC', serif", background: '#1f1b16', color: '#c4b898', border: '1px solid rgba(120,100,70,0.2)' }} value={hibikiTarget} onChange={(e) => setHibikiTarget(e.target.value)}>
                      <option value="">-- 选择居民 --</option><option value="洛夫古德">洛夫古德</option><option value="醉汉">无名醉汉</option><option value="凯尔菲">凯尔菲</option></select></div>
                )}
              </div>
              <div className="px-8 pb-5 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(120,100,70,0.08)' }}>
                <div className="w-8 h-8 border flex items-center justify-center rotate-[8deg] opacity-30" style={{ borderColor: '#8b4040', color: '#8b4040' }}><span className="text-[9px] font-bold leading-tight text-center" style={{ fontFamily: "'Noto Serif SC', serif" }}>废<br/>道<br/>响</span></div>
                {!hibikiResult ? <button className="px-8 py-2 text-sm tracking-[0.2em] disabled:opacity-20" style={{ fontFamily: "'Noto Serif SC', serif", background: 'linear-gradient(180deg, #3a2a1a 0%, #2a1a0a 100%)', color: '#c4b898', border: '1px solid #4a3a2a' }} onClick={runHibikiQuery} disabled={!hibikiTarget}>查 询</button>
                  : <button className="px-8 py-2 text-sm tracking-[0.2em]" style={{ fontFamily: "'Noto Serif SC', serif", background: 'linear-gradient(180deg, #3a2a1a 0%, #2a1a0a 100%)', color: '#c4b898', border: '1px solid #4a3a2a' }} onClick={() => { setShowHibikiDialog(false); setHibikiResult(''); setHibikiTarget(''); }}>确 定</button>}
              </div>
            </div>
          </div>
        ) : gameState.theme === 'iron' ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => { setShowHibikiDialog(false); setHibikiResult(''); setHibikiTarget(''); }}></div>
            <div className="relative w-full max-w-lg overflow-hidden" style={{ background: 'linear-gradient(180deg, #fff5f8 0%, #ffe8f0 40%, #fff0f5 100%)', boxShadow: '0 0 30px rgba(255,150,180,0.3), 0 0 0 3px rgba(255,180,200,0.4)', borderRadius: '16px', border: '3px solid #ffb0c8' }}>
              <div className="absolute top-0 left-0 right-0 h-2" style={{ background: 'linear-gradient(90deg, #ff90b8, #ffc0d8, #ffd0e8, #ffc0d8, #ff90b8)' }} />
              <div className="relative px-6 py-4 text-center">
                <div className="text-[20px] font-bold tracking-[0.15em]" style={{ fontFamily: "'Noto Serif SC', serif", color: '#e04070', textShadow: '0 1px 2px rgba(224,64,112,0.2)' }}>♪ 情 報 屋 さ ん ♪</div>
                <div className="mt-1 flex items-center justify-center gap-2"><span className="text-[#ff90b8] text-xs">♥</span><span className="text-[11px] tracking-[0.3em]" style={{ fontFamily: "'Noto Serif SC', serif", color: '#e08090' }}>—— 废 道 响 ——</span><span className="text-[#ff90b8] text-xs">♥</span></div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="relative p-5" style={{ background: 'linear-gradient(180deg, #fff8fa 0%, #fff0f5 100%)', border: '2px solid #ffc0d8', borderRadius: '14px', boxShadow: '0 2px 12px rgba(255,180,200,0.2)' }}>
                  <div className="absolute -top-3 -right-2 text-[#ffb0c8] text-lg opacity-60">★</div>
                  <p className="text-sm leading-[1.9]" style={{ fontFamily: "'Noto Serif SC', serif", color: '#6a3040' }}><span className="font-bold text-[#e04070]">響ちゃん：</span>{hibikiDialogue}</p>
                </div>
                {hibikiResult ? (
                  <div className="p-5" style={{ background: 'linear-gradient(180deg, #fff8fa 0%, #fff0f5 100%)', border: '2px solid #ffc0d8', borderRadius: '14px' }}>
                    <div className="text-xs tracking-[0.3em] mb-3 flex items-center gap-2" style={{ fontFamily: "'Noto Serif SC', serif", color: '#e08090' }}><span>✦</span> 查询结果 <span>✦</span></div>
                    <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: hibikiResult.replace(/\[(.*?)\]/g, '<strong style="color:#e04070">[$1]</strong>') }} style={{ fontFamily: "'Noto Serif SC', serif", color: '#6a3040' }} />
                  </div>
                ) : (
                  <div className="space-y-3"><div className="text-xs tracking-[0.3em] flex items-center gap-2" style={{ fontFamily: "'Noto Serif SC', serif", color: '#e08090' }}><span>✦</span> 查询对象 <span>✦</span></div>
                    <select className="w-full p-3 text-sm focus:outline-none" style={{ fontFamily: "'Noto Serif SC', serif", background: '#fff8fa', color: '#6a3040', border: '2px solid #ffc0d8', borderRadius: '12px' }} value={hibikiTarget} onChange={(e) => setHibikiTarget(e.target.value)}>
                      <option value="">♥ 选择居民 ♥</option><option value="洛夫古德">洛夫古德</option><option value="醉汉">无名醉汉</option><option value="凯尔菲">凯尔菲</option></select></div>
                )}
              </div>
              <div className="px-6 pb-5 pt-2 flex items-center justify-between" style={{ borderTop: '1px solid #ffd0e0' }}>
                <div className="flex items-center gap-1 opacity-50"><span className="text-[#ff90b8] text-xs">♥</span><span className="text-[#ff90b8] text-xs">♥</span></div>
                {!hibikiResult ? <button className="px-8 py-2.5 text-sm tracking-[0.15em] transition-all duration-300 disabled:opacity-30" style={{ fontFamily: "'Noto Serif SC', serif", background: 'linear-gradient(180deg, #ff90b8 0%, #e06080 100%)', color: 'white', border: 'none', borderRadius: '20px', boxShadow: '0 3px 12px rgba(255,144,184,0.4)' }} onClick={runHibikiQuery} disabled={!hibikiTarget}>查 询 ♪</button>
                  : <button className="px-8 py-2.5 text-sm tracking-[0.15em]" style={{ fontFamily: "'Noto Serif SC', serif", background: 'linear-gradient(180deg, #ff90b8 0%, #e06080 100%)', color: 'white', border: 'none', borderRadius: '20px', boxShadow: '0 3px 12px rgba(255,144,184,0.4)' }} onClick={() => { setShowHibikiDialog(false); setHibikiResult(''); setHibikiTarget(''); }}>确 定 ♪</button>}
              </div>
            </div>
          </div>
        ) : gameState.theme === 'relic' ? (
          /* Stellaris群星面板 — 星图投影+全息UI+深空蓝+外星文字 */
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setShowHibikiDialog(false); setHibikiResult(''); setHibikiTarget(''); }}></div>
            <div className="relative w-full max-w-xl overflow-hidden"
              style={{background:'linear-gradient(180deg,#020818,#0a1030,#020818)',border:'1px solid #2080d0',boxShadow:'0 0 40px rgba(32,128,208,0.2),0 0 80px rgba(32,128,208,0.08)'}}>
              <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{backgroundImage:'radial-gradient(circle at 30% 40%,#40a0ff 0%,transparent 30%),radial-gradient(circle at 70% 60%,#40a0ff 0%,transparent 25%),radial-gradient(1px 1px at 20% 30%,#80c0ff,transparent),radial-gradient(1px 1px at 50% 20%,#80c0ff,transparent),radial-gradient(1px 1px at 80% 70%,#80c0ff,transparent),radial-gradient(1px 1px at 40% 80%,#80c0ff,transparent),radial-gradient(1px 1px at 60% 40%,#80c0ff,transparent)'}}/>
              <style>{`@keyframes starScan{0%{transform:translate(-50%,-50%) scale(0.5) rotate(0deg);opacity:0.4}100%{transform:translate(-50%,-50%) scale(2) rotate(180deg);opacity:0}}`}</style>
              <div className="px-6 py-4 border-b border-[#2080d030] flex items-center gap-3" style={{background:'linear-gradient(180deg,rgba(32,128,208,0.08),transparent)'}}>
                <div className="w-11 h-11 border border-[#40a0ff] flex items-center justify-center shrink-0" style={{background:'rgba(32,128,208,0.1)',boxShadow:'0 0 16px rgba(64,160,255,0.15)'}}><span className="text-[#60c0ff] text-base" style={{fontFamily:'monospace'}}>◇</span></div>
                <div><h3 className="text-[#60c0ff] text-sm tracking-[0.25em]" style={{fontFamily:'monospace',textShadow:'0 0 10px rgba(96,192,255,0.5)'}}>⬡ H A I D O · H I B I K I</h3>
                  <div className="text-[#4090d0] text-[9px] tracking-[0.25em] mt-1 flex items-center gap-2" style={{fontFamily:'monospace'}}><span className="text-[#60c0ff]">⟐</span> GALACTIC_INTEL_NETWORK <span className="text-[#4090d0] text-[7px]">⌬ ⌬ ⌬</span></div></div>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="p-4 border border-[#2080d030] relative overflow-hidden" style={{background:'rgba(32,128,208,0.04)',boxShadow:'inset 0 0 30px rgba(32,128,208,0.06)'}}>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]"><span className="text-6xl" style={{fontFamily:'monospace',color:'#60c0ff'}}>⌬ ⬡ ⟐ ⬢ ◈</span></div>
                  <div className="relative"><div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 bg-[#40a0ff] shadow-[0_0_8px_#40a0ff]"/><span className="text-[#4090d0] text-[9px] tracking-wider" style={{fontFamily:'monospace'}}>HOLOGRAM_FEED // ACTIVE</span></div>
                    <p className="text-sm leading-[2] text-[#80c0e0]" style={{fontFamily:'monospace',textShadow:'0 0 4px rgba(128,192,224,0.2)'}}><span className="text-[#60c0ff] font-bold">{'>>'}</span> {hibikiDialogue}</p></div>
                </div>
                {hibikiResult ? (
                  <div className="p-4 border border-[#2080d030]" style={{background:'rgba(32,128,208,0.04)'}}><div className="text-[#4090d0] text-[9px] tracking-[0.3em] mb-3 flex items-center gap-2" style={{fontFamily:'monospace'}}><span>⌬</span> DATA_STREAM_ANALYZED</div>
                    <p className="text-sm text-[#80c0e0] leading-relaxed" dangerouslySetInnerHTML={{__html:hibikiResult.replace(/\[(.*?)\]/g,'<strong style="color:#60c0ff;text-shadow:0 0 6px #60c0ff">⟐ $1</strong>')}} style={{fontFamily:'monospace',textShadow:'0 0 3px rgba(128,192,224,0.15)'}}/></div>
                ) : (
                  <div className="space-y-3"><div className="text-[#4090d0] text-[9px] tracking-[0.3em] flex items-center gap-2" style={{fontFamily:'monospace'}}><span>⌬</span> SELECT_TARGET_COORDINATES</div>
                    <select className="w-full p-3 text-sm focus:outline-none" style={{fontFamily:'monospace',background:'rgba(4,16,40,0.8)',color:'#80c0e0',border:'1px solid #2080d050'}} value={hibikiTarget} onChange={(e)=>setHibikiTarget(e.target.value)}>
                      <option value="">⌬ SELECT_RESIDENT ⌬</option><option value="洛夫古德">⟐ 洛夫古德</option><option value="醉汉">⟐ 无名醉汉</option><option value="凯尔菲">⟐ 凯尔菲</option></select></div>
                )}
              </div>
              <div className="px-6 pb-5 pt-3 flex items-center justify-between border-t border-[#2080d030]" style={{background:'linear-gradient(0deg,rgba(32,128,208,0.06),transparent)'}}>
                <div className="flex gap-1 items-center"><span className="text-[#2080d0] text-[7px]" style={{fontFamily:'monospace'}}>⌬⌬⌬</span><span className="text-[#4090d0] text-[8px] ml-1" style={{fontFamily:'monospace'}}>SYS::ONLINE</span></div>
                {!hibikiResult ? <button className="px-8 py-2.5 text-sm tracking-[0.2em] transition-all duration-200 disabled:opacity-20 hover:brightness-125" style={{fontFamily:'monospace',background:'rgba(32,128,208,0.15)',color:'#60c0ff',border:'1px solid #40a0ff',boxShadow:'0 0 16px rgba(64,160,255,0.15)'}} onClick={runHibikiQuery} disabled={!hibikiTarget}>⟐ QUERY</button>
                  : <button className="px-8 py-2.5 text-sm tracking-[0.2em] transition-all duration-200 hover:brightness-125" style={{fontFamily:'monospace',background:'rgba(32,128,208,0.15)',color:'#60c0ff',border:'1px solid #40a0ff',boxShadow:'0 0 16px rgba(64,160,255,0.15)'}} onClick={()=>{setShowHibikiDialog(false);setHibikiResult('');setHibikiTarget('');}}>⟐ CONFIRM</button>}
              </div>
            </div>
          </div>
        ) : gameState.theme === 'gear' ? (
          /* 电气时代面板 — LED点阵 + 七段数码管 + 电路板纹 + 荧光绿 */
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setShowHibikiDialog(false); setHibikiResult(''); setHibikiTarget(''); }}></div>
            <div className="relative w-full max-w-lg overflow-hidden"
              style={{background:'#0a0c0a',border:'2px solid #30ff60',boxShadow:'0 0 30px rgba(48,255,96,0.2),0 0 60px rgba(48,255,96,0.08)',fontFamily:'monospace'}}>
              {/* 电路板纹理背景 */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{backgroundImage:'linear-gradient(#30ff60 1px,transparent 1px),linear-gradient(90deg,#30ff60 1px,transparent 1px)',backgroundSize:'20px 20px'}}/>
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{background:'radial-gradient(ellipse at 30% 20%,#30ff60,transparent 50%),radial-gradient(ellipse at 70% 80%,#30ff60,transparent 40%)'}}/>

              {/* 标题栏 — LED点阵 */}
              <div className="px-6 py-4 border-b border-[#30ff6030] flex items-center gap-3"
                style={{background:'linear-gradient(180deg,rgba(48,255,96,0.05),rgba(0,0,0,0))'}}>
                {/* 七段数码管风格图标 */}
                <div className="w-12 h-12 border-2 border-[#30ff60] flex items-center justify-center shrink-0"
                  style={{background:'#0a0c0a',boxShadow:'0 0 12px rgba(48,255,96,0.15),inset 0 0 6px rgba(48,255,96,0.05)'}}>
                  <span className="text-[#30ff60] text-xl font-bold" style={{fontFamily:'monospace',textShadow:'0 0 8px #30ff60'}}>響</span></div>
                <div>
                  <h3 className="text-[#30ff60] text-sm tracking-[0.3em] font-bold"
                    style={{fontFamily:'monospace',textShadow:'0 0 10px rgba(48,255,96,0.5)'}}>
                    废 道 响 · HIBIKI_INTEL
                  </h3>
                  <div className="text-[#20cc40] text-[9px] tracking-[0.2em] mt-1"
                    style={{fontFamily:'monospace'}}>SYS_v4.7 // CIRCUIT_ONLINE</div>
                </div>
              </div>

              {/* 内容区 */}
              <div className="px-6 py-5 space-y-4">
                {/* LED点阵显示区 */}
                <div className="p-4 border border-[#30ff6030]"
                  style={{background:'rgba(48,255,96,0.03)',boxShadow:'inset 0 0 20px rgba(48,255,96,0.04)'}}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-[#30ff60] shadow-[0_0_6px_#30ff60]"/>
                    <span className="text-[#30ff60] text-[10px] tracking-wider" style={{fontFamily:'monospace'}}>DOT_MATRIX_OUTPUT</span>
                  </div>
                  <p className="text-sm leading-[2] text-[#30ff60]"
                    style={{fontFamily:'monospace',textShadow:'0 0 4px rgba(48,255,96,0.3)'}}>
                    <span className="text-[#40ff70] font-bold">{'>'}</span> {hibikiDialogue}
                  </p>
                </div>

                {hibikiResult ? (
                  <div className="p-4 border border-[#30ff6030]"
                    style={{background:'rgba(48,255,96,0.03)'}}>
                    <div className="text-[#20cc40] text-[10px] tracking-[0.3em] mb-3"
                      style={{fontFamily:'monospace'}}>[RESULT_BUFFER]</div>
                    <p className="text-sm text-[#30ff60] leading-relaxed"
                      dangerouslySetInnerHTML={{__html:hibikiResult.replace(/\[(.*?)\]/g,'<strong style="color:#40ff70;text-shadow:0 0 6px #40ff70">[$1]</strong>')}}
                      style={{fontFamily:'monospace',textShadow:'0 0 3px rgba(48,255,96,0.2)'}}/>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-[#20cc40] text-[10px] tracking-[0.3em]"
                      style={{fontFamily:'monospace'}}>[SELECT_TARGET]</div>
                    <select className="w-full p-3 text-sm focus:outline-none"
                      style={{fontFamily:'monospace',background:'#0a0c0a',color:'#30ff60',border:'1px solid #30ff6050'}}
                      value={hibikiTarget} onChange={(e)=>setHibikiTarget(e.target.value)}>
                      <option value="">{'>>'} SELECT_RESIDENT {'<<'}</option>
                      <option value="洛夫古德">洛夫古德</option><option value="醉汉">无名醉汉</option><option value="凯尔菲">凯尔菲</option></select>
                  </div>
                )}
              </div>

              {/* 底部 — 七段数码管按钮 */}
              <div className="px-6 pb-5 pt-3 flex items-center justify-between border-t border-[#30ff6030]">
                <div className="flex gap-1">
                  {Array(6).fill(0).map((_,i)=><div key={i} className="w-2 h-4 bg-[#30ff6020] border border-[#30ff6040]"/>)}
                </div>
                {!hibikiResult ? (
                  <button className="px-8 py-2.5 text-sm tracking-[0.2em] transition-all duration-200 disabled:opacity-20 hover:brightness-125"
                    style={{fontFamily:'monospace',background:'#0a0c0a',color:'#30ff60',border:'2px solid #30ff60',boxShadow:'0 0 12px rgba(48,255,96,0.2)'}}
                    onClick={runHibikiQuery} disabled={!hibikiTarget}>[ EXECUTE ]</button>
                ) : (
                  <button className="px-8 py-2.5 text-sm tracking-[0.2em] transition-all duration-200 hover:brightness-125"
                    style={{fontFamily:'monospace',background:'#0a0c0a',color:'#30ff60',border:'2px solid #30ff60',boxShadow:'0 0 12px rgba(48,255,96,0.2)'}}
                    onClick={()=>{setShowHibikiDialog(false);setHibikiResult('');setHibikiTarget('');}}>[ CONFIRM ]</button>
                )}
              </div>
            </div>
          </div>
        ) : gameState.theme === 'pixel' ? (
          /* BG3 高清面板 */
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => { setShowHibikiDialog(false); setHibikiResult(''); setHibikiTarget(''); }}></div>
            <div className="relative w-full max-w-xl overflow-hidden" style={{background:'linear-gradient(180deg,#1a1620,#141018)',border:'1px solid #6a6040',boxShadow:'0 0 60px rgba(0,0,0,0.8),0 0 120px rgba(180,150,80,0.15),0 0 0 1px rgba(200,170,100,0.2)'}}>
              <div className="h-1" style={{background:'linear-gradient(90deg,#8a7040,#c0a060,#d4b870,#c0a060,#8a7040)'}}/>
              <div className="px-6 py-4 flex items-center gap-4 border-b border-[#2a2520]" style={{background:'linear-gradient(180deg,rgba(30,24,20,0.9),rgba(20,16,14,0.95))'}}>
                <div className="w-11 h-11 rounded border-2 border-[#c0a060] flex items-center justify-center shrink-0" style={{background:'radial-gradient(circle at 50% 40%,rgba(200,160,96,0.2),transparent 70%)',boxShadow:'0 0 20px rgba(200,160,96,0.15)'}}>
                  <span className="text-base" style={{fontFamily:"'Times New Roman',serif",color:'#d4b870'}}>响</span></div>
                <div><h3 className="text-[#d4b870] text-sm tracking-[0.2em] font-bold" style={{fontFamily:"'Times New Roman','Noto Serif SC',serif",textShadow:'0 1px 4px rgba(0,0,0,0.5)'}}>废 道 响</h3>
                  <div className="text-[10px] text-[#8a7a60] tracking-[0.25em] uppercase" style={{fontFamily:"'Times New Roman',serif"}}>Intelligence Network · est. 2087</div></div>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="relative h-20 rounded overflow-hidden" style={{background:'linear-gradient(180deg,#1c1810,#0e0c08 60%,#1a1610)',border:'1px solid #3a3028',boxShadow:'inset 0 0 40px rgba(0,0,0,0.4)'}}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-15"><span className="text-3xl" style={{fontFamily:"'Times New Roman',serif",color:'#c0a060'}}>⛭</span></div>
                  <div className="absolute bottom-2 left-3 text-[#d4c8a0] text-xs tracking-wider" style={{fontFamily:"'Times New Roman',serif"}}><span className="text-[#c0a060]">◆</span> 情报查询</div>
                </div>
                <div className="p-4 relative" style={{background:'linear-gradient(180deg,rgba(30,24,18,0.8),rgba(20,14,10,0.9))',border:'1px solid #3a3028',boxShadow:'0 4px 20px rgba(0,0,0,0.3)'}}>
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#8a7040] opacity-60"/><div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#8a7040] opacity-60"/>
                  <p className="text-sm leading-[2] text-[#c8c0b0]" style={{fontFamily:"'Times New Roman','Noto Serif SC',serif"}}><span className="font-bold text-[#d4b870] tracking-wider">响：</span> {hibikiDialogue}</p>
                </div>
                {hibikiResult ? (
                  <div className="p-4" style={{background:'linear-gradient(180deg,rgba(30,24,18,0.8),rgba(20,14,10,0.9))',border:'1px solid #3a3028'}}>
                    <div className="text-xs text-[#8a7a60] tracking-[0.3em] mb-3" style={{fontFamily:"'Times New Roman',serif"}}>—— 查询结果 ——</div>
                    <p className="text-sm text-[#c8c0b0] leading-relaxed" dangerouslySetInnerHTML={{__html:hibikiResult.replace(/\[(.*?)\]/g,'<strong style="color:#d4b870">[$1]</strong>')}} style={{fontFamily:"'Times New Roman','Noto Serif SC',serif"}}/></div>
                ) : (
                  <div className="space-y-3"><div className="text-xs text-[#8a7a60] tracking-[0.3em]" style={{fontFamily:"'Times New Roman',serif"}}>—— 查询对象 ——</div>
                    <select className="w-full p-3 text-sm focus:outline-none" style={{fontFamily:"'Times New Roman',serif",background:'#1c1810',color:'#c8c0b0',border:'1px solid #3a3028'}} value={hibikiTarget} onChange={(e)=>setHibikiTarget(e.target.value)}>
                      <option value="">· 选择居民 ·</option><option value="洛夫古德">洛夫古德</option><option value="醉汉">无名醉汉</option><option value="凯尔菲">凯尔菲</option></select></div>
                )}
              </div>
              <div className="px-6 pb-5 pt-3 flex items-center justify-between border-t border-[#2a2520]" style={{background:'linear-gradient(0deg,rgba(10,8,6,0.5),transparent)'}}>
                <div className="flex items-center gap-2 text-[#8a7a60] text-xs" style={{fontFamily:"'Times New Roman',serif"}}><span className="text-[#c0a060]">◆</span> [SPACE] 继续</div>
                {!hibikiResult ? <button className="px-7 py-2.5 text-sm tracking-[0.15em] transition-all duration-300 disabled:opacity-30" style={{fontFamily:"'Times New Roman',serif",background:'linear-gradient(180deg,#8a7040,#5a4828)',color:'#f0e0c0',border:'1px solid #c0a060',boxShadow:'0 2px 8px rgba(0,0,0,0.4)'}} onClick={runHibikiQuery} disabled={!hibikiTarget}>查 询</button>
                  : <button className="px-7 py-2.5 text-sm tracking-[0.15em]" style={{fontFamily:"'Times New Roman',serif",background:'linear-gradient(180deg,#8a7040,#5a4828)',color:'#f0e0c0',border:'1px solid #c0a060',boxShadow:'0 2px 8px rgba(0,0,0,0.4)'}} onClick={()=>{setShowHibikiDialog(false);setHibikiResult('');setHibikiTarget('');}}>确 定</button>}
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => { setShowHibikiDialog(false); setHibikiResult(''); setHibikiTarget(''); }}></div>
            <div className="relative w-full max-w-lg bg-[#ECE9D8] border-[#0055EA] border-t-[30px] rounded-t-lg shadow-[2px_2px_10px_rgba(0,0,0,0.5)] overflow-hidden text-black font-sans">
              <div className="absolute top-[-26px] left-2 text-white font-bold text-sm tracking-wide flex items-center select-none"><span className="mr-2">情报贩子.exe</span></div>
              <button className="absolute top-[-24px] right-1 w-5 h-5 bg-[#E81123] border border-white/40 rounded flex items-center justify-center text-white hover:bg-[#F05561] font-bold text-sm" onClick={() => { setShowHibikiDialog(false); setHibikiResult(''); setHibikiTarget(''); }}>×</button>
              <div className="bg-white border border-[#ACA899] m-2">
                <div className="p-3 bg-[#FFFFE1] border-b border-gray-300 text-sm"><strong>响：</strong> {hibikiDialogue}</div>
                <div className="p-4 flex gap-4"><div className="text-4xl shrink-0">🗂️</div><div className="text-sm leading-relaxed w-full">
                  {hibikiResult ? (<div><p className="mb-2 font-bold text-[#0055ea]">查询结果:</p><p dangerouslySetInnerHTML={{ __html: hibikiResult.replace(/\[(.*?)\]/g, '<strong>[$1]</strong>') }}></p></div>)
                  : (<div><p className="mb-2 font-bold">请选择要查询的居民：</p><select className="w-full p-1 border border-gray-400 mb-2 focus:outline-none focus:border-[#0055ea]" value={hibikiTarget} onChange={(e) => setHibikiTarget(e.target.value)}><option value="">-- 选择居民 --</option><option value="洛夫古德">洛夫古德</option><option value="醉汉">无名醉汉</option><option value="凯尔菲">凯尔菲</option></select></div>)}
                </div></div>
              </div>
              <div className="bg-[#ECE9D8] py-2 px-4 flex justify-end gap-2 border-t border-[#ACA899]">
                {!hibikiResult ? <button className="px-6 py-1 border border-[#0055ea] bg-gray-100 hover:bg-[#0055ea] hover:text-white rounded shadow-sm text-sm" onClick={runHibikiQuery} disabled={!hibikiTarget}>查询 (Q)</button>
                : <button className="px-6 py-1 border border-gray-400 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded shadow-sm text-sm" onClick={() => { setShowHibikiDialog(false); setHibikiResult(''); setHibikiTarget(''); }}>确定 (O)</button>}
              </div>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}

function ResidentGrid({ residents, color, activeStyle, styleReq, onSelect }: any) {
  const isMatch = styleReq === 'none' || activeStyle === styleReq;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {residents.map((r: any) => (
        <button key={r.id} onClick={() => onSelect({ ...r, color })} disabled={!isMatch}
          className={`flex items-center gap-3 p-2 bg-[var(--bg-input)] border transition-all text-left ${isMatch ? 'border-[var(--bg-card)] hover:bg-white/5 opacity-100' : 'border-transparent opacity-50 grayscale cursor-not-allowed'}`}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold shrink-0 border"
            style={{ backgroundColor: isMatch ? `${color}20` : 'transparent', color: isMatch ? color : 'var(--text-dim)', borderColor: isMatch ? color : 'var(--bg-card)' }}>{r.name[0]}</div>
          <div className="overflow-hidden"><div className={`text-sm truncate ${isMatch ? 'text-[var(--text-primary)]' : 'text-[var(--text-dim)]'}`}>{r.name}</div><div className="text-[10px] text-[var(--text-secondary)] truncate">{r.note}</div></div>
        </button>
      ))}
    </div>
  );
}
