import axiosClient from "@/app/api/axiosClient";

interface LoginPayload {
  user_id: string;
  user_pin: string;
}

export interface LoginResponse {
  access_token: string;
  role: string;
  name: string;
}

export const login = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await axiosClient.post("/auth/login", payload);
  return response.data;
};
