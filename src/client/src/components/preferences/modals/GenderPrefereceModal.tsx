import React, { useEffect, useState } from "react";
import { View, Modal, StyleSheet, Pressable, Dimensions } from "react-native";
import { Colors } from "../../../helpers/consts/Colors";
import { AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { GenderEnum } from "../../../helpers/enums/GenderEnum";
import { Button } from "react-native-paper";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { usePreference } from "../../../hooks/usePreference";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PreferenceListModel } from "../../../models/Users/PreferenceListModel";
import { CustomActivityIndicator } from "../../shared/CustomActivityIndicator";

type GenderPreferenceModalProps = {
  visible: boolean;
  value: GenderEnum | null;
  onClose?: () => void;
  onSave?: () => void;
};

export function GenderPreferenceModal({
  visible,
  value,
  onClose,
  onSave,
}: GenderPreferenceModalProps) {
  const { preference, updatePreference, isLoading } = usePreference();
  const initCheckboxes = (value: GenderEnum | null): GenderEnum[] => {
    if (!value || value === GenderEnum.None) return [];
    if (value === GenderEnum.Both) return [GenderEnum.Woman, GenderEnum.Man];
    return [value];
  };
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<GenderEnum[]>(
    initCheckboxes(value),
  );
  const handleUpdate = () => {
    if (preference) {
      let gender =
        selectedCheckboxes.length == 0
          ? null
          : selectedCheckboxes.length == 1
            ? selectedCheckboxes[0]
            : GenderEnum.Both;

      preference &&
        updatePreference({
          ...preference,
          gender: gender,
        });
    }

    onSave && onSave();
  };

  const toggle = (gender: GenderEnum) => {
    setSelectedCheckboxes((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender],
    );
  };

  const { t } = useTranslation();

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <CustomActivityIndicator visible={isLoading}></CustomActivityIndicator>
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
            <Text variant="titleMedium">{t("Gender")}</Text>
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
              <Text variant="bodyLarge">{t("Woman")}</Text>
              <Checkbox
                value={selectedCheckboxes.includes(GenderEnum.Woman)}
                onValueChange={() => toggle(GenderEnum.Woman)}
                color={
                  selectedCheckboxes.includes(GenderEnum.Woman)
                    ? "#4630EB"
                    : undefined
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
              <Text variant="bodyLarge">{t("Man")}</Text>
              <Checkbox
                value={selectedCheckboxes.includes(GenderEnum.Man)}
                onValueChange={() => toggle(GenderEnum.Man)}
                color={
                  selectedCheckboxes.includes(GenderEnum.Man)
                    ? "#4630EB"
                    : undefined
                }
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button mode="contained" onPress={() => handleUpdate()}>
              {t("Save")}
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
