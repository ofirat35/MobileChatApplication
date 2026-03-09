import React, { useEffect, useState } from "react";
import { View, Modal, StyleSheet, Pressable, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TextInput, Button } from "react-native-paper";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Colors } from "../../helpers/consts/Colors";
import { UserService } from "../../services/UserService";
import { PremiumMembership } from "../../helpers/consts/MembershipRoles";

type MembershipModalProps = {
  visible: boolean;
  value: string | null;
  onClose: () => void;
  onSave: (country: string | null) => void;
};

export function MembershipModal({
  visible,
  onClose,
  onSave,
}: MembershipModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 25,
              borderBottomColor: Colors.border.gray,
              borderBottomWidth: 1,
            }}
          >
            <Pressable
              onPress={onClose}
              style={{
                alignItems: "flex-end",
                marginBottom: 10,
              }}
            >
              <AntDesign
                name="close"
                size={20}
                color={Colors.background.black}
                style={{
                  borderColor: Colors.border.gray,
                  borderWidth: 1,
                  padding: 4,
                  borderRadius: 14,
                }}
              />
            </Pressable>
          </View>

          <Text
            variant="bodyLarge"
            style={{
              marginBottom: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Buy Premium membership just for{" "}
            <Text
              variant="titleMedium"
              style={{
                fontWeight: "bold",
                textAlign: "center",
                textDecorationLine: "line-through",
                color: Colors.text.pink,
              }}
            >
              3.99$
            </Text>{" "}
            <Text
              variant="titleLarge"
              style={{
                fontWeight: "bold",
                textAlign: "center",
                color: Colors.text.pink,
              }}
            >
              1.99$
            </Text>
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button
              mode="contained"
              dark={true}
              onPress={() => {
                UserService.buyMembership(PremiumMembership, 1);
              }}
            >
              Buy
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 30,
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: Colors.background.black,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
