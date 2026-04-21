/** @type {import('next').NextConfig} */
const nextConfig = {
  // 圖片域名設定，未來串接 Lark CDN 或其他圖床時在此新增
  images: {
    domains: [],
  },
  // 未來串接 Supabase 等雲端服務的環境變數前綴可在此設定
};

module.exports = nextConfig;
