import {
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
  Pressable,
  Modal,
} from "react-native";
import React from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

export function CustomActivityIndicator({ visible }: { visible: boolean }) {
  return (
    <Modal transparent visible={visible}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0.3)", // optional dim effect
        }}
      >
        <ActivityIndicator
          animating={true}
          color={MD2Colors.red800}
          size={"large"}
        />
      </View>
    </Modal>
  );
}
