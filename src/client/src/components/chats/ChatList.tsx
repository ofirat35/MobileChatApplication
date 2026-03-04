import { View, FlatList } from "react-native";
import React from "react";
import { ChatBox } from "./ChatBox";
import { Text } from "react-native-paper";
import { useChat } from "../../hooks/useChat";

export function ChatList() {
  const { chats, loading, handleLoadMore, imagesMap } = useChat();

  return (
    <View style={{ flex: 1 }}>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <ChatBox userProfile={item} profilePicture={imagesMap[item.id]} />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text variant="bodyLarge">
            {loading ? "Loading..." : "Chat not found!"}
          </Text>
        </View>
      )}
    </View>
  );
}
