'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit3, Eye, EyeOff, X, UserPlus, Users } from 'lucide-react'
import {
  getSecurityUsers,
  createSecurityUser,
  updateSecurityUser,
  deleteSecurityUser,
} from '@/app/api/securityUsers.api'
import { SecurityUser } from '@/app/types/securityUser'

/* ================= MAIN PAGE ================= */

export default function UserCrudPage() {
  const [users, setUsers] = useState<SecurityUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editUser, setEditUser] = useState<SecurityUser | null>(null)

  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})

  /* ---------- Load Users ---------- */

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSecurityUsers()
      setUsers(data || [])
    } catch (err: any) {
      console.error('Failed to load users:', err)
      setError('Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  /* ---------- Delete ---------- */

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await deleteSecurityUser(id)
      setUsers(prev => prev.filter(u => u.security_id !== id))
    } catch {
      alert('Delete failed')
    }
  }

  /* ---------- Edit ---------- */

  const handleEdit = (user: SecurityUser) => {
    setEditUser(user)
    setIsFormOpen(true)
  }

  /* ---------- Add ---------- */

  const handleAdd = () => {
    setEditUser(null)
    setIsFormOpen(true)
  }

  /* ---------- Save (Create/Update) ---------- */

  const handleSave = async (data: Partial<SecurityUser>) => {
    try {
      if (editUser) {
        await updateSecurityUser(editUser.security_id, data)
      } else {
        await createSecurityUser(data)
      }
      setIsFormOpen(false)
      setEditUser(null)
      await loadUsers()
    } catch (err: any) {
      alert(err.message || 'Save failed')
    }
  }

  /* ---------- Toggle Password ---------- */

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  /* ================= RENDER ================= */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="bg-blue-100 p-2.5 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
              <p className="text-sm text-gray-500">{users.length} security user{users.length !== 1 ? 's' : ''} registered</p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 flex items-center gap-2 font-semibold text-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Security ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Password</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Factory</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">

                {/* Loading */}
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                        <span className="text-gray-400 text-sm">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Empty */}
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-gray-100 p-4 rounded-full">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">No users found</p>
                          <p className="text-gray-400 text-sm mt-1">Click "Add User" to create one</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Rows */}
                {!loading && users.map((user) => (
                  <tr
                    key={user.security_id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                          {user.security_id}
                        </span>
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{user.security_name}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-mono">
                          {visiblePasswords[user.security_id]
                            ? (user.security_password ?? '')
                            : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePassword(user.security_id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                        >
                          {visiblePasswords[user.security_id]
                            ? <EyeOff className="w-4 h-4" />
                            : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {user.factory || '—'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.security_id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form */}
        <AnimatePresence>
          {isFormOpen && (
            <UserFormModal
              user={editUser}
              onSave={handleSave}
              onClose={() => { setIsFormOpen(false); setEditUser(null) }}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}


/* ================= MODAL FORM ================= */

function UserFormModal({
  user,
  onSave,
  onClose,
}: {
  user: SecurityUser | null
  onSave: (data: Partial<SecurityUser>) => void
  onClose: () => void
}) {
  const isEdit = !!user

  const [securityId, setSecurityId] = useState(user?.security_id || '')
  const [name, setName] = useState(user?.security_name || '')
  const [password, setPassword] = useState(user?.security_password || '')
  const [factory, setFactory] = useState(user?.factory || '')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!securityId || !name) {
      alert('Please fill Security ID and Name')
      return
    }

    setSaving(true)
    await onSave({
      security_id: securityId,
      security_name: name,
      security_password: password,
      factory,
    })
    setSaving(false)
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">
                {isEdit ? 'Edit User' : 'Add New User'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Security ID */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Security ID
              </label>
              <input
                type="text"
                value={securityId}
                onChange={(e) => setSecurityId(e.target.value)}
                disabled={isEdit}
                placeholder="e.g. SEC001"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Factory */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Factory Code
              </label>
              <input
                type="text"
                value={factory}
                onChange={(e) => setFactory(e.target.value)}
                placeholder="e.g. F001"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </motion.div>
    </>
  )
}
