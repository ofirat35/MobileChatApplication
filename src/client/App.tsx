import { RootStack } from "./src/navigators/RootStack";
import { NavigationContainer } from "@react-navigation/native";
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
import { CustomActivityIndicator } from "./src/components/shared/CustomActivityIndicator";
import { AppState } from "react-native";
import * as signalR from "@microsoft/signalr";
import { AuthStorage } from "./src/helpers/Auth/auth-storage";
import { presenceService } from "./src/signalr/PresenceService";

const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      RegisterScreen: {
        path: "register",
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

  useEffect(() => {
    initI18n();

    presenceService.init();

    const interval = setInterval(
      () => {
        presenceService.heartbeat();
      },
      1000 * 60 * 5,
    );

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        presenceService.heartbeat();
      } else if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        presenceService.setBackground();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      clearInterval(interval);
      presenceService.stop();
    };
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        fallback={
          <CustomActivityIndicator visible={true}></CustomActivityIndicator>
        }
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
