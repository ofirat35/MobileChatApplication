import { View, Text, TouchableOpacity, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../helpers/consts/Colors";
import { keycloakService } from "../helpers/Auth/keycloak";
import { AuthStorage } from "../helpers/Auth/auth-storage";
import { useAuth } from "../helpers/contexts/AuthContext";
import { Loading } from "../components/shared/Loading";

export function LoginScreen({ navigation }: { navigation: any }) {
  const { login, logout, isAuthenticated, isLoading, tokens } = useAuth();
  console.log(tokens);
  console.log(isAuthenticated);
  console.log(keycloakService.getStoredTokens());
  useEffect(() => {
    isAuthenticated && navigation.navigate("RootTabNavigationScreen");
  }, [isAuthenticated]);

  if (isLoading) return <Loading></Loading>;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {isAuthenticated ? (
        <Text>Welcome! Login Status {tokens?.accessToken ?? "false"}</Text>
      ) : (
        <Button title="Login with Keycloak" onPress={login} />
      )}

      {isAuthenticated ? (
        <TouchableOpacity onPress={logout}>
          <Text style={{ color: Colors.text.primary, fontWeight: "bold" }}>
            Logout
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text style={{ color: Colors.text.primary, fontWeight: "bold" }}>
            Register
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("RootTabNavigationScreen")}
      >
        <Text style={{ color: Colors.text.primary, fontWeight: "bold" }}>
          Ana Sayfaya git
        </Text>
      </TouchableOpacity>
    </View>
  );
}
