import dayjs from "dayjs";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import { Badge, Text } from "react-native-paper";
import { Colors } from "../../helpers/consts/Colors";
import { ChatListModel } from "../../models/Chats/ChatListModel";
import { UserImageListDto } from "../../models/Images/UserImageListDto";

type ChatBoxProps = {
  profilePicture: UserImageListDto | undefined;
  chat: ChatListModel;
  customStyles?: any;
};
export function ChatBox({ profilePicture, chat, customStyles }: ChatBoxProps) {
  const { t, i18n } = useTranslation();
  const lastMessageDate = (date: string) => {
    if (!date) return "";
    const mDate = dayjs(date);
    const now = dayjs();
    if (mDate.isSame(now, "day")) {
      return mDate.format("HH:mm");
    }

    if (mDate.isSame(now.subtract(1, "day"), "day")) {
      return t("Yesterday");
    }

    return mDate.locale(i18n.language).format("DD MMMM YYYY");
  };

  console.log(chat);

  return (
    <View style={[styles.container, customStyles]}>
      <View style={{ marginRight: 20 }}>
        {profilePicture ? (
          <Image
            resizeMode="stretch"
            source={{ uri: profilePicture.imagePath }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
          ></Image>
        ) : (
          <Image
            resizeMode="stretch"
            source={require("../../../assets/img/img1.png")}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
          ></Image>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            {chat.matchedUser.firstName} {chat.matchedUser.lastName}
          </Text>
          {chat.unreadCount > 0 && (
            <Badge>{chat.unreadCount > 9 ? "9+" : chat.unreadCount}</Badge>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Text variant="labelLarge" style={{ color: Colors.text.gray }}>
            {chat.messages.length > 0 && chat.messages[0].content.length > 30
              ? chat.messages[0].content?.substring(0, 30) + "..."
              : chat.messages[0].content}
          </Text>
          <Text variant="labelLarge" style={{ color: Colors.text.gray }}>
            {lastMessageDate(chat.messages[0].createdDate)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.background.white,
    paddingHorizontal: 15,
    height: 90,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.gray,
  },
});
