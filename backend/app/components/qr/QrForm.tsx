"use client";

import { useState, useEffect } from "react";
import { QRCode, Factory } from "@/app/dashboard/qr-crud/page";
import { X, MapPin, Save, Loader2, Clock } from "lucide-react";

interface QrFormProps {
  qr: QRCode | null;
  factories: Factory[];
  isEditMode: boolean;
  onSave: (qrData: QRCode) => Promise<void>;
  onClose: () => void;
}

export default function QrForm({ qr, factories, isEditMode, onSave, onClose }: QrFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form state
  const [formData, setFormData] = useState<QRCode>({
    qr_id: 0,
    qr_name: "",
    lat: 0,
    lon: 0,
    status: "inactive",
    factory_code: "",
    waiting_time: 15, // ✅ ADDED: Default value
  });

  // Populate form when editing or when factories load
  useEffect(() => {
    if (qr) {
      setFormData(qr);
    } else if (factories.length > 0) {
      setFormData({
        qr_id: 0,
        qr_name: "",
        lat: 0,
        lon: 0,
        status: "inactive",
        factory_code: factories[0].factory_code,
        waiting_time: 15, // ✅ ADDED: Default for new entry
      });
    }
  }, [qr, factories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.qr_name || !formData.factory_code) {
      alert("Please fill in Name and Factory.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl shadow-blue-900/10 z-10 transform transition-all">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/95 backdrop-blur">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {isEditMode ? "Edit QR Code" : "Add QR Code"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {isEditMode ? "Update checkpoint details." : "Register a new checkpoint."}
            </p>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Factory Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Factory Location</label>
            <div className="relative group">
              <select
                value={formData.factory_code}
                onChange={(e) => setFormData({ ...formData, factory_code: e.target.value })}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
                required
              >
                {factories.map((f) => (
                  <option key={f.factory_code} value={f.factory_code}>{f.factory_name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-blue-500 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {/* QR Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">QR Name / Code</label>
            <input
              type="text"
              value={formData.qr_name}
              onChange={(e) => setFormData({ ...formData, qr_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 transition-all"
              placeholder="e.g. Main Entrance A"
              required
            />
          </div>

          {/* ✅ ADDED: Waiting Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Waiting Time (Seconds)</label>
            </div>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.waiting_time || 15}
              onChange={(e) => setFormData({ ...formData, waiting_time: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 transition-all"
              placeholder="e.g. 15"
            />
            <p className="text-xs text-slate-400 ml-1">Time required before next scan is allowed.</p>
          </div>

          {/* Coordinates Grid */}
          <div className="space-y-2">
             <div className="flex items-center gap-2 mb-2">
               <MapPin className="w-4 h-4 text-blue-600" />
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">GPS Coordinates</label>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <input
                 type="number" step="any"
                 value={formData.lat}
                 onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                 className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 transition-all"
                 placeholder="Latitude"
                 required
               />
               <input
                 type="number" step="any"
                 value={formData.lon}
                 onChange={(e) => setFormData({ ...formData, lon: parseFloat(e.target.value) || 0 })}
                 className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 transition-all"
                 placeholder="Longitude"
                 required
               />
             </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
            <div className="relative group">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-blue-500 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-white hover:shadow-sm hover:text-slate-900 transition-all disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center gap-2 disabled:opacity-70">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSubmitting ? "Saving..." : "Save QR Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}