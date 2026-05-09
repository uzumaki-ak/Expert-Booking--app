// Detail-screen hero — full-bleed photo with name, category and rating overlaid

import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { MStripe } from "@/components/ui/MStripe";
import { colors } from "@/lib/tokens";
import type { Expert } from "@/types";

export const ExpertHero = ({ expert }: { expert: Expert }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      {expert.avatar && (
        <Image
          source={{ uri: expert.avatar }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={500}
        />
      )}
      <View style={styles.content}>
        <Text style={styles.eyebrow}>
          {expert.category} · {expert.experience} years experience
        </Text>
        <Text style={styles.name}>{expert.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>★ {expert.rating.toFixed(1)} / 5.0</Text>
          <View style={styles.metaSep} />
          <Text style={styles.metaItem}>
            {expert.availableSlots.filter((s) => !s.isBooked).length} OPEN
          </Text>
        </View>
      </View>

      <MStripe style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 28,
  },
  eyebrow: {
    color: colors.body,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 16,
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  name: {
    color: colors.onDark,
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 46,
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 16,
  },
  metaItem: {
    color: colors.onDark,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  metaSep: {
    width: 1,
    height: 14,
    backgroundColor: colors.hairline,
  },
});
