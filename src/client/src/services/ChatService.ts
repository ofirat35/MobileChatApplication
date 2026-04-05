import { PaginatedItemsViewModel } from "../models/PaginatedItemsViewModel";
import { AppUserListModel } from "../models/Users/AppUserListModel";
import { api } from "./api";

export const ChatService: IChatService = {
  async GetChats(page: number, pageCount: number) {
    try {
      var result = await api.get<PaginatedItemsViewModel<AppUserListModel>>(
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
};

interface IChatService {
  GetChats(
    page: number,
    pageCount: number,
  ): Promise<PaginatedItemsViewModel<AppUserListModel>>;
}
