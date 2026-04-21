'use client';

import { useState } from 'react';
import Link from 'next/link';
import { officialGalleryItems } from '@/data/gallery';
import type { GalleryItem } from '@/types';

/** 放大燈箱 */
function Lightbox({
  item,
  onClose,
}: {
  item: GalleryItem;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 圖片 */}
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-auto"
          />
        </div>

        {/* 資訊 */}
        <div
          className="mt-3 p-4 rounded-2xl text-center"
          style={{ background: 'rgba(255,255,255,0.9)' }}
        >
          <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.description}</p>
          <div className="flex flex-wrap gap-1 justify-center mt-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: `${item.themeColor}20`,
                  color: item.themeColor,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-600 font-bold text-sm flex items-center justify-center shadow-lg hover:text-pink-500 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function OfficialGallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <div
      className="min-h-screen pt-16"
      style={{
        background: 'linear-gradient(160deg, #fff0f5 0%, #fce7f3 25%, #f5f0ff 55%, #fff0fa 80%, #fff5fb 100%)',
      }}
    >
      {/* 頁面標題 */}
      <div className="text-center px-6 pt-12 pb-8">
        {/* 徽章 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 20px', borderRadius: 100, marginBottom: 16,
          background: 'rgba(255,255,255,0.75)',
          border: '1.5px solid rgba(255,182,193,0.5)',
          backdropFilter: 'blur(10px)',
          color: '#D4448A', fontSize: 12, fontWeight: 700,
          letterSpacing: '0.1em',
          boxShadow: '0 4px 16px rgba(255,105,180,0.12)',
          fontFamily: 'Nunito, sans-serif',
        }}>
          🌸 INSPIRATION GALLERY
        </div>

        {/* Pacifico 主標題 */}
        <h1 style={{
          fontFamily: 'Pacifico, cursive',
          fontSize: 'clamp(28px, 4.5vw, 52px)',
          lineHeight: 1.25,
          marginBottom: 8,
          background: 'linear-gradient(135deg, #D4006B 0%, #FF3D8A 35%, #FF69B4 60%, #C084FC 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: 'drop-shadow(0 3px 10px rgba(212,0,107,0.25))',
        }}>
          Inspiration Gallery
        </h1>

        {/* 中文副標 */}
        <p style={{
          fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
          fontSize: 'clamp(14px, 1.8vw, 18px)',
          color: '#C2185B', fontWeight: 800, letterSpacing: '0.15em', marginBottom: 6,
        }}>
          靈感展示牆
        </p>
        <p style={{
          fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
          fontSize: 13, color: 'rgba(160,60,100,0.72)', fontWeight: 600, marginBottom: 4,
        }}>
          精選官方設計範例，讓你看見更多可能的創作方向 ✨
        </p>
        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 12, color: 'rgba(180,80,120,0.6)',
        }}>
          點擊卡片可放大欣賞
        </p>
      </div>

      {/* 展示牆 Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
          {officialGalleryItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative text-left transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* 卡片容器 */}
              <div
                className="relative overflow-hidden rounded-3xl"
                style={{
                  boxShadow: '0 8px 30px rgba(200,100,150,0.15)',
                  border: '1.5px solid rgba(255,255,255,0.6)',
                }}
              >
                {/* 圖片 */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto block"
                />

                {/* hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',
                  }}
                >
                  <p className="text-white font-bold text-sm drop-shadow">{item.title}</p>
                  <p className="text-white/80 text-xs drop-shadow text-center line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                {/* 放大圖示 */}
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'rgba(255,255,255,0.9)' }}
                >
                  <span className="text-gray-600 text-sm">🔍</span>
                </div>
              </div>

              {/* 標題與標籤 */}
              <div className="mt-2 px-1">
                <p className="text-sm font-semibold text-gray-700 truncate">{item.title}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: `${item.themeColor}15`,
                        color: item.themeColor,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 說明區塊 */}
        <div
          className="mt-12 p-6 rounded-3xl text-center"
          style={{
            background: 'rgba(255,255,255,0.6)',
            border: '1px dashed rgba(255,182,193,0.5)',
          }}
        >
          <p className="text-3xl mb-3">🎨</p>
          <h3 style={{ fontFamily: 'Pacifico, cursive', fontSize: 20, color: '#FF69B4', marginBottom: 8 }}>
            Love these styles?
          </h3>
          <p style={{ fontFamily: 'Nunito, "Noto Sans TC", sans-serif', fontWeight: 700, color: '#C2185B', marginBottom: 4, letterSpacing: '0.05em' }}>
            喜歡這些風格嗎？
          </p>
          <p style={{ fontFamily: 'Nunito, "Noto Sans TC", sans-serif', fontSize: 13, color: 'rgba(160,60,100,0.72)', maxWidth: 400, margin: '0 auto 16px' }}>
            選擇你的專屬角色，開始創作一張屬於你與媽媽之間最溫暖的母親節卡片
          </p>
          <Link
            href="/select"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #FF69B4, #C084FC)',
              boxShadow: '0 4px 15px rgba(255,105,180,0.35)',
            }}
          >
            <span>✏️</span>
            立即開始創作
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* 燈箱 */}
      {selectedItem && (
        <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
