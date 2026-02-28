'use client'

import { ActivityBadge } from './ActivityBadge'
import type { Activity } from './types'

interface ActivityTableProps {
  activities: Activity[]
  onViewDetails: (activity: Activity) => void
}

export function ActivityTable({
  activities,
  onViewDetails,
}: ActivityTableProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getShortDescription = (activity: Activity) => {
    switch (activity.type) {
      case 'QR Scan':
        return activity.scanPointName
          ? `Scan at ${activity.scanPointName}`
          : 'QR Scan'
      case 'Missed Scan':
        return activity.scanPointName
          ? `Missed scan at ${activity.scanPointName}`
          : 'Missed scan'
      case 'Issue Reported':
        return activity.issueType || 'Issue reported'
      case 'Patrol Started':
        return activity.patrolName
          ? `Started: ${activity.patrolName}`
          : 'Patrol started'
      case 'Patrol Completed':
        return activity.patrolName
          ? `Completed: ${activity.patrolName}`
          : 'Patrol completed'
      case 'Manual Check-In':
        return 'Manual check-in'
      case 'Emergency Alert':
        return activity.alertType
          ? `Alert: ${activity.alertType}`
          : 'Emergency alert'
      default:
        return 'Activity logged'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Activity Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Guard
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {activities.map(activity => (
            <tr key={activity.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium">
                  {formatTime(activity.timestamp)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(activity.timestamp)}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <ActivityBadge type={activity.type} />
              </td>

              <td className="px-6 py-4 text-sm">
                {activity.guardName}
              </td>

              <td className="px-6 py-4 text-sm">
                {activity.location ?? '-'}
              </td>

              <td className="px-6 py-4 text-sm">
                {getShortDescription(activity)}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                    activity.status === 'Success'
                      ? 'bg-green-100 text-green-800'
                      : activity.status === 'Warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {activity.status}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => onViewDetails(activity)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No activities found matching the current filters.
        </div>
      )}
    </div>
  )
}
