'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DataPoint {
  time: string;
  count: number;
}

interface AverageRoundTimeCardProps {
  averageTime: number; // Received from Dashboard API
  targetTime: number;  // Received from Dashboard API
}

const CountUp: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = Math.round(value);
    const range = end - start;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(start + range * ease));
      if (progress < 1) window.requestAnimationFrame(step);
      else prevValue.current = end;
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

export default function AverageRoundTimeCard({ averageTime, targetTime }: AverageRoundTimeCardProps) {
  const [data, setData] = useState<DataPoint[]>([
    { time: '08:00', count: 12 }, { time: '08:20', count: 15 },
    { time: '08:40', count: 10 }, { time: '09:00', count: 18 },
    { time: '09:20', count: 22 }, { time: '09:40', count: 16 },
    { time: '10:00', count: 25 }, { time: '10:20', count: 20 },
  ]);

  const maxVal = 40;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setData((prev) => [...prev.slice(1), { time: timeString, count: averageTime || Math.floor(Math.random() * 25) + 10 }]);
    }, 5000);
    return () => clearInterval(interval);
  }, [averageTime]);

  const createSmoothPath = () => {
    if (data.length < 2) return '';
    const points = data.map((point, index) => [
      (index / (data.length - 1)) * 100,
      100 - (point.count / maxVal) * 100
    ]);
    let d = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }
    return d;
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-md p-6 border border-slate-100 transition-all hover:shadow-xl hover:shadow-blue-100 overflow-hidden">
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Average Round Time</h3>
            <span className="text-3xl font-bold text-blue-600">
              <CountUp value={averageTime} />
            </span>
            <span className="text-xs text-blue-500 font-medium">min</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Target: {targetTime} min</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">Live</span>
        </div>
      </div>

      <div className="relative h-52 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={`${createSmoothPath()} V 100 H 0 Z`} fill="url(#blueGradient)" />
          <path d={createSmoothPath()} fill="none" stroke="#3b82f6" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}