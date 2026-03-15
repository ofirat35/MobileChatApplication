import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "../services/ChatService";
import { ImageService } from "../services/ImageService";
import { useEffect, useMemo } from "react";
import { UserImageListDto } from "../models/Images/UserImageListDto";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ImageConsts";

const PAGE_SIZE = 10;

export function useChat() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["chats"],
    queryFn: ({ pageParam }) => ChatService.GetChats(pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNext ? pages.length + 1 : undefined;
    },
  });

  const chats = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  useEffect(() => {
    if (chats.length === 0) return;

    const idsToPreload = data?.pages[data.pages.length - 1].data.map(
      (u) => u.id,
    );

    idsToPreload!.forEach((id) => {
      queryClient.prefetchQuery({
        queryKey: ["user-profile-image", id],
        queryFn: () => ImageService.GetUserProfilePicture(id),
        staleTime: MINIO_PRESIGNEDURL_EXPİRY,
      });
    });
  }, [chats]);

  const getProfileImage = (userId: string): UserImageListDto | undefined => {
    return queryClient.getQueryData<UserImageListDto>([
      "user-profile-image",
      userId,
    ]);
  };

  return {
    chats,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    getProfileImage,
  };
}
