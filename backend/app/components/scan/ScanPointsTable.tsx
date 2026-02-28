"use client";

import React from "react";
import { StatusBadge } from "./StatusBadge";

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

interface ScanPointsTableProps {
  scanPoints: ScanPoint[];
  onEdit: (scanPoint: ScanPoint) => void;
  onDisable: (id: string) => void;
}

export const ScanPointsTable: React.FC<ScanPointsTableProps> = ({
  scanPoints,
  onEdit,
  onDisable,
}) => {
  /* 
    REFINED COLOR LOGIC (Strict Blue & White):
    - Low Risk: Slate (Subtle)
    - Medium Risk: Indigo (Attention)
    - High Risk: Deep Blue (Critical)
  */
  const getRiskStyle = (risk?: string | null) => {
    switch (risk) {
      case "High":
        return "bg-blue-600 text-white border border-blue-700";
      case "Medium":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "Low":
        return "bg-slate-100 text-slate-600 border border-slate-200";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Scan Point Details
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Risk Level
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-slate-100">
          {scanPoints.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="bg-slate-50 p-3 rounded-full">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-500">No scan points found</p>
                  <p className="text-xs text-slate-400">Adjust filters or add a new point to get started.</p>
                </div>
              </td>
            </tr>
          ) : (
            scanPoints.map((sp) => (
              <tr 
                key={sp.id} 
                className="hover:bg-slate-50 transition-colors duration-150 group"
              >
                {/* ID & Code */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-mono mb-0.5">{sp.scan_point_code}</span>
                    <span className="text-sm font-bold text-slate-800">{sp.id}</span>
                  </div>
                </td>

                {/* Name */}
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-700">{sp.scan_point_name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{sp.factory_id}</div>
                </td>

                {/* Type */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">
                    {sp.scan_type || "—"}
                  </span>
                </td>

                {/* Location Stack */}
                <td className="px-6 py-4">
                  <div className="flex flex-col text-sm text-slate-600">
                    <span>{sp.location}</span>
                    <span className="text-xs text-slate-400">
                      {sp.floor && `${sp.floor} • `} {sp.area}
                    </span>
                  </div>
                </td>

                {/* Risk Pill */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide shadow-sm ${getRiskStyle(sp.risk_level)}`}>
                    {sp.risk_level || "Unknown"}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={sp.is_active ? "Active" : "Inactive"} />
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => onEdit(sp)} 
                      className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                      title="Edit"
                    >
                      Edit
                    </button>
                    {sp.is_active && (
                      <button 
                        onClick={() => onDisable(sp.id)} 
                        className="text-slate-600 hover:text-red-600 transition-colors duration-200 font-medium"
                        title="Disable"
                      >
                        Disable
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};