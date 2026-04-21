'use client';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { Employee, InteractiveElement, PlacedDecoration, PlacedRobot } from '@/types';

// ── 互動模式型別 ──────────────────────────────────────────────
type InteractionMode =
  | { type: 'char-drag';        startX: number; startY: number; startEX: number; startEY: number }
  | { type: 'char-resize';      startX: number; startSize: number }
  | { type: 'robot-drag';       instanceId: string; startX: number; startY: number; startEX: number; startEY: number }
  | { type: 'robot-resize';     instanceId: string; startX: number; startSize: number }
  | { type: 'deco-drag';        instanceId: string; startX: number; startY: number; startEX: number; startEY: number };

// ── Props ──────────────────────────────────────────────────────
interface PosterCanvasProps {
  employee:              Employee;
  blessingText:          string;
  showName:              boolean;
  fontSize:              number;
  bgSrc:                 string;
  decorations:           PlacedDecoration[];
  robots:                PlacedRobot[];
  characterPos:          InteractiveElement;
  selectedRobotId?:      string | null;
  onCharacterPosChange?: (pos: InteractiveElement) => void;
  onRobotChange?:        (robots: PlacedRobot[]) => void;
  onRobotSelect?:        (instanceId: string | null) => void;
  onDecorationMove?:     (instanceId: string, x: number, y: number) => void;
  onDecorationRemove?:   (instanceId: string) => void;
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

// 卡片比例 430:590
// html2canvas@1.4.1 不支援 aspect-ratio CSS，改用 padding-bottom hack
// ref 掛在「外層」（有明確高度），html2canvas 才能正確讀取尺寸
const CARD_PB = `${(590 / 430 * 100).toFixed(4)}%`; // "137.2093%"

const CLICK_THRESHOLD = 6;

const PosterCanvas = forwardRef<HTMLDivElement, PosterCanvasProps>(
  (
    {
      employee, blessingText, showName, fontSize, bgSrc,
      decorations, robots, characterPos,
      selectedRobotId, onCharacterPosChange, onRobotChange,
      onRobotSelect, onDecorationMove, onDecorationRemove,
    },
    ref
  ) => {
    // containerRef 指向「外層」div，用於互動座標計算（與外部 posterRef 相同節點）
    const containerRef  = useRef<HTMLDivElement>(null);
    const interaction   = useRef<InteractionMode | null>(null);
    const pointerStart  = useRef<{ x: number; y: number } | null>(null);

    // 角色選取狀態（內部管理）
    const [charSelected, setCharSelected] = useState(false);

    // 穩定的合併 ref：把外部 posterRef 和內部 containerRef 都指向「外層」DOM 節點
    // html2canvas 截圖目標 = 外層 div（有 paddingBottom 提供明確高度）
    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    // ── 統一指標移動 ──────────────────────────────────────────
    const handlePointerMove = useCallback(
      (clientX: number, clientY: number) => {
        const mode = interaction.current;
        if (!mode || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        switch (mode.type) {
          case 'char-drag': {
            const dx = (clientX - mode.startX) / rect.width  * 100;
            const dy = (clientY - mode.startY) / rect.height * 100;
            onCharacterPosChange?.({ ...characterPos, x: clamp(mode.startEX + dx, 5, 95), y: clamp(mode.startEY + dy, 5, 95) });
            break;
          }
          case 'char-resize': {
            const dx = (clientX - mode.startX) / rect.width * 100;
            onCharacterPosChange?.({ ...characterPos, size: clamp(mode.startSize + dx * 1.6, 18, 90) });
            break;
          }
          case 'robot-drag': {
            const dx = (clientX - mode.startX) / rect.width  * 100;
            const dy = (clientY - mode.startY) / rect.height * 100;
            onRobotChange?.(robots.map((r) =>
              r.instanceId === mode.instanceId
                ? { ...r, x: clamp(mode.startEX + dx, 3, 97), y: clamp(mode.startEY + dy, 3, 97) }
                : r
            ));
            break;
          }
          case 'robot-resize': {
            const dx = (clientX - mode.startX) / rect.width * 100;
            onRobotChange?.(robots.map((r) =>
              r.instanceId === mode.instanceId
                ? { ...r, size: clamp(mode.startSize + dx * 1.6, 6, 55) }
                : r
            ));
            break;
          }
          case 'deco-drag': {
            const dx = (clientX - mode.startX) / rect.width  * 100;
            const dy = (clientY - mode.startY) / rect.height * 100;
            onDecorationMove?.(mode.instanceId, clamp(mode.startEX + dx, 3, 97), clamp(mode.startEY + dy, 3, 97));
            break;
          }
        }
      },
      [characterPos, robots, onCharacterPosChange, onRobotChange, onDecorationMove]
    );

    // ── 指標結束：判斷是否為「點擊」 ─────────────────────────
    const handlePointerUp = useCallback(
      (clientX: number, clientY: number) => {
        const mode  = interaction.current;
        const start = pointerStart.current;
        if (mode && start) {
          const dist = Math.hypot(clientX - start.x, clientY - start.y);
          if (dist < CLICK_THRESHOLD) {
            if (mode.type === 'robot-drag') {
              // 點素材：切換選取狀態，同時取消角色選取
              setCharSelected(false);
              onRobotSelect?.(selectedRobotId === mode.instanceId ? null : mode.instanceId);
            } else if (mode.type === 'char-drag') {
              // 點角色：切換角色選取，同時取消素材選取
              onRobotSelect?.(null);
              setCharSelected((prev) => !prev);
            }
          }
        }
        interaction.current  = null;
        pointerStart.current = null;
      },
      [selectedRobotId, onRobotSelect]
    );

    useEffect(() => {
      const onMove     = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
      const onTouch    = (e: TouchEvent) => { if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY); };
      const onUp       = (e: MouseEvent) => handlePointerUp(e.clientX, e.clientY);
      const onTouchEnd = (e: TouchEvent) => { const t = e.changedTouches[0]; if (t) handlePointerUp(t.clientX, t.clientY); };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onTouch, { passive: false });
      window.addEventListener('mouseup',   onUp);
      window.addEventListener('touchend',  onTouchEnd);
      return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onTouch);
        window.removeEventListener('mouseup',   onUp);
        window.removeEventListener('touchend',  onTouchEnd);
      };
    }, [handlePointerMove, handlePointerUp]);

    const startDrag = (e: React.MouseEvent | React.TouchEvent, mode: InteractionMode) => {
      e.preventDefault(); e.stopPropagation();
      interaction.current = mode;
      const isTouch = 'touches' in e;
      pointerStart.current = {
        x: isTouch ? e.touches[0].clientX : e.clientX,
        y: isTouch ? e.touches[0].clientY : e.clientY,
      };
    };

    const resizeHandle: React.CSSProperties = {
      position: 'absolute', bottom: -8, right: -8,
      width: 22, height: 22, borderRadius: '50%',
      background: 'white', border: '2.5px solid rgba(201,78,122,0.85)',
      cursor: 'se-resize', zIndex: 20,
      boxShadow: '0 2px 8px rgba(201,78,122,0.4)',
      touchAction: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    };
    const ignoreAttr = { 'data-html2canvas-ignore': 'true' } as Record<string, string>;
    const displayText = blessingText.slice(0, 72);

    // ── 重點：ref 掛在「外層」div（paddingBottom 提供明確高度）──
    // html2canvas 截圖時能正確讀取 offsetHeight，百分比子元素位置才會準確
    return (
      <div
        ref={mergedRef}
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: CARD_PB,
          borderRadius: 18,
          overflow: 'hidden',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {/* 內層：絕對定位填滿外層，overflow hidden 防止子元素溢出 */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

          {/* ── 背景圖（點擊背景取消所有選取）── */}
          <img src={bgSrc} alt="card background" draggable={false}
            onMouseDown={() => { setCharSelected(false); onRobotSelect?.(null); }}
            onTouchStart={() => { setCharSelected(false); onRobotSelect?.(null); }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, cursor: 'default' }}
          />

          {/* ── Q版人物 ── */}
          <div
            onMouseDown={(e) => startDrag(e, { type: 'char-drag', startX: e.clientX, startY: e.clientY, startEX: characterPos.x, startEY: characterPos.y })}
            onTouchStart={(e) => startDrag(e, { type: 'char-drag', startX: e.touches[0].clientX, startY: e.touches[0].clientY, startEX: characterPos.x, startEY: characterPos.y })}
            style={{
              position: 'absolute',
              left: `${characterPos.x}%`, top: `${characterPos.y}%`,
              width: `${characterPos.size}%`,
              transform: `translate(-50%, -50%) rotate(${characterPos.rotation}deg)`,
              zIndex: 5, cursor: charSelected ? 'grab' : 'pointer', touchAction: 'none',
            }}
          >
            <div style={{ position: 'absolute', inset: '-12%', borderRadius: '50%', background: `radial-gradient(circle, ${employee.themeColor}30 0%, transparent 70%)`, filter: 'blur(14px)', pointerEvents: 'none' }}/>
            <img src={employee.characterImage} alt={employee.name} draggable={false}
              style={{ width: '100%', height: 'auto', objectFit: 'contain', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 6px 14px rgba(200,100,150,0.2))', pointerEvents: 'none' }}
            />
            {/* 選取框 + resize handle：只在選取時顯示 */}
            {charSelected && (
              <>
                <div {...ignoreAttr} style={{
                  position: 'absolute', inset: -4,
                  border: '2px dashed rgba(201,78,122,0.7)',
                  borderRadius: 6, pointerEvents: 'none', zIndex: 1,
                }}/>
                <div {...ignoreAttr} style={resizeHandle}
                  onMouseDown={(e) => startDrag(e, { type: 'char-resize', startX: e.clientX, startSize: characterPos.size })}
                  onTouchStart={(e) => startDrag(e, { type: 'char-resize', startX: e.touches[0].clientX, startSize: characterPos.size })}
                >
                  <span style={{ fontSize: 10, lineHeight: 1, userSelect: 'none', color: 'rgba(201,78,122,0.85)' }}>⤡</span>
                </div>
              </>
            )}
          </div>

          {/* ── 多隻素材 ── */}
          {robots.map((robot) => {
            const isSelected = selectedRobotId === robot.instanceId;
            return (
              <div key={robot.instanceId}
                onMouseDown={(e) => startDrag(e, { type: 'robot-drag', instanceId: robot.instanceId, startX: e.clientX, startY: e.clientY, startEX: robot.x, startEY: robot.y })}
                onTouchStart={(e) => startDrag(e, { type: 'robot-drag', instanceId: robot.instanceId, startX: e.touches[0].clientX, startY: e.touches[0].clientY, startEX: robot.x, startEY: robot.y })}
                onDoubleClick={() => onRobotChange?.(robots.filter((r) => r.instanceId !== robot.instanceId))}
                style={{
                  position: 'absolute',
                  left: `${robot.x}%`, top: `${robot.y}%`,
                  width: `${robot.size}%`,
                  transform: `translate(-50%, -50%) rotate(${robot.rotation}deg)`,
                  zIndex: robot.zIndex, cursor: 'grab', touchAction: 'none',
                }}
                title="點選後可調整旋轉 ▪ 雙擊移除"
              >
                <img src={robot.src} alt={robot.name} draggable={false}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(180,80,130,0.18))', pointerEvents: 'none', display: 'block' }}
                />
                {/* 選取框 + resize handle：只在選取時顯示 */}
                {isSelected && (
                  <>
                    <div {...ignoreAttr} style={{
                      position: 'absolute', inset: -4,
                      border: '2px dashed rgba(201,78,122,0.7)',
                      borderRadius: 6, pointerEvents: 'none', zIndex: 1,
                    }}/>
                    <div {...ignoreAttr} style={resizeHandle}
                      onMouseDown={(e) => startDrag(e, { type: 'robot-resize', instanceId: robot.instanceId, startX: e.clientX, startSize: robot.size })}
                      onTouchStart={(e) => startDrag(e, { type: 'robot-resize', instanceId: robot.instanceId, startX: e.touches[0].clientX, startSize: robot.size })}
                    >
                      <span style={{ fontSize: 10, lineHeight: 1, userSelect: 'none', color: 'rgba(201,78,122,0.85)' }}>⤡</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* ── 貼紙 ── */}
          {decorations.map((deco) => (
            <div key={deco.instanceId}
              onMouseDown={(e) => startDrag(e, { type: 'deco-drag', instanceId: deco.instanceId, startX: e.clientX, startY: e.clientY, startEX: deco.x, startEY: deco.y })}
              onDoubleClick={() => onDecorationRemove?.(deco.instanceId)}
              style={{
                position: 'absolute',
                left: `${deco.x}%`, top: `${deco.y}%`,
                transform: `translate(-50%, -50%) rotate(${deco.rotation}deg)`,
                fontSize: `${deco.size}px`, cursor: 'grab', userSelect: 'none', zIndex: deco.zIndex,
                filter: 'drop-shadow(0 2px 5px rgba(200,100,150,0.2))',
              }}
            >{deco.icon}</div>
          ))}

          {/* ── 文字框 ── */}
          <div style={{
            position: 'absolute',
            top: '79%', left: '7%', right: '7%', height: '18%',
            zIndex: 4,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '1.5% 4%',
            overflow: 'hidden',
          }}>
            <p style={{
              fontFamily: "'NaniFont', 'Noto Serif TC', serif",
              fontSize:   `${fontSize}px`,
              lineHeight: 1.9,
              color:      '#b03070',
              textAlign:  'center',
              wordBreak:  'break-all',
              whiteSpace: 'pre-line',
              width:      '100%',
              margin:     0,
              overflow:   'hidden',
              display:    '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}>
              {displayText || '在這裡輸入你想對媽媽說的話...'}
            </p>
            {showName && (
              <p style={{
                fontSize:      `${Math.max(8, fontSize - 2)}px`,
                color:         '#c8507a',
                opacity:       0.85,
                letterSpacing: '0.1em',
                fontFamily:    "'NaniFont', 'Noto Serif TC', serif",
                textAlign:     'center',
                margin:        '1.5% 0 0',
                flexShrink:    0,
              }}>— {employee.name} 敬上 ♡</p>
            )}
          </div>

        </div>{/* end inner */}
      </div>
    );
  }
);

PosterCanvas.displayName = 'PosterCanvas';
export default PosterCanvas;
