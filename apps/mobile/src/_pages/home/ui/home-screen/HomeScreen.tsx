import { nativeLightTheme } from "@spectaxi/theme";
import { StyleSheet, Text, View } from "react-native";
import { APP_BRAND } from "../../model/brand";

const theme = nativeLightTheme;

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{APP_BRAND}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.color.bgCanvas,
    padding: theme.space[6],
  },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.semibold,
    color: theme.color.brand,
    fontFamily: theme.fontFamily.sans,
  },
});
