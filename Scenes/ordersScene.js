import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { updateOrderStatus } from "../store/ordersSlice";
import { BASE_URL } from "../constants";

const STATUS_SECTIONS = ["new", "paid", "delivered"];
const STATUS_LABELS = { new: "New Orders", paid: "Paid", delivered: "Delivered" };

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      // Call server to update cart/order status
      if (order.serverId) {
        const response = await fetch(`${BASE_URL}/carts/${order.serverId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: 1,
            date: new Date().toISOString().split("T")[0],
            products: order.items.map((i) => ({
              productId: i.id,
              quantity: i.quantity,
            })),
            status: newStatus,
          }),
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          Alert.alert("Error", data?.message || "Failed to update order. Please try again.");
          return;
        }
      }
    } catch {
      // Server unreachable — update locally and continue
    }

    dispatch(updateOrderStatus({ id: order.id, status: newStatus }));
    Alert.alert(
      "Order Updated",
      newStatus === "paid"
        ? "Payment confirmed! Your order is being prepared."
        : "Order received! Thank you for your purchase."
    );
    setLoading(false);
  };

  return (
    <View style={styles.card}>
      {/* Compact summary row — tap to expand */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded((v) => !v)}
      >
        <View style={styles.cardMeta}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderSub}>
            {order.totalQuantity} item{order.totalQuantity !== 1 ? "s" : ""}
            {"  ·  "}${order.totalCost.toFixed(2)}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#000"
        />
      </TouchableOpacity>

      {/* Expanded detail */}
      {expanded && (
        <>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image
                source={{ uri: BASE_URL + item.image }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              </View>
            </View>
          ))}

          {order.status === "new" && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, loading && styles.buttonDisabled]}
                onPress={() => handleStatusUpdate("paid")}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>Pay</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {order.status === "paid" && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, loading && styles.buttonDisabled]}
                onPress={() => handleStatusUpdate("delivered")}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>Receive</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}

export default function OrdersScreen() {
  const orders = useSelector((state) => state.orders.orders);

  const grouped = STATUS_SECTIONS.map((status) => ({
    status,
    data: orders.filter((o) => o.status === status),
  })).filter((section) => section.data.length > 0);

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Orders</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Orders</Text>
      </View>

      <FlatList
        data={grouped}
        keyExtractor={(section) => section.status}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: section }) => (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>
                {STATUS_LABELS[section.status]}
              </Text>
            </View>
            {section.data.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20, backgroundColor: "#f8f8f8", alignItems: "center" },
  headerText: { fontSize: 24, fontWeight: "bold" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#888" },
  listContent: { padding: 12 },
  sectionHeader: {
    backgroundColor: "#000000",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 8,
    marginTop: 4,
  },
  sectionHeaderText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  card: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
  },
  cardMeta: { flex: 1 },
  orderId: { fontWeight: "bold", fontSize: 15, marginBottom: 2 },
  orderSub: { fontSize: 13, color: "#555" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fafafa",
  },
  itemImage: { width: 55, height: 55, resizeMode: "contain", marginRight: 12 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 13, fontWeight: "bold", marginBottom: 4 },
  itemQty: { fontSize: 13, color: "#555" },
  actionRow: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fafafa",
  },
  actionButton: {
    backgroundColor: "#000000",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  actionButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
