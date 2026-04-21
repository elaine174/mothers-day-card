'use client';

import { useState } from 'react';
import type { Employee } from '@/types';
import { DEFAULT_SHARE_TEXT } from '@/lib/aiTexts';

interface DownloadActionsProps {
  employee: Employee;
  onDownload: () => Promise<void>;
}

export default function DownloadActions({ employee, onDownload }: DownloadActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone,  setDownloadDone]  = useState(false);
  const [copied,        setCopied]        = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload();
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 4000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(DEFAULT_SHARE_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── 主下載按鈕 ── */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '15px 20px',
          borderRadius: 100,
          border: 'none',
          cursor: isDownloading ? 'wait' : 'pointer',
          fontFamily: 'Pacifico, cursive',
          fontSize: 16,
          color: 'white',
          letterSpacing: '0.02em',
          transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          transform: isDownloading ? 'scale(0.97)' : 'scale(1)',
          background: downloadDone
            ? 'linear-gradient(135deg, #34D399, #10B981)'
            : isDownloading
            ? 'linear-gradient(135deg, #FBCFE8, #DDD6FE)'
            : 'linear-gradient(135deg, #FF3D8A, #FF69B4 40%, #C084FC)',
          boxShadow: downloadDone
            ? '0 6px 28px rgba(52,211,153,0.4)'
            : isDownloading
            ? 'none'
            : `0 8px 32px rgba(255,60,140,0.4), 0 0 0 3px rgba(255,255,255,0.25) inset`,
          animation: (!isDownloading && !downloadDone) ? 'pulsePink 2s infinite' : 'none',
        }}
      >
        <span style={{ fontSize: 22 }}>
          {downloadDone ? '✅' : isDownloading ? '✨' : '💌'}
        </span>
        <span>
          {downloadDone
            ? '下載成功！快傳給媽媽吧'
            : isDownloading
            ? '生成卡片中...'
            : '遞送卡片'}
        </span>
      </button>

      {/* ── 下載成功後慶祝提示 ── */}
      {downloadDone && (
        <div style={{
          textAlign: 'center',
          padding: '10px 16px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.75)',
          border: '1.5px solid rgba(52,211,153,0.35)',
          animation: 'fadeUp 0.4s ease-out',
        }}>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 13, fontWeight: 800, color: '#059669',
            marginBottom: 3,
          }}>🎉 圖片已儲存到你的裝置！</p>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 11, color: 'rgba(6,78,59,0.7)',
          }}>
            打開 LINE → 找到媽媽的對話 → 傳送圖片 💕
          </p>
        </div>
      )}

      {/* ── LINE 分享輔助 ── */}
      <div style={{
        borderRadius: 20,
        overflow: 'hidden',
        border: '1.5px solid rgba(52,199,89,0.3)',
        background: 'rgba(240,255,248,0.65)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px 8px',
        }}>
          <span style={{ fontSize: 18 }}>💬</span>
          <div>
            <p style={{
              fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
              fontSize: 12, fontWeight: 800, color: '#16a34a',
            }}>
              搭配文案傳給媽媽
            </p>
            <p style={{
              fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
              fontSize: 10, color: 'rgba(6,78,59,0.6)',
            }}>
              複製下方文字，傳給媽媽時一起附上 🌸
            </p>
          </div>
        </div>

        {/* 文案預覽 */}
        <div style={{
          margin: '0 10px 10px',
          padding: '8px 10px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(52,199,89,0.2)',
          fontFamily: '"Noto Sans TC", sans-serif',
          fontSize: 12, color: '#374151',
          lineHeight: 1.6,
        }}>
          {DEFAULT_SHARE_TEXT}
        </div>

        {/* 複製按鈕 */}
        <button
          onClick={handleCopy}
          style={{
            width: '100%',
            padding: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 12, fontWeight: 800,
            cursor: 'pointer',
            border: 'none',
            borderTop: '1px solid rgba(52,199,89,0.2)',
            transition: 'background 0.2s',
            background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(52,199,89,0.08)',
            color: copied ? '#059669' : '#16a34a',
          }}
        >
          <span>{copied ? '✅' : '📋'}</span>
          <span>{copied ? '已複製！去 LINE 貼上吧 🎉' : '複製文案'}</span>
        </button>
      </div>
    </div>
  );
}
