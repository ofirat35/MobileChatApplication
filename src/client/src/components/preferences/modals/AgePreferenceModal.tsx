import React, { useEffect, useState } from "react";
import { View, Modal, StyleSheet, Pressable } from "react-native";
import { Colors } from "../../../helpers/consts/Colors";
import { AntDesign } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { usePreference } from "../../../hooks/usePreference";
import { CustomActivityIndicator } from "../../shared/CustomActivityIndicator";

type AgePreferenceModalProps = {
  visible: boolean;
  min: number | null;
  max: number | null;
  onClose?: () => void;
  onSave?: () => void;
};

export function AgePreferenceModal({
  visible,
  min,
  max,
  onClose,
  onSave,
}: AgePreferenceModalProps) {
  const { preference, updatePreference, isLoading } = usePreference();
  const [minAge, setMinAge] = useState<string>(min?.toString() ?? "18");
  const [maxAge, setMaxAge] = useState<string>(max?.toString() ?? "99");

  const handleUpdate = () => {
    preference &&
      updatePreference({
        ...preference,
        minAge: parseInt(minAge),
        maxAge: parseInt(maxAge),
      });
    onSave && onSave();
  };

  useEffect(() => {
    min && setMinAge(min.toString());
    max && setMaxAge(max.toString());
  }, [min, max]);
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
            <Text variant="titleMedium">{t("Age")}</Text>
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
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 15,
              }}
            >
              <TextInput
                style={{ width: 100 }}
                label={t("Min")}
                mode="outlined"
                value={minAge}
                onChangeText={(text) => {
                  let val = text.replace(/[^0-9]/g, "");
                  setMinAge(val);
                }}
                onBlur={() => {
                  if (minAge && parseInt(minAge) < 18) setMinAge("18");
                  else if (!minAge) setMinAge("18");
                }}
                keyboardType="numeric"
                maxLength={2}
              />

              <Text style={{ marginHorizontal: 20 }}>-</Text>
              <TextInput
                style={{ width: 100 }}
                label={t("Max")}
                mode="outlined"
                value={maxAge}
                onChangeText={(text) => {
                  let val = text.replace(/[^0-9]/g, "");
                  setMaxAge(val);
                }}
                onBlur={() => {
                  if (minAge > maxAge) setMaxAge(minAge);
                }}
                keyboardType="numeric"
                maxLength={2}
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
