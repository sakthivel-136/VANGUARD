"use client";

import { useState } from "react";
import { QRCode } from "@/app/dashboard/qr-crud/page";
import { MoreHorizontal, Eye, Edit, Power, Trash2 } from "lucide-react"; // Using Lucide for professional icons

interface QrActionsProps {
  qr: QRCode;
  onEdit: (qr: QRCode) => void;
  onView: (qr: QRCode) => void;
  onToggleStatus: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

export default function QrActions({
  qr,
  onEdit,
  onView,
  onToggleStatus,
  onDelete,
}: QrActionsProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setShowActions(!showActions)}
        className="h-8 w-8 flex items-center justify-center rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {/* Dropdown Menu */}
      {showActions && (
        <>
          {/* Backdrop (Click outside) */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowActions(false)}
          ></div>

          {/* Menu Card */}
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-200">
            
            {/* View */}
            <button
              onClick={() => {
                onView(qr);
                setShowActions(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors rounded-md mx-1"
            >
              <Eye className="w-4 h-4" />
              View QR Code
            </button>

            {/* Edit */}
            <button
              onClick={() => {
                onEdit(qr);
                setShowActions(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors rounded-md mx-1"
            >
              <Edit className="w-4 h-4" />
              Edit Details
            </button>

            {/* Toggle Status */}
            <button
              onClick={() => {
                onToggleStatus(qr.qr_id);
                setShowActions(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors rounded-md mx-1"
            >
              <Power className="w-4 h-4" />
              {qr.status === "active" ? "Disable Code" : "Enable Code"}
            </button>

            {/* Delete Divider */}
            <div className="my-1 mx-2 border-t border-slate-100"></div>

            {/* Delete */}
            <button
              onClick={() => {
                onDelete(qr.qr_id);
                setShowActions(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-md mx-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}