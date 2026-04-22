import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { AppState } from "react-native";
import { keycloakService } from "../../helpers/Auth/keycloak";
import { MINIO_PRESIGNEDURL_EXPİRY } from "../../helpers/consts/ExpiryTimeConsts";
import { QueryKeys } from "../../helpers/consts/QueryKeys";
import { ChatListModel } from "../../models/Chats/ChatListModel";
import { MessageCreateModel } from "../../models/Messages/MessageCreateModel";
import { MessageListModel } from "../../models/Messages/MessageListModel";
import { ChatService } from "../../services/ChatService";
import { ImageService } from "../../services/ImageService";
import { UserService } from "../../services/UserService";
import { chatSignalRService } from "../../signalr/ChatSignalRService";

const PAGE_SIZE = 20;
type useChatDetailProps = {
  chatId: string;
};
export function useChatDetail({ chatId }: useChatDetailProps) {
  const queryClient = useQueryClient();
  const { data: chat, isLoading: isChatLoading } = useQuery({
    queryKey: QueryKeys.chats.detail(chatId),
    queryFn: () => ChatService.GetChatById(chatId),
  });

  const userId = chat?.matchedUser?.id;

  const { data: user } = useQuery({
    queryKey: QueryKeys.user.detail(userId!),
    queryFn: () => UserService.getUserById(userId!),
    enabled: !!userId,
  });

  const { data: userImages } = useQuery({
    queryKey: QueryKeys.user.userImages(userId!),
    queryFn: () => ImageService.GetUserPictures(userId!),
    staleTime: MINIO_PRESIGNEDURL_EXPİRY,
    enabled: !!userId,
  });

  const { data: messagesList, fetchNextPage } = useInfiniteQuery({
    queryKey: QueryKeys.messages.withChatId(chatId),
    queryFn: ({ pageParam }) => {
      return ChatService.GetMessagesByChatId(chatId, pageParam, PAGE_SIZE);
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
          QueryKeys.messages.withChatId(data.chatId),
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

          let updatedChat: ChatListModel | null = null;

          const newPages = oldData.pages.map((page: any) => {
            const filteredData = page.data.filter((c: ChatListModel) => {
              if (c.id === data.chatId) {
                updatedChat = { ...c, messages: [data] };
                return false;
              }
              return true;
            });

            return { ...page, data: filteredData };
          });

          if (updatedChat) {
            newPages[0].data = [updatedChat, ...newPages[0].data];
          }

          return {
            ...oldData,
            pages: newPages,
          };
        });
      }
    },
  });

  const setMessagesAsReadMutation = useMutation({
    mutationFn: () => ChatService.SetMessagesAsRead(chatId),
    onSuccess: () => {
      const userId = keycloakService.getCurrentUserId()!;

      queryClient.setQueryData(
        QueryKeys.messages.withChatId(chatId),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((msg: MessageListModel) => {
                if (msg.sender.id !== userId && !msg.isRead) {
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
    onSuccess: async (data, { messageId }) => {
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.chats.detail(chatId),
      });
      var result = await queryClient.fetchQuery({
        queryKey: QueryKeys.chats.detail(chatId),
        queryFn: () => ChatService.GetChatById(chatId),
      });

      queryClient.setQueryData(QueryKeys.chats.base, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((c: ChatListModel) => {
              if (c.id == chatId) {
                return { ...result };
              }
              return c;
            }),
          })),
        };
      });

      queryClient.setQueryData(
        QueryKeys.messages.withChatId(chatId),
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter(
                (msg: MessageListModel) => msg.id !== messageId,
              ),
            })),
          };
        },
      );
    },
  });

  const removeChatMutation = useMutation({
    mutationFn: ({ chatIds }: { chatIds: string[] }) =>
      chatSignalRService.RemoveChatsAsync(chatIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.messages.withChatId(chatId),
      });

      queryClient.setQueryData(QueryKeys.chats.base, (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((c: ChatListModel) => c.id !== chatId),
          })),
        };
      });
    },
  });

  useEffect(() => {
    setMessagesAsReadMutation.mutateAsync();
    const subscription = AppState.addEventListener("change", () => {
      setMessagesAsReadMutation.mutateAsync();
    });

    return () => {
      setMessagesAsReadMutation.mutateAsync();
      subscription.remove();
    };
  }, [queryClient, chat]);

  return {
    user: { ...user, images: userImages },
    isChatLoading,
    messages,
    chat,
    fetchMessages: fetchNextPage,
    removeChats: async (chatIds: string[]) =>
      await removeChatMutation.mutateAsync({ chatIds }),
    sendMessage: async (message: MessageCreateModel) =>
      await sendMessageMutation.mutateAsync({ message }),
    removeMessage: async (messageId: string) =>
      await removeMessageMutation.mutateAsync({ messageId }),
  };
}
