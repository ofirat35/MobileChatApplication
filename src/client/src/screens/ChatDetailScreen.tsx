import { Entypo, Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Dialog,
  Menu,
  Portal,
  Snackbar,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageBubble } from "../components/chatDetails/MessageBubble";
import { MessageInput } from "../components/chatDetails/MessageInput";
import { CustomActivityIndicator } from "../components/shared/CustomActivityIndicator";
import { keycloakService } from "../helpers/Auth/keycloak";
import { Colors } from "../helpers/consts/Colors";
import { useChatDetail } from "../hooks/chatHooks/useChatDetail";
import { useAppNavigation } from "../hooks/useAppNavigation";

export function ChatDetailScreen() {
  const activeUserId = useMemo(() => keycloakService.getCurrentUserId()!, []);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { goBack, navigate } = useAppNavigation();
  const route = useRoute();
  const { chatId } = route.params as {
    chatId: string;
  };

  const { t } = useTranslation();
  const {
    user,
    isChatLoading,
    messages,
    chat,
    fetchMessages,
    removeChats,
    removeMessage,
    sendMessage,
  } = useChatDetail({
    chatId,
  });
  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
    setMenuVisible(false);
  };

  const removeChatHandler = async () => {
    await removeChats([chatId]);
    setShowSnackbar(true);
    goBack();
    setMenuVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <CustomActivityIndicator visible={isChatLoading} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => goBack()}>
            <Ionicons name="chevron-back-outline" size={26} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigate("ViewUserProfileScreen", {
                userId: chat!.matchedUser.id,
              });
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
            <Menu.Item onPress={showDialog} title={t("Delete Chat")} />
          </Menu>
          <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
              <Dialog.Title>{t("Delete Chat")}</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  {t("Delete chat with {{firstName}} {{lastName}}", {
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                  })}
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
          renderItem={({ item }) => (
            <MessageBubble item={item} onRemove={removeMessage} />
          )}
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
          }}
        >
          {t("Chat removed")}
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
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
