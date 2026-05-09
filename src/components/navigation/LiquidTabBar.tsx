import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { useEffect } from "react";
import { Platform, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { HapticPressable } from "@/components/ui/HapticPressable";
import { MStripe } from "@/components/ui/MStripe";
import { colors } from "@/lib/tokens";

const BAR_HEIGHT = 72;
const BAR_HORIZONTAL_MARGIN = 18;
const MAX_BAR_WIDTH = 430;
const ACTIVE_INSET = 6;

export const LiquidTabBar = ({ state, descriptors, navigation, insets }: BottomTabBarProps) => {
  const { width } = useWindowDimensions();
  const bottomInset = Math.max(insets.bottom, 12);
  const barWidth = Math.min(width - BAR_HORIZONTAL_MARGIN * 2, MAX_BAR_WIDTH);
  const tabWidth = barWidth / state.routes.length;
  const activeX = useSharedValue(state.index * tabWidth);

  useEffect(() => {
    activeX.value = withTiming(state.index * tabWidth, {
      duration: 360,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeX, state.index, tabWidth]);

  const activeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeX.value }],
  }));

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { paddingBottom: bottomInset }]}>
      <View style={[styles.bar, { width: barWidth }]}>
        <BlurView
          experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
          intensity={82}
          tint="systemUltraThinMaterialDark"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.depthLayer} />
        <View style={styles.topHighlight} />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activeLens,
            {
              width: tabWidth - ACTIVE_INSET * 2,
              left: ACTIVE_INSET,
            },
            activeStyle,
          ]}
        >
          <View style={styles.activeLensFill} />
          <MStripe height={2} style={styles.activeStripe} />
        </Animated.View>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? colors.onDark : colors.body;
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <HapticPressable
              key={route.key}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityRole="tab"
              accessibilityState={focused ? { selected: true } : {}}
              hapticStyle="select"
              onLongPress={onLongPress}
              onPress={onPress}
              scaleTo={0.94}
              style={[styles.tab, { width: tabWidth }]}
              testID={options.tabBarButtonTestID}
            >
              <View style={styles.iconWrap}>
                {options.tabBarIcon?.({
                  color,
                  focused,
                  size: focused ? 23 : 21,
                })}
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  {
                    color,
                    opacity: focused ? 1 : 0.72,
                  },
                ]}
              >
                {label}
              </Text>
            </HapticPressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: BAR_HORIZONTAL_MARGIN,
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: 36,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(10,10,10,0.64)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.38,
    shadowRadius: 24,
    elevation: 18,
  },
  depthLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  topHighlight: {
    position: "absolute",
    left: 18,
    right: 18,
    top: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.36)",
  },
  activeLens: {
    position: "absolute",
    top: ACTIVE_INSET,
    bottom: ACTIVE_INSET,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.26)",
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  activeLensFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  activeStripe: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 9,
    borderRadius: 1,
    overflow: "hidden",
  },
  tab: {
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 4,
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
