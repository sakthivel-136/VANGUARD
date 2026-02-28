"use client";

import React, { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { ROUND_TIMES, RoundTime } from "./roundtime";


// ===============================
// Interface
// ===============================
export interface ScanLog {
  id?: string | number;

  scan_time: string | null;
  factory_code?: string;
  guard_name?: string;
  qr_name: string;

  round: number;

  lat?: string;
  lon?: string;

  status?: string;

  [key: string]: any;
}


// ===============================
// Column
// ===============================
interface Column {
  key: keyof ScanLog;
  label: string;
}


// ===============================
// Props
// ===============================
interface ReportTableProps {
  logs: ScanLog[];
  loading: boolean;
}


// ===============================
// Component
// ===============================
const ReportTable: React.FC<ReportTableProps> = ({ logs, loading }) => {

  console.log("REPORT LOGS:", logs);


  // ===============================
  // Status Normalizer (SAME AS PDF)
  // ===============================
  const normalizeStatus = (
    status?: string | null,
    scanTime?: string | null
  ): "SUCCESS" | "MISSED" | "PROGRESS" => {

    // If no time → PROGRESS
    if (!scanTime) return "PROGRESS";

    if (!status) return "PROGRESS";

    const s = status.toLowerCase().trim();

    if (
      s === "success" ||
      s === "completed" ||
      s === "done"
    ) {
      return "SUCCESS";
    }

    if (s === "missed") {
      return "MISSED";
    }

    return "PROGRESS";
  };


  // -------------------------------
  // Sorting
  // -------------------------------
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ScanLog;
    direction: "asc" | "desc";
  }>({
    key: "scan_time",
    direction: "desc",
  });


  // -------------------------------
  // Pagination Per Round
  // -------------------------------
  const [pages, setPages] = useState<Record<number, number>>({});

  const rowsPerPage = 10;


  const getPage = (round: number) => pages[round] || 1;

  const setPage = (round: number, page: number) => {
    setPages((prev) => ({
      ...prev,
      [round]: page,
    }));
  };


  // -------------------------------
  // Columns
  // -------------------------------
  const columns: Column[] = [
    { key: "scan_time", label: "Scan Time" },
    { key: "factory_code", label: "Factory" },
    { key: "guard_name", label: "Guard" },
    { key: "qr_name", label: "Scan Point" },
    { key: "lat", label: "Latitude" },
    { key: "lon", label: "Longitude" },
    { key: "status", label: "Status" },
  ];


  // -------------------------------
  // Sorting Handler
  // -------------------------------
  const handleSort = (key: keyof ScanLog) => {

    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    } else {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };


  // -------------------------------
  // Filter Logs
  // -------------------------------
  const validLogs = useMemo(() => {
    return logs.filter(
      (log) => log.round >= 1 && log.round <= 33
    );
  }, [logs]);


  // -------------------------------
  // Sort Data
  // -------------------------------
  const sortedData = useMemo(() => {

    return [...validLogs].sort((a, b) => {

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];


      if (sortConfig.key === "scan_time") {

        const dateA = aValue ? new Date(aValue as string).getTime() : 0;
        const dateB = bValue ? new Date(bValue as string).getTime() : 0;

        return sortConfig.direction === "asc"
          ? dateA - dateB
          : dateB - dateA;
      }


      if (!aValue || !bValue) return 0;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;

      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

      return 0;
    });

  }, [validLogs, sortConfig]);


  // -------------------------------
  // Group By Round
  // -------------------------------
  const logsByRound = useMemo(() => {

    const grouped: Record<number, ScanLog[]> = {};

    sortedData.forEach((log) => {

      const r = log.round || 1;

      if (!grouped[r]) grouped[r] = [];

      grouped[r].push(log);
    });

    return grouped;

  }, [sortedData]);


  // -------------------------------
  // Render Cell
  // -------------------------------
  const renderCell = (row: ScanLog, key: keyof ScanLog) => {

    const value = row[key];


    // Date
    if (key === "scan_time") {

      if (!value) return "—";

      return new Date(value as string).toLocaleString();
    }


    // ================= Status (UPDATED) =================
    if (key === "status") {

      const finalStatus = normalizeStatus(
        row.status,
        row.scan_time
      );


      let color = "";

      if (finalStatus === "SUCCESS") {
        color = "bg-green-100 text-green-800";
      }

      if (finalStatus === "MISSED") {
        color = "bg-red-100 text-red-800";
      }

      if (finalStatus === "PROGRESS") {
        color = "bg-orange-100 text-orange-800";
      }


      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}
        >
          {finalStatus}
        </span>
      );
    }


    return value ?? "—";
  };


  // -------------------------------
  // Loading / Empty
  // -------------------------------
  if (loading) {
    return (
      <div className="text-center py-6 text-slate-500">
        Loading scan logs...
      </div>
    );
  }

  if (!validLogs.length) {
    return (
      <div className="text-center py-6 text-slate-500">
        No scan records found
      </div>
    );
  }


  // ===============================
  // UI
  // ===============================
  return (
    <div className="space-y-8">

      {Object.keys(logsByRound)
        .sort((a, b) => Number(a) - Number(b))
        .map((roundKey) => {

          const roundNumber = Number(roundKey);

          if (!ROUND_TIMES[roundNumber]) return null;

          const roundLogs = logsByRound[roundNumber];


          // Pagination
          const page = getPage(roundNumber);

          const totalPages = Math.ceil(roundLogs.length / rowsPerPage);

          const indexOfLastRow = page * rowsPerPage;

          const indexOfFirstRow = indexOfLastRow - rowsPerPage;

          const currentRows = roundLogs.slice(
            indexOfFirstRow,
            indexOfLastRow
          );


          // Round time
          const roundTime: RoundTime | undefined =
            ROUND_TIMES[roundNumber];

          const startTime = roundTime?.start ?? "-";
          const endTime = roundTime?.end ?? "-";


          return (

            <div
              key={roundKey}
              className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm p-4"
            >

              {/* Header */}
              <h2 className="text-lg font-semibold mb-3">
                Round {roundNumber} — Start: {startTime}, End: {endTime}
              </h2>


              {/* Table */}
              <table className="min-w-full divide-y divide-slate-200 bg-white">

                {/* Head */}
                <thead className="bg-slate-50">

                  <tr>

                    {columns.map((col) => {

                      const isActive = sortConfig.key === col.key;

                      return (

                        <th
                          key={String(col.key)}
                          onClick={() => handleSort(col.key)}
                          className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none
                            ${
                              isActive
                                ? "bg-blue-100 text-blue-700"
                                : "text-slate-500 hover:bg-slate-100"
                            }`}
                        >

                          <div className="flex items-center gap-1">

                            {col.label}

                            {isActive ? (

                              sortConfig.direction === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              )

                            ) : (

                              <ArrowUpDown className="w-3 h-3 opacity-30" />

                            )}

                          </div>

                        </th>
                      );
                    })}

                  </tr>

                </thead>


                {/* Body */}
                <tbody className="divide-y divide-slate-200">

                  {currentRows.map((row, index) => (

                    <tr
                      key={`${row.qr_name}-${roundNumber}-${index}`}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      {columns.map((col) => (

                        <td
                          key={String(col.key)}
                          className="px-6 py-4 whitespace-nowrap text-sm text-slate-700"
                        >

                          {renderCell(row, col.key)}

                        </td>
                      ))}

                    </tr>
                  ))}

                </tbody>

              </table>


              {/* Pagination */}
              {totalPages > 1 && (

                <div className="mt-3 flex justify-between items-center px-2">

                  <button
                    onClick={() =>
                      setPage(roundNumber, Math.max(1, page - 1))
                    }
                    disabled={page === 1}
                    className="px-4 py-1 border rounded shadow-sm text-sm font-medium
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-slate-50"
                  >
                    Previous
                  </button>


                  <span className="text-sm font-medium text-slate-600">
                    Page {page} of {totalPages}
                  </span>


                  <button
                    onClick={() =>
                      setPage(
                        roundNumber,
                        Math.min(totalPages, page + 1)
                      )
                    }
                    disabled={page === totalPages}
                    className="px-4 py-1 border rounded shadow-sm text-sm font-medium
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-slate-50"
                  >
                    Next
                  </button>

                </div>
              )}

            </div>
          );
        })}

    </div>
  );
};

export default ReportTable;
