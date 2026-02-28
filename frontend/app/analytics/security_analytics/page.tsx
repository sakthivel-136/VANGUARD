"use client";

import { useState } from "react";
import axiosClient from "@/app/api/axiosClient.js";
// ✅ FIX: Updated imports to use 'security_analytics' folder

// Import Components (Fixed Paths)
import SecurityAnalyticsOverview from "@/app/components/analytics/security_analytics/overview";
import ScansByGuard from "@/app/components/analytics/security_analytics/scans_by_guard";
import MissedScans from "@/app/components/analytics/security_analytics/missed_scans";
import DashboardCharts from "@/app/components/analytics/security_analytics/dashboard_charts";

// Interface for Process Response
interface ProcessResponse {
  date: string;
  total_expected_rounds: number;
  total_scans_processed: number;
  updated_count: number;
  status: string;
}

export default function SecurityAnalyticsPage() {
  const [factoryCode, setFactoryCode] = useState("F001");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  
  // State for processing status
  const [processResult, setProcessResult] = useState<ProcessResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handler to Fix Scans (Backend Logic)
  const handleFixScans = async () => {
    setIsProcessing(true);
    try {
      // ✅ FIX: Added FactoryCode filter support
      const res = await axiosClient.post<ProcessResponse>("/analytics/process-scans", {
        params: { factory_code: factoryCode },
      });
      
      // ✅ FIX: Access .data to get the actual response object, not the Axios wrapper
      const data = res.data;
      setProcessResult(data);
      
      alert(`✅ Success! Processed ${data.updated_count} scans.\nExpected Rounds: ${data.total_expected_rounds}`);
      
      // Refresh data after a short delay to see updated status
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Failed to process scans", error);
      alert("Error processing scans. Check console.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Security Analytics
            </h1>
            <p className="text-gray-500 mt-1">Real-time security monitoring dashboard</p>
          </div>

          {/* DATE PICKER + FIX BUTTON */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">View Date:</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-1.5 text-sm bg-gray-50"
            />
            
            <button 
              onClick={handleFixScans}
              disabled={isProcessing}
              className={`
                px-4 py-2 rounded-md shadow-sm font-medium text-white transition-colors
                ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {isProcessing ? 'Processing...' : 'Fix Scans'}
            </button>
          </div>
        </div>

        {/* PROCESSING INFO (Temporary Alert) */}
        {processResult && (
          <div className="bg-blue-50 border border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
            <p className="font-bold">Processing Complete:</p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>Date: {processResult.date}</li>
              <li>Total Expected Rounds: {processResult.total_expected_rounds}</li>
              <li>Total Actual Scans: {processResult.total_scans_processed}</li>
              <li>Updated Records: {processResult.updated_count}</li>
            </ul>
          </div>
        )}

        {/* 🆕 CHARTS SECTION (PARALLEL) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: ACTIVITY CHART */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-gray-100 
                      transition-all duration-300 hover:shadow-lg h-[400px]">
            <DashboardCharts type="activity" factoryCode={factoryCode} />
          </div>

          {/* RIGHT: GUARD PERFORMANCE CHART */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-gray-100 
                      transition-all duration-300 hover:shadow-lg h-[400px]">
            <DashboardCharts type="guard" factoryCode={factoryCode} />
          </div>

        </div>

        {/* KPI OVERVIEW SECTION */}
        <div className="transform transition-all duration-500 hover:scale-[1.01]">
          <SecurityAnalyticsOverview />
        </div>

        {/* BOTTOM GRID (DETAILS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* GUARD ACTIVITY CARD */}
          <div className="bg-white rounded-2xl p-1 shadow-sm border-gray-100 
                      transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-gray-50/50 rounded-xl p-6 h-full">
              <ScansByGuard />
            </div>
          </div> {/* ✅ FIX: Added missing closing tag */}

          {/* MISSED SCANS CARD */}
          <div className="bg-white rounded-2xl p-1 shadow-sm border-gray-100 
                      transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-gray-50/50 rounded-xl p-6 h-full">
              <MissedScans factoryCode={factoryCode} />
            </div>
          </div> {/* ✅ FIX: Added missing closing tag */}

        </div>

      </div>
    </div>
  );
}