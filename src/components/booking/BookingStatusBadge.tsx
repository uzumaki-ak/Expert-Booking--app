// Status badge — outline only, color reflects state

import { Text, View } from "react-native";
import { colors } from "@/lib/tokens";
import type { BookingStatus } from "@/types";

const colorMap: Record<BookingStatus, string> = {
  pending: colors.onDark,
  confirmed: colors.mBlueLight,
  completed: colors.muted,
};

export const BookingStatusBadge = ({ status }: { status: BookingStatus }) => {
  const color = colorMap[status];
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: color,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color,
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        {status}
      </Text>
    </View>
  );
};
