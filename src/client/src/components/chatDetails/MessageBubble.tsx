import { View, Text, StyleSheet, Pressable } from "react-native";
import { MessageListModel } from "../../models/Messages/MessageListModel";
import { Colors } from "../../helpers/consts/Colors";
import { useMemo, useState } from "react";
import { keycloakService } from "../../helpers/Auth/keycloak";
import { Button, Divider, Menu, PaperProvider } from "react-native-paper";
import { useTranslation } from "react-i18next";

export const MessageBubble = ({
  item,
  onRemove,
}: {
  item: MessageListModel;
  onRemove?: (messageId: string) => void;
}) => {
  const activeUserId = useMemo(() => keycloakService.getCurrentUserId()!, []);
  const isMine = item.sender.id === activeUserId;
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.messageRow,
        isMine ? styles.myMessageRow : styles.theirMessageRow,
      ]}
    >
      <Menu
        contentStyle={{
          width: 55,
          borderRadius: 20,
          margin: 2,
        }}
        key={item.id}
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable
            onLongPress={() => {
              isMine && setVisible(true);
            }}
            style={[
              styles.bubble,
              isMine ? styles.myBubble : styles.theirBubble,
            ]}
          >
            <Text style={{ color: isMine ? "#fff" : "#000", fontSize: 15 }}>
              {item.content}
            </Text>
          </Pressable>
        }
      >
        <Menu.Item
          style={{
            height: 17,
            width: 55,
            minWidth: 55,
            justifyContent: "center",
            alignItems: "center",
          }}
          titleStyle={{
            fontSize: 11,
            textAlign: "center",
          }}
          onPress={() =>
            isMine && onRemove && onRemove(item.id) && setVisible(false)
          }
          title={t("Delete")}
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
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
