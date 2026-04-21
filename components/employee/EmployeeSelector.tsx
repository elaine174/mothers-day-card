'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { employeeProfiles } from '@/data/employees';
import type { Employee } from '@/types';
import EmployeeCard from './EmployeeCard';

// ============================================================
// TODO: [Lark SSO 串接點]
//   目前使用手動搜尋/點選方式模擬員工身份識別。
//   未來實作步驟：
//   1. 在 app/api/auth/lark/route.ts 實作 Lark OAuth callback
//   2. 取得 access_token 後，呼叫 Lark API 取得使用者資料：
//      GET https://open.larksuite.com/open-apis/contact/v3/users/me
//   3. 將 API 回傳的 user_id 對應至 employee profiles
//   4. 自動帶入 name, department, characterImage 等欄位
//   5. 此頁面改為顯示「你好，{name}！已找到你的專屬角色」
// ============================================================

export default function EmployeeSelector() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // 過濾員工資料（依搜尋關鍵字）
  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return employeeProfiles;
    return employeeProfiles.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // 確認選擇並前往畫布
  const handleConfirm = () => {
    if (!selectedEmployee) return;
    setIsConfirming(true);

    // 儲存選取的員工到 sessionStorage（給 canvas 頁面使用）
    // TODO: 未來串接 Lark SSO 後，這裡改由 session token 帶入
    sessionStorage.setItem('selectedEmployee', JSON.stringify(selectedEmployee));

    setTimeout(() => {
      router.push(`/canvas?employee=${selectedEmployee.id}`);
    }, 500);
  };

  return (
    <div
      className="min-h-screen pt-20 pb-12 px-4"
      style={{
        background: 'linear-gradient(160deg, #fff0f5 0%, #fce7f3 25%, #f5f0ff 55%, #fff0fa 80%, #fff5fb 100%)',
        position: 'relative',
      }}
    >
      {/* 背景裝飾花瓣 */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {['8%','25%','42%','60%','75%','90%'].map((left, i) => (
          <div key={i} className="petal" style={{
            left,
            fontSize: 14 + (i % 3) * 3,
            animationDuration: `${8 + i * 1.2}s`,
            animationDelay: `${i * 1.5}s`,
          }}>{['🌸','🌸','🌷','🌺','🌸','💗'][i]}</div>
        ))}
      </div>
      <div className="max-w-5xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
        {/* 頁面標題 */}
        <div className="text-center mb-10 pt-4">
          {/* 步驟徽章 */}
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
            ✨ STEP 1 — 找到你的專屬角色
          </div>

          {/* Pacifico 主標 */}
          <h1 style={{
            fontFamily: 'Pacifico, cursive',
            fontSize: 'clamp(28px, 4.5vw, 52px)',
            lineHeight: 1.25,
            marginBottom: 8,
            background: 'linear-gradient(135deg, #D4006B 0%, #FF3D8A 35%, #FF69B4 60%, #C084FC 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 3px 10px rgba(212,0,107,0.25))',
          }}>
            Choose Your Character
          </h1>

          {/* 中文副標 */}
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 'clamp(14px, 1.8vw, 18px)',
            color: '#C2185B', fontWeight: 800, letterSpacing: '0.15em', marginBottom: 6,
          }}>
            選擇你的專屬 Q 版角色
          </p>
          <p style={{
            fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
            fontSize: 13, color: 'rgba(160,60,100,0.72)', fontWeight: 600,
          }}>
            找到你的名字，開始創作屬於你與媽媽的溫暖卡片 🌸
          </p>
        </div>

        {/* 搜尋框 */}
        <div className="max-w-md mx-auto mb-8">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: 'white',
              border: '2px solid rgba(255,182,193,0.4)',
              boxShadow: '0 4px 20px rgba(255,105,180,0.1)',
            }}
          >
            <span className="text-xl text-pink-400">🔍</span>
            <input
              type="text"
              placeholder="輸入你的姓名或部門搜尋..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-pink-300 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-pink-300 hover:text-pink-500 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 員工卡片格狀展示 */}
        {filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
            {filteredEmployees.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                isSelected={selectedEmployee?.id === emp.id}
                onClick={() =>
                  setSelectedEmployee(
                    selectedEmployee?.id === emp.id ? null : emp
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">😢</p>
            <p className="text-pink-400 text-lg">找不到「{searchQuery}」的員工資料</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-sm text-pink-500 underline"
            >
              清除搜尋
            </button>
          </div>
        )}

        {/* 已選擇員工 → 確認按鈕 */}
        {selectedEmployee && (
          <div
            className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-50"
          >
            <div
              className="flex items-center gap-4 px-6 py-4 rounded-3xl shadow-xl"
              style={{
                background: 'white',
                border: '2px solid rgba(255,182,193,0.4)',
                boxShadow: '0 8px 40px rgba(255,105,180,0.25)',
                maxWidth: 480,
                width: '100%',
              }}
            >
              {/* 選取的角色預覽 */}
              <img
                src={selectedEmployee.characterImage}
                alt={selectedEmployee.name}
                className="w-14 h-14 object-contain rounded-2xl"
                style={{
                  background: `${selectedEmployee.themeColor}20`,
                }}
              />

              {/* 資訊 */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-base truncate">
                  {selectedEmployee.name}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {selectedEmployee.department}
                </p>
              </div>

              {/* 確認按鈕 */}
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="
                  flex items-center gap-2 px-5 py-3 rounded-2xl
                  text-white font-bold text-sm
                  transition-all duration-200 hover:scale-105 disabled:opacity-70
                "
                style={{
                  background: isConfirming
                    ? '#d1d5db'
                    : `linear-gradient(135deg, ${selectedEmployee.themeColor}, #C084FC)`,
                  boxShadow: `0 4px 15px ${selectedEmployee.themeColor}50`,
                }}
              >
                {isConfirming ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    進入中...
                  </>
                ) : (
                  <>
                    開始創作 ✨
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 說明文字 */}
        <div
          className="max-w-lg mx-auto text-center p-5 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.6)',
            border: '1px dashed rgba(255,182,193,0.5)',
          }}
        >
          <p className="text-sm text-pink-400">
            💡 找不到你的名字？請聯絡 HR 部門確認你的角色是否已上傳
          </p>
          <p className="text-xs text-pink-300 mt-1">
            {/* TODO: 未來換成 Lark 帳號登入後自動帶入 */}
            第一版使用搜尋方式，未來將支援 Lark SSO 自動識別 🔗
          </p>
        </div>
      </div>
    </div>
  );
}
