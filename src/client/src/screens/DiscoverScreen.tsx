import React from "react";
import { View } from "react-native";
import { DiscoveryTopScroll } from "../components/discovers/DiscoveryTopScroll";
import { DiscoverySwipe } from "../components/discovers/DiscoverySwipe";

export function DiscoverScreen() {
  return (
    <View style={{ flex: 1 }}>
      <DiscoveryTopScroll />
      <DiscoverySwipe></DiscoverySwipe>
    </View>
  );
}
