// Reanimated opacity-pulse shimmer — runs on the UI thread, never drops frames
// Simpler than a gradient and looks just as good on a black canvas

import { useEffect } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
  height?: number;
  width?: number | string;
}

export const Skeleton = ({ style, height = 16, width = "100%" }: SkeletonProps) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.85, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View
      style={[
        { height, width: width as number, backgroundColor: "#0d0d0d", overflow: "hidden" },
        style,
      ]}
    >
      <Animated.View
        style={[
          { flex: 1, backgroundColor: "rgba(255,255,255,0.05)" },
          animatedStyle,
        ]}
      />
    </View>
  );
};
