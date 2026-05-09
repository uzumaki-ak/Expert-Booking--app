// Slot tile — animated state transitions via Reanimated worklet
// On `isBooked` flipping true (live socket event), the border tweens through M-red briefly

import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { HapticPressable } from "@/components/ui/HapticPressable";
import { colors } from "@/lib/tokens";
import type { ISlot } from "@/types";

interface SlotTileProps {
  slot: ISlot;
  onPress: () => void;
}

export const SlotTile = ({ slot, onPress }: SlotTileProps) => {
  // Drive the border + background colors through an interpolated shared value
  // 0 = available, 1 = flashed (M-red), 2 = booked steady
  const state = useSharedValue(slot.isBooked ? 2 : 0);

  useEffect(() => {
    if (slot.isBooked && state.value === 0) {
      // Live transition — flash to M-red, then settle into the booked state
      state.value = withSequence(
        withTiming(1, { duration: 150 }),
        withDelay(280, withTiming(2, { duration: 600 }))
      );
    } else if (slot.isBooked) {
      state.value = 2;
    } else {
      state.value = 0;
    }
  }, [slot.isBooked, state]);

  const animatedStyle = useAnimatedStyle(() => {
    const s = state.value;
    let borderColor: string = colors.hairline;
    let backgroundColor: string = "transparent";
    if (s >= 0.99 && s < 1.5) {
      borderColor = colors.mRed;
    } else if (s >= 1.5) {
      borderColor = colors.hairlineStrong;
      backgroundColor = colors.surfaceElevated;
    }
    return { borderColor, backgroundColor };
  });

  return (
    <Animated.View style={[{ borderWidth: 1, height: 80, flex: 1 }, animatedStyle]}>
      <HapticPressable
        onPress={slot.isBooked ? undefined : onPress}
        hapticStyle={slot.isBooked ? "none" : "select"}
        scaleTo={slot.isBooked ? 1 : 0.94}
        disabled={slot.isBooked}
        style={{ flex: 1, padding: 12, justifyContent: "space-between" }}
      >
        <Text
          style={{
            color: colors.muted,
            fontSize: 10,
            fontWeight: "700",
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {slot.isBooked ? "Booked" : "Open"}
        </Text>
        <Text
          style={{
            color: slot.isBooked ? colors.muted : colors.onDark,
            fontSize: 22,
            fontWeight: "700",
            letterSpacing: 0.5,
            fontVariant: ["tabular-nums"],
            textDecorationLine: slot.isBooked ? "line-through" : "none",
          }}
        >
          {slot.time}
        </Text>
      </HapticPressable>
    </Animated.View>
  );
};
