'use client'

import { useState, useEffect } from 'react'

/* ✅ THIS TYPE MATCHES FactoriesTable EXACTLY */
export interface FactoryFormData {
  name: string
  code: string
  location?: string
  address?: string
}

interface Props {
  onSubmit: (data: FactoryFormData) => void
  initialData?: FactoryFormData
  onCancel?: () => void
}

export const FactoryForm = ({
  onSubmit,
  initialData,
  onCancel,
}: Props) => {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [location, setLocation] = useState('')
  const [address, setAddress] = useState('')

  // Pre-fill form for edit
  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setCode(initialData.code)
      setLocation(initialData.location || '')
      setAddress(initialData.address || '')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !code) {
      alert('Please fill Name and Code')
      return
    }

    onSubmit({ name, code, location, address })

    if (!initialData) {
      setName('')
      setCode('')
      setLocation('')
      setAddress('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">

        {/* Factory Name */}
        <div className="md:col-span-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            Factory Name
          </label>
          <input
            type="text"
            placeholder="e.g. North Warehouse"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Code */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            Code
          </label>
          <input
            type="text"
            placeholder="e.g. F-01"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={!!initialData}
            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
          />
        </div>

        {/* Location */}
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. Sivakasi"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            Address
          </label>
          <input
            type="text"
            placeholder="e.g. 1/407, Industrial Estate"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          {initialData ? 'Update Factory' : 'Add Factory'}
        </button>

        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-white border border-slate-300 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}