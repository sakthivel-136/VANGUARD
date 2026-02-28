'use client'

import { useEffect, useState } from 'react'
import UserForm from '../components/users/UserForm'
import UsersTable from '../components/users/UsersTable'
import {
  getSecurityUsers,
} from '../api/securityUsers'

import { SecurityUser } from '@/app/types/securityUser'

export default function SecurityUsersPage() {
  const [users, setUsers] = useState<SecurityUser[]>([])
  const [editingUser, setEditingUser] = useState<SecurityUser | null>(null)
  const [showForm, setShowForm] = useState(false)

  // TODO: later fetch from backend
  const factories = ['F001', 'F002', 'F003']

  const fetchUsers = async () => {
    try {
      const data = await getSecurityUsers()
      setUsers(data || [])
    } catch (err) {
      console.error(err)
      alert('Failed to fetch users')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEditUser = (user: SecurityUser) => {
    setEditingUser(user)
    setShowForm(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Security Users Management
        </h1>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditingUser(null)
            setShowForm(true)
          }}
        >
          Add Security User
        </button>
      </div>

      <UsersTable
        users={users}
        onEditUser={handleEditUser}
        onRefresh={fetchUsers}
      />

      {showForm && (
        <UserForm
          user={editingUser}
          factories={factories}
          onClose={() => setShowForm(false)}
          onSave={() => {
            fetchUsers()
            setShowForm(false)
          }}
        />
      )}
    </div>
  )
}
