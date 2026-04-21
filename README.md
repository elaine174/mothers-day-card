# 🌸 母親節 AI 祝福創作站

> 用你的專屬 Q 版角色，送給媽媽一張最溫暖的母親節祝福

---

## 🚀 本機執行步驟

```bash
# 1. 進入專案目錄
cd mothers-day-app

# 2. 安裝依賴套件
npm install

# 3. 啟動開發伺服器
npm run dev

# 4. 開啟瀏覽器訪問
# http://localhost:3000
```

---

## 📁 專案結構

```
mothers-day-app/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 全站 Layout（含 Navigation）
│   ├── globals.css               # 全站樣式（含動畫關鍵影格）
│   ├── page.tsx                  # 首頁（Banner + 統計 + 展示牆預覽）
│   ├── select/page.tsx           # 員工角色選擇頁
│   ├── canvas/page.tsx           # 創作畫布頁（核心）
│   └── gallery/page.tsx          # 官方展示牆頁
│
├── components/
│   ├── shared/
│   │   └── Navigation.tsx        # 全站導覽列
│   ├── home/
│   │   ├── HeroBanner.tsx        # 首頁主視覺 Banner
│   │   └── StatsSection.tsx      # 活動統計數字區
│   ├── employee/
│   │   ├── EmployeeCard.tsx      # 員工角色卡片
│   │   └── EmployeeSelector.tsx  # 員工選擇頁主元件
│   ├── canvas/
│   │   ├── CreativeCanvas.tsx    # 創作畫布主元件（三欄佈局）
│   │   ├── PosterCanvas.tsx      # 卡片畫布（html2canvas 截圖目標）
│   │   ├── DecorationPanel.tsx   # 左側貼紙素材庫
│   │   ├── BlessingEditor.tsx    # 右側文字編輯器
│   │   ├── AiHelperBot.tsx       # AI 文案小幫手機器人
│   │   └── DownloadActions.tsx   # 下載 + LINE 分享功能
│   └── gallery/
│       └── OfficialGallery.tsx   # 官方展示牆
│
├── data/
│   ├── employees.ts              # 員工 Mock 資料（含 Q版 SVG 角色）
│   ├── gallery.ts                # 官方展示牆 Mock 資料
│   ├── decorations.ts            # 貼紙素材資料
│   └── stats.ts                  # 活動統計 Mock 資料
│
├── lib/
│   └── aiTexts.ts                # AI 文案預設文字 + Mock 改寫邏輯
│
├── types/
│   └── index.ts                  # 全域 TypeScript 型別定義
│
├── tailwind.config.ts            # Tailwind 設定（含自訂動畫/色彩）
├── next.config.js                # Next.js 設定
└── tsconfig.json                 # TypeScript 設定
```

---

## 🔮 未來串接指南

### 1. Lark SSO 登入串接

**搜尋 `TODO: [Lark SSO 串接點]`** 在以下檔案中找到所有需要修改的位置：

- `components/employee/EmployeeSelector.tsx` — 替換為 Lark OAuth 登入入口
- `app/canvas/page.tsx` — 改從 Lark session 取得員工資料

**實作步驟：**
1. 在 Lark 開放平台建立應用，取得 `App ID` 和 `App Secret`
2. 建立 `app/api/auth/lark/route.ts` 處理 OAuth callback
3. 呼叫 `https://open.larksuite.com/open-apis/contact/v3/users/me` 取得員工資料
4. 將 `user_id` 對應至員工的 `characterImage`

### 2. 正式 AI 文案 API 串接

**搜尋 `TODO: [AI API 串接點]`** 在以下檔案：

- `lib/aiTexts.ts` — 替換 `mockAiRewrite()` 為真實 API 呼叫
- `components/canvas/AiHelperBot.tsx` — 可加入 streaming 效果

**建議方案（選一）：**
```typescript
// Anthropic Claude API
const response = await fetch('/api/ai-rewrite', {
  method: 'POST',
  body: JSON.stringify({ text: originalText, style }),
});

// 在 app/api/ai-rewrite/route.ts 實作
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

### 3. 雲端資料儲存（Supabase）

**搜尋 `TODO: ... Supabase`** 在以下檔案：

- `data/stats.ts` — 替換為 Supabase 即時訂閱

**建議方案：**
```bash
npm install @supabase/supabase-js
```
建立 `lib/supabase.ts`，使用 `supabase.from('stats').select('*')` 取得即時數據。

### 4. 員工 Q 版角色圖替換

在 `data/employees.ts` 中，將每位員工的 `characterImage` 欄位替換為實際圖片路徑：

```typescript
{
  id: 'emp-001',
  name: '王小明',
  // 替換為實際圖片路徑或 CDN URL
  characterImage: '/characters/emp-001.png',
  // ...
}
```

**未來擴充（真人轉Q版）：**
- 串接 AI 圖片生成 API（如 Stable Diffusion 或 DALL-E）
- 員工上傳照片 → AI 生成 Q 版角色

---

## 🛠️ 技術棧

| 技術 | 用途 |
|------|------|
| Next.js 14 App Router | 前端框架 |
| TypeScript | 型別安全 |
| Tailwind CSS | 樣式系統 |
| html2canvas | 卡片截圖下載 |
| React useState/useRef | 畫布狀態管理 |

---

## 📝 注意事項

1. **html2canvas** 截圖時，SVG `data:image/svg+xml` 格式需要設定 `useCORS: true`
2. **Google Fonts** 需要網路連線才能載入，離線環境請改用本地字型
3. **sessionStorage** 用於跨頁傳遞員工資料，重新開啟瀏覽器後需重新選擇
4. 目前 AI 文案為 Mock 實作，有 0.8~1.5 秒的模擬延遲

---

Made with ❤️ for all the amazing moms 🌸
