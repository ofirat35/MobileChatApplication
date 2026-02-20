import { PaginatedItemsViewModel } from "../models/PaginatedItemsViewModel";
import { AppUserProfile } from "../models/Users/AppUserProfile";
import { api } from "./api";

export const ChatService: IChatService = {
  async GetChats(page: number, pageCount: number) {
    try {
      var result = await api.get<PaginatedItemsViewModel<AppUserProfile>>(
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
  ): Promise<PaginatedItemsViewModel<AppUserProfile>>;
}
