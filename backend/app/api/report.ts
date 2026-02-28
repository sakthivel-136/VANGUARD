import axios, { AxiosError } from "axios";

// -----------------------------
// Types
// -----------------------------
export interface PatrolReportItem {
  qr_name: string;
  round: number;
  scan_time: string | null;

  lat: string | null;
  lon: string | null;

  guard_name: string | null;

  // ✅ Added PENDING
  status: "SUCCESS" | "MISSED" | "PENDING";
}


// Optional wrapped response
interface WrappedResponse {
  success?: boolean;
  data?: PatrolReportItem[];
  message?: string;
}


// -----------------------------
// API Config
// -----------------------------
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";


// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});


// -----------------------------
// API Function
// -----------------------------
export async function getPatrolReport(
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


    // Case 1: Direct array
    if (Array.isArray(result)) {
      return result;
    }


    // Case 2: Wrapped response
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }


    console.error("❌ Unexpected patrol report response:", result);

    return [];

  } catch (err) {

    const error = err as AxiosError<any>;

    console.error(
      "❌ Error fetching patrol report:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      "Unable to fetch patrol report"
    );
  }
}
