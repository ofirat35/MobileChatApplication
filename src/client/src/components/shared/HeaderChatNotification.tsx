import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Badge } from "react-native-paper";

export function HeaderNotification() {
  //   const hasUnread = useSelector((state: RootState) => state.chat.hasUnreadMessages);

  return (
    <View>
      <Ionicons name="notifications-outline" size={24} />
      <Badge
        size={10}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "red",
        }}
      />
    </View>
  );
}
