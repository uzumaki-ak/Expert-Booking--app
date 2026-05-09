import { useEffect } from "react";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  style?: StyleProp<ViewStyle>;
}

export const FadeIn = ({ children, delay = 0, duration = 700, y = 30, style }: FadeInProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(y);

  useEffect(() => {
    const easing = Easing.out(Easing.poly(4));

    opacity.value = 0;
    translateY.value = y;
    opacity.value = withDelay(delay, withTiming(1, { duration, easing }));
    translateY.value = withDelay(delay, withTiming(0, { duration, easing }));
  }, [delay, duration, opacity, translateY, y]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};
