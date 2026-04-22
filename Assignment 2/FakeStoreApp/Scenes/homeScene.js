import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const BASE_URL = "http://10.0.0.63:3000";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/products/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatText = (text) => {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#000000"
          justifyContent="center"
          alignItems="center"
          marginTop="50%"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesHeaderText}>Categories</Text>
      </View>

      {/* Dynamic Categories */}
      <View style={styles.categoriesRow}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.categoryBox}
            onPress={() => navigation.navigate("ProductListing", { category })}
          >
            <Text style={styles.categoryText}>{formatText(category)}</Text>
          </TouchableOpacity>
        ))}
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
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
    height: "80%",
  },

  categoryBox: {
    backgroundColor: "#000000",
    padding: 12,
    borderRadius: 8,
    margin: 5,
    alignItems: "center",
    height: "15%",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  categoryText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
