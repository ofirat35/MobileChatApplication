import { Pressable, View } from "react-native";
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../helpers/consts/Colors";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { MembershipModal } from "../components/memberships/MembershipModal";

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
  const { t } = useTranslation();
  const [membershipVisible, setMembershipVisible] = useState<boolean>(false);
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
          {t("Discover.TabNavTitle")}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: 65,
          justifyContent: "flex-end",
        }}
      >
        <Pressable onPress={() => setMembershipVisible((prev) => !prev)}>
          <MaterialCommunityIcons
            name="lightning-bolt-outline"
            size={28}
            color={Colors.text.white}
          />
        </Pressable>
        <MembershipModal
          visible={membershipVisible}
          value={"test"}
          onClose={() => {
            setMembershipVisible(false);
          }}
          onSave={() => {}}
        ></MembershipModal>
      </View>
    </SafeAreaView>
  );
};
