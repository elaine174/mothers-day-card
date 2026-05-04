'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function getDaysLeft(): number {
  const now    = new Date();
  const target = new Date(2026, 4, 10);
  const diff   = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export default function LandingPage() {
  const router     = useRouter();
  const [daysLeft, setDaysLeft] = useState(0);
  const [ready,    setReady]    = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visits,   setVisits]   = useState(0);
  const [isInApp,  setIsInApp]  = useState(false);

  useEffect(() => {
    setDaysLeft(getDaysLeft());
    const ua = navigator.userAgent;
    const inApp = /Lark|BytedanceMicroApp|BytedanceWebview|MicroMessenger|FBAN|FBAV|Line\//.test(ua);
    setIsInApp(inApp);
    const checkSize = () => setIsMobile(window.innerWidth < 640);
    checkSize();
    window.addEventListener('resize', checkSize);
    const t = setTimeout(() => setReady(true), 100);

    if (!sessionStorage.getItem('md-visited')) {
      sessionStorage.setItem('md-visited', '1');
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'visit' }),
      }).catch(() => {});
    }
    fetch('/api/stats').then(r => r.json()).then(d => setVisits(d.visits || 0)).catch(() => {});

    return () => { clearTimeout(t); window.removeEventListener('resize', checkSize); };
  }, []);

  return (
    <div style={{
      height: '100dvh', width: '100%',
      position: 'relative', overflow: 'hidden',
      fontFamily: '"Noto Sans TC","PingFang TC",system-ui,sans-serif',
    }}>

      {/* ── 背景圖：全螢幕（WebP 優先，JPG 備援）── */}
      <picture>
        <source srcSet="/landing-hero.webp" type="image/webp" />
        <img
          src="/landing-hero.jpg"
          alt="Mother's Day"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            zIndex: 0,
          }}
        />
      </picture>

      {/* ── 底部漸層遮罩（讓下方 bar 自然融入）── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: isMobile ? '28%' : '24%',
        background: 'linear-gradient(to top, rgba(252,207,230,0.98) 0%, rgba(252,220,238,0.7) 55%, transparent 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }}/>

      {/* ── Lark / In-app 瀏覽器提示 ── */}
      {isInApp && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(30,20,10,0.88)', backdropFilter: 'blur(8px)',
          padding: '14px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#FFD580', textAlign: 'center' }}>
            ⚠️ 請用預設瀏覽器開啟
          </p>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.7 }}>
            在 Lark 內無法儲存照片或分享 LINE
          </p>
          <div style={{
            marginTop: 2, padding: '8px 16px', borderRadius: 10,
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            fontSize: 12, color: '#fff', lineHeight: 1.8, textAlign: 'center',
          }}>
            📱 iOS：右上角 <b>⋯</b> → <b>在 Safari 中開啟</b><br/>
            🤖 Android：右上角 <b>⋯</b> → <b>用瀏覽器開啟</b>
          </div>
        </div>
      )}

      {/* ── 右上角：倒數 + 人數（並排）── */}
      {ready && (
        <div style={{
          position: 'absolute',
          top: isMobile ? 14 : 18,
          right: isMobile ? 14 : 24,
          zIndex: 20,
          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8,
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          {/* 共用 badge 樣式 */}
          {daysLeft > 0 && (
            <div style={{
              padding: isMobile ? '5px 11px' : '6px 14px',
              borderRadius: 100,
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(201,78,122,0.25)',
              boxShadow: '0 4px 18px rgba(201,78,122,0.12)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: isMobile ? 11 : 12 }}>🗓️</span>
              <span style={{ fontSize: isMobile ? 10 : 11, color: '#A07090' }}>距母親節</span>
              <span style={{ fontSize: isMobile ? 17 : 20, fontWeight: 900, color: '#C94E7A', lineHeight: 1 }}>{daysLeft}</span>
              <span style={{ fontSize: isMobile ? 10 : 11, color: '#A07090' }}>天</span>
            </div>
          )}
          {daysLeft === 0 && (
            <div style={{
              padding: isMobile ? '5px 11px' : '6px 14px', borderRadius: 100,
              background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(201,78,122,0.25)',
              boxShadow: '0 4px 18px rgba(201,78,122,0.12)',
            }}>
              <span style={{ fontSize: isMobile ? 11 : 12, fontWeight: 800, color: '#C94E7A' }}>🌸 今天是母親節！</span>
            </div>
          )}
          {visits > 0 && (
            <div style={{
              padding: isMobile ? '5px 11px' : '6px 14px',
              borderRadius: 100,
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(201,78,122,0.25)',
              boxShadow: '0 4px 18px rgba(201,78,122,0.12)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: '#A07090' }}>已上線製作</span>
              <span style={{ fontSize: isMobile ? 17 : 20, fontWeight: 900, color: '#C94E7A', lineHeight: 1 }}>{visits.toLocaleString()}</span>
              <span style={{ fontSize: isMobile ? 10 : 11, color: '#A07090' }}>人</span>
            </div>
          )}
        </div>
      )}

{/* ── 底部：按鈕 + 說明文字（垂直置中） ── */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? 18 : 26,
        left: 0, right: 0,
        zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        opacity: ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* CTA 按鈕（稍小） */}
        <button
          onClick={() => router.push('/create')}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            padding: isMobile ? '10px 28px' : '12px 36px',
            borderRadius: 100,
            fontSize: isMobile ? 14 : 15,
            fontWeight: 900,
            color: '#fff',
            background: btnHover
              ? 'linear-gradient(135deg,#E05580,#B03060)'
              : 'linear-gradient(135deg,#C94E7A,#A33B61)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: btnHover
              ? '0 8px 28px rgba(201,78,122,0.55), 0 0 0 4px rgba(201,78,122,0.12)'
              : '0 5px 20px rgba(201,78,122,0.4)',
            transform: btnHover ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
            transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            display: 'flex', alignItems: 'center', gap: 7,
            letterSpacing: '0.02em',
          }}
        >
          <span style={{ fontSize: isMobile ? 14 : 16 }}>🌸</span>
          開始製作賀卡
          <span style={{ fontSize: isMobile ? 13 : 15 }}>→</span>
        </button>

        {/* 說明文字（置中） */}
        <p style={{
          margin: 0,
          fontSize: isMobile ? 10 : 11,
          color: 'rgba(140,70,110,0.88)',
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          選角色 ・ 換背景 ・ 一鍵生成祝福語 ・ 分享 LINE
        </p>

        {/* 署名（置中） */}
        <p style={{
          margin: 0,
          fontSize: isMobile ? 10 : 11,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'center',
        }}>
          🐣 管理中心小菜鳥出品 × 天網數位有限公司
        </p>

      </div>
    </div>
  );
}
