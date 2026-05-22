import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { BASE_URL } from "../constants";
import { store } from "../store/store";
import { registerLocalUser } from "../store/sessionSlice";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// ── Sign In Form ──────────────────────────────────────────────────────────────
function SignInForm({ onLogin, onSwitchToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    setEmail("");
    setPassword("");
  };

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password.");
      return;
    }

    const username = email.trim().split("@")[0];

    // Validate locally first — covers accounts created through the app
    const localUsers = store.getState().session?.localUsers ?? {};
    const localUser = localUsers[email.trim()];
    if (localUser) {
      if (localUser.password !== password.trim()) {
        Alert.alert("Sign In Failed", "Invalid email or password. Please try again.");
        return;
      }
      onLogin({ name: localUser.name, email: email.trim(), username });
      return;
    }

    // Not a locally registered user — try the server
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: password.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Sign In Failed", data?.message || "Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      onLogin({ name: username, email: email.trim(), username, token: data.token });
    } catch {
      // Server unreachable and not locally registered
      Alert.alert("Sign In Failed", "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sign in with your email and password</Text>
      </View>

      <View style={styles.fields}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClear}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.clearButtonText]}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onSwitchToSignUp} style={styles.hintContainer}>
          <Text style={styles.hintText}>
            Don't have an account?{" "}
            <Text style={styles.hintLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Sign Up Form ──────────────────────────────────────────────────────────────
function SignUpForm({ onLogin, onSwitchToSignIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your name.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Validation Error", "Please enter a password.");
      return;
    }

    const [firstname, ...rest] = name.trim().split(" ");
    const lastname = rest.join(" ") || "";
    const username = email.trim().split("@")[0];

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          username,
          password: password.trim(),
          name: { firstname, lastname },
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        // Server reachable but rejected the data — show the validation error
        const message = data?.message || data?.error || "Registration failed. Please try again.";
        Alert.alert("Sign Up Failed", message);
        setLoading(false);
        return;
      }

      // Server accepted — save credentials locally and use server-assigned ID
      store.dispatch(registerLocalUser({ email: email.trim(), password: password.trim(), name: name.trim() }));
      Alert.alert("Welcome!", "Your account has been created.", [
        {
          text: "Continue",
          onPress: () =>
            onLogin({ id: data.id, name: name.trim(), email: email.trim(), username }),
        },
      ]);
    } catch {
      // Server unreachable — save credentials locally so sign-in works later
      store.dispatch(registerLocalUser({ email: email.trim(), password: password.trim(), name: name.trim() }));
      Alert.alert("Welcome!", "Your account has been created.", [
        {
          text: "Continue",
          onPress: () =>
            onLogin({ name: name.trim(), email: email.trim(), username }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sign up a new user.</Text>
      </View>

      <View style={styles.fields}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClear}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.clearButtonText]}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onSwitchToSignIn} style={styles.hintContainer}>
          <Text style={styles.hintText}>
            Already have an account?{" "}
            <Text style={styles.hintLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Auth Screen ───────────────────────────────────────────────────────────────
export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("signin");

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.appHeader}>
          <Text style={styles.appTitle}>Fake Store</Text>
        </View>

        {mode === "signin" ? (
          <SignInForm onLogin={onLogin} onSwitchToSignUp={() => setMode("signup")} />
        ) : (
          <SignUpForm onLogin={onLogin} onSwitchToSignIn={() => setMode("signin")} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flexGrow: 1,
  },
  appHeader: {
    padding: 20,
    backgroundColor: "#000000",
    alignItems: "center",
    marginTop: 40,
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 30,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  formContainer: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  fields: {
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  button: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 14,
    borderRadius: 5,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000000",
  },
  clearButtonText: {
    color: "#000000",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
  hintContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  hintText: {
    color: "#555",
    fontSize: 14,
  },
  hintLink: {
    color: "#000000",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
