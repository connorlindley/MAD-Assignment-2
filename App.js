import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { clearCart } from "./store/cartSlice";
import { clearOrders } from "./store/ordersSlice";
import { setUserEmail, setDisplayName, clearSession } from "./store/sessionSlice";

import HomeScreen from "./Scenes/homeScene";
import ProductListingScreen from "./Scenes/productListingScene";
import ProductDetailsScreen from "./Scenes/productDetailsScene";
import CheckoutScreen from "./Scenes/checkoutScene";
import OrdersScreen from "./Scenes/ordersScene";
import SplashScreen from "./Scenes/splashScene";
import AuthScreen from "./Scenes/authScene";
import ProfileScreen from "./Scenes/profileScene";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductListing" component={ProductListingScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
}

// Always-visible tab navigator — AccountTab switches between Auth and Profile
// based on login state; the other three tabs are guarded with an alert.
function MainNavigator({ isLoggedIn, currentUser, onLogin, onLogout, onUpdate, navRef }) {
  const totalQuantity = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const newOrderCount = useSelector((state) =>
    state.orders.orders.filter((o) => o.status === "new").length
  );

  const requireAuth = (tabName) => ({
    tabPress: (e) => {
      if (!isLoggedIn) {
        e.preventDefault();
        Alert.alert(
          "Login Required",
          `Please sign in to access ${tabName}.`,
          [{ text: "OK" }]
        );
      }
    },
  });

  return (
    <NavigationContainer ref={navRef}>
      <Tab.Navigator>
        {/* Account tab — Auth when logged out, Profile when logged in */}
        <Tab.Screen
          name="AccountTab"
          options={{
            title: isLoggedIn ? "My Profile" : "Account",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        >
          {() =>
            isLoggedIn ? (
              <ProfileScreen
                currentUser={currentUser}
                onLogout={onLogout}
                onUpdate={onUpdate}
              />
            ) : (
              <AuthScreen onLogin={onLogin} />
            )
          }
        </Tab.Screen>

        <Tab.Screen
          name="ProductsTab"
          component={HomeStack}
          listeners={requireAuth("Products")}
          options={{
            headerShown: false,
            title: "Products",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="ShoppingCart"
          component={CheckoutScreen}
          listeners={requireAuth("My Cart")}
          options={{
            title: "My Cart",
            tabBarBadge: isLoggedIn && totalQuantity > 0 ? totalQuantity : undefined,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="MyOrders"
          component={OrdersScreen}
          listeners={requireAuth("My Orders")}
          options={{
            title: "My Orders",
            tabBarBadge: isLoggedIn && newOrderCount > 0 ? newOrderCount : undefined,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="receipt-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (user) => {
    const session = store.getState().session;

    if (session?.userEmail && session.userEmail !== user.email) {
      store.dispatch(clearCart());
      store.dispatch(clearOrders());
      store.dispatch(clearSession());
    }

    const restoredName =
      session?.userEmail === user.email && session?.displayName
        ? session.displayName
        : user.name;

    store.dispatch(setUserEmail(user.email));
    store.dispatch(setDisplayName(restoredName));
    setCurrentUser({ ...user, name: restoredName });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    navRef.current?.navigate("AccountTab");
  };

  const handleUpdate = (updatedUser) => {
    store.dispatch(setDisplayName(updatedUser.name));
    setCurrentUser(updatedUser);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <MainNavigator
      isLoggedIn={isLoggedIn}
      currentUser={currentUser}
      onLogin={handleLogin}
      onLogout={handleLogout}
      onUpdate={handleUpdate}
      navRef={navRef}
    />
  );
}

// Provider and PersistGate wrap everything so AsyncStorage rehydrates
// during the splash screen — data is ready the moment the user signs in.
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppContent />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
