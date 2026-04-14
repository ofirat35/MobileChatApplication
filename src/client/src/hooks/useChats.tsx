import {
  useInfiniteQuery,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { ChatService } from "../services/ChatService";
import { ImageService } from "../services/ImageService";
import { useEffect, useMemo } from "react";
import { UserImageListDto } from "../models/Images/UserImageListDto";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ImageConsts";
import { QueryKeys } from "../helpers/consts/QueryKeys";
import { AuthStorage } from "../helpers/Auth/auth-storage";
import { keycloakService } from "../helpers/Auth/keycloak";
import { chatSignalRService } from "../signalr/ChatSignalRService";
import { ChatListModel } from "../models/Chats/ChatListModel";
import { MessageListModel } from "../models/Messages/MessageListModel";

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

  useEffect(() => {
    const unsubMsg = chatSignalRService.subscribeToMessages(
      (newMessage: MessageListModel) => {
        queryClient.setQueryData(
          QueryKeys.chats.base, // This is usually your Chat List (Inbox)
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: page.data.map((chat: ChatListModel) => {
                  if (chat.id === newMessage.chatId) {
                    return {
                      ...chat,
                      messages: [newMessage],
                    };
                  }
                  return chat;
                }),
              })),
            };
          },
        );
      },
    );

    // const unsubDel = chatSignalRService.subscribeToDelete((chatId: string) => {
    //   queryClient.setQueryData(QueryKeys.chats.base, (oldData: any) => {
    //     if (!oldData) return oldData;

    //     return {
    //       ...oldData,
    //       pages: oldData.pages.map((page: any) => ({
    //         ...page,
    //         data: page.data.filter((chat: ChatListModel) => chat.id !== chatId),
    //       })),
    //     };
    //   });
    // });

    return () => {
      unsubMsg();
      // unsubDel();
    };
  }, []);

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
