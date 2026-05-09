// Mirror of backend types — keep aligned with backend src/types/index.ts

export type ExpertCategory =
  | "Tech"
  | "Finance"
  | "Health"
  | "Legal"
  | "Marketing"
  | "Other";

export type BookingStatus = "pending" | "confirmed" | "completed";

export interface ISlot {
  date: string;
  time: string;
  isBooked: boolean;
  _id?: string;
}

export interface Expert {
  _id: string;
  name: string;
  category: ExpertCategory;
  experience: number;
  rating: number;
  bio?: string;
  avatar?: string;
  availableSlots: ISlot[];
  createdAt: string;
  updatedAt: string;
}

export type ExpertListItem = Omit<Expert, "availableSlots"> & {
  availableSlots?: ISlot[];
};

export interface Booking {
  _id: string;
  expertId: string | { _id: string; name: string; category: ExpertCategory; avatar?: string };
  idempotencyKey: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationMeta;
}

export interface ServerToClientEvents {
  "slot:booked": (payload: { expertId: string; date: string; timeSlot: string }) => void;
}

export interface ClientToServerEvents {
  "join:expert": (expertId: string) => void;
  "leave:expert": (expertId: string) => void;
}

export interface CreateBookingPayload {
  expertId: string;
  idempotencyKey: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  notes?: string;
}
