import React, { useState, useEffect } from 'react';
import { Maximize2, MonitorSmartphone } from 'lucide-react';
import type { ViewType, GameState } from './types';
import { HomeView } from './views/HomeView';
import { HarassmentView } from './views/HarassmentView';
import { ItemsView } from './views/ItemsView';
import { ResidentsView } from './views/ResidentsView';
import { TasksView } from './views/TasksView';
import { ScoresView } from './views/ScoresView';
import { SettingsView } from './views/SettingsView';

const initialGameState: GameState = {
  loopNumber: 1,
  day: 1,
  timeRemaining: 5,
  power: 100,
  money: 500,
  location: '断头台城 · 中央广场',
  musicStyle: 'none',
  theme: 'cyberpunk',
  colorScheme: 'cyan',
  glitchEnabled: true,
  textBoxRatio: 50,
  coreTasksSolved: false,
  isMobileSimulated: false,
};

// ── Cyberpunk 侧边栏图标 ──
const cpIcons = {
  main:     { paths: ['M12,2 L22,7 L22,17 L12,22 L2,17 L2,7 Z'], circles: [] },
  skills:   { paths: ['M21,15 C21,15 18,20 12,20 C6,20 3,15 3,15'], circles: [{cx:12,cy:10,r:4}] },
  items:    { paths: ['M3,7 L12,2 L21,7 L12,12 Z','M3,17 L12,12 L21,17 L12,22 Z'], circles: [] },
  residents:{ paths: ['M17,21 L17,14 L21,14','M12,21 L12,11 L8,11','M7,21 L7,15 L3,15'], circles: [{cx:17,cy:10,r:3},{cx:12,cy:7,r:3},{cx:7,cy:10,r:3}] },
  tasks:    { paths: ['M9,2 L15,2 L15,4 L9,4 Z','M4,4 L20,4 L20,22 L4,22 Z','M9,9 L15,9','M9,13 L15,13'], circles: [] },
  scores:   { paths: ['M9,18 L9,22','M15,14 L15,22','M3,10 L3,22','M21,6 L21,22'], circles: [] },
  settings: { paths: ['M12,15 C13.67,15 15,13.67 15,12 C15,10.33 13.67,9 12,9 C10.33,9 9,10.33 9,12 C9,13.67 10.33,15 12,15 Z'], circles: [] },
};

// ── Relic 侧边栏图标（哥特宗教风格） ──
const rlIcons = {
  main:     { paths: ['M6,6 L18,6 L18,18 L6,18 Z','M9,4 L9,20','M15,4 L15,20','M6,6 L3,9','M18,6 L21,9','M6,18 L3,15','M18,18 L21,15'], circles: [{cx:12,cy:12,r:2}] },
  skills:   { paths: ['M12,3 L17,21 L7,21 Z','M12,8 L12,15','M9,11 L15,11'], circles: [{cx:12,cy:12,r:2}] },
  items:    { paths: ['M7,4 L17,4 L17,14 L12,17 L7,14 Z','M9,7 L15,7','M12,5 L12,11'], circles: [{cx:12,cy:16,r:1.8}] },
  residents:{ paths: ['M10,5 L10,19','M14,5 L14,19','M7,9 L17,9','M7,13 L17,13'], circles: [{cx:10,cy:4,r:1.5},{cx:14,cy:4,r:1.5}] },
  tasks:    { paths: ['M5,4 L19,4 L19,20 L5,20 Z','M8,8 L8,16 L16,16 L16,8 Z','M10,10 L14,10','M10,13 L14,13'], circles: [] },
  scores:   { paths: ['M6,18 L10,14 L14,18','M10,14 L10,6','M10,6 L14,10 L18,6'], circles: [{cx:10,cy:6,r:1.5}] },
  settings: { paths: ['M12,2 L20,7 L20,17 L12,22 L4,17 L4,7 Z','M12,8 L12,16','M8,10 L16,10','M8,14 L16,14'], circles: [{cx:12,cy:12,r:1.8}] },
};

// ── Gear 侧边栏图标（蒸汽朋克齿轮风格） ──
const grIcons = {
  main:     { paths: ['M7,7 L17,7 L17,17 L7,17 Z','M9,9 L15,9 L15,15 L9,15 Z'], circles: [{cx:12,cy:7,r:2},{cx:12,cy:17,r:2},{cx:7,cy:12,r:2},{cx:17,cy:12,r:2}] },
  skills:   { paths: ['M12,3 L17,8 L17,16 L12,21 L7,16 L7,8 Z','M12,9 L12,15','M9,11 L15,11'], circles: [{cx:12,cy:5,r:2}] },
  items:    { paths: ['M6,5 L18,5 L18,15 L12,18 L6,15 Z','M9,9 L12,9 L12,13','M15,9 L15,12'], circles: [{cx:12,cy:7,r:1.5}] },
  residents:{ paths: ['M9,6 L9,18','M15,6 L15,18','M7,9 L11,9','M13,13 L17,13'], circles: [{cx:9,cy:5,r:1.5},{cx:15,cy:5,r:1.5}] },
  tasks:    { paths: ['M5,4 L19,4 L19,20 L5,20 Z','M8,8 L16,8','M8,12 L15,12','M8,16 L12,16'], circles: [{cx:17,cy:8,r:1.5}] },
  scores:   { paths: ['M5,18 L8,13 L12,16 L16,9 L19,10','M5,18 L19,18','M12,6 L12,8'], circles: [{cx:8,cy:13,r:1.2},{cx:16,cy:9,r:1.2}] },
  settings: { paths: ['M12,3 L19,7 L19,17 L12,21 L5,17 L5,7 Z','M12,9 L12,15','M9,12 L15,12'], circles: [{cx:12,cy:12,r:2}] },
};

// ── Pixel 侧边栏图标（8-bit像素风格） ──
const pxIcons = {
  main:     { paths: ['M6,6 L18,6 L18,18 L6,18 Z','M9,11 L15,11','M12,9 L12,13'], circles: [] },
  skills:   { paths: ['M8,5 L16,5 L16,8 L18,8 L18,16 L16,16 L16,19 L8,19 L8,16 L6,16 L6,8 L8,8 Z','M12,11 L12,15'], circles: [] },
  items:    { paths: ['M7,4 L17,4 L17,12 L12,14 L7,12 Z','M10,9 L14,9','M12,7 L12,11'], circles: [{cx:12,cy:18,r:1.5},{cx:10,cy:18,r:1.2},{cx:14,cy:18,r:1.2}] },
  residents:{ paths: ['M10,5 L10,19','M14,5 L14,19','M8,8 L12,8','M12,12 L16,12'], circles: [{cx:10,cy:4,r:1.2},{cx:14,cy:4,r:1.2}] },
  tasks:    { paths: ['M5,4 L19,4 L19,20 L5,20 Z','M8,8 L16,8','M8,12 L15,12','M8,16 L12,16','M16,12 L16,16'], circles: [] },
  scores:   { paths: ['M5,18 L8,13 L12,16 L16,8 L19,9','M5,18 L19,18'], circles: [{cx:8,cy:13,r:1.2},{cx:12,cy:16,r:1.2},{cx:16,cy:8,r:1.2}] },
  settings: { paths: ['M12,3 L19,12 L12,21 L5,12 Z','M12,8 L12,16','M8,12 L16,12'], circles: [{cx:12,cy:12,r:1.5}] },
};

// ── Iron 侧边栏图标（工业棱角风格） ──
const irIcons = {
  main:     { paths: ['M4,4 L20,4 L20,20 L4,20 Z','M8,12 L16,12','M12,8 L12,12','M6,18 L10,14 L14,18'], circles: [{cx:12,cy:17,r:1.5}] },
  skills:   { paths: ['M12,4 L20,12 L16,18 L8,18 L4,12 Z','M12,10 L12,15','M9,13 L15,13'], circles: [] },
  items:    { paths: ['M4,8 L12,3 L20,8 L20,18 L4,18 Z','M8,10 L12,10','M8,13 L16,13','M8,16 L14,16'], circles: [] },
  residents:{ paths: ['M8,6 L8,18','M6,8 L10,8','M16,6 L16,18','M14,8 L18,8','M12,10 L12,16'], circles: [{cx:8,cy:5,r:1.5},{cx:16,cy:5,r:1.5}] },
  tasks:    { paths: ['M4,4 L20,4 L20,20 L4,20 Z','M8,8 L16,8','M8,12 L14,12','M8,16 L12,16'], circles: [{cx:17,cy:8,r:1.5}] },
  scores:   { paths: ['M4,18 L8,12 L12,16 L16,8 L20,10','M4,18 L20,18'], circles: [] },
  settings: { paths: ['M12,4 L20,12 L12,20 L4,12 Z','M12,9 L12,15','M9,12 L15,12'], circles: [{cx:12,cy:12,r:1.5}] },
};

// ── Aurora 侧边栏图标（花饰风格SVG） ──
const auIcons = {
  main: {
    paths: [
      'M12,4 Q16,12 12,20 Q8,12 12,4 Z',  // 花形
      'M12,7 Q7,12 12,17 Q17,12 12,7 Z',
    ],
    circles: [{cx:12,cy:20,r:1.5}, {cx:12,cy:4,r:1.5}],
  },
  skills: {
    paths: [
      'M12,5 C8,5 5,8 5,12 C5,16 8,16 12,20 C16,16 19,16 19,12 C19,8 16,5 12,5 Z',
    ],
    circles: [{cx:12,cy:12,r:2.5}],
  },
  items: {
    paths: [
      'M6,8 L12,3 L18,8 L12,13 Z',
      'M6,8 L12,13 L18,8 L12,18 Z',
      'M6,8 L12,18 L12,13',
    ],
    circles: [],
  },
  residents: {
    paths: [
      'M17,20 L17,14 L20,14',
      'M12,20 L12,10 L9,10',
      'M7,20 L7,15 L4,15',
    ],
    circles: [
      {cx:17,cy:10,r:2.5}, {cx:12,cy:7,r:2.5}, {cx:7,cy:10,r:2.5},
    ],
  },
  tasks: {
    paths: [
      'M5,3 L19,3 L19,21 L5,21 Z',
      'M9,7 L15,7 M9,11 L15,11',
    ],
    circles: [{cx:17,cy:20,r:2}],
  },
  scores: {
    paths: [
      'M6,14 Q10,10 14,14 Q18,18 22,14',
      'M6,14 L6,20 M14,14 L14,20 M22,14 L22,20',
    ],
    circles: [],
  },
  settings: {
    paths: [
      'M12,14 C13.1,14 14,13.1 14,12 C14,10.9 13.1,10 12,10 C10.9,10 10,10.9 10,12 C10,13.1 10.9,14 12,14 Z',
      'M12,4 L12,7 M12,17 L12,20',
      'M4,12 L7,12 M17,12 L20,12',
    ],
    circles: [],
  },
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', gameState.theme);
    root.setAttribute('data-color', gameState.colorScheme);
  }, [gameState.theme, gameState.colorScheme]);

  const isAurora = gameState.theme === 'aurora';
  const isIron = gameState.theme === 'iron';
  const isPixel = gameState.theme === 'pixel';
  const isGear = gameState.theme === 'gear';
  const isRelic = gameState.theme === 'relic';
  const iconSet = isAurora ? auIcons : isIron ? irIcons : isPixel ? pxIcons : isGear ? grIcons : isRelic ? rlIcons : cpIcons;

  const navItems = [
    { id: 'home',        iconKey: 'main' as const,      label: 'MAIN',      color: 'var(--color-main)' },
    { id: 'harassment',  iconKey: 'skills' as const,     label: 'SKILLS',    color: 'var(--neon-pink)' },
    { id: 'items',       iconKey: 'items' as const,      label: 'ITEMS',     color: 'var(--neon-amber)' },
    { id: 'residents',   iconKey: 'residents' as const,  label: 'RESIDENTS', color: 'var(--neon-purple)' },
    { id: 'tasks',       iconKey: 'tasks' as const,      label: 'TASKS',     color: 'var(--neon-blue)' },
    { id: 'scores',      iconKey: 'scores' as const,     label: 'SCORES',    color: 'var(--neon-green)' },
    { id: 'settings',    iconKey: 'settings' as const,   label: 'CONFIG',    color: 'var(--text-secondary)' },
  ] as const;

  const isMobileLayout = gameState.isMobileSimulated || (typeof window !== 'undefined' && window.innerWidth < 768);

  return (
    <div className={`flex flex-col h-screen w-full items-center justify-center transition-colors duration-700
      ${(isAurora||isIron||isPixel||isGear||isRelic) ? 'text-[var(--text-primary)]' : 'bg-black text-[var(--text-primary)]'}
    `}
      style={isAurora ? {
        background: 'radial-gradient(ellipse at 50% 30%, #1a1535 0%, #0a0618 55%, #040210 100%)',
      } : isIron ? {
        background: 'radial-gradient(ellipse at 50% 35%, #1a1015 0%, #050508 75%)',
      } : isPixel ? {
        background: '#080810',
      } : isGear ? {
        background: 'radial-gradient(ellipse at 50% 40%, #2a1a10 0%, #0a0602 80%)',
      } : isRelic ? {
        background: 'radial-gradient(ellipse at 50% 0%, #f0e8d8 0%, #e0d8c8 30%, #d0c8b8 60%, #c8c0b0 100%)',
      } : {}}
    >
      <div className={`relative flex flex-col overflow-hidden transition-all duration-700
        ${gameState.isMobileSimulated ? 'w-[400px] h-[850px] max-h-full rounded-[2rem] border-8 border-gray-900 shadow-2xl' : 'w-full h-full mx-auto'}
        ${isAurora
          ? 'border-[3px] border-[#a08040]'
          : 'border-[length:var(--ui-border-width)] border-[color:var(--ui-border-color)] shadow-[var(--ui-shadow-glow)]'}
      `}
        style={isAurora ? {
          background: 'linear-gradient(175deg, rgba(22,14,48,0.88), rgba(10,6,26,0.94))',
        } : {}}
      >
        {/* ═══════ Top Bar ═══════ */}
        <header className={`h-[48px] flex items-center justify-between px-4 z-10 transition-all duration-700 border-b
          ${isAurora
            ? 'bg-[#0e0824]/50 border-[#5a4a3025]'
            : 'bg-[var(--bg-base)] border-[var(--bg-card)] neon-divider'}
        `}
          style={isAurora ? {} : undefined}
        >
          <div className="flex items-center gap-3">
            {/* 标题图标 */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-700
              ${isAurora
                ? 'border border-[#c9a04544] bg-[#1a1030]'
                : 'border-[length:var(--ui-border-width)] border-[var(--neon-pink)] bg-[var(--bg-input)] shadow-[0_0_8px_var(--neon-pink-glow)]'}
            `}>
              {isAurora ? (
                /* Aurora: 彩窗花球 */
                <svg viewBox="0 0 80 80" fill="none" className="w-[24px] h-[24px]"
                  style={{ animation: 'roseSpin 20s linear infinite' }}>
                  <style>{`@keyframes roseSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                  <circle cx="40" cy="40" r="10" fill="#b87530" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M40,30 Q48,24 50,30 Q52,36 47,40 Z" fill="#7b4fa0" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M50,40 Q56,32 60,40 Q56,48 50,40 Z" fill="#a0455a" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M47,50 Q52,56 40,50 Q36,52 40,47 Z" fill="#3a7040" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M33,50 Q28,56 20,50 Q24,44 30,47 Z" fill="#3a5090" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M20,40 Q14,32 20,30 Q24,36 30,33 Z" fill="#b87530" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M30,30 Q24,24 33,20 Q36,28 30,30 Z" fill="#7b4fa0" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M40,14 Q48,10 50,18 Q55,26 40,22 Z" fill="#a0455a" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M60,28 Q66,24 62,34 Q60,42 52,28 Z" fill="#3a7040" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M66,52 Q62,58 54,52 Q48,48 58,42 Z" fill="#3a5090" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M40,70 Q32,66 28,62 Q30,54 40,58 Z" fill="#b87530" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M14,52 Q10,46 18,42 Q26,40 22,50 Z" fill="#7b4fa0" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <path d="M12,28 Q16,22 24,28 Q29,35 18,34 Z" fill="#a0455a" fillOpacity="0.55" stroke="#c49a40" strokeWidth="1.5" />
                  <circle cx="40" cy="40" r="38" fill="none" stroke="#c49a40" strokeWidth="1" opacity="0.5" />
                  <circle cx="40" cy="40" r="20" fill="none" stroke="#c49a40" strokeWidth="0.8" opacity="0.4" />
                </svg>
              ) : isIron ? (
                /* Iron: 扫描机械探头 */
                <svg viewBox="0 0 28 28" fill="none" className="w-[22px] h-[22px]">
                  <style>{`
                    @keyframes probeScan { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    @keyframes probePing { 0%,100% { r: 3; opacity: 0.6; } 50% { r: 9; opacity: 0; } }
                  `}</style>
                  {/* 探头主体 */}
                  <circle cx="14" cy="14" r="10" fill="#1a1015" stroke="#c03030" strokeWidth="1.5" />
                  <circle cx="14" cy="14" r="5" fill="none" stroke="#e04840" strokeWidth="1" strokeDasharray="4 2" />
                  <circle cx="14" cy="14" r="2" fill="#e0484088" />
                  {/* 扫描波 */}
                  <circle cx="14" cy="14" r="3" fill="none" stroke="#e04840" strokeWidth="1" style={{animation:'probePing 2s ease-out infinite'}} />
                  {/* 旋转扫描线 */}
                  <line x1="14" y1="14" x2="14" y2="4" stroke="#e04840" strokeWidth="1.5" strokeLinecap="round"
                    style={{animation:'probeScan 3s linear infinite',transformOrigin:'14px 14px'}} />
                  {/* 探头外框 */}
                  <rect x="2" y="2" width="24" height="24" rx="3" fill="none" stroke="#c0303050" strokeWidth="1" />
                  <circle cx="14" cy="14" r="1" fill="#ff6040" />
                </svg>
              ) : isPixel ? (
                /* Pixel: 盾牌双剑图标 */
                <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]">
                  {/* 盾牌 */}
                  <path d="M5,6 L12,3 L19,6 L19,13 C19,17 12,21 12,21 C12,21 5,17 5,13 Z" fill="#5078e030" stroke="#e8e8f0" strokeWidth="1.5" />
                  {/* 交叉双剑 */}
                  <line x1="8" y1="4" x2="16" y2="16" stroke="#f0c848" strokeWidth="1.2" />
                  <line x1="16" y1="4" x2="8" y2="16" stroke="#f0c848" strokeWidth="1.2" />
                  {/* 剑柄 */}
                  <line x1="8" y1="4" x2="7" y2="2" stroke="#e8e8f0" strokeWidth="1" />
                  <line x1="16" y1="4" x2="17" y2="2" stroke="#e8e8f0" strokeWidth="1" />
                </svg>
              ) : isGear ? (
                /* Gear: 活塞气缸图标 */
                <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px]">
                  <style>{`@keyframes pistonPump{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
                  {/* 气缸 */}
                  <rect x="5" y="3" width="14" height="12" rx="2" fill="#b8860b15" stroke="#b8860b" strokeWidth="1.3"/>
                  {/* 活塞杆 */}
                  <line x1="12" y1="15" x2="12" y2="21" stroke="#d4a030" strokeWidth="1.5"/>
                  {/* 活动活塞头 */}
                  <rect x="7" y="4" width="10" height="3" rx="1" fill="#d4a03030" stroke="#d4a030" strokeWidth="1" style={{animation:'pistonPump 0.5s ease-in-out infinite'}}/>
                  {/* 飞轮 */}
                  <circle cx="12" cy="21" r="3" fill="none" stroke="#c86030" strokeWidth="1"/>
                  <circle cx="12" cy="21" r="1" fill="#c8603088"/>
                </svg>
              ) : isRelic ? (
                /* Relic: 双头鹰Aquila图标 */
                <svg viewBox="0 0 28 28" fill="none" className="w-[22px] h-[22px]">
                  <path d="M14,3 L11,9 L8,6 L5,12 L2,8 L1,14 L5,14 L8,10 L10,16 L7,20 L14,18 L21,20 L18,16 L20,10 L23,14 L27,14 L26,8 L23,12 L20,6 L17,9 Z"
                    fill="#a0805020" stroke="#a08050" strokeWidth="1.3" strokeLinejoin="round"/>
                  <circle cx="14" cy="12" r="1.8" fill="#a0805060" stroke="none"/>
                </svg>
              ) : (
                /* Cyberpunk: 齿轮图标 */
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  className="w-[18px] h-[18px] text-[var(--neon-pink)]">
                  <circle cx="12" cy="12" r="10" strokeDasharray="4 3.5" strokeWidth="2"
                    className="origin-center animate-[spin_8s_linear_infinite]" />
                  <circle cx="12" cy="12" r="7" strokeWidth="1" />
                  <circle cx="10" cy="14" r="1.5" fill="currentColor" stroke="none" />
                  <path d="M11.5 14V8.5l3.5-1v2" strokeWidth="1.5" />
                </svg>
              )}
            </div>

            <div className="flex flex-col min-w-0 relative">
              {/* 标题底层暖金灯光 */}
              {isAurora && (
                <div className="absolute -inset-x-6 -inset-y-2 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse 120px 40px at 30px 50%, rgba(220,180,100,0.12), transparent 70%)',
                  }}
                />
              )}
              <h1 className={`relative font-display font-bold text-[17px] uppercase tracking-[0.12em] leading-none transition-all duration-700
                ${isAurora
                  ? 'text-[#dfc890]'
                  : isIron
                    ? 'text-[#e04840]'
                    : isPixel
                      ? 'text-[#f0c848] pixel-title-float'
                      : 'text-neon-logo glitch-title ' + (gameState.glitchEnabled ? 'glitch-title-active' : '')
                }`}
                data-text={(isAurora || isIron || isPixel) ? undefined : 'Mechanique'}
                style={isAurora ? {
                  fontFamily: "'Cormorant Garamond', 'Times New Roman', 'Noto Serif SC', serif",
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                  fontWeight: 500, fontSize: '19px', fontStyle: 'italic',
                } : isIron ? {
                  fontFamily: "'Saira Condensed', 'Share Tech Mono', 'Noto Sans SC', sans-serif",
                  textShadow: '0 0 4px rgba(224,72,64,0.3)',
                  fontWeight: 600, fontSize: '19px', letterSpacing: '0.18em',
                  textTransform: 'uppercase' as const,
                } : isPixel ? {
                  fontFamily: "'Press Start 2P', monospace",
                  textShadow: '2px 2px 0 #000',
                  fontWeight: 400, fontSize: '12px', letterSpacing: '0.05em',
                } : isRelic ? {
                  fontFamily: "'Orbitron', 'Cinzel', sans-serif",
                  textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                  fontWeight: 700, fontSize: '15px', letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                  color: '#3a2810',
                } : {}}
              >
                {isAurora ? 'M é c h a n i q u e' : isIron ? 'MECHANIQUE' : isPixel ? 'MECHANIQUE' : isGear ? 'Mechanique' : isRelic ? 'MECHANIQUE' : 'Mechanique'}
              </h1>
              <span className={`text-[10px] tracking-[0.15em] transition-all duration-700
                ${isAurora ? 'text-[#c9a04599]' : isIron ? 'text-[#b8604099]' : 'text-[var(--text-secondary)]'}
              `}
                style={isAurora ? { fontFamily: "'Noto Serif SC', 'Georgia', serif", fontStyle: 'italic' }
                  : isIron ? { fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.2em' }
                  : isPixel ? { fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }
                  : isGear ? { fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic', fontSize: '9px' }
                  : isRelic ? { fontFamily: "'Orbitron', 'Cinzel', sans-serif", fontSize: '7px', letterSpacing: '0.15em', textTransform: 'uppercase' as const }
                  : {}}
              >
                {isAurora ? '兔 子 与 水 星 之 谣' : isIron ? 'R A V E N // C4-621' : isPixel ? '★ ぼうけんの しょ ★' : isGear ? 'The Clockwork Chronicle' : isRelic ? 'IMPERIALIS · SANCTUS' : '兔 子 与 水 星 之 谣'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[var(--text-dim)]">
            <button
              className={`hover:text-[var(--color-main)] transition-colors ${gameState.isMobileSimulated ? 'text-[var(--color-main)]' : ''}`}
              onClick={() => setGameState(prev => ({ ...prev, isMobileSimulated: !prev.isMobileSimulated }))}
            >
              <MonitorSmartphone size={18} />
            </button>
            <button
              className="hover:text-[var(--color-main)] transition-colors"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen();
                }
              }}
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {/* ═══════ Desktop Sidebar ═══════ */}
          {!isMobileLayout && (
            <aside className={`flex flex-col w-[64px] py-4 z-10 shrink-0 transition-all duration-700 border-r
              ${isAurora
                ? 'bg-[#0e0824]/30 border-[#c9a04512]'
                : 'bg-[var(--bg-base)] border-[var(--bg-card)]'}
            `}>
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                const iconData = iconSet[item.iconKey];
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as ViewType)}
                    className={`p-3 mx-2 mb-2 rounded transition-all duration-500 group relative flex justify-center
                      ${isAurora
                        ? isActive ? 'text-[#dfc890]' : 'text-[var(--text-dim)] hover:text-[#c9a04588]'
                        : isIron
                          ? isActive ? 'text-[#e04840]' : 'text-[var(--text-dim)] hover:text-[#c0303066]'
                          : isActive ? 'bg-white/10' : 'text-[var(--text-dim)] hover:text-[var(--text-secondary)] hover:bg-white/5'
                      }
                    `}
                    style={isActive ? (
                      isAurora
                        ? { borderLeft: '2px solid #c9a04555', boxShadow: 'inset 0 0 12px rgba(201,160,69,0.06)' }
                        : isIron
                          ? { borderLeft: '2px solid #c0303055', boxShadow: 'inset 0 0 12px rgba(192,48,48,0.08)' }
                          : { color: item.color, borderColor: item.color, boxShadow: `0 0 8px ${item.color}40`, borderWidth: '1px', borderStyle: 'solid' }
                    ) : { border: '1px solid transparent' }}
                    title={item.label}
                  >
                    {(isAurora || isIron) && isActive && (
                      <div className="absolute inset-0 pointer-events-none opacity-15 rounded"
                        style={{ background: `radial-gradient(circle at 50% 50%, ${isIron ? 'rgba(224,72,64,0.3)' : 'rgba(201,160,69,0.4)'}, transparent 60%)` }} />
                    )}
                    <svg viewBox="0 0 24 24" fill="none"
                      stroke={isActive ? (isAurora ? '#dfc890' : isIron ? '#e04840' : item.color) : 'currentColor'}
                      strokeWidth={(isAurora || isIron) ? 1.3 : 1.8}
                      strokeLinecap="round" strokeLinejoin="round"
                      className="w-[22px] h-[22px]"
                      style={isActive && (isAurora || isIron) ? { filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' } : { opacity: isActive ? 1 : 0.5 }}
                    >
                      {iconData.paths.map((d, i) => <path key={i} d={d} stroke={isActive && (isAurora||isIron) ? (i===0 ? (isIron?'#e04840':'#dfc890') : (isIron?'#c03030':'#c9a045')) : 'currentColor'} strokeWidth={(isAurora||isIron) ? (i===0 ? 1.4 : 1) : undefined} />)}
                      {iconData.circles.map((c, i) => <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={isActive && (isAurora||isIron) ? (isIron?'#c0303022':'#c9a04522') : 'none'} />)}
                    </svg>
                  </button>
                );
              })}
            </aside>
          )}

          {/* ═══════ Main Content Area ═══════ */}
          <main className="flex-1 relative overflow-auto pb-16 md:pb-0 h-full w-full">
            {/* Aurora 花雨特效层 */}
            {isAurora && gameState.glitchEnabled && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                {Array.from({length:20}).map((_,i) => (
                  <div key={i} className="absolute"
                    style={{
                      left: `${Math.random()*95}%`,
                      top: `-${Math.random()*20}px`,
                      width: `${4+Math.random()*8}px`,
                      height: `${6+Math.random()*12}px`,
                      background: `radial-gradient(ellipse, ${['#c9a045','#dfc890','#e0c060','#b8934a','#8b5cb8','#b85868'][i%6]}44, transparent)`,
                      borderRadius: '50% 0 50% 0',
                      animation: `auroraPetalFall ${8+Math.random()*14}s ${-Math.random()*12}s infinite linear`,
                      opacity: 0,
                      '--drift': `${(Math.random()-0.5)*60}px`,
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            )}
            {/* Iron 扫描线特效层 */}
            {isIron && gameState.glitchEnabled && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                {/* Horizontal scan lines */}
                {Array.from({length:6}).map((_,i) => (
                  <div key={i} className="absolute left-0 right-0"
                    style={{
                      height: '2px',
                      top: `${10+i*16}%`,
                      background: 'linear-gradient(90deg, transparent, rgba(224,72,64,0.12), rgba(255,80,64,0.18), rgba(224,72,64,0.12), transparent)',
                      animation: `ironScanH ${3+i*1.5}s ${-i*0.8}s linear infinite`,
                      opacity: 0,
                    }}
                  />
                ))}
                {/* Vertical scan reticle */}
                <div className="absolute top-0 bottom-0" style={{
                  width: '1px', left: '50%',
                  background: 'linear-gradient(180deg, transparent, rgba(224,72,64,0.1), transparent)',
                  animation: 'ironScanV 4s linear infinite',
                }} />
                {/* Corner target brackets */}
                {['tl','tr','bl','br'].map((pos,i) => {
                  const c = {tl:'top-4 left-4',tr:'top-4 right-4',bl:'bottom-4 left-4',br:'bottom-4 right-4'}[pos];
                  const rot = {tl:'0',tr:'90',bl:'-90',br:'180'}[pos];
                  return (
                    <div key={pos} className={`absolute ${c} w-6 h-6 opacity-20`}
                      style={{transform:`rotate(${rot}deg)`}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#e04840" strokeWidth="1.5">
                        <line x1="2" y1="2" x2="2" y2="10" /><line x1="2" y1="2" x2="10" y2="2" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="h-full w-full mx-auto p-2 md:p-4 relative pb-[80px]">
              {currentView === 'home' && <HomeView gameState={gameState} setGameState={setGameState} />}
              {currentView === 'harassment' && <HarassmentView />}
              {currentView === 'items' && <ItemsView />}
              {currentView === 'residents' && <ResidentsView gameState={gameState} setGameState={setGameState} />}
              {currentView === 'tasks' && <TasksView />}
              {currentView === 'scores' && <ScoresView />}
              {currentView === 'settings' && <SettingsView gameState={gameState} setGameState={setGameState} />}
            </div>
          </main>
        </div>

        {/* ═══════ Mobile Bottom Navigation ═══════ */}
        {isMobileLayout && (
          <nav className={`absolute bottom-0 w-full h-[64px] flex justify-around items-center z-20 transition-all duration-700 border-t
            ${isAurora
              ? 'bg-[#0e0824]/50 border-[#c9a04512]'
              : 'bg-[var(--bg-base)] border-[var(--bg-card)] neon-divider'}
          `}>
            {navItems.map((item) => {
              const iconData = iconSet[item.iconKey];
              const isActive = currentView === item.id;
              return (
                 <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewType)}
                  className="p-2 flex flex-col items-center justify-center transition-colors"
                  style={isActive ? { color: isAurora ? '#dfc890' : item.color } : { color: 'var(--text-dim)' }}
                >
                  <svg viewBox="0 0 24 24" fill="none"
                    stroke={isActive ? (isAurora ? '#dfc890' : item.color) : 'currentColor'}
                    strokeWidth={isAurora ? 1.3 : 1.8} strokeLinecap="round" strokeLinejoin="round"
                    className="w-[22px] h-[22px] mb-1"
                  >
                    {iconData.paths.map((d, i) => <path key={i} d={d} />)}
                    {iconData.circles.map((c, i) => <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="none" />)}
                  </svg>
                  {isActive && <div className="w-1 h-1 rounded-full" style={{ backgroundColor: isAurora ? '#c9a045' : item.color }}></div>}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
