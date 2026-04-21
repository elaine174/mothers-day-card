import type { Metadata, Viewport } from 'next';
import './globals.css';

const BASE_URL = 'https://kf-mothers-day-card.netlify.app';

export const metadata: Metadata = {
  title: '母親節祝福卡片 🌸',
  description: '做一張專屬賀卡，直接從手機傳 LINE 給媽媽！',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: '母親節祝福卡片 🌸',
    description: '做一張專屬賀卡，直接從手機傳 LINE 給媽媽！',
    url: BASE_URL,
    siteName: '母親節祝福卡片',
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: '母親節祝福卡片',
      },
    ],
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '母親節祝福卡片 🌸',
    description: '做一張專屬賀卡，直接從手機傳 LINE 給媽媽！',
    images: [`${BASE_URL}/og-image.jpg`],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,   // 避免手機雙擊縮放干擾操作
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
