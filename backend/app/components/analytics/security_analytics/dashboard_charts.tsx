"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDashboardCharts, DashboardChartsResponse } from "@/app/api/analytics.api";

export default function DashboardCharts({ 
  type, 
  factoryCode 
}: { 
  type: "activity" | "guard"; 
  factoryCode?: string 
}) {
  const [data, setData] = useState<DashboardChartsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    console.log(`🔍 Fetching charts for factory: ${factoryCode}`);

    getDashboardCharts(factoryCode) // Passing factory code
      .then((res) => {
        console.log("✅ API Response:", res);
        setData(res);
      })
      .catch((err) => {
        console.error("❌ API Error:", err);
        setError("Failed to load chart data");
      })
      .finally(() => setLoading(false));
  }, [factoryCode]); 

  // 1. ERROR STATE (Fixed Height + Border)
  if (error) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center p-6 bg-red-50 border-2 border-red-400 rounded-xl">
        <div className="text-center">
          <p className="text-red-600 font-bold text-lg">Error Loading Data</p>
          <p className="text-red-500 text-sm mt-1">Check backend console.</p>
        </div>
      </div>
    );
  }

  // 2. LOADING STATE (Fixed Height + Border)
  if (loading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl animate-pulse">
        <div className="text-gray-500 font-medium flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018 8 018 0 018 8 0 010 100 4 0 0 0 8 0 8 0 0 8 0 018a2 2 0 012 012 2 2 0 012 012 0 012 2 0 012 018a6 6 0 016 12 2 12 2 12 2 12 2 012 018a6 6 0 016 12 2 12 2 12 2 012 018z"></path>
          </svg>
          <span>Loading Analytics...</span>
        </div>
      </div>
    );
  }

  // 3. EMPTY DATA STATE (Fixed Height + Border)
  if (!data || (data.activity_data.length === 0 && data.guard_data.length === 0)) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <div className="text-center">
          <p className="text-blue-400 text-xl font-bold">No Data Available</p>
          <p className="text-blue-500 text-sm mt-1">No scans found for this factory.</p>
        </div>
      </div>
    );
  }

  // 4. SUCCESS STATE (Fixed Height)
  return (
    <div className="h-[400px] w-full"> {/* 🚨 FORCED HEIGHT */}
      {type === "activity" ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.activity_data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#9ca3af"
            />
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  color: '#fff', 
                  borderRadius: '8px',
                  border: 'none' 
                }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="scans" 
              stroke="#2563eb" 
              strokeWidth={3} 
              dot={{ fill: '#2563eb', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.guard_data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#9ca3af"
            />
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  color: '#fff', 
                  borderRadius: '8px',
                  border: 'none' 
                }}
            />
            <Legend />
            <Bar dataKey="scans" fill="#4f46e5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}