"use client";

import { QRCodeSVG } from "qrcode.react";
import { QRCode as QRDataType } from "@/app/dashboard/qr-crud/page";
import { Printer, X, Info } from "lucide-react";

interface QrPreviewProps {
  qr: QRDataType;
  onClose: () => void;
}

export default function QrPreview({ qr, onClose }: QrPreviewProps) {

  const qrData = String(qr.qr_id || "0");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl z-10 flex overflow-hidden print:shadow-none print:w-full print:max-w-none">

        {/* PRINT + PREVIEW AREA */}
        <div className="print-area w-1/2 bg-white flex items-center justify-center p-6">

          <div className="qr-wrapper">

            {/* QR */}
            <QRCodeSVG
              value={qrData}
              size={260} // Preview size
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="H"
            />

            {/* NAME */}
            <p className="qr-name">
              {qr.qr_name}
            </p>

          </div>

        </div>

        {/* RIGHT UI */}
        <div className="w-1/2 p-8 flex flex-col bg-white print:hidden">

          <div className="flex justify-between items-start mb-6">

            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Full Page QR
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                A4 Fit-to-Page
              </p>
            </div>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">

            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-900 uppercase">
                Print Mode
              </span>
            </div>

            <p className="text-xs text-blue-700">
              Prints large QR with name below on A4 page.
            </p>

          </div>

          {/* ACTIONS */}
          <div className="mt-auto flex gap-3">

            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 font-bold rounded-xl hover:bg-slate-50"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>

            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800"
            >
              Done
            </button>

          </div>

        </div>
      </div>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {

          /* Reset */
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }

          body * {
            visibility: hidden;
          }

          /* Show print area */
          .print-area,
          .print-area * {
            visibility: visible;
          }

          /* A4 */
          @page {
            size: A4;
            margin: 0;
          }

          /* Full page container */
          .print-area {
            position: fixed;
            inset: 0;

            width: 210mm;
            height: 297mm;

            display: flex;
            justify-content: center;
            align-items: center;
          }

          /* QR wrapper */
          .qr-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20mm;
          }

          /* Enlarge QR for print */
          .qr-wrapper svg {
            width: 180mm !important;
            height: 180mm !important;
          }

          /* Name in print */
          .qr-name {
            font-size: 24px;
            font-weight: 700;
          }
        }

        /* PREVIEW MODE */

        .qr-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .qr-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2933;
          text-align: center;
        }
      `}</style>

    </div>
  );
}
