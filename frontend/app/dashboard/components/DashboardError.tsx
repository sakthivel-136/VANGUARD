import React from 'react';

interface DashboardErrorProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function DashboardError({ 
  title = "Something went wrong", 
  description = "We encountered an error while loading dashboard. Please try again.",
  onRetry
}: DashboardErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      
      {/* Icon Container with Pulse Animation */}
      <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
         {/* Custom SVG Icon */}
         <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
           {/* Shield Icon */}
           <path d="M12 22s2-4.586-01a4 0.586-011 2 292-0 058" />
        </svg>
      </div>

      {/* Typography */}
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-center max-w-md mb-6 leading-relaxed">{description}</p>

      {/* Action Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="group px-6 py-2.5 bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
}