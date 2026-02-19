import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InterestScreen } from "../screens/InterestScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../helpers/consts/Colors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

export function InterestStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InterestScreen"
        component={InterestScreen}
        options={{
          header: () => <InterestHeader />,
          contentStyle: { backgroundColor: "transparent" },
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

const InterestHeader = () => {
  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingBottom: 15,

        backgroundColor: Colors.background.black,
      }}
    >
      <View>
        <Text
          style={{ fontWeight: "bold", fontSize: 18, color: Colors.text.white }}
        >
          Interests
        </Text>
      </View>
    </SafeAreaView>
  );
};
