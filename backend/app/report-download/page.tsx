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
};

// ================= ICONS (SVG) =================
const IconFactory = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
);

const IconCalendar = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
);

const IconDownload = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
);

const IconSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// ================= PAGE =================
export default function ReportDownloadPage() {
  // State
  const [adminName, setAdminName] = useState("");
  const [factories, setFactories] = useState<Factory[]>([]);
  const [factoryCode, setFactoryCode] = useState("");
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState<PatrolReportItem[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfTrigger, setPdfTrigger] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // ================= LOAD ADMIN =================
  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name && name.trim() !== "") {
      setAdminName(name);
    } else {
      window.location.href = "/login";
    }
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
    setPdfTrigger(null); // Reset PDF trigger on new fetch

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patrol Reports</h1>
            <p className="mt-2 text-slate-500">View logs and generate official patrol documentation.</p>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-slate-600">Admin: {adminName || "Loading..."}</span>
          </div>
        </div>

        {/* Controls Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 transition-shadow hover:shadow-md">
          
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            
            {/* Factory Input */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Factory Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconFactory />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                  value={factoryCode}
                  onChange={(e) => setFactoryCode(e.target.value)}
                >
                  {factories.map((f) => (
                    <option key={f.factory_code} value={f.factory_code}>
                      {f.factory_name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                   <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Date Input */}
            <div className="md:col-span-4 space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patrol Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconCalendar />
                </div>
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-3 flex gap-3">
              <button
                onClick={fetchReport}
                disabled={loading}
                className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
              >
                {loading ? <IconSpinner /> : "View Report"}
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={!report.length || pdfLoading || loading}
                className="flex-1 flex justify-center items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-2.5 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                title="Download PDF"
              >
                {pdfLoading ? <IconSpinner /> : <IconDownload />}
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
          
          {!loading && cleanLogs.length > 0 && (
            <div className="overflow-x-auto" ref={printRef}>
              <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                 <h3 className="font-semibold text-slate-800">Report Data</h3>
              </div>
              <ReportTable logs={cleanLogs} />
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <IconSpinner />
              <p className="mt-3 text-sm font-medium animate-pulse">Fetching patrol logs...</p>
            </div>
          )}

          {!loading && !cleanLogs.length && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-slate-900 font-medium text-lg">No records found</h3>
              <p className="text-slate-500 mt-1 max-w-sm">
                Select a factory and date, then click "View Report" to load patrol data.
              </p>
            </div>
          )}

        </div>

        {/* Hidden PDF Component */}
        {pdfTrigger && cleanLogs.length > 0 && (
          <div className="hidden">
            <PatrolReportPDF
              key={pdfTrigger}
              logs={cleanLogs}
              factoryCode={factoryCode}
              factoryName={factoryName}
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