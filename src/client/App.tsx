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
import { useEffect } from "react";
import { CustomActivityIndicator } from "./src/components/shared/CustomActivityIndicator";

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
  useEffect(() => {
    initI18n();
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
