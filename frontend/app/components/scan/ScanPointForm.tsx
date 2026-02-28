"use client";

import React, { useState } from "react";

/**
 * ✅ DB ALIGNED ScanPoint
 */
export interface ScanPoint {
  id: string;
  factory_id: string;

  scan_point_code: string;
  scan_point_name: string;
  scan_type?: string | null;
  floor?: string | null;
  area?: string | null;
  location?: string | null;

  risk_level?: "Low" | "Medium" | "High" | null;
  is_active: boolean;

  created_at?: string;
}

interface ScanPointFormProps {
  scanPoint: ScanPoint | null;
  onClose: () => void;
  onSubmit: (data: Partial<ScanPoint>) => void;
}

export const ScanPointForm = ({
  scanPoint,
  onClose,
  onSubmit,
}: ScanPointFormProps) => {
  const [formData, setFormData] = useState({
    factory_id: scanPoint?.factory_id || "",
    scan_point_name: scanPoint?.scan_point_name || "",
    scan_point_code: scanPoint?.scan_point_code || "",
    scan_type: scanPoint?.scan_type || "",
    location: scanPoint?.location || "",
    area: scanPoint?.area || "",
    floor: scanPoint?.floor || "",
    risk_level: scanPoint?.risk_level || "Low",
    is_active: scanPoint?.is_active ?? true,
  });

  /* ================= CHANGE HANDLER ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      factory_id: formData.factory_id,
      scan_point_name: formData.scan_point_name,
      scan_point_code: formData.scan_point_code,
      scan_type: formData.scan_type,
      location: formData.location,
      area: formData.area,
      floor: formData.floor,
      risk_level: formData.risk_level,
      is_active: formData.is_active,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      
      {/* Glassmorphism Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal Card */}
      <div className="bg-white w-full md:max-w-4xl h-[95vh] md:h-auto md:max-h-[90vh] md:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl shadow-blue-900/10 relative z-10 transform transition-all">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/95 backdrop-blur">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {scanPoint ? "Edit Scan Point" : "Add Scan Point"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Configure the details for this specific checkpoint.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-10"
        >
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Factory ID"
                name="factory_id"
                value={formData.factory_id}
                onChange={handleChange}
                disabled // Usually immutable in edit
              />
              <Input
                label="Scan Point Name"
                name="scan_point_name"
                value={formData.scan_point_name}
                onChange={handleChange}
              />
              <Input
                label="QR Code"
                name="scan_point_code"
                value={formData.scan_point_code}
                onChange={handleChange}
              />
              <Input
                label="Scan Type"
                name="scan_type"
                value={formData.scan_type}
                onChange={handleChange}
              />
              <Input
                label="Building / Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              <Input
                label="Area"
                name="area"
                value={formData.area}
                onChange={handleChange}
              />
              <Input
                label="Floor"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Configuration Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Risk Level"
                name="risk_level"
                value={formData.risk_level}
                onChange={handleChange}
                options={["Low", "Medium", "High"]}
              />
              <Select
                label="Status"
                name="is_active"
                value={formData.is_active ? "true" : "false"}
                onChange={(
                  e: React.ChangeEvent<HTMLSelectElement>
                ) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.value === "true",
                  }))
                }
                options={["true", "false"]}
                optionLabels={{
                  true: "Active",
                  false: "Inactive",
                }}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-white hover:shadow-sm hover:text-slate-900 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center gap-2"
            onClick={handleSubmit}
          >
            Save Changes
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Premium Styled Helpers ---------- */

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <input
      {...props}
      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

const Select = ({ label, options, optionLabels, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <select
        {...props}
        className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 cursor-pointer"
      >
        {options.map((o: string) => (
          <option key={o} value={o}>
            {optionLabels?.[o] ?? o}
          </option>
        ))}
      </select>
      {/* Custom Arrow Icon */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-200">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);