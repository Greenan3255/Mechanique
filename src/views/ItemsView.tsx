import React, { useState } from 'react';
import { NeonAccordion } from '../components/NeonAccordion';
import { NeonWindow } from '../components/NeonWindow';
import { Shirt, Cpu, Package } from 'lucide-react';

export function ItemsView() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const categories = [
    {
      title: '梅卡妮可的服装',
      icon: Shirt,
      color: 'var(--neon-pink)',
      items: [
        { id: 'c1', name: '经典黑白女仆装', desc: '出厂默认配备的服装，防尘防溅。', effect: '基础外观，无特殊属性加成。' },
      ]
    },
    {
      title: '核心道具',
      icon: Cpu,
      color: 'var(--color-main)',
      items: [
        { id: 'i1', name: '破损的怀表', desc: '停留在午夜的怀表，表盘上有奇异的划痕。', effect: '时间循环的关键触发物。' }
      ]
    },
    {
      title: '普通道具',
      icon: Package,
      color: 'var(--text-secondary)',
      items: [
        { id: 'n1', name: '特制机油红茶', desc: '虽然看起来像红茶，但喝下去会死人的（对人类而言）。', effect: '梅卡妮可好感度专用道具。' },
        { id: 'n2', name: '全息八音盒', desc: '可以播放老式合成器音乐的小玩意。', effect: '在广场区可触发特殊事件。' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="font-display text-2xl text-[var(--neon-amber)] tracking-widest uppercase border-b border-[var(--bg-card)] pb-2 flex items-center gap-3">
        <div className="w-2 h-6 bg-[var(--neon-amber)] shadow-[0_0_8px_var(--neon-amber-glow)]"></div>
        道具
      </div>

      <div className="flex-1 overflow-auto pr-2">
        {categories.map((cat, idx) => (
          <NeonAccordion 
            key={idx} 
            title={cat.title} 
            icon={cat.icon} 
            colorVar={cat.color}
            defaultExpanded={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {cat.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem({ ...item, color: cat.color })}
                  className="text-left px-3 py-2 bg-[var(--bg-input)] border border-transparent hover:border-[var(--bg-card)] hover:bg-white/5 transition-colors text-[var(--text-primary)] text-sm group"
                >
                  <span className="group-hover:text-glow transition-all" style={{ color: cat.color }}>▸ </span>
                  {item.name}
                </button>
              ))}
              {cat.items.length === 0 && (
                <div className="text-sm text-[var(--text-dim)] italic pl-4">Empty...</div>
              )}
            </div>
          </NeonAccordion>
        ))}
      </div>

      {selectedItem && (
        <NeonWindow title="ITEM INSPECTION" onClose={() => setSelectedItem(null)}>
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold tracking-wider" style={{ color: selectedItem.color, textShadow: `0 0 10px ${selectedItem.color}80` }}>
              {selectedItem.name}
            </h3>
            
            <div>
              <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-1">Description</div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-input)] p-3 rounded border border-[var(--bg-card)]">
                {selectedItem.desc}
              </p>
            </div>

            <div>
              <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-1">Effect</div>
              <p className="text-sm font-bold" style={{ color: selectedItem.color }}>
                {selectedItem.effect}
              </p>
            </div>
          </div>
        </NeonWindow>
      )}
    </div>
  );
}

