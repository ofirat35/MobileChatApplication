import * as React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Modal, Portal, Text } from "react-native-paper";
import { Colors } from "../../helpers/consts/Colors";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { ChatListModel } from "../../models/Chats/ChatListModel";

interface MatchModalProps {
  visible: boolean;
  chat: ChatListModel | null;
  onClose: () => void;
}

export const MatchOccuredModal = ({
  visible,
  chat,
  onClose,
}: MatchModalProps) => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigation();

  if (!chat) return null;
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          <Text variant="headlineLarge" style={styles.title}>
            {t("It's a Match!")}
          </Text>

          <Text variant="bodyLarge" style={styles.subtitle}>
            {t("You and {{firstName}} have liked each other.", {
              firstName: chat.matchedUser.firstName,
            })}
          </Text>

          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={120}
              source={
                chat.matchedUser.images.length > 0
                  ? {
                      uri: chat.matchedUser.images?.[0]?.imagePath,
                    }
                  : require("../../../assets/img/img1.png")
              }
            />
          </View>

          <Button
            mode="contained"
            onPress={onClose}
            style={styles.button}
            buttonColor="#FF5252"
          >
            {t("Keep Swiping")}
          </Button>

          <Button
            mode="contained"
            style={[
              styles.button,
              { borderWidth: 1, borderColor: Colors.border.gray },
            ]}
            onPress={() => {
              onClose();
              navigate("ChatDetailScreen", {
                chatId: chat.id,
                userId: chat.matchedUser.id,
              });
            }}
            textColor={"#FF5252"}
            buttonColor={Colors.background.white}
          >
            {t("Send a Message")}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 450,
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    color: "#FF5252",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 25,
    color: "#444",
  },
  avatarContainer: {
    marginBottom: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  button: {
    width: "100%",
    paddingVertical: 4,
    marginBottom: 10,
  },
});
