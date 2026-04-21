'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { employeeProfiles } from '@/data/employees';
import type { Employee } from '@/types';
import CreativeCanvas from '@/components/canvas/CreativeCanvas';

// ============================================================
// TODO: [Lark SSO 串接點]
//   未來串接 Lark SSO 後，此頁面應：
//   1. 從 Lark OAuth session 取得已登入員工的 user_id
//   2. 用 user_id 查詢員工 profile（含 characterImage）
//   3. 不再需要從 URL params 或 sessionStorage 取得員工資料
//   流程：Lark 登入 → 取得 access_token → 呼叫 Lark API 取員工資料
//         → 自動帶入 CreativeCanvas 的 employee prop
// ============================================================

/** 需要 Suspense 包裝，因為 useSearchParams 在 SSR 時需要邊界 */
function CanvasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const employeeId = searchParams.get('employee');

    // 方法一：從 URL params 取得員工 ID，再從 mock data 查找
    if (employeeId) {
      const found = employeeProfiles.find((e) => e.id === employeeId);
      if (found) {
        setEmployee(found);
        setIsLoading(false);
        return;
      }
    }

    // 方法二：從 sessionStorage 取得（由 EmployeeSelector 存入）
    // TODO: 未來由 Lark SSO session 取代此機制
    try {
      const stored = sessionStorage.getItem('selectedEmployee');
      if (stored) {
        const parsed = JSON.parse(stored);
        const found = employeeProfiles.find((e) => e.id === parsed.id);
        if (found) {
          setEmployee(found);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // ignore parse error
    }

    // 找不到員工，導回選擇頁
    router.replace('/select');
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{
          background: 'linear-gradient(135deg, #fff0f5, #fce7f3, #f5f3ff)',
        }}
      >
        <div className="text-6xl animate-bounce-soft">🌸</div>
        <p className="text-pink-400 text-lg font-medium">載入中...</p>
        <p className="text-pink-300 text-sm">正在準備你的專屬角色</p>
      </div>
    );
  }

  if (!employee) return null;

  return <CreativeCanvas employee={employee} />;
}

export default function CanvasPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex flex-col items-center justify-center gap-4"
          style={{
            background: 'linear-gradient(135deg, #fff0f5, #fce7f3, #f5f3ff)',
          }}
        >
          <div className="text-6xl" style={{ animation: 'float 2s ease-in-out infinite' }}>
            🌸
          </div>
          <p className="text-pink-400 text-lg font-medium">載入中...</p>
        </div>
      }
    >
      <CanvasContent />
    </Suspense>
  );
}
