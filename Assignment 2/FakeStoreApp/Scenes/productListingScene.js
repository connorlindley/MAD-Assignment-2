import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Gesture, ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ProductListingScene() {
  const navigation = useNavigation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesHeaderText}>Electronics</Text>
        </View>

        {/* Categories Row */}
        <View style={styles.categoriesRow}>
          <ScrollView>
            <View style={styles.itemBox}>
              <Text style={styles.testText}>Electronics</Text>
            </View>
          </ScrollView>
        </View>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="backspace" size={20} color="#ffffff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header
  categoriesHeader: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  categoriesHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  // Row of categories
  categoriesRow: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 20,
    flexWrap: " column",
    borderColor: "#000000",
    borderWidth: 1,
    margin: 20,
    height: "78%",
  },
  testText: {
    fontSize: 50,
    fontWeight: "bold",
  },

  // Back Button
  backButtonContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#ffffff",
    marginLeft: 5,
  },
});
