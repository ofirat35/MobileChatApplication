import { ChatListModel } from "../models/Chats/ChatListModel";
import { MessageCreateModel } from "../models/Messages/MessageCreateModel";
import { MessageListModel } from "../models/Messages/MessageListModel";
import { PaginatedItemsViewModel } from "../models/PaginatedItemsViewModel";
import { api } from "./api";

export const ChatService: IChatService = {
  async GetChats(page: number, pageCount: number) {
    try {
      var result = await api.get<PaginatedItemsViewModel<ChatListModel>>(
        "/chats/getChats",
        {
          params: {
            page: page,
            pageCount: pageCount,
          },
        },
      );
      return result.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
  async GetMessagesByChatId(chatId: string, page: number, pageSize: number) {
    try {
      var result = await api.get<PaginatedItemsViewModel<MessageListModel>>(
        "/chats/getMessagesByChatId",
        {
          params: {
            chatId,
            page,
            pageSize,
          },
        },
      );
      return result.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
  async ChatExistsWithUser(userId: string): Promise<ChatListModel | null> {
    try {
      const response = await api.get<ChatListModel | null>(
        `/chats/chatExistsWithUser`,
        {
          params: {
            userId,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("hata:", error);
      console.error("api error----:", error);
      throw error;
    }
  },
  async RemoveChat(chatId: string): Promise<boolean> {
    try {
      const response = await api.delete<boolean>(`/chats/removeChat`, {
        params: {
          chatId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
  async SetMessagesAsRead(chatId: string): Promise<boolean> {
    try {
      const response = await api.post<boolean>(
        `/chats/setMessagesAsRead`,
        null,
        {
          params: {
            chatId,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
};

interface IChatService {
  GetChats(
    page: number,
    pageCount: number,
  ): Promise<PaginatedItemsViewModel<ChatListModel>>;
  GetMessagesByChatId(
    chatId: string,
    page: number,
    pageSize: number,
  ): Promise<PaginatedItemsViewModel<MessageListModel>>;
  ChatExistsWithUser(userId: string): Promise<ChatListModel | null>;
  RemoveChat(chatId: string): Promise<boolean>;
  SetMessagesAsRead(chatId: string): Promise<boolean>;
}
