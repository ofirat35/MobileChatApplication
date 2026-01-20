import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DiscoverScreen } from "../screens/DiscoverScreen";

const Stack = createNativeStackNavigator();

export function DiscoverStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DiscoverScreen"
        component={DiscoverScreen}
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
