import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaginatedRequestModel } from "../models/PaginationRequestModel";
import { resetChatVersion } from "../features/slices/chatSlice";
import { ImageService } from "../services/ImageService";
import { ChatService } from "../services/ChatService";
import { UserImageListDto } from "../models/Images/UserImageListDto";
import { AppUserProfile } from "../models/Users/AppUserProfile";
import { RootState } from "../app/store";

const PAGE_SİZE = 10;

export function useChat() {
  const [imagesMap, setImagesMap] = useState<
    Record<string, UserImageListDto | null>
  >({});
  const [chats, setChats] = useState<AppUserProfile[]>([]);
  const [pagination, setPagination] = useState<PaginatedRequestModel>({
    page: 1,
    pageSize: PAGE_SİZE,
  });
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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
    if (loading || (!hasMore && !overwrite)) return;

    setLoading(true);

    try {
      const response = await ChatService.GetChats(
        targetPage,
        pagination.pageSize,
      );
      setHasMore(response.hasNext);

      if (overwrite) {
        setPagination({ page: 1, pageSize: 10 });
        setChats(response.data);
      } else {
        setChats((prev) => [...prev, ...response.data]);
      }

      getUserImages(response.data.map((u) => u.id));

      setPagination({ ...pagination, page: targetPage + 1 });
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setHasMore(true);
    setPagination({ page: 1, pageSize: PAGE_SİZE });
    await loadChats(1, true);
  };

  const handleLoadMore = () => {
    loadChats(pagination.pageSize);
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

  return {
    chats,
    loading,
    loadChats,
    handleRefresh,
    handleLoadMore,
    imagesMap,
  };
}
