import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      
      <div className="bg-gray-200 rounded-lg p-4 mb-6 h-20"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-6 h-32"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-200 rounded-lg p-6 h-80"></div>
        <div className="bg-gray-200 rounded-lg p-6 h-80"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-200 rounded-lg h-80"></div>
        <div className="bg-gray-200 rounded-lg h-80"></div>
      </div>
    </div>
  );
}