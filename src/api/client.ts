// Axios client — same envelope contract as backend
// User-Agent helps backend logs distinguish mobile vs web traffic

import axios, { AxiosError, type AxiosInstance } from "axios";
import { env } from "@/lib/env";
import type { ApiResponse } from "@/types";

export const api: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15_000,
  headers: {
    "User-Agent": "ExpertBookingMobile/1.0",
  },
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiResponse>) => {
    const message =
      err.response?.data?.message ?? err.message ?? "Network error. Check your connection.";
    return Promise.reject(new Error(message));
  }
);

export const unwrap = <T>(payload: ApiResponse<T>): T => {
  if (!payload.success || payload.data === undefined) {
    throw new Error(payload.message ?? "Request failed");
  }
  return payload.data;
};
