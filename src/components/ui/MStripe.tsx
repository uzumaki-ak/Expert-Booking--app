// 4px M tricolor stripe — flex of three colored bars
// Use anywhere a divider needs the brand signature

import { View, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "@/lib/tokens";

interface MStripeProps {
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export const MStripe = ({ height = 4, style }: MStripeProps) => (
  <View style={[{ flexDirection: "row", height }, style]}>
    <View style={{ flex: 1, backgroundColor: colors.mBlueLight }} />
    <View style={{ flex: 1, backgroundColor: colors.mBlueDark }} />
    <View style={{ flex: 1, backgroundColor: colors.mRed }} />
  </View>
);
