import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { QueryKeys } from "../helpers/consts/QueryKeys";
import { ChatListModel } from "../models/Chats/ChatListModel";
import { MessageListModel } from "../models/Messages/MessageListModel";
import { ChatService } from "../services/ChatService";
import { chatSignalRService } from "../signalr/ChatSignalRService";
import { useAppNavigation } from "./useAppNavigation";

export function useRootStack() {
  const { navigate } = useAppNavigation();
  const queryClient = useQueryClient();

  const unsubMsg = chatSignalRService.subscribeToMessages(
    async (newMessage) => {
      queryClient.setQueryData(QueryKeys.chats.base, (oldData: any) => {
        if (!oldData) return oldData;

        let updatedChat: ChatListModel | null = null;

        const newPages = oldData.pages.map((page: any) => {
          const filteredData = page.data.filter((c: ChatListModel) => {
            if (c.id === newMessage.chatId) {
              updatedChat = {
                ...c,
                messages: [newMessage],
                unreadCount: c.unreadCount ? c.unreadCount + 1 : 1,
              };
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

      Toast.show({
        type: "success",
        text1: newMessage.sender.firstName + " " + newMessage.sender.lastName,
        text2: newMessage.content,
        position: "top",
        visibilityTime: 5000,
        text1Style: {
          fontSize: 16,
        },
        text2Style: {
          fontSize: 15,
        },
        onPress: () => {
          Toast.hide();
          navigate("ChatDetailScreen", {
            chatId: newMessage.chatId,
          });
        },
      });
    },
  );

  const unsubDelMsg = chatSignalRService.subscribeToDeleteMessage((message) => {
    queryClient
      .invalidateQueries({
        queryKey: QueryKeys.chats.detail(message.chatId),
      })
      .then(async () => {
        var updatedChat = await queryClient.fetchQuery({
          queryKey: QueryKeys.chats.detail(message.chatId),
          queryFn: () => ChatService.GetChatById(message.chatId),
        });
        queryClient.setQueryData(QueryKeys.chats.base, (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((c: ChatListModel) => {
                if (c.id == message.chatId) {
                  return { ...updatedChat };
                }
                return c;
              }),
            })),
          };
        });
      });

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
  });

  const unsubDelChat = chatSignalRService.subscribeToDeleteChat(
    (chats: ChatListModel[]) => {
      queryClient.setQueryData(QueryKeys.chats.base, (oldData: any) => {
        if (!oldData) return oldData;
        var chatIds = chats.map((c) => c.id);

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

  useEffect(() => {
    return () => {
      unsubMsg();
      unsubDelMsg();
      unsubDelChat();
    };
  });
}
