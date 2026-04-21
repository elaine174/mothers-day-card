'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { employeeProfiles } from '@/data/employees';

// ── 三排弧形座標（x: 水平%, y: 離底部%） ──────────────────────
const backRow = [
  {x:3, y:62},{x:12,y:66},{x:21,y:69},{x:30,y:71},{x:39,y:72},
  {x:61,y:72},{x:70,y:71},{x:79,y:69},{x:88,y:66},{x:97,y:62},
];
const midRow = [
  {x:1, y:30},{x:9, y:34},{x:17,y:37},{x:26,y:39},{x:35,y:40},{x:44,y:41},
  {x:56,y:41},{x:65,y:40},{x:74,y:39},{x:83,y:37},{x:91,y:34},{x:99,y:30},
];
const frontRow = [
  {x:7, y:3},{x:18,y:7},{x:29,y:10},{x:40,y:12},
  {x:60,y:12},{x:71,y:10},{x:82,y:7},{x:93,y:3},
];

const delays = ['0s','0.5s','1s','1.5s','2s','0.3s','0.8s','1.3s','1.8s','2.3s','0.6s','1.1s'];

// ── 飄落花瓣 ──────────────────────────────────────────────────
const petals = [
  {e:'🌸',left:'6%',  dur:'7s', delay:'0s'  },
  {e:'🌸',left:'16%', dur:'9s', delay:'2.2s'},
  {e:'🌺',left:'28%', dur:'8s', delay:'0.5s'},
  {e:'🌸',left:'43%', dur:'11s',delay:'3.1s'},
  {e:'🌷',left:'57%', dur:'8s', delay:'1.5s'},
  {e:'🌸',left:'68%', dur:'10s',delay:'4s'  },
  {e:'💗',left:'80%', dur:'9s', delay:'0.8s'},
  {e:'🌸',left:'91%', dur:'7s', delay:'2.5s'},
];

// ── 角色針元件 ────────────────────────────────────────────────
function CharacterPin({
  employee, x, y, baseW, opacity, zIndex, floatDelay,
}: {
  employee: typeof employeeProfiles[0];
  x: number; y: number;
  baseW: number; opacity: number; zIndex: number; floatDelay: string;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => {
        sessionStorage.setItem('selectedEmployee', JSON.stringify(employee));
        router.push(`/canvas?employee=${employee.id}`);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: `${x}%`,
        bottom: `${y}%`,
        transform: `translateX(-50%) scale(${hovered ? 1.12 : 1})`,
        transformOrigin: 'bottom center',
        zIndex: hovered ? 80 : zIndex,
        opacity,
        transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), filter 0.18s',
        cursor: 'pointer',
        animation: `float ${5 + ((x * 7) % 3)}s ease-in-out ${floatDelay} infinite`,
        filter: hovered
          ? `drop-shadow(0 10px 24px ${employee.themeColor}aa)`
          : `drop-shadow(0 6px 14px ${employee.themeColor}66)`,
      }}
    >
      {/* 名字氣泡 */}
      {hovered && (
        <div style={{
          position:'absolute', bottom:'108%', left:'50%',
          transform:'translateX(-50%)',
          whiteSpace:'nowrap',
          background:'rgba(255,255,255,0.97)',
          color: employee.themeColor,
          borderRadius:14, padding:'4px 14px',
          fontSize:11, fontWeight:800,
          fontFamily:'Nunito, sans-serif',
          boxShadow:`0 4px 18px ${employee.themeColor}50`,
          border:`2px solid ${employee.themeColor}55`,
          animation:'popIn 0.2s ease-out',
          pointerEvents:'none', zIndex:120,
        }}>
          {employee.name} ✨
          <div style={{
            position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)',
            width:0, height:0,
            borderLeft:'5px solid transparent',
            borderRight:'5px solid transparent',
            borderTop:`5px solid ${employee.themeColor}55`,
          }}/>
        </div>
      )}

      {/* 角色圖 */}
      <img
        src={employee.characterImage}
        alt={employee.name}
        width={baseW}
        style={{ display:'block', userSelect:'none', maxWidth:'none' }}
        draggable={false}
      />

      {/* 名字標籤 */}
      <div style={{
        textAlign:'center', marginTop:1,
        fontSize: Math.max(8, Math.round(baseW * 0.13)) + 'px',
        fontWeight: 800,
        fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
        color: hovered ? employee.themeColor : 'rgba(255,255,255,0.97)',
        textShadow: hovered
          ? `0 1px 6px ${employee.themeColor}80, 0 0 12px rgba(255,255,255,0.9)`
          : '0 1px 5px rgba(80,20,40,0.75), 0 0 10px rgba(0,0,0,0.4)',
        transition:'color 0.15s, text-shadow 0.15s',
        whiteSpace:'nowrap',
        letterSpacing:'0.03em',
      }}>
        {employee.name}
      </div>
    </div>
  );
}

// ── 主元件 ────────────────────────────────────────────────────
export default function HeroBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const backEmps  = employeeProfiles.slice(0,  10);
  const midEmps   = employeeProfiles.slice(10, 22);
  const frontEmps = employeeProfiles.slice(22, 30);

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      overflow: 'hidden',
    }}>

      {/* ── 主視覺背景圖 ── */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage: "url('/主視覺.png')",
        backgroundSize:'cover',
        backgroundPosition:'center top',
        backgroundRepeat:'no-repeat',
        zIndex:0,
      }}/>

      {/* ── 背景漸層柔化（提升文字可讀性） ── */}
      <div style={{
        position:'absolute', inset:0, zIndex:1,
        background:`
          radial-gradient(ellipse 65% 35% at 50% 12%, rgba(255,235,248,0.30) 0%, transparent 70%),
          linear-gradient(to bottom, rgba(255,215,235,0.10) 0%, transparent 35%, rgba(255,255,255,0.15) 82%, rgba(255,250,253,0.72) 100%)
        `,
        pointerEvents:'none',
      }}/>

      {/* ── 閃光粒子 ── */}
      {mounted && (
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', overflow:'hidden' }}>
          {[
            {top:'10%',left:'20%',size:20,delay:'0s',   dur:'3s'  },
            {top:'7%', left:'55%',size:14,delay:'1s',   dur:'4s'  },
            {top:'18%',left:'74%',size:18,delay:'2s',   dur:'3.5s'},
            {top:'33%',left:'10%',size:12,delay:'0.5s', dur:'5s'  },
            {top:'28%',left:'86%',size:14,delay:'1.8s', dur:'4s'  },
            {top:'50%',left:'30%',size:10,delay:'0.3s', dur:'3s'  },
            {top:'16%',left:'40%',size:16,delay:'2.5s', dur:'4.5s'},
            {top:'55%',left:'66%',size:12,delay:'1.2s', dur:'3.8s'},
          ].map((s,i) => (
            <div key={i} style={{
              position:'absolute', top:s.top, left:s.left,
              width:s.size, height:s.size,
              background:'radial-gradient(circle, rgba(255,255,255,0.96) 0%, transparent 70%)',
              borderRadius:'50%',
              animation:`sparkle ${s.dur} ease-in-out ${s.delay} infinite`,
            }}/>
          ))}
        </div>
      )}

      {/* ── 飄落花瓣 ── */}
      {mounted && petals.map((p,i) => (
        <div key={i} className="petal" style={{
          left: p.left,
          fontSize: 14 + (i % 3) * 4,
          animationDuration: p.dur,
          animationDelay: p.delay,
          zIndex: 3,
        }}>{p.e}</div>
      ))}

      {/* ══════════════════════════════════════════════════════
          標題區：毛玻璃卡片 + CTA
      ══════════════════════════════════════════════════════ */}
      <div style={{
        position:'relative', zIndex:10,
        textAlign:'center',
        paddingTop:'clamp(68px, 7.5vw, 90px)',
        paddingLeft:16, paddingRight:16,
      }}>

        {/* 年份徽章 */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:7,
          padding:'5px 18px', borderRadius:100, marginBottom:12,
          background:'rgba(255,255,255,0.50)',
          border:'1.5px solid rgba(255,182,193,0.55)',
          backdropFilter:'blur(12px)',
          color:'#D4448A', fontSize:11, fontWeight:700,
          letterSpacing:'0.12em',
          boxShadow:'0 4px 16px rgba(255,105,180,0.15)',
          fontFamily:'Nunito, sans-serif',
        }}>
          💝 2025 MOTHER&apos;S DAY 💝
        </div>

        {/* ── 毛玻璃主標題卡片 ── */}
        <div style={{
          display:'inline-flex', flexDirection:'column', alignItems:'center',
          padding:'14px 36px 12px',
          borderRadius:22,
          background:'rgba(255,255,255,0.55)',
          backdropFilter:'blur(22px)',
          WebkitBackdropFilter:'blur(22px)',
          border:'1.5px solid rgba(255,255,255,0.72)',
          boxShadow:`
            0 8px 32px rgba(255,105,180,0.18),
            0 2px 8px rgba(220,120,170,0.12),
            0 0 0 1px rgba(255,200,220,0.3) inset
          `,
          marginBottom:18,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:4 }}>
            <span style={{ fontSize:18 }}>🌸</span>
            <span style={{
              fontFamily:'Pacifico, cursive',
              fontSize:'clamp(18px, 3.0vw, 30px)',
              background:'linear-gradient(135deg, #D4006B 0%, #FF3D8A 30%, #FF69B4 58%, #C084FC 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              filter:'drop-shadow(0 2px 8px rgba(212,0,107,0.22))',
              lineHeight:1.2,
            }}>
              Mother&apos;s Day Studio
            </span>
          </div>
          <p style={{
            fontFamily:'Nunito, "Noto Sans TC", sans-serif',
            fontSize:'clamp(11px, 1.3vw, 13px)',
            color:'#C2185B', fontWeight:700, letterSpacing:'0.15em',
          }}>
            AI 活愛創作慶感 · 2025
          </p>
        </div>

        {/* CTA 按鈕 */}
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/select" className="btn-primary" style={{ fontSize:15 }}>
            ✏️ 開始創作
          </Link>
          <Link href="/gallery" className="btn-ghost">
            🌸 靈感展示牆
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          人物舞台
      ══════════════════════════════════════════════════════ */}
      <div style={{
        position:'relative',
        width:'100%',
        height:'clamp(320px, 45vw, 500px)',
        marginTop:8,
        zIndex:5,
      }}>

        {/* 雲霧底部 */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          height:'52%',
          background:'linear-gradient(to top, rgba(255,250,255,0.52) 0%, transparent 100%)',
          pointerEvents:'none', zIndex:1,
        }}/>

        {/* ── 後排 10 人：baseW 60 ── */}
        {mounted && backEmps.map((emp,i) => (
          <CharacterPin key={emp.id}
            employee={emp} x={backRow[i].x} y={backRow[i].y}
            baseW={60} opacity={0.68} zIndex={5}
            floatDelay={delays[i % delays.length]}
          />
        ))}

        {/* ── 中排 12 人：baseW 82 ── */}
        {mounted && midEmps.map((emp,i) => (
          <CharacterPin key={emp.id}
            employee={emp} x={midRow[i].x} y={midRow[i].y}
            baseW={82} opacity={0.88} zIndex={10}
            floatDelay={delays[i % delays.length]}
          />
        ))}

        {/* ── 前排 8 人：baseW 110 ── */}
        {mounted && frontEmps.map((emp,i) => (
          <CharacterPin key={emp.id}
            employee={emp} x={frontRow[i].x} y={frontRow[i].y}
            baseW={110} opacity={1.0} zIndex={20}
            floatDelay={delays[i % delays.length]}
          />
        ))}

        {/* 中央點擊提示 */}
        {mounted && (
          <div style={{
            position:'absolute', bottom:'3%', left:'50%',
            transform:'translateX(-50%)',
            zIndex:30, pointerEvents:'none',
          }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:6,
              background:'rgba(255,255,255,0.86)',
              backdropFilter:'blur(12px)',
              border:'1.5px solid rgba(255,182,193,0.55)',
              borderRadius:100, padding:'5px 20px',
              fontSize:11, fontWeight:700,
              fontFamily:'Nunito, sans-serif',
              color:'#D4448A',
              boxShadow:'0 4px 18px rgba(255,105,180,0.2)',
              whiteSpace:'nowrap',
              animation:'bounceSoft 3s ease-in-out infinite',
            }}>
              👆 點擊任何人物開始創作
            </div>
          </div>
        )}
      </div>

      {/* 底部白色收邊 */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:80,
        background:'linear-gradient(to top, rgba(255,248,252,1), transparent)',
        pointerEvents:'none', zIndex:40,
      }}/>
    </section>
  );
}
