import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../../helpers/consts/Colors";

const { width, height } = Dimensions.get("window");

export function MessageBox() {
  return (
    <View style={styles.container}>
      <View style={{ marginRight: 20 }}>
        <Image
          resizeMode="stretch"
          source={require("../../../assets/img/img1.png")}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
        ></Image>
      </View>
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Fırat</Text>
        <Text style={{ fontSize: 16, color: Colors.text.gray }}>selam</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.background.white,
    paddingHorizontal: 15,
    height: 90,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.gray,
  },
});
