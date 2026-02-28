'use client'

import { useEffect, useState } from 'react'
import {
  getSecurityUsers,
  deleteSecurityUser,
} from '../../api/securityUsers.api'

import { SecurityUser } from '@/app/types/securityUser'

/* ================= COMPONENT ================= */

export default function UsersTable() {

  /* ---------- State ---------- */

  const [users, setUsers] = useState<SecurityUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [visiblePasswords, setVisiblePasswords] =
    useState<Record<string, boolean>>({})

  /* ---------- Load Users ---------- */

  const loadUsers = async () => {

    setLoading(true)
    setError('')

    try {
      const list = await getSecurityUsers()

      // ✅ Normalize optional password safely
      const normalized = Array.isArray(list)
        ? list.map(user => ({
            ...user,
            security_password: user.security_password ?? '',
          }))
        : []

      setUsers(normalized)

    } catch (err) {
      console.error(err)
      setError('Failed to load users')

    } finally {
      setLoading(false)
    }
  }

  /* ---------- Delete User ---------- */

  const handleDelete = async (id: string) => {

    if (!confirm('Delete this user?')) return

    try {
      await deleteSecurityUser(id)
      await loadUsers()

    } catch (err) {
      alert('Delete failed')
    }
  }

  /* ---------- Toggle Password ---------- */

  const togglePassword = (id: string) => {

    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  /* ---------- Init ---------- */

  useEffect(() => {
    loadUsers()
  }, [])

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">
        Security Users
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-gray-500">
          Loading users...
        </p>
      )}

      {!loading && (
        <div className="overflow-x-auto bg-white rounded shadow">

          <table className="min-w-full border-collapse">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">ID</th>
                <th className="p-3 border text-left">Name</th>
                <th className="p-3 border text-left">Password</th>
                <th className="p-3 border text-left">Factory</th>
                <th className="p-3 border text-right">Actions</th>
              </tr>
            </thead>

            <tbody>

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}

              {users.map((user) => (

                <tr
                  key={user.security_id}
                  className="hover:bg-gray-50"
                >

                  <td className="p-3 border text-sm">
                    {user.security_id}
                  </td>

                  <td className="p-3 border text-sm">
                    {user.security_name}
                  </td>

                  <td className="p-3 border text-sm flex items-center gap-2">

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

                  <td className="p-3 border text-sm">
                    {user.factory}
                  </td>

                  <td className="p-3 border text-right text-sm space-x-3">

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

        </div>
      )}

    </div>
  )
}
