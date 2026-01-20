import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PreferenceScreen } from "../screens/PreferenceScreen";

const Stack = createNativeStackNavigator();

export function PreferenceStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PreferenceScreen"
        component={PreferenceScreen}
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
