import {
  useInfiniteQuery,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { ChatService } from "../services/ChatService";
import { ImageService } from "../services/ImageService";
import { useMemo } from "react";
import { UserImageListDto } from "../models/Images/UserImageListDto";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ImageConsts";
import { QueryKeys } from "../helpers/consts/QueryKeys";

const PAGE_SIZE = 10;

export function useChat() {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: QueryKeys.chats.base,
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

  const idsToPreload = useMemo(
    () => data?.pages[data.pages.length - 1]?.data.map((u) => u.id) ?? [],
    [data],
  );

  useQueries({
    queries: useMemo(
      () =>
        (idsToPreload ?? []).map((id) => ({
          queryKey: QueryKeys.user.userImages(id),
          queryFn: () => ImageService.GetUserPictures(id),
          staleTime: MINIO_PRESIGNEDURL_EXPİRY,
          enabled: !!idsToPreload && idsToPreload.length > 0,
        })),
      [idsToPreload],
    ),
  });

  const getImages = (userId: string): UserImageListDto[] => {
    return (
      queryClient.getQueryData<UserImageListDto[]>(
        QueryKeys.user.userImages(userId),
      ) ?? []
    );
  };

  return {
    chats,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    getImages,
  };
}
