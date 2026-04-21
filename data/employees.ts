import type { Employee } from '@/types';

// ============================================================
// 員工資料（共 30 位）
// ============================================================
// TODO: [Lark SSO 串接點] 未來由 Lark OAuth API 動態取得
// ============================================================


// ── 所有已上傳真實 PNG 的員工（按英文字母排序）─────────────────
const employeeData: { name: string; dept: string; image: string; color: string }[] = [
  { name: 'Alan',    dept: '工程開發部', image: '/characters/Alan.png',    color: '#93C5FD' },
  { name: 'Ann',     dept: '行銷企劃部', image: '/characters/Ann.png',     color: '#F9A8D4' },
  { name: 'Anthony', dept: '業務發展部', image: '/characters/Anthony.png', color: '#FDBA74' },
  { name: 'Bruce',   dept: '產品設計部', image: '/characters/Bruce.png',   color: '#A7F3D0' },
  { name: 'Eason',   dept: '業務發展部', image: '/characters/Eason.png',   color: '#FDE68A' },
  { name: 'Eileen',  dept: '人力資源部', image: '/characters/Eileen.png',  color: '#FBCFE8' },
  { name: 'Eric',    dept: '技術架構部', image: '/characters/Eric.png',    color: '#BAE6FD' },
  { name: 'Erin',    dept: '設計創意部', image: '/characters/Erin.png',    color: '#DDD6FE' },
  { name: 'Henry',   dept: '技術架構部', image: '/characters/Henry.png',   color: '#BAE6FD' },
  { name: 'Jackson', dept: '客戶服務部', image: '/characters/Jackson.png', color: '#FECACA' },
  { name: 'Jay',     dept: '品牌公關部', image: '/characters/Jay.png',     color: '#C7D2FE' },
  { name: 'John',    dept: '財務會計部', image: '/characters/John.png',    color: '#FEF08A' },
  { name: 'Joyce',   dept: '行銷企劃部', image: '/characters/Joyce.png',   color: '#FCA5A5' },
  { name: 'Judy',    dept: '人力資源部', image: '/characters/Judy.png',    color: '#FBCFE8' },
  { name: 'Justin',  dept: '品牌公關部', image: '/characters/Justin.png',  color: '#C7D2FE' },
  { name: 'Kira',    dept: '設計創意部', image: '/characters/Kira.png',    color: '#DDD6FE' },
  { name: 'Lars',    dept: '財務會計部', image: '/characters/Lars.png',    color: '#FEF08A' },
  { name: 'Leo',     dept: '工程開發部', image: '/characters/Leo.png',     color: '#93C5FD' },
  { name: 'Murphy',  dept: '營運管理部', image: '/characters/Murphy.png',  color: '#6EE7B7' },
  { name: 'Naomi',   dept: '行銷企劃部', image: '/characters/Naomi.png',   color: '#F9A8D4' },
  { name: 'Nick',    dept: '數位創新部', image: '/characters/Nick.png',    color: '#6EE7B7' },
  { name: 'Noah',    dept: '產品設計部', image: '/characters/Noah.png',    color: '#A5F3FC' },
  { name: 'Pun',     dept: '設計創意部', image: '/characters/Pun.png',     color: '#FECDD3' },
  { name: 'River',   dept: '產品設計部', image: '/characters/River.png',   color: '#A5F3FC' },
  { name: 'Robin',   dept: '法務合規部', image: '/characters/Robin.png',   color: '#BBF7D0' },
  { name: 'Roxy',    dept: '設計創意部', image: '/characters/Roxy.png',    color: '#FECDD3' },
  { name: 'Ryan',    dept: '業務發展部', image: '/characters/Ryan.png',    color: '#FCA5A5' },
  { name: 'Sion',    dept: '技術架構部', image: '/characters/Sion.png',    color: '#BAE6FD' },
  { name: 'Sonya',   dept: '人力資源部', image: '/characters/Sonya.png',   color: '#FDE68A' },
  { name: 'Sylas',   dept: '產品研發部', image: '/characters/Sylas.png',   color: '#D8B4FE' },
];

export const employeeProfiles: Employee[] = employeeData.map((e, i) => ({
  id: `emp-${String(i + 1).padStart(3, '0')}`,
  name: e.name,
  department: e.dept,
  email: `${e.name.toLowerCase().replace(/\s/g, '.')}@company.com`,
  characterImage: e.image,
  themeColor: e.color,
}));
