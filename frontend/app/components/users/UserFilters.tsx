'use client';

import React from 'react';

type UserRole = 'Admin' | 'Supervisor' | 'Guard' | 'All';
type UserStatus = 'Active' | 'Inactive' | 'All';

interface UserFilterValues {
  role: UserRole;
  status: UserStatus;
  site: string;
}

interface UserFiltersProps {
  filters: UserFilterValues;
  onFilterChange: (filters: UserFilterValues) => void;
  sites: string[];
}

export default function UserFilters({
  filters,
  onFilterChange,
  sites,
}: UserFiltersProps) {

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    onFilterChange({
      ...filters,
      [name]: value,
    } as UserFilterValues);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={filters.role}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Guard">Guard</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="site"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Site
          </label>
          <select
            id="site"
            name="site"
            value={filters.site}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Sites</option>
            {sites.map((site) => (
              <option key={site} value={site}>
                {site}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
