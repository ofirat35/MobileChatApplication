import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import React, { useRef, useState } from "react";
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
import { useChatDetail } from "../hooks/useChatDetail";
import { CustomActivityIndicator } from "../components/shared/CustomActivityIndicator";
import { keycloakService } from "../helpers/Auth/keycloak";
import { MessageListModel } from "../models/Messages/MessageListModel";

const { height } = Dimensions.get("screen");
export function ChatDetailScreen() {
  const [activeUserId, setActiveUserId] = useState(
    keycloakService.getCurrentUserId()!,
  );
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
  const {
    user,
    isLoading,
    messages,
    hasNextPage,
    fetchMessages,
    removeChat,
    sendMessage,
  } = useChatDetail({
    userId,
    chatId,
  });
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => {
    setVisible(true);
    setMenuVisible(false);
  };
  const hideDialog = () => setVisible(false);

  const removeChatHandler = async () => {
    var isSuccess = await removeChat(userId);
    setShowSnackbar(true);
    setIsDeleteSuccess(isSuccess);
    if (isSuccess) {
      goBack();
    }
    setMenuVisible(false);
  };
  const renderMessage = ({ item }: { item: MessageListModel }) => {
    const isMine = item.senderId === activeUserId;

    return (
      <View
        style={[
          styles.messageRow,
          isMine ? styles.myMessageRow : styles.theirMessageRow,
        ]}
      >
        <View
          style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}
        >
          <Text style={{ color: isMine ? "#fff" : "#000", fontSize: 15 }}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) return;

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
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Remove Chat</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  Remove chat with: {user?.firstName} {user?.lastName}
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>{t("Cancel")}</Button>
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
          renderItem={renderMessage}
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
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  messageRow: {
    marginBottom: 10,
    flexDirection: "row",
    width: "100%",
  },
  myMessageRow: {
    justifyContent: "flex-end",
  },
  theirMessageRow: {
    justifyContent: "flex-start",
  },
  bubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: "80%",
    borderWidth: 0.5,
    borderColor: Colors.border.gray,
  },
  myBubble: {
    backgroundColor: "#1D9E75",
    borderBottomRightRadius: 2,
  },
  theirBubble: {
    backgroundColor: Colors.background.lightgray,
    borderBottomLeftRadius: 2,
  },
});

function MessageInput({
  onSend,
  isSending,
}: {
  onSend: (message: string) => void;
  isSending?: boolean;
}) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (!message.trim() || isSending) return;
    onSend(message.trim());
    setMessage("");
  };

  return (
    <View style={messageStyles.container}>
      <TextInput
        ref={inputRef}
        style={messageStyles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        placeholderTextColor={Colors.text.gray}
        multiline
        maxLength={500}
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity
        style={[
          messageStyles.sendBtn,
          !message.trim() && messageStyles.sendBtnDisabled,
        ]}
        onPress={handleSend}
        disabled={!message.trim() || isSending}
      >
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const messageStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border.gray,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.border.gray,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1D9E75",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.35,
  },
});
