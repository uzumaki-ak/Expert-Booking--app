// Expert card — 16:9 hero photo + uppercase name + rating row
// Tap → router push with haptic feedback

import { View, Text } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HapticPressable } from "@/components/ui/HapticPressable";
import { MStripe } from "@/components/ui/MStripe";
import { colors } from "@/lib/tokens";
import type { ExpertListItem } from "@/types";

interface ExpertCardProps {
  expert: ExpertListItem;
  index: number;
}

export const ExpertCard = ({ expert, index }: ExpertCardProps) => {
  const router = useRouter();

  return (
    <HapticPressable
      onPress={() => router.push(`/expert/${expert._id}`)}
      hapticStyle="press"
      scaleTo={0.97}
      className="bg-canvas border border-hairline mb-6 overflow-hidden"
    >
      {/* HERO IMAGE */}
      <View className="relative" style={{ aspectRatio: 16 / 10 }}>
        {expert.avatar ? (
          <Image
            source={{ uri: expert.avatar }}
            style={{ width: "100%", height: "100%" }}
            transition={400}
            contentFit="cover"
          />
        ) : (
          <View
            className="flex-1 items-center justify-center"
            style={{ backgroundColor: colors.surfaceCard }}
          >
            <Text style={{ color: colors.muted, fontSize: 11, letterSpacing: 1.5 }}>
              NO PHOTO
            </Text>
          </View>
        )}

        {/* Index marker */}
        <View className="absolute left-4 top-4">
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 2,
            }}
          >
            № {String(index + 1).padStart(2, "0")}
          </Text>
        </View>

      </View>

      {/* META */}
      <View className="p-5 gap-3">
        <Text
          style={{
            color: colors.muted,
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {expert.category}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: colors.onDark,
            fontSize: 22,
            fontWeight: "700",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {expert.name}
        </Text>
        <View className="flex-row items-center justify-between mt-1">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="star" size={13} color={colors.onDark} />
            <Text style={{ color: colors.onDark, fontSize: 13, fontVariant: ["tabular-nums"] }}>
              {expert.rating.toFixed(1)}
            </Text>
          </View>
          <Text
            style={{
              color: colors.muted,
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {expert.experience} yrs xp
          </Text>
        </View>
      </View>

      <MStripe />
    </HapticPressable>
  );
};
