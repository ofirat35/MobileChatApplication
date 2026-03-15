import React, { useEffect, useState } from "react";
import { View, Modal, StyleSheet, Pressable } from "react-native";
import { Colors } from "../../../helpers/consts/Colors";
import { AntDesign } from "@expo/vector-icons";
import { TextInput, Button } from "react-native-paper";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { usePreference } from "../../../hooks/usePreference";
import { CustomActivityIndicator } from "../../shared/CustomActivityIndicator";

type CountryPreferenceModalProps = {
  visible: boolean;
  value: string | null;
  onClose?: () => void;
  onSave?: () => void;
};

export function CountryPreferenceModal({
  visible,
  value,
  onClose,
  onSave,
}: CountryPreferenceModalProps) {
  const { preference, updatePreference, isLoading } = usePreference();
  const [country, setCountry] = useState(value);

  const handleUpdate = () => {
    preference &&
      updatePreference({
        ...preference,
        country: country,
      });
    onSave && onSave();
  };

  useEffect(() => {
    value && setCountry(value);
  }, [value]);
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
            <Text variant="titleMedium">{t("Country")}</Text>
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 15,
              marginBottom: 10,
            }}
          >
            <TextInput
              style={{
                maxWidth: 350,
                flex: 1,
              }}
              label={t("Country")}
              value={country ?? ""}
              mode="outlined"
              onChangeText={(text) => setCountry(text)}
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button mode="contained" dark={true} onPress={() => handleUpdate()}>
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
