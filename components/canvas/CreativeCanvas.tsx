'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Employee, InteractiveElement, PlacedDecoration, PlacedRobot, RobotOption } from '@/types';
import { DEFAULT_BLESSING_TEXT } from '@/lib/aiTexts';
import PosterCanvas from './PosterCanvas';
import BlessingEditor from './BlessingEditor';
import DownloadActions from './DownloadActions';
import RobotPanel, { ROBOT_OPTIONS } from './RobotPanel';

// ── 預設排版常數 ──────────────────────────────────────────────
const DEFAULT_CHAR_POS: InteractiveElement = {
  x:        50,    // 水平置中
  y:        52,    // 約 55% 高度位置（以中心點計）
  size:     44,    // 寬度約 44%
  rotation: 0,
};

const DEFAULT_ROBOT_POS: InteractiveElement = {
  x:        80,    // 右下角
  y:        82,
  size:     14,    // 約人物的 30%（44% × 30% ≈ 13–14%）
  rotation: -10,
};

// ── 背景漂浮粒子 ─────────────────────────────────────────────
const BG_FLOATS = [
  { e:'🌸', top:'6%',  left:'4%',  size:26, op:0.32, dur:'8s',  del:'0s'   },
  { e:'💕', top:'14%', left:'16%', size:18, op:0.28, dur:'10s', del:'1.8s' },
  { e:'🌸', top:'4%',  left:'32%', size:20, op:0.22, dur:'9s',  del:'3.2s' },
  { e:'✨', top:'20%', left:'78%', size:16, op:0.38, dur:'6s',  del:'0.6s' },
  { e:'🌷', top:'8%',  left:'88%', size:24, op:0.28, dur:'11s', del:'2.1s' },
  { e:'💗', top:'33%', left:'93%', size:18, op:0.32, dur:'7s',  del:'1.2s' },
  { e:'🌺', top:'52%', left:'2%',  size:22, op:0.25, dur:'12s', del:'2.8s' },
  { e:'💝', top:'66%', left:'11%', size:16, op:0.28, dur:'8s',  del:'0.9s' },
  { e:'🌸', top:'70%', left:'87%', size:20, op:0.22, dur:'9s',  del:'3.8s' },
  { e:'✨', top:'80%', left:'72%', size:14, op:0.32, dur:'7s',  del:'1.4s' },
  { e:'🎀', top:'88%', left:'24%', size:18, op:0.26, dur:'9s',  del:'2.4s' },
  { e:'🌸', top:'86%', left:'54%', size:16, op:0.20, dur:'11s', del:'0.4s' },
];

interface CreativeCanvasProps {
  employee: Employee;
}

export default function CreativeCanvas({ employee }: CreativeCanvasProps) {
  const router     = useRouter();
  const posterRef  = useRef<HTMLDivElement>(null);

  // ── 文字 ──────────────────────────────────────────────────
  const [blessingText, setBlessingText] = useState(DEFAULT_BLESSING_TEXT);
  const [showName,     setShowName]     = useState(true);

  // ── 人物位置 ──────────────────────────────────────────────
  const [characterPos, setCharacterPos] = useState<InteractiveElement>(DEFAULT_CHAR_POS);

  // ── 機器人 ────────────────────────────────────────────────
  const [selectedRobot, setSelectedRobot] = useState<RobotOption>(ROBOT_OPTIONS[0]);
  const [robotPos, setRobotPos]           = useState<InteractiveElement>(DEFAULT_ROBOT_POS);
  const [robots, setRobots]               = useState<PlacedRobot[]>([]);

  // ── 貼紙裝飾（保留原有功能） ──────────────────────────────
  const [decorations, setDecorations] = useState<PlacedDecoration[]>([]);

  // ── 機器人選擇 ────────────────────────────────────────────
  const handleSelectRobot = useCallback((robot: RobotOption) => {
    setSelectedRobot(robot);
    setRobotPos((prev) => ({ ...prev, rotation: robot.defaultRotation }));
  }, []);

  // ── 貼紙操作 ──────────────────────────────────────────────
  const handleDecorationMove   = useCallback((id: string, x: number, y: number) => {
    setDecorations((p) => p.map((d) => d.instanceId === id ? { ...d, x, y } : d));
  }, []);
  const handleDecorationRemove = useCallback((id: string) => {
    setDecorations((p) => p.filter((d) => d.instanceId !== id));
  }, []);

  // ── 重置排版 ──────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setCharacterPos(DEFAULT_CHAR_POS);
    setRobotPos({ ...DEFAULT_ROBOT_POS, rotation: selectedRobot.defaultRotation });
    setDecorations([]);
  }, [selectedRobot.defaultRotation]);

  // ── 下載 ──────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(posterRef.current, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: null, logging: false,
      });
      const link = document.createElement('a');
      link.download = `母親節祝福卡片_${employee.name}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('下載失敗：', err);
      alert('圖片生成失敗，請稍後再試。');
    }
  }, [employee.name]);

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: 60,
      position: 'relative',
      overflow: 'hidden',
      background:
        'linear-gradient(160deg, #ffe4f3 0%, #fbd6f6 18%, #e8d4ff 42%, #fbd6f6 66%, #ffe4f3 100%)',
    }}>

      {/* ── 夢幻背景層 ── */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        {[
          { w:'50vw', h:'50vw', top:'-12%',  left:'-8%',   c:'rgba(255,170,215,0.38)' },
          { w:'38vw', h:'38vw', top:'25%',   right:'-4%',  c:'rgba(192,132,252,0.28)' },
          { w:'44vw', h:'44vw', bottom:'-8%',left:'18%',   c:'rgba(253,168,212,0.32)' },
          { w:'28vw', h:'28vw', top:'18%',   left:'38%',   c:'rgba(255,230,248,0.45)' },
        ].map((b, i) => (
          <div key={i} style={{
            position:'absolute',
            width: b.w, height: b.h,
            top: (b as unknown as Record<string,string>).top, bottom: (b as unknown as Record<string,string>).bottom,
            left: (b as unknown as Record<string,string>).left, right: (b as unknown as Record<string,string>).right,
            background: `radial-gradient(circle, ${b.c} 0%, transparent 70%)`,
            filter: 'blur(55px)',
          }}/>
        ))}
        {BG_FLOATS.map((p, i) => (
          <div key={i} style={{
            position:'absolute', top:p.top, left:p.left,
            fontSize: p.size, opacity: p.op,
            animation: `float ${p.dur} ease-in-out ${p.del} infinite`,
            userSelect: 'none',
          }}>{p.e}</div>
        ))}
      </div>

      {/* ── 頂部狀態列 ── */}
      <div style={{
        position:'fixed', top:60, left:0, right:0, zIndex:100,
        background:'rgba(255,238,250,0.85)',
        backdropFilter:'blur(18px)',
        WebkitBackdropFilter:'blur(18px)',
        borderBottom:'1px solid rgba(255,182,193,0.3)',
        boxShadow:'0 2px 16px rgba(255,100,170,0.08)',
        padding:'9px 20px',
        display:'flex', alignItems:'center', gap: 10,
      }}>
        <button
          onClick={() => router.push('/select')}
          style={{
            display:'flex', alignItems:'center', gap:5,
            padding:'5px 14px', borderRadius:100,
            background:'rgba(255,255,255,0.65)',
            border:'1.5px solid rgba(255,182,193,0.45)',
            color:'#D4448A', fontSize:12, fontWeight:700,
            fontFamily:'Nunito, sans-serif',
            cursor:'pointer',
            backdropFilter:'blur(8px)',
          }}
        >
          ← 換角色
        </button>

        <div style={{ flex:1, textAlign:'center' }}>
          <p style={{
            fontFamily:'Pacifico, cursive', fontSize:13,
            background:'linear-gradient(135deg, #FF3D8A, #C084FC)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          }}>
            ✏️ 創作我的母親節卡片
          </p>
          <p style={{
            fontFamily:'Nunito, "Noto Sans TC", sans-serif',
            fontSize:11, color:'#D4448A', fontWeight:600,
          }}>
            正在使用 {employee.name} 的專屬角色
          </p>
        </div>

        {/* 重置版面按鈕 */}
        <button
          onClick={handleReset}
          style={{
            padding:'5px 12px', borderRadius:100,
            background:'rgba(255,255,255,0.65)',
            border:'1.5px solid rgba(255,182,193,0.45)',
            color:'#D4448A', fontSize:11, fontWeight:700,
            fontFamily:'Nunito, sans-serif',
            cursor:'pointer',
            backdropFilter:'blur(8px)',
            whiteSpace: 'nowrap',
          }}
          title="重置人物與機器人至預設位置"
        >
          🔄 重置
        </button>
      </div>

      {/* ── 主體三欄 ── */}
      <div style={{
        position:'relative', zIndex:1,
        display:'flex',
        alignItems:'flex-start',
        justifyContent:'center',
        padding:'88px 16px 48px',
        gap: 18,
        maxWidth: 1120,
        margin:'0 auto',
      }}>

        {/* ──────────────── 左：機器人選擇 ──────────────── */}
        <div
          className="hidden md:block"
          style={{ width:190, flexShrink:0, position:'sticky', top:128 }}
        >
          <RobotPanel
            selectedRobotId={selectedRobot.id}
            onSelect={handleSelectRobot}
          />
        </div>

        {/* ──────────────── 中：卡片主舞台 ──────────────── */}
        <div style={{
          flex:'0 0 auto',
          display:'flex', flexDirection:'column', alignItems:'center',
          gap:16,
        }}>
          {/* 卡片外層發光包裝 */}
          <div style={{ position:'relative' }}>
            {/* 底部雲光 */}
            <div style={{
              position:'absolute',
              bottom:-24, left:'5%', right:'5%', height:48,
              background:'radial-gradient(ellipse, rgba(255,130,200,0.5) 0%, transparent 70%)',
              filter:'blur(18px)',
              zIndex:0,
            }}/>
            {/* 卡片外框發光 */}
            <div style={{
              position:'relative', zIndex:1,
              borderRadius: 22,
              padding: 3,
              background:'linear-gradient(135deg, rgba(255,150,210,0.7), rgba(192,132,252,0.5), rgba(255,150,210,0.7))',
              boxShadow:`
                0 0 0 1px rgba(255,255,255,0.4) inset,
                0 24px 64px rgba(220,80,160,0.32),
                0 8px 24px rgba(192,132,252,0.24)
              `,
            }}>
              <div style={{
                borderRadius: 20,
                overflow: 'hidden',
                width: 'clamp(280px, 32vw, 350px)',
              }}>
                <PosterCanvas
                  ref={posterRef}
                  employee={employee}
                  blessingText={blessingText}
                  showName={showName}
                  fontSize={13}
                  bgSrc="/bg-1.webp"
                  decorations={decorations}
                  robots={robots}
                  characterPos={characterPos}
                  onCharacterPosChange={setCharacterPos}
                  onRobotChange={setRobots}
                  onDecorationMove={handleDecorationMove}
                  onDecorationRemove={handleDecorationRemove}
                />
              </div>
            </div>
          </div>

          {/* 清除貼紙 */}
          {decorations.length > 0 && (
            <button
              onClick={() => setDecorations([])}
              style={{
                fontSize:11, color:'#D4448A', cursor:'pointer',
                background:'rgba(255,255,255,0.65)',
                border:'1px solid rgba(255,182,193,0.45)',
                borderRadius:100, padding:'4px 14px',
                fontFamily:'Nunito, sans-serif', fontWeight:600,
                backdropFilter:'blur(8px)',
              }}
            >
              🗑️ 清除貼紙 ({decorations.length})
            </button>
          )}

          {/* 下載 CTA */}
          <div style={{ width:'clamp(280px, 32vw, 350px)' }}>
            <DownloadActions employee={employee} onDownload={handleDownload} />
          </div>

          {/* 行動版機器人快速選 */}
          <div className="md:hidden" style={{ width:'100%', maxWidth:350 }}>
            <p style={{
              fontFamily:'Nunito, sans-serif', fontSize:11, color:'#D4448A',
              fontWeight:700, marginBottom:8, textAlign:'center',
            }}>🤖 選擇機器人</p>
            <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
              {ROBOT_OPTIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectRobot(r)}
                  style={{
                    width:56, height:56, borderRadius:16,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background: selectedRobot.id === r.id
                      ? 'rgba(255,192,220,0.4)'
                      : 'rgba(255,255,255,0.75)',
                    border: selectedRobot.id === r.id
                      ? '2px solid rgba(255,105,180,0.6)'
                      : '1.5px solid rgba(255,182,193,0.35)',
                    cursor:'pointer', overflow:'hidden',
                  }}
                >
                  {r.id === 'none'
                    ? <span style={{ fontSize:20, opacity:0.4 }}>✕</span>
                    : <img src={r.src} alt={r.name} style={{ width:'88%', height:'88%', objectFit:'contain' }}/>
                  }
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ──────────────── 右：AI 文案助手 ──────────────── */}
        <div
          className="hidden md:block"
          style={{ width:272, flexShrink:0, position:'sticky', top:128 }}
        >
          <BlessingEditor
            employee={employee}
            blessingText={blessingText}
            showName={showName}
            bgVariant="pink"
            onTextChange={setBlessingText}
            onShowNameChange={setShowName}
            onBgVariantChange={() => {/* 不再切換背景，保留 prop 相容性 */}}
          />
        </div>
      </div>
    </div>
  );
}
