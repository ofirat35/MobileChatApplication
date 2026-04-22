import { View } from "react-native";
import React from "react";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";
import { ChatsScreen } from "../screens/ChatsScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../helpers/consts/Colors";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ChatsStackParamList } from "../helpers/types/navigation";

const Stack = createNativeStackNavigator<ChatsStackParamList>();

export function ChatStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatsScreen"
        component={ChatsScreen}
        options={{
          header: (props) => <ChatHeader {...props} />,
          contentStyle: { backgroundColor: "transparent" },
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

const ChatHeader = (props: NativeStackHeaderProps) => {
  const { t } = useTranslation();
  const renderRight = props.options.headerRight;
  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: 20,
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
      <View>{renderRight ? renderRight({}) : null}</View>
    </SafeAreaView>
  );
};
