export interface ScanLog {

  qr_name: string;

  round: number;

  scan_time: string | null;

  lat?: string;
  lon?: string;

  guard_name?: string;

  status: "SUCCESS" | "MISSED";
}
