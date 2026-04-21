import type { GalleryItem } from '@/types';

// ============================================================
// 官方展示牆 Mock 資料
// ============================================================
// 這裡的圖片僅供展示靈感，不接受同仁投稿
// 未來可替換為實際官方高品質設計素材
// ============================================================

/**
 * 建立官方展示卡 SVG（模擬精緻母親節卡片）
 */
function createOfficialCardSVG(
  bg1: string,
  bg2: string,
  accentColor: string,
  title: string,
  subtitle: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg1}"/>
      <stop offset="100%" style="stop-color:${bg2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:white;stop-opacity:0.6"/>
      <stop offset="100%" style="stop-color:white;stop-opacity:0"/>
    </radialGradient>
  </defs>

  <!-- 背景 -->
  <rect width="300" height="400" fill="url(#bg)" rx="20"/>

  <!-- 柔焦光點 -->
  <circle cx="60" cy="70" r="50" fill="${bg1}" opacity="0.3"/>
  <circle cx="240" cy="120" r="60" fill="white" opacity="0.15"/>
  <circle cx="50" cy="320" r="40" fill="${bg2}" opacity="0.25"/>
  <circle cx="270" cy="350" r="55" fill="white" opacity="0.12"/>

  <!-- 裝飾花朵（左上） -->
  <g transform="translate(30, 30)">
    <circle cx="0" cy="0" r="14" fill="${accentColor}" opacity="0.7"/>
    <circle cx="20" cy="-10" r="10" fill="${accentColor}" opacity="0.6"/>
    <circle cx="10" cy="18" r="11" fill="${accentColor}" opacity="0.55"/>
    <circle cx="-18" cy="8" r="9" fill="${accentColor}" opacity="0.5"/>
    <circle cx="0" cy="0" r="6" fill="white" opacity="0.8"/>
  </g>

  <!-- 裝飾花朵（右上） -->
  <g transform="translate(260, 50)">
    <circle cx="0" cy="0" r="12" fill="${accentColor}" opacity="0.65"/>
    <circle cx="-16" cy="-8" r="9" fill="${accentColor}" opacity="0.55"/>
    <circle cx="8" cy="16" r="10" fill="${accentColor}" opacity="0.6"/>
    <circle cx="16" cy="-14" r="8" fill="${accentColor}" opacity="0.5"/>
    <circle cx="0" cy="0" r="5" fill="white" opacity="0.75"/>
  </g>

  <!-- 愛心裝飾 -->
  <text x="20" y="100" font-size="18" fill="${accentColor}" opacity="0.5">♡</text>
  <text x="270" y="160" font-size="14" fill="${accentColor}" opacity="0.45">♡</text>
  <text x="35" y="360" font-size="16" fill="${accentColor}" opacity="0.4">♡</text>
  <text x="255" y="380" font-size="20" fill="${accentColor}" opacity="0.35">♡</text>

  <!-- 星點 -->
  <text x="80" y="50" font-size="10" fill="white" opacity="0.7">✦</text>
  <text x="215" y="35" font-size="8" fill="white" opacity="0.6">✦</text>
  <text x="270" y="250" font-size="9" fill="white" opacity="0.65">✦</text>
  <text x="15" y="200" font-size="7" fill="white" opacity="0.55">✦</text>

  <!-- 英文主標題 -->
  <text x="150" y="105" text-anchor="middle" font-family="Georgia, serif" font-size="18"
        fill="white" opacity="0.9" font-style="italic">Happy Mother's Day</text>

  <!-- 裝飾橫線 -->
  <line x1="60" y1="115" x2="240" y2="115" stroke="white" stroke-width="1" opacity="0.4"/>

  <!-- 中文主標 -->
  <text x="150" y="148" text-anchor="middle" font-family="serif" font-size="22"
        fill="white" font-weight="bold" opacity="0.95">媽媽我愛你</text>

  <!-- Q版角色佔位（圓形+文字） -->
  <circle cx="150" cy="250" r="68" fill="white" opacity="0.25"/>
  <circle cx="150" cy="250" r="60" fill="white" opacity="0.2"/>
  <text x="150" y="242" text-anchor="middle" font-size="60" fill="white" opacity="0.7">👩</text>
  <text x="150" y="285" text-anchor="middle" font-family="sans-serif" font-size="11"
        fill="white" opacity="0.6">${title}</text>

  <!-- 祝福文字 -->
  <text x="150" y="330" text-anchor="middle" font-family="serif" font-size="12"
        fill="white" opacity="0.85">${subtitle}</text>

  <!-- 底部裝飾 -->
  <g transform="translate(150, 375)">
    <text x="-40" y="0" font-size="14" fill="white" opacity="0.5">✿</text>
    <text x="-10" y="0" font-size="12" fill="white" opacity="0.6">♡</text>
    <text x="15" y="0" font-size="14" fill="white" opacity="0.5">✿</text>
    <text x="30" y="0" font-size="10" fill="white" opacity="0.55">♡</text>
  </g>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const officialGalleryItems: GalleryItem[] = [
  {
    id: 'gallery-001',
    title: '粉紅玫瑰版',
    description: '以粉紅玫瑰為主題，搭配溫柔漸層，適合表達柔軟細膩的心意。',
    image: createOfficialCardSVG('#FF91B8', '#F9A8D4', '#FFD6E7', '專屬角色', '謝謝妳的愛'),
    tags: ['粉紅', '玫瑰', '溫柔'],
    themeColor: '#FF91B8',
  },
  {
    id: 'gallery-002',
    title: '薰衣草夢幻版',
    description: '紫色薰衣草搭配夢幻光點，為媽媽創造一個充滿魔法的祝福。',
    image: createOfficialCardSVG('#A78BFA', '#C4B5FD', '#DDD6FE', '紫色精靈', '妳是最美的魔法'),
    tags: ['紫色', '薰衣草', '夢幻'],
    themeColor: '#A78BFA',
  },
  {
    id: 'gallery-003',
    title: '珊瑚橘暖版',
    description: '溫暖的珊瑚橘色調，如同媽媽給我們的溫暖擁抱。',
    image: createOfficialCardSVG('#FB7185', '#FCA5A5', '#FED7AA', '小太陽', '妳的溫暖是我的光'),
    tags: ['橘色', '珊瑚', '溫暖'],
    themeColor: '#FB7185',
  },
  {
    id: 'gallery-004',
    title: '天空藍清新版',
    description: '清爽天空藍，搭配白雲與星點，送給最清澈美麗的媽媽。',
    image: createOfficialCardSVG('#60A5FA', '#93C5FD', '#BAE6FD', '藍天精靈', '妳是我的晴天'),
    tags: ['藍色', '清新', '天空'],
    themeColor: '#60A5FA',
  },
  {
    id: 'gallery-005',
    title: '森林綠自然版',
    description: '充滿生命力的森林綠，象徵媽媽如大樹般的守護與包容。',
    image: createOfficialCardSVG('#34D399', '#6EE7B7', '#A7F3D0', '小森靈', '謝謝妳的守護'),
    tags: ['綠色', '自然', '森林'],
    themeColor: '#34D399',
  },
  {
    id: 'gallery-006',
    title: '星空夢境版',
    description: '深邃夢幻的星空色調，代表媽媽是夜晚最亮的那顆星。',
    image: createOfficialCardSVG('#818CF8', '#A5B4FC', '#C7D2FE', '星空旅人', '妳是我的北極星'),
    tags: ['星空', '夢幻', '深邃'],
    themeColor: '#818CF8',
  },
];
