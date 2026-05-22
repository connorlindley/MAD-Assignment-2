import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity, clearCart } from "../store/cartSlice";
import { addOrder } from "../store/ordersSlice";
import { BASE_URL } from "../constants";

export default function CheckoutScene() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    Alert.alert(
      "Confirm Order",
      `Place order for ${totalQuantity} item(s) totalling $${totalCost.toFixed(2)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Check Out",
          onPress: () => {
            dispatch(
              addOrder({
                id: `ORD-${Date.now().toString().slice(-6)}`,
                items: items.map((i) => ({ ...i })),
                totalQuantity,
                totalCost,
                status: "new",
                createdAt: Date.now(),
              })
            );
            dispatch(clearCart());
            Alert.alert("Order Placed", "Your order has been created successfully!");
          },
        },
      ]
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your shopping cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Items: {totalQuantity}</Text>
        <Text style={styles.summaryText}>Total: ${totalCost.toFixed(2)}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: BASE_URL + item.image }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => dispatch(decreaseQuantity(item.id))}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => dispatch(increaseQuantity(item.id))}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Check Out */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Check Out</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#000",
    margin: 10,
    borderRadius: 10,
  },
  summaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  card: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  info: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: "green",
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    backgroundColor: "#000",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  qtyButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  checkoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  checkoutButton: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
