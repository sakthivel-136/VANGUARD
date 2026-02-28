'use client'

import { useEffect, useState } from 'react'
import { FactoryForm } from './FactoryForm'

interface Factory {
  id: string
  name: string
  location?: string
  address?: string
}

/* ================= AUTH HEADER ================= */

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

/* ============================================== */

export const FactoriesTable = () => {

  /* ================= STATE ================= */

  const [factories, setFactories] = useState<Factory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editAddress, setEditAddress] = useState('')

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || '/api'

  /* ================= LOAD ================= */

  const loadFactories = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE_URL}/factories`, {
        headers: getAuthHeaders(),
      })

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized. Please login again.')
        }
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

  const addFactory = async (payload: {
    name: string
    code: string
    location?: string
    address?: string
  }) => {

    try {
      const res = await fetch(`${API_BASE_URL}/factories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          factory_name: payload.name,
          factory_code: payload.code,
          location: payload.location || '',
          factory_address: payload.address || '',
        }),
      })

      if (!res.ok) throw new Error('Create failed')

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
          factory_name: editName,
          factory_code: id,
          location: editLocation,
          factory_address: editAddress,
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

      if (!res.ok && res.status !== 204) {
        throw new Error('Delete failed')
      }

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

  /* ================= INIT ================= */

  useEffect(() => {
    loadFactories()
  }, [])


  /* ================= UI ================= */

  const InlineInput = ({
    value,
    onChange,
    placeholder
  }: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
  }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full rounded-md border px-3 py-1.5"
      autoFocus
    />
  )


  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">

      <h2 className="text-2xl font-bold mb-6">
        Factories Management
      </h2>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add */}
      <FactoryForm onSubmit={addFactory} />


      {/* Loading */}
      {loading && (
        <p className="mt-6 text-gray-500">
          Loading...
        </p>
      )}


      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto mt-6">

          <table className="min-w-full border">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>

              {factories.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    No factories
                  </td>
                </tr>
              )}

              {factories.map((f) => (

                <tr key={f.id}>

                  {/* Code */}
                  <td className="p-2 border">
                    {f.id}
                  </td>

                  {/* Name */}
                  <td className="p-2 border">

                    {editingId === f.id ? (
                      <InlineInput
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      f.name
                    )}

                  </td>

                  {/* Location */}
                  <td className="p-2 border">

                    {editingId === f.id ? (
                      <InlineInput
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                      />
                    ) : (
                      f.location || '—'
                    )}

                  </td>

                  {/* Address */}
                  <td className="p-2 border">

                    {editingId === f.id ? (
                      <InlineInput
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                      />
                    ) : (
                      f.address || '—'
                    )}

                  </td>


                  {/* Actions */}
                  <td className="p-2 border text-center">

                    {editingId === f.id ? (

                      <>
                        <button
                          onClick={() => saveEdit(f.id)}
                          className="text-green-600 mr-3"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600"
                        >
                          Cancel
                        </button>
                      </>

                    ) : (

                      <>
                        <button
                          onClick={() => startEdit(f)}
                          className="text-blue-600 mr-3"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteFactory(f.id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </>

                    )}

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
