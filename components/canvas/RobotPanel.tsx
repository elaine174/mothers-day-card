'use client';

import type { RobotOption } from '@/types';

export const ROBOT_OPTIONS: RobotOption[] = [
  { id: 'rabbit',   name: '兔子',    src: '/robots/兔子.webp',    defaultRotation: -6 },
  { id: 'angel',    name: '小天使',  src: '/robots/小天使.webp',  defaultRotation: -3 },
  { id: 'dog',      name: '狗狗',    src: '/robots/狗狗.webp',    defaultRotation: -4 },
  { id: 'gift',     name: '禮物盒',  src: '/robots/禮物盒.webp',  defaultRotation: 6  },
  { id: 'cat',      name: '貓咪',    src: '/robots/貓咪.webp',    defaultRotation: -5 },
  { id: 'balloon',  name: '造型氣球', src: '/robots/造型氣球.webp', defaultRotation: 4  },
  { id: 'cloud',    name: '雲朵',    src: '/robots/雲朵.webp',    defaultRotation: -3 },
  { id: 'bear',     name: '小熊熊',  src: '/robots/小熊熊.webp',  defaultRotation: 5  },
  { id: 'heartbox', name: '愛心盒',  src: '/robots/愛心盒.webp',  defaultRotation: -4 },
  { id: 'flower',   name: '鮮花',    src: '/robots/鮮花.webp',    defaultRotation: 8  },
  { id: 'rainbow',  name: '彩虹',    src: '/robots/彩虹.webp',    defaultRotation: 5  },
  { id: 'star',     name: '星星',    src: '/robots/星星.webp',    defaultRotation: 8  },
  { id: 'none',     name: '不加素材', src: '',                   defaultRotation: 0  },
];

interface RobotPanelProps {
  selectedRobotId: string;
  onSelect: (robot: RobotOption) => void;
}

export default function RobotPanel({ selectedRobotId, onSelect }: RobotPanelProps) {
  return (
    <aside style={{
      background: 'rgba(255,245,252,0.78)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderRadius: 28,
      border: '1.5px solid rgba(255,182,193,0.35)',
      boxShadow: '0 8px 32px rgba(255,105,180,0.12)',
      padding: '14px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>

      {/* 標題 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'linear-gradient(135deg, #FF91B8, #C084FC)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, boxShadow: '0 4px 12px rgba(255,105,180,0.3)',
        }}>🤖</div>
        <div>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 12, fontWeight: 800, color: '#D4448A', letterSpacing: '0.04em',
          }}>選擇機器人</p>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 9, color: 'rgba(160,80,110,0.65)',
          }}>拖曳移動・右下角縮放</p>
        </div>
      </div>

      {/* 分隔線 */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,182,193,0.4), transparent)' }}/>

      {/* 機器人選項格 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {ROBOT_OPTIONS.map((robot) => {
          const isSelected = selectedRobotId === robot.id;
          const isNone     = robot.id === 'none';

          return (
            <button
              key={robot.id}
              onClick={() => onSelect(robot)}
              style={{
                padding:      '8px 6px',
                borderRadius: 16,
                display:      'flex',
                flexDirection:'column',
                alignItems:   'center',
                gap:          5,
                cursor:       'pointer',
                background:   isSelected
                  ? 'linear-gradient(135deg, rgba(255,192,220,0.35), rgba(216,180,254,0.2))'
                  : 'rgba(255,255,255,0.65)',
                border: isSelected
                  ? '2px solid rgba(255,105,180,0.5)'
                  : '1.5px solid rgba(255,182,193,0.25)',
                boxShadow: isSelected
                  ? '0 4px 16px rgba(255,105,180,0.2)'
                  : '0 2px 6px rgba(255,105,180,0.06)',
                transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {/* 預覽圖 */}
              <div style={{
                width: 56, height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 12,
                background: isNone
                  ? 'rgba(200,200,200,0.15)'
                  : 'rgba(255,240,250,0.8)',
                border: '1px solid rgba(255,182,193,0.2)',
                overflow: 'hidden',
              }}>
                {isNone ? (
                  <span style={{ fontSize: 22, opacity: 0.4 }}>✕</span>
                ) : (
                  <img
                    src={robot.src}
                    alt={robot.name}
                    style={{ width: '90%', height: '90%', objectFit: 'contain' }}
                  />
                )}
              </div>

              {/* 名稱 */}
              <p style={{
                fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
                fontSize:   10,
                fontWeight: isSelected ? 800 : 600,
                color:      isSelected ? '#D4448A' : 'rgba(160,80,110,0.7)',
                letterSpacing: '0.02em',
              }}>
                {robot.name}
              </p>

              {/* 選中圓點 */}
              {isSelected && (
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#FF69B4',
                  boxShadow: '0 0 6px rgba(255,105,180,0.7)',
                }}/>
              )}
            </button>
          );
        })}
      </div>

      {/* 提示 */}
      <p style={{
        fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
        fontSize: 9, color: 'rgba(160,80,110,0.5)', textAlign: 'center',
        lineHeight: 1.5,
      }}>
        💡 在卡片上拖曳機器人<br/>右下角拖曳可調整大小
      </p>
    </aside>
  );
}
