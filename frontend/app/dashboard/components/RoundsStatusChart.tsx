import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

// Defining this here so the file is self-contained, 
// remove if you are importing from '../types/dashboard'
export interface RoundStatusData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Add index signature for recharts compatibility
}

interface RoundsStatusChartProps {
  data?: RoundStatusData[];
}

/* -------------------------------------------------------------------------- */
/*                           MAIN COMPONENT                                    */
/* -------------------------------------------------------------------------- */

export default function RoundsStatusChart({ data }: RoundsStatusChartProps) {
  // Initial Mock Data
  const [chartData, setChartData] = useState<RoundStatusData[]>([
    { name: 'Completed', value: 65, color: '#3b82f6' }, // Blue-500
    { name: 'Pending', value: 20, color: '#f59e0b' },  // Amber-500
    { name: 'Missed', value: 15, color: '#ef4444' },   // Red-500
  ]);

  // Calculate total for the center text
  const totalValue = (chartData ?? []).reduce((acc, curr) => acc + curr.value, 0);

  // Simulate Live Data Updates (Slices resizing)
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        // Slightly vary values to show the chart is "alive"
        return prev.map((item) => ({
          ...item,
          value: Math.max(5, item.value + Math.floor(Math.random() * 10) - 5),
        }));
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    // Consistent Card Styling: White, Clean, Shadow
    <div className="relative bg-white rounded-2xl shadow-md p-6 border border-slate-100
                    transition-all duration-300 ease-out
                    hover:shadow-xl hover:shadow-blue-100/20 hover:-translate-y-1
                    overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Rounds Status</h3>
          <p className="text-xs text-gray-400 mt-1">Real-time completion distribution</p>
        </div>
        {/* Optional: Live Indicator for consistency */}
        <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-full border border-slate-100">
            <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold text-green-600 uppercase">Live</span>
        </div>
      </div>

      {/* Chart Container - Relative positioning for center text */}
      <div className="relative h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={55}
              outerRadius={90}
              paddingAngle={5} // Space between slices
              dataKey="value"
              // Animation Props
              isAnimationActive={true}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="white" 
                  strokeWidth={2} // Clean separation between slices
                />
              ))}
            </Pie>
            
            {/* Custom Tooltip */}
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ padding: '2px 0' }}
            />
            
            {/* Clean Legend at bottom */}
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centered Summary Text (Donut Hole) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-3xl font-bold text-gray-800">
            {totalValue}
          </div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total</div>
        </div>
      </div>
    </div>
  );
}