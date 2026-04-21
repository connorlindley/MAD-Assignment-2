import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
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
    backgroundColor: "#000000",
    alignItems: "center",
    marginTop: 40,
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
  },
  categoriesHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },

  // Row of categories
  categoriesRow: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 20,
    flexWrap: " column",
    borderColor: "#000000",
    borderWidth: 1,
    margin: 30,
    borderRadius: 10,
    height: "75%",
  },

  categoryBox: {
    backgroundColor: "#000000",
    padding: 12,
    borderRadius: 8,
    margin: 5,
    alignItems: "center",
    height: "15%",
    justifyContent: "space-around",
  },

  categoryText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
