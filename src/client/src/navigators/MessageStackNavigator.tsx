import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MessageScreen } from "../screens/MessageScreen";

const Stack = createNativeStackNavigator();

export function MessageStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MessageScreen"
        component={MessageScreen}
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
