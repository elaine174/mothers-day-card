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

  useEffect(() => {
    setDaysLeft(getDaysLeft());
    const checkSize = () => setIsMobile(window.innerWidth < 640);
    checkSize();
    window.addEventListener('resize', checkSize);
    const t = setTimeout(() => setReady(true), 100);

    // 點連結進來就計一次造訪（session 內只算一次）
    if (!sessionStorage.getItem('md-visited')) {
      sessionStorage.setItem('md-visited', '1');
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'visit' }),
      }).catch(() => {});
    }
    // 取得訪問數顯示在首頁
    fetch('/api/stats').then(r => r.json()).then(d => setVisits(d.visits || 0)).catch(() => {});

    return () => { clearTimeout(t); window.removeEventListener('resize', checkSize); };
  }, []);

  return (
    <div style={{
      height: '100dvh', width: '100%',
      position: 'relative', overflow: 'hidden',
      fontFamily: '"Noto Sans TC","PingFang TC",system-ui,sans-serif',
    }}>

      {/* ── 背景圖：限制最大顯示高度，桌機不全占滿螢幕 ── */}
      <img
        src="/landing-hero.png"
        alt="Mother's Day AI Blessing Studio"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          zIndex: 0,
        }}
      />

      {/* ── 底部漸層遮罩 ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: isMobile ? '45%' : '38%',
        background: 'linear-gradient(to top, rgba(255,215,235,0.96) 0%, rgba(255,235,248,0.7) 55%, transparent 100%)',
        zIndex: 1,
      }}/>

      {/* ── 主要內容：固定在底部，不會被推出螢幕 ── */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? '5vh' : '6vh',
        left: 0, right: 0,
        zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0 20px',
        opacity: ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* 倒數計時 */}
        {daysLeft > 0 && (
          <div style={{
            marginBottom: isMobile ? 14 : 18,
            padding: isMobile ? '6px 16px' : '7px 20px', borderRadius: 100,
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(201,78,122,0.22)',
            display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 3px 16px rgba(201,78,122,0.1)',
          }}>
            <span style={{ fontSize: isMobile ? 13 : 15 }}>🗓️</span>
            <span style={{ fontSize: isMobile ? 11 : 13, color: '#A07090' }}>距母親節還有</span>
            <span style={{ fontSize: isMobile ? 18 : 21, fontWeight: 900, color: '#C94E7A', lineHeight: 1 }}>{daysLeft}</span>
            <span style={{ fontSize: isMobile ? 11 : 13, color: '#A07090' }}>天</span>
          </div>
        )}
        {daysLeft === 0 && (
          <div style={{
            marginBottom: isMobile ? 14 : 18,
            padding: isMobile ? '6px 16px' : '7px 20px', borderRadius: 100,
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(201,78,122,0.3)',
          }}>
            <span style={{ fontSize: isMobile ? 13 : 15, fontWeight: 800, color: '#C94E7A' }}>🌸 今天是母親節！快去傳卡片給媽媽吧！</span>
          </div>
        )}

        {/* CTA 按鈕 */}
        <button
          onClick={() => router.push('/create')}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            padding: isMobile ? '13px 36px' : '15px 46px',
            borderRadius: 100,
            fontSize: isMobile ? 15 : 17,
            fontWeight: 900,
            color: '#fff',
            background: btnHover
              ? 'linear-gradient(135deg,#E05580,#B03060)'
              : 'linear-gradient(135deg,#C94E7A,#A33B61)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: btnHover
              ? '0 10px 36px rgba(201,78,122,0.55), 0 0 0 5px rgba(201,78,122,0.12)'
              : '0 6px 26px rgba(201,78,122,0.4)',
            transform: btnHover ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
            transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            display: 'flex', alignItems: 'center', gap: 9,
            letterSpacing: '0.02em',
          }}
        >
          <span style={{ fontSize: isMobile ? 17 : 20 }}>🌸</span>
          開始製作賀卡
          <span style={{ fontSize: isMobile ? 16 : 18 }}>→</span>
        </button>

        <p style={{
          marginTop: isMobile ? 10 : 12,
          fontSize: isMobile ? 10 : 11,
          color: 'rgba(160,112,144,0.8)',
          textAlign: 'center', lineHeight: 1.7,
        }}>
          選角色 ・ 換背景 ・ 一鍵生成祝福語 ・ 分享 LINE
        </p>
      </div>
    </div>
  );
}
