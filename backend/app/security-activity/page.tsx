'use client'

import { useState } from 'react'
import ActivityFilters from '@/app/components/security-activity/ActivityFilters'
import { ActivityTable } from '@/app/components/security-activity/ActivityTable'
import { ActivitySummaryCards } from '@/app/components/security-activity/ActivitySummaryCards'
import { ActivityDetails } from '@/app/components/security-activity/ActivityDetails'
import type { Activity, ActivityFilterValues } from '@/app/components/security-activity/types'

const mockActivities: Activity[] = [
  {
    id: 'ACT001',
    type: 'QR Scan',
    timestamp: '2023-11-15T08:30:00Z',
    guardName: 'John Smith',
    guardId: 'G001',
    routeName: 'Morning Patrol',
    building: 'Building A',
    floor: 'Floor 1',
    area: 'Main Entrance',
    source: 'Mobile App',
    status: 'Success',
  },
]

export default function SecurityActivityPage() {
  const [activities] = useState<Activity[]>(mockActivities)
  const [filteredActivities, setFilteredActivities] =
    useState<Activity[]>(mockActivities)
  const [selectedActivity, setSelectedActivity] =
    useState<Activity | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleFilter = (filters: ActivityFilterValues) => {
    let filtered = [...activities]

    if (filters.activityType !== 'all') {
      filtered = filtered.filter(a => a.type === filters.activityType)
    }

    if (filters.guard !== 'all') {
      filtered = filtered.filter(a => a.guardName === filters.guard)
    }

    if (filters.route !== 'all') {
      filtered = filtered.filter(a => a.routeName === filters.route)
    }

    setFilteredActivities(filtered)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Security Activity Log</h1>

      <div className="bg-white p-4 rounded mb-6">
        <ActivityFilters activities={activities} onFilter={handleFilter} />
      </div>

      <ActivitySummaryCards
        totalActivities={filteredActivities.length}
        missedScans={
          filteredActivities.filter(a => a.type === 'Missed Scan').length
        }
        emergencyAlerts={
          filteredActivities.filter(a => a.type === 'Emergency Alert').length
        }
      />

      <div className="bg-white mt-6 rounded">
        <ActivityTable
          activities={filteredActivities}
          onViewDetails={(activity) => {
            setSelectedActivity(activity)
            setIsDetailsOpen(true)
          }}
        />
      </div>

      {selectedActivity && (
        <ActivityDetails
          activity={selectedActivity}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  )
}
