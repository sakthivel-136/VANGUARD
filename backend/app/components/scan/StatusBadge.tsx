"use client";

import React from "react";

interface StatusBadgeProps {
  status: "Active" | "Inactive";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  /* 
    PROFESSIONAL COLOR PALETTE (Strict Blue & White):
    - Active: Vibrant Royal Blue (Action/Success in this theme)
    - Inactive: Muted Slate (Neutral/Secondary)
  */
  const getStatusStyle = (status: string) => {
    if (status === "Active") {
      return "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm shadow-blue-500/5";
    }
    // Inactive
    return "bg-slate-100 text-slate-500 border border-slate-200";
  };

  const getStatusDot = (status: string) => {
    if (status === "Active") {
      return "bg-blue-600 shadow-sm shadow-blue-600/50";
    }
    return "bg-slate-400";
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:ring-2 hover:ring-offset-1 hover:ring-blue-100 ${getStatusStyle(
        status
      )}`}
    >
      {/* Status Dot with subtle animation if active */}
      <span 
        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(status)} ${
          status === "Active" ? "animate-pulse" : ""
        }`}
      ></span>
      
      {status}
    </span>
  );
};