'use client';

import { useState } from 'react';
import { aiStyleButtons, mockAiRewrite } from '@/lib/aiTexts';
import type { AiTextStyle } from '@/types';

interface AiHelperBotProps {
  currentText: string;
  onTextGenerated: (text: string) => void;
}

/**
 * AI 文案小幫手 — 常駐對話助手
 * TODO: [AI API 串接點] 將 mockAiRewrite() 替換為真實 API 呼叫
 */
export default function AiHelperBot({ currentText, onTextGenerated }: AiHelperBotProps) {
  const [isLoading, setIsLoading]         = useState(false);
  const [activeStyle, setActiveStyle]     = useState<AiTextStyle | null>(null);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const handleGenerate = async (style: AiTextStyle) => {
    setIsLoading(true);
    setActiveStyle(style);
    try {
      const text = await mockAiRewrite(currentText, style);
      setLastGenerated(text);
      onTextGenerated(text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* ── 機器人頭像 + 對話泡泡 ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        {/* 機器人頭像 */}
        <div style={{
          width: 40, height: 40, flexShrink: 0,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF91B8, #C084FC)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
          boxShadow: '0 4px 14px rgba(255,105,180,0.35)',
          animation: 'float 4s ease-in-out infinite',
        }}>
          🤖
        </div>

        {/* 對話泡泡 */}
        <div style={{
          flex: 1,
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '0 16px 16px 16px',
          padding: '8px 12px',
          border: '1px solid rgba(255,182,193,0.35)',
          boxShadow: '0 3px 12px rgba(255,105,180,0.1)',
          position: 'relative',
        }}>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 12, fontWeight: 700, color: '#FF69B4',
            marginBottom: 2,
          }}>AI 文案小幫手</p>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 11, color: 'rgba(120,60,90,0.75)', lineHeight: 1.5,
          }}>
            {currentText.trim().length > 5
              ? '幫你把話說得更動人？選個風格試試吧～'
              : '還沒有想法嗎？我幫你生成一段祝福語 💕'}
          </p>
          {/* 泡泡三角 */}
          <div style={{
            position: 'absolute',
            top: 12, left: -7,
            width: 0, height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderRight: '7px solid rgba(255,255,255,0.85)',
          }}/>
        </div>
      </div>

      {/* ── 風格選擇 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {aiStyleButtons.map((btn: typeof aiStyleButtons[0]) => {
          const isActive   = activeStyle === btn.style;
          const isSpinning = isActive && isLoading;
          const isDone     = isActive && lastGenerated && !isLoading;

          return (
            <button
              key={btn.style}
              onClick={() => handleGenerate(btn.style)}
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 16,
                cursor: isLoading ? 'wait' : 'pointer',
                transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                transform: isActive && !isLoading ? 'scale(1.02)' : 'scale(1)',
                background: isActive
                  ? `linear-gradient(135deg, ${btn.bgColor}, white 80%)`
                  : 'rgba(255,255,255,0.7)',
                border: isActive
                  ? `2px solid ${btn.color}60`
                  : '1.5px solid rgba(255,182,193,0.28)',
                boxShadow: isActive
                  ? `0 4px 16px ${btn.color}28`
                  : '0 2px 6px rgba(255,105,180,0.06)',
              }}
            >
              {/* 圓形 icon 底板 */}
              <div style={{
                width: 32, height: 32, flexShrink: 0,
                borderRadius: '50%',
                background: `${btn.color}18`,
                border: `1.5px solid ${btn.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17,
                animation: isSpinning ? 'spin 0.8s linear infinite' : 'none',
              }}>
                {isSpinning ? '✨' : btn.icon}
              </div>

              {/* 文字 */}
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{
                  fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
                  fontSize: 12, fontWeight: 800,
                  color: isActive ? btn.color : '#C2185B',
                }}>
                  {isSpinning ? 'AI 生成中...' : `${btn.label} ${isDone ? '✓' : ''}`}
                </p>
                <p style={{
                  fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
                  fontSize: 10, color: 'rgba(120,60,90,0.6)',
                }}>
                  {btn.description}
                </p>
              </div>

              {/* 箭頭 */}
              {!isSpinning && (
                <span style={{ fontSize: 12, color: btn.color, opacity: 0.7 }}>›</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 生成成功提示 ── */}
      {lastGenerated && !isLoading && (
        <div style={{
          marginTop: 8,
          padding: '8px 10px',
          borderRadius: 12,
          background: 'rgba(255,240,250,0.9)',
          border: '1px solid rgba(255,182,193,0.35)',
        }}>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 10, color: '#FF69B4', fontWeight: 700, marginBottom: 3,
          }}>✅ 已套用到卡片：</p>
          <p style={{
            fontFamily: '"Noto Sans TC", sans-serif',
            fontSize: 11, color: 'rgba(120,60,90,0.8)', lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {lastGenerated}
          </p>
        </div>
      )}
    </div>
  );
}
