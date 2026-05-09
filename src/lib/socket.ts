// Socket.io client singleton — websocket-only on mobile (polling is unreliable on flaky cell networks)

import { io, type Socket } from "socket.io-client";
import { env } from "./env";
import type { ClientToServerEvents, ServerToClientEvents } from "@/types";

type Sock = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: Sock | null = null;

export const getSocket = (): Sock => {
  if (socket) return socket;
  socket = io(env.SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: Infinity,
  });
  return socket;
};
