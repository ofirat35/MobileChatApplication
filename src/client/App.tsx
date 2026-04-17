import { RootStack } from "./src/navigators/RootStack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { AuthProvider } from "./src/helpers/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "./src/app/store";
import { initI18n } from "./src/app/locales/i18n";
import { useEffect, useRef } from "react";
import { CustomActivityIndicator } from "./src/components/shared/CustomActivityIndicator";
import { AppState } from "react-native";
import { chatSignalRService } from "./src/signalr/ChatSignalRService";
import { DEFAULT_STALE_TIME } from "./src/helpers/consts/ExpiryTimeConsts";
import Toast from "react-native-toast-message";
import { QueryKeys } from "./src/helpers/consts/QueryKeys";
import { useAppNavigation } from "./src/hooks/useAppNavigation";

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

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME,
    },
  },
});

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

    chatSignalRService.init();
    chatSignalRService.subscribeToMessages((message) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.chats.base });
    });

    const interval = setInterval(
      () => chatSignalRService.heartbeat(),
      1000 * 60 * 5,
    );

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        chatSignalRService.heartbeat();
      } else if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        chatSignalRService.setBackground();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      clearInterval(interval);
      chatSignalRService.stop();
    };
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer
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
      <Toast />
    </Provider>
  );
}
