import { View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { ChatBox } from "./ChatBox";
import { Text } from "react-native-paper";
import { useChats } from "../../hooks/useChats";
import { keycloakService } from "../../helpers/Auth/keycloak";

export function ChatList() {
  const [activeUserId, setActiveUserId] = useState(
    keycloakService.getCurrentUserId(),
  );
  const { chats, isLoading, fetchNextPage, getImages } = useChats();

  useEffect(() => {
    setActiveUserId(keycloakService.getCurrentUserId());
  }, [activeUserId]);
  return (
    <View style={{ flex: 1 }}>
      {chats && chats.length > 0 ? (
        <FlatList
          data={chats}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          onEndReached={() => fetchNextPage()}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <ChatBox
              lastMessage={item.messages[0] ?? ""}
              userProfile={item.matchedUser}
              chatId={item.id}
              profilePicture={getImages(item.matchedUser.id)[0]}
            />
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
            {isLoading ? "Loading..." : "Chat not found!"}
          </Text>
        </View>
      )}
    </View>
  );
}
