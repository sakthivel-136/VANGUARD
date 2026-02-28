"use client";

import React from "react";
import { PatrolReportResponse } from "@/app/api/report";

interface PatrolReportPDFProps {
  reportData: PatrolReportResponse;
  factoryCode: string;
}

const PatrolReportPDF: React.FC<PatrolReportPDFProps> = ({
  reportData,
  factoryCode,
}) => {
  return (
    <div className="hidden">
      {/* This component is meant for PDF generation */}
      
      <div className="p-6 bg-white text-black">
        <h1 className="text-2xl font-bold mb-4">
          Patrol Report
        </h1>

        <p className="mb-2">
          <strong>Factory Code:</strong> {factoryCode}
        </p>

        <p className="mb-4">
          <strong>Report Date:</strong> {reportData.report_date}
        </p>

        <table className="w-full border border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">QR Name</th>
              <th className="border p-2 text-left">Round</th>
              <th className="border p-2 text-left">Guard</th>
              <th className="border p-2 text-left">Scan Time</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {reportData.items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.qr_name}</td>
                <td className="border p-2">{item.round}</td>
                <td className="border p-2">
                  {item.guard_name || "—"}
                </td>
                <td className="border p-2">
                  {item.scan_time || "—"}
                </td>
                <td className="border p-2">
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatrolReportPDF;
