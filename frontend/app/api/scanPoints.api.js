import axiosClient from "./axiosClient";

/* ==============================
   Scan Points API
============================== */

/* GET scan points by factory */
export const getScanPointsByFactory = async (factoryId) => {
  try {
    const response = await axiosClient.get(`/scan-points`, {
      params: { factory_id: factoryId },
    });
    // Supabase usually returns data directly
    return response.data;
  } catch (error) {
    console.error("Failed to get scan points by factory:", error);
    throw error;
  }
};

/* GET scan point by ID */
export const getScanPointById = async (id) => {
  try {
    const response = await axiosClient.get(`/scan-points/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get scan point ${id}:`, error);
    throw error;
  }
};

/* CREATE scan point */
export const createScanPoint = async (data) => {
  try {
    const response = await axiosClient.post(`/scan-points`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to create scan point:", error);
    throw error;
  }
};

/* UPDATE scan point */
export const updateScanPoint = async (id, data) => {
  try {
    const response = await axiosClient.put(`/scan-points/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Failed to update scan point ${id}:`, error);
    throw error;
  }
};

/* DELETE scan point */
export const deleteScanPoint = async (id) => {
  try {
    const response = await axiosClient.delete(`/scan-points/${id}`);
    return response.data; // Supabase returns an empty array for deletes
  } catch (error) {
    console.error(`Failed to delete scan point ${id}:`, error);
    throw error;
  }
};
