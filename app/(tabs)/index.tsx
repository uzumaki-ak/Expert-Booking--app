// Experts list — sticky search header + horizontal category chips + FlatList of cards
// Pull-to-refresh + pagination via "Load more" button (avoids reverse-infinite-scroll surprise)

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  RefreshControl,
  TextInput,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { listExperts } from "@/api/experts";
import { ExpertCard } from "@/components/booking/ExpertCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { MStripe } from "@/components/ui/MStripe";
import { Button } from "@/components/ui/Button";
import { HapticPressable } from "@/components/ui/HapticPressable";
import { FadeIn } from "@/components/animation/FadeIn";
import { colors } from "@/lib/tokens";
import type { ExpertCategory } from "@/types";

const CATEGORIES: (ExpertCategory | "All")[] = [
  "All",
  "Tech",
  "Finance",
  "Health",
  "Legal",
  "Marketing",
  "Other",
];

export default function ExpertsScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["experts", { page, category, search }],
    queryFn: () =>
      listExperts({
        page,
        limit: 9,
        category: category === "All" ? undefined : category,
        search: search || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>B</Text>
          </View>
          <Text style={styles.brandText}>BOOKR</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.indexText}>№ 001</Text>
        </View>
      </View>
      <MStripe />

      <FlatList
        data={data?.data ?? []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor={colors.onDark}
          />
        }
        ListHeaderComponent={
          <View>
            {/* HERO */}
            <FadeIn duration={900} y={40}>
              <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 }}>
                <Text style={styles.eyebrow}>EXPERT SESSIONS, ON DEMAND</Text>
                <Text style={styles.heroHeadline}>
                  BOOK{"\n"}THE PEOPLE{"\n"}WHO BUILT IT.
                </Text>
                <Text style={styles.heroSubLine}>
                  Verified operators across Tech, Finance, Health, Legal, Marketing.
                  Real-time slots. UTC, end-to-end.
                </Text>
              </View>
            </FadeIn>

            {/* SEARCH */}
            <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={16} color={colors.muted} />
                <TextInput
                  value={search}
                  onChangeText={(v) => {
                    setSearch(v);
                    setPage(1);
                  }}
                  placeholder="Search experts by name"
                  placeholderTextColor={colors.muted}
                  autoCapitalize="none"
                  style={styles.searchInput}
                />
              </View>
            </View>

            {/* CATEGORIES */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 8, gap: 24 }}
              style={{ marginBottom: 24 }}
            >
              {CATEGORIES.map((c) => {
                const isActive = category === c;
                return (
                  <HapticPressable
                    key={c}
                    onPress={() => {
                      setCategory(c);
                      setPage(1);
                    }}
                    hapticStyle="select"
                    scaleTo={0.94}
                    style={{ position: "relative", paddingVertical: 8 }}
                  >
                    <Text
                      style={{
                        color: isActive ? colors.onDark : colors.muted,
                        fontSize: 11,
                        fontWeight: "700",
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {c}
                    </Text>
                    {isActive && (
                      <View
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          backgroundColor: colors.onDark,
                        }}
                      />
                    )}
                  </HapticPressable>
                );
              })}
            </ScrollView>

            {/* SECTION HEADER */}
            <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
              <Text style={styles.sectionEyebrow}>№ 002</Text>
              <Text style={styles.sectionHeadline}>The Roster</Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: 24 }}>
            <FadeIn delay={index * 60} duration={600}>
              <ExpertCard expert={item} index={(page - 1) * 9 + index} />
            </FadeIn>
          </View>
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={{ paddingHorizontal: 24, gap: 24 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <View
                  key={i}
                  style={{ borderColor: colors.hairline, borderWidth: 1 }}
                >
                  <Skeleton height={200} />
                  <View style={{ padding: 20, gap: 8 }}>
                    <Skeleton height={10} width={80} />
                    <Skeleton height={20} width="70%" />
                    <Skeleton height={10} width={120} />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                marginHorizontal: 24,
                borderWidth: 1,
                borderColor: colors.hairline,
                paddingVertical: 60,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.onDark,
                  fontSize: 22,
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                No experts found
              </Text>
              <Text
                style={{
                  color: colors.muted,
                  marginTop: 12,
                  fontWeight: "300",
                  textAlign: "center",
                  paddingHorizontal: 24,
                }}
              >
                Try removing filters or adjusting your search term.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          data && data.pagination.totalPages > 1 ? (
            <View
              style={{
                marginTop: 32,
                marginHorizontal: 24,
                borderTopWidth: 1,
                borderTopColor: colors.hairline,
                paddingTop: 24,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                variant="hairline"
                size="md"
                disabled={!data.pagination.hasPrev}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <Text
                style={{
                  color: colors.muted,
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 1.5,
                }}
              >
                {data.pagination.page} / {data.pagination.totalPages}
              </Text>
              <Button
                variant="hairline"
                size="md"
                disabled={!data.pagination.hasNext}
                onPress={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: colors.canvas,
  },
  logoBox: {
    width: 28,
    height: 28,
    backgroundColor: colors.onDark,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: colors.canvas, fontSize: 14, fontWeight: "800" },
  brandText: {
    color: colors.onDark,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  indexText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  heroHeadline: {
    color: colors.onDark,
    fontSize: 44,
    fontWeight: "800",
    lineHeight: 46,
    letterSpacing: -1,
    textTransform: "uppercase",
    marginBottom: 24,
  },
  heroSubLine: {
    color: colors.body,
    fontSize: 15,
    fontWeight: "300",
    lineHeight: 22,
    maxWidth: 320,
  },
  searchBox: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.onDark,
    fontSize: 15,
    fontWeight: "300",
  },
  sectionEyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sectionHeadline: {
    color: colors.onDark,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    textTransform: "uppercase",
    marginTop: 8,
  },
});
