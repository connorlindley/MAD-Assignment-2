import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./Scenes/homeScene";
import ElectronicScene from "./Scenes/electronicsScene";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Electronic" component={ElectronicScene} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
