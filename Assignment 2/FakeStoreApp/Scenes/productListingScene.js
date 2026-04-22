import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";

const BASE_URL = "http://10.0.0.63:3000";

export default function ProductListingScene({ route }) {
  const navigation = useNavigation();
  const { category } = route.params;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/products/category/${category}`);

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesHeaderText}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </View>

        {/* Products List */}
        <View style={styles.categoriesRow}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {products.map((item) => (
              <View key={item.id} style={styles.card}>
                <Image
                  source={{ uri: BASE_URL + item.image }}
                  style={styles.image}
                />

                <Text style={styles.title}>{item.title}</Text>

                <Text style={styles.price}>${item.price}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

  // Product area
  categoriesRow: {
    flex: 1,
    padding: 15,
    marginBottom: 70,
    marginRight: 20,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "#000000",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    alignItems: "center",
  },

  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  price: {
    fontSize: 16,
    color: "green",
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
