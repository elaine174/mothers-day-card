'use client';

import type { Employee } from '@/types';

interface EmployeeCardProps {
  employee: Employee;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function EmployeeCard({
  employee,
  isSelected = false,
  onClick,
}: EmployeeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full flex flex-col items-center p-4 rounded-3xl
        transition-all duration-300 cursor-pointer text-center
        ${isSelected
          ? 'scale-105 shadow-glow'
          : 'hover:scale-105 hover:shadow-card'
        }
      `}
      style={{
        background: isSelected
          ? `linear-gradient(135deg, ${employee.themeColor}33, ${employee.themeColor}15)`
          : 'white',
        border: isSelected
          ? `2px solid ${employee.themeColor}`
          : '2px solid rgba(255,182,193,0.25)',
        boxShadow: isSelected
          ? `0 8px 30px ${employee.themeColor}40`
          : '0 4px 15px rgba(255,105,180,0.08)',
      }}
    >
      {/* 選取勾選標記 */}
      {isSelected && (
        <div
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold z-10 animate-pop-in"
          style={{ background: employee.themeColor }}
        >
          ✓
        </div>
      )}

      {/* 角色圖片容器 */}
      <div
        className="relative w-24 h-28 mb-3 rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${employee.themeColor}20, ${employee.themeColor}10)`,
        }}
      >
        {/* 角色圖 */}
        <img
          src={employee.characterImage}
          alt={`${employee.name}的Q版角色`}
          className="w-full h-full object-contain"
        />

        {/* hover 發光效果 */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${employee.themeColor}, transparent 70%)`,
          }}
        />
      </div>

      {/* 姓名 */}
      <h3
        className="text-base font-bold mb-0.5 group-hover:text-pink-600 transition-colors"
        style={{
          color: isSelected ? employee.themeColor : '#4A4A4A',
          fontFamily: 'Nunito, "Noto Sans TC", sans-serif',
        }}
      >
        {employee.name}
      </h3>

      {/* 部門 */}
      <p className="text-xs text-gray-400 truncate w-full" style={{ fontFamily: 'Nunito, "Noto Sans TC", sans-serif' }}>{employee.department}</p>

      {/* 選擇按鈕提示 */}
      {!isSelected && (
        <div
          className="mt-2 text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0"
          style={{
            background: `${employee.themeColor}20`,
            color: employee.themeColor,
          }}
        >
          選擇我 ✨
        </div>
      )}

      {isSelected && (
        <div
          className="mt-2 text-xs px-3 py-1 rounded-full font-semibold"
          style={{
            background: `${employee.themeColor}20`,
            color: employee.themeColor,
          }}
        >
          ✓ 已選擇
        </div>
      )}
    </button>
  );
}
