'use client'

import { useState, useEffect } from 'react'


/* ✅ UPDATED TYPE */
export interface FactoryFormData {
  name: string
  code: string
  location?: string
  address?: string   // ✅ ADD
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
  const [address, setAddress] = useState('')   // ✅ ADD


  // Prefill
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

    onSubmit({
      name,
      code,
      location,
      address,    // ✅ SEND ADDRESS
    })


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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">


        {/* NAME */}
        <div className="md:col-span-4">

          <label className="block text-xs font-bold mb-2">
            Factory Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Factory name"
          />

        </div>


        {/* CODE */}
        <div className="md:col-span-2">

          <label className="block text-xs font-bold mb-2">
            Code
          </label>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={!!initialData}
            className="w-full border rounded px-3 py-2"
            placeholder="F001"
          />

        </div>


        {/* LOCATION */}
        <div className="md:col-span-3">

          <label className="block text-xs font-bold mb-2">
            Location
          </label>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="City / Area"
          />

        </div>


        {/* ADDRESS */}
        <div className="md:col-span-3">

          <label className="block text-xs font-bold mb-2">
            Address
          </label>

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Full address"
          />

        </div>

      </div>


      {/* BUTTONS */}
      <div className="flex gap-3">

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {initialData ? 'Update' : 'Add'}
        </button>


        {initialData && onCancel && (

          <button
            type="button"
            onClick={onCancel}
            className="border px-6 py-2 rounded"
          >
            Cancel
          </button>

        )}

      </div>

    </form>
  )
}
