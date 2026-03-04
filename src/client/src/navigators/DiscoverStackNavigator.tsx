import { View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../helpers/consts/Colors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

const Stack = createNativeStackNavigator();

export function DiscoverStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DiscoverScreen"
        component={DiscoverScreen}
        options={{
          header: () => <DiscoverHeader />,
          // headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          // headerShown: false,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

const DiscoverHeader = () => {
  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingBottom: 10,

        backgroundColor: Colors.background.black,
      }}
    >
      <View>
        <Text
          variant="titleMedium"
          style={{ fontWeight: "bold", color: Colors.text.white }}
        >
          Discover
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: 65,
          justifyContent: "space-between",
        }}
      >
        <MaterialIcons name="refresh" size={28} color={Colors.text.white} />
        <MaterialCommunityIcons
          name="lightning-bolt-outline"
          size={28}
          color={Colors.text.white}
        />
      </View>
    </SafeAreaView>
  );
};
