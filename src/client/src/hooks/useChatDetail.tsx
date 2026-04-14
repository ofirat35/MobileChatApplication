import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ImageService } from "../services/ImageService";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../helpers/consts/ImageConsts";
import { UserService } from "../services/UserService";
import { QueryKeys } from "../helpers/consts/QueryKeys";
import { ChatService } from "../services/ChatService";
import { MessageCreateModel } from "../models/Messages/MessageCreateModel";
import { useEffect, useMemo } from "react";
import { chatSignalRService } from "../signalr/ChatSignalRService";
import { MessageListModel } from "../models/Messages/MessageListModel";
import { keycloakService } from "../helpers/Auth/keycloak";
import { ChatListModel } from "../models/Chats/ChatListModel";

const PAGE_SIZE = 20;
type useChatDetailProps = {
  userId: string;
  chatId: string;
};
export function useChatDetail({ userId, chatId }: useChatDetailProps) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: QueryKeys.user.detail(userId),
    queryFn: () => UserService.getUserById(userId),
  });

  const { data: userImages } = useQuery({
    queryKey: QueryKeys.user.userImages(userId),
    queryFn: () => ImageService.GetUserPictures(userId),
    staleTime: MINIO_PRESIGNEDURL_EXPİRY,
  });

  const { data: messagesList, fetchNextPage } = useInfiniteQuery({
    queryKey: QueryKeys.chats.detail(chatId),
    queryFn: ({ pageParam }) => {
      return ChatService.GetChatById(chatId, pageParam, PAGE_SIZE);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNext ? pages.length + 1 : undefined;
    },
  });

  const messages = useMemo(() => {
    return messagesList?.pages.flatMap((page) => page.data) ?? [];
  }, [messagesList]);

  const sendMessageMutation = useMutation({
    mutationFn: ({ message }: { message: MessageCreateModel }) =>
      chatSignalRService.sendMessageAsync(message),
    onSuccess: (data: MessageListModel) => {
      if (data) {
        queryClient.setQueryData(
          QueryKeys.chats.detail(data.chatId),
          (oldData: any) => {
            if (!oldData) return oldData;
            const messageExists = oldData.pages.some((page: any) =>
              page.data.some((m: MessageListModel) => m.id === data.id),
            );

            if (messageExists) return oldData;

            const newPages = [...oldData.pages];

            newPages[0] = {
              ...newPages[0],
              data: [data, ...newPages[0].data],
            };

            return {
              ...oldData,
              pages: newPages,
            };
          },
        );

        queryClient.setQueryData(QueryKeys.chats.base, (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((c: ChatListModel) => {
                if (c.id === data.chatId) {
                  return { ...c, messages: [data] };
                }
                console.log(c);
                return c;
              }),
            })),
          };
        });
      }
    },
  });

  const setMessagesAsReadMutation = useMutation({
    mutationFn: ({ chatId }: { chatId: string }) =>
      ChatService.SetMessagesAsRead(chatId),
    onSuccess: (data, { chatId }) => {
      const userId = keycloakService.getCurrentUserId()!;

      queryClient.setQueryData(
        QueryKeys.chats.detail(chatId),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((msg: MessageListModel) => {
                if (msg.senderId !== userId && !msg.isRead) {
                  return { ...msg, isRead: true };
                }
                return msg;
              }),
            })),
          };
        },
      );

      queryClient.setQueryData(QueryKeys.chats.base, (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((c: ChatListModel) => {
              if (c.id === chatId) {
                return { ...c, unreadCount: 0 };
              }
              return c;
            }),
          })),
        };
      });
    },
  });

  const removeMessageMutation = useMutation({
    mutationFn: ({ messageId }: { messageId: string }) =>
      chatSignalRService.RemoveMessageAsync(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.interest.base,
      });
    },
  });

  const removeChatMutation = useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      ChatService.RemoveChat(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.interest.base,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.chats.base,
      });
    },
  });

  useEffect(() => {
    setMessagesAsReadMutation.mutateAsync({ chatId });

    const unsubMsg = chatSignalRService.subscribeToMessages((newMessage) => {
      queryClient.setQueryData(
        QueryKeys.chats.detail(chatId),
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
    });

    // const unsubDel = chatSignalRService.subscribeToDelete((messageId) => {
    //   queryClient.setQueryData(
    //     QueryKeys.chats.detail(userId),
    //     (oldData: any) => {
    //       if (!oldData) return oldData;

    //       return {
    //         ...oldData,
    //         pages: oldData.pages.map((page: any) => ({
    //           ...page,
    //           data: page.data.filter(
    //             (msg: MessageListModel) => msg.id !== messageId,
    //           ),
    //         })),
    //       };
    //     },
    //   );
    // });

    return () => {
      unsubMsg();
      // unsubDel();
    };
  }, [queryClient, chatId]);

  return {
    user: { ...user, images: userImages },
    isLoading,
    messages,
    fetchMessages: fetchNextPage,
    removeChat: async (userId: string) =>
      await removeChatMutation.mutateAsync({ userId }),
    sendMessage: async (message: MessageCreateModel) =>
      await sendMessageMutation.mutateAsync({ message }),
    removeMessage: async (messageId: string) =>
      await removeMessageMutation.mutateAsync({ messageId }),
  };
}
