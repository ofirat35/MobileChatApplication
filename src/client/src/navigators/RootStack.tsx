import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootTabNavigationScreen } from "../screens/RootTabNavigationScreen";
import { useAuth } from "../helpers/contexts/AuthContext";
import { ViewUserProfileScreen } from "../screens/ViewUserProfileScreen";

const Stack = createNativeStackNavigator();

const TransparentBackHeader = ({ navigation }: any) => (
  <SafeAreaView style={{ flexDirection: "row" }}>
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 15 }}
    >
      <Ionicons name="chevron-back-outline" size={26} />
    </TouchableOpacity>
  </SafeAreaView>
);

export function RootStack() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          headerTransparent: true,
          header: ({ navigation }) => (
            <TransparentBackHeader navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="ViewUserProfileScreen"
        component={ViewUserProfileScreen}
        options={{
          statusBarHidden: true,
          headerTransparent: true,
          headerTitle: "",
          headerTintColor: "white",
        }}
      />
      {isAuthenticated && (
        <Stack.Screen
          name="RootTabNavigationScreen"
          component={RootTabNavigationScreen}
          options={{
            headerTransparent: true,
            headerShown: false,
            header: ({ navigation }) => (
              <TransparentBackHeader navigation={navigation} />
            ),
          }}
        />
      )}
    </Stack.Navigator>
  );
}
