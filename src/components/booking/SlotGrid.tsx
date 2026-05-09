// Slot picker — horizontal day strip + 2-column grid of SlotTiles
// Live updates flow in via the parent's useExpertSlots hook patching cache

import { useMemo, useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { HapticPressable } from "@/components/ui/HapticPressable";
import { SlotTile } from "./SlotTile";
import { colors } from "@/lib/tokens";
import type { ISlot } from "@/types";

interface SlotGridProps {
  expertId: string;
  slots: ISlot[];
}

const formatDay = (yyyyMMdd: string) => {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return {
    day: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }).toUpperCase(),
    date: date.toLocaleDateString("en-US", { day: "2-digit", timeZone: "UTC" }),
    full: date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
  };
};

export const SlotGrid = ({ expertId, slots }: SlotGridProps) => {
  const router = useRouter();

  const byDate = useMemo(() => {
    const map = new Map<string, ISlot[]>();
    for (const slot of slots) {
      if (!map.has(slot.date)) map.set(slot.date, []);
      map.get(slot.date)!.push(slot);
    }
    for (const list of map.values()) list.sort((a, b) => a.time.localeCompare(b.time));
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [slots]);

  const [active, setActive] = useState(byDate[0]?.[0] ?? "");

  useEffect(() => {
    if (!active && byDate.length > 0) setActive(byDate[0][0]);
  }, [byDate, active]);

  const activeSlots = byDate.find(([d]) => d === active)?.[1] ?? [];

  if (byDate.length === 0) {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.hairline,
          padding: 32,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.muted, letterSpacing: 1.5 }}>NO AVAILABILITY</Text>
      </View>
    );
  }

  return (
    <View>
      {/* DAY TABS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        style={{ borderBottomWidth: 1, borderBottomColor: colors.hairline }}
      >
        {byDate.map(([date]) => {
          const f = formatDay(date);
          const isActive = date === active;
          return (
            <HapticPressable
              key={date}
              onPress={() => setActive(date)}
              hapticStyle="select"
              scaleTo={0.97}
              style={{
                paddingVertical: 14,
                paddingRight: 28,
                position: "relative",
              }}
            >
              <Text
                style={{
                  color: isActive ? colors.onDark : colors.muted,
                  fontSize: 10,
                  fontWeight: "700",
                  letterSpacing: 1.5,
                }}
              >
                {f.day}
              </Text>
              <Text
                style={{
                  color: isActive ? colors.onDark : colors.muted,
                  fontSize: 22,
                  fontWeight: "700",
                  marginTop: 2,
                }}
              >
                {f.date}
              </Text>
              {isActive && (
                <View
                  style={{
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    right: 28,
                    height: 2,
                    backgroundColor: colors.onDark,
                  }}
                />
              )}
            </HapticPressable>
          );
        })}
      </ScrollView>

      {/* DAY HEADER */}
      <Text
        style={{
          color: colors.muted,
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        {active ? formatDay(active).full : ""} · UTC
      </Text>

      {/* GRID — 2 columns, gap via padding */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", margin: -4 }}>
        {activeSlots.map((slot) => (
          <View
            key={`${slot.date}-${slot.time}`}
            style={{ width: "50%", padding: 4 }}
          >
            <SlotTile
              slot={slot}
              onPress={() =>
                router.push({
                  pathname: "/book/[id]",
                  params: { id: expertId, date: slot.date, slot: slot.time },
                })
              }
            />
          </View>
        ))}
      </View>
    </View>
  );
};
