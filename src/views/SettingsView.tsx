import React, { useEffect, useRef } from 'react';
import type { GameState } from '../types';

export function SettingsView({ gameState, setGameState }: { gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  const isAurora = gameState.theme === 'aurora';

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="font-display text-2xl text-[var(--color-main)] tracking-widest uppercase border-b border-[var(--bg-card)] pb-2 flex items-center gap-3">
        <div className="w-2 h-6 bg-[var(--color-main)] shadow-[0_0_8px_var(--color-main-glow)]"></div>
        系统设置
      </div>

      <div className="space-y-8 flex-1 overflow-auto pr-2">
        <section>
          <h3 className="text-sm font-display text-[var(--text-secondary)] mb-4">UI 主题 // THEME</h3>
          <div className="grid grid-cols-3 gap-4">
            <Nameplate label="霓 虹 暗 码" subtitle="NEON CIPHER"
              active={gameState.theme === 'cyberpunk'}
              onClick={() => setGameState(s => ({ ...s, theme: 'cyberpunk' }))}
              theme="cyberpunk" />

            <Nameplate label="光 耀 晨 曦" subtitle="RADIANT DAWN"
              active={gameState.theme === 'aurora'}
              onClick={() => setGameState(s => ({ ...s, theme: 'aurora' }))}
              theme="aurora" />

            <Nameplate label="赤 色 机 兵" subtitle="CRIMSON MECHA"
              active={gameState.theme === 'iron'}
              onClick={() => setGameState(s => ({ ...s, theme: 'iron' }))}
              theme="iron" />

            <Nameplate label="勇 者 像 素" subtitle="HERO'S PIXEL"
              active={gameState.theme === 'pixel'}
              onClick={() => setGameState(s => ({ ...s, theme: 'pixel' }))}
              theme="pixel" />

            <Nameplate label="黄 铜 发 条" subtitle="BRASS CLOCKWORK"
              active={gameState.theme === 'gear'}
              onClick={() => setGameState(s => ({ ...s, theme: 'gear' }))}
              theme="gear" />
            <Nameplate label="圣 骸 遗 刻" subtitle="SACRED RELIC"
              active={gameState.theme === 'relic'}
              onClick={() => setGameState(s => ({ ...s, theme: 'relic' }))}
              theme="relic" />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-display text-[var(--text-secondary)] mb-3">配色方案 // ACCENT COLOR</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['cyan', 'purple-pink', 'gold', 'white-blue'].map(color => (
               <button key={color}
                 onClick={() => setGameState(s => ({ ...s, colorScheme: color as any }))}
                 className={`p-3 border transition-colors text-sm uppercase font-mono text-center
                   ${gameState.colorScheme === color ? 'border-[var(--color-main)] bg-[var(--bg-card)] text-[var(--color-main)]' : 'border-[var(--bg-card)] bg-[var(--bg-input)]'}
                 `}>{color}</button>
            ))}
          </div>
        </section>

        <section>
           <h3 className="text-sm font-display text-[var(--text-secondary)] mb-3">视觉特效与布局 // VISUAL EFFECTS</h3>
           <div className="space-y-3">
             {/* 主题特定的特效开关 */}
             <label className="flex items-center justify-between p-3 border border-[var(--bg-card)] bg-[var(--bg-input)] rounded cursor-pointer hover:border-[var(--text-dim)]">
                <span>
                  {isAurora ? (
                    <span className="flex items-center gap-2">
                      <span className="text-[#c9a045]">✿</span> 花雨特效 (Petal Shower)
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="text-[var(--neon-cyan)]">◈</span> Glitch Faults (故障特效)
                    </span>
                  )}
                </span>
                <input type="checkbox" checked={gameState.glitchEnabled}
                  onChange={(e) => setGameState(s => ({...s, glitchEnabled: e.target.checked}))}
                  className="accent-[var(--color-main)] w-4 h-4 cursor-pointer" />
             </label>

             <div className="p-3 border border-[var(--bg-card)] bg-[var(--bg-input)] rounded">
               <div className="flex justify-between mb-2">
                 <span>正文框高度比例</span>
                 <span className="text-[var(--color-main)] font-mono">{gameState.textBoxRatio}%</span>
               </div>
               <input type="range" min="30" max="80" value={gameState.textBoxRatio}
                 onChange={(e) => setGameState(s => ({...s, textBoxRatio: parseInt(e.target.value)}))}
                 className="w-full accent-[var(--color-main)]" />
             </div>
           </div>
        </section>

        <section className="pt-4 border-t border-[var(--bg-card)]">
           <h3 className="text-sm font-display text-[var(--status-danger)] mb-3">高级选项 // ADVANCED</h3>
           <div className="flex gap-3">
             <button className="flex-1 py-2 border border-[var(--text-dim)] text-[var(--text-dim)] hover:border-white hover:text-white transition-colors text-sm uppercase tracking-widest">导出存档</button>
             <button className="flex-1 py-2 border border-[var(--status-danger)] text-[var(--status-danger)] hover:bg-[var(--status-danger)] hover:text-white transition-colors text-sm uppercase tracking-widest">重置系统</button>
           </div>
        </section>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   铭牌 — 大标题 + 左右装饰 + 动态花纹
   ══════════════════════════════════════════════ */
const Nameplate: React.FC<{
  label: string; subtitle: string; active: boolean; disabled?: boolean;
  onClick: () => void; theme: 'cyberpunk' | 'aurora' | 'iron' | 'pixel' | 'gear' | 'relic' | 'locked';
}> = ({ label, subtitle, active, disabled, onClick, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || theme === 'locked') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const pts: Array<{x:number;y:number;vx:number;vy:number;life:number;max:number;s:number;c:string}> = [];

    const resize = () => { canvas.width = container.offsetWidth; canvas.height = container.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const spawn = () => {
      const W = canvas.width, H = canvas.height;
      if (theme === 'cyberpunk') {
        if (pts.length < 25) pts.push({ x:Math.random()*W, y:-3, vx:0, vy:1+Math.random()*2.5, life:0, max:80+Math.random()*120, s:1+Math.random()*2, c:Math.random()>.5?'#00E5FF':'#E8477B' });
      } else if (theme !== 'iron' && theme !== 'pixel' && theme !== 'gear' && theme !== 'relic') {
        if (pts.length < 12) pts.push({ x:Math.random()*W, y:H+5, vx:(Math.random()-.5)*0.5, vy:-(0.3+Math.random()*0.6), life:0, max:120+Math.random()*160, s:1.5+Math.random()*3, c:Math.random()>.4?'#c9a045':'#e8c870' });
      }
    };

    let tick = 0;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const cx = canvas.width / 2, cy = canvas.height / 2;
      tick++;
      if (theme === 'gear') {
        const W = canvas.width, H = canvas.height;
        const midX = W/2, midY = H*0.32;
        const mainR = 28, mainTeeth = 16, mainSpd = 0.005;

        const gears: Array<{r:number;x:number;y:number;teeth:number;spd:number;phase:number}> = [
          {r:mainR, x:midX, y:midY, teeth:mainTeeth, spd:mainSpd, phase:0},
          {r:14, x:midX+mainR+4, y:midY-mainR*0.3, teeth:10, spd:-mainSpd*mainTeeth/10, phase:0.35},
          {r:9, x:midX+mainR+20, y:midY+5, teeth:6, spd:mainSpd*mainTeeth/6, phase:1.7},
          {r:12, x:midX-mainR-3, y:midY-mainR*0.2, teeth:8, spd:-mainSpd*mainTeeth/8, phase:0.85},
          {r:7, x:midX-mainR-16, y:midY-mainR*0.4, teeth:5, spd:mainSpd*mainTeeth/5, phase:2.2},
          {r:10, x:midX+mainR+10, y:midY+mainR*0.5, teeth:7, spd:-mainSpd*mainTeeth/7, phase:1.05},
          {r:6, x:midX-mainR-10, y:midY+mainR*0.55, teeth:4, spd:-mainSpd*mainTeeth/4, phase:2.8},
          {r:5, x:midX-mainR*0.15, y:midY-mainR-6, teeth:4, spd:-mainSpd*mainTeeth/4, phase:1.5},
          {r:6, x:midX+mainR+26, y:midY-mainR*0.55, teeth:4, spd:-mainSpd*mainTeeth/4, phase:2.5},
          {r:5.5, x:midX-mainR-22, y:midY+mainR*0.3, teeth:4, spd:mainSpd*mainTeeth/4, phase:0.4},
        ];

        // Steam vent pipes (background decoration)
        ctx.strokeStyle = 'rgba(184,134,11,0.12)'; ctx.lineWidth = 1.5;
        // Left pipe
        ctx.beginPath(); ctx.moveTo(6, H*0.55); ctx.lineTo(6, H*0.15); ctx.lineTo(14, H*0.15); ctx.stroke();
        // Right pipe  
        ctx.beginPath(); ctx.moveTo(W-6, H*0.6); ctx.lineTo(W-6, H*0.12); ctx.lineTo(W-14, H*0.12); ctx.stroke();
        // Steam puffs from pipes
        for (let p = 0; p < 2; p++) {
          const sx = p===0 ? 14 : W-14;
          const sy = p===0 ? H*0.15 : H*0.12;
          for (let b = 0; b < 3; b++) {
            const bx = sx + b*6 + Math.sin(tick*0.06+p+b)*3;
            const by = sy - b*4 - ((tick*0.08+b*2)%8);
            const ba = 0.15 - b*0.04;
            ctx.fillStyle = `rgba(200,180,140,${Math.max(0,ba)})`;
            ctx.beginPath(); ctx.arc(bx, by, 3-b*0.5, 0, Math.PI*2); ctx.fill();
          }
        }

        // Pressure gauge top-left
        const gx = 16, gy = H*0.25;
        ctx.strokeStyle = 'rgba(184,134,11,0.3)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(gx, gy, 7, 0, Math.PI*2); ctx.stroke();
        ctx.strokeStyle = 'rgba(184,134,11,0.25)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(gx, gy, 5, 0, Math.PI*2); ctx.stroke();
        ctx.fillStyle = 'rgba(200,60,40,0.5)';
        const gnAngle = -0.8 + Math.sin(tick*0.04)*0.4;
        ctx.fillRect(gx-0.5, gy-0.5, 1+Math.cos(gnAngle)*4, 1+Math.sin(gnAngle)*1.5);

        // Pressure gauge top-right
        ctx.strokeStyle = 'rgba(184,134,11,0.3)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(W-16, H*0.22, 7, 0, Math.PI*2); ctx.stroke();
        ctx.strokeStyle = 'rgba(184,134,11,0.25)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(W-16, H*0.22, 5, 0, Math.PI*2); ctx.stroke();
        ctx.fillStyle = 'rgba(200,60,40,0.5)';
        ctx.fillRect(W-16.5, H*0.22-0.5, 1+Math.cos(gnAngle+1)*4, 1+Math.sin(gnAngle+1)*1.5);

        // Draw gears (larger, clearer)
        gears.forEach(g => {
          const angle = tick * g.spd + g.phase;
          // Outer ring — thicker
          ctx.strokeStyle = 'rgba(184,134,11,0.45)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI*2); ctx.stroke();
          // Teeth — larger trapezoids
          const toothH = 3.5;
          for (let t = 0; t < g.teeth; t++) {
            const ta = angle + (t/g.teeth)*Math.PI*2;
            ctx.fillStyle = 'rgba(184,134,11,0.32)';
            ctx.beginPath();
            ctx.moveTo(g.x+Math.cos(ta-0.06)*g.r, g.y+Math.sin(ta-0.06)*g.r);
            ctx.lineTo(g.x+Math.cos(ta-0.04)*(g.r+toothH), g.y+Math.sin(ta-0.04)*(g.r+toothH));
            ctx.lineTo(g.x+Math.cos(ta+0.04)*(g.r+toothH), g.y+Math.sin(ta+0.04)*(g.r+toothH));
            ctx.lineTo(g.x+Math.cos(ta+0.06)*g.r, g.y+Math.sin(ta+0.06)*g.r);
            ctx.fill();
            ctx.strokeStyle = 'rgba(200,160,50,0.2)'; ctx.lineWidth = 0.5;
            ctx.stroke();
          }
          // Inner ring
          ctx.strokeStyle = 'rgba(212,160,48,0.35)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(g.x, g.y, g.r*0.5, 0, Math.PI*2); ctx.stroke();
          // Hub
          ctx.fillStyle = 'rgba(212,160,48,0.4)';
          ctx.beginPath(); ctx.arc(g.x, g.y, g.r*0.2, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle = 'rgba(200,150,40,0.5)'; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.arc(g.x, g.y, g.r*0.3, 0, Math.PI*2); ctx.stroke();
          // Spokes
          const spokes = g.r > 7 ? 4 : 3;
          for (let s = 0; s < spokes; s++) {
            const sa = angle + s*Math.PI*2/spokes;
            ctx.strokeStyle = 'rgba(200,150,40,0.22)'; ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(g.x+Math.cos(sa)*g.r*0.32, g.y+Math.sin(sa)*g.r*0.32);
            ctx.lineTo(g.x+Math.cos(sa)*g.r*0.82, g.y+Math.sin(sa)*g.r*0.82);
            ctx.stroke();
          }
        });

        // Pendulum under main gear
        const pendPivotX = midX;
        const pendPivotY = midY + mainR;
        const pendLen = H*0.18;
        const pendAngle = Math.sin(tick*0.022) * 0.5;
        const bobX = pendPivotX + Math.sin(pendAngle)*pendLen;
        const bobY = pendPivotY + Math.cos(pendAngle)*pendLen;
        // Rod — thicker
        ctx.strokeStyle = 'rgba(184,134,11,0.6)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(pendPivotX, pendPivotY);
        ctx.lineTo(bobX, bobY); ctx.stroke();
        ctx.fillStyle = '#d4a030'; ctx.beginPath(); ctx.arc(pendPivotX, pendPivotY, 3, 0, Math.PI*2); ctx.fill();
        // Bob
        const bg = ctx.createRadialGradient(bobX,bobY,0,bobX,bobY,10);
        bg.addColorStop(0,'rgba(212,160,48,0.85)'); bg.addColorStop(0.4,'rgba(184,134,11,0.35)'); bg.addColorStop(1,'rgba(184,134,11,0)');
        ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(bobX,bobY,10,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#d4a030'; ctx.beginPath(); ctx.arc(bobX,bobY,4,0,Math.PI*2); ctx.fill();

        // Edge rivets
        for (let r = 0; r < 16; r++) {
          const f = r/15;
          let rx:number, ry:number;
          if(f<0.25){rx=5+f*4*W;ry=5}else if(f<0.5){rx=W-5;ry=5+(f-0.25)*4*H}else if(f<0.75){rx=W-5-(f-0.5)*4*W;ry=H-5}else{rx=5;ry=H-5-(f-0.75)*4*H}
          ctx.fillStyle = 'rgba(184,134,11,0.45)';
          ctx.beginPath(); ctx.arc(rx, ry, 3, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle = 'rgba(212,160,48,0.3)'; ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.arc(rx, ry, 4, 0, Math.PI*2); ctx.stroke();
        }
        return;
      }
      if (theme === 'relic') {
        const W = canvas.width, H = canvas.height;
        const cx = W/2, cy = H/2;

        // ── Gothic pointed arch window ──
        const archW = W*0.48, archH = H*0.55;
        const archCX = cx, archCY = cy - H*0.08;
        // Outer arch — dark gold
        ctx.strokeStyle = 'rgba(120,90,50,0.45)'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(archCX-archW/2, archCY+archH);
        ctx.lineTo(archCX-archW/2, archCY);
        ctx.quadraticCurveTo(archCX-archW/2, archCY-archH*0.9, archCX, archCY-archH*1.05);
        ctx.quadraticCurveTo(archCX+archW/2, archCY-archH*0.9, archCX+archW/2, archCY);
        ctx.lineTo(archCX+archW/2, archCY+archH);
        ctx.stroke();
        // Inner arch
        ctx.strokeStyle = 'rgba(100,75,40,0.25)'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(archCX-archW/2+6, archCY+archH);
        ctx.lineTo(archCX-archW/2+6, archCY+4);
        ctx.quadraticCurveTo(archCX-archW/2+6, archCY-archH*0.8, archCX, archCY-archH*0.95);
        ctx.quadraticCurveTo(archCX+archW/2-6, archCY-archH*0.8, archCX+archW/2-6, archCY+4);
        ctx.lineTo(archCX+archW/2-6, archCY+archH);
        ctx.stroke();

        // ── Rose window ──
        const roseCX = archCX, roseCY = archCY - archH*0.2, roseR = archW*0.22;
        ctx.strokeStyle = 'rgba(120,90,50,0.5)'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(roseCX, roseCY, roseR, 0, Math.PI*2); ctx.stroke();
        ctx.strokeStyle = 'rgba(100,75,40,0.35)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(roseCX, roseCY, roseR*0.7, 0, Math.PI*2); ctx.stroke();
        for (let s = 0; s < 8; s++) {
            const sa = s*Math.PI/4 + tick*0.002;
            ctx.strokeStyle = 'rgba(80,60,30,0.25)'; ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(roseCX+Math.cos(sa)*roseR*0.15, roseCY+Math.sin(sa)*roseR*0.15);
            ctx.lineTo(roseCX+Math.cos(sa)*roseR*0.9, roseCY+Math.sin(sa)*roseR*0.9);
            ctx.stroke();
        }
        ctx.fillStyle = 'rgba(120,90,50,0.4)';
        ctx.beginPath(); ctx.arc(roseCX, roseCY, roseR*0.12, 0, Math.PI*2); ctx.fill();

        // ── Imperial Aquila ──
        const aqCX = archCX, aqCY = archCY + archH*0.25, aqScale = archW*0.14;
        ctx.strokeStyle = 'rgba(100,75,40,0.35)'; ctx.lineWidth = 1.2;
        ctx.fillStyle = 'rgba(120,90,50,0.1)';
        ctx.beginPath();
        ctx.moveTo(aqCX, aqCY-aqScale*0.6);
        ctx.lineTo(aqCX-aqScale*0.5, aqCY+aqScale*0.4);
        ctx.lineTo(aqCX-aqScale*0.3, aqCY);
        ctx.lineTo(aqCX, aqCY+aqScale*0.3);
        ctx.lineTo(aqCX+aqScale*0.3, aqCY);
        ctx.lineTo(aqCX+aqScale*0.5, aqCY+aqScale*0.4);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(100,75,40,0.25)'; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(aqCX-aqScale*0.3, aqCY);
        ctx.quadraticCurveTo(aqCX-aqScale*0.8, aqCY-aqScale*0.8, aqCX-aqScale*0.15, aqCY-aqScale*0.2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(aqCX+aqScale*0.3, aqCY);
        ctx.quadraticCurveTo(aqCX+aqScale*0.8, aqCY-aqScale*0.8, aqCX+aqScale*0.15, aqCY-aqScale*0.2); ctx.stroke();

        // ── Flanking candles/dark metal brackets ──
        for (let side = -1; side <= 1; side += 2) {
            const brX = archCX + side*archW*0.48, brY = archCY + archH*0.7;
            // Dark iron bracket
            ctx.strokeStyle = 'rgba(40,25,15,0.4)'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(brX, brY+4); ctx.lineTo(brX, brY-4); ctx.stroke();
            ctx.fillStyle = 'rgba(40,25,15,0.3)';
            ctx.beginPath(); ctx.arc(brX, brY, 4, 0, Math.PI*2); ctx.fill();
        }

        // ── Mechanicus cog ──
        const cogCX = archCX, cogCY = archCY + archH + 4, cogR = 10;
        ctx.strokeStyle = 'rgba(80,60,35,0.35)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(cogCX, cogCY, cogR, 0, Math.PI*2); ctx.stroke();
        for (let t = 0; t < 8; t++) {
            const ta = tick*0.003 + (t/8)*Math.PI*2;
            ctx.fillStyle = 'rgba(80,60,35,0.2)';
            ctx.fillRect(cogCX+Math.cos(ta)*cogR-1.5, cogCY+Math.sin(ta)*cogR-1.5, 3, 3);
        }
        ctx.fillStyle = 'rgba(80,60,35,0.3)';
        ctx.beginPath(); ctx.arc(cogCX, cogCY, cogR*0.3, 0, Math.PI*2); ctx.fill();

        // ── Corner gold filigree ──
        [[8,8,1,1],[W-8,8,-1,1],[8,H-8,1,-1],[W-8,H-8,-1,-1]].forEach(([fx,fy,sx,sy]) => {
            ctx.strokeStyle = 'rgba(120,90,50,0.4)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(fx, fy+sy*18);
            ctx.quadraticCurveTo(fx, fy, fx+sx*18, fy); ctx.stroke();
            ctx.fillStyle = 'rgba(120,90,50,0.4)';
            ctx.beginPath(); ctx.arc(fx, fy, 2.5, 0, Math.PI*2); ctx.fill();
        });

        // ── Top inscription ──
        const txtY = archCY - archH*0.8;
        ctx.fillStyle = 'rgba(80,60,35,0.2)';
        ctx.fillRect(archCX-archW*0.3, txtY, archW*0.6, 2);
        ctx.fillRect(archCX-archW*0.2, txtY-3, archW*0.4, 1);

        return;
      }
      if (theme === 'pixel') {
        const W = canvas.width, H = canvas.height;
        const cx = W/2, cy = H*0.45;

        // ── 中央像素营火 ──
        const fireFlicker = 0.7 + 0.3 * Math.sin(tick * 0.06);

        // 外层火光
        const outerGlow = ctx.createRadialGradient(cx, cy+8, 0, cx, cy, 40);
        outerGlow.addColorStop(0, `rgba(255,160,30,${0.35*fireFlicker})`);
        outerGlow.addColorStop(0.5, `rgba(255,100,20,${0.15*fireFlicker})`);
        outerGlow.addColorStop(1, 'rgba(200,40,10,0)');
        ctx.fillStyle = outerGlow;
        ctx.beginPath(); ctx.arc(cx, cy+6, 40, 0, Math.PI*2); ctx.fill();

        // 中层暖光
        const midGlow = ctx.createRadialGradient(cx, cy+5, 0, cx, cy, 20);
        midGlow.addColorStop(0, `rgba(255,200,60,${0.6*fireFlicker})`);
        midGlow.addColorStop(0.6, `rgba(255,140,30,${0.3*fireFlicker})`);
        midGlow.addColorStop(1, 'rgba(200,60,20,0)');
        ctx.fillStyle = midGlow;
        ctx.beginPath(); ctx.arc(cx, cy+5, 20, 0, Math.PI*2); ctx.fill();

        // 火焰核心 — 多层像素色块缓慢燃烧
        const flameColors = ['#ffffff','#fff8c0','#ffd040','#ff9020','#e05010'];
        for (let f = 0; f < 5; f++) {
          const fy = cy + 2 + Math.sin(tick*0.08 + f*0.7) * (3 + f*1.5);
          const fh = 6 + f * 2.5;
          const fw = 4 + f * 1.8;
          ctx.fillStyle = flameColors[f];
          ctx.fillRect(cx - fw/2, fy - fh, fw, fh);
          // 左右偏移火焰块
          if (f > 1) {
            ctx.fillRect(cx - fw/2 - 3 + f*0.6, fy - fh*0.8, fw*0.6, fh*0.7);
            ctx.fillRect(cx + fw/2 + 1 - f*0.4, fy - fh*0.7, fw*0.5, fh*0.6);
          }
        }

        // 火星上升粒子
        for (let e = 0; e < 5; e++) {
          const ex = cx + (Math.sin(tick*0.06 + e*1.3) * 12);
          const ey = cy - 5 - ((tick*0.3 + e*15) % 35);
          const ea = 0.4 + 0.6 * (1 - ((tick*0.8 + e*15) % 35) / 35);
          ctx.fillStyle = `rgba(255,200,60,${ea})`;
          ctx.fillRect(ex-1, ey-1, 2, 2);
        }

        // 像素柴火堆
        ctx.fillStyle = '#4a2810';
        ctx.fillRect(cx-10, cy+10, 20, 3);
        ctx.fillRect(cx-12, cy+12, 24, 2);
        ctx.fillStyle = '#6a3820';
        ctx.fillRect(cx-8, cy+9, 16, 2);

        // ── 四周静止闪烁星星 ──
        const starPositions = [
          [0.1,0.18],[0.78,0.1],[0.22,0.7],[0.88,0.65],
          [0.05,0.45],[0.95,0.35],[0.3,0.08],[0.7,0.82],
          [0.55,0.08],[0.42,0.88],[0.15,0.55],[0.85,0.25],
          [0.35,0.22],[0.6,0.78],[0.08,0.82],[0.92,0.72],
          [0.48,0.15],[0.7,0.28],
        ];
        starPositions.forEach(([sx,sy],i) => {
          const phase = (tick*0.03 + i*0.6) % (Math.PI*2);
          const alpha = 0.3 + 0.7 * Math.abs(Math.sin(phase));
          const px = W*sx, py = H*sy;
          ctx.fillStyle = `rgba(240,200,72,${alpha})`;
          ctx.shadowColor = '#f0c848'; ctx.shadowBlur = 4;
          const sz = 1 + Math.abs(Math.sin(phase))*1.5;
          ctx.fillRect(px-sz/2, py-sz/2, sz, sz);
          ctx.shadowBlur = 0;
          // 十字辉光
          if (alpha > 0.6) {
            ctx.fillStyle = `rgba(255,240,200,${alpha*0.4})`;
            ctx.fillRect(px-sz, py-0.5, sz*2, 1);
            ctx.fillRect(px-0.5, py-sz, 1, sz*2);
          }
        });

        // 底部光条
        const barAlpha = 0.2 + 0.8 * Math.abs(Math.sin(tick * 0.05));
        ctx.fillStyle = `rgba(240,200,72,${barAlpha})`;
        ctx.fillRect(W*0.25, H*0.85, W*0.5, 2);

        return;
      }
      if (theme === 'iron') {
        const W = canvas.width, H = canvas.height;
        // Very slow breath: ~12 seconds
        const breath = 0.5 + 0.5 * Math.sin(tick * 0.008);
        // All energy flows in sync: 0 at center, 1 at edges
        const flow = 0.5 + 0.5 * Math.sin(tick * 0.012);

        // Core glow
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14*breath+3);
        cg.addColorStop(0, `rgba(255,50,30,${0.9*breath})`);
        cg.addColorStop(0.4, `rgba(224,50,30,${0.5*breath})`);
        cg.addColorStop(1, 'rgba(192,48,48,0)');
        ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, 14*breath+3, 0, Math.PI*2); ctx.fill();

        // --- Ice fracture: lightning-straight cracks with 1-2 branches ---
        const numCracks = 20;
        const crackPaths: Array<{x:number;y:number}[]> = [];
        const branchData: Array<{fromIdx:number;bx:number;by:number;bx2:number;by2:number}[]> = [];

        for (let c = 0; c < numCracks; c++) {
          const baseAngle = (c / numCracks) * Math.PI * 2;
          const chaos = Math.sin(c * 2.7) * 0.2;
          const angle = baseAngle + chaos;
          const points: {x:number;y:number}[] = [{x:cx, y:cy}];
          const maxDist = Math.sqrt(W*W + H*H) * 0.75;
          const segments = 3 + Math.floor(Math.abs(Math.sin(c * 3.7)) * 5);
          const segLen = maxDist / segments;
          let currentAngle = angle;

          for (let s = 1; s <= segments; s++) {
            const prev = points[points.length - 1];
            // Occasional sharp angle turn
            if (s > 1 && Math.abs(Math.sin(c*5.1 + s*2.3)) > 0.75) {
              currentAngle += (Math.sin(c*3.9 + s*1.7) * 0.9);
            }
            const segActualLen = segLen * (0.85 + Math.abs(Math.sin(c*1.7 + s)) * 0.3);
            points.push({
              x: prev.x + Math.cos(currentAngle) * segActualLen,
              y: prev.y + Math.sin(currentAngle) * segActualLen,
            });
          }
          crackPaths.push(points);

          // 1-2 branches per crack
          const branches: {fromIdx:number;bx:number;by:number;bx2:number;by2:number}[] = [];
          const numBranches = 1 + Math.floor(Math.abs(Math.sin(c*4.3)) * 2);
          for (let b = 0; b < numBranches; b++) {
            const fromIdx = 1 + Math.floor(Math.abs(Math.sin(c*6.1 + b*3.1)) * (points.length - 2));
            const bpt = points[fromIdx];
            const ba = Math.atan2(points[fromIdx+1].y - bpt.y, points[fromIdx+1].x - bpt.x)
                       + (0.4 + Math.sin(c*2.5 + b) * 1.0);
            const blen = 15 + Math.abs(Math.sin(c*3.9 + b)) * 30;
            branches.push({
              fromIdx,
              bx: bpt.x + Math.cos(ba) * blen,
              by: bpt.y + Math.sin(ba) * blen,
              bx2: bpt.x + Math.cos(ba + 0.5) * blen * 0.5,
              by2: bpt.y + Math.sin(ba + 0.5) * blen * 0.5,
            });
          }
          branchData.push(branches);
        }

        // Draw main cracks (thicker)
        crackPaths.forEach(crack => {
          ctx.strokeStyle = `rgba(210,40,25,${0.14 + 0.1*breath})`; ctx.lineWidth = 1.0;
          ctx.beginPath(); ctx.moveTo(crack[0].x, crack[0].y);
          for (let i = 1; i < crack.length; i++) {
            const px = Math.max(-20, Math.min(W+20, crack[i].x));
            const py = Math.max(-20, Math.min(H+20, crack[i].y));
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        });

        // Draw branches
        branchData.forEach((branches, ci) => {
          branches.forEach(br => {
            const crack = crackPaths[ci];
            const bpt = crack[br.fromIdx];
            ctx.strokeStyle = `rgba(190,30,20,${0.09 + 0.06*breath})`; ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(bpt.x, bpt.y);
            ctx.lineTo(Math.max(-20, Math.min(W+20, br.bx)), Math.max(-20, Math.min(H+20, br.by)));
            ctx.stroke();
            // Tiny fork
            if (Math.abs(Math.sin(ci*4.1)) > 0.4) {
              ctx.strokeStyle = `rgba(170,25,15,${0.05 + 0.04*breath})`; ctx.lineWidth = 0.35;
              ctx.beginPath(); ctx.moveTo(bpt.x, bpt.y);
              ctx.lineTo(Math.max(-20, Math.min(W+20, br.bx2)), Math.max(-20, Math.min(H+20, br.by2)));
              ctx.stroke();
            }
          });
        });

        // Energy flow — ALL nodes move in sync
        crackPaths.forEach(crack => {
          const totalSegs = crack.length - 1;
          const pos = flow * totalSegs;
          const idx = Math.floor(pos);
          const frac = pos - idx;
          const ni = Math.min(idx + 1, totalSegs);
          const p0 = crack[idx];
          const p1 = crack[ni];
          const ex = p0.x + (p1.x - p0.x) * frac;
          const ey = p0.y + (p1.y - p0.y) * frac;
          // Only draw if on canvas
          if (ex < -5 || ex > W+5 || ey < -5 || ey > H+5) return;
          const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, 5);
          glow.addColorStop(0, `rgba(255,100,50,${0.85*breath})`);
          glow.addColorStop(0.5, `rgba(255,50,30,${0.4*breath})`);
          glow.addColorStop(1, 'rgba(200,30,20,0)');
          ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI*2); ctx.fill();
        });

        // Central pulse ring
        ctx.strokeStyle = `rgba(255,50,30,${0.25*breath})`; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(cx, cy, 8 + 6*breath, 0, Math.PI*2); ctx.stroke();
        return;
      }
      for (let i=pts.length-1;i>=0;i--) {
        const p=pts[i]; p.x+=p.vx; p.y+=p.vy; p.life++;
        const a=p.life<10?p.life/10:(1-(p.life-10)/p.max);
        if(p.life>p.max||p.y>canvas.height+10||p.y<-10){pts.splice(i,1);continue;}
        ctx.globalAlpha=Math.max(0,a*.8);ctx.fillStyle=p.c;ctx.shadowColor=p.c;
        ctx.shadowBlur=theme==='cyberpunk'?4:6;
        if(theme==='cyberpunk')ctx.fillRect(p.x,p.y,p.s,p.s*3);
        else{ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill();}
        ctx.shadowBlur=0;
      }
      ctx.globalAlpha=1;
    };
    const loop=()=>{if(theme!=='iron'&&theme!=='pixel'&&theme!=='gear'&&theme!=='relic'&&Math.random()<(theme==='cyberpunk'?.35:.18))spawn();draw();animId=requestAnimationFrame(loop);};
    loop();
    return ()=>{cancelAnimationFrame(animId);ro.disconnect();};
  },[theme]);

  const base: React.CSSProperties = {
    borderWidth: active?'1.5px':'1px',
    borderColor: active?(theme==='cyberpunk'?'#00E5FF':theme==='iron'?'#e04840':theme==='pixel'?'#f0c848':'#c9a045'):'var(--bg-card)',
    background: theme==='cyberpunk'?'linear-gradient(180deg,#060b14,#0d1525 50%,#0a1220)':
                theme==='aurora'?'linear-gradient(180deg,#0a0618,#1a1130 50%,#120c26)':
                theme==='iron'?'linear-gradient(180deg,#0a0608,#140e12 50%,#0e0a0e)':
                theme==='pixel'?'linear-gradient(180deg,#080810,#101830 50%,#0c1428)':
                theme==='gear'?'linear-gradient(180deg,#1a1008,#2a1a0c 50%,#1a1008)':
                theme==='relic'?'linear-gradient(180deg,#faf6ee,#f2ece0 50%,#faf6ee)':
                'linear-gradient(180deg,#0a0a14,#10101c 50%,#0a0a14)',
    boxShadow: active?(theme==='cyberpunk'?'0 0 24px rgba(0,229,255,.18),inset 0 0 16px rgba(0,229,255,.03)':theme==='iron'?'0 0 24px rgba(224,72,64,.18),inset 0 0 16px rgba(192,48,48,.04)':theme==='pixel'?'4px 4px 0 rgba(240,200,72,.3)':theme==='gear'?'0 0 20px rgba(184,134,11,.2),inset 0 0 20px rgba(184,134,11,.04)':theme==='relic'?'0 0 16px rgba(200,160,80,.25),inset 0 0 25px rgba(220,190,120,.08)':'0 0 24px rgba(201,160,69,.18),inset 0 0 16px rgba(201,160,69,.03)'):'none',
  };

  return (
    <button ref={containerRef} onClick={onClick} disabled={disabled}
      className={`relative flex flex-col items-center justify-center overflow-hidden transition-all duration-500 min-h-[140px] gap-3
        ${!disabled?'cursor-pointer hover:scale-[1.03]':'cursor-not-allowed'}
        ${active?'scale-[1.02]':''}`}
      style={base}>
      {/* Canvas 粒子背景 */}
      <div className="absolute inset-0 pointer-events-none opacity-60"><canvas ref={canvasRef} className="w-full h-full"/></div>

      {/* Cyberpunk 专属装饰 */}
      {theme==='cyberpunk'&&<>
        <div className="absolute inset-0 pointer-events-none" style={{background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,229,255,.025) 2px,rgba(0,229,255,.025) 4px)'}}/>
        <div className="absolute top-1.5 left-2 text-[7px] text-[#00E5FF]/30 font-mono">◈ SLOT_01</div>
        {active&&<div className="absolute bottom-0 left-[12%] right-[12%] h-[1px]" style={{background:'linear-gradient(90deg,transparent,#00E5FF,#E8477B,#7B5CFC,transparent)'}}/>}
      </>}

      {/* Aurora 专属装饰 */}
      {theme==='aurora'&&<>
        <div className="absolute top-1 left-1 w-6 h-6 opacity-25"><svg viewBox="0 0 24 24"><path d="M0,20 Q0,6 10,0" fill="none" stroke="#c9a045" strokeWidth="1.2"/><circle cx="0" cy="20" r="1.2" fill="#c9a04544"/></svg></div>
        <div className="absolute top-1 right-1 w-6 h-6 opacity-25" style={{transform:'scaleX(-1)'}}><svg viewBox="0 0 24 24"><path d="M0,20 Q0,6 10,0" fill="none" stroke="#c9a045" strokeWidth="1.2"/><circle cx="0" cy="20" r="1.2" fill="#c9a04544"/></svg></div>
        <div className="absolute bottom-1 left-1 w-6 h-6 opacity-25" style={{transform:'scaleY(-1)'}}><svg viewBox="0 0 24 24"><path d="M0,20 Q0,6 10,0" fill="none" stroke="#c9a045" strokeWidth="1.2"/><circle cx="0" cy="20" r="1.2" fill="#c9a04544"/></svg></div>
        <div className="absolute bottom-1 right-1 w-6 h-6 opacity-25" style={{transform:'scale(-1,-1)'}}><svg viewBox="0 0 24 24"><path d="M0,20 Q0,6 10,0" fill="none" stroke="#c9a045" strokeWidth="1.2"/><circle cx="0" cy="20" r="1.2" fill="#c9a04544"/></svg></div>
      </>}

      {/* Iron 专属装饰 */}
      {theme==='iron'&&<>
        <div className="absolute top-1.5 left-1.5 opacity-30"><svg viewBox="0 0 12 12" width="12" height="12"><circle cx="3" cy="3" r="2.5" fill="none" stroke="#e04840" strokeWidth="1"/><circle cx="3" cy="3" r="0.8" fill="#e0484066"/></svg></div>
        <div className="absolute top-1.5 right-1.5 opacity-30"><svg viewBox="0 0 12 12" width="12" height="12"><circle cx="3" cy="3" r="2.5" fill="none" stroke="#e04840" strokeWidth="1"/><circle cx="3" cy="3" r="0.8" fill="#e0484066"/></svg></div>
        <div className="absolute bottom-1.5 left-1.5 opacity-30"><svg viewBox="0 0 12 12" width="12" height="12"><circle cx="3" cy="3" r="2.5" fill="none" stroke="#e04840" strokeWidth="1"/><circle cx="3" cy="3" r="0.8" fill="#e0484066"/></svg></div>
        <div className="absolute bottom-1.5 right-1.5 opacity-30"><svg viewBox="0 0 12 12" width="12" height="12"><circle cx="3" cy="3" r="2.5" fill="none" stroke="#e04840" strokeWidth="1"/><circle cx="3" cy="3" r="0.8" fill="#e0484066"/></svg></div>
        {active&&<div className="absolute bottom-0 left-[10%] right-[10%] h-[1px]" style={{background:'linear-gradient(90deg,transparent,#e04840,#c03030,transparent)'}}/>}
      </>}

      {/* Pixel 专属装饰 */}
      {theme==='pixel'&&<>
        <div className="absolute top-2 left-2 opacity-40"><svg viewBox="0 0 8 8" width="8" height="8"><rect x="0" y="0" width="8" height="4" fill="#f0c848"/><rect x="0" y="4" width="4" height="4" fill="#f0c848"/></svg></div>
        <div className="absolute top-2 right-2 opacity-40" style={{transform:'scaleX(-1)'}}><svg viewBox="0 0 8 8" width="8" height="8"><rect x="0" y="0" width="8" height="4" fill="#f0c848"/><rect x="0" y="4" width="4" height="4" fill="#f0c848"/></svg></div>
        <div className="absolute bottom-2 left-2 opacity-40" style={{transform:'scaleY(-1)'}}><svg viewBox="0 0 8 8" width="8" height="8"><rect x="0" y="0" width="8" height="4" fill="#f0c848"/><rect x="0" y="4" width="4" height="4" fill="#f0c848"/></svg></div>
        <div className="absolute bottom-2 right-2 opacity-40" style={{transform:'scale(-1,-1)'}}><svg viewBox="0 0 8 8" width="8" height="8"><rect x="0" y="0" width="8" height="4" fill="#f0c848"/><rect x="0" y="4" width="4" height="4" fill="#f0c848"/></svg></div>
      </>}

      {/* Locked */}
      {theme==='locked'&&(
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full border border-dashed border-[#1a1a2a] flex items-center justify-center opacity-25">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a2a" strokeWidth="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
          </div>
        </div>
      )}

      {/* ── 标题（居中 + 左右装饰线） ── */}
      {theme!=='locked'?(
        <div className="relative z-10 flex flex-col items-center gap-1.5 w-full px-4">
          {/* 左右装饰线 + 标题 */}
          <div className="flex items-center gap-2 w-full">
            <span className="flex-1 h-[1px]" style={{
              background: `linear-gradient(90deg,transparent,${active?(theme==='cyberpunk'?'#00E5FF':theme==='iron'?'#e04840':'#c9a045'):'var(--text-dim)'}44)`,
            }}/>
            <span className="px-1 text-[15px] tracking-[0.2em] font-bold"
              style={{
                color: active ? (theme==='cyberpunk'?'#00E5FF':theme==='aurora'?'#dfc890':theme==='iron'?'#e04840':theme==='pixel'?'#f0c848':theme==='gear'?'#d4a030':theme==='relic'?'#3a2810':'#fff') : 'var(--text-secondary)',
                textShadow: active ? (theme==='cyberpunk'?'0 0 10px rgba(0,229,255,.6)':theme==='aurora'?'0 0 8px rgba(201,160,69,.5)':theme==='iron'?'0 0 10px rgba(224,72,64,.5)':theme==='pixel'?'2px 2px 0 #000':theme==='gear'?'0 2px 4px rgba(0,0,0,0.6)':theme==='relic'?'0 1px 0 rgba(255,255,255,0.5)':'none') : 'none',
                fontFamily: theme==='cyberpunk'?"'Orbitron',sans-serif":theme==='aurora'?"'Cormorant Garamond','Georgia',serif":theme==='iron'?"'Saira Condensed','Share Tech Mono',sans-serif":theme==='pixel'?"'Press Start 2P',monospace":theme==='gear'?"'Georgia','Times New Roman',serif":theme==='relic'?"'Orbitron','Cinzel',sans-serif":"'Orbitron',sans-serif",
                fontStyle: theme==='aurora'?'italic':theme==='gear'?'italic':'normal',
                fontWeight: theme==='pixel'?400:theme==='aurora'?500:theme==='relic'?700:600,
                letterSpacing: theme==='pixel'?'0.05em':theme==='iron'?'0.18em':theme==='relic'?'0.15em':'0.15em',
              }}>{label}</span>
            <span className="flex-1 h-[1px]" style={{
              background: `linear-gradient(90deg,${active?(theme==='cyberpunk'?'#00E5FF':theme==='iron'?'#e04840':'#c9a045'):'var(--text-dim)'}44,transparent)`,
            }}/>
          </div>

          {subtitle&&(
            <span className="text-[8px] tracking-[0.3em] opacity-45" style={{color:active?(theme==='cyberpunk'?'#00E5FF':theme==='aurora'?'#c9a045':theme==='iron'?'#e04840':theme==='pixel'?'#f0c848':theme==='gear'?'#d4a030':theme==='relic'?'#a08050':'#fff'):'var(--text-dim)'}}>{subtitle}</span>
          )}

          {/* 装饰图标 */}
          <div className="text-[9px] tracking-[0.2em] opacity-25 mt-0.5" style={{color:active?(theme==='cyberpunk'?'#00E5FF':theme==='iron'?'#e04840':'#c9a045'):'var(--text-dim)'}}>
            {theme==='cyberpunk'?'◈ ◆ ◈':theme==='iron'?'⬡ ◆ ⬡':theme==='pixel'?'★ ◆ ★':'✿ ✦ ✿'}
          </div>

          {active&&(
            <div className="mt-1 flex gap-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:theme==='cyberpunk'?'#00E5FF':theme==='iron'?'#e04840':theme==='pixel'?'#f0c848':'#c9a045',boxShadow:theme==='cyberpunk'?'0 0 6px #00E5FF':theme==='iron'?'0 0 6px #e04840':theme==='pixel'?'0 0 6px #f0c848':'0 0 6px #c9a045'}}/>
              <span className="text-[7px] tracking-widest opacity-50" style={{color:theme==='cyberpunk'?'#00E5FF':theme==='iron'?'#e04840':theme==='pixel'?'#f0c848':'#c9a045'}}>ACTIVE</span>
            </div>
          )}
        </div>
      ):(
        <span className="relative z-10 text-[13px] tracking-[0.4em] text-[#1c1c2a] font-display">???</span>
      )}
    </button>
  );
};
