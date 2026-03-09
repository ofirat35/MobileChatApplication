import { RootStack } from "./src/navigators/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import { Text, AppState, Vibration } from "react-native";
import * as Linking from "expo-linking";
import { AuthProvider } from "./src/helpers/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "./src/app/store";
import { navigationRef } from "./src/app/locales/i18n";
import { initI18n } from "./src/app/locales/i18n";
import { useEffect, useRef, useState } from "react";

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

const queryClient = new QueryClient();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        console.log("User left the app");
      }

      if (nextAppState === "active") {
        console.log("User returned to the app");
      }

      appState.current = nextAppState;
      setAppStateVisible(nextAppState);
      console.log("AppState", appState.current);
    });

    initI18n();
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        fallback={<Text>Loading...</Text>}
      >
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <PaperProvider theme={theme}>
              <RootStack />
            </PaperProvider>
          </QueryClientProvider>
        </AuthProvider>
      </NavigationContainer>
    </Provider>
  );
}
