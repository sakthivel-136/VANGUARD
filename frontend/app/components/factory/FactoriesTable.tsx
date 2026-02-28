'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FactoryForm } from './FactoryForm'
import { Building2, Edit3, Trash2, Save, X, MapPin } from 'lucide-react'

interface Factory {
  id: string
  name: string
  location?: string
  address?: string
}

/* ================= AUTH HEADER ================= */

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

/* ============================================== */

export const FactoriesTable = () => {

  const [factories, setFactories] = useState<Factory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editAddress, setEditAddress] = useState('')

  const [isFormOpen, setIsFormOpen] = useState(false)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

  /* ================= LOAD ================= */

  const loadFactories = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE_URL}/factories`, { headers: getAuthHeaders() })
      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized. Please login again.')
        throw new Error('Failed to load factories')
      }
      const data = await res.json()
      const normalized = data.map((f: any) => ({
        id: f.factory_code,
        name: f.factory_name,
        location: f.location || '',
        address: f.factory_address || '',
      }))
      setFactories(normalized)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ================= CREATE ================= */

  const addFactory = async (payload: { name: string; code: string; location?: string; address?: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/factories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          factory_name: payload.name.toUpperCase(),
          factory_code: payload.code.toUpperCase(),
          location: (payload.location || '').toUpperCase(),
          factory_address: (payload.address || '').toUpperCase(),
        }),
      })
      if (!res.ok) throw new Error('Create failed')
      setIsFormOpen(false)
      await loadFactories()
    } catch (err: any) {
      alert(err.message)
    }
  }

  /* ================= UPDATE ================= */

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/factories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          factory_name: editName.toUpperCase(),
          factory_code: id.toUpperCase(),
          location: editLocation.toUpperCase(),
          factory_address: editAddress.toUpperCase(),
        }),
      })
      if (!res.ok) throw new Error('Update failed')
      setEditingId(null)
      await loadFactories()
    } catch (err: any) {
      alert(err.message)
    }
  }

  /* ================= DELETE ================= */

  const deleteFactory = async (id: string) => {
    if (!confirm('Delete this factory?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/factories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      if (!res.ok && res.status !== 204) throw new Error('Delete failed')
      await loadFactories()
    } catch (err: any) {
      alert(err.message)
    }
  }

  /* ================= EDIT ================= */

  const startEdit = (f: Factory) => {
    setEditingId(f.id)
    setEditName(f.name)
    setEditLocation(f.location || '')
    setEditAddress(f.address || '')
  }

  useEffect(() => { loadFactories() }, [])

  const InlineInput = ({ value, onChange, placeholder }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white border border-blue-300 text-gray-800 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
    />
  )

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="bg-indigo-100 p-2.5 rounded-xl">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Factories</h1>
            <p className="text-sm text-gray-500">{factories.length} factor{factories.length !== 1 ? 'ies' : 'y'} registered</p>
          </div>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 flex items-center gap-2 font-semibold text-sm"
        >
          <Building2 className="w-4 h-4" />
          {isFormOpen ? 'Close Form' : 'Add Factory'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Add Form (collapsible) */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">New Factory</h3>
              <FactoryForm onSubmit={addFactory} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">

              {/* Loading */}
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                      <span className="text-gray-400 text-sm">Loading factories...</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty */}
              {!loading && factories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">No factories found</p>
                        <p className="text-gray-400 text-sm mt-1">Click &quot;Add Factory&quot; to create one</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {/* Rows */}
              {!loading && factories.map((f) => (
                <tr key={f.id} className="hover:bg-indigo-50/30 transition-colors">

                  {/* Code */}
                  <td className="px-6 py-4">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                      {f.id}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    {editingId === f.id ? (
                      <InlineInput value={editName} onChange={(e) => setEditName(e.target.value)} />
                    ) : (
                      <span className="font-medium text-gray-900">{f.name}</span>
                    )}
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4">
                    {editingId === f.id ? (
                      <InlineInput value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                    ) : (
                      <span className="text-gray-600 text-sm flex items-center gap-1.5">
                        {f.location ? (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {f.location}
                          </>
                        ) : '—'}
                      </span>
                    )}
                  </td>

                  {/* Address */}
                  <td className="px-6 py-4">
                    {editingId === f.id ? (
                      <InlineInput value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
                    ) : (
                      <span className="text-gray-600 text-sm">{f.address || '—'}</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      {editingId === f.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(f.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(f)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteFactory(f.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
