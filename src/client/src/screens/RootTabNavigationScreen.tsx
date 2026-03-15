import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DiscoverStackNavigator } from "../navigators/DiscoverStackNavigator";
import { InterestStackNavigator } from "../navigators/InterestStackNavigator";
import { ChatStackNavigator } from "../navigators/ChatStackNavigator";
import { PreferenceStackNavigator } from "../navigators/PreferenceStackNavigator";
import { ProfileStackNavigator } from "../navigators/ProfileStackNavigator";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "../helpers/consts/Colors";
import { useTranslation } from "react-i18next";
import { RootTabParamList } from "../helpers/types/navigation";

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabNavigationScreen() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.text.white,
        tabBarInactiveTintColor: Colors.text.dirtyWhite,
        headerStyle: {},
        tabBarStyle: {
          height: 75,
          backgroundColor: Colors.background.black,
          // display: tabHiddenRoutes.includes(routeName) ? "none" : "flex",
        },
      }}
    >
      <Tab.Screen
        name="DiscoverTab"
        options={{
          title: t("Discover.TabNavTitle"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="users"
              size={22}
              color={focused ? Colors.text.white : Colors.text.dirtyWhite}
            />
          ),
        }}
        component={DiscoverStackNavigator}
      />
      <Tab.Screen
        name="InterestTab"
        options={{
          title: t("Interests.TabNavTitle"),
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="heart-multiple"
                size={22}
                color={Colors.text.white}
              />
            ) : (
              <MaterialCommunityIcons
                name="heart-multiple-outline"
                size={22}
                color={Colors.text.dirtyWhite}
              />
            ),
        }}
        component={InterestStackNavigator}
      />
      <Tab.Screen
        name="ChatTab"
        options={{
          title: t("Chats.TabNavTitle"),
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="message"
                size={22}
                color={Colors.text.white}
              />
            ) : (
              <Feather
                name="message-square"
                size={22}
                color={Colors.text.dirtyWhite}
              />
            ),
        }}
        component={ChatStackNavigator}
      />
      <Tab.Screen
        name="PreferenceTab"
        options={{
          title: t("Preferences.TabNavTitle"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Feather
              name="list"
              size={22}
              color={focused ? Colors.text.white : Colors.text.dirtyWhite}
            />
          ),
        }}
        component={PreferenceStackNavigator}
      />
      <Tab.Screen
        name="ProfileTab"
        options={{
          title: t("Profile.TabNavTitle"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user-circle"
              size={22}
              color={focused ? Colors.text.white : Colors.text.dirtyWhite}
            />
          ),
        }}
        component={ProfileStackNavigator}
      />
    </Tab.Navigator>
  );
}
