// My Bookings — email gate, persisted via AsyncStorage
// Pull-to-refresh re-fetches the list

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { listBookingsByEmail } from "@/api/bookings";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { MStripe } from "@/components/ui/MStripe";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { FadeIn } from "@/components/animation/FadeIn";
import { HapticPressable } from "@/components/ui/HapticPressable";
import { usePersistedEmail } from "@/hooks/usePersistedEmail";
import { colors } from "@/lib/tokens";

export default function BookingsScreen() {
  const { email: persistedEmail, setEmail, loaded } = usePersistedEmail();
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    if (loaded && persistedEmail) {
      setDraft(persistedEmail);
      setSubmitted(persistedEmail);
    }
  }, [loaded, persistedEmail]);

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery({
    queryKey: ["bookings", submitted],
    queryFn: () => listBookingsByEmail(submitted!),
    enabled: Boolean(submitted),
  });

  const handleSubmit = () => {
    const trimmed = draft.trim().toLowerCase();
    if (!trimmed) return;
    setEmail(trimmed);
    setSubmitted(trimmed);
  };

  const handleChangeEmail = () => {
    setEmail(null);
    setSubmitted(null);
    setDraft("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          submitted ? (
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={() => refetch()}
              tintColor={colors.onDark}
            />
          ) : undefined
        }
      >
        <FadeIn>
          <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
            <Text style={styles.eyebrow}>№ 006 — Account</Text>
            <Text style={styles.h1}>My Bookings.</Text>
            <Text style={styles.subline}>
              No sign-up. Enter the email you used at booking — we surface every session
              against it.
            </Text>
          </View>
        </FadeIn>

        <MStripe style={{ marginVertical: 32, marginHorizontal: 24 }} />

        <View style={{ paddingHorizontal: 24, gap: 16 }}>
          <Input
            label="Email"
            value={draft}
            onChangeText={setDraft}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button
              variant="primary"
              size="md"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
            >
              Load Bookings
            </Button>
          </View>
          {submitted && (
            <HapticPressable onPress={handleChangeEmail} hapticStyle="select" style={{ paddingVertical: 8 }}>
              <Text style={styles.changeEmailLink}>← CHANGE EMAIL</Text>
            </HapticPressable>
          )}
        </View>

        {submitted && (
          <View style={{ marginTop: 40, paddingHorizontal: 24 }}>
            {isLoading ? (
              <View style={{ gap: 12 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} height={120} />
                ))}
              </View>
            ) : isError ? (
              <View style={{ borderWidth: 1, borderColor: colors.mRed, padding: 16 }}>
                <Text style={{ color: colors.mRed }}>{error?.message}</Text>
              </View>
            ) : (data?.length ?? 0) === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyHeadline}>No bookings yet</Text>
                <Text style={styles.emptySubline}>
                  Browse experts and book a session — they'll appear here.
                </Text>
              </View>
            ) : (
              <View style={{ borderTopWidth: 1, borderTopColor: colors.hairline }}>
                {data?.map((booking, i) => {
                  const expertObj =
                    typeof booking.expertId === "object" ? booking.expertId : null;
                  return (
                    <FadeIn key={booking._id} delay={i * 60} duration={600}>
                      <View style={styles.bookingRow}>
                        <View style={{ flex: 1, gap: 6 }}>
                          <Text style={styles.bookingCategory}>
                            {expertObj?.category ?? "EXPERT"}
                          </Text>
                          <Text style={styles.bookingName}>
                            {expertObj?.name ?? "Expert"}
                          </Text>
                          {booking.notes && (
                            <Text style={styles.bookingNotes} numberOfLines={2}>
                              {booking.notes}
                            </Text>
                          )}
                        </View>
                        <View style={{ gap: 6, alignItems: "flex-end" }}>
                          <Text style={styles.bookingTime}>
                            {booking.timeSlot}
                            <Text style={{ color: colors.muted }}> UTC</Text>
                          </Text>
                          <Text style={styles.bookingDate}>{booking.date}</Text>
                          <BookingStatusBadge status={booking.status} />
                        </View>
                      </View>
                    </FadeIn>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  h1: {
    color: colors.onDark,
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: -1,
    textTransform: "uppercase",
    marginTop: 12,
  },
  subline: {
    color: colors.body,
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 20,
    marginTop: 16,
    maxWidth: 320,
  },
  changeEmailLink: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  empty: {
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyHeadline: {
    color: colors.onDark,
    fontSize: 22,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  emptySubline: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "300",
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  bookingRow: {
    flexDirection: "row",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    gap: 16,
  },
  bookingCategory: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  bookingName: {
    color: colors.onDark,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  bookingNotes: {
    color: colors.body,
    fontSize: 13,
    fontWeight: "300",
    marginTop: 4,
  },
  bookingTime: {
    color: colors.onDark,
    fontSize: 18,
    fontWeight: "700",
  },
  bookingDate: {
    color: colors.body,
    fontSize: 12,
    fontFamily: "monospace",
  },
});
