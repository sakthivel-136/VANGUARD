'use client'

import React from 'react'

export interface DashboardStatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend: {
    value: number
    isPositive: boolean
  }
  className?: string   // ✅ ADD THIS
}

export default function DashboardStatCard({
  title,
  value,
  subtitle,
  trend,
  className = '',   // ✅ DEFAULT VALUE
}: DashboardStatCardProps) {

  return (
    <div className={`bg-white rounded-xl shadow p-5 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500">
        {title}
      </h3>

      <div className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </div>

      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">
          {subtitle}
        </p>
      )}

      <div
        className={`mt-3 text-sm font-medium ${
          trend.isPositive
            ? 'text-green-600'
            : 'text-red-600'
        }`}
      >
        {trend.isPositive ? '▲' : '▼'} {trend.value}%
      </div>
    </div>
  )
}
