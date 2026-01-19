import { View, Text, TouchableOpacity, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../helpers/consts/Colors";
import { keycloakService } from "../helpers/Auth/keycloak";
import { AuthStorage } from "../helpers/Auth/auth-storage";

export function LoginScreen({ navigation }: { navigation: any }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const loginHandler = async () => {
    try {
      await keycloakService.login();
      await loadAuthState();
      console.log(await AuthStorage.getAccessToken());
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logoutHandler = async () => {
    await keycloakService.logout();
    setIsAuthenticated(false);
    setAccessToken(null);
    navigation.navigate("LoginScreen");
    console.log(await AuthStorage.getAccessToken());
  };

  const loadAuthState = async () => {
    const authenticated = await keycloakService.isAuthenticated();
    const token = await AuthStorage.getAccessToken();

    setIsAuthenticated(authenticated);
    setAccessToken(token);
    setLoading(false);

    if (authenticated) {
      navigation.navigate("HomeScreen");
    }
  };

  useEffect(() => {
    loadAuthState();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {isAuthenticated ? (
        <Text>Welcome! Access Token: {accessToken}</Text>
      ) : (
        <Button title="Login with Keycloak" onPress={loginHandler} />
      )}

      {isAuthenticated && (
        <TouchableOpacity onPress={logoutHandler}>
          <Text style={{ color: Colors.text.primary, fontWeight: "bold" }}>
            Logout
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <Text style={{ color: Colors.text.primary, fontWeight: "bold" }}>
          Ana Sayfaya git
        </Text>
      </TouchableOpacity>
    </View>
  );
}
