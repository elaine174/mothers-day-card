import type { ActivityStats } from '@/types';

// ============================================================
// 活動統計 Mock 資料
// ============================================================
// TODO: 未來可串接 Supabase 等雲端資料庫，即時更新統計數字
//   建議方案：
//   - Supabase Realtime 訂閱，卡片生成時自動 +1
//   - 或使用簡單的 Vercel KV 儲存計數器
// ============================================================

export const activityStats: ActivityStats = {
  participantCount: 47,       // 已參與人數
  generatedCount: 128,        // 已生成卡片數
  officialGalleryCount: 6,    // 官方展示作品數
};

// 活動統計展示文案
export const statsConfig = [
  {
    key: 'participantCount' as keyof ActivityStats,
    label: '參與同仁',
    unit: '人',
    icon: '👥',
    color: '#FF69B4',
  },
  {
    key: 'generatedCount' as keyof ActivityStats,
    label: '已生成卡片',
    unit: '張',
    icon: '💌',
    color: '#A78BFA',
  },
  {
    key: 'officialGalleryCount' as keyof ActivityStats,
    label: '官方展示作品',
    unit: '件',
    icon: '🌸',
    color: '#34D399',
  },
];
