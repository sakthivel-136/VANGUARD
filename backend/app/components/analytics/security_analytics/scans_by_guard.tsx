"use client";

import { useEffect, useState } from "react";
import {
  getScansByGuard,
  GuardScan,
} from "@/app/api/analytics.api";

export default function ScansByGuard() {
  const [guards, setGuards] = useState<GuardScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getScansByGuard()
      .then((res) => setGuards(res))
      .catch(() => setError("Failed to load scans by guard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading guard scan data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold">Scans by Guard</h2>

      {guards.length === 0 ? (
        <p className="text-gray-500">No scan data available</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Guard</th>
              <th className="text-right py-2">Scans</th>
            </tr>
          </thead>
          <tbody>
            {guards.map((g) => (
              <tr key={g.guard_name} className="border-b">
                <td className="py-2">{g.guard_name}</td>
                <td className="py-2 text-right font-medium">
                  {g.scan_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
