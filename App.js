import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";

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

function AppTabs({ isLoggedIn, currentUser, onLogout, onUpdate, initialTab }) {
  const totalQuantity = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const newOrderCount = useSelector((state) =>
    state.orders.orders.filter((o) => o.status === "new").length
  );

  const guardedListener = (tabName) => ({
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
    <Tab.Navigator initialRouteName={initialTab}>
      <Tab.Screen
        name="ProductsTab"
        component={HomeStack}
        listeners={guardedListener("Products")}
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
        listeners={guardedListener("My Cart")}
        options={{
          title: "My Cart",
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={OrdersScreen}
        listeners={guardedListener("My Orders")}
        options={{
          title: "My Orders",
          tabBarBadge: newOrderCount > 0 ? newOrderCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        options={{
          title: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <ProfileScreen
            currentUser={currentUser}
            onLogout={onLogout}
            onUpdate={onUpdate}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [initialTab, setInitialTab] = useState("ProductsTab");

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (user, loginType) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setInitialTab(loginType === "signup" ? "ProfileTab" : "ProductsTab");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setInitialTab("ProductsTab");
  };

  const handleUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <AppTabs
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              onLogout={handleLogout}
              onUpdate={handleUpdate}
              initialTab={initialTab}
            />
          </NavigationContainer>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
