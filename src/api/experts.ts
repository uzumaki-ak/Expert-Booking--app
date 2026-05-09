import { api, unwrap } from "./client";
import type { ApiResponse, Expert, ExpertCategory, ExpertListItem, PaginationMeta } from "@/types";

export interface ListExpertsParams {
  page?: number;
  limit?: number;
  category?: ExpertCategory;
  search?: string;
}

export interface ListExpertsResult {
  data: ExpertListItem[];
  pagination: PaginationMeta;
}

export const listExperts = async (params: ListExpertsParams = {}): Promise<ListExpertsResult> => {
  const res = await api.get<ApiResponse<ExpertListItem[]>>("/experts", { params });
  return {
    data: res.data.data ?? [],
    pagination:
      res.data.pagination ?? {
        total: 0,
        page: 1,
        limit: params.limit ?? 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
  };
};

export const getExpert = async (id: string): Promise<Expert> => {
  const res = await api.get<ApiResponse<Expert>>(`/experts/${id}`);
  return unwrap(res.data);
};
