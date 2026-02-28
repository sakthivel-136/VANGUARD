import axiosClient from "./axiosClient";

// ----------------- QR Data -----------------
export interface QRData {
  qr_id: number;
  qr_name: string;
  lat: number;
  lon: number;
  factory_code: string;
  status?: string;
  created_at?: string;
  waiting_time?: number; // ✅ ADDED
}

// ----------------- Factory Data -----------------
export interface Factory {
  factory_code: string;
  factory_name: string;
}

// ----------------- CREATE QR -----------------
export const createQR = async (data: QRData): Promise<QRData> => {
  const res = await axiosClient.post("/qr/", data);
  return res.data; // Expects Object
};

// ----------------- GET QR BY FACTORY -----------------
export const fetchQRByFactory = async (factoryCode: string): Promise<QRData[]> => {
  const res = await axiosClient.get(`/qr/factory/${factoryCode}`);
  return res.data;
};

// ----------------- UPDATE QR -----------------
export const updateQR = async (qrId: number, data: Partial<QRData>): Promise<QRData> => {
  const res = await axiosClient.put(`/qr/${qrId}`, data);
  return res.data[0]; // Expects Array
};

// ----------------- DELETE QR -----------------
export const deleteQR = async (qrId: number): Promise<void> => {
  await axiosClient.delete(`/qr/${qrId}`);
};

// ----------------- FETCH FACTORIES -----------------
export const fetchFactories = async (): Promise<Factory[]> => {
  const res = await axiosClient.get("/factories");
  return res.data;
};