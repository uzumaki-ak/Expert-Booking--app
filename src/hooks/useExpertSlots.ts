// Combines TanStack Query with Socket.io — mirrors web/useExpertSlots
// Adds haptic feedback when a slot you were viewing is taken by someone else

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { getExpert } from "@/api/experts";
import { useSocket } from "./useSocket";
import type { Expert } from "@/types";

export const useExpertSlots = (expertId: string | undefined) => {
  const qc = useQueryClient();
  const { socket } = useSocket();

  const query = useQuery({
    queryKey: ["expert", expertId],
    queryFn: () => getExpert(expertId!),
    enabled: Boolean(expertId),
  });

  useEffect(() => {
    if (!expertId) return;

    socket.emit("join:expert", expertId);

    const handler = (payload: { expertId: string; date: string; timeSlot: string }) => {
      if (payload.expertId !== expertId) return;
      qc.setQueryData<Expert | undefined>(["expert", expertId], (old) => {
        if (!old) return old;
        return {
          ...old,
          availableSlots: old.availableSlots.map((s) =>
            s.date === payload.date && s.time === payload.timeSlot
              ? { ...s, isBooked: true }
              : s
          ),
        };
      });
      // Tactile cue — someone just took a slot under your nose
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    };

    socket.on("slot:booked", handler);

    return () => {
      socket.emit("leave:expert", expertId);
      socket.off("slot:booked", handler);
    };
  }, [expertId, socket, qc]);

  return query;
};
