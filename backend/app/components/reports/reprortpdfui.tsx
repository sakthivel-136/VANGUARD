
"use client";
import React, { useState, useEffect } from "react";
import { getPatrolReport as getPatrolReportPDF, PatrolReportResponse } from "../../api/patrolApi";
import PatrolReportPDF from "./PatrolReportPDF";

interface ReportPDFUIProps {
  factoryCode: string;
  reportDate: string;
}

const ReportPDFUI: React.FC<ReportPDFUIProps> = ({ factoryCode, reportDate }) => {
  const [reportData, setReportData] = useState<PatrolReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatrolReportPDF(factoryCode, reportDate); // backend call
      setReportData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (factoryCode && reportDate) {
      fetchReport();
    }
  }, [factoryCode, reportDate]);

  return (
    <div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
        onClick={fetchReport}
        disabled={loading}
      >
        {loading ? "Generating PDF..." : "Download Report PDF"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {/* Render PDF generator once data is fetched */}
      {reportData && (
        <PatrolReportPDF
          logs={[]}
          factoryCode={factoryCode}
          factoryName={reportData.factory_name || 'Unknown'}
          factoryAddress={reportData.factory_address || ''}
          reportDate={reportDate}
          generatedBy={reportData.generated_by || 'System'}
        />
      )}
    </div>
  );
};

export default ReportPDFUI;