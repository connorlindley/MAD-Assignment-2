import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ProfileScreen({ currentUser, onLogout, onUpdate }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const displayName = currentUser?.name || "Guest";
  const displayEmail = currentUser?.email || "—";

  const openModal = () => {
    setNewName(displayName);
    setNewPassword("");
    setModalVisible(true);
  };

  const handleConfirm = () => {
    if (!newName.trim()) {
      Alert.alert("Validation Error", "Name cannot be empty.");
      return;
    }
    onUpdate({ ...currentUser, name: newName.trim() });
    setModalVisible(false);
    Alert.alert("Success", "Your profile has been updated.");
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

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

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={openModal}>
          <Ionicons name="create-outline" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Update Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Update Profile</Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter your name"
              />

              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
              />

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  buttonRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 30,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    padding: 14,
    borderRadius: 5,
    gap: 6,
  },
  updateButton: {
    backgroundColor: "#000000",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000",
    overflow: "hidden",
  },
  modalHeader: {
    padding: 16,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
  },
  cancelButtonText: {
    color: "#000000",
  },
});
