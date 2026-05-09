import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Button } from "@/components/ui/Button";
import { MStripe } from "@/components/ui/MStripe";
import { colors } from "@/lib/tokens";

export default function NotFound() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>ERROR 404</Text>
      <Text style={styles.headline}>Off the map.</Text>
      <Text style={styles.subline}>
        The page you tried to reach doesn't exist. Re-route below.
      </Text>
      <MStripe style={{ width: 180, marginVertical: 32 }} />
      <Link href="/" asChild>
        <View>
          <Button variant="primary" size="lg">
            Back to Experts
          </Button>
        </View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  headline: {
    color: colors.onDark,
    fontSize: 48,
    fontWeight: "800",
    textTransform: "uppercase",
    marginTop: 16,
    textAlign: "center",
  },
  subline: {
    color: colors.body,
    fontSize: 14,
    fontWeight: "300",
    textAlign: "center",
    marginTop: 16,
    maxWidth: 280,
  },
});
