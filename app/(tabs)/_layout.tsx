import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { LiquidTabBar } from "@/components/navigation/LiquidTabBar";
import { colors } from "@/lib/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <LiquidTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.onDark,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.body,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "compass" : "compass-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
