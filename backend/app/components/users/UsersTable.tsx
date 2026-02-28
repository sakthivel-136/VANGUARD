'use client'

import { useState } from 'react'
import { deleteSecurityUser } from '../../api/securityUsers'
import { SecurityUser } from '@/app/types/securityUser'

interface UsersTableProps {
  users: SecurityUser[]
  onEditUser: (user: SecurityUser) => void
  onRefresh: () => void
}

export default function UsersTable({
  users,
  onEditUser,
  onRefresh,
}: UsersTableProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({})

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await deleteSecurityUser(id)
      onRefresh()
    } catch (err) {
      console.error(err)
      alert('Failed to delete user')
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Security ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Security Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Password
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Factory
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr
              key={user.security_id}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.security_id}
              </td>

              <td className="px-6 py-4 text-sm text-gray-900">
                {user.security_name}
              </td>

              <td className="px-6 py-4 text-sm text-gray-900 flex items-center gap-2">
                {visiblePasswords[user.security_id]
                  ? user.security_password
                  : '******'}

                <span
                  className="cursor-pointer select-none"
                  onClick={() =>
                    togglePassword(user.security_id)
                  }
                >
                  {visiblePasswords[user.security_id]
                    ? '🙈'
                    : '👁️'}
                </span>
              </td>

              <td className="px-6 py-4 text-sm text-gray-900">
                {user.factory}
              </td>

              <td className="px-6 py-4 text-right text-sm font-medium flex gap-3 justify-end">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => onEditUser(user)}
                >
                  Edit
                </button>

                <button
                  className="text-red-600 hover:underline"
                  onClick={() =>
                    handleDelete(user.security_id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No security users found
          </p>
        </div>
      )}
    </div>
  )
}
