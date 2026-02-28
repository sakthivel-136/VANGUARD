'use client';
import { FactoriesTable } from '@/app/components/factory/FactoriesTable';

export default function FactoryPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Factories</h1>
      <FactoriesTable />
    </div>
  );
}
