'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { employeeProfiles } from '@/data/employees';
import { ROBOT_OPTIONS } from '@/components/canvas/RobotPanel';
import { getRandomBlessing, calcAutoFontSize, type BlessingTheme } from '@/lib/aiTexts';
import PosterCanvas from '@/components/canvas/PosterCanvas';
import type { Employee, InteractiveElement, PlacedDecoration, PlacedRobot } from '@/types';

// ── 背景模板 ─────────────────────────────────────────────────────
const BG_TEMPLATES = [
  { id: 'bg1', src: '/bg-1.png', label: '模板一' },
  { id: 'bg2', src: '/bg-2.png', label: '模板二' },
  { id: 'bg3', src: '/bg-3.png', label: '模板三' },
];

const THEMES: { id: BlessingTheme; label: string; icon: string }[] = [
  { id: 'all',    label: '全部',   icon: '🎲' },
  { id: 'warm',   label: '溫暖感謝', icon: '🌸' },
  { id: 'humor',  label: '幽默輕鬆', icon: '😄' },
  { id: 'poetic', label: '詩意風格', icon: '✨' },
];

// ── 母親節倒數（2026年5月10日）────────────────────────────────────
function getDaysLeft(): number {
  const now    = new Date();
  const target = new Date(2026, 4, 10); // May 10, 2026
  const diff   = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / 86400000));
}

const DEFAULT_CHAR: InteractiveElement = { x: 48, y: 44, size: 55, rotation: 0 };
const MAX_CHARS = 65;


// ── 手工 Confetti ────────────────────────────────────────────────
function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d')!;
  const COLORS = ['#FF6B9D','#FFB3D1','#FFD700','#FF4B8B','#FFA0C0','#FFCCE5','#FF69B4','#fff'];
  const pieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 200,
    w: Math.random() * 10 + 5,
    h: Math.random() * 6 + 3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: Math.random() * 5 + 2,
    angle: Math.random() * 360,
    spin:  (Math.random() - 0.5) * 10,
    drift: (Math.random() - 0.5) * 2.5,
  }));
  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - frame / 140);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.y += p.speed; p.x += p.drift; p.angle += p.spin;
    });
    frame++;
    if (frame < 160) requestAnimationFrame(tick);
    else document.body.removeChild(canvas);
  }
  tick();
}

// ── Design tokens ─────────────────────────────────────────────
const C = {
  bg:      '#FFF8FB',
  surface: '#FFFFFF',
  border:  '#EDD8E8',
  accent:  '#C94E7A',
  light:   '#FBF0F5',
  text:    '#3D2030',
  sub:     '#A07090',
  pink:    '#E88AAD',
};

// ─────────────────────────────────────────────────────────────
export default function CreatePage() {
  const posterRef = useRef<HTMLDivElement>(null);

  const [employee,       setEmployee]       = useState<Employee>(employeeProfiles[0]);
  const [charPos,        setCharPos]        = useState<InteractiveElement>(DEFAULT_CHAR);
  // ⚠️ Math.random() / Date.now() 不能放在 useState 初始值（server/client 不同 → hydration error）
  // 全部改用穩定初始值，在 useEffect 裡才設定隨機值
  const [robots,         setRobots]         = useState<PlacedRobot[]>([]);
  const [decos,          setDecos]          = useState<PlacedDecoration[]>([]);
  const [text,           setText]           = useState('');
  const [showName,       setShowName]       = useState(true);
  const [customName,     setCustomName]     = useState(employeeProfiles[0].name);
  const [fontSize,       setFontSize]       = useState(15);
  const [fontSizeIsAuto, setFontSizeIsAuto] = useState(true);
  const [genLoading,     setGenLoading]     = useState(false);
  const [shareMsg,       setShareMsg]       = useState('');
  const [wide,           setWide]           = useState(false);
  const [mTab,           setMTab]           = useState<'asset' | 'text' | 'save'>('asset');
  const [bgIndex,        setBgIndex]        = useState(1); // 預設模板二
  const [blessingTheme,  setBlessingTheme]  = useState<BlessingTheme>('all');
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [cardFade,       setCardFade]       = useState(false);

  // 預覽燈箱
  const [previewUrl,     setPreviewUrl]     = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // 引導 onboarding
  const [onboardingStep, setOnboardingStep] = useState<number>(-1); // -1 = 不顯示

  // 倒數
  const [daysLeft, setDaysLeft] = useState(0);
  useEffect(() => { setDaysLeft(getDaysLeft()); }, []);

  // ── 統計數據 ──────────────────────────────────────────────────
  const [stats, setStats] = useState({ visits: 0, saves: 0 });
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) setStats(await res.json());
    } catch { /* 靜默失敗，不影響主功能 */ }
  }, []);

  // 進入頁面：計 +1 訪問（每個 session 只算一次）
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sessionStorage.getItem('md-visited')) {
      sessionStorage.setItem('md-visited', '1');
      fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'visit' }) }).catch(() => {});
    }
    fetchStats();
  }, [fetchStats]);

  // 切換主題時立即自動換文字（跳過第一次 mount）
  const themeInitRef = useRef(false);
  useEffect(() => {
    if (!themeInitRef.current) { themeInitRef.current = true; return; }
    const newText = getRandomBlessing(blessingTheme).slice(0, MAX_CHARS);
    setText(newText);
    if (fontSizeIsAuto) setFontSize(calcAutoFontSize(newText));
  }, [blessingTheme]); // eslint-disable-line react-hooks/exhaustive-deps

  // client-only 初始化（含 Math.random / Date.now，只在 client 執行，避免 hydration error）
  useEffect(() => {
    const initialText = getRandomBlessing();
    setText(initialText);
    setFontSize(calcAutoFontSize(initialText));
    setRobots([]);
  }, []);

  // 響應式
  useEffect(() => {
    const check = () => setWide(window.innerWidth >= 860);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // 初次引導
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('md-toured')) {
      const timer = setTimeout(() => setOnboardingStep(0), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const finishOnboarding = useCallback(() => {
    setOnboardingStep(-1);
    localStorage.setItem('md-toured', '1');
  }, []);

  // 換角色（帶淡出轉場）
  const pickEmployee = useCallback((emp: Employee) => {
    setCardFade(true);
    setTimeout(() => {
      setEmployee(emp);
      setCharPos(DEFAULT_CHAR);
      setRobots([]);
      const newText = getRandomBlessing(blessingTheme);
      setText(newText);
      if (fontSizeIsAuto) setFontSize(calcAutoFontSize(newText));
      setCustomName((prev) => {
        const wasDefault = employeeProfiles.some((e) => e.name === prev);
        return wasDefault ? emp.name : prev;
      });
      setSelectedRobotId(null);
      setCardFade(false);
    }, 200);
  }, [blessingTheme, fontSizeIsAuto]);

  // 重置全部
  const handleResetAll = useCallback(() => {
    setCardFade(true);
    setTimeout(() => {
      setEmployee(employeeProfiles[0]);
      setCharPos(DEFAULT_CHAR);
      setRobots([]);
      setDecos([]);
      const newText = getRandomBlessing('all');
      setText(newText);
      setFontSize(calcAutoFontSize(newText));
      setFontSizeIsAuto(true);
      setShowName(true);
      setCustomName(employeeProfiles[0].name);
      setBgIndex(1); // 重置回預設模板二
      setBlessingTheme('all');
      setSelectedRobotId(null);
      setCardFade(false);
    }, 200);
  }, []);

  const addRobot = useCallback((robotId: string) => {
    const opt = ROBOT_OPTIONS.find((r) => r.id === robotId);
    if (!opt || opt.id === 'none') return;
    const n = robots.length;
    setRobots((p) => [...p, {
      instanceId: `${robotId}-${Date.now()}`,
      src: opt.src, name: opt.name,
      x: clamp(72 + n * 7, 20, 86),
      y: clamp(74 - n * 4, 20, 86),
      size: 24, rotation: opt.defaultRotation, zIndex: 10 + n,
    }]);
  }, [robots.length]);

  const handleGenerate = useCallback(async () => {
    setGenLoading(true);
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
    const newText = getRandomBlessing(blessingTheme).slice(0, MAX_CHARS);
    setText(newText);
    if (fontSizeIsAuto) setFontSize(calcAutoFontSize(newText));
    setGenLoading(false);
  }, [blessingTheme, fontSizeIsAuto]);

  const handleFontUp   = useCallback(() => { setFontSizeIsAuto(false); setFontSize((v) => Math.min(22, v + 1)); }, []);
  const handleFontDown = useCallback(() => { setFontSizeIsAuto(false); setFontSize((v) => Math.max(8, v - 1)); }, []);

  // 選旋轉角度
  const handleRotationChange = useCallback((deg: number) => {
    if (!selectedRobotId) return;
    setRobots((p) => p.map((r) => r.instanceId === selectedRobotId ? { ...r, rotation: deg } : r));
  }, [selectedRobotId]);

  const selectedRobot = robots.find((r) => r.instanceId === selectedRobotId) ?? null;

  // ── 截圖：完全用 Canvas 2D API 手繪，不依賴 html2canvas ──────────
  // 優點：位置計算與編輯器完全相同（同一套 % 數學），沒有 DOM/scroll 偏移問題
  const captureCard = useCallback(async (): Promise<HTMLCanvasElement | null> => {
    if (!posterRef.current) return null;
    const W = posterRef.current.offsetWidth;   // 卡片實際渲染寬度（px）
    const H = posterRef.current.offsetHeight;  // 卡片實際渲染高度（px）
    const SCALE = 2.5;

    const canvas = document.createElement('canvas');
    canvas.width  = Math.round(W * SCALE);
    canvas.height = Math.round(H * SCALE);
    const ctx = canvas.getContext('2d')!;
    ctx.scale(SCALE, SCALE);

    // 載入圖片（同源不需要 crossOrigin）
    const loadImg = (src: string): Promise<HTMLImageElement> =>
      new Promise((res, rej) => {
        const img = new Image();
        img.onload  = () => res(img);
        img.onerror = rej;
        img.src = src.startsWith('/') ? `${window.location.origin}${src}` : src;
      });

    try {
      await document.fonts.ready;

      // ① 背景圖（objectFit: cover — 等比縮放＋置中裁切，與 CSS 完全一致）
      const bgImg = await loadImg(BG_TEMPLATES[bgIndex].src);
      {
        const iW = bgImg.naturalWidth, iH = bgImg.naturalHeight;
        const scaleW = W / iW, scaleH = H / iH;
        const scale  = Math.max(scaleW, scaleH);   // cover = 取較大縮放比
        const sx = (iW - W  / scale) / 2;
        const sy = (iH - H  / scale) / 2;
        const sw = W  / scale;
        const sh = H  / scale;
        ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, W, H);
      }

      // ② 感謝話語（zIndex 4，繪製在角色下方）
      // 對齊 CSS：top:79%, height:18%, left/right:7%, padding:1.5% 4%
      // CSS 的 padding % 是相對於容器「寬度」(W)，非高度
      const padV   = W * 0.015;           // vertical padding (px)
      const padH   = W * 0.04;            // horizontal padding (px)
      const tbTop  = H * 0.79 + padV;     // 實際文字起始 Y
      const tbH    = H * 0.18 - padV * 2; // 有效文字高度
      const tbW    = W * (1 - 0.14) - padH * 2; // 有效文字寬度
      const lh     = fontSize * 1.9;

      ctx.save();
      ctx.font         = `${fontSize}px "NaniFont","Noto Serif TC",serif`;
      ctx.fillStyle    = '#b03070';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'top';

      // 中文按字元換行（最多 3 行，對齊 CSS WebkitLineClamp:3）
      const displayText = (text || '').slice(0, 72);
      const lines: string[] = [];
      let line = '';
      for (const ch of displayText) {
        const test = line + ch;
        if (ctx.measureText(test).width > tbW && line.length > 0) {
          lines.push(line); line = ch;
          if (lines.length >= 3) break; // 限制最多 3 行
        } else { line = test; }
      }
      if (line && lines.length < 3) lines.push(line);

      const nameH      = showName ? lh : 0;
      const totalTextH = lines.length * lh + nameH;
      // 垂直置中：若文字比框小，居中放；否則從頂部開始
      let ty = tbTop + Math.max(0, (tbH - totalTextH) / 2);
      lines.forEach((l) => { ctx.fillText(l, W / 2, ty); ty += lh; });

      if (showName) {
        const sigName = customName || employee.name;
        ctx.font      = `${Math.max(8, fontSize - 2)}px "NaniFont","Noto Serif TC",serif`;
        ctx.fillStyle = '#c8507a';
        ctx.fillText(`— ${sigName} 敬上 ♡`, W / 2, ty);
      }
      ctx.restore();

      // ③ 角色（zIndex 5）
      const charImg = await loadImg(employee.characterImage);
      const cW = W * charPos.size / 100;
      const cH = charImg.naturalHeight * (cW / charImg.naturalWidth);
      ctx.save();
      ctx.translate(W * charPos.x / 100, H * charPos.y / 100);
      ctx.rotate(charPos.rotation * Math.PI / 180);
      ctx.drawImage(charImg, -cW / 2, -cH / 2, cW, cH);
      ctx.restore();

      // ④ 素材（依 zIndex 升序，zIndex 8+，在角色上方）
      const sorted = [...robots].sort((a, b) => a.zIndex - b.zIndex);
      for (const r of sorted) {
        const rImg = await loadImg(r.src);
        const rW   = W * r.size / 100;
        const rH   = rImg.naturalHeight * (rW / rImg.naturalWidth);
        ctx.save();
        ctx.translate(W * r.x / 100, H * r.y / 100);
        ctx.rotate(r.rotation * Math.PI / 180);
        ctx.drawImage(rImg, -rW / 2, -rH / 2, rW, rH);
        ctx.restore();
      }

      return canvas;
    } catch (e) {
      console.error('captureCard failed:', e);
      return null;
    }
  }, [bgIndex, charPos, robots, fontSize, text, showName, employee, customName]);

  // 預覽燈箱
  const handlePreview = useCallback(async () => {
    if (!posterRef.current) return;
    setPreviewLoading(true);
    setSelectedRobotId(null);
    await new Promise((r) => setTimeout(r, 80)); // 等 React re-render（清選取框）
    try {
      const canvas = await captureCard();
      if (canvas) setPreviewUrl(canvas.toDataURL('image/png', 1.0));
    } finally {
      setPreviewLoading(false);
    }
  }, [captureCard]);

  const trackSave = useCallback(() => {
    fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'save' }) })
      .then(() => fetchStats()).catch(() => {});
  }, [fetchStats]);

  const handleConfirmSave = useCallback(async () => {
    if (!previewUrl) return;
    setPreviewUrl(null);
    launchConfetti();
    const link = document.createElement('a');
    link.download = `母親節卡片_${employee.name}.png`;
    link.href = previewUrl;
    link.click();
    setShareMsg('✅ 已儲存！開啟 LINE 選取圖片傳給媽媽吧 💌');
    trackSave();
  }, [previewUrl, employee.name, trackSave]);

  const handleShareLine = useCallback(async () => {
    if (!posterRef.current) return; setShareMsg('');
    setSelectedRobotId(null);
    await new Promise((r) => setTimeout(r, 80));
    try {
      const canvas = await captureCard();
      if (!canvas) return;
      if (navigator.share) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], `母親節卡片_${employee.name}.png`, { type: 'image/png' });
          try { await navigator.share({ files: [file], title: '母親節快樂 🌸', text }); }
          catch {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
          }
          launchConfetti();
          trackSave();
        }, 'image/png');
      } else {
        await handlePreview();
      }
    } catch (e) { console.error(e); alert('儲存失敗，請稍後再試。'); }
  }, [employee.name, text, handlePreview, trackSave]);

  const employeeWithCustomName = { ...employee, name: customName || employee.name };
  const bgSrc = BG_TEMPLATES[bgIndex].src;

  // ── 左側面板 (Layout C) ─────────────────────────────────────────────────
  const LeftPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>

      {/* ── 角色選擇 ── */}
      <div style={{ padding: '12px 12px 10px' }}>
        {/* 標題 + 目前選取 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: C.sub, letterSpacing: '0.08em', textTransform: 'uppercase' }}>選擇你的角色</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 8px', borderRadius: 20,
            background: `linear-gradient(135deg,${C.light},#FFF0F7)`,
            border: `1px solid ${C.border}` }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
              <img src={employee.characterImage} alt={employee.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.accent }}>{employee.name}</span>
          </div>
        </div>

        {/* 角色格子 5欄 */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5,
          overflowY: 'auto', scrollbarWidth: 'thin',
          scrollbarColor: `${C.border} transparent`,
        }}>
          {employeeProfiles.map((emp) => {
            const on = emp.id === employee.id;
            return (
              <button key={emp.id} onClick={() => pickEmployee(emp)} title={emp.name} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '5px 2px', borderRadius: 10,
                background: on ? C.light : 'transparent',
                border: `1.5px solid ${on ? C.accent : C.border}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', background: '#F5EEF2' }}>
                  <img src={emp.characterImage} alt={emp.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
                </div>
                <span style={{ fontSize: 7, fontWeight: on ? 700 : 400, color: on ? C.accent : C.sub, whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis' }}>{emp.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 分隔線 */}
      <div style={{ height: 1, background: C.border, margin: '0 12px' }}/>

      {/* ── 素材包 ── */}
      <div style={{ padding: '12px 12px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: C.sub, letterSpacing: '0.08em', textTransform: 'uppercase' }}>素材包</p>
          {robots.length > 0 && (
            <button onClick={() => setRobots([])} style={chipBtnStyle}>清除（{robots.length}）</button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {ROBOT_OPTIONS.filter((r) => r.id !== 'none').map((r) => (
            <button key={r.id} onClick={() => addRobot(r.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '7px 3px', borderRadius: 10, background: '#F9F4F7',
              border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.light; e.currentTarget.style.borderColor = C.pink; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#F9F4F7'; e.currentTarget.style.borderColor = C.border; }}
            >
              <img src={r.src} alt={r.name} style={{ width: 38, height: 38, objectFit: 'contain' }}/>
              <span style={{ fontSize: 8, color: C.sub, textAlign: 'center', lineHeight: 1.2 }}>{r.name}</span>
            </button>
          ))}
        </div>
        {robots.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
            {robots.map((rb) => (
              <span key={rb.instanceId} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 20, background: C.surface, border: `1px solid ${C.border}`, fontSize: 9, color: C.sub }}>
                <img src={rb.src} alt="" style={{ width: 12, height: 12, objectFit: 'contain' }}/>
                {rb.name}
                <button onClick={() => setRobots((p) => p.filter((r) => r.instanceId !== rb.instanceId))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 10, color: C.pink, fontWeight: 800, lineHeight: 1 }}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── 右側面板 ─────────────────────────────────────────────────
  const RightPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
      <Section title="祝福語" wide={wide}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {/* 主題選擇 */}
          <div style={{ display: 'flex', gap: 4 }}>
            {THEMES.map((t) => (
              <button key={t.id} onClick={() => setBlessingTheme(t.id)} style={{
                flex: 1, padding: '6px 3px', borderRadius: 9, cursor: 'pointer',
                border: blessingTheme === t.id ? `1.5px solid ${C.accent}` : `1px solid ${C.border}`,
                background: blessingTheme === t.id ? C.light : '#F9F4F7',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 14 }}>{t.icon}</span>
                <span style={{ fontSize: 8, fontWeight: blessingTheme === t.id ? 700 : 500, color: blessingTheme === t.id ? C.accent : C.sub, lineHeight: 1.2, textAlign: 'center' }}>{t.label}</span>
              </button>
            ))}
          </div>

          {/* 一鍵生成 */}
          <button onClick={handleGenerate} disabled={genLoading} style={{
            width: '100%', padding: '9px 0', borderRadius: 10,
            fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.03em',
            background: genLoading ? 'rgba(201,78,122,0.5)' : `linear-gradient(135deg,${C.accent},#E0608A)`,
            border: 'none', cursor: genLoading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: genLoading ? 'none' : `0 4px 14px ${C.accent}35`,
            transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 16 }}>{genLoading ? '✨' : '🎲'}</span>
            {genLoading ? '生成中…' : '一鍵生成祝福語'}
          </button>

          {/* 輸入框 */}
          <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.border}` }}>
            <textarea value={text}
              onChange={(e) => {
                const v = e.target.value.slice(0, MAX_CHARS);
                setText(v);
                if (fontSizeIsAuto) setFontSize(calcAutoFontSize(v));
              }}
              placeholder="媽媽，謝謝妳一直以來的照顧與陪伴..." rows={3}
              style={{ width: '100%', padding: '9px 10px', resize: 'none', outline: 'none', border: 'none', background: '#fff', fontFamily: '"Noto Sans TC", sans-serif', fontSize: 12, color: C.text, lineHeight: 1.75, boxSizing: 'border-box' }}
            />
            <div style={{ padding: '3px 10px', background: '#FBF3F7', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: text.length > MAX_CHARS * 0.9 ? '#E04' : C.sub }}>{text.length}/{MAX_CHARS}</span>
            </div>
          </div>

          {/* 字型大小 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 10, background: '#FBF3F7', border: `1px solid ${C.border}` }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>字型大小</span>
              {fontSizeIsAuto && <span style={{ fontSize: 9, color: C.sub, marginLeft: 5 }}>自動</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepBtn onClick={handleFontDown}>−</StepBtn>
              <span style={{ minWidth: 20, textAlign: 'center', fontSize: 12, fontWeight: 700, color: C.accent }}>{fontSize}</span>
              <StepBtn onClick={handleFontUp}>＋</StepBtn>
            </div>
          </div>

          {/* 名字署名 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '7px 10px', borderRadius: 10, background: '#FBF3F7', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.text }}>名字署名</p>
                <p style={{ margin: 0, fontSize: 9, color: C.sub }}>顯示在卡片底部</p>
              </div>
              <Toggle on={showName} onChange={setShowName}/>
            </div>
            {showName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, color: C.sub, whiteSpace: 'nowrap' }}>— </span>
                <input value={customName} onChange={(e) => setCustomName(e.target.value.slice(0, 20))}
                  placeholder={employee.name}
                  style={{ flex: 1, padding: '5px 9px', borderRadius: 8, border: `1px solid ${C.border}`, outline: 'none', background: '#fff', fontSize: 12, color: C.text, fontFamily: '"Noto Sans TC", sans-serif' }}
                />
                <span style={{ fontSize: 10, color: C.sub, whiteSpace: 'nowrap' }}> 敬上</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* 儲存分享 */}
      <Section title="儲存分享" wide={wide} grow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
          <button onClick={handlePreview} disabled={previewLoading} style={{
            padding: '11px 0', borderRadius: 12, fontSize: 13, fontWeight: 800, color: '#fff',
            background: previewLoading ? 'rgba(201,78,122,0.4)' : `linear-gradient(135deg,${C.accent},#A33B61)`,
            border: 'none', cursor: previewLoading ? 'wait' : 'pointer',
            boxShadow: `0 5px 18px ${C.accent}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}>
            <span style={{ fontSize: 17 }}>👁️</span>{previewLoading ? '生成預覽中…' : '預覽 ／ 儲存卡片'}
          </button>
          <button onClick={handleShareLine} style={{
            padding: '9px 0', borderRadius: 12, fontSize: 12, fontWeight: 700, color: C.accent,
            background: C.light, border: `1.5px solid ${C.border}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 16 }}>📲</span> 直接分享到 LINE
          </button>
          {shareMsg && (
            <p style={{ margin: 0, fontSize: 11, color: C.accent, fontWeight: 700, textAlign: 'center', padding: '7px 10px', borderRadius: 9, background: C.light, border: `1px solid ${C.border}` }}>{shareMsg}</p>
          )}
          <p style={{ margin: 0, fontSize: 9, color: C.sub, textAlign: 'center', lineHeight: 1.7 }}>📱 手機：選擇 LINE 傳送　💻 電腦：儲存後傳圖</p>

          {/* 吉祥物 — 填滿剩餘空間 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img
              src="/mascot.png"
              alt=""
              style={{
                width: '100%', height: '100%', objectFit: 'contain',
                animation: 'mascotFloat 3s ease-in-out infinite',
                filter: 'drop-shadow(0 6px 16px rgba(201,78,122,0.25))',
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>
      </Section>

    </div>
  );

  // ── 中央卡片 ────────────────────────────────────────────────
  const CardCenter = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, flex: '1 1 auto', minWidth: 0, overflowY: 'auto', padding: '0 8px 8px' }}>

      {/* 背景模板小列（寬螢幕專用，放在卡片上方） */}
      <div style={{ width: '100%', maxWidth: 460 }}>
        <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, color: C.sub, letterSpacing: '0.08em', textTransform: 'uppercase' }}>背景模板</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {BG_TEMPLATES.map((bg, i) => (
            <button key={bg.id} onClick={() => setBgIndex(i)} style={{
              flex: 1, padding: '4px 4px 5px', borderRadius: 10, cursor: 'pointer',
              border: bgIndex === i ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
              background: bgIndex === i ? C.light : '#F9F4F7',
              transition: 'all 0.15s',
              boxShadow: bgIndex === i ? `0 0 0 3px ${C.accent}20` : 'none',
            }}>
              {/* 縮圖顯示機器人所在的下方區域 */}
              <div style={{ width: '100%', height: 40, borderRadius: 6, overflow: 'hidden', background: '#eee', marginBottom: 3 }}>
                <img src={bg.src} alt={bg.label} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 72%' }}/>
              </div>
              <p style={{ margin: 0, fontSize: 9, fontWeight: bgIndex === i ? 700 : 500, color: bgIndex === i ? C.accent : C.sub, textAlign: 'center' }}>{bg.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div style={{
        width: '100%', maxWidth: 460,
        borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(180,70,110,0.15), 0 3px 10px rgba(0,0,0,0.06)',
        border: `1px solid ${C.border}`,
        opacity: cardFade ? 0 : 1,
        transform: cardFade ? 'scale(0.97)' : 'scale(1)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}>
        <PosterCanvas
          ref={posterRef}
          employee={employeeWithCustomName}
          blessingText={text} showName={showName} fontSize={fontSize}
          bgSrc={bgSrc} decorations={decos} robots={robots} characterPos={charPos}
          selectedRobotId={selectedRobotId}
          onCharacterPosChange={setCharPos} onRobotChange={setRobots}
          onRobotSelect={setSelectedRobotId}
          onDecorationMove={(id, x, y) => setDecos((p) => p.map((d) => d.instanceId === id ? { ...d, x, y } : d))}
          onDecorationRemove={(id) => setDecos((p) => p.filter((d) => d.instanceId !== id))}
        />
      </div>

      {/* 旋轉控制列（選取素材時顯示）*/}
      {selectedRobot && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 16px', borderRadius: 12,
          background: C.surface, border: `1px solid ${C.border}`,
          boxShadow: '0 3px 12px rgba(180,70,110,0.1)',
          width: '100%', maxWidth: 460, boxSizing: 'border-box',
        }}>
          <img src={selectedRobot.src} alt="" style={{ width: 22, height: 22, objectFit: 'contain', flexShrink: 0 }}/>
          <span style={{ fontSize: 10, color: C.sub, flexShrink: 0 }}>旋轉</span>
          <input type="range" min={-45} max={45} value={selectedRobot.rotation}
            onChange={(e) => handleRotationChange(Number(e.target.value))}
            style={{ flex: 1, accentColor: C.accent, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, minWidth: 30, textAlign: 'right' }}>{selectedRobot.rotation}°</span>
          <button onClick={() => setSelectedRobotId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.sub, padding: 0, lineHeight: 1 }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 10, color: C.sub }}>拖曳移動 ・ 右下縮放 ・ 點選素材可旋轉 ・ 雙擊移除</span>
        <button onClick={() => { setCharPos(DEFAULT_CHAR); setSelectedRobotId(null); }} style={{
          fontSize: 10, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap',
        }}>↺ 重置</button>
      </div>
    </div>
  );

  // ── 窄螢幕 ────────────────────────────────────────────────
  const NarrowLayout = (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 14px 24px' }}>
      {/* 背景選擇 */}
      <div style={{ padding: '10px 0 6px' }}>
        <p style={{ margin: '0 0 7px', fontSize: 10, fontWeight: 700, color: C.sub, letterSpacing: '0.06em' }}>背景模板</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {BG_TEMPLATES.map((bg, i) => (
            <button key={bg.id} onClick={() => setBgIndex(i)} style={{
              flex: 1, padding: '3px 3px 5px', borderRadius: 10, cursor: 'pointer',
              border: bgIndex === i ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
              background: bgIndex === i ? C.light : '#F9F4F7',
              boxShadow: bgIndex === i ? `0 0 0 3px ${C.accent}20` : 'none',
            }}>
              <div style={{ width: '100%', height: 48, borderRadius: 6, overflow: 'hidden', background: '#eee', marginBottom: 3 }}>
                <img src={bg.src} alt={bg.label} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 72%' }}/>
              </div>
              <p style={{ margin: 0, fontSize: 9, fontWeight: bgIndex === i ? 700 : 500, color: bgIndex === i ? C.accent : C.sub, textAlign: 'center' }}>{bg.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 角色橫列 */}
      <div style={{ padding: '8px 0' }}>
        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, color: C.sub, letterSpacing: '0.06em' }}>選擇角色</p>
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {employeeProfiles.map((emp) => {
            const on = emp.id === employee.id;
            return (
              <button key={emp.id} onClick={() => pickEmployee(emp)} style={{
                flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '6px 8px', borderRadius: 12,
                background: on ? C.light : 'transparent',
                border: `1.5px solid ${on ? C.accent : C.border}`, cursor: 'pointer',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 9, overflow: 'hidden', background: '#F5EEF2' }}>
                  <img src={emp.characterImage} alt={emp.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
                </div>
                <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, color: on ? C.accent : C.sub }}>{emp.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 卡片 */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 6px' }}>
        <div style={{
          width: '100%', maxWidth: 390, borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 10px 36px rgba(180,70,110,0.14)',
          border: `1px solid ${C.border}`,
          opacity: cardFade ? 0 : 1, transition: 'opacity 0.2s',
        }}>
          <PosterCanvas
            ref={posterRef}
            employee={employeeWithCustomName}
            blessingText={text} showName={showName} fontSize={fontSize}
            bgSrc={bgSrc} decorations={decos} robots={robots} characterPos={charPos}
            selectedRobotId={selectedRobotId}
            onCharacterPosChange={setCharPos} onRobotChange={setRobots}
            onRobotSelect={setSelectedRobotId}
            onDecorationMove={(id, x, y) => setDecos((p) => p.map((d) => d.instanceId === id ? { ...d, x, y } : d))}
            onDecorationRemove={(id) => setDecos((p) => p.filter((d) => d.instanceId !== id))}
          />
        </div>
      </div>

      {selectedRobot && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: C.sub }}>旋轉</span>
          <input type="range" min={-45} max={45} value={selectedRobot.rotation}
            onChange={(e) => handleRotationChange(Number(e.target.value))}
            style={{ flex: 1, accentColor: C.accent }}
          />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, minWidth: 28 }}>{selectedRobot.rotation}°</span>
          <button onClick={() => setSelectedRobotId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: C.sub }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, padding: '4px 0 8px' }}>
        <span style={{ fontSize: 10, color: C.sub }}>拖曳移動 ・ 點選素材可旋轉 ・ 雙擊移除</span>
        <button onClick={() => { setCharPos(DEFAULT_CHAR); setSelectedRobotId(null); }}
          style={{ fontSize: 10, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>↺ 重置</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderRadius: '12px 12px 0 0', background: C.surface, border: `1px solid ${C.border}`, borderBottom: 'none', overflow: 'hidden' }}>
        {([['asset','🎁','素材包'],['text','✍️','祝福語'],['save','💌','儲存分享']] as const).map(([id, icon, label]) => (
          <button key={id} onClick={() => setMTab(id)} style={{
            flex: 1, padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
            border: 'none', borderBottom: mTab === id ? `2.5px solid ${C.accent}` : '2.5px solid transparent',
            background: mTab === id ? C.light : 'transparent', cursor: 'pointer',
          }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: mTab === id ? 700 : 500, color: mTab === id ? C.accent : C.sub }}>{label}</span>
          </button>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '14px', minHeight: 180 }}>
        {mTab === 'asset' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>點選加入卡片</span>
              {robots.length > 0 && <button onClick={() => setRobots([])} style={chipBtnStyle}>清除（{robots.length}）</button>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7 }}>
              {ROBOT_OPTIONS.filter((r) => r.id !== 'none').map((r) => (
                <button key={r.id} onClick={() => addRobot(r.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '7px 4px', borderRadius: 10, background: '#F9F4F7', border: `1px solid ${C.border}`, cursor: 'pointer' }}>
                  <img src={r.src} alt={r.name} style={{ width: 38, height: 38, objectFit: 'contain' }}/>
                  <span style={{ fontSize: 9, color: C.sub, textAlign: 'center' }}>{r.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {mTab === 'text' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {THEMES.map((t) => (
                <button key={t.id} onClick={() => setBlessingTheme(t.id)} style={{
                  flex: 1, padding: '5px 2px', borderRadius: 8, cursor: 'pointer',
                  border: blessingTheme === t.id ? `1.5px solid ${C.accent}` : `1px solid ${C.border}`,
                  background: blessingTheme === t.id ? C.light : '#F9F4F7',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                }}>
                  <span style={{ fontSize: 13 }}>{t.icon}</span>
                  <span style={{ fontSize: 8, fontWeight: blessingTheme === t.id ? 700 : 500, color: blessingTheme === t.id ? C.accent : C.sub, textAlign: 'center', lineHeight: 1.2 }}>{t.label}</span>
                </button>
              ))}
            </div>
            <button onClick={handleGenerate} disabled={genLoading} style={{
              width: '100%', padding: '11px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff',
              background: genLoading ? 'rgba(201,78,122,0.5)' : `linear-gradient(135deg,${C.accent},#E0608A)`,
              border: 'none', cursor: genLoading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 17 }}>{genLoading ? '✨' : '🎲'}</span>
              {genLoading ? '生成中…' : '一鍵生成祝福語'}
            </button>
            <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <textarea value={text} onChange={(e) => { const v = e.target.value.slice(0, MAX_CHARS); setText(v); if (fontSizeIsAuto) setFontSize(calcAutoFontSize(v)); }}
                placeholder="媽媽，謝謝妳一直以來的照顧與陪伴..." rows={3}
                style={{ width: '100%', padding: '10px 11px', resize: 'none', outline: 'none', border: 'none', background: '#fff', fontFamily: '"Noto Sans TC",sans-serif', fontSize: 13, color: C.text, lineHeight: 1.75, boxSizing: 'border-box' }}/>
              <div style={{ padding: '3px 10px', background: '#FBF3F7', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: text.length > MAX_CHARS * 0.9 ? '#E04' : C.sub }}>{text.length}/{MAX_CHARS}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 11px', borderRadius: 10, background: '#FBF3F7', border: `1px solid ${C.border}` }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>字型大小</span>
                {fontSizeIsAuto && <span style={{ fontSize: 9, color: C.sub, marginLeft: 5 }}>自動</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StepBtn onClick={handleFontDown}>−</StepBtn>
                <span style={{ minWidth: 20, textAlign: 'center', fontSize: 12, fontWeight: 700, color: C.accent }}>{fontSize}</span>
                <StepBtn onClick={handleFontUp}>＋</StepBtn>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 11px', borderRadius: 10, background: '#FBF3F7', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.text }}>名字署名</p>
                  <p style={{ margin: 0, fontSize: 9, color: C.sub }}>顯示在卡片底部</p>
                </div>
                <Toggle on={showName} onChange={setShowName}/>
              </div>
              {showName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: C.sub }}>— </span>
                  <input value={customName} onChange={(e) => setCustomName(e.target.value.slice(0, 20))}
                    placeholder={employee.name}
                    style={{ flex: 1, padding: '5px 9px', borderRadius: 8, border: `1px solid ${C.border}`, outline: 'none', background: '#fff', fontSize: 12, color: C.text, fontFamily: '"Noto Sans TC", sans-serif' }}/>
                  <span style={{ fontSize: 10, color: C.sub }}> 敬上</span>
                </div>
              )}
            </div>
          </div>
        )}
        {mTab === 'save' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', paddingTop: 8 }}>
            <button onClick={handlePreview} disabled={previewLoading} style={{
              width: '100%', padding: '13px 0', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff',
              background: `linear-gradient(135deg,${C.accent},#A33B61)`, border: 'none', cursor: 'pointer',
              boxShadow: `0 5px 18px ${C.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>👁️</span> {previewLoading ? '生成中…' : '預覽 ／ 儲存卡片'}
            </button>
            <button onClick={handleShareLine} style={{
              width: '100%', padding: '11px 0', borderRadius: 14, fontSize: 13, fontWeight: 700, color: C.accent,
              background: C.light, border: `1.5px solid ${C.border}`, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 16 }}>📲</span> 直接分享到 LINE
            </button>
            {shareMsg && <p style={{ margin: 0, fontSize: 11, color: C.accent, fontWeight: 700, textAlign: 'center' }}>{shareMsg}</p>}
            <p style={{ margin: 0, fontSize: 9, color: C.sub, textAlign: 'center' }}>📱 選擇 LINE 傳送　💻 儲存後傳圖</p>
            {/* 吉祥物 */}
            <img src="/mascot.png" alt="" style={{ width: 110, marginTop: 4, objectFit: 'contain', animation: 'mascotFloat 3s ease-in-out infinite', filter: 'drop-shadow(0 6px 16px rgba(201,78,122,0.25))' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
            {/* 手機版即時數據 */}
            {(stats.visits > 0 || stats.saves > 0) && (
              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: 10, background: 'linear-gradient(135deg,#FFF0F7,#FFE8F3)', border: `1px solid ${C.border}` }}>
                  <p style={{ margin: 0, fontSize: 16 }}>🌸</p>
                  <p style={{ margin: '2px 0 1px', fontSize: 17, fontWeight: 900, color: C.accent, lineHeight: 1 }}>{stats.visits.toLocaleString()}</p>
                  <p style={{ margin: 0, fontSize: 9, color: C.sub }}>人來製作</p>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: 10, background: 'linear-gradient(135deg,#FFF0F7,#FFE8F3)', border: `1px solid ${C.border}` }}>
                  <p style={{ margin: 0, fontSize: 16 }}>💌</p>
                  <p style={{ margin: '2px 0 1px', fontSize: 17, fontWeight: 900, color: C.accent, lineHeight: 1 }}>{stats.saves.toLocaleString()}</p>
                  <p style={{ margin: 0, fontSize: 9, color: C.sub }}>張卡片送出</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ── 引導步驟 ─────────────────────────────────────────────────
  const ONBOARDING_STEPS = [
    { icon: '👤', title: '選擇你的角色', desc: '在左側選你的 Q 版人物，每次換角色會自動生成新祝福語。' },
    { icon: '🖼️', title: '換個背景模板', desc: '左側上方有 3 種背景可以切換，找一個最喜歡的。' },
    { icon: '✍️', title: '生成專屬祝福語', desc: '右側可一鍵生成祝福語，也可以自己修改文字和字型大小。' },
    { icon: '💌', title: '儲存分享給媽媽', desc: '點「預覽」確認卡片後儲存，手機可直接分享到 LINE！' },
  ];

  return (
    <div style={{ height: wide ? '100dvh' : undefined, minHeight: wide ? undefined : '100dvh', overflow: wide ? 'hidden' : 'visible', background: C.bg, fontFamily: '"Noto Sans TC","PingFang TC",system-ui,sans-serif', color: C.text }}>

      {/* ── Header ── */}
      <header style={{
        padding: wide ? '10px 20px' : '8px 14px',
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: wide ? 15 : 14, fontWeight: 700, color: C.accent, letterSpacing: '0.03em' }}>
            🌸 母親節祝福卡片
          </h1>
          {wide && <p style={{ margin: '1px 0 0', fontSize: 10, color: C.sub }}>製作專屬賀卡，手機直接傳 LINE 給媽媽</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: wide ? 8 : 6 }}>
          {/* 即時數據（桌機版才顯示）*/}
          {wide && (stats.visits > 0 || stats.saves > 0) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '5px 14px', borderRadius: 20,
              background: 'linear-gradient(135deg,#FFF0F7,#FFE8F3)',
              border: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 11, color: C.sub, display: 'flex', alignItems: 'center', gap: 4 }}>
                🌸 <span style={{ fontWeight: 900, color: C.accent, fontSize: 13 }}>{stats.visits.toLocaleString()}</span>
                <span style={{ fontSize: 9 }}>人製作</span>
              </span>
              <span style={{ width: 1, height: 14, background: C.border, display: 'inline-block' }}/>
              <span style={{ fontSize: 11, color: C.sub, display: 'flex', alignItems: 'center', gap: 4 }}>
                💌 <span style={{ fontWeight: 900, color: C.accent, fontSize: 13 }}>{stats.saves.toLocaleString()}</span>
                <span style={{ fontSize: 9 }}>張送出</span>
              </span>
            </div>
          )}
          {/* 倒數計時 */}
          {daysLeft > 0 && (
            <div style={{
              padding: wide ? '5px 12px' : '4px 10px', borderRadius: 20,
              background: `linear-gradient(135deg,${C.light},#FFE8F2)`,
              border: `1px solid ${C.border}`,
              textAlign: 'center',
            }}>
              {wide && <p style={{ margin: 0, fontSize: 9, color: C.sub, lineHeight: 1 }}>距母親節</p>}
              <p style={{ margin: wide ? '1px 0 0' : 0, fontSize: wide ? 16 : 13, fontWeight: 900, color: C.accent, lineHeight: 1 }}>
                {wide ? daysLeft : `🗓 ${daysLeft}`}<span style={{ fontSize: 9, fontWeight: 500 }}> 天</span>
              </p>
            </div>
          )}
          {daysLeft === 0 && (
            <div style={{ padding: '4px 10px', borderRadius: 20, background: `linear-gradient(135deg,#FFE0ED,#FFD6EC)`, border: `1px solid ${C.border}` }}>
              <p style={{ margin: 0, fontSize: wide ? 11 : 10, fontWeight: 800, color: C.accent }}>🌸 母親節快樂！</p>
            </div>
          )}
          {/* 重置全部 */}
          <button onClick={handleResetAll} style={{
            padding: wide ? '6px 12px' : '5px 10px', borderRadius: 20, cursor: 'pointer',
            background: '#F9F4F7', border: `1px solid ${C.border}`,
            fontSize: wide ? 11 : 10, fontWeight: 600, color: C.sub,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            ↺ {wide ? '重置全部' : '重置'}
          </button>
        </div>
      </header>

      {wide ? (
        <div style={{ display: 'flex', gap: 16, maxWidth: 1220, margin: '0 auto', padding: '10px 14px', alignItems: 'stretch', height: 'calc(100dvh - 56px)', boxSizing: 'border-box' }}>
          <div style={{ width: 288, flexShrink: 0, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {LeftPanel}
          </div>
          {CardCenter}
          <div style={{ width: 252, flexShrink: 0, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {RightPanel}
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>{NarrowLayout}</div>
      )}

      {/* ── 預覽燈箱 ── */}
      {previewUrl && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setPreviewUrl(null); }}
        >
          <div style={{
            background: '#fff', borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            maxWidth: 420, width: '100%',
          }}>
            <img src={previewUrl} alt="卡片預覽" style={{ width: '100%', display: 'block' }}/>
            <div style={{ padding: '16px 20px', width: '100%', boxSizing: 'border-box', display: 'flex', gap: 10 }}>
              <button onClick={handleConfirmSave} style={{
                flex: 1, padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 800, color: '#fff',
                background: `linear-gradient(135deg,${C.accent},#A33B61)`, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 18 }}>💾</span> 確認儲存
              </button>
              <button onClick={() => setPreviewUrl(null)} style={{
                flex: 1, padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 700, color: C.accent,
                background: C.light, border: `1.5px solid ${C.border}`, cursor: 'pointer',
              }}>
                返回修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 新手引導 ── */}
      {onboardingStep >= 0 && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 900,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <div style={{
            background: '#fff', borderRadius: 22, padding: '28px 24px',
            maxWidth: 340, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            textAlign: 'center',
          }}>
            {/* 步驟指示 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
              {ONBOARDING_STEPS.map((_, i) => (
                <div key={i} style={{ width: i === onboardingStep ? 20 : 7, height: 7, borderRadius: 4, background: i === onboardingStep ? C.accent : C.border, transition: 'all 0.3s' }}/>
              ))}
            </div>
            <div style={{ fontSize: 42, marginBottom: 12 }}>{ONBOARDING_STEPS[onboardingStep].icon}</div>
            <h2 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, color: C.text }}>
              {ONBOARDING_STEPS[onboardingStep].title}
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: C.sub, lineHeight: 1.75 }}>
              {ONBOARDING_STEPS[onboardingStep].desc}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={finishOnboarding} style={{
                flex: 1, padding: '10px 0', borderRadius: 12, fontSize: 12, fontWeight: 600, color: C.sub,
                background: '#F5F0F3', border: `1px solid ${C.border}`, cursor: 'pointer',
              }}>跳過</button>
              <button onClick={() => {
                if (onboardingStep < ONBOARDING_STEPS.length - 1) setOnboardingStep((s) => s + 1);
                else finishOnboarding();
              }} style={{
                flex: 2, padding: '10px 0', borderRadius: 12, fontSize: 13, fontWeight: 800, color: '#fff',
                background: `linear-gradient(135deg,${C.accent},#E0608A)`, border: 'none', cursor: 'pointer',
              }}>
                {onboardingStep < ONBOARDING_STEPS.length - 1 ? '下一步 →' : '開始製作 🌸'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes mascotFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

// ── Micro-components ──────────────────────────────────────────
function Section({ title, children, wide, extra, grow }: {
  title: string; children: React.ReactNode; wide: boolean; extra?: React.ReactNode; grow?: boolean;
}) {
  return (
    <div style={{
      padding: wide ? '12px' : '0',
      borderBottom: wide ? `1px solid ${C.border}` : 'none',
      ...(grow ? { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } : {}),
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: C.sub, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</p>
        {extra}
      </div>
      {children}
    </div>
  );
}

function StepBtn({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 26, height: 26, borderRadius: '50%', background: '#fff',
      border: `1.5px solid ${C.border}`, cursor: 'pointer',
      fontSize: 15, fontWeight: 700, color: C.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
    }}>{children}</button>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      position: 'relative', width: 40, height: 22, borderRadius: 100,
      border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? C.accent : '#D1D5DB', transition: 'background 0.25s',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 20 : 2,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.18)', transition: 'left 0.25s',
      }}/>
    </button>
  );
}

const chipBtnStyle: React.CSSProperties = {
  fontSize: 9, color: C.sub, background: '#F5EDF2',
  border: `1px solid ${C.border}`, borderRadius: 7,
  padding: '2px 8px', cursor: 'pointer',
};

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
