'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/',        label: '活動首頁',   icon: '🏠' },
  { href: '/select',  label: '選擇角色',   icon: '✨' },
  { href: '/gallery', label: '靈感展示牆', icon: '🌸' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:200,
    }}>
      {/* 毛玻璃底板 */}
      <div style={{
        background:'rgba(255,240,248,0.82)',
        backdropFilter:'blur(16px)',
        WebkitBackdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(255,182,193,0.35)',
        boxShadow:'0 2px 20px rgba(255,105,180,0.1)',
      }}>
        <div style={{
          maxWidth:1280,
          margin:'0 auto',
          padding:'0 20px',
          height:60,
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
        }}>

          {/* ── Logo ── */}
          <Link href="/" style={{
            display:'flex', alignItems:'center', gap:8,
            textDecoration:'none',
          }}>
            <span style={{ fontSize:24 }}>🌸</span>
            <div>
              <div style={{
                fontFamily:'Pacifico, cursive',
                fontSize:14,
                background:'linear-gradient(135deg,#FF3D8A,#C084FC)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                lineHeight:1.2,
              }}>
                Mother&apos;s Day Studio
              </div>
              <div style={{
                fontSize:10, color:'#FF91B8', fontWeight:700,
                letterSpacing:'0.08em',
                fontFamily:'Nunito, sans-serif',
              }}>
                AI 祝福創作站 · 2025
              </div>
            </div>
          </Link>

          {/* ── Nav Links ── */}
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            {navItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} style={{
                  display:'flex', alignItems:'center', gap:5,
                  padding:'7px 14px', borderRadius:100,
                  fontFamily:'Nunito, "Noto Sans TC", sans-serif',
                  fontSize:13, fontWeight:700, textDecoration:'none',
                  transition:'all 0.2s',
                  ...(isActive ? {
                    background:'linear-gradient(135deg,#FF69B4,#C084FC)',
                    color:'white',
                    boxShadow:'0 4px 14px rgba(255,105,180,0.35)',
                  } : {
                    color:'#D4448A',
                  }),
                }}>
                  <span>{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

            {/* CTA 按鈕 */}
            <Link href="/select" style={{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'8px 18px', borderRadius:100, marginLeft:6,
              background:'linear-gradient(135deg,#FF69B4,#C084FC)',
              color:'white', fontSize:13, fontWeight:800,
              textDecoration:'none',
              boxShadow:'0 4px 14px rgba(255,105,180,0.38)',
              fontFamily:'Nunito, sans-serif',
              transition:'transform 0.18s, box-shadow 0.18s',
            }}
              className="hidden md:inline-flex"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='scale(1.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='scale(1)'; }}
            >
              💌 立即創作
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
