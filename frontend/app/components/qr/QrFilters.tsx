"use client";

import { Factory } from "@/app/dashboard/qr-crud/page";
import { ChevronDown, Building2 } from "lucide-react"; // Professional icons

interface QrFiltersProps {
  value: string; 
  onChange: (factoryCode: string) => void;
  factories: Factory[];
}

export default function QrFilters({ value, onChange, factories }: QrFiltersProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300 flex items-center gap-4">
      
      {/* Label with Icon */}
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-600" />
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
          Factory
        </label>
      </div>

      {/* Custom Styled Select */}
      <div className="relative flex-1 group">
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-hover:text-blue-500 transition-colors duration-200">
          <ChevronDown className="w-4 h-4" />
        </div>
        
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl py-3 pl-4 pr-10 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-white hover:border-blue-300 transition-all cursor-pointer"
        >
          <option value="" disabled className="text-slate-400">Select a factory location...</option>
          {factories.map((f) => (
            <option key={f.factory_code} value={f.factory_code}>
              {f.factory_name}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}