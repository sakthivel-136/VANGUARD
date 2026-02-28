import axiosClient from "./axiosClient";
import { AxiosResponse } from "axios";
import { SecurityUser } from "@/app/types/securityUser";

/* ================= GET ================= */

export const getSecurityUsers = async (): Promise<SecurityUser[]> => {
  const response: AxiosResponse<SecurityUser[]> =
    await axiosClient.get("/security-users");

  return response.data;
};

/* ================= CREATE ================= */

export const createSecurityUser = async (
  data: Partial<SecurityUser>
): Promise<SecurityUser> => {
  const response: AxiosResponse<SecurityUser> =
    await axiosClient.post("/security-users", data);

  return response.data;
};

/* ================= UPDATE ================= */

export const updateSecurityUser = async (
  id: string,   // ✅ FIXED HERE
  data: Partial<SecurityUser>
): Promise<SecurityUser> => {
  const response: AxiosResponse<SecurityUser> =
    await axiosClient.put(`/security-users/${id}`, data);

  return response.data;
};

/* ================= DELETE ================= */

export const deleteSecurityUser = async (
  id: string   // ✅ FIXED HERE
): Promise<void> => {
  await axiosClient.delete(`/security-users/${id}`);
};
