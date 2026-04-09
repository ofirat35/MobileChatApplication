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
  async GetChatById(chatId: string, page: number, pageSize: number) {
    try {
      var result = await api.get<PaginatedItemsViewModel<MessageListModel>>(
        "/chats/getChatById",
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
  async ChatExists(userId: string): Promise<boolean> {
    try {
      const response = await api.get<boolean>(`/chats/chatExists`, {
        params: {
          userId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
  async SendMessage(message: MessageCreateModel): Promise<boolean> {
    try {
      const response = await api.post<boolean>(`/chats/sendMessage`, message);
      return response.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
  async RemoveMessage(messageId: string): Promise<boolean> {
    try {
      const response = await api.delete<boolean>(`/chats/removeMessage`, {
        params: {
          messageId: messageId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
  async RemoveChat(userId: string): Promise<boolean> {
    try {
      const response = await api.delete<boolean>(`/chats/removeChat`, {
        params: {
          userId,
        },
      });
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
  GetChatById(
    chatId: string,
    page: number,
    pageSize: number,
  ): Promise<PaginatedItemsViewModel<MessageListModel>>;
  SendMessage(message: MessageCreateModel): Promise<boolean>;
  ChatExists(userId: string): Promise<boolean>;
  RemoveMessage(messageId: string): Promise<boolean>;
  RemoveChat(userId: string): Promise<boolean>;
}
