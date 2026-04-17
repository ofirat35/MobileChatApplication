import {
  useInfiniteQuery,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { ChatService } from "../services/ChatService";
import { ImageService } from "../services/ImageService";
import { useEffect, useMemo } from "react";
import { UserImageListDto } from "../models/Images/UserImageListDto";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ExpiryTimeConsts";
import { QueryKeys } from "../helpers/consts/QueryKeys";
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
        queryClient.setQueryData(QueryKeys.chats.base, (oldData: any) => {
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
                    unreadCount: chat.unreadCount + 1,
                  };
                }
                return chat;
              }),
            })),
          };
        });

        queryClient.setQueryData(
          QueryKeys.messages.withChatId(newMessage.chatId),
          (oldData: any) => {
            if (!oldData) return oldData;
            const messageExists = oldData.pages.some((page: any) =>
              page.data.some((m: any) => m.id === newMessage.id),
            );

            if (messageExists) return oldData;

            const newPages = [...oldData.pages];

            newPages[0] = {
              ...newPages[0],
              data: [newMessage, ...newPages[0].data],
            };

            return {
              ...oldData,
              pages: newPages,
            };
          },
        );
      },
    );

    const unsubDelMsg = chatSignalRService.subscribeToDeleteMessage(
      (message) => {
        queryClient.invalidateQueries({ queryKey: QueryKeys.chats.base });

        queryClient.setQueryData(
          QueryKeys.messages.withChatId(message.chatId),
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: page.data.filter(
                  (msg: MessageListModel) => msg.id !== message.id,
                ),
              })),
            };
          },
        );
      },
    );

    const unsubDelChat = chatSignalRService.subscribeToDeleteChat(
      (chats: ChatListModel[]) => {
        console.log("Received chat deletion for chat IDs:", chats);
        queryClient.setQueryData(QueryKeys.chats.base, (oldData: any) => {
          if (!oldData) return oldData;
          var chatIds = chats.map((c) => c.id);
          console.log(chatIds);

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
      },
    );

    return () => {
      unsubMsg();
      unsubDelMsg();
      unsubDelChat();
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
