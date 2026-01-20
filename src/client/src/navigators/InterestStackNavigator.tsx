import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InterestScreen } from "../screens/InterestScreen";

const Stack = createNativeStackNavigator();

export function InterestStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InterestScreen"
        component={InterestScreen}
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
