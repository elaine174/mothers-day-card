'use client';

import { useState } from 'react';
import { decorationItems, decorationCategories } from '@/data/decorations';
import type { DecorationCategory } from '@/types';

interface DecorationPanelProps {
  onAddDecoration: (decorationId: string, icon: string, size: number) => void;
}

export default function DecorationPanel({ onAddDecoration }: DecorationPanelProps) {
  const [activeCategory, setActiveCategory] = useState<DecorationCategory | 'all'>('all');
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const filteredItems =
    activeCategory === 'all'
      ? decorationItems
      : decorationItems.filter((d) => d.category === activeCategory);

  const handleAdd = (id: string, icon: string, size: number) => {
    onAddDecoration(id, icon, size);
    setJustAdded(id);
    setTimeout(() => setJustAdded(null), 700);
  };

  return (
    <aside style={{
      background: 'rgba(255,245,252,0.78)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderRadius: 28,
      border: '1.5px solid rgba(255,182,193,0.35)',
      boxShadow: '0 8px 32px rgba(255,105,180,0.12), 0 2px 8px rgba(255,182,193,0.2)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── 標題 ── */}
      <div style={{
        padding: '14px 14px 10px',
        background: 'linear-gradient(135deg, rgba(255,192,220,0.25), rgba(216,180,254,0.18))',
        borderBottom: '1px solid rgba(255,182,193,0.22)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 22, marginBottom: 3 }}>🎨</div>
        <p style={{
          fontFamily: 'Pacifico, cursive',
          fontSize: 12,
          background: 'linear-gradient(135deg, #FF69B4, #C084FC)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          marginBottom: 2,
        }}>Sticker Shop</p>
        <p style={{
          fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
          fontSize: 10, color: '#D4448A', fontWeight: 700,
        }}>點擊貼紙加入卡片</p>
      </div>

      {/* ── 類別 Tab ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        padding: '8px 8px 6px',
        borderBottom: '1px solid rgba(255,182,193,0.18)',
      }}>
        {[{ id: 'all', label: '全部', icon: '✦' }, ...decorationCategories].map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as DecorationCategory | 'all')}
              style={{
                display: 'flex', alignItems: 'center', gap: 3,
                padding: '3px 8px', borderRadius: 100,
                fontSize: 10, fontWeight: 700,
                fontFamily: 'Nunito, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ...(isActive ? {
                  background: 'linear-gradient(135deg, #FF91B8, #C084FC)',
                  color: 'white',
                  boxShadow: '0 3px 10px rgba(255,105,180,0.3)',
                  transform: 'scale(1.05)',
                } : {
                  background: 'rgba(255,255,255,0.5)',
                  color: '#D4448A',
                  border: '1px solid rgba(255,182,193,0.3)',
                }),
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 貼紙格 ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px 8px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#FFB6C1 transparent',
        maxHeight: 400,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
        }}>
          {filteredItems.map((item) => {
            const added = justAdded === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleAdd(item.id, item.icon, item.defaultSize)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  padding: '10px 6px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                  transform: added ? 'scale(1.15)' : 'scale(1)',
                  background: added
                    ? 'linear-gradient(135deg, rgba(255,192,220,0.45), rgba(216,180,254,0.35))'
                    : 'rgba(255,255,255,0.65)',
                  border: added
                    ? '2px solid rgba(255,105,180,0.5)'
                    : '1.5px solid rgba(255,182,193,0.28)',
                  boxShadow: added
                    ? '0 6px 18px rgba(255,105,180,0.25)'
                    : '0 2px 8px rgba(255,105,180,0.06)',
                }}
              >
                {/* 貼紙圓形底板 */}
                <div style={{
                  width: 44, height: 44,
                  borderRadius: '50%',
                  background: added
                    ? 'linear-gradient(135deg, rgba(255,182,193,0.4), rgba(216,180,254,0.3))'
                    : 'rgba(255,240,250,0.8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                  boxShadow: '0 2px 8px rgba(255,105,180,0.12)',
                  transition: 'transform 0.2s',
                }}>
                  {item.icon}
                </div>
                {/* 名稱 */}
                <span style={{
                  fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
                  fontSize: 9, fontWeight: 700,
                  color: added ? '#FF69B4' : '#D4448A',
                  lineHeight: 1.2,
                  textAlign: 'center',
                }}>
                  {added ? '✓ 已加入' : item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 底部提示 ── */}
      <div style={{
        padding: '7px 12px 10px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,182,193,0.18)',
      }}>
        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 9, color: 'rgba(180,80,130,0.6)', fontWeight: 600,
        }}>
          💡 雙擊卡片上的貼紙可移除
        </p>
      </div>
    </aside>
  );
}
