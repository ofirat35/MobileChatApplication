import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../helpers/consts/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AgePreferenceModal } from "./modals/AgePreferenceModal";
import { GenderPreferenceModal } from "./modals/GenderPrefereceModal";
import { CountryPreferenceModal } from "./modals/CountryPreferenceModal";
import { Text } from "react-native-paper";
import { PreferenceListModel } from "../../models/Users/PreferenceListModel";
import { UserService } from "../../services/UserService";
import { GenderEnum } from "../../helpers/enums/GenderEnum";
import { useDispatch } from "react-redux";
import { updateDiscoveryVersion } from "../../features/slices/discoverySlice";
import { CustomActivityIndicator } from "../shared/CustomActivityIndicator";

export function PreferenceList() {
  var [activeModal, setActiveModal] = useState<
    "gender" | "age" | "country" | null
  >(null);

  const dispatch = useDispatch();
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [preference, setPreference] = useState<PreferenceListModel>({
    id: null,
    minAge: null,
    maxAge: null,
    country: null,
    gender: null,
  });
  useEffect(() => {
    setIndicatorVisible(true);
    UserService.getPreferences().then((res) => {
      setTimeout(() => {
        console.log("res");
        console.log(res);
        res && setPreference(res);
        setIndicatorVisible(false);
      }, 400);
    });
  }, []);

  return (
    <View>
      <CustomActivityIndicator
        visible={indicatorVisible}
      ></CustomActivityIndicator>
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
          Your preferences will be prioritized according bellow
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 25,
        }}
      >
        <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
          Temel Bilgiler
        </Text>
      </View>
      <View style={styles.preferenceList}>
        <PreferenceBox
          text="Cinsiyet"
          value={
            preference && preference?.gender !== null
              ? GenderEnum[preference.gender]
              : "-"
          }
          onPress={() => setActiveModal("gender")}
        ></PreferenceBox>
        <PreferenceBox
          text="Age"
          value={`${preference?.minAge ?? ""}-${preference?.maxAge ?? ""}`}
          onPress={() => setActiveModal("age")}
        ></PreferenceBox>
        <PreferenceBox
          text="Country"
          value={preference?.country ?? "-"}
          onPress={() => setActiveModal("country")}
        ></PreferenceBox>
      </View>

      <GenderPreferenceModal
        visible={activeModal == "gender"}
        value={preference.gender}
        onSave={(gender: GenderEnum | null) => {
          const updateModel = { ...preference, gender: gender };
          UserService.setPreferences(updateModel).then(() => {
            dispatch(updateDiscoveryVersion());
            setPreference(updateModel);
          });

          setActiveModal(null);
        }}
        onClose={() => setActiveModal(null)}
      ></GenderPreferenceModal>
      <AgePreferenceModal
        visible={activeModal == "age"}
        min={preference.minAge}
        max={preference.maxAge}
        onClose={() => setActiveModal(null)}
        onSave={(minAge: number | null, maxAge: number | null) => {
          const updateModel = { ...preference, minAge: minAge, maxAge: maxAge };
          UserService.setPreferences(updateModel).then(() => {
            dispatch(updateDiscoveryVersion());
            setPreference(updateModel);
          });

          setActiveModal(null);
        }}
      ></AgePreferenceModal>
      <CountryPreferenceModal
        visible={activeModal == "country"}
        value={preference.country}
        onClose={() => setActiveModal(null)}
        onSave={(country: string | null) => {
          const updateModel = { ...preference, country: country };
          UserService.setPreferences(updateModel).then(() => {
            dispatch(updateDiscoveryVersion());
            setPreference(updateModel);
          });

          setActiveModal(null);
        }}
      ></CountryPreferenceModal>
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
