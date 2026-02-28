"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { getPatrolReport, PatrolReportItem } from "../api/report";
import { getFactories } from "../api/factories.api";
import PatrolReportPDF from "../components/reports/PatrolReportPDF";
import ReportTable from "../components/reports/ReportTable";

// ================= TYPES =================
type Factory = {
  factory_code: string;
  factory_name: string;
  factory_address: string | null;
  location: string | null;
};

// ================= ICONS (SVG) =================
const IconFactory = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconDownload = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const IconSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
    </path>
  </svg>
);

// ================= PAGE =================
export default function ReportDownloadPage() {
  const [adminName, setAdminName] = useState("");
  const [factories, setFactories] = useState<Factory[]>([]);
  const [factoryCode, setFactoryCode] = useState("");
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState<PatrolReportItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfTrigger, setPdfTrigger] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // ================= LOAD ADMIN VIA JWT =================
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No token");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://192.0.0.2:8000";
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Invalid token");

        const data = await res.json();
        setAdminName(data.name);
      } catch (err) {
        console.error("Auth error:", err);
        window.location.href = "/login";
      }
    };

    fetchAdminProfile();
  }, []);

  // ================= LOAD FACTORIES =================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getFactories();
        if (res?.data?.length) {
          setFactories(res.data);
          setFactoryCode(res.data[0].factory_code);
        }
      } catch {
        setError("Failed to load factories list.");
      }
    };
    load();
  }, []);

  // ================= FETCH =================
  const fetchReport = async () => {
    if (!factoryCode) return;

    setLoading(true);
    setError(null);
    setPdfTrigger(null);

    try {
      const data = await getPatrolReport(factoryCode, reportDate);
      setReport(data);
      if (data.length === 0) setError("No patrol records found for this date.");
    } catch (err) {
      setError("Failed to fetch report data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= PDF =================
  const handleDownloadPdf = () => {
    if (!report.length) return;
    setPdfLoading(true);
    setPdfTrigger(Date.now());
    setTimeout(() => setPdfLoading(false), 800);
  };

  // ================= CLEAN =================
  const cleanLogs = useMemo(() => {
    return report.map((i) => ({
      ...i,
      lat: i.lat ?? undefined,
      lon: i.lon ?? undefined,
      guard_name: i.guard_name ?? undefined,
    }));
  }, [report]);

  const currentFactory = factories.find((f) => f.factory_code === factoryCode);
  const factoryName = currentFactory?.factory_name || factoryCode;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patrol Reports</h1>
            <p className="mt-2 text-slate-500">
              View logs and generate official patrol documentation.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-slate-600">
              Admin: {adminName || "Loading..."}
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">

            {/* FACTORY */}
            <div className="md:col-span-5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Factory Location
              </label>
              <select
                className="w-full mt-2 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                value={factoryCode}
                onChange={(e) => setFactoryCode(e.target.value)}
              >
                {factories.map((f) => (
                  <option key={f.factory_code} value={f.factory_code}>
                    {f.factory_name}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div className="md:col-span-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Patrol Date
              </label>
              <input
                type="date"
                className="w-full mt-2 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>

            {/* BUTTONS */}
            <div className="md:col-span-3 flex gap-3">
              <button
                onClick={fetchReport}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg"
              >
                {loading ? <IconSpinner /> : "View Report"}
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={!report.length || pdfLoading || loading}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-300 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50"
              >
                {pdfLoading ? <IconSpinner /> : <><IconDownload /> Download PDF</>}
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
          {!loading && cleanLogs.length > 0 && (
            <div ref={printRef}>
              <div className="border-b px-6 py-4 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Report Data</h3>
              </div>
              <ReportTable logs={cleanLogs} loading={loading} />
            </div>
          )}
        </div>

        {/* PDF */}
        {pdfTrigger && cleanLogs.length > 0 && (
          <div className="hidden">
            <PatrolReportPDF
              key={pdfTrigger}
              logs={cleanLogs.map((log) => ({
                ...log,
                status:
                  log.status === "PENDING"
                    ? "MISSED"
                    : log.status,
              }))}
              factoryCode={factoryCode}
              factoryName={factoryName}
              factoryLocation={currentFactory?.location || ""}
              factoryAddress={currentFactory?.factory_address || "N/A"}
              reportDate={reportDate}
              generatedBy={adminName}
            />
          </div>
        )}
      </div>
    </div>
  );
}
