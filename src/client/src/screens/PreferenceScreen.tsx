import { View, Text } from "react-native";
import React from "react";
import { PreferenceList } from "../components/preferences/PreferenceList";

export function PreferenceScreen() {
  return (
    <View>
      <PreferenceList></PreferenceList>
    </View>
  );
}
