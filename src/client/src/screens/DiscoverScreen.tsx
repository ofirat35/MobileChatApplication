import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DiscoveryTopScroll } from "../components/discovers/DiscoveryTopScroll";
import { Swipe } from "../components/discovers/Swipe";
import { DiscoverySwipe } from "../components/discovers/DiscoverySwipe";

export function DiscoverScreen() {
  return (
    <View style={{ flex: 1 }}>
      <DiscoveryTopScroll />
      <DiscoverySwipe></DiscoverySwipe>
    </View>
  );
}
