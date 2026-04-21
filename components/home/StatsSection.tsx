'use client';

import { useEffect, useState } from 'react';
import { activityStats, statsConfig } from '@/data/stats';

/** 數字動畫 counter */
function AnimatedNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{current.toLocaleString()}</span>;
}

export default function StatsSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 px-6" style={{ background: 'rgba(255,255,255,0.7)' }}>
      <div className="max-w-4xl mx-auto">
        {/* 標題 */}
        <div className="text-center mb-10">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 18px', borderRadius: 100, marginBottom: 12,
            background: 'rgba(255,255,255,0.6)',
            border: '1.5px solid rgba(255,182,193,0.4)',
            backdropFilter: 'blur(8px)',
            color: '#D4448A', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.12em',
            fontFamily: 'Nunito, sans-serif',
          }}>
            💝 ACTIVITY STATS
          </div>
          <h2 style={{
            fontFamily: 'Pacifico, cursive',
            fontSize: 'clamp(22px, 3.5vw, 36px)',
            background: 'linear-gradient(135deg, #D4006B, #FF69B4, #C084FC)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: 6,
          }}>
            Activity Stats
          </h2>
          <p style={{ fontFamily: 'Nunito, "Noto Sans TC", sans-serif', fontWeight: 700, color: '#C2185B', fontSize: 14, letterSpacing: '0.1em' }}>
            活動參與狀況 🎉
          </p>
          <p style={{ fontFamily: 'Nunito, "Noto Sans TC", sans-serif', fontSize: 13, color: 'rgba(160,60,100,0.65)', marginTop: 4 }}>
            一起為媽媽送上最溫暖的祝福
          </p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {statsConfig.map((stat, i) => (
            <div
              key={stat.key}
              className="relative overflow-hidden rounded-3xl p-6 text-center"
              style={{
                background: 'white',
                boxShadow: '0 8px 30px rgba(255,105,180,0.12)',
                border: '1px solid rgba(255,182,193,0.3)',
                animationDelay: `${i * 0.15}s`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`,
              }}
            >
              {/* 背景裝飾圓 */}
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10"
                style={{
                  background: stat.color,
                  transform: 'translate(30%, -30%)',
                }}
              />

              {/* icon */}
              <div className="text-4xl mb-3">{stat.icon}</div>

              {/* 數字 */}
              <div
                className="text-5xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                {visible ? (
                  <AnimatedNumber target={activityStats[stat.key]} />
                ) : (
                  0
                )}
                <span className="text-2xl ml-1">{stat.unit}</span>
              </div>

              {/* 標籤 */}
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>

              {/* 底部進度條裝飾 */}
              <div
                className="mt-4 h-1.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.06)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}88)`,
                    width: visible ? '80%' : '0%',
                    transitionDelay: `${i * 0.15 + 0.3}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 底部說明 */}
        <p className="text-center text-sm text-pink-300 mt-6">
          📊 數據每日更新 · 快來加入我們吧！
        </p>
      </div>
    </section>
  );
}
