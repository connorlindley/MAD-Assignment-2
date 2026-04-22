import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./Scenes/homeScene";
import ProductListingScreen from "./Scenes/productListingScene";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductListing" component={ProductListingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
