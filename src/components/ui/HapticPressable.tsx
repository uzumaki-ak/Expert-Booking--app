// Pressable that triggers a light haptic on every tap and a small scale spring on press
// Use everywhere a user touches something — gives the app native-feel weight

import { Pressable, type PressableProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { haptics } from "@/hooks/useHaptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HapticPressableProps extends PressableProps {
  hapticStyle?: "select" | "press" | "press_medium" | "none";
  scaleTo?: number;
  className?: string;
}

export const HapticPressable = ({
  hapticStyle = "press",
  scaleTo = 0.96,
  onPressIn,
  onPressOut,
  children,
  style,
  ...rest
}: HapticPressableProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, { damping: 18, stiffness: 320 });
        if (hapticStyle !== "none") haptics[hapticStyle]();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 16, stiffness: 240 });
        onPressOut?.(e);
      }}
      style={[animatedStyle, style as never]}
      {...rest}
    >
      {children as never}
    </AnimatedPressable>
  );
};
