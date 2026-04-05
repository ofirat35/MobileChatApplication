import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Colors } from "../helpers/consts/Colors";
import { useAppNavigation } from "../hooks/useAppNavigation";
import {
  Button,
  Dialog,
  Menu,
  Portal,
  Snackbar,
  Text,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useMessage } from "../hooks/useMessage";
import { CustomActivityIndicator } from "../components/shared/CustomActivityIndicator";

export function MessageScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const route = useRoute();
  const { goBack, navigate } = useAppNavigation();
  const { userId } = route.params as {
    userId: string;
  };
  const { t } = useTranslation();
  const { user, isLoading, removeMatch } = useMessage({
    userId,
  });
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => {
    setVisible(true);
    setMenuVisible(false);
  };
  const hideDialog = () => setVisible(false);

  const removeMatchHandler = async () => {
    var isSuccess = await removeMatch(userId);
    setShowSnackbar(true);
    setIsDeleteSuccess(isSuccess);
    if (isSuccess) {
      goBack();
    }
    setMenuVisible(false);
  };

  if (isLoading) return;

  return (
    <SafeAreaView>
      <CustomActivityIndicator visible={isLoading} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Ionicons name="chevron-back-outline" size={26} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate("ViewUserProfileScreen", { userId });
          }}
          style={{ alignItems: "center" }}
        >
          {user?.images && user?.images?.length > 0 ? (
            <Image
              resizeMode="stretch"
              source={{ uri: user.images[0].imagePath }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
            ></Image>
          ) : (
            <Image
              resizeMode="stretch"
              source={require("../../assets/img/img1.png")}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
            ></Image>
          )}
          <Text style={{ marginTop: 5, fontSize: 17, fontWeight: "bold" }}>
            {user?.firstName} {user?.lastName}
          </Text>
        </TouchableOpacity>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          style={{ marginTop: 40 }}
          anchor={
            <Pressable onPress={() => setMenuVisible(true)}>
              <Entypo
                name="dots-three-vertical"
                size={22}
                color={Colors.text.primary}
              />
            </Pressable>
          }
        >
          <Menu.Item onPress={showDialog} title={t("Remove User")} />
        </Menu>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Remove Chat</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Remove chat with: {user?.firstName} {user?.lastName}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>{t("Cancel")}</Button>
              <Button onPress={removeMatchHandler}>{t("Ok")}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>

      <Snackbar
        visible={showSnackbar}
        style={{
          marginBottom: 70,
        }}
        duration={2500}
        onDismiss={() => {
          setShowSnackbar(false);
          setIsDeleteSuccess(false);
        }}
      >
        {isDeleteSuccess
          ? t("Chat removed successfully")
          : t("Failed to remove chat")}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.gray,
    paddingBottom: 15,
  },
});
