import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { keycloakService } from "../../helpers/Auth/keycloak";
import { Colors } from "../../helpers/consts/Colors";
import { useChats } from "../../hooks/chatHooks/useChats";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { ChatBox } from "./ChatBox";

export function ChatList() {
  const { t } = useTranslation();
  const [activeUserId, setActiveUserId] = useState(
    keycloakService.getCurrentUserId(),
  );
  const { chats, isLoading, removeChats, fetchNextPage, getImages } =
    useChats();
  useEffect(() => {
    setActiveUserId(keycloakService.getCurrentUserId());
  }, [activeUserId]);
  const [selectedChats, setSelectedChats] = useState<Map<string, boolean>>(
    new Map(),
  );
  const navigation = useAppNavigation();

  const handleLongPress = (chatId: string) => {
    setSelectedChats((prev) => new Map(prev).set(chatId, true));
  };

  const handlePress = (chatId: string) => {
    if (selectedChats.size > 0 && !selectedChats.get(chatId)) {
      setSelectedChats((prev) => new Map(prev).set(chatId, true));
      return;
    }
    if (selectedChats.get(chatId)) {
      setSelectedChats((prev) => {
        prev.delete(chatId);
        return new Map(prev);
      });
      return;
    }

    navigation.navigate("ChatDetailScreen", { chatId });
  };

  const isAnyChatSelected = useMemo(
    () => selectedChats.size > 0,
    [selectedChats],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isAnyChatSelected ? (
          <TouchableOpacity
            onPress={() => {
              const selectedChatIds = Array.from(selectedChats.entries()).map(
                ([chatId]) => chatId,
              );
              removeChats(selectedChatIds);
              setSelectedChats(new Map());
            }}
          >
            <FontAwesome
              name="trash"
              size={24}
              color="white"
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, selectedChats]);

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
              onPress={() => handlePress(item.id)}
              onLongPress={() => handleLongPress(item.id)}
            >
              <ChatBox
                customStyles={
                  selectedChats.get(item.id) && {
                    backgroundColor: Colors.background.gray,
                  }
                }
                chat={item}
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
          {isLoading ? (
            <Text variant="bodyLarge">{t("Loading")}</Text>
          ) : (
            <Button
              mode="contained"
              style={styles.navigateBtn}
              contentStyle={{ height: 50 }}
              onPress={() =>
                navigation.navigate("RootTabNavigationScreen", {
                  screen: "DiscoverTab",
                  params: {
                    screen: "DiscoverScreen",
                  },
                })
              }
            >
              {t("Start to find a match")}
            </Button>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navigateBtn: {
    borderRadius: 12,
    marginBottom: 40,
  },
});
