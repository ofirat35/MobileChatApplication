import { RootStack } from "./src/navigators/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import { Text } from "react-native";
import * as Linking from "expo-linking";
import { AuthProvider } from "./src/helpers/contexts/AuthContext";

const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      HomeScreen: {
        path: "home",
      },
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
    </NavigationContainer>
  );
}
