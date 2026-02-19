import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Modal } from "react-native";

type LoadingProps = {
  visible?: boolean;
  text?: string;
  fullScreen?: boolean;
};

export function Loading({
  visible = true,
  text = "Loading...",
  fullScreen = true,
}: LoadingProps) {
  if (!visible) return null;

  const content = (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );

  if (fullScreen) {
    return (
      <Modal transparent animationType="fade" visible>
        <View style={styles.overlay}>{content}</View>
      </Modal>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 150,
    elevation: 5,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
  },
});
