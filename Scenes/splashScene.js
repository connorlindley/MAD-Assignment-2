import { View, Text, Image, StyleSheet } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/splashscreen.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Fake Store</Text>
      <Text style={styles.subtitle}>Your one-stop shop</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#e94560",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#a8a8b3",
    marginTop: 8,
  },
});
