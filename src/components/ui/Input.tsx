// Input — 56px tall, 0px corners, hairline border, focus thickens to 2px white
// Pairs with react-hook-form via the `Controller` API in the form file

import { forwardRef, useState } from "react";
import { TextInput, View, Text, type TextInputProps, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "@/lib/tokens";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, onFocus, onBlur, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);
    const borderColor = error
      ? colors.mRed
      : focused
        ? colors.onDark
        : colors.hairline;
    const borderWidth = focused ? 2 : 1;

    return (
      <View className="gap-2" style={containerStyle}>
        {label && (
          <Text
            className="text-body-strong"
            style={{
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.muted}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            height: 56,
            borderColor,
            borderWidth,
            paddingHorizontal: 16,
            color: colors.onDark,
            fontSize: 15,
            fontWeight: "300",
            backgroundColor: "transparent",
          }}
          {...rest}
        />
        {error && (
          <Text style={{ color: colors.mRed, fontSize: 12, fontWeight: "300" }}>{error}</Text>
        )}
      </View>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<TextInput, TextareaProps>(
  ({ label, error, onFocus, onBlur, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);
    const borderColor = error
      ? colors.mRed
      : focused
        ? colors.onDark
        : colors.hairline;
    const borderWidth = focused ? 2 : 1;

    return (
      <View className="gap-2">
        {label && (
          <Text
            className="text-body-strong"
            style={{
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={colors.muted}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            minHeight: 120,
            borderColor,
            borderWidth,
            padding: 16,
            color: colors.onDark,
            fontSize: 15,
            fontWeight: "300",
            backgroundColor: "transparent",
          }}
          {...rest}
        />
        {error && (
          <Text style={{ color: colors.mRed, fontSize: 12, fontWeight: "300" }}>{error}</Text>
        )}
      </View>
    );
  }
);
Textarea.displayName = "Textarea";
