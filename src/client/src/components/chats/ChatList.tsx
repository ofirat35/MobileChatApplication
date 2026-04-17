import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ChatBox } from "./ChatBox";
import { Text } from "react-native-paper";
import { useChats } from "../../hooks/useChats";
import { keycloakService } from "../../helpers/Auth/keycloak";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { Colors } from "../../helpers/consts/Colors";

export function ChatList() {
  const [activeUserId, setActiveUserId] = useState(
    keycloakService.getCurrentUserId(),
  );
  const { chats, isLoading, fetchNextPage, getImages } = useChats();
  useEffect(() => {
    setActiveUserId(keycloakService.getCurrentUserId());
  }, [activeUserId]);

  const [isVisualLongPress, setIsVisualLongPress] = useState<
    Map<string, boolean>
  >(new Map());
  const { navigate } = useAppNavigation();

  const handleLongPress = (chatId: string) => {
    setIsVisualLongPress((prev) => new Map(prev).set(chatId, true));
  };

  const handlePress = (userId: string, chatId: string) => {
    if (isVisualLongPress.get(chatId)) {
      setIsVisualLongPress((prev) => new Map(prev).set(chatId, false));
      return;
    }

    navigate("ChatDetailScreen", { userId, chatId });
  };

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
            <TouchableOpacity
              onPress={() => handlePress(item.matchedUser.id, item.id)}
              onLongPress={() => handleLongPress(item.id)}
            >
              <ChatBox
                customStyles={
                  isVisualLongPress.get(item.id) && {
                    backgroundColor: Colors.background.gray,
                  }
                }
                lastMessage={item.messages[0] ?? ""}
                unreadCount={item.unreadCount}
                userProfile={item.matchedUser}
                profilePicture={getImages(item.matchedUser.id)[0]}
              />
            </TouchableOpacity>
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
