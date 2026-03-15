import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../helpers/consts/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AgePreferenceModal } from "./modals/AgePreferenceModal";
import { GenderPreferenceModal } from "./modals/GenderPrefereceModal";
import { CountryPreferenceModal } from "./modals/CountryPreferenceModal";
import { Text } from "react-native-paper";
import { GenderEnum } from "../../helpers/enums/GenderEnum";
import { CustomActivityIndicator } from "../shared/CustomActivityIndicator";
import { useTranslation } from "react-i18next";
import { usePreference } from "../../hooks/usePreference";

export function PreferenceList() {
  var [activeModal, setActiveModal] = useState<
    "gender" | "age" | "country" | null
  >(null);

  const { t } = useTranslation();
  const { preference, isLoading } = usePreference();
  return (
    <View>
      <CustomActivityIndicator visible={isLoading}></CustomActivityIndicator>
      <View
        style={{
          paddingHorizontal: 30,
          paddingVertical: 20,
          backgroundColor: Colors.background.black,
          alignItems: "center",
          borderTopWidth: 1,
          borderTopColor: Colors.border.gray,
        }}
      >
        <Text
          variant="labelLarge"
          style={{
            color: Colors.text.white,
            textAlign: "center",
          }}
        >
          {t(
            "Preferences.Your preferences will be prioritized according bellow",
          )}
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 25,
        }}
      >
        <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
          {t("Preferences.Basic Information")}
        </Text>
      </View>
      <View style={styles.preferenceList}>
        <PreferenceBox
          text={t("Gender")}
          value={
            preference && preference?.gender !== null
              ? t(GenderEnum[preference.gender])
              : t(GenderEnum[GenderEnum.Both])
          }
          onPress={() => setActiveModal("gender")}
        ></PreferenceBox>
        <PreferenceBox
          text={t("Age")}
          value={`${preference?.minAge ?? ""}-${preference?.maxAge ?? ""}`}
          onPress={() => setActiveModal("age")}
        ></PreferenceBox>
        <PreferenceBox
          text={t("Country")}
          value={
            preference && preference.country != "" && preference.country != null
              ? preference.country
              : "-"
          }
          onPress={() => setActiveModal("country")}
        ></PreferenceBox>
      </View>

      {preference && (
        <>
          <GenderPreferenceModal
            visible={activeModal == "gender"}
            value={preference.gender}
            onSave={() => setActiveModal(null)}
            onClose={() => setActiveModal(null)}
          ></GenderPreferenceModal>
          <AgePreferenceModal
            visible={activeModal == "age"}
            min={preference.minAge}
            max={preference.maxAge}
            onClose={() => setActiveModal(null)}
            onSave={() => setActiveModal(null)}
          ></AgePreferenceModal>
          <CountryPreferenceModal
            visible={activeModal == "country"}
            value={preference.country}
            onClose={() => setActiveModal(null)}
            onSave={() => setActiveModal(null)}
          ></CountryPreferenceModal>
        </>
      )}
    </View>
  );
}

const PreferenceBox = ({
  text,
  value,
  onPress,
}: {
  text: string;
  value: string;
  onPress?: () => void;
}) => {
  return (
    <View style={styles.preferenceBox}>
      <Text variant="titleMedium">{text}</Text>
      <TouchableOpacity onPress={onPress} style={{ flexDirection: "row" }}>
        <Text
          variant="bodyLarge"
          style={{ marginRight: 3, paddingHorizontal: 3 }}
        >
          {value}
        </Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  preferenceList: {
    borderTopWidth: 1,
    borderColor: Colors.border.gray,
  },
  preferenceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.background.white,
    borderColor: Colors.border.gray,
    borderBottomWidth: 1,
  },
});
