// Expert detail — parallax hero photo + bio + live slot grid
// Reanimated drives the scroll-scrubbed scale/y; never touches the JS thread

import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useExpertSlots } from "@/hooks/useExpertSlots";
import { ExpertHero } from "@/components/booking/ExpertHero";
import { SlotGrid } from "@/components/booking/SlotGrid";
import { Skeleton } from "@/components/ui/Skeleton";
import { MStripe } from "@/components/ui/MStripe";
import { HapticPressable } from "@/components/ui/HapticPressable";
import { FadeIn } from "@/components/animation/FadeIn";
import { colors } from "@/lib/tokens";

const { height: H } = Dimensions.get("window");
const HERO_H = Math.round(H * 0.55);

export default function ExpertDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError, error } = useExpertSlots(id);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  // Parallax: photo drifts down at 0.4x scroll, scales up when overscrolled
  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: scrollY.value * 0.4 },
      {
        scale: interpolate(
          scrollY.value,
          [-150, 0, HERO_H],
          [1.18, 1, 1.05],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const headerOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HERO_H - 120, HERO_H - 40], [0, 1], Extrapolation.CLAMP),
  }));

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.canvas }}>
        <Skeleton height={HERO_H} />
        <View style={{ padding: 24, gap: 12 }}>
          <Skeleton height={12} width={140} />
          <Skeleton height={36} width="80%" />
          <Skeleton height={14} width="60%" />
        </View>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorEyebrow}>ERROR</Text>
        <Text style={styles.errorMessage}>{error?.message ?? "Expert not found"}</Text>
        <HapticPressable onPress={() => router.back()} style={{ marginTop: 24 }}>
          <Text style={styles.backLink}>← BACK TO EXPERTS</Text>
        </HapticPressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      {/* Floating header that fades in on scroll */}
      <Animated.View style={[styles.floatingHeader, headerOpacity]}>
        <HapticPressable onPress={() => router.back()} hapticStyle="select">
          <Ionicons name="chevron-back" size={28} color={colors.onDark} />
        </HapticPressable>
        <Text style={styles.floatingHeaderTitle} numberOfLines={1}>
          {data.name}
        </Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* HERO */}
        <Animated.View style={[{ height: HERO_H }, heroStyle]}>
          <ExpertHero expert={data} />
        </Animated.View>

        {/* Back button overlay (visible while hero is on screen) */}
        <View style={styles.backButtonOverlay}>
          <HapticPressable
            onPress={() => router.back()}
            hapticStyle="select"
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color={colors.onDark} />
          </HapticPressable>
        </View>

        {/* BIO */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
          <FadeIn>
            <Text style={styles.eyebrow}>№ 003 — Profile</Text>
            {data.bio && <Text style={styles.bio}>{data.bio}</Text>}
          </FadeIn>

          <View style={styles.statsGrid}>
            <Stat label="Category" value={data.category} />
            <Stat label="Experience" value={`${data.experience} yrs`} />
            <Stat label="Rating" value={data.rating.toFixed(1)} />
            <Stat
              label="Open slots"
              value={String(data.availableSlots.filter((s) => !s.isBooked).length)}
            />
          </View>
        </View>

        <MStripe />

        {/* SLOTS */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
          <Text style={styles.eyebrow}>№ 004 — Availability</Text>
          <Text style={styles.sectionHeadline}>Book a session</Text>
          <Text style={styles.sectionSubline}>
            All times in UTC. Slots update in real time — if another user books a slot it
            disappears here instantly.
          </Text>

          <View style={{ marginTop: 32 }}>
            <SlotGrid expertId={data._id} slots={data.availableSlots} />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={{ width: "50%", paddingVertical: 12 }}>
    <Text
      style={{
        color: colors.muted,
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1.5,
        textTransform: "uppercase",
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        color: colors.onDark,
        fontSize: 22,
        fontWeight: "700",
        marginTop: 6,
      }}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 96,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.85)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    zIndex: 10,
  },
  floatingHeaderTitle: {
    color: colors.onDark,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    flex: 1,
  },
  backButtonOverlay: {
    position: "absolute",
    top: 48,
    left: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  bio: {
    color: colors.bodyStrong,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    marginTop: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  sectionHeadline: {
    color: colors.onDark,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    textTransform: "uppercase",
    marginTop: 8,
  },
  sectionSubline: {
    color: colors.body,
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 22,
    marginTop: 16,
    maxWidth: 320,
  },
  errorWrap: {
    flex: 1,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorEyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  errorMessage: {
    color: colors.onDark,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 16,
  },
  backLink: {
    color: colors.onDark,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});
