import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ProfileScreen({ currentUser, onLogout }) {
  const displayName = currentUser?.name || "Guest";
  const displayEmail = currentUser?.email || "—";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={90} color="#000000" />
        <Text style={styles.name}>{displayName}</Text>
      </View>

      {/* Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Name</Text>
          <Text style={styles.detailValue}>{displayName}</Text>
        </View>
        <View style={[styles.detailRow, styles.detailRowLast]}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{displayEmail}</Text>
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ffffff" />
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  detailsContainer: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    marginHorizontal: 20,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  detailValue: {
    fontSize: 14,
    color: "#ffffff",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    padding: 14,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 30,
    gap: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
