'use client'

interface ActivityBadgeProps {
  type: string
}

export function ActivityBadge({ type }: ActivityBadgeProps) {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'QR Scan':
      case 'Manual Check-In':
        return 'bg-green-100 text-green-800'
      case 'Missed Scan':
        return 'bg-yellow-100 text-yellow-800'
      case 'Issue Reported':
        return 'bg-orange-100 text-orange-800'
      case 'Patrol Started':
      case 'Patrol Completed':
        return 'bg-blue-100 text-blue-800'
      case 'Emergency Alert':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(type)}`}>
      {type}
    </span>
  )
}