import type { DecorationItem } from '@/types';

// ============================================================
// 貼紙 / 裝飾元素資料
// ============================================================

export const decorationItems: DecorationItem[] = [
  // 花朵類
  { id: 'deco-flower-1', name: '櫻花', icon: '🌸', category: 'flower', defaultSize: 48 },
  { id: 'deco-flower-2', name: '玫瑰', icon: '🌹', category: 'flower', defaultSize: 44 },
  { id: 'deco-flower-3', name: '向日葵', icon: '🌻', category: 'flower', defaultSize: 48 },
  { id: 'deco-flower-4', name: '鬱金香', icon: '🌷', category: 'flower', defaultSize: 44 },
  { id: 'deco-flower-5', name: '雛菊', icon: '🌼', category: 'flower', defaultSize: 44 },
  { id: 'deco-flower-6', name: '花束', icon: '💐', category: 'flower', defaultSize: 52 },

  // 愛心類
  { id: 'deco-heart-1', name: '紅心', icon: '❤️', category: 'heart', defaultSize: 40 },
  { id: 'deco-heart-2', name: '粉心', icon: '🩷', category: 'heart', defaultSize: 38 },
  { id: 'deco-heart-3', name: '愛心泡泡', icon: '💕', category: 'heart', defaultSize: 44 },
  { id: 'deco-heart-4', name: '愛心眼睛', icon: '😍', category: 'heart', defaultSize: 44 },
  { id: 'deco-heart-5', name: '愛心箭', icon: '💘', category: 'heart', defaultSize: 44 },
  { id: 'deco-heart-6', name: '愛心信封', icon: '💌', category: 'heart', defaultSize: 44 },

  // 禮物類
  { id: 'deco-gift-1', name: '禮物盒', icon: '🎁', category: 'gift', defaultSize: 48 },
  { id: 'deco-gift-2', name: '氣球', icon: '🎈', category: 'gift', defaultSize: 44 },
  { id: 'deco-gift-3', name: '蛋糕', icon: '🎂', category: 'gift', defaultSize: 48 },
  { id: 'deco-gift-4', name: '茶杯', icon: '☕', category: 'gift', defaultSize: 40 },
  { id: 'deco-gift-5', name: '草莓', icon: '🍓', category: 'gift', defaultSize: 40 },
  { id: 'deco-gift-6', name: '皇冠', icon: '👑', category: 'gift', defaultSize: 44 },

  // 雲朵光點類
  { id: 'deco-cloud-1', name: '白雲', icon: '☁️', category: 'cloud', defaultSize: 52 },
  { id: 'deco-cloud-2', name: '彩虹', icon: '🌈', category: 'cloud', defaultSize: 52 },
  { id: 'deco-cloud-3', name: '星星', icon: '⭐', category: 'star', defaultSize: 36 },
  { id: 'deco-cloud-4', name: '閃亮', icon: '✨', category: 'star', defaultSize: 40 },
  { id: 'deco-cloud-5', name: '月亮', icon: '🌙', category: 'cloud', defaultSize: 40 },
  { id: 'deco-cloud-6', name: '煙火', icon: '🎆', category: 'special', defaultSize: 52 },

  // 機器人 AI 類（特色素材）
  { id: 'deco-robot-1', name: '可愛機器人', icon: '🤖', category: 'robot', defaultSize: 52 },
  { id: 'deco-robot-2', name: '外星人', icon: '👾', category: 'robot', defaultSize: 48 },
  { id: 'deco-robot-3', name: '魔法棒', icon: '🪄', category: 'special', defaultSize: 44 },
  { id: 'deco-robot-4', name: '蝴蝶', icon: '🦋', category: 'special', defaultSize: 44 },
];

// 依類別分組（方便 UI 展示）
export const decorationCategories = [
  { id: 'flower', label: '花朵', icon: '🌸' },
  { id: 'heart', label: '愛心', icon: '❤️' },
  { id: 'gift', label: '禮物', icon: '🎁' },
  { id: 'cloud', label: '雲朵光點', icon: '✨' },
  { id: 'robot', label: '機器人', icon: '🤖' },
];
