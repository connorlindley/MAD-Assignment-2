import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CartProvider, useCart } from "./cartContext";

import HomeScreen from "./Scenes/homeScene";
import ProductListingScreen from "./Scenes/productListingScene";
import ProductDetailsScreen from "./Scenes/productDetailsScene";
import CheckoutScreen from "./Scenes/checkoutScene";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Your existing stack lives inside the Home tab
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductListing" component={ProductListingScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
}

// Separate component so useCart hook works inside NavigationContainer
function AppTabs() {
  const { cartItems } = useCart();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: "Checkout",
          tabBarBadge: cartItems.length > 0 ? cartItems.length : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <NavigationContainer>
          <AppTabs />
        </NavigationContainer>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
