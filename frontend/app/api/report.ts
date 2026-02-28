import axios, { AxiosError } from "axios";

/* =====================================================
   TYPES
===================================================== */

export interface PatrolReportItem {
  qr_name: string;
  round: number;
  scan_time: string | null;
  lat: string | null;
  lon: string | null;
  guard_name: string | null;
  status: "SUCCESS" | "MISSED" | "PENDING";
}

export interface PatrolReportResponse {
  factory_code: string;
  report_date: string;
  items: PatrolReportItem[];
}

interface WrappedResponse {
  success?: boolean;
  data?: PatrolReportItem[];
  message?: string;
}

/* =====================================================
   API CONFIG
===================================================== */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/* =====================================================
   CORE FETCH FUNCTION
===================================================== */

async function fetchPatrolReportData(
  factoryCode: string,
  reportDate: string
): Promise<PatrolReportItem[]> {

  try {

    const response = await api.get<
      PatrolReportItem[] | WrappedResponse
    >(
      "/report/download",
      {
        params: {
          factory_code: factoryCode,
          report_date: reportDate,
        },
      }
    );

    const result = response.data;

    if (Array.isArray(result)) {
      return result;
    }

    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }

    console.error("Unexpected patrol report response:", result);
    return [];

  } catch (err) {

    const error = err as AxiosError<any>;

    console.error(
      "Error fetching patrol report:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      "Unable to fetch patrol report"
    );
  }
}

/* =====================================================
   EXPORT 1: Used by report-download/page.tsx
===================================================== */

export async function getPatrolReport(
  factoryCode: string,
  reportDate: string
): Promise<PatrolReportItem[]> {
  return fetchPatrolReportData(factoryCode, reportDate);
}

/* =====================================================
   EXPORT 2: Used by PDF UI
===================================================== */

export async function getPatrolReportPDF(
  factoryCode: string,
  reportDate: string
): Promise<PatrolReportResponse> {

  const items = await fetchPatrolReportData(factoryCode, reportDate);

  return {
    factory_code: factoryCode,
    report_date: reportDate,
    items,
  };
}
