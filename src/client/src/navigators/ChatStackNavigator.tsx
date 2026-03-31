import { View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChatScreen } from "../screens/ChatScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../helpers/consts/Colors";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ChatStackParamList } from "../helpers/types/navigation";

const Stack = createNativeStackNavigator<ChatStackParamList>();

export function ChatStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          header: () => <DiscoverHeader />,
          contentStyle: { backgroundColor: "transparent" },
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

const DiscoverHeader = () => {
  const { t } = useTranslation();
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
          variant="titleMedium"
          style={{ fontWeight: "bold", color: Colors.text.white }}
        >
          {t("ChatsScreen.HeaderTitle")}
        </Text>
      </View>
    </SafeAreaView>
  );
};
