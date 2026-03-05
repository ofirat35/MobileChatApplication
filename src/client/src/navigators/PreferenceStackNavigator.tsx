import { View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PreferenceScreen } from "../screens/PreferenceScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../helpers/consts/Colors";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

const Stack = createNativeStackNavigator();

export function PreferenceStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PreferenceScreen"
        component={PreferenceScreen}
        options={{
          header: () => <PreferenceHeader />,
          contentStyle: { backgroundColor: "transparent" },
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

const PreferenceHeader = () => {
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
          {t("Preferences.TabNavTitle")}
        </Text>
      </View>
    </SafeAreaView>
  );
};
