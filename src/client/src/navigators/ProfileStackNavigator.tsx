import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileScreen } from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
