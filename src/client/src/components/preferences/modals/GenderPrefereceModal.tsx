import React, { useEffect, useState } from "react";
import { View, Modal, StyleSheet, Pressable, Dimensions } from "react-native";
import { Colors } from "../../../helpers/consts/Colors";
import { AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { GenderEnum } from "../../../helpers/enums/GenderEnum";
import { Button } from "react-native-paper";
import { Text } from "react-native-paper";

type GenderPreferenceModalProps = {
  visible: boolean;
  value: GenderEnum | null;
  onClose: () => void;
  onSave: (gender: GenderEnum | null) => void;
};

export function GenderPreferenceModal({
  visible,
  value,
  onClose,
  onSave,
}: GenderPreferenceModalProps) {
  const [selectedCheckbox, setSelectedCheckbox] = useState<GenderEnum | null>(
    value,
  );
  useEffect(() => {
    value && setSelectedCheckbox(value);
  }, []);

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
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 25,
              borderBottomColor: Colors.border.gray,
              borderBottomWidth: 1,
            }}
          >
            <Text variant="titleMedium">Gender</Text>
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

          <View style={{ marginBottom: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 15,
                borderBottomColor: Colors.border.gray,
                borderBottomWidth: 1,
              }}
            >
              <Text variant="bodyLarge">Kadın</Text>
              <Checkbox
                value={selectedCheckbox == GenderEnum.Woman}
                onValueChange={() =>
                  setSelectedCheckbox((prev) =>
                    prev == GenderEnum.Woman ? null : GenderEnum.Woman,
                  )
                }
                color={
                  selectedCheckbox == GenderEnum.Woman ? "#4630EB" : undefined
                }
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 15,
              }}
            >
              <Text variant="bodyLarge">Erkek</Text>
              <Checkbox
                value={selectedCheckbox == GenderEnum.Man}
                onValueChange={() =>
                  setSelectedCheckbox((prev) =>
                    prev == GenderEnum.Man ? null : GenderEnum.Man,
                  )
                }
                color={
                  selectedCheckbox == GenderEnum.Man ? "#4630EB" : undefined
                }
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button mode="contained" onPress={() => onSave(selectedCheckbox)}>
              Save
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
