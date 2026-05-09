// Button — outline-first, sharp corners, label-uppercase
// Same variant taxonomy as web

import { Text, View, ActivityIndicator, type StyleProp, type ViewStyle } from "react-native";
import { HapticPressable } from "./HapticPressable";
import { colors } from "@/lib/tokens";

type Variant = "primary" | "outline" | "hairline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<
  Variant,
  { container: string; text: string }
> = {
  primary: {
    container: "bg-white border border-white",
    text: "text-black",
  },
  outline: {
    container: "bg-transparent border border-white",
    text: "text-white",
  },
  hairline: {
    container: "bg-transparent border border-hairline",
    text: "text-white",
  },
  ghost: {
    container: "bg-transparent",
    text: "text-white",
  },
};

const sizeStyles: Record<Size, { container: string; fontSize: number }> = {
  sm: { container: "h-10 px-4", fontSize: 11 },
  md: { container: "h-12 px-6", fontSize: 12 },
  lg: { container: "h-14 px-8", fontSize: 13 },
};

interface ButtonProps {
  children: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  onPress,
  variant = "outline",
  size = "md",
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
}: ButtonProps) => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const inactive = disabled || loading;

  return (
    <HapticPressable
      onPress={inactive ? undefined : onPress}
      hapticStyle={inactive ? "none" : "press"}
      style={[{ opacity: inactive ? 0.5 : 1 }, style]}
      className={`flex-row items-center justify-center ${s.container} ${v.container} ${fullWidth ? "w-full" : ""}`}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.canvas : colors.onDark}
          size="small"
        />
      ) : (
        <Text
          className={`${v.text} font-bold uppercase`}
          style={{ fontSize: s.fontSize, letterSpacing: 1.5 }}
        >
          {children}
        </Text>
      )}
      {loading && (
        <View
          className="absolute bottom-0 left-0 h-[2px] w-full"
          style={{ backgroundColor: colors.mBlueLight }}
        />
      )}
    </HapticPressable>
  );
};
