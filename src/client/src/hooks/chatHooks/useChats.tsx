import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../../helpers/consts/ExpiryTimeConsts";
import { QueryKeys } from "../../helpers/consts/QueryKeys";
import { ChatListModel } from "../../models/Chats/ChatListModel";
import { UserImageListDto } from "../../models/Images/UserImageListDto";
import { ChatService } from "../../services/ChatService";
import { ImageService } from "../../services/ImageService";
import { chatSignalRService } from "../../signalr/ChatSignalRService";

const PAGE_SIZE = 10;

export function useChats() {
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

  const idsToPreload = useMemo(() => {
    return (
      data?.pages[data.pages.length - 1]?.data.map((u) => u.matchedUser.id) ??
      []
    );
  }, [data]);

  useQueries({
    queries: useMemo(
      () =>
        (idsToPreload ?? []).map((id) => ({
          queryKey: QueryKeys.user.userImages(id),
          queryFn: () => ImageService.GetUserPictures(id),
          staleTime: MINIO_PRESIGNEDURL_EXPİRY,
          enabled: !!idsToPreload && idsToPreload.length > 0,
        })),
      [data],
    ),
  });

  const getImages = (userId: string): UserImageListDto[] => {
    return (
      queryClient.getQueryData<UserImageListDto[]>(
        QueryKeys.user.userImages(userId),
      ) ?? []
    );
  };

  const removeChatMutation = useMutation({
    mutationFn: ({ chatIds }: { chatIds: string[] }) =>
      chatSignalRService.RemoveChatsAsync(chatIds),
    onSuccess: (data, { chatIds }) => {
      queryClient.setQueryData(QueryKeys.chats.base, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter(
              (chat: ChatListModel) => !chatIds.includes(chat.id),
            ),
          })),
        };
      });

      chatIds.forEach((chatId) => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.messages.withChatId(chatId),
        });
        queryClient.invalidateQueries({
          queryKey: QueryKeys.chats.detail(chatId),
        });
      });
    },
  });

  return {
    chats,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    removeChats: async (chatIds: string[]) =>
      await removeChatMutation.mutateAsync({ chatIds }),
    fetchNextPage,
    refetch,
    getImages,
  };
}
