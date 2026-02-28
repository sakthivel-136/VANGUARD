'use client'

import { useState } from 'react'
import Head from 'next/head'
import type { Activity, ActivityFilterValues } from './types'

interface ActivityFiltersProps {
  onFilter: (filters: ActivityFilterValues) => void
  activities: Activity[]
}

export default function ActivityFilters({
  onFilter,
  activities,
}: ActivityFiltersProps) {
  const [filters, setFilters] = useState<ActivityFilterValues>({
    dateRange: '',
    activityType: 'all',
    guard: 'all',
    route: 'all',
  })

  const activityTypes = [...new Set(activities.map(a => a.type))]
  const guards = [...new Set(activities.map(a => a.guardName))]
  const routes = [
    ...new Set(activities.map(a => a.routeName).filter(Boolean)),
  ]

  const handleFilterChange = (
    field: keyof ActivityFilterValues,
    value: string
  ) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const handleExport = () => {
    const date = new Date()
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    const originalTitle = document.title

    document.title = `Activity_Report_${formattedDate}`
    window.print()

    setTimeout(() => {
      document.title = originalTitle
    }, 1000)
  }

  return (
    <>
      {/* ✅ FAVICON (ONLY CHANGE MADE) */}
      <Head>
        <link rel="icon" href="/favicon.jpeg" />
      </Head>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          .hide-on-print {
            display: none !important;
          }
        }
      `}</style>

      {/* FILTERS (HIDDEN IN PRINT) */}
      <div className="flex flex-wrap gap-4 items-end hide-on-print">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <input
            type="date"
            className="w-full rounded-md border px-3 py-2"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          />
        </div>

        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-1">
            Activity Type
          </label>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={filters.activityType}
            onChange={(e) =>
              handleFilterChange('activityType', e.target.value)
            }
          >
            <option value="all">All Types</option>
            {activityTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-1">Guard</label>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={filters.guard}
            onChange={(e) => handleFilterChange('guard', e.target.value)}
          >
            <option value="all">All Guards</option>
            {guards.map(guard => (
              <option key={guard} value={guard}>
                {guard}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-1">
            Route / Round
          </label>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={filters.route}
            onChange={(e) => handleFilterChange('route', e.target.value)}
          >
            <option value="all">All Routes</option>
            {routes.map(route => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
        </div>

        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          onClick={handleExport}
        >
          Export
        </button>
      </div>
    </>
  )
}
