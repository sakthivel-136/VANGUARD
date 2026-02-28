// ================================
// app/security-info/page.tsx
// Basic Security Info page with filters + report list
// ================================

'use client'

import { useState } from 'react'

// ---------------- Filter Component ----------------
interface FilterBarProps {
  status: string
  setStatus: (v: string) => void
}

function FilterBar({ status, setStatus }: FilterBarProps) {
  return (
    <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold">Filters</h2>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="all">All</option>
        <option value="submitted">Submitted</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  )
}

// ---------------- Types ----------------
interface SecurityReport {
  id: string
  guardName: string
  site: string
  date: string
  status: 'submitted' | 'pending'
}

// ---------------- Report List ----------------
interface ReportListProps {
  reports: SecurityReport[]
}

function ReportList({ reports }: ReportListProps) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-3">Guard</th>
            <th className="text-left px-4 py-3">Site</th>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-left px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-4 py-3">{r.guardName}</td>
              <td className="px-4 py-3">{r.site}</td>
              <td className="px-4 py-3">{r.date}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    r.status === 'submitted'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reports.length === 0 && (
        <div className="text-center text-gray-500 py-6">No reports found</div>
      )}
    </div>
  )
}

// ---------------- Page ----------------
export default function SecurityInfoPage() {
  const [status, setStatus] = useState('all')

  // Mock data (later replace with API/Supabase)
  const reports: SecurityReport[] = [
    {
      id: '1',
      guardName: 'Ramesh Kumar',
      site: 'Building A',
      date: '2025-01-22',
      status: 'submitted',
    },
    {
      id: '2',
      guardName: 'Suresh Patel',
      site: 'Warehouse 3',
      date: '2025-01-22',
      status: 'pending',
    },
  ]

  const filteredReports =
    status === 'all'
      ? reports
      : reports.filter((r) => r.status === status)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Security Information</h1>

      {/* Filters */}
      <FilterBar status={status} setStatus={setStatus} />

      {/* Reports */}
      <ReportList reports={filteredReports} />
    </div>
  )
}
