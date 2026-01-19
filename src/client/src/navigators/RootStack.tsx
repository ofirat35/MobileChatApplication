import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeScreen } from "../screens/HomeScreen";

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
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          //   header: ({ navigation }) => (
          //     <TransparentBackHeader navigation={navigation} />
          //   ),
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
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerTransparent: true,
          headerShown: false,
          // header: ({ navigation }) => (
          //   <TransparentBackHeader navigation={navigation} />
          // ),
        }}
      />
    </Stack.Navigator>
  );
}
