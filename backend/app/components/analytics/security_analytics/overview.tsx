"use client";

import { useEffect, useState } from "react";
import {
  getAnalyticsOverview,
  AnalyticsOverview,
} from "@/app/api/analytics.api";

export default function SecurityAnalyticsOverview() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getAnalyticsOverview()
      .then((res) => setData(res))
      .catch(() => setError("Failed to load analytics overview"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading overview...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card title="Total Scans" value={data.total_scans} />
      <Card title="Active Guards" value={data.active_guards} />
      <Card title="Inactive Guards" value={data.inactive_guards} />
      <Card title="Missed Scans" value={data.missed_scans} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
