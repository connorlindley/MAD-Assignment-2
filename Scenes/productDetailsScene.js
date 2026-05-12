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
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { BASE_URL } from "../constants";

export default function ProductDetailsScene({ route }) {
  const navigation = useNavigation();
  const id = route?.params?.id;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [product, setProductDetails] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    // Dispatch to local Redux store first for instant UI feedback, then sync server
    dispatch(addToCart(product));
    try {
      const getResponse = await fetch(`${BASE_URL}/cart`);
      const currentCart = await getResponse.json();

      const existingProducts = currentCart.products ?? [];

      const existingItem = existingProducts.find(
        (p) => p.productId === product.id,
      );

      const updatedProducts = existingItem
        ? existingProducts.map((p) =>
            p.productId === product.id ? { ...p, quantity: p.quantity + 1 } : p,
          )
        : [...existingProducts, { productId: product.id, quantity: 1 }];

      await fetch(`${BASE_URL}/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentCart, products: updatedProducts }),
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/products/${id}`);
      const data = await response.json();
      setProductDetails(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !product) {
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
        <View style={styles.detailHeader}>
          <Text style={styles.detailHeaderText}>Product Details</Text>
        </View>

        {/* Product Details */}
        <Image
          source={{ uri: BASE_URL + product.image }}
          style={styles.productImage}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{product.title}</Text>
        </View>
        <View style={styles.productDetailsContainer}>
          <Text style={styles.productDetails}>Price: ${product.price.toFixed(2)}</Text>
          <Text style={styles.productDetails}>
            Count: {product.rating?.count}
          </Text>
          <Text style={styles.productDetails}>
            Rating: {product.rating?.rate}/5
          </Text>
        </View>
        {/* Back Button */}
        <View style={styles.buttonContainers}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={handleAddToCart}>
            <Ionicons name="cart" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.descriptionWrapper}>
          <Text style={styles.productDescTitle}>Description:</Text>

          <View style={styles.descriptionContainer}>
            <ScrollView>
              <Text style={styles.productDescription}>
                {product.description}
              </Text>
            </ScrollView>
          </View>
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
  detailHeader: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },

  detailHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  //Product Image

  productImage: {
    width: "70%",
    aspectRatio: 1,
    resizeMode: "contain",
    marginBottom: 10,
    alignSelf: "center",
  },

  // Title

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    margin: 5,
  },
  titleContainer: {
    marginBottom: 15,
    alignSelf: "center",
    width: "80%",
  },

  // Product Details
  productDetailsContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#000000",
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#000000",
  },
  productDetails: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    margin: 5,
    color: "#ffffff",
  },

  // Back Button

  buttonContainers: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },

  buttons: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 5,
  },

  buttonText: {
    color: "#ffffff",
    marginLeft: 5,
  },

  //Description Section
  descriptionContainer: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    backgroundColor: "#d3d3d3",
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  descriptionWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 5,
  },
  productDescTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 10,
    alignSelf: "flex-start",
  },
  productDescription: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "justify",
    margin: 5,
    marginLeft: 10,
  },
});
