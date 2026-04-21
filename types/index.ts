// ============================================================
// 母親節 AI 祝福創作站 — 全域型別定義
// ============================================================

/**
 * 員工資料結構
 * 未來串接 Lark SSO 後，這份資料將由 Lark API 動態取得
 */
export interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
  /** Q版角色圖的 SVG data URI 或圖片路徑 */
  characterImage: string;
  /** 角色主題色（用於卡片背景配色） */
  themeColor: string;
  /** 角色名稱（可作為創作時的標籤） */
  characterName?: string;
}

/**
 * 官方展示牆作品結構
 * 由管理者預設，不接受同仁投稿
 */
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  /** 展示圖片路徑或 SVG data URI */
  image: string;
  /** 作品風格標籤 */
  tags: string[];
  themeColor: string;
}

/**
 * 前台活動統計
 */
export interface ActivityStats {
  participantCount: number;
  generatedCount: number;
  officialGalleryCount: number;
}

/**
 * 貼紙 / 裝飾元素定義
 */
export interface DecorationItem {
  id: string;
  name: string;
  /** 顯示在貼紙抽屜的 emoji 或 SVG */
  icon: string;
  /** 類別（flower, heart, gift, cloud, robot, star...） */
  category: DecorationCategory;
  /** 畫布上的尺寸（px） */
  defaultSize: number;
}

export type DecorationCategory =
  | 'flower'
  | 'heart'
  | 'gift'
  | 'cloud'
  | 'robot'
  | 'star'
  | 'special';

/**
 * 已放置在畫布上的裝飾元素
 */
export interface PlacedDecoration {
  instanceId: string;       // 每個放置實例的唯一 ID
  decorationId: string;     // 對應的 DecorationItem.id
  icon: string;
  x: number;                // 在畫布中的位置（百分比 0–100）
  y: number;
  size: number;             // 尺寸（px）
  rotation: number;         // 旋轉角度
  zIndex: number;
}

/**
 * AI 文案風格
 */
export type AiTextStyle = 'gentle' | 'casual' | 'cute';

/**
 * 可互動元素（角色、機器人）的位置與大小
 */
export interface InteractiveElement {
  /** 元素中心點 X 位置（百分比，0–100）*/
  x: number;
  /** 元素中心點 Y 位置（百分比，0–100）*/
  y: number;
  /** 元素寬度（佔容器寬度的百分比）*/
  size: number;
  /** 旋轉角度（度）*/
  rotation: number;
}

/**
 * 機器人模板選項
 */
export interface RobotOption {
  id: string;
  name: string;
  src: string;
  defaultRotation: number;
}

/**
 * 已放置在卡片上的機器人實例（可多隻）
 */
export interface PlacedRobot {
  instanceId: string;
  src: string;
  name: string;
  x: number;        // 中心 X（百分比 0–100）
  y: number;        // 中心 Y（百分比 0–100）
  size: number;     // 寬度（佔容器寬度的百分比）
  rotation: number;
  zIndex: number;
}

/**
 * 創作卡片狀態（創作畫布的完整狀態）
 */
export interface CardState {
  employee: Employee | null;
  blessingText: string;
  showName: boolean;
  decorations: PlacedDecoration[];
  bgVariant: 'pink' | 'lavender' | 'peach';
}
