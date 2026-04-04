import { View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InterestScreen } from "../screens/InterestScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../helpers/consts/Colors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { InterestStackParamList } from "../helpers/types/navigation";

const Stack = createNativeStackNavigator<InterestStackParamList>();

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
  const { t } = useTranslation();
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
          {t("InterestsScreen.HeaderTitle")}
        </Text>
      </View>
    </SafeAreaView>
  );
};
