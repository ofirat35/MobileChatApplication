import { View, Text } from "react-native";
import React from "react";
import { ProfileList } from "../components/profile/ProfileList";

export function ProfileScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ProfileList></ProfileList>
    </View>
  );
}
