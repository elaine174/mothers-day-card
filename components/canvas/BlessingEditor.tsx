'use client';

import { useRef } from 'react';
import type { Employee } from '@/types';
import AiHelperBot from './AiHelperBot';

interface BlessingEditorProps {
  employee: Employee;
  blessingText: string;
  showName: boolean;
  bgVariant: 'pink' | 'lavender' | 'peach';
  onTextChange: (text: string) => void;
  onShowNameChange: (show: boolean) => void;
  onBgVariantChange: (variant: 'pink' | 'lavender' | 'peach') => void;
}

const bgOptions = [
  { id: 'pink',     label: '粉玫瑰', color: '#FF91B8', grad: 'linear-gradient(135deg,#fff0f5,#fce7f3)', emoji: '🌸' },
  { id: 'lavender', label: '薰衣草', color: '#A78BFA', grad: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', emoji: '💜' },
  { id: 'peach',    label: '暖蜜桃', color: '#FBBF24', grad: 'linear-gradient(135deg,#fff8f0,#ffecd6)', emoji: '🍑' },
] as const;

export default function BlessingEditor({
  employee,
  blessingText,
  showName,
  bgVariant,
  onTextChange,
  onShowNameChange,
  onBgVariantChange,
}: BlessingEditorProps) {
  const MAX_CHARS   = 80;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAiText = (text: string) => {
    onTextChange(text.slice(0, MAX_CHARS));
    setTimeout(() => textareaRef.current?.focus(), 100);
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
      gap: 0,
    }}>

      {/* ── 員工角色資訊卡 ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 14px 10px',
        background: 'linear-gradient(135deg, rgba(255,192,220,0.22), rgba(216,180,254,0.15))',
        borderBottom: '1px solid rgba(255,182,193,0.22)',
      }}>
        <div style={{
          width: 44, height: 44, flexShrink: 0,
          borderRadius: 14,
          background: `${employee.themeColor}20`,
          border: `1.5px solid ${employee.themeColor}45`,
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img
            src={employee.characterImage}
            alt={employee.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 13, fontWeight: 800,
            color: employee.themeColor,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {employee.name} ✨
          </p>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 10, color: 'rgba(120,60,90,0.6)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {employee.department}
          </p>
        </div>
        <span style={{ fontSize: 18 }}>💌</span>
      </div>

      <div style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', scrollbarWidth: 'thin', scrollbarColor: '#FFB6C1 transparent' }}>

        {/* ── 祝福文字輸入 ── */}
        <section>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 11, fontWeight: 800, color: '#D4448A',
            marginBottom: 6, letterSpacing: '0.04em',
          }}>
            ✍️ 想對媽媽說的話
          </p>

          {/* Textarea */}
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            border: '1.5px solid rgba(255,182,193,0.4)',
            boxShadow: '0 3px 12px rgba(255,105,180,0.07)',
          }}>
            <textarea
              ref={textareaRef}
              value={blessingText}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) onTextChange(e.target.value);
              }}
              placeholder="媽媽，謝謝妳一直以來的照顧與陪伴，母親節快樂。"
              rows={3}
              style={{
                width: '100%', padding: '10px 12px',
                background: 'rgba(255,255,255,0.9)',
                resize: 'none', outline: 'none',
                fontFamily: '"Noto Sans TC", sans-serif',
                fontSize: 12, color: '#5A3060',
                lineHeight: 1.75,
                border: 'none',
              }}
            />
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '4px 10px',
              background: 'rgba(255,240,248,0.7)',
              borderTop: '1px solid rgba(255,182,193,0.18)',
            }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 9, color: '#D4448A', opacity: 0.7 }}>
                繁中 / 英文 皆可
              </span>
              <span style={{
                fontFamily: 'Nunito, sans-serif', fontSize: 9, fontWeight: 700,
                color: blessingText.length > MAX_CHARS * 0.9 ? '#FF4444' : '#D4448A',
              }}>
                {blessingText.length} / {MAX_CHARS}
              </span>
            </div>
          </div>

          {/* 快速填入 */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 7 }}>
            {[
              { label: '謝謝妳❤️', text: '媽媽，謝謝妳一直以來的照顧與陪伴，母親節快樂。' },
              { label: '我愛妳💕', text: '媽媽，我愛妳，謝謝妳的付出，母親節快樂！' },
              { label: '辛苦了🌸', text: '媽，這麼多年辛苦了，今天好好休息吧。母親節快樂！' },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => onTextChange(p.text)}
                style={{
                  padding: '4px 10px', borderRadius: 100,
                  fontSize: 10, fontWeight: 700,
                  fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
                  color: '#FF69B4',
                  background: 'rgba(255,240,250,0.8)',
                  border: '1px solid rgba(255,182,193,0.38)',
                  cursor: 'pointer',
                  transition: 'transform 0.18s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── 分隔線 ── */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,182,193,0.4), transparent)',
        }}/>

        {/* ── AI 文案小幫手 ── */}
        <section>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 11, fontWeight: 800, color: '#D4448A',
            marginBottom: 8, letterSpacing: '0.04em',
          }}>
            🤖 AI 幫你寫
          </p>
          <AiHelperBot currentText={blessingText} onTextGenerated={handleAiText} />
        </section>

        {/* ── 顯示名字開關 ── */}
        <section>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: 16,
            background: 'rgba(255,240,250,0.7)',
            border: '1px solid rgba(255,182,193,0.25)',
          }}>
            <div>
              <p style={{
                fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
                fontSize: 11, fontWeight: 800, color: '#D4448A',
              }}>
                顯示我的名字
              </p>
              <p style={{
                fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
                fontSize: 9, color: 'rgba(160,80,110,0.6)',
              }}>
                卡片底部顯示「—{employee.name} 敬上」
              </p>
            </div>
            <button
              onClick={() => onShowNameChange(!showName)}
              style={{
                position: 'relative',
                width: 44, height: 24,
                borderRadius: 100,
                border: 'none', cursor: 'pointer',
                transition: 'background 0.3s',
                background: showName
                  ? 'linear-gradient(135deg, #FF69B4, #C084FC)'
                  : 'rgba(209,213,219,1)',
                flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute',
                top: 3,
                left: showName ? 22 : 3,
                width: 18, height: 18,
                borderRadius: '50%',
                background: 'white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                transition: 'left 0.3s',
              }}/>
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
}
