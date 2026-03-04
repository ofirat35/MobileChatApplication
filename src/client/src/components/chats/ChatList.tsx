import { View, FlatList } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ChatBox } from "./ChatBox";
import { AppUserProfile } from "../../models/Users/AppUserProfile";
import { ChatService } from "../../services/ChatService";
import { UserImageListDto } from "../../models/Images/UserImageListDto";
import { ImageService } from "../../services/ImageService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { resetChatVersion } from "../../features/slices/chatSlice";
import { Text } from "react-native-paper";

const PAGE_SIZE = 10;

export function ChatList() {
  const [imagesMap, setImagesMap] = useState<
    Record<string, UserImageListDto | null>
  >({});
  const [chats, setChats] = useState<AppUserProfile[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);
  const count = useSelector((state: RootState) => state.chat.chatVersion);
  const dispatch = useDispatch();

  useEffect(() => {
    loadChats(1, true);

    return () => {
      dispatch(resetChatVersion());
    };
  }, []);

  useEffect(() => {
    if (count > 0) {
      handleRefresh();
    }
  }, [count]);

  const loadChats = async (targetPage: number, overwrite = false) => {
    if (loadingRef.current || (!hasMore && !overwrite)) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await ChatService.GetChats(targetPage, PAGE_SIZE);
      setHasMore(response.hasNext);

      if (overwrite) {
        setChats(response.data);
      } else {
        setChats((prev) => [...prev, ...response.data]);
      }

      getUserImages(response.data.map((u) => u.id));

      setPage(targetPage + 1);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setHasMore(true);
    setPage(1);
    await loadChats(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingRef.current && hasMore) {
      loadChats(page);
    }
  };

  const getUserImages = (ids: string[]) => {
    for (const id of ids) {
      if (id && !imagesMap[id]) {
        ImageService.GetUserProfilePicture(id).then((image) => {
          setImagesMap((prev) => ({ ...prev, [id]: image }));
        });
      }
    }
  };

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
