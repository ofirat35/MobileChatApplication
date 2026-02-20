import { View, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ChatBox } from "./ChatBox";
import { AppUserProfile } from "../../models/Users/AppUserProfile";
import { PaginatedRequestModel } from "../../models/PaginationRequestModel";
import { ChatService } from "../../services/ChatService";
import { UserImageListDto } from "../../models/Images/UserImageListDto";
import { ImageService } from "../../services/ImageService";
import { useNavigation } from "@react-navigation/native";

export function ChatList() {
  const [imagesMap, setImagesMap] = useState<
    Record<string, UserImageListDto | null>
  >({});
  const [chats, setChats] = useState<AppUserProfile[]>([]);
  const [pagination, setPagination] = useState<PaginatedRequestModel>({
    page: 1,
    pageSize: 10,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchChats = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const chats = await ChatService.GetChats(
        pagination.page,
        pagination.pageSize,
      );
      setHasMore(chats.hasNext);
      if (chats.data.length === 0) {
        setLoadingMore(false);
        return;
      }
      setChats((prev) => [...prev, ...chats.data]);
      getUserImages(chats.data.map((_) => _.id));
      setPagination((prev) => ({
        ...prev,
        page: pagination.page + 1,
      }));
    } catch (error) {
      console.error("Error fetching interests:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const getUserImages = (ids: string[]) => {
    for (const id of ids) {
      if (id && !imagesMap[id]) {
        ImageService.GetUserProfilePicture(id).then((image) => {
          setImagesMap((prev) => ({
            ...prev,
            [id]: image,
          }));
        });
      }
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <View>
      <FlatList
        data={chats}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onEndReached={() => fetchChats()}
        onEndReachedThreshold={0.4}
        renderItem={({ item }) => (
          <ChatBox userProfile={item} profilePicture={imagesMap[item.id]} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
