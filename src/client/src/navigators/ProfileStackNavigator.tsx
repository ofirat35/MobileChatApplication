import { Modal, Pressable, View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../helpers/consts/Colors";
import { AntDesign } from "@expo/vector-icons";
import { Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "../helpers/contexts/AuthContext";
import { ProfileStackParamList } from "../helpers/types/navigation";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          header: () => <ProfileHeader />,
          contentStyle: { backgroundColor: "transparent" },
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

const ProfileHeader = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const { logout } = useAuth(); // ← use context logout

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingBottom: 15,

        backgroundColor: Colors.background.black,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Text
          variant="titleMedium"
          style={{ fontWeight: "bold", color: Colors.text.white }}
        >
          {t("Profile.HeaderTitle")}
        </Text>
        <View style={{ flexDirection: "row", gap: 15 }}>
          <Pressable onPress={() => setVisible(true)}>
            <MaterialIcons
              name="language"
              size={24}
              color={Colors.text.white}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              logout();
            }}
          >
            <MaterialIcons name="logout" size={24} color={Colors.text.white} />
          </Pressable>
        </View>
        <LanguageModal
          visible={visible}
          onClose={() => setVisible(false)}
        ></LanguageModal>
      </View>
    </SafeAreaView>
  );
};
const languages = [
  { code: "en", label: "English" },
  { code: "tr", label: "Türkçe" },
];

export function LanguageModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalView}>
          {/* Close button */}
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pressable onPress={onClose}>
              <AntDesign name="close" size={20} />
            </Pressable>
          </View>

          <Text
            variant="titleLarge"
            style={{ textAlign: "center", marginBottom: 20, marginTop: 10 }}
          >
            {t("Select Language")}
          </Text>

          {languages.map((lang) => (
            <View key={lang.code} style={{ alignItems: "center" }}>
              <Button
                mode="contained"
                style={{ marginBottom: 10, width: "80%" }}
                onPress={() => changeLanguage(lang.code)}
              >
                {lang.label}
              </Button>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
    flex: 1,
  },
  modalView: {
    width: "90%",
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
