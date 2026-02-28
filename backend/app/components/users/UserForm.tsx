'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import {
  createSecurityUser,
  updateSecurityUser,
} from '../../api/securityUsers'

import { SecurityUser } from '@/app/types/securityUser'

interface UserFormProps {
  user: SecurityUser | null
  onClose: () => void
  onSave: () => void
  factories: string[]
}

export default function UserForm({
  user,
  onClose,
  onSave,
  factories,
}: UserFormProps) {
  const [formData, setFormData] = useState<SecurityUser>({
    security_id: '',
    security_name: '',
    security_password: '',
    factory: factories?.[0] || '',
  })

  /* ================= LOAD USER FOR EDIT ================= */
  useEffect(() => {
    if (user) {
      setFormData({
        security_id: user.security_id,
        security_name: user.security_name,
        security_password: '',
        factory: user.factory,
      })
    } else {
      // Reset when adding new user
      setFormData({
        security_id: '',
        security_name: '',
        security_password: '',
        factory: factories?.[0] || '',
      })
    }
  }, [user, factories])

  /* ================= HANDLE INPUT ================= */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.security_id.trim()) {
      alert('Security ID required')
      return
    }

    if (!formData.security_name.trim()) {
      alert('Security name required')
      return
    }

    if (!user && !formData.security_password.trim()) {
      alert('Password required')
      return
    }

    try {
      if (user) {
        // UPDATE
        await updateSecurityUser(user.security_id, {
          security_name: formData.security_name,
          factory: formData.factory,

          ...(formData.security_password
            ? { security_password: formData.security_password }
            : {}),
        })
      } else {
        // CREATE
        await createSecurityUser({
          security_id: formData.security_id,
          security_name: formData.security_name,
          security_password: formData.security_password,
          factory: formData.factory,
        })
      }

      onSave()
      onClose()
    } catch (err: any) {
      console.error('Save error:', err)

      alert(
        err?.message ||
          'Error saving security user. Check console.'
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mt-24">

        <h2 className="text-xl font-bold mb-4">
          {user ? 'Edit Security User' : 'Add Security User'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Security ID */}
          <input
            name="security_id"
            value={formData.security_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Security ID"
            required
            disabled={!!user}
          />

          {/* Name */}
          <input
            name="security_name"
            value={formData.security_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Security Name"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="security_password"
            value={formData.security_password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder={
              user
                ? 'New Password (optional)'
                : 'Password'
            }
            required={!user}
          />

          {/* Factory */}
          <select
            name="factory"
            value={formData.factory}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            {factories.map(f => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
