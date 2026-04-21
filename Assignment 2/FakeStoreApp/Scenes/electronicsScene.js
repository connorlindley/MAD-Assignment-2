import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ElectronicScene() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesHeaderText}>Categories</Text>
      </View>

      {/* Categories Row */}
      <View style={styles.categoriesRow}>
        <TouchableOpacity
          style={styles.categoryBox}
          onPress={() => navigation.navigate("Electronic")}
        >
          <Text style={styles.categoryText}>Electronics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryBox}>
          <Text style={styles.categoryText}>Jewelry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryBox}>
          <Text style={styles.categoryText}>Men's Clothing</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryBox}>
          <Text style={styles.categoryText}>Women's Clothing</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    flexWrap: "wrap",
  },

  categoryBox: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    margin: 5,
    alignItems: "center",
  },

  categoryText: {
    fontSize: 16,
  },
});
