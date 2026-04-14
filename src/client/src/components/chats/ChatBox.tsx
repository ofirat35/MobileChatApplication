import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Colors } from "../../helpers/consts/Colors";
import { AppUserListModel } from "../../models/Users/AppUserListModel";
import { UserImageListDto } from "../../models/Images/UserImageListDto";
import { Badge, Text } from "react-native-paper";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { MessageListModel } from "../../models/Messages/MessageListModel";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

type ChatBoxProps = {
  userProfile: AppUserListModel;
  profilePicture: UserImageListDto | undefined;
  chatId: string;
  lastMessage: MessageListModel;
  unreadCount: number;
};
export function ChatBox({
  userProfile,
  profilePicture,
  chatId,
  lastMessage,
  unreadCount,
}: ChatBoxProps) {
  const { t, i18n } = useTranslation();

  const { navigate } = useAppNavigation();
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
  return (
    <TouchableOpacity
      onPress={() =>
        navigate("ChatDetailScreen", { userId: userProfile.id, chatId: chatId })
      }
      style={styles.container}
    >
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
            {userProfile.firstName} {userProfile.lastName}
          </Text>
          {unreadCount > 0 && (
            <Badge>{unreadCount > 9 ? "9+" : unreadCount}</Badge>
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
            {lastMessage.content}
          </Text>
          <Text variant="labelLarge" style={{ color: Colors.text.gray }}>
            {lastMessageDate(lastMessage.createdDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
