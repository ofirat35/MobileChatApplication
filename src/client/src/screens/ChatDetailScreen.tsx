import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Colors } from "../helpers/consts/Colors";
import { useAppNavigation } from "../hooks/useAppNavigation";
import {
  Button,
  Dialog,
  Menu,
  PaperProvider,
  Portal,
  Snackbar,
  Text,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useChatDetail } from "../hooks/useChatDetail";
import { CustomActivityIndicator } from "../components/shared/CustomActivityIndicator";
import { keycloakService } from "../helpers/Auth/keycloak";
import { MessageInput } from "../components/chatDetails/MessageInput";
import { MessageBubble } from "../components/chatDetails/MessageBubble";

export function ChatDetailScreen() {
  const activeUserId = useMemo(() => keycloakService.getCurrentUserId()!, []);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const route = useRoute();
  const { goBack, navigate } = useAppNavigation();
  const { userId, chatId } = route.params as {
    userId: string;
    chatId: string;
  };
  const { t } = useTranslation();
  const { user, isLoading, messages, fetchMessages, removeChat, sendMessage } =
    useChatDetail({
      userId,
      chatId,
    });
  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
    setMenuVisible(false);
  };

  const removeChatHandler = async () => {
    var isSuccess = await removeChat(userId);
    setShowSnackbar(true);
    setIsDeleteSuccess(isSuccess);
    if (isSuccess) {
      goBack();
    }
    setMenuVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
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
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
              <Dialog.Title>Remove Chat</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  Remove chat with: {user?.firstName} {user?.lastName}
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setVisible(false)}>{t("Cancel")}</Button>
                <Button onPress={removeChatHandler}>{t("Ok")}</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>

        <FlatList
          data={messages}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            fetchMessages();
          }}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => <MessageBubble item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          inverted
        />
        <View>
          <MessageInput
            onSend={(msg) =>
              sendMessage({
                chatId: chatId,
                content: msg,
                senderId: activeUserId,
              })
            }
          />
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
      </KeyboardAvoidingView>
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
  listContent: {
    marginHorizontal: 15,
    marginVertical: 20,
  },
});
