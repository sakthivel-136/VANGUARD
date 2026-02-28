import React from 'react';
import { SiteOption } from '../types/dashboard';

interface DashboardFiltersProps {
  dateRange: {
    start: string;
    end: string;
  };
  site: string;
  siteOptions: SiteOption[];
  onDateRangeChange: (start: string, end: string) => void;
  onSiteChange: (site: string) => void;
}

export default function DashboardFilters({
  dateRange,
  site,
  siteOptions,
  onDateRangeChange,
  onSiteChange
}: DashboardFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.start}
              onChange={(e) => onDateRangeChange(e.target.value, dateRange.end)}
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.end}
              onChange={(e) => onDateRangeChange(dateRange.start, e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 max-w-xs">
          <label htmlFor="site-select" className="block text-sm font-medium text-gray-700 mb-1">
            Site
          </label>
          <select
            id="site-select"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={site}
            onChange={(e) => onSiteChange(e.target.value)}
          >
            {siteOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}