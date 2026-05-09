// Booking modal — bottom-sheet form with summary card on top
// Validates the slot is still open before showing the form (handles stale deep-links)

import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useExpertSlots } from "@/hooks/useExpertSlots";
import { BookingForm } from "@/components/booking/BookingForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { MStripe } from "@/components/ui/MStripe";
import { Button } from "@/components/ui/Button";
import { HapticPressable } from "@/components/ui/HapticPressable";
import { FadeIn } from "@/components/animation/FadeIn";
import { colors } from "@/lib/tokens";

export default function BookingModal() {
  const { id, date, slot } = useLocalSearchParams<{
    id: string;
    date: string;
    slot: string;
  }>();
  const router = useRouter();
  const { data, isLoading } = useExpertSlots(id);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  useEffect(() => {
    if (!data || confirmedId) return;
    const exists = data.availableSlots.find(
      (s) => s.date === date && s.time === slot && !s.isBooked
    );
    if (!exists) {
      router.replace(`/expert/${data._id}`);
    }
  }, [data, date, slot, confirmedId, router]);

  if (isLoading || !data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }}>
        <View style={{ padding: 24, gap: 16 }}>
          <Skeleton height={20} width={160} />
          <Skeleton height={40} width="80%" />
          <Skeleton height={300} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }} edges={["top"]}>
      {/* Modal header */}
      <View style={styles.header}>
        <HapticPressable onPress={() => router.back()} hapticStyle="select">
          <Ionicons name="close" size={26} color={colors.onDark} />
        </HapticPressable>
        <Text style={styles.headerTitle}>BOOK SESSION</Text>
        <View style={{ width: 26 }} />
      </View>
      <MStripe />

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      >
        {confirmedId ? (
          <FadeIn duration={700}>
            <View style={styles.confirmedCard}>
              <View style={styles.confirmedRow}>
                <View style={styles.checkBox}>
                  <Ionicons name="checkmark" size={26} color={colors.canvas} />
                </View>
                <View>
                  <Text style={styles.eyebrow}>Status</Text>
                  <Text style={styles.confirmedHeadline}>Booking Confirmed</Text>
                </View>
              </View>

              <View style={{ marginTop: 32, gap: 16 }}>
                <View>
                  <Text style={styles.eyebrow}>Booking ID</Text>
                  <Text style={styles.bookingId}>{confirmedId}</Text>
                </View>
                <View>
                  <Text style={styles.eyebrow}>Schedule</Text>
                  <Text style={styles.scheduleText}>
                    {date} · {slot} UTC
                  </Text>
                </View>
                <View>
                  <Text style={styles.eyebrow}>Expert</Text>
                  <Text style={styles.scheduleText}>{data.name}</Text>
                </View>
              </View>

              <View style={{ marginTop: 40, gap: 12 }}>
                <Button
                  variant="primary"
                  size="lg"
                  onPress={() => {
                    router.dismissAll();
                    router.push("/bookings");
                  }}
                  fullWidth
                >
                  View My Bookings
                </Button>
                <Button
                  variant="hairline"
                  size="lg"
                  onPress={() => {
                    router.dismissAll();
                    router.push("/");
                  }}
                  fullWidth
                >
                  Browse More
                </Button>
              </View>
            </View>
          </FadeIn>
        ) : (
          <>
            {/* Summary card */}
            <View style={styles.summaryCard}>
              <Text style={styles.eyebrow}>Session</Text>
              <Text style={styles.summaryName}>{data.name}</Text>
              <Text style={styles.summaryCategory}>
                {data.category} · {data.experience} yrs xp
              </Text>

              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.eyebrow}>Date</Text>
                  <Text style={styles.summaryValue}>{date}</Text>
                </View>
                <View>
                  <Text style={styles.eyebrow}>Time</Text>
                  <Text style={styles.summaryTime}>{slot} UTC</Text>
                </View>
                <View>
                  <Text style={styles.eyebrow}>Rating</Text>
                  <Text style={styles.summaryValue}>★ {data.rating.toFixed(1)}</Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 32 }}>
              <BookingForm
                expert={data}
                date={date as string}
                timeSlot={slot as string}
                onSuccess={(bookingId) => setConfirmedId(bookingId)}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.canvas,
  },
  headerTitle: {
    color: colors.onDark,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: 24,
    gap: 8,
  },
  summaryName: {
    color: colors.onDark,
    fontSize: 28,
    fontWeight: "800",
    textTransform: "uppercase",
    marginTop: 8,
  },
  summaryCategory: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  summaryValue: {
    color: colors.onDark,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
    textTransform: "uppercase",
  },
  summaryTime: {
    color: colors.onDark,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  confirmedCard: {
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: 28,
  },
  confirmedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  checkBox: {
    width: 48,
    height: 48,
    backgroundColor: colors.onDark,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmedHeadline: {
    color: colors.onDark,
    fontSize: 22,
    fontWeight: "800",
    textTransform: "uppercase",
    marginTop: 4,
  },
  bookingId: {
    color: colors.onDark,
    fontSize: 12,
    fontFamily: "monospace",
    marginTop: 6,
  },
  scheduleText: {
    color: colors.onDark,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },
});
