import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DiscoverStackNavigator } from "../navigators/DiscoverStackNavigator";
import { InterestStackNavigator } from "../navigators/InterestStackNavigator";
import { MessageStackNavigator } from "../navigators/MessageStackNavigator";
import { PreferenceStackNavigator } from "../navigators/PreferenceStackNavigator";
import { ProfileStackNavigator } from "../navigators/ProfileStackNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../helpers/consts/Colors";

const Tab = createBottomTabNavigator();

export function RootTabNavigationScreen() {
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
          title: "Discover",
          header: () => <DiscoverHeader />,
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
        name="MessageTab"
        options={{
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
        component={MessageStackNavigator}
      />
      <Tab.Screen
        name="PreferenceTab"
        options={{
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
          style={{ fontWeight: "bold", fontSize: 18, color: Colors.text.white }}
        >
          ocupid
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
