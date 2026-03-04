import { View } from "react-native";
import React from "react";
import { ChatList } from "../components/chats/ChatList";

export function ChatScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ChatList></ChatList>
    </View>
  );
}
