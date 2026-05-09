// Root layout — providers + global theme + status bar
// Order matters: GestureHandlerRootView must wrap everything that uses gestures (bottom sheet, etc.)

import "../global.css";

import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Toaster } from "sonner-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { createQueryClient } from "@/lib/queryClient";
import { colors } from "@/lib/tokens";

const queryClient = createQueryClient();

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash once layout is ready (no fonts to load — Inter ships from system / Google)
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" backgroundColor={colors.canvas} translucent />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.canvas },
              animation: "fade",
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="expert/[id]" options={{ animation: "slide_from_right" }} />
            <Stack.Screen
              name="book/[id]"
              options={{ presentation: "modal", animation: "slide_from_bottom" }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <Toaster
            position="top-center"
            theme="dark"
            toastOptions={{
              style: {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.hairline,
                borderWidth: 1,
                borderRadius: 0,
              },
            }}
          />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
