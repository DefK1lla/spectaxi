import { StyleSheet, Text, View } from "react-native";
import { APP_BRAND } from "../../model/brand";

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
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
});
